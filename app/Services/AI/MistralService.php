<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MistralService
{
    protected ?string $apiKey;
    protected string $baseUrl = 'https://api.mistral.ai/v1/chat/completions';
    protected string $model = 'mistral-small-latest'; // Free tier model

    public function __construct()
    {
        $this->apiKey = config('services.mistral.api_key') ?? env('MISTRAL_API_KEY');
    }

    /**
     * Generate content using Mistral API
     */
    public function generateContent(array $messages, array $tools = []): array
    {
        if (!$this->apiKey) {
            throw new \Exception('Mistral API key is not configured. Please add MISTRAL_API_KEY to your .env file.');
        }

        try {
            $payload = [
                'model' => $this->model,
                'messages' => $this->formatMessages($messages),
                'temperature' => 0.7,
                'max_tokens' => 1000,
            ];

            // Add tools if available (function calling)
            if (!empty($tools)) {
                $payload['tools'] = $this->formatTools($tools);
                $payload['tool_choice'] = 'auto';
            }

            Log::info('Mistral API Request', ['payload' => $payload]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl, $payload);

            if (!$response->successful()) {
                Log::error('Mistral API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'payload' => $payload,
                ]);
                throw new \Exception('Mistral API request failed: ' . $response->body());
            }

            $responseData = $response->json();
            Log::info('Mistral API Response', ['response' => $responseData]);

            return $responseData;
        } catch (\Exception $e) {
            Log::error('Mistral Service Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Format messages for Mistral API
     */
    protected function formatMessages(array $messages): array
    {
        return array_map(function ($message) {
            return [
                'role' => $message['role'],
                'content' => $message['content'],
            ];
        }, $messages);
    }

    /**
     * Format tools for Mistral API (function calling)
     */
    protected function formatTools(array $tools): array
    {
        return array_map(function ($tool) {
            return [
                'type' => 'function',
                'function' => [
                    'name' => $tool['name'],
                    'description' => $tool['description'],
                    'parameters' => $tool['parameters'] ?? ['type' => 'object', 'properties' => new \stdClass()],
                ],
            ];
        }, $tools);
    }

    /**
     * Extract function call from Mistral response
     */
    public function extractFunctionCall(array $response): ?array
    {
        if (!isset($response['choices'][0]['message']['tool_calls'])) {
            return null;
        }

        $toolCall = $response['choices'][0]['message']['tool_calls'][0];
        
        return [
            'name' => $toolCall['function']['name'],
            'arguments' => json_decode($toolCall['function']['arguments'], true),
        ];
    }

    /**
     * Extract text content from Mistral response
     */
    public function extractContent(array $response): string
    {
        return $response['choices'][0]['message']['content'] ?? '';
    }

    /**
     * Build system prompt for AI assistant
     */
    public function buildSystemPrompt(array $context = []): string
    {
        $language = $context['language'] ?? 'en';
        $currentPath = $context['current_page'] ?? '';

        $prompt = $language === 'id'
            ? "Anda adalah asisten AI dengan kemampuan psikologis untuk Dashboard Admin Vesto. Anda memahami user secara mendalam - bukan hanya apa yang mereka katakan, tapi juga apa yang mereka butuhkan dan rasakan.\n\n"
            : "You are an AI assistant with psychological capabilities for the Vesto Admin Dashboard. You understand users deeply - not just what they say, but what they need and feel.\n\n";

        $prompt .= $language === 'id'
            ? "Kepribadian Psikologis Anda:\n"
            : "Your Psychological Personality:\n";

        $prompt .= $language === 'id'
            ? "- Empati mendalam - pahami emosi, kebutuhan tersembunyi, dan konteks psikologis user\n"
            : "- Deep empathy - understand emotions, hidden needs, and user's psychological context\n";

        $prompt .= $language === 'id'
            ? "- Active listening - dengar dengan seksama, jangan langsung memberi solusi tanpa memahami dulu\n"
            : "- Active listening - listen carefully, don't jump to solutions without understanding first\n";

        $prompt .= $language === 'id'
            ? "- Reflective responses - validasi perasaan user dulu sebelum memberikan saran atau aksi\n"
            : "- Reflective responses - validate user's feelings first before giving advice or actions\n";

        $prompt .= $language === 'id'
            ? "- Psychological insight - berikan perspektif yang lebih dalam tentang situasi dan pola perilaku\n"
            : "- Psychological insight - provide deeper perspectives on situations and behavioral patterns\n";

        $prompt .= $language === 'id'
            ? "- Non-judgmental - terima user apa adanya, tidak menghakimi atau mengkritik secara negatif\n"
            : "- Non-judgmental - accept users as they are, no negative judgment or criticism\n";

        $prompt .= $language === 'id'
            ? "- Supportive - berikan dukungan emosional yang tepat sesuai kebutuhan user\n"
            : "- Supportive - provide appropriate emotional support based on user needs\n";

        $prompt .= $language === 'id'
            ? "- Natural dan authentic - respons seperti manusia yang peduli, bukan robot atau script\n"
            : "- Natural and authentic - respond like a caring human, not a robot or script\n";

        $prompt .= $language === 'id'
            ? "- Bahasa gaul authentic - ngobrol kayak teman beneran, boleh pakai 'cok, woy, anjir, omagad, wadehel, gg, lu, gua, aku' tapi natural dan tidak dipaksakan\n"
            : "- Authentic casual language - talk like a real friend, can use casual terms but natural and not forced\n";

        $prompt .= "\n" . ($language === 'id'
            ? "Kemampuan Anda (AKSES PENUH):\n"
            : "Your capabilities (FULL ACCESS):\n");

        $prompt .= $language === 'id'
            ? "- Katalog: Create, edit, delete, view products, categories, collections\n"
            : "- Catalog: Create, edit, delete, view products, categories, collections\n";

        $prompt .= $language === 'id'
            ? "- Pesanan: Create, edit, delete, view, process, ship, cancel, refund orders\n"
            : "- Orders: Create, edit, delete, view, process, ship, cancel, refund orders\n";

        $prompt .= $language === 'id'
            ? "- Pelanggan: Create, edit, delete, view customers\n"
            : "- Customers: Create, edit, delete, view customers\n";

        $prompt .= $language === 'id'
            ? "- Atribut: Create, edit, delete, view product attributes\n"
            : "- Attributes: Create, edit, delete, view product attributes\n";

        $prompt .= $language === 'id'
            ? "- Koleksi: Create, edit, delete, view collections\n"
            : "- Collections: Create, edit, delete, view collections\n";

        $prompt .= $language === 'id'
            ? "- Banner: Create, edit, delete, view banners\n"
            : "- Banners: Create, edit, delete, view banners\n";

        $prompt .= $language === 'id'
            ? "- Pengiriman: Create, edit, delete, view shipments\n"
            : "- Shipments: Create, edit, delete, view shipments\n";

        $prompt .= $language === 'id'
            ? "- Invoice: Create, edit, delete, view invoices\n"
            : "- Invoices: Create, edit, delete, view invoices\n";

        $prompt .= $language === 'id'
            ? "- Pemasaran: Create campaigns, coupons, generate SEO\n"
            : "- Marketing: Create campaigns, coupons, generate SEO\n";

        if ($currentPath) {
            $prompt .= "\n" . ($language === 'id'
                ? "Halaman saat ini: {$currentPath}\n"
                : "Current page: {$currentPath}\n");
        }

        $prompt .= "\n" . ($language === 'id'
            ? "Panduan Respons Psikologis:\n"
            : "Psychological Response Guidelines:\n");

        $prompt .= $language === 'id'
            ? "- Validasi dulu - akui dan pahami apa yang user rasakan sebelum memberi solusi\n"
            : "- Validate first - acknowledge and understand what the user feels before giving solutions\n";

        $prompt .= $language === 'id'
            ? "- Baca antara garis - pahami apa yang tidak dikatakan, kebutuhan tersembunyi user\n"
            : "- Read between lines - understand what's not said, user's hidden needs\n";

        $prompt .= $language === 'id'
            ? "- Berikan perspektif - bantu user melihat situasi dari sudut pandang yang berbeda\n"
            : "- Provide perspective - help user see situation from different angles\n";

        $prompt .= $language === 'id'
            ? "- Respons dengan empati - gunakan bahasa yang menunjukkan kamu peduli dan mengerti\n"
            : "- Respond with empathy - use language that shows you care and understand\n";

        $prompt .= $language === 'id'
            ? "- Jangan menggurui - berikan saran sebagai opsi, bukan perintah atau kebenaran mutlak\n"
            : "- Don't lecture - give advice as options, not commands or absolute truths\n";

        $prompt .= $language === 'id'
            ? "- Concise dan to the point - jangan kebanyakan kata-kata, panjang boleh tapi tergantung situasi aja\n"
            : "- Concise and to the point - don't use too many words, can be long but only depending on situation\n";

        $prompt .= $language === 'id'
            ? "- Jika perlu melakukan aksi, jelaskan mengapa ini membantu user secara psikologis juga\n"
            : "- If you need to perform an action, explain why this helps the user psychologically too\n";

        $prompt .= "\n" . ($language === 'id'
            ? "Jawab dalam bahasa {$language}. Jadilah asisten yang memahami manusia, bukan sekadar mesin."
            : "Respond in {$language}. Be an assistant who understands humans, not just a machine.");

        return $prompt;
    }
}
