<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected ?string $apiKey;
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key') ?? env('GEMINI_API_KEY');
    }

    /**
     * Generate content using Gemini API
     */
    public function generateContent(array $messages, array $tools = []): array
    {
        if (!$this->apiKey) {
            throw new \Exception('Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.');
        }

        try {
            $payload = [
                'contents' => $this->formatMessages($messages),
            ];

            if (!empty($tools)) {
                $formattedTools = $this->formatTools($tools);
                $payload['tools'] = $formattedTools;
                
                // Log for debugging
                Log::info('Gemini Tools Payload', ['tools' => $formattedTools]);
            }

            $response = Http::post($this->baseUrl . '?key=' . $this->apiKey, $payload);

            if (!$response->successful()) {
                Log::error('Gemini API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'payload' => $payload,
                ]);
                throw new \Exception('Gemini API request failed: ' . $response->body());
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Gemini Service Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Format messages for Gemini API
     */
    protected function formatMessages(array $messages): array
    {
        return array_map(function ($message) {
            return [
                'role' => $message['role'] === 'user' ? 'user' : 'model',
                'parts' => [
                    ['text' => $message['content']]
                ]
            ];
        }, $messages);
    }

    /**
     * Format tools for Gemini API
     */
    protected function formatTools(array $tools): array
    {
        // Tools should already be in the correct format from ToolRegistry::toGeminiFormat()
        // Wrap in the tools array structure: [{function_declarations: [...]}]
        return [
            [
                'function_declarations' => $tools
            ]
        ];
    }

    /**
     * Generate structured action response
     */
    public function generateAction(string $prompt, array $context = []): array
    {
        $systemPrompt = $this->buildSystemPrompt($context);
        
        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $prompt]
        ];

        $response = $this->generateContent($messages);
        
        // Parse the response to extract structured action
        return $this->parseActionResponse($response);
    }

    /**
     * Build system prompt based on context
     */
    protected function buildSystemPrompt(array $context): string
    {
        $prompt = "You are an intelligent admin assistant for Vesto E-commerce Dashboard. ";
        $prompt .= "You can understand natural language commands and return structured JSON actions. ";
        $prompt .= "You NEVER perform database operations directly. ";
        $prompt .= "You only return structured actions that the backend will validate and execute.\n\n";
        
        $prompt .= "Available actions:\n";
        $prompt .= "- create_coupon: Create a new discount coupon\n";
        $prompt .= "- create_campaign: Create a marketing campaign\n";
        $prompt .= "- generate_seo: Generate SEO metadata\n";
        $prompt .= "- generate_product_description: Generate product description\n";
        $prompt .= "- generate_banner_copy: Generate banner copy\n";
        $prompt .= "- duplicate_product: Duplicate an existing product\n";
        $prompt .= "- show_statistics: Show dashboard statistics\n";
        $prompt .= "- suggest_restock: Suggest products to restock\n";
        $prompt .= "- analyze_sales: Analyze sales data\n";
        $prompt .= "- summarize_orders: Summarize recent orders\n";
        $prompt .= "- generate_marketing_ideas: Generate marketing campaign ideas\n";
        $prompt .= "- suggest_layout: Suggest homepage layout\n";
        $prompt .= "- generate_collection_description: Generate collection description\n";
        $prompt .= "- generate_meta_tags: Generate meta tags\n";
        $prompt .= "- analyze_customer_behavior: Analyze customer behavior patterns\n\n";

        if (!empty($context)) {
            $prompt .= "Current context:\n";
            foreach ($context as $key => $value) {
                $prompt .= "- {$key}: {$value}\n";
            }
            $prompt .= "\n";
        }

        $prompt .= "IMPORTANT: Always return valid JSON in the following format:\n";
        $prompt .= "{\n";
        $prompt .= "  \"action\": \"action_name\",\n";
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
                'action' => 'error',
                'error' => 'No response from Gemini'
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
     * Generate streaming response (for future implementation)
     */
    public function generateStream(array $messages)
    {
        // TODO: Implement streaming support
        throw new \Exception('Streaming not yet implemented');
    }
}
