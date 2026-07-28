<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AI\MistralService;
use App\Services\AI\ToolRegistry;
use App\Models\AIChatSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AIAssistantController extends Controller
{
    protected MistralService $mistral;
    protected ToolRegistry $toolRegistry;

    public function __construct(MistralService $mistral, ToolRegistry $toolRegistry)
    {
        $this->mistral = $mistral;
        $this->toolRegistry = $toolRegistry;
    }

    /**
     * Process user message and return AI response
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'context' => 'nullable|array',
            'conversation_history' => 'nullable|array',
            'session_id' => 'nullable|integer',
        ]);

        $message = $request->input('message');
        $context = $request->input('context', []);
        $history = $request->input('conversation_history', []);
        $sessionId = $request->input('session_id');

        // Build context from current page
        $context = $this->buildContext($context);

        try {
            // Add system prompt to history
            $messages = array_merge(
                [['role' => 'system', 'content' => $this->mistral->buildSystemPrompt($context)]],
                $history,
                [['role' => 'user', 'content' => $message]]
            );

            // Get available tools
            $tools = $this->toolRegistry->toGeminiFormat();

            // Call Mistral
            $response = $this->mistral->generateContent($messages, $tools);

            // Check if response contains a function call
            $functionCall = $this->mistral->extractFunctionCall($response);

            if ($functionCall) {
                $action = [
                    'action' => $functionCall['name'],
                    'parameters' => $functionCall['arguments'],
                    'explanation' => $this->mistral->extractContent($response),
                ];

                // Save to session
                $updatedMessages = array_merge($messages, [['role' => 'assistant', 'content' => $action['explanation']]]);
                $sessionId = $this->saveSession($sessionId, $updatedMessages, $context['language'] ?? 'en');

                return response()->json([
                    'type' => 'action',
                    'action' => $action,
                    'session_id' => $sessionId,
                    'requires_confirmation' => true,
                ]);
            }

            // Return text response
            $content = $this->mistral->extractContent($response);
            $updatedMessages = array_merge($messages, [['role' => 'assistant', 'content' => $content]]);
            $sessionId = $this->saveSession($sessionId, $updatedMessages, $context['language'] ?? 'en');

            return response()->json([
                'type' => 'answer',
                'response' => $content,
                'session_id' => $sessionId,
            ]);
        } catch (\Exception $e) {
            // Fallback to rule-based if Mistral fails
            $response = $this->processCommand($message, $context);
            $sessionId = $this->saveSession($sessionId, $history, $context['language'] ?? 'en');
            
            return response()->json([
                'type' => 'answer',
                'response' => $response['response'],
                'session_id' => $sessionId,
            ]);
        }
    }

    /**
     * Save or update chat session
     */
    protected function saveSession(?int $sessionId, array $messages, string $language): int
    {
        $userId = Auth::id();

        Log::info('saveSession called', [
            'sessionId' => $sessionId,
            'messageCount' => count($messages),
            'language' => $language,
        ]);

        if ($sessionId) {
            $session = AIChatSession::where('id', $sessionId)
                ->where('user_id', $userId)
                ->first();

            if ($session) {
                $session->update([
                    'messages' => $messages,
                    'language' => $language,
                    'title' => $this->generateSessionTitle($messages),
                ]);
                Log::info('Updated existing session', ['sessionId' => $sessionId]);
                return $session->id;
            }
        }

        // sessionId is null - user wants a new session, don't reuse active session
        // Deactivate all sessions first
        AIChatSession::where('user_id', $userId)->update(['is_active' => false]);

        // Only create new session if there are messages
        if (empty($messages)) {
            // Return null or 0 if no messages - don't create empty session
            Log::info('No messages, not creating session');
            return 0;
        }

        // Create new session
        $session = AIChatSession::create([
            'user_id' => $userId,
            'title' => $this->generateSessionTitle($messages),
            'messages' => $messages,
            'language' => $language,
            'is_active' => true,
        ]);

        Log::info('Created new session', ['sessionId' => $session->id, 'title' => $session->title]);
        return $session->id;
    }

    /**
     * Generate session title from first user message
     */
    protected function generateSessionTitle(array $messages): string
    {
        $firstUserMessage = collect($messages)->firstWhere('role', 'user');
        if ($firstUserMessage) {
            $content = $firstUserMessage['content'];
            // Clean up the content for better title
            $title = preg_replace('/[^a-zA-Z0-9\s]/', '', $content);
            $title = trim($title);
            if (strlen($title) > 40) {
                $title = substr($title, 0, 40) . '...';
            }
            return $title ?: 'New Chat';
        }
        return 'New Chat';
    }

    /**
     * Get all chat sessions for current user
     */
    public function sessions()
    {
        $userId = Auth::id();
        $sessions = AIChatSession::where('user_id', $userId)
            ->orderBy('updated_at', 'desc')
            ->get(['id', 'title', 'messages', 'updated_at', 'is_active']);

        return response()->json($sessions);
    }

    /**
     * Load a specific chat session
     */
    public function loadSession(Request $request)
    {
        $request->validate([
            'session_id' => 'required|integer',
        ]);

        $userId = Auth::id();
        $session = AIChatSession::where('id', $request->session_id)
            ->where('user_id', $userId)
            ->first();

        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        // Set as active
        AIChatSession::where('user_id', $userId)->update(['is_active' => false]);
        $session->update(['is_active' => true]);

        return response()->json([
            'session_id' => $session->id,
            'messages' => $session->messages,
            'language' => $session->language,
        ]);
    }

    /**
     * Create a new chat session (removed - sessions auto-created on first message)
     * Kept for backward compatibility but returns empty response
     */
    public function newSession()
    {
        // Return empty response - sessions are auto-created on first chat message
        return response()->json([
            'session_id' => null,
            'messages' => [],
            'language' => 'en',
        ]);
    }

    /**
     * Delete a chat session
     */
    public function deleteSession(Request $request)
    {
        $request->validate([
            'session_id' => 'required|integer',
        ]);

        $userId = Auth::id();
        $session = AIChatSession::where('id', $request->session_id)
            ->where('user_id', $userId)
            ->first();

        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        $session->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Update session title
     */
    public function updateSession(Request $request)
    {
        $request->validate([
            'session_id' => 'required|integer',
            'title' => 'required|string|max:255',
        ]);

        $userId = Auth::id();
        $session = AIChatSession::where('id', $request->session_id)
            ->where('user_id', $userId)
            ->first();

        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        $session->update(['title' => $request->title]);

        return response()->json(['success' => true]);
    }

    /**
     * Process command using rule-based AI
     */
    protected function processCommand(string $message, array $context): array
    {
        $messageLower = strtolower($message);
        $currentPath = $context['current_page'] ?? '';
        $language = $context['language'] ?? 'en';

        // Coupon commands
        if (str_contains($messageLower, 'coupon') && str_contains($messageLower, 'create')) {
            $discount = $this->extractDiscount($message);
            return [
                'type' => 'action',
                'action' => [
                    'action' => 'create_coupon',
                    'parameters' => [
                        'code' => $this->generateCouponCode(),
                        'discount_type' => $discount['type'],
                        'discount_value' => $discount['value'],
                        'description' => 'Created via AI Assistant',
                    ],
                    'explanation' => $language === 'id' 
                        ? " akan membuat kupon diskon {$discount['type']} dengan kode {$this->generateCouponCode()}."
                        : "I'll create a {$discount['type']} discount coupon with code {$this->generateCouponCode()}."
                ],
                'requires_confirmation' => true,
            ];
        }

        // Campaign commands
        if (str_contains($messageLower, 'campaign') && str_contains($messageLower, 'create')) {
            $campaignName = $this->extractCampaignName($message);
            return [
                'type' => 'action',
                'action' => [
                    'action' => 'create_campaign',
                    'parameters' => [
                        'name' => $campaignName,
                        'campaign_type' => 'homepage',
                        'start_date' => now()->format('Y-m-d'),
                        'end_date' => now()->addDays(30)->format('Y-m-d'),
                        'description' => 'Created via AI Assistant',
                    ],
                    'explanation' => $language === 'id'
                        ? "Saya akan membuat kampanye bernama '{$campaignName}' mulai hari ini."
                        : "I'll create a campaign called '{$campaignName}' starting today."
                ],
                'requires_confirmation' => true,
            ];
        }

        // SEO commands
        if (str_contains($messageLower, 'seo') || str_contains($messageLower, 'meta')) {
            $pageType = $this->extractPageType($message, $currentPath);
            return [
                'type' => 'action',
                'action' => [
                    'action' => 'generate_seo',
                    'parameters' => [
                        'page_type' => $pageType,
                        'meta_title' => $this->generateMetaTitle($pageType, $language),
                        'meta_description' => $this->generateMetaDescription($pageType, $language),
                        'keywords' => $this->generateKeywords($pageType, $language),
                    ],
                    'explanation' => $language === 'id'
                        ? "Saya akan generate SEO metadata untuk {$pageType}."
                        : "I'll generate SEO metadata for {$pageType}."
                ],
                'requires_confirmation' => true,
            ];
        }

        // Statistics/Analytics commands
        if (str_contains($messageLower, 'statistic') || str_contains($messageLower, 'sales') || str_contains($messageLower, 'analytics')) {
            return [
                'type' => 'answer',
                'response' => $this->getStatisticsResponse($messageLower, $language),
            ];
        }

        // What should I do today
        if (str_contains($messageLower, 'what should i do') || str_contains($messageLower, 'today')) {
            return [
                'type' => 'answer',
                'response' => $this->getDailyTasks($language),
            ];
        }

        // Pending orders
        if (str_contains($messageLower, 'pending') && str_contains($messageLower, 'order')) {
            return [
                'type' => 'answer',
                'response' => $language === 'id'
                    ? "Anda memiliki 5 pesanan tertunda yang perlu diperhatikan. Saya sarankan memprosesnya dalam 24 jam untuk menjaga kepuasan pelanggan."
                    : "You have 5 pending orders that need attention. I recommend processing them within 24 hours to maintain customer satisfaction.",
            ];
        }

        // Low stock
        if (str_contains($messageLower, 'low stock') || str_contains($messageLower, 'restock')) {
            return [
                'type' => 'answer',
                'response' => $language === 'id'
                    ? "3 produk stoknya menipis:\n- Summer Dress (5 unit)\n- Casual Shirt (3 unit)\n- Sneakers (2 unit)\n\nSaya sarankan restock item ini segera."
                    : "3 products are running low on stock:\n- Summer Dress (5 units)\n- Casual Shirt (3 units)\n- Sneakers (2 units)\n\nI recommend restocking these items soon.",
            ];
        }

        // Dashboard knowledge questions
        if (str_contains($messageLower, 'how') || str_contains($messageLower, 'what is') || str_contains($messageLower, 'explain') || str_contains($messageLower, 'help')) {
            return [
                'type' => 'answer',
                'response' => $this->getDashboardKnowledge($messageLower, $currentPath, $language),
            ];
        }

        // Default response - more flexible for general questions
        return [
            'type' => 'answer',
            'response' => $language === 'id'
                ? "Saya bisa membantu Anda dengan:\n\n**Aksi:**\n• Buat kupon (misal: 'Buat kupon diskon 20%')\n• Buat kampanye (misal: 'Buat kampanye Summer Sale')\n• Generate SEO (misal: 'Generate SEO untuk homepage')\n\n**Informasi:**\n• Tampilkan statistik (misal: 'Tampilkan penjualan hari ini')\n• Cek pesanan tertunda\n• Cek item stok rendah\n• Jelaskan fitur dashboard\n• Cara menggunakan modul\n\n**Tanyakan saya:**\n• 'Bagaimana cara membuat produk?'\n• 'Apa itu modul pemasaran?'\n• 'Bagaimana kupon bekerja?'\n• 'Jelaskan proses pesanan'\n• 'Apa yang harus saya lakukan hari ini?'\n\n**Catatan:** Saat ini saya menggunakan sistem rule-based karena API AI eksternal tidak tersedia. Saya bisa menjawab pertanyaan tentang dashboard dan mengeksekusi aksi tertentu.\n\nApa yang ingin Anda ketahui?"
                : "I can help you with:\n\n**Actions:**\n• Create coupons (e.g., 'Create a 20% discount coupon')\n• Create campaigns (e.g., 'Create a Summer Sale campaign')\n• Generate SEO (e.g., 'Generate SEO for homepage')\n\n**Information:**\n• Show statistics (e.g., 'Show today's sales')\n• Check pending orders\n• Check low stock items\n• Explain dashboard features\n• How to use modules\n\n**Ask me:**\n• 'How do I create a product?'\n• 'What is the marketing module?'\n• 'How do coupons work?'\n• 'Explain the order process'\n• 'What should I do today?'\n\n**Note:** I'm currently using a rule-based system as external AI APIs are unavailable. I can answer questions about the dashboard and execute specific actions.\n\nWhat would you like to know?",
        ];
    }

    /**
     * Extract discount from message
     */
    protected function extractDiscount(string $message): array
    {
        $messageLower = strtolower($message);
        
        // Check for percentage
        if (preg_match('/(\d+)%/', $message, $matches)) {
            return [
                'type' => 'percentage',
                'value' => (int)$matches[1],
            ];
        }
        
        // Check for fixed amount
        if (preg_match('/(\d+)/', $message, $matches)) {
            return [
                'type' => 'fixed',
                'value' => (int)$matches[1] * 1000, // Convert to reasonable amount
            ];
        }
        
        // Default
        return [
            'type' => 'percentage',
            'value' => 10,
        ];
    }

    /**
     * Generate coupon code
     */
    protected function generateCouponCode(): string
    {
        return strtoupper('SAVE' . rand(10, 99));
    }

    /**
     * Extract campaign name from message
     */
    protected function extractCampaignName(string $message): string
    {
        if (preg_match('/create.*?campaign.*?called\s+(.+)/i', $message, $matches)) {
            return trim($matches[1]);
        }
        
        if (preg_match('/create\s+(.+?)\s+campaign/i', $message, $matches)) {
            return trim($matches[1]);
        }
        
        return 'New Campaign ' . date('M Y');
    }

    /**
     * Extract page type from message or context
     */
    protected function extractPageType(string $message, string $currentPath): string
    {
        $messageLower = strtolower($message);
        
        if (str_contains($messageLower, 'homepage')) return 'homepage';
        if (str_contains($messageLower, 'product')) return 'products';
        if (str_contains($messageLower, 'categor')) return 'categories';
        if (str_contains($messageLower, 'collection')) return 'collections';
        
        // Infer from current path
        if (str_contains($currentPath, '/products')) return 'products';
        if (str_contains($currentPath, '/categories')) return 'categories';
        if (str_contains($currentPath, '/collections')) return 'collections';
        
        return 'homepage';
    }

    /**
     * Generate meta title
     */
    protected function generateMetaTitle(string $pageType, string $language = 'en'): string
    {
        $titles = [
            'en' => [
                'homepage' => 'Vesto Fashion - Modern Clothing for Everyone',
                'products' => 'Shop Our Collection - Trending Fashion',
                'categories' => 'Browse Categories - Find Your Style',
                'collections' => 'Exclusive Collections - Limited Edition',
            ],
            'id' => [
                'homepage' => 'Vesto Fashion - Pakaian Modern untuk Semua',
                'products' => 'Belanja Koleksi Kami - Fashion Trendi',
                'categories' => 'Jelajahi Kategori - Temukan Gaya Anda',
                'collections' => 'Koleksi Eksklusif - Edisi Terbatas',
            ],
        ];
        
        return $titles[$language][$pageType] ?? ($titles['en'][$pageType] ?? 'Vesto Fashion');
    }

    /**
     * Generate meta description
     */
    protected function generateMetaDescription(string $pageType, string $language = 'en'): string
    {
        $descriptions = [
            'en' => [
                'homepage' => 'Discover the latest fashion trends at Vesto. Shop modern clothing, accessories, and more with free shipping on orders over $50.',
                'products' => 'Explore our curated collection of trending fashion items. From casual wear to formal attire, find your perfect style.',
                'categories' => 'Browse our wide range of fashion categories. From clothing to accessories, find everything you need to complete your look.',
                'collections' => 'Shop our exclusive collections featuring limited edition pieces. Stand out with unique designs and premium quality.',
            ],
            'id' => [
                'homepage' => 'Temukan tren fashion terbaru di Vesto. Belanja pakaian modern, aksesoris, dan lainnya dengan gratis ongkir untuk pesanan di atas Rp500.000.',
                'products' => 'Jelajahi koleksi fashion trendi kami. Dari pakaian kasual hingga formal, temukan gaya sempurna Anda.',
                'categories' => 'Jelajahi berbagai kategori fashion kami. Dari pakaian hingga aksesoris, temukan semua yang Anda butuhkan untuk melengkapi tampilan.',
                'collections' => 'Belanja koleksi eksklusif kami dengan edisi terbatas. Tampil beda dengan desain unik dan kualitas premium.',
            ],
        ];
        
        return $descriptions[$language][$pageType] ?? ($descriptions['en'][$pageType] ?? 'Shop the latest fashion at Vesto.');
    }

    /**
     * Generate keywords
     */
    protected function generateKeywords(string $pageType, string $language = 'en'): string
    {
        $keywords = [
            'en' => [
                'homepage' => 'fashion, clothing, modern style, trendy, online shopping, apparel',
                'products' => 'fashion products, clothing items, trendy clothes, fashion accessories, online fashion',
                'categories' => 'fashion categories, clothing types, style categories, fashion collections, apparel types',
                'collections' => 'exclusive collections, limited edition fashion, premium clothing, designer fashion, luxury apparel',
            ],
            'id' => [
                'homepage' => 'fashion, pakaian, gaya modern, trendi, belanja online, apparel',
                'products' => 'produk fashion, item pakaian, pakaian trendi, aksesoris fashion, fashion online',
                'categories' => 'kategori fashion, jenis pakaian, kategori gaya, koleksi fashion, jenis apparel',
                'collections' => 'koleksi eksklusif, fashion edisi terbatas, pakaian premium, fashion desainer, apparel mewah',
            ],
        ];
        
        return $keywords[$language][$pageType] ?? ($keywords['en'][$pageType] ?? 'fashion, clothing, style');
    }

    /**
     * Get statistics response
     */
    protected function getStatisticsResponse(string $message, string $language = 'en'): string
    {
        if (str_contains($message, 'today')) {
            return $language === 'id'
                ? "Statistik Hari Ini:\n\n• Total Penjualan: Rp 2.500.000\n• Pesanan: 15\n• Pendapatan: Rp 3.200.000\n• Pengunjung: 234\n• Tingkat Konversi: 6.4%"
                : "Today's Statistics:\n\n• Total Sales: Rp 2.500.000\n• Orders: 15\n• Revenue: Rp 3.200.000\n• Visitors: 234\n• Conversion Rate: 6.4%";
        }
        
        if (str_contains($message, 'week')) {
            return $language === 'id'
                ? "Statistik Minggu Ini:\n\n• Total Penjualan: Rp 15.000.000\n• Pesanan: 89\n• Pendapatan: Rp 18.500.000\n• Pengunjung: 1.456\n• Tingkat Konversi: 6.1%"
                : "This Week's Statistics:\n\n• Total Sales: Rp 15.000.000\n• Orders: 89\n• Revenue: Rp 18.500.000\n• Visitors: 1.456\n• Conversion Rate: 6.1%";
        }
        
        return $language === 'id'
            ? "Statistik Dasbor:\n\n• Total Penjualan: Rp 45.000.000\n• Total Pesanan: 245\n• Pendapatan: Rp 52.000.000\n• Kampanye Aktif: 3\n• Kupon Aktif: 8"
            : "Dashboard Statistics:\n\n• Total Sales: Rp 45.000.000\n• Total Orders: 245\n• Revenue: Rp 52.000.000\n• Active Campaigns: 3\n• Active Coupons: 8";
    }

    /**
     * Get daily tasks
     */
    protected function getDailyTasks(string $language = 'en'): string
    {
        return $language === 'id'
            ? "Berikut fokus Anda hari ini:\n\n📋 **Tugas Prioritas:**\n• Proses 5 pesanan tertunda\n• Restock item inventori rendah (3 produk)\n• Review performa kampanye\n• Respon pertanyaan pelanggan\n\n📊 **Analitik:**\n• Cek laporan penjualan hari ini\n• Monitor tingkat konversi\n• Review sumber traffic\n\n📈 **Pemasaran:**\n• Kampanye 'Summer Sale' berakhir dalam 3 hari\n• Kupon 'NEWUSER20' kadaluarsa besok\n• Pertimbangkan peluncuran kampanye baru"
            : "Here's what you should focus on today:\n\n📋 **Priority Tasks:**\n• Process 5 pending orders\n• Restock low inventory items (3 products)\n• Review campaign performance\n• Respond to customer inquiries\n\n📊 **Analytics:**\n• Check today's sales report\n• Monitor conversion rates\n• Review traffic sources\n\n📈 **Marketing:**\n• Campaign 'Summer Sale' ends in 3 days\n• Coupon 'NEWUSER20' expires tomorrow\n• Consider launching new campaign";
    }

    /**
     * Get dashboard knowledge base response
     */
    protected function getDashboardKnowledge(string $message, string $currentPath, string $language = 'en'): string
    {
        $messageLower = strtolower($message);

        // Products module
        if (str_contains($messageLower, 'product')) {
            return $this->getProductKnowledge($language);
        }

        // Orders module
        if (str_contains($messageLower, 'order')) {
            return $this->getOrderKnowledge($language);
        }

        // Marketing module
        if (str_contains($messageLower, 'marketing') || str_contains($messageLower, 'campaign') || str_contains($messageLower, 'coupon')) {
            return $this->getMarketingKnowledge($language);
        }

        // SEO module
        if (str_contains($messageLower, 'seo')) {
            return $this->getSeoKnowledge($language);
        }

        // Customers module
        if (str_contains($messageLower, 'customer')) {
            return $this->getCustomerKnowledge($language);
        }

        // Categories module
        if (str_contains($messageLower, 'categor')) {
            return $this->getCategoryKnowledge($language);
        }

        // Collections module
        if (str_contains($messageLower, 'collection')) {
            return $this->getCollectionKnowledge($language);
        }

        // Dashboard/Analytics
        if (str_contains($messageLower, 'dashboard') || str_contains($messageLower, 'analytic') || str_contains($messageLower, 'statistic')) {
            return $this->getDashboardKnowledgeBase($language);
        }

        // General help
        if (str_contains($messageLower, 'help') || str_contains($messageLower, 'overview')) {
            return $this->getOverview($language);
        }

        // Default
        return $this->getOverview($language);
    }

    /**
     * Get product module knowledge
     */
    protected function getProductKnowledge(string $language = 'en'): string
    {
        return $language === 'id'
            ? "**Modul Produk**\n\n**Tujuan:** Kelola katalog produk termasuk membuat, mengedit, dan mengorganisir produk.\n\n**Fitur Utama:**\n• **Buat Produk:** Tambah produk baru dengan nama, harga, deskripsi, gambar, varian, dan inventori\n• **Edit Produk:** Update detail produk, harga, stok, dan gambar\n• **Varian Produk:** Kelola ukuran, warna, dan opsi berbeda\n• **Gambar Produk:** Upload banyak gambar dengan dukungan galeri\n• **Tracking Inventori:** Monitor level stok dan set alert stok rendah\n• **Status Produk:** Set produk sebagai aktif, tidak aktif, atau draft\n\n**Cara Membuat Produk:**\n1. Pergi ke Produk → Buat\n2. Isi nama produk, harga, dan deskripsi\n3. Upload gambar produk\n4. Tambah varian (ukuran, warna, dll)\n5. Set inventori dan harga\n6. Pilih kategori produk\n7. Simpan produk\n\n**Best Practices:**\n• Gunakan gambar produk berkualitas tinggi\n• Tulis deskripsi detail\n• Jaga inventori akurat\n• Set harga kompetitif\n• Gunakan kategori relevan"
            : "**Products Module**\n\n**Purpose:** Manage your product catalog including creating, editing, and organizing products.\n\n**Key Features:**\n• **Create Products:** Add new products with name, price, description, images, variants, and inventory\n• **Edit Products:** Update product details, prices, stock, and images\n• **Product Variants:** Manage different sizes, colors, and options\n• **Product Images:** Upload multiple images with gallery support\n• **Inventory Tracking:** Monitor stock levels and set low stock alerts\n• **Product Status:** Set products as active, inactive, or draft\n\n**How to Create a Product:**\n1. Go to Products → Create\n2. Fill in product name, price, and description\n3. Upload product images\n4. Add variants (sizes, colors, etc.)\n5. Set inventory and pricing\n6. Choose product category\n7. Save the product\n\n**Best Practices:**\n• Use high-quality product images\n• Write detailed descriptions\n• Keep inventory accurate\n• Set competitive prices\n• Use relevant categories";
    }

    /**
     * Get order module knowledge
     */
    protected function getOrderKnowledge(string $language = 'en'): string
    {
        return $language === 'id'
            ? "**Modul Pesanan**\n\n**Tujuan:** Kelola pesanan pelanggan dari pembuatan hingga pengiriman.\n\n**Fitur Utama:**\n• **Daftar Pesanan:** Lihat semua pesanan dengan status, pelanggan, dan total\n• **Detail Pesanan:** Lihat informasi lengkap pesanan termasuk item dan pengiriman\n• **Status Pesanan:** Update status pesanan (pending, processing, shipped, delivered, cancelled)\n• **Manajemen Pesanan:** Proses refund, update info pengiriman, tambah catatan\n• **Cari Pesanan:** Cari pesanan berdasarkan pelanggan, status, atau tanggal\n\n**Alur Status Pesanan:**\n1. **Pending** - Pesanan diterima, menunggu pemrosesan\n2. **Processing** - Pesanan sedang disiapkan\n3. **Shipped** - Pesanan telah dikirim\n4. **Delivered** - Pesanan telah diterima pelanggan\n5. **Cancelled** - Pesanan telah dibatalkan\n\n**Cara Memproses Pesanan:**\n1. Pergi ke Pesanan → Pilih pesanan\n2. Review detail pesanan\n3. Update status ke 'Processing'\n4. Siapkan item untuk pengiriman\n5. Update status ke 'Shipped' dengan info tracking\n6. Update ke 'Delivered' saat diterima\n\n**Best Practices:**\n• Proses pesanan dengan cepat (dalam 24 jam)\n• Update pelanggan tentang status\n• Verifikasi alamat pengiriman\n• Tangani return secara profesional"
            : "**Orders Module**\n\n**Purpose:** Manage customer orders from creation to delivery.\n\n**Key Features:**\n• **Order List:** View all orders with status, customer, and total\n• **Order Details:** View complete order information including items and shipping\n• **Order Status:** Update order status (pending, processing, shipped, delivered, cancelled)\n• **Order Management:** Process refunds, update shipping info, add notes\n• **Order Search:** Find orders by customer, status, or date\n\n**Order Status Flow:**\n1. **Pending** - Order received, awaiting processing\n2. **Processing** - Order is being prepared\n3. **Shipped** - Order has been shipped\n4. **Delivered** - Order has been delivered to customer\n5. **Cancelled** - Order has been cancelled\n\n**How to Process an Order:**\n1. Go to Orders → Select order\n2. Review order details\n3. Update status to 'Processing'\n4. Prepare items for shipping\n5. Update status to 'Shipped' with tracking info\n6. Update to 'Delivered' when received\n\n**Best Practices:**\n• Process orders quickly (within 24 hours)\n• Keep customers updated on status\n• Verify shipping addresses\n• Handle returns professionally";
    }

    /**
     * Get marketing module knowledge
     */
    protected function getMarketingKnowledge(string $language = 'en'): string
    {
        return $language === 'id'
            ? "**Modul Pemasaran**\n\n**Tujuan:** Kelola kampanye promosi dan kupon diskon untuk meningkatkan penjualan.\n\n**Kampanye:**\n• Buat kampanye promosi untuk homepage, koleksi, kategori, atau produk\n• Set jadwal kampanye (tanggal mulai/akhir)\n• Tambah banner kampanye dan tombol call-to-action\n• Track performa kampanye (views, clicks, CTR)\n• Status kampanye: draft, scheduled, active, finished\n\n**Kupon:**\n• Buat kode diskon dengan berbagai tipe (persentase, jumlah tetap, gratis ongkir)\n• Set batas penggunaan dan tanggal kadaluarsa\n• Track penggunaan kupon dan performa\n• Status kupon: active, expired, scheduled, disabled\n\n**SEO:**\n• Kelola metadata SEO untuk homepage, produk, kategori, dan koleksi\n• Set meta titles, descriptions, dan keywords\n• Konfigurasi pengaturan auto-generation\n• Optimalkan untuk mesin pencari\n\n**Cara Membuat Kampanye:**\n1. Pergi ke Pemasaran → Kampanye → Buat\n2. Masukkan nama kampanye dan deskripsi\n3. Pilih tipe kampanye (homepage, collection, dll)\n4. Set tanggal mulai dan akhir\n5. Upload gambar banner\n6. Tambah teks tombol dan URL\n7. Simpan dan aktifkan\n\n**Cara Membuat Kupon:**\n1. Pergi ke Pemasaran → Kupon → Buat\n2. Masukkan kode kupon (misal: SUMMER20)\n3. Pilih tipe diskon (persentase, tetap, gratis ongkir)\n4. Set nilai diskon\n5. Set batas penggunaan dan kadaluarsa\n6. Simpan dan aktifkan"
            : "**Marketing Module**\n\n**Purpose:** Manage promotional campaigns and discount coupons to boost sales.\n\n**Campaigns:**\n• Create promotional campaigns for homepage, collections, categories, or products\n• Set campaign schedules (start/end dates)\n• Add campaign banners and call-to-action buttons\n• Track campaign performance (views, clicks, CTR)\n• Campaign status: draft, scheduled, active, finished\n\n**Coupons:**\n• Create discount codes with various types (percentage, fixed amount, free shipping)\n• Set usage limits and expiration dates\n• Track coupon usage and performance\n• Coupon status: active, expired, scheduled, disabled\n\n**SEO:**\n• Manage SEO metadata for homepage, products, categories, and collections\n• Set meta titles, descriptions, and keywords\n• Configure auto-generation settings\n• Optimize for search engines\n\n**How to Create a Campaign:**\n1. Go to Marketing → Campaigns → Create\n2. Enter campaign name and description\n3. Choose campaign type (homepage, collection, etc.)\n4. Set start and end dates\n5. Upload banner image\n6. Add button text and URL\n7. Save and activate\n\n**How to Create a Coupon:**\n1. Go to Marketing → Coupons → Create\n2. Enter coupon code (e.g., SUMMER20)\n3. Choose discount type (percentage, fixed, free shipping)\n4. Set discount value\n5. Set usage limit and expiration\n6. Save and activate";
    }

    /**
     * Get SEO module knowledge
     */
    protected function getSeoKnowledge(string $language = 'en'): string
    {
        return $language === 'id'
            ? "**Modul SEO**\n\n**Tujuan:** Optimalkan toko Anda untuk mesin pencari untuk meningkatkan visibilitas dan traffic.\n\n**Fitur Utama:**\n• **Meta Titles:** Set judul halaman untuk hasil pencarian\n• **Meta Descriptions:** Tulis deskripsi menarik untuk snippet pencarian\n• **Keywords:** Tambah keywords relevan untuk setiap halaman\n• **Auto-Generation:** Konfigurasi auto-generate konten SEO\n• **Tipe Halaman:** Homepage, Produk, Kategori, Koleksi\n\n**Best Practices SEO:**\n• Jaga meta titles di bawah 60 karakter\n• Jaga meta descriptions di bawah 160 karakter\n• Gunakan keywords secara natural\n• Tulis deskripsi unik untuk setiap halaman\n• Sertakan call-to-action di descriptions\n\n**Cara Optimalkan SEO:**\n1. Pergi ke Pemasaran → SEO\n2. Pilih tipe halaman (homepage, produk, dll)\n3. Masukkan meta title (max 60 chars)\n4. Masukkan meta description (max 160 chars)\n5. Tambah keywords relevan\n6. Simpan perubahan\n\n**Dampak:** SEO yang baik meningkatkan peringkat pencarian, meningkatkan traffic organik, dan meningkatkan conversion rate."
            : "**SEO Module**\n\n**Purpose:** Optimize your store for search engines to improve visibility and traffic.\n\n**Key Features:**\n• **Meta Titles:** Set page titles for search results\n• **Meta Descriptions:** Write compelling descriptions for search snippets\n• **Keywords:** Add relevant keywords for each page\n• **Auto-Generation:** Configure automatic SEO content generation\n• **Page Types:** Homepage, Products, Categories, Collections\n\n**SEO Best Practices:**\n• Keep meta titles under 60 characters\n• Keep meta descriptions under 160 characters\n• Use relevant keywords naturally\n• Write unique descriptions for each page\n• Include call-to-action in descriptions\n\n**How to Optimize SEO:**\n1. Go to Marketing → SEO\n2. Select page type (homepage, products, etc.)\n3. Enter meta title (max 60 chars)\n4. Enter meta description (max 160 chars)\n5. Add relevant keywords\n6. Save changes\n\n**Impact:** Good SEO improves search rankings, increases organic traffic, and boosts conversion rates.";
    }

    /**
     * Get customer module knowledge
     */
    protected function getCustomerKnowledge(string $language = 'en'): string
    {
        return $language === 'id'
            ? "**Modul Pelanggan**\n\n**Tujuan:** Kelola akun pelanggan dan grup pelanggan.\n\n**Fitur Utama:**\n• **Daftar Pelanggan:** Lihat semua pelanggan terdaftar\n• **Detail Pelanggan:** Lihat informasi pelanggan, pesanan, dan aktivitas\n• **Grup Pelanggan:** Buat dan kelola segmen pelanggan\n• **Status Pelanggan:** Aktif, tidak aktif, atau dibanned\n\n**Grup Pelanggan:**\n• Buat segmen berdasarkan behavior, lokasi, atau preferensi\n• Tawarkan diskon khusus ke grup tertentu\n• Target kampanye pemasaran ke grup\n\n**Cara Mengelola Pelanggan:**\n1. Pergi ke Pelanggan → Lihat semua pelanggan\n2. Klik pelanggan untuk melihat detail\n3. Update informasi pelanggan\n4. Tambah ke grup pelanggan\n5. Lihat riwayat pesanan pelanggan"
            : "**Customers Module**\n\n**Purpose:** Manage customer accounts and customer groups.\n\n**Key Features:**\n• **Customer List:** View all registered customers\n• **Customer Details:** View customer information, orders, and activity\n• **Customer Groups:** Create and manage customer segments\n• **Customer Status:** Active, inactive, or banned\n\n**Customer Groups:**\n• Create segments based on behavior, location, or preferences\n• Offer special discounts to specific groups\n• Target marketing campaigns to groups\n\n**How to Manage Customers:**\n1. Go to Customers → View all customers\n2. Click on customer to view details\n3. Update customer information\n4. Add to customer groups\n5. View customer order history";
    }

    /**
     * Get category module knowledge
     */
    protected function getCategoryKnowledge(string $language = 'en'): string
    {
        return $language === 'id'
            ? "**Modul Kategori**\n\n**Tujuan:** Organisir produk ke dalam kategori untuk navigasi dan SEO yang lebih baik.\n\n**Fitur Utama:**\n• **Tree Kategori:** Buat struktur kategori hierarkis\n• **Detail Kategori:** Nama, deskripsi, gambar, dan SEO\n• **Kategori Induk:** Buat sub-kategori di bawah kategori utama\n• **Status Kategori:** Aktif atau tidak aktif\n\n**Cara Membuat Kategori:**\n1. Pergi ke Kategori → Buat\n2. Masukkan nama kategori dan deskripsi\n3. Upload gambar kategori\n4. Set kategori induk jika membuat sub-kategori\n5. Konfigurasi pengaturan SEO\n6. Simpan dan aktifkan\n\n**Best Practices:**\n• Jaga struktur kategori sederhana dan logis\n• Gunakan nama deskriptif\n• Tambah gambar kategori\n• Optimalkan SEO kategori"
            : "**Categories Module**\n\n**Purpose:** Organize products into categories for better navigation and SEO.\n\n**Key Features:**\n• **Category Tree:** Create hierarchical category structure\n• **Category Details:** Name, description, image, and SEO\n• **Parent Categories:** Create sub-categories under main categories\n• **Category Status:** Active or inactive\n\n**How to Create Categories:**\n1. Go to Categories → Create\n2. Enter category name and description\n3. Upload category image\n4. Set parent category if creating sub-category\n5. Configure SEO settings\n6. Save and activate\n\n**Best Practices:**\n• Keep category structure simple and logical\n• Use descriptive names\n• Add category images\n• Optimize category SEO";
    }

    /**
     * Get collection module knowledge
     */
    protected function getCollectionKnowledge(string $language = 'en'): string
    {
        return $language === 'id'
            ? "**Modul Koleksi**\n\n**Tujuan:** Buat koleksi produk kurasi untuk pemasaran dan tampilan featured.\n\n**Fitur Utama:**\n• **Koleksi Manual:** Pilih produk manual untuk koleksi\n• **Koleksi Smart:** Auto-populate berdasarkan rules\n• **Tampilan Koleksi:** Featured di homepage dan halaman lain\n• **SEO Koleksi:** Optimalkan halaman koleksi untuk pencarian\n\n**Tipe Koleksi:**\n• **Manual:** Pilih produk spesifik\n• **Smart:** Auto-populate berdasarkan harga, kategori, tags, dll\n\n**Cara Membuat Koleksi:**\n1. Pergi ke Koleksi → Buat\n2. Masukkan nama koleksi dan deskripsi\n3. Pilih tipe koleksi (manual atau smart)\n4. Tambah produk atau set rules\n5. Upload gambar koleksi\n6. Konfigurasi pengaturan tampilan\n7. Simpan dan aktifkan"
            : "**Collections Module**\n\n**Purpose:** Create curated product collections for marketing and featured displays.\n\n**Key Features:**\n• **Manual Collections:** Hand-pick products for collections\n• **Smart Collections:** Auto-populate based on rules\n• **Collection Display:** Featured on homepage and other pages\n• **Collection SEO:** Optimize collection pages for search\n\n**Collection Types:**\n• **Manual:** Select specific products\n• **Smart:** Auto-populate based on price, category, tags, etc.\n\n**How to Create Collections:**\n1. Go to Collections → Create\n2. Enter collection name and description\n3. Choose collection type (manual or smart)\n4. Add products or set rules\n5. Upload collection image\n6. Configure display settings\n7. Save and activate";
    }

    /**
     * Get dashboard knowledge base
     */
    protected function getDashboardKnowledgeBase(string $language = 'en'): string
    {
        return $language === 'id'
            ? "**Dasbor & Analitik**\n\n**Tujuan:** Ikhtisar performa toko dengan metrik utama dan insights.\n\n**Metrik Utama:**\n• **Total Penjualan:** Pendapatan dari semua pesanan\n• **Total Pesanan:** Jumlah pesanan yang ditempatkan\n• **Pendapatan:** Total pendapatan setelah refund\n• **Kampanye Aktif:** Jumlah kampanye yang berjalan\n• **Kupon Aktif:** Jumlah kupon yang tersedia\n• **Tingkat Konversi:** Persentase pengunjung yang membeli\n\n**Fitur Analitik:**\n• **Statistik Real-time:** Update data live\n• **Filter Rentang Tanggal:** Lihat data per hari, minggu, bulan, atau rentang custom\n• **Grafik Performa:** Representasi visual tren\n• **Produk Teratas:** Item terlaris\n• **Pesanan Terbaru:** Pesanan pelanggan terbaru\n\n**Cara Menggunakan Dasbor:**\n1. Pergi ke Dasbor\n2. Lihat metrik utama di atas\n3. Gunakan filter tanggal untuk analisis periode spesifik\n4. Klik metrik untuk tampilan detail\n5. Review grafik dan chart untuk tren\n\n**Best Practices:**\n• Cek dasbor harian untuk performa\n• Monitor tingkat konversi\n• Track produk terlaris\n• Identifikasi tren dan pola"
            : "**Dashboard & Analytics**\n\n**Purpose:** Overview of store performance with key metrics and insights.\n\n**Key Metrics:**\n• **Total Sales:** Revenue from all orders\n• **Total Orders:** Number of orders placed\n• **Revenue:** Total income after refunds\n• **Active Campaigns:** Number of running campaigns\n• **Active Coupons:** Number of available coupons\n• **Conversion Rate:** Percentage of visitors who purchase\n\n**Analytics Features:**\n• **Real-time Statistics:** Live data updates\n• **Date Range Filtering:** View data by day, week, month, or custom range\n• **Performance Charts:** Visual representation of trends\n• **Top Products:** Best-selling items\n• **Recent Orders:** Latest customer orders\n\n**How to Use Dashboard:**\n1. Go to Dashboard\n2. View key metrics at top\n3. Use date filters to analyze specific periods\n4. Click on metrics for detailed views\n5. Review charts and graphs for trends\n\n**Best Practices:**\n• Check dashboard daily for performance\n• Monitor conversion rates\n• Track top-performing products\n• Identify trends and patterns";
    }

    /**
     * Get overview
     */
    protected function getOverview(string $language = 'en'): string
    {
        return $language === 'id'
            ? "**Ikhtisar Dasbor Admin Vesto**\n\nDasbor Admin Vesto adalah sistem manajemen e-commerce komprehensif dengan modul berikut:\n\n**📦 Katalog:**\n• Produk - Kelola katalog produk\n• Kategori - Organisir produk ke kategori\n• Koleksi - Buat koleksi produk kurasi\n• Atribut - Definisikan atribut produk\n• Varian - Kelola variasi produk\n\n**🛒 Pesanan:**\n• Manajemen Pesanan - Proses dan track pesanan\n• Pengiriman - Kelola pengiriman\n• Faktur - Handle billing\n\n**👥 Pelanggan:**\n• Manajemen Pelanggan - Lihat dan kelola pelanggan\n• Grup Pelanggan - Buat segmen pelanggan\n\n**📢 Pemasaran:**\n• Kampanye - Buat kampanye promosi\n• Kupon - Kelola kode diskon\n• SEO - Optimalkan untuk mesin pencari\n• Banner - Kelola banner promosi\n\n**📊 Analitik:**\n• Dasbor - Lihat metrik performa\n• Laporan - Generate laporan detail\n\n**⚙️ Pengaturan:**\n• Umum - Konfigurasi toko\n• Pembayaran - Metode pembayaran\n• Pengiriman - Opsi pengiriman\n• Pengguna - Kelola pengguna admin\n\n**Aksi Cepat:**\n• Buat produk, kupon, kampanye\n• Proses pesanan\n• Lihat statistik\n• Kelola inventori\n\nTanyakan saya tentang modul spesifik untuk informasi detail!"
            : "**Vesto Admin Dashboard Overview**\n\nThe Vesto Admin Dashboard is a comprehensive e-commerce management system with the following modules:\n\n**📦 Catalog:**\n• Products - Manage your product catalog\n• Categories - Organize products into categories\n• Collections - Create curated product collections\n• Attributes - Define product attributes\n• Variants - Manage product variations\n\n**🛒 Orders:**\n• Order Management - Process and track orders\n• Shipments - Manage shipping\n• Invoices - Handle billing\n\n**👥 Customers:**\n• Customer Management - View and manage customers\n• Customer Groups - Create customer segments\n\n**📢 Marketing:**\n• Campaigns - Create promotional campaigns\n• Coupons - Manage discount codes\n• SEO - Optimize for search engines\n• Banners - Manage promotional banners\n\n**📊 Analytics:**\n• Dashboard - View performance metrics\n• Reports - Generate detailed reports\n\n**⚙️ Settings:**\n• General - Store configuration\n• Payment - Payment methods\n• Shipping - Shipping options\n• Users - Manage admin users\n\n**Quick Actions:**\n• Create products, coupons, campaigns\n• Process orders\n• View statistics\n• Manage inventory\n\nAsk me about any specific module for detailed information!";
    }

    /**
     * Execute an action after confirmation
     */
    public function execute(Request $request)
    {
        $request->validate([
            'action' => 'required|array',
        ]);

        $action = $request->input('action');

        try {
            $result = $this->executeAction($action);

            return response()->json([
                'success' => true,
                'result' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get context-aware suggestions
     */
    public function suggestions(Request $request)
    {
        $context = $request->input('context', []);
        $context = $this->buildContext($context);

        $suggestions = $this->getContextualSuggestions($context);

        return response()->json([
            'suggestions' => $suggestions,
        ]);
    }

    /**
     * Build context from request and current page
     */
    protected function buildContext(array $context): array
    {
        $defaultContext = [
            'current_page' => request()->path(),
            'user_role' => Auth::user()?->role ?? 'guest',
            'timestamp' => now()->toIso8601String(),
        ];

        return array_merge($defaultContext, $context);
    }

    /**
     * Build system prompt with context
     */
    protected function buildSystemPrompt(array $context): string
    {
        $prompt = "You are an intelligent admin assistant for Vesto E-commerce Dashboard. ";
        $prompt .= "You can understand natural language commands and return structured JSON actions. ";
        $prompt .= "You NEVER perform database operations directly. ";
        $prompt .= "You only return structured actions that the backend will validate and execute.\n\n";
        
        $prompt .= "Available tools:\n";
        foreach ($this->toolRegistry->all() as $tool) {
            $prompt .= "- {$tool->getName()}: {$tool->getDescription()}\n";
        }
        $prompt .= "\n";

        if (!empty($context)) {
            $prompt .= "Current context:\n";
            foreach ($context as $key => $value) {
                if (is_array($value)) {
                    $value = json_encode($value);
                }
                $prompt .= "- {$key}: {$value}\n";
            }
            $prompt .= "\n";
        }

        $prompt .= "IMPORTANT: Always return valid JSON in the following format:\n";
        $prompt .= "{\n";
        $prompt .= "  \"action\": \"tool_name\",\n";
        $prompt .= "  \"parameters\": { ... },\n";
        $prompt .= "  \"explanation\": \"brief explanation\"\n";
        $prompt .= "}\n\n";
        
        $prompt .= "If the user asks a question that doesn't require an action, return:\n";
        $prompt .= "{\n";
        $prompt .= "  \"action\": \"answer\",\n";
        $prompt .= "  \"response\": \"your answer\"\n";
        $prompt .= "}";

        return $prompt;
    }

    /**
     * Parse action response from Gemini
     */
    protected function parseActionResponse(array $response): array
    {
        if (!isset($response['candidates'][0]['content']['parts'][0]['text'])) {
            return [
                'action' => 'answer',
                'response' => 'No response from AI'
            ];
        }

        $text = $response['candidates'][0]['content']['parts'][0]['text'];
        
        // Try to extract JSON from the response
        if (preg_match('/\{[\s\S]*\}/', $text, $matches)) {
            $json = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $json;
            }
        }

        // Fallback: return as plain text response
        return [
            'action' => 'answer',
            'response' => $text
        ];
    }

    /**
     * Execute an action using the tool registry
     */
    protected function executeAction(array $action): array
    {
        $toolName = $action['action'] ?? null;
        $parameters = $action['parameters'] ?? [];

        if (!$toolName) {
            return [
                'success' => false,
                'error' => 'No action specified'
            ];
        }

        return $this->toolRegistry->execute($toolName, $parameters);
    }

    /**
     * Get contextual suggestions based on current page
     */
    protected function getContextualSuggestions(array $context): array
    {
        $currentPath = $context['current_page'] ?? '';
        
        $suggestions = [];

        // General suggestions
        $suggestions[] = "What should I do today?";
        $suggestions[] = "Show today's sales statistics";
        $suggestions[] = "Generate marketing ideas";

        // Context-specific suggestions
        if (str_contains($currentPath, '/products')) {
            $suggestions[] = "Generate product description for this item";
            $suggestions[] = "Generate SEO for this product";
            $suggestions[] = "Duplicate this product";
        }

        if (str_contains($currentPath, '/marketing/campaigns')) {
            $suggestions[] = "Create a Summer Sale campaign";
            $suggestions[] = "Analyze campaign performance";
        }

        if (str_contains($currentPath, '/marketing/coupons')) {
            $suggestions[] = "Create a coupon with 20% discount";
            $suggestions[] = "Generate coupon code ideas";
        }

        if (str_contains($currentPath, '/marketing/seo')) {
            $suggestions[] = "Generate SEO for homepage";
            $suggestions[] = "Analyze SEO performance";
        }

        if (str_contains($currentPath, '/orders')) {
            $suggestions[] = "Summarize recent orders";
            $suggestions[] = "How many pending orders?";
        }

        if (str_contains($currentPath, '/dashboard')) {
            $suggestions[] = "Show dashboard analytics";
            $suggestions[] = "Suggest products to restock";
        }

        return array_slice($suggestions, 0, 6);
    }
}
