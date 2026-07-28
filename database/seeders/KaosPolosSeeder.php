<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Category;
use Illuminate\Database\Seeder;

class KaosPolosSeeder extends Seeder
{
    public function run(): void
    {
        // Get or create category
        $category = Category::firstOrCreate(
            ['slug' => 'kaos'],
            [
                'name' => 'Kaos',
                'description' => 'Koleksi kaos polos berkualitas.',
                'sort_order' => 1,
            ]
        );

        // Create configurable product
        $product = Product::create([
            'attribute_family_id' => 1, // Using default family
            'type' => 'configurable',
            'sku' => 'KAOS-POLOS-001',
            'name' => 'Kaos Polos Classic',
            'slug' => 'kaos-polos-classic',
            'url_key' => 'kaos-polos-classic',
            'short_description' => 'Kaos polos classic dengan bahan berkualitas tinggi. Tersedia dalam berbagai warna pilihan.',
            'description' => 'Kaos polos classic yang nyaman dipakai sehari-hari. Terbuat dari bahan katun premium yang adem dan menyerap keringan. Cocok untuk berbagai kesempatan santai.',
            'price' => 150000,
            'compare_at_price' => 200000,
            'stock' => 0, // Stock managed by variants
            'weight' => 0.25,
            'status' => true,
            'is_active' => true,
            'is_featured' => true,
            'visible_individually' => true,
            'guest_checkout' => true,
        ]);

        // Attach to category
        $product->categories()->attach($category->id);

        // Create variants with unique sizes for each color
        $variants = [
            [
                'color' => 'grey',
                'size' => 'S',
                'sku' => 'KAOS-POLOS-GREY-S',
                'name' => 'Kaos Polos Grey - S',
                'price' => 150000,
                'stock' => 50,
                'is_default' => true,
            ],
            [
                'color' => 'white',
                'size' => 'M',
                'sku' => 'KAOS-POLOS-WHITE-M',
                'name' => 'Kaos Polos White - M',
                'price' => 150000,
                'stock' => 50,
                'is_default' => false,
            ],
            [
                'color' => 'black',
                'size' => 'L',
                'sku' => 'KAOS-POLOS-BLACK-L',
                'name' => 'Kaos Polos Black - L',
                'price' => 150000,
                'stock' => 50,
                'is_default' => false,
            ],
        ];

        foreach ($variants as $index => $variantData) {
            ProductVariant::create([
                'product_id' => $product->id,
                'sku' => $variantData['sku'],
                'color' => $variantData['color'],
                'size' => $variantData['size'],
                'name' => $variantData['name'],
                'price' => $variantData['price'],
                'compare_at_price' => 200000,
                'stock' => $variantData['stock'],
                'weight' => 0.25,
                'images' => [], // Empty as requested - skip images
                'is_default' => $variantData['is_default'],
                'is_active' => true,
                'position' => $index + 1,
            ]);
        }

        $this->command->info('Kaos Polos Classic product created with 3 variants (Grey-S, White-M, Black-L).');
    }
}
