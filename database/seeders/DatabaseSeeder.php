<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CatalogSeeder::class,
            ProductCatalogSeeder::class,
            KaosPolosSeeder::class,
            CampaignSeeder::class,
            CouponSeeder::class,
            SeoSeeder::class,
        ]);
    }
}
