<?php

namespace App\Services\AI\Tools;

use App\Models\Campaign;

class CampaignTool extends BaseTool
{
    public function getName(): string
    {
        return 'create_campaign';
    }

    public function getDescription(): string
    {
        return 'Create a new marketing campaign with specified parameters';
    }

    public function getParameters(): array
    {
        return [
            'name' => [
                'type' => 'string',
                'description' => 'Campaign name (e.g., Summer Sale 2026)'
            ],
            'description' => [
                'type' => 'string',
                'description' => 'Campaign description'
            ],
            'campaign_type' => [
                'type' => 'string',
                'description' => 'Type of campaign: homepage, collection, category, or product',
                'enum' => ['homepage', 'collection', 'category', 'product']
            ],
            'start_date' => [
                'type' => 'string',
                'description' => 'Start date (YYYY-MM-DD format)'
            ],
            'end_date' => [
                'type' => 'string',
                'description' => 'End date (YYYY-MM-DD format)'
            ],
            'banner' => [
                'type' => 'string',
                'description' => 'Banner image filename'
            ],
            'button_text' => [
                'type' => 'string',
                'description' => 'Call-to-action button text'
            ],
            'button_url' => [
                'type' => 'string',
                'description' => 'Button destination URL'
            ]
        ];
    }

    protected function getRequiredParameters(): array
    {
        return ['name', 'campaign_type', 'start_date', 'end_date'];
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
            $campaign = Campaign::create([
                'name' => $parameters['name'],
                'description' => $parameters['description'] ?? null,
                'campaign_type' => $parameters['campaign_type'],
                'start_date' => $parameters['start_date'],
                'end_date' => $parameters['end_date'],
                'banner' => $parameters['banner'] ?? null,
                'button_text' => $parameters['button_text'] ?? null,
                'button_url' => $parameters['button_url'] ?? null,
                'status' => 'draft',
                'priority' => 1,
                'views' => 0,
                'clicks' => 0,
                'ctr' => 0,
            ]);

            return [
                'success' => true,
                'data' => $campaign->toArray(),
                'message' => "Campaign '{$campaign->name}' created successfully"
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
