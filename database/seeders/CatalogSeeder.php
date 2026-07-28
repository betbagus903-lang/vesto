<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Pria',
                'slug' => 'pria',
                'description' => 'Koleksi fashion pria terbaru.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Wanita',
                'slug' => 'wanita',
                'description' => 'Koleksi fashion wanita terbaru.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Aksesoris',
                'slug' => 'aksesoris',
                'description' => 'Aksesoris pelengkap gaya kamu.',
                'sort_order' => 3,
            ],
        ];

        foreach ($categories as $categoryData) {
            $category = Category::create($categoryData);

            Product::create([
                'category_id' => $category->id,
                'name' => "Sample {$category->name} Hoodie",
                'slug' => "sample-{$category->slug}-hoodie",
                'sku' => strtoupper("VESTO-{$category->slug}-001"),
                'description' => "Produk contoh untuk kategori {$category->name}.",
                'price' => 299000,
                'compare_at_price' => 399000,
                'stock' => 25,
                'is_active' => true,
                'is_featured' => $category->slug === 'pria',
            ]);
        }
    }
}
