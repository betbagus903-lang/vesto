<?php

namespace App\Services\AI\Tools;

use App\Models\Attribute;

class AttributeTool extends BaseTool
{
    public function getName(): string
    {
        return 'manage_attributes';
    }

    public function getDescription(): string
    {
        return 'Manage attributes: create, view, update, delete, and index attributes with full access to all attribute operations';
    }

    public function getParameters(): array
    {
        return [
            'action' => [
                'type' => 'string',
                'description' => 'Action to perform: create, view, index, update, delete',
                'enum' => ['create', 'view', 'index', 'update', 'delete']
            ],
            'attribute_id' => [
                'type' => 'integer',
                'description' => 'Attribute ID (required for view, update, delete actions)'
            ],
            'code' => [
                'type' => 'string',
                'description' => 'Attribute code (required for create action)'
            ],
            'admin_name' => [
                'type' => 'string',
                'description' => 'Attribute admin name (required for create action)'
            ],
            'type' => [
                'type' => 'string',
                'description' => 'Attribute type: text, textarea, price, select, multiselect, boolean, date',
                'enum' => ['text', 'textarea', 'price', 'select', 'multiselect', 'boolean', 'date']
            ],
            'is_required' => [
                'type' => 'boolean',
                'description' => 'Whether attribute is required'
            ],
            'is_filterable' => [
                'type' => 'boolean',
                'description' => 'Whether attribute is filterable'
            ],
            'is_configurable' => [
                'type' => 'boolean',
                'description' => 'Whether attribute is configurable'
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
                    return $this->createAttribute($parameters);
                case 'view':
                    return $this->viewAttribute($parameters);
                case 'index':
                    return $this->indexAttributes();
                case 'update':
                    return $this->updateAttribute($parameters);
                case 'delete':
                    return $this->deleteAttribute($parameters);
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

    private function createAttribute(array $params): array
    {
        if (!isset($params['code']) || !isset($params['admin_name'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameters for create: code and admin_name are required'
            ];
        }

        // Check if code already exists
        if (Attribute::where('code', $params['code'])->exists()) {
            return [
                'success' => false,
                'error' => 'Attribute code already exists'
            ];
        }

        $attribute = Attribute::create([
            'code' => $params['code'],
            'admin_name' => $params['admin_name'],
            'type' => $params['type'] ?? 'text',
            'is_required' => $params['is_required'] ?? false,
            'is_filterable' => $params['is_filterable'] ?? false,
            'is_configurable' => $params['is_configurable'] ?? false,
            'is_unique' => false,
            'value_per_locale' => false,
            'value_per_channel' => false,
            'is_user_defined' => true,
            'is_visible_on_front' => true,
            'is_comparable' => false,
            'position' => 0,
        ]);

        return [
            'success' => true,
            'data' => $attribute->toArray(),
            'message' => "Attribute '{$attribute->admin_name}' created successfully with code: {$attribute->code}"
        ];
    }

    private function viewAttribute(array $params): array
    {
        if (!isset($params['attribute_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: attribute_id'
            ];
        }

        $attribute = Attribute::with('options')->find($params['attribute_id']);
        if (!$attribute) {
            return [
                'success' => false,
                'error' => 'Attribute not found'
            ];
        }

        return [
            'success' => true,
            'data' => $attribute->toArray(),
            'message' => "Attribute '{$attribute->admin_name}' details retrieved"
        ];
    }

    private function indexAttributes(): array
    {
        $attributes = Attribute::orderBy('position')->get();
        
        return [
            'success' => true,
            'data' => $attributes->toArray(),
            'message' => "Retrieved {$attributes->count()} attributes"
        ];
    }

    private function updateAttribute(array $params): array
    {
        if (!isset($params['attribute_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: attribute_id'
            ];
        }

        $attribute = Attribute::find($params['attribute_id']);
        if (!$attribute) {
            return [
                'success' => false,
                'error' => 'Attribute not found'
            ];
        }

        $updateData = [];
        if (isset($params['code'])) {
            // Check if code already exists for another attribute
            if (Attribute::where('code', $params['code'])->where('id', '!=', $attribute->id)->exists()) {
                return [
                    'success' => false,
                    'error' => 'Attribute code already exists'
                ];
            }
            $updateData['code'] = $params['code'];
        }
        if (isset($params['admin_name'])) $updateData['admin_name'] = $params['admin_name'];
        if (isset($params['type'])) $updateData['type'] = $params['type'];
        if (isset($params['is_required'])) $updateData['is_required'] = $params['is_required'];
        if (isset($params['is_filterable'])) $updateData['is_filterable'] = $params['is_filterable'];
        if (isset($params['is_configurable'])) $updateData['is_configurable'] = $params['is_configurable'];

        $attribute->update($updateData);

        return [
            'success' => true,
            'data' => $attribute->fresh()->toArray(),
            'message' => "Attribute '{$attribute->admin_name}' updated successfully"
        ];
    }

    private function deleteAttribute(array $params): array
    {
        if (!isset($params['attribute_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: attribute_id'
            ];
        }

        $attribute = Attribute::find($params['attribute_id']);
        if (!$attribute) {
            return [
                'success' => false,
                'error' => 'Attribute not found'
            ];
        }

        $name = $attribute->admin_name;
        $attribute->delete();

        return [
            'success' => true,
            'message' => "Attribute '{$name}' deleted successfully"
        ];
    }
}