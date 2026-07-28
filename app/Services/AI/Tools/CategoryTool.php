<?php

namespace App\Services\AI\Tools;

use App\Models\Category;

class CategoryTool extends BaseTool
{
    public function getName(): string
    {
        return 'manage_category';
    }

    public function getDescription(): string
    {
        return 'Manage categories - create, update, or delete categories and subcategories. Supports creating root categories or subcategories under a parent category.';
    }

    public function getParameters(): array
    {
        return [
            'action' => [
                'type' => 'string',
                'description' => 'Action to perform: create, update, or delete',
                'enum' => ['create', 'update', 'delete']
            ],
            'name' => [
                'type' => 'string',
                'description' => 'Category name (e.g., Outerwear, Dresses, Shoes)'
            ],
            'parent_name' => [
                'type' => 'string',
                'description' => 'Parent category name if creating a subcategory (e.g., Womens, Mens). Leave empty for root category.'
            ],
            'description' => [
                'type' => 'string',
                'description' => 'Category description (optional)'
            ],
            'position' => [
                'type' => 'number',
                'description' => 'Display position/order (optional, default: 0)'
            ],
        ];
    }

    protected function getRequiredParameters(): array
    {
        return ['action', 'name'];
    }

    public function execute(array $parameters): array
    {
        if (!$this->validate($parameters)) {
            return [
                'success' => false,
                'error' => 'Missing required parameters: action and name are required'
            ];
        }

        $action = $parameters['action'];

        try {
            switch ($action) {
                case 'create':
                    return $this->createCategory($parameters);
                case 'update':
                    return $this->updateCategory($parameters);
                case 'delete':
                    return $this->deleteCategory($parameters);
                default:
                    return [
                        'success' => false,
                        'error' => "Invalid action: {$action}. Must be create, update, or delete."
                    ];
            }
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    private function createCategory(array $parameters): array
    {
        // Check if category already exists
        $existingCategory = Category::where('name', $parameters['name'])->first();
        if ($existingCategory) {
            return [
                'success' => false,
                'error' => "Category '{$parameters['name']}' already exists"
            ];
        }

        // Find parent category if specified
        $parentId = null;
        if (!empty($parameters['parent_name'])) {
            $parent = Category::where('name', $parameters['parent_name'])->first();
            if (!$parent) {
                return [
                    'success' => false,
                    'error' => "Parent category '{$parameters['parent_name']}' not found. Please create the parent category first."
                ];
            }
            $parentId = $parent->id;
        }

        // Create category
        $category = Category::create([
            'name' => $parameters['name'],
            'slug' => strtolower(str_replace(' ', '-', $parameters['name'])),
            'description' => $parameters['description'] ?? null,
            'parent_id' => $parentId,
            'position' => $parameters['position'] ?? 0,
            'display_mode' => 'products_and_description',
            'visible_in_menu' => true,
        ]);

        $message = $parentId 
            ? "Subcategory '{$category->name}' created successfully under '{$parameters['parent_name']}'"
            : "Category '{$category->name}' created successfully as root category";

        return [
            'success' => true,
            'data' => $category->toArray(),
            'message' => $message
        ];
    }

    private function updateCategory(array $parameters): array
    {
        // Find category to update
        $category = Category::where('name', $parameters['name'])->first();
        if (!$category) {
            return [
                'success' => false,
                'error' => "Category '{$parameters['name']}' not found"
            ];
        }

        // Update fields if provided
        if (isset($parameters['description'])) {
            $category->description = $parameters['description'];
        }
        if (isset($parameters['position'])) {
            $category->position = $parameters['position'];
        }
        if (isset($parameters['parent_name'])) {
            $parent = Category::where('name', $parameters['parent_name'])->first();
            if (!$parent) {
                return [
                    'success' => false,
                    'error' => "Parent category '{$parameters['parent_name']}' not found"
                ];
            }
            $category->parent_id = $parent->id;
        }

        $category->save();

        return [
            'success' => true,
            'data' => $category->toArray(),
            'message' => "Category '{$category->name}' updated successfully"
        ];
    }

    private function deleteCategory(array $parameters): array
    {
        // Find category to delete
        $category = Category::where('name', $parameters['name'])->first();
        if (!$category) {
            return [
                'success' => false,
                'error' => "Category '{$parameters['name']}' not found"
            ];
        }

        // Check if category has children
        $hasChildren = Category::where('parent_id', $category->id)->exists();
        if ($hasChildren) {
            return [
                'success' => false,
                'error' => "Cannot delete category '{$category->name}' because it has subcategories. Delete subcategories first."
            ];
        }

        // Check if category has products
        $hasProducts = $category->products()->exists();
        if ($hasProducts) {
            return [
                'success' => false,
                'error' => "Cannot delete category '{$category->name}' because it has products. Reassign products first."
            ];
        }

        // Delete images if they exist
        if ($category->logo_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($category->logo_path);
        }
        if ($category->banner_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($category->banner_path);
        }

        $categoryName = $category->name;
        $category->delete();

        return [
            'success' => true,
            'message' => "Category '{$categoryName}' deleted successfully"
        ];
    }
}
