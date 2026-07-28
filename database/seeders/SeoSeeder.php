<?php

namespace Database\Seeders;

use App\Models\SeoSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SeoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SeoSetting::create([
            'page_type' => 'homepage',
            'page_id' => null,
            'meta_title' => 'Vesto - Premium Fashion Store',
            'meta_description' => 'Premium Fashion Store with Modern Style. Shop the latest trends in men\'s and women\'s fashion.',
            'keywords' => 'fashion, clothes, men, women, vesto, premium, style, trendy',
            'og_image' => 'homepage.jpg',
            'canonical_url' => 'https://vesto.com',
            'auto_generate_meta' => true,
            'auto_generate_slug' => true,
            'auto_generate_keywords' => true,
            'auto_generate_description' => true,
            'robots_txt' => "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /cart\nDisallow: /checkout\nSitemap: https://vesto.com/sitemap.xml",
        ]);

        SeoSetting::create([
            'page_type' => 'products',
            'page_id' => null,
            'meta_title' => '{name} | Vesto',
            'meta_description' => 'Buy premium fashion online. {name} - High quality, affordable prices.',
            'keywords' => 'fashion, {name}, vesto, premium, online shop',
            'og_image' => null,
            'canonical_url' => null,
            'auto_generate_meta' => true,
            'auto_generate_slug' => true,
            'auto_generate_keywords' => true,
            'auto_generate_description' => true,
            'robots_txt' => null,
        ]);

        SeoSetting::create([
            'page_type' => 'categories',
            'page_id' => null,
            'meta_title' => '{name} Collection | Vesto',
            'meta_description' => 'Explore our {name} collection. Premium fashion items for every style.',
            'keywords' => '{name}, fashion, collection, vesto, premium',
            'og_image' => null,
            'canonical_url' => null,
            'auto_generate_meta' => true,
            'auto_generate_slug' => true,
            'auto_generate_keywords' => true,
            'auto_generate_description' => true,
            'robots_txt' => null,
        ]);

        SeoSetting::create([
            'page_type' => 'collections',
            'page_id' => null,
            'meta_title' => '{name} | Vesto Collections',
            'meta_description' => 'Discover our curated {name} collection. Handpicked fashion items.',
            'keywords' => '{name}, collection, fashion, vesto, curated',
            'og_image' => null,
            'canonical_url' => null,
            'auto_generate_meta' => true,
            'auto_generate_slug' => true,
            'auto_generate_keywords' => true,
            'auto_generate_description' => true,
            'robots_txt' => null,
        ]);
    }
}
