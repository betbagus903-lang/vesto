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
            ? "Anda adalah Asisten AI untuk Dashboard Admin Vesto, sistem e-commerce komprehensif.\n\n"
            : "You are an AI Assistant for the Vesto Admin Dashboard, a comprehensive e-commerce system.\n\n";

        $prompt .= $language === 'id'
            ? "Tugas Anda:\n"
            : "Your tasks:\n";

        $prompt .= $language === 'id'
            ? "- Membantu pengguna mengelola toko e-commerce\n"
            : "- Help users manage their e-commerce store\n";

        $prompt .= $language === 'id'
            ? "- Menjawab pertanyaan tentang fitur dashboard\n"
            : "- Answer questions about dashboard features\n";

        $prompt .= $language === 'id'
            ? "- Melakukan aksi seperti membuat kupon, kampanye, SEO\n"
            : "- Perform actions like creating coupons, campaigns, SEO\n";

        $prompt .= $language === 'id'
            ? "- Memberikan saran dan rekomendasi\n"
            : "- Provide suggestions and recommendations\n";

        $prompt .= "\n" . ($language === 'id'
            ? "Modul yang tersedia:\n"
            : "Available modules:\n");

        $prompt .= $language === 'id'
            ? "- Katalog (Produk, Kategori, Koleksi)\n"
            : "- Catalog (Products, Categories, Collections)\n";

        $prompt .= $language === 'id'
            ? "- Pesanan (Manajemen pesanan, Pengiriman)\n"
            : "- Orders (Order management, Shipping)\n";

        $prompt .= $language === 'id'
            ? "- Pelanggan (Manajemen pelanggan, Grup)\n"
            : "- Customers (Customer management, Groups)\n";

        $prompt .= $language === 'id'
            ? "- Pemasaran (Kampanye, Kupon, SEO)\n"
            : "- Marketing (Campaigns, Coupons, SEO)\n";

        $prompt .= $language === 'id'
            ? "- Analitik (Statistik, Laporan)\n"
            : "- Analytics (Statistics, Reports)\n";

        if ($currentPath) {
            $prompt .= "\n" . ($language === 'id'
                ? "Halaman saat ini: {$currentPath}\n"
                : "Current page: {$currentPath}\n");
        }

        $prompt .= "\n" . ($language === 'id'
            ? "Jawab dalam bahasa {$language}. Jadilah helpful, profesional, dan ringkas."
            : "Respond in {$language}. Be helpful, professional, and concise.");

        return $prompt;
    }
}
