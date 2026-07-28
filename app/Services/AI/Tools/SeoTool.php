<?php

namespace App\Services\AI\Tools;

use App\Models\SeoSetting;

class SeoTool extends BaseTool
{
    public function getName(): string
    {
        return 'generate_seo';
    }

    public function getDescription(): string
    {
        return 'Generate SEO metadata (title, description, keywords) for a page';
    }

    public function getParameters(): array
    {
        return [
            'page_type' => [
                'type' => 'string',
                'description' => 'Type of page: homepage, products, categories, or collections',
                'enum' => ['homepage', 'products', 'categories', 'collections']
            ],
            'page_name' => [
                'type' => 'string',
                'description' => 'Name of the page or product'
            ],
            'description' => [
                'type' => 'string',
                'description' => 'Brief description of the page content'
            ],
            'keywords' => [
                'type' => 'string',
                'description' => 'Comma-separated keywords'
            ]
        ];
    }

    protected function getRequiredParameters(): array
    {
        return ['page_type'];
    }

    public function execute(array $parameters): array
    {
        if (!$this->validate($parameters)) {
            return [
                'success' => false,
                'error' => 'Missing required parameters'
            ];
        }

        try {
            $seoSetting = SeoSetting::updateOrCreate(
                [
                    'page_type' => $parameters['page_type'],
                    'page_id' => $parameters['page_id'] ?? null
                ],
                [
                    'meta_title' => $parameters['meta_title'] ?? null,
                    'meta_description' => $parameters['meta_description'] ?? null,
                    'keywords' => $parameters['keywords'] ?? null,
                    'auto_generate_meta' => false,
                    'auto_generate_slug' => false,
                    'auto_generate_keywords' => false,
                    'auto_generate_description' => false,
                ]
            );

            return [
                'success' => true,
                'data' => $seoSetting->toArray(),
                'message' => "SEO settings for {$parameters['page_type']} updated successfully"
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
