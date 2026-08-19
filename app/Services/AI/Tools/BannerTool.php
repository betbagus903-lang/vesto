<?php

namespace App\Services\AI\Tools;

use App\Models\Banner;

class BannerTool extends BaseTool
{
    public function getName(): string
    {
        return 'manage_banners';
    }

    public function getDescription(): string
    {
        return 'Manage banners: create, view, update, delete, and index banners with full access to all banner operations';
    }

    public function getParameters(): array
    {
        return [
            'action' => [
                'type' => 'string',
                'description' => 'Action to perform: create, view, index, update, delete',
                'enum' => ['create', 'view', 'index', 'update', 'delete']
            ],
            'banner_id' => [
                'type' => 'integer',
                'description' => 'Banner ID (required for view, update, delete actions)'
            ],
            'title' => [
                'type' => 'string',
                'description' => 'Banner title (required for create action)'
            ],
            'type' => [
                'type' => 'string',
                'description' => 'Banner type: hero_slider, promo_banner, category_banner, collection_banner',
                'enum' => ['hero_slider', 'promo_banner', 'category_banner', 'collection_banner']
            ],
            'subtitle' => [
                'type' => 'string',
                'description' => 'Banner subtitle'
            ],
            'image' => [
                'type' => 'string',
                'description' => 'Banner image URL'
            ],
            'button_text' => [
                'type' => 'string',
                'description' => 'Button text'
            ],
            'button_link' => [
                'type' => 'string',
                'description' => 'Button link URL'
            ],
            'link_type' => [
                'type' => 'string',
                'description' => 'Link type: product, category, collection, external',
                'enum' => ['product', 'category', 'collection', 'external']
            ],
            'collection_id' => [
                'type' => 'integer',
                'description' => 'Collection ID if link_type is collection'
            ],
            'is_active' => [
                'type' => 'boolean',
                'description' => 'Whether banner is active'
            ],
        ];
    }

    protected function getRequiredParameters(): array
    {
        return ['action'];
    }

    public function execute(array $parameters): array
    {
        if (!$this->validate($parameters)) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: action'
            ];
        }

        $action = $parameters['action'];

        try {
            switch ($action) {
                case 'create':
                    return $this->createBanner($parameters);
                case 'view':
                    return $this->viewBanner($parameters);
                case 'index':
                    return $this->indexBanners();
                case 'update':
                    return $this->updateBanner($parameters);
                case 'delete':
                    return $this->deleteBanner($parameters);
                default:
                    return [
                        'success' => false,
                        'error' => "Unknown action: {$action}. Valid actions: create, view, index, update, delete"
                    ];
            }
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    private function createBanner(array $params): array
    {
        if (!isset($params['title'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter for create: title is required'
            ];
        }

        $banner = Banner::create([
            'title' => $params['title'],
            'type' => $params['type'] ?? 'promo_banner',
            'subtitle' => $params['subtitle'] ?? null,
            'image' => $params['image'] ?? null,
            'button_text' => $params['button_text'] ?? null,
            'button_link' => $params['button_link'] ?? null,
            'link_type' => $params['link_type'] ?? 'external',
            'link_id' => null,
            'collection_id' => $params['collection_id'] ?? null,
            'is_active' => $params['is_active'] ?? true,
            'sort_order' => 0,
            'start_date' => null,
            'end_date' => null,
        ]);

        return [
            'success' => true,
            'data' => $banner->toArray(),
            'message' => "Banner '{$banner->title}' created successfully"
        ];
    }

    private function viewBanner(array $params): array
    {
        if (!isset($params['banner_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: banner_id'
            ];
        }

        $banner = Banner::with('collection')->find($params['banner_id']);
        if (!$banner) {
            return [
                'success' => false,
                'error' => 'Banner not found'
            ];
        }

        return [
            'success' => true,
            'data' => $banner->toArray(),
            'message' => "Banner '{$banner->title}' details retrieved"
        ];
    }

    private function indexBanners(): array
    {
        $banners = Banner::orderBy('sort_order')->get();
        
        return [
            'success' => true,
            'data' => $banners->toArray(),
            'message' => "Retrieved {$banners->count()} banners"
        ];
    }

    private function updateBanner(array $params): array
    {
        if (!isset($params['banner_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: banner_id'
            ];
        }

        $banner = Banner::find($params['banner_id']);
        if (!$banner) {
            return [
                'success' => false,
                'error' => 'Banner not found'
            ];
        }

        $updateData = [];
        if (isset($params['title'])) $updateData['title'] = $params['title'];
        if (isset($params['type'])) $updateData['type'] = $params['type'];
        if (isset($params['subtitle'])) $updateData['subtitle'] = $params['subtitle'];
        if (isset($params['image'])) $updateData['image'] = $params['image'];
        if (isset($params['button_text'])) $updateData['button_text'] = $params['button_text'];
        if (isset($params['button_link'])) $updateData['button_link'] = $params['button_link'];
        if (isset($params['link_type'])) $updateData['link_type'] = $params['link_type'];
        if (isset($params['collection_id'])) $updateData['collection_id'] = $params['collection_id'];
        if (isset($params['is_active'])) $updateData['is_active'] = $params['is_active'];

        $banner->update($updateData);

        return [
            'success' => true,
            'data' => $banner->fresh()->toArray(),
            'message' => "Banner '{$banner->title}' updated successfully"
        ];
    }

    private function deleteBanner(array $params): array
    {
        if (!isset($params['banner_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: banner_id'
            ];
        }

        $banner = Banner::find($params['banner_id']);
        if (!$banner) {
            return [
                'success' => false,
                'error' => 'Banner not found'
            ];
        }

        $title = $banner->title;
        $banner->delete();

        return [
            'success' => true,
            'message' => "Banner '{$title}' deleted successfully"
        ];
    }
}