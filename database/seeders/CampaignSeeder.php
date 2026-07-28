<?php

namespace Database\Seeders;

use App\Models\Campaign;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $today = now();
        $in30Days = now()->addDays(30);
        $in7Days = now()->addDays(7);
        $in14Days = now()->addDays(14);
        $yesterday = now()->subDay();
        $lastMonth = now()->subDays(35);

        Campaign::create([
            'name' => 'Summer Sale 2026',
            'description' => 'Big summer sale with 20% discount on all men\'s fashion',
            'banner' => 'summer-sale.webp',
            'campaign_type' => 'category',
            'start_date' => $today,
            'end_date' => $in30Days,
            'status' => 'active',
            'button_text' => 'Shop Now',
            'button_url' => '/shop/men',
            'priority' => 5,
            'views' => 12450,
            'clicks' => 1245,
            'ctr' => 10.00,
        ]);

        Campaign::create([
            'name' => 'Accessories Week',
            'description' => 'Special promotion on all accessories',
            'banner' => 'accessories-week.webp',
            'campaign_type' => 'category',
            'start_date' => $in7Days,
            'end_date' => $in14Days,
            'status' => 'scheduled',
            'button_text' => 'Explore',
            'button_url' => '/shop/accessories',
            'priority' => 3,
            'views' => 0,
            'clicks' => 0,
            'ctr' => 0.00,
        ]);

        Campaign::create([
            'name' => 'Clearance Sale',
            'description' => 'Final clearance sale - up to 70% off',
            'banner' => 'clearance-sale.webp',
            'campaign_type' => 'homepage',
            'start_date' => $lastMonth,
            'end_date' => $yesterday,
            'status' => 'finished',
            'button_text' => 'Shop Clearance',
            'button_url' => '/shop',
            'priority' => 2,
            'views' => 8532,
            'clicks' => 945,
            'ctr' => 11.08,
        ]);
    }
}
