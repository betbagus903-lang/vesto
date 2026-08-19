<?php

namespace App\Services\AI\Tools;

use App\Models\Collection;

class CollectionTool extends BaseTool
{
    public function getName(): string
    {
        return 'manage_collections';
    }

    public function getDescription(): string
    {
        return 'Manage collections: create, view, update, delete, and index collections with full access to all collection operations';
    }

    public function getParameters(): array
    {
        return [
            'action' => [
                'type' => 'string',
                'description' => 'Action to perform: create, view, index, update, delete',
                'enum' => ['create', 'view', 'index', 'update', 'delete']
            ],
            'collection_id' => [
                'type' => 'integer',
                'description' => 'Collection ID (required for view, update, delete actions)'
            ],
            'name' => [
                'type' => 'string',
                'description' => 'Collection name (required for create action)'
            ],
            'description' => [
                'type' => 'string',
                'description' => 'Collection description'
            ],
            'type' => [
                'type' => 'string',
                'description' => 'Collection type: manual, automated',
                'enum' => ['manual', 'automated']
            ],
            'is_active' => [
                'type' => 'boolean',
                'description' => 'Whether collection is active'
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
                    return $this->createCollection($parameters);
                case 'view':
                    return $this->viewCollection($parameters);
                case 'index':
                    return $this->indexCollections();
                case 'update':
                    return $this->updateCollection($parameters);
                case 'delete':
                    return $this->deleteCollection($parameters);
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

    private function createCollection(array $params): array
    {
        if (!isset($params['name'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter for create: name is required'
            ];
        }

        $collection = Collection::create([
            'name' => $params['name'],
            'slug' => strtolower(str_replace(' ', '-', $params['name'])),
            'description' => $params['description'] ?? 'Collection created via AI Assistant',
            'type' => $params['type'] ?? 'manual',
            'is_active' => $params['is_active'] ?? true,
            'sort_order' => 0,
        ]);

        return [
            'success' => true,
            'data' => $collection->toArray(),
            'message' => "Collection '{$collection->name}' created successfully"
        ];
    }

    private function viewCollection(array $params): array
    {
        if (!isset($params['collection_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: collection_id'
            ];
        }

        $collection = Collection::with('rules')->find($params['collection_id']);
        if (!$collection) {
            return [
                'success' => false,
                'error' => 'Collection not found'
            ];
        }

        return [
            'success' => true,
            'data' => $collection->toArray(),
            'message' => "Collection '{$collection->name}' details retrieved"
        ];
    }

    private function indexCollections(): array
    {
        $collections = Collection::orderBy('sort_order')->get();
        
        return [
            'success' => true,
            'data' => $collections->toArray(),
            'message' => "Retrieved {$collections->count()} collections"
        ];
    }

    private function updateCollection(array $params): array
    {
        if (!isset($params['collection_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: collection_id'
            ];
        }

        $collection = Collection::find($params['collection_id']);
        if (!$collection) {
            return [
                'success' => false,
                'error' => 'Collection not found'
            ];
        }

        $updateData = [];
        if (isset($params['name'])) {
            $updateData['name'] = $params['name'];
            $updateData['slug'] = strtolower(str_replace(' ', '-', $params['name']));
        }
        if (isset($params['description'])) $updateData['description'] = $params['description'];
        if (isset($params['type'])) $updateData['type'] = $params['type'];
        if (isset($params['is_active'])) $updateData['is_active'] = $params['is_active'];

        $collection->update($updateData);

        return [
            'success' => true,
            'data' => $collection->fresh()->toArray(),
            'message' => "Collection '{$collection->name}' updated successfully"
        ];
    }

    private function deleteCollection(array $params): array
    {
        if (!isset($params['collection_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: collection_id'
            ];
        }

        $collection = Collection::find($params['collection_id']);
        if (!$collection) {
            return [
                'success' => false,
                'error' => 'Collection not found'
            ];
        }

        $name = $collection->name;
        $collection->delete();

        return [
            'success' => true,
            'message' => "Collection '{$name}' deleted successfully"
        ];
    }
}