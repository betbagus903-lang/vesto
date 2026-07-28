<?php

namespace App\Services\AI\Tools;

use App\Models\Product;
use App\Models\Category;

class ProductTool extends BaseTool
{
    public function getName(): string
    {
        return 'create_product';
    }

    public function getDescription(): string
    {
        return 'Create a new product with specified details including name, price, description, category, and stock';
    }

    public function getParameters(): array
    {
        return [
            'name' => [
                'type' => 'string',
                'description' => 'Product name (e.g., Dress Simple untuk Wanita)'
            ],
            'price' => [
                'type' => 'number',
                'description' => 'Product price in IDR (e.g., 250000)'
            ],
            'description' => [
                'type' => 'string',
                'description' => 'Product description'
            ],
            'category' => [
                'type' => 'string',
                'description' => 'Product category name (e.g., Pakaian Wanita)'
            ],
            'stock' => [
                'type' => 'number',
                'description' => 'Initial stock quantity (default: 50)'
            ],
            'sku' => [
                'type' => 'string',
                'description' => 'SKU code (optional, will auto-generate if not provided)'
            ],
        ];
    }

    protected function getRequiredParameters(): array
    {
        return ['name', 'price'];
    }

    public function execute(array $parameters): array
    {
        if (!$this->validate($parameters)) {
            return [
                'success' => false,
                'error' => 'Missing required parameters: name and price are required'
            ];
        }

        try {
            // Find or create category
            $category = null;
            if (isset($parameters['category'])) {
                $category = Category::where('name', $parameters['category'])->first();
                if (!$category) {
                    $category = Category::create([
                        'name' => $parameters['category'],
                        'slug' => strtolower(str_replace(' ', '-', $parameters['category'])),
                        'description' => 'Auto-created category',
                        'is_active' => true,
                    ]);
                }
            }

            // Generate SKU if not provided
            $sku = $parameters['sku'] ?? 'PROD-' . strtoupper(substr(uniqid(), -6));

            // Create product
            $product = Product::create([
                'name' => $parameters['name'],
                'slug' => strtolower(str_replace(' ', '-', $parameters['name'])),
                'description' => $parameters['description'] ?? 'Product created via AI Assistant',
                'price' => $parameters['price'],
                'compare_price' => null,
                'cost_price' => null,
                'sku' => $sku,
                'barcode' => null,
                'track_quantity' => true,
                'quantity' => $parameters['stock'] ?? 50,
                'weight' => null,
                'requires_shipping' => true,
                'category_id' => $category?->id,
                'is_active' => true,
                'is_featured' => false,
            ]);

            return [
                'success' => true,
                'data' => $product->toArray(),
                'message' => "Product '{$product->name}' created successfully with SKU: {$sku}"
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
