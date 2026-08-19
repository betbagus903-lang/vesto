<?php

namespace App\Services\AI\Tools;

use App\Models\Product;
use App\Models\Category;

class ProductTool extends BaseTool
{
    public function getName(): string
    {
        return 'manage_products';
    }

    public function getDescription(): string
    {
        return 'Manage products: create, edit, delete, view, and index products with full access to all product operations';
    }

    public function getParameters(): array
    {
        return [
            'action' => [
                'type' => 'string',
                'description' => 'Action to perform: create, edit, delete, view, index, duplicate',
                'enum' => ['create', 'edit', 'delete', 'view', 'index', 'duplicate']
            ],
            'product_id' => [
                'type' => 'integer',
                'description' => 'Product ID (required for edit, delete, view, duplicate actions)'
            ],
            'name' => [
                'type' => 'string',
                'description' => 'Product name (required for create action)'
            ],
            'price' => [
                'type' => 'number',
                'description' => 'Product price in IDR (required for create action)'
            ],
            'description' => [
                'type' => 'string',
                'description' => 'Product description'
            ],
            'category' => [
                'type' => 'string',
                'description' => 'Product category name'
            ],
            'stock' => [
                'type' => 'integer',
                'description' => 'Stock quantity'
            ],
            'sku' => [
                'type' => 'string',
                'description' => 'SKU code'
            ],
            'is_active' => [
                'type' => 'boolean',
                'description' => 'Whether product is active'
            ],
            'is_featured' => [
                'type' => 'boolean',
                'description' => 'Whether product is featured'
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
                    return $this->createProduct($parameters);
                case 'edit':
                    return $this->editProduct($parameters);
                case 'delete':
                    return $this->deleteProduct($parameters);
                case 'view':
                    return $this->viewProduct($parameters);
                case 'index':
                    return $this->indexProducts();
                case 'duplicate':
                    return $this->duplicateProduct($parameters);
                default:
                    return [
                        'success' => false,
                        'error' => "Unknown action: {$action}. Valid actions: create, edit, delete, view, index, duplicate"
                    ];
            }
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    private function createProduct(array $params): array
    {
        if (!isset($params['name']) || !isset($params['price'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameters for create: name and price are required'
            ];
        }

        // Find or create category
        $category = null;
        if (isset($params['category'])) {
            $category = Category::where('name', $params['category'])->first();
            if (!$category) {
                $category = Category::create([
                    'name' => $params['category'],
                    'slug' => strtolower(str_replace(' ', '-', $params['category'])),
                    'description' => 'Auto-created category',
                    'is_active' => true,
                ]);
            }
        }

        // Generate SKU if not provided
        $sku = $params['sku'] ?? 'PROD-' . strtoupper(substr(uniqid(), -6));

        // Create product
        $product = Product::create([
            'name' => $params['name'],
            'slug' => strtolower(str_replace(' ', '-', $params['name'])),
            'description' => $params['description'] ?? 'Product created via AI Assistant',
            'price' => $params['price'],
            'compare_price' => null,
            'cost_price' => null,
            'sku' => $sku,
            'barcode' => null,
            'track_quantity' => true,
            'quantity' => $params['stock'] ?? 50,
            'weight' => null,
            'requires_shipping' => true,
            'category_id' => $category?->id,
            'is_active' => $params['is_active'] ?? true,
            'is_featured' => $params['is_featured'] ?? false,
        ]);

        return [
            'success' => true,
            'data' => $product->toArray(),
            'message' => "Product '{$product->name}' created successfully with SKU: {$sku}"
        ];
    }

    private function editProduct(array $params): array
    {
        if (!isset($params['product_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: product_id'
            ];
        }

        $product = Product::find($params['product_id']);
        if (!$product) {
            return [
                'success' => false,
                'error' => 'Product not found'
            ];
        }

        $updateData = [];
        if (isset($params['name'])) {
            $updateData['name'] = $params['name'];
            $updateData['slug'] = strtolower(str_replace(' ', '-', $params['name']));
        }
        if (isset($params['price'])) $updateData['price'] = $params['price'];
        if (isset($params['description'])) $updateData['description'] = $params['description'];
        if (isset($params['stock'])) $updateData['quantity'] = $params['stock'];
        if (isset($params['sku'])) $updateData['sku'] = $params['sku'];
        if (isset($params['is_active'])) $updateData['is_active'] = $params['is_active'];
        if (isset($params['is_featured'])) $updateData['is_featured'] = $params['is_featured'];

        // Handle category
        if (isset($params['category'])) {
            $category = Category::where('name', $params['category'])->first();
            if (!$category) {
                $category = Category::create([
                    'name' => $params['category'],
                    'slug' => strtolower(str_replace(' ', '-', $params['category'])),
                    'description' => 'Auto-created category',
                    'is_active' => true,
                ]);
            }
            $updateData['category_id'] = $category->id;
        }

        $product->update($updateData);

        return [
            'success' => true,
            'data' => $product->fresh()->toArray(),
            'message' => "Product '{$product->name}' updated successfully"
        ];
    }

    private function deleteProduct(array $params): array
    {
        if (!isset($params['product_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: product_id'
            ];
        }

        $product = Product::find($params['product_id']);
        if (!$product) {
            return [
                'success' => false,
                'error' => 'Product not found'
            ];
        }

        $name = $product->name;
        $product->delete();

        return [
            'success' => true,
            'message' => "Product '{$name}' deleted successfully"
        ];
    }

    private function viewProduct(array $params): array
    {
        if (!isset($params['product_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: product_id'
            ];
        }

        $product = Product::with(['category', 'variants'])->find($params['product_id']);
        if (!$product) {
            return [
                'success' => false,
                'error' => 'Product not found'
            ];
        }

        return [
            'success' => true,
            'data' => $product->toArray()
        ];
    }

    private function indexProducts(): array
    {
        $products = Product::with(['category'])->orderBy('created_at', 'desc')->get();

        return [
            'success' => true,
            'data' => $products->toArray(),
            'count' => $products->count(),
            'message' => "Found {$products->count()} products"
        ];
    }

    private function duplicateProduct(array $params): array
    {
        if (!isset($params['product_id'])) {
            return [
                'success' => false,
                'error' => 'Missing required parameter: product_id'
            ];
        }

        $originalProduct = Product::find($params['product_id']);
        if (!$originalProduct) {
            return [
                'success' => false,
                'error' => 'Product not found'
            ];
        }

        $newProduct = $originalProduct->replicate();
        $newProduct->name = $originalProduct->name . ' (Copy)';
        $newProduct->slug = strtolower(str_replace(' ', '-', $newProduct->name));
        $newProduct->sku = 'PROD-' . strtoupper(substr(uniqid(), -6));
        $newProduct->save();

        return [
            'success' => true,
            'data' => $newProduct->toArray(),
            'message' => "Product duplicated successfully as '{$newProduct->name}'"
        ];
    }
}
