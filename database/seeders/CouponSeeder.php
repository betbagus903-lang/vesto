<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $today = now();
        $in7Days = now()->addDays(7);
        $in30Days = now()->addDays(30);
        $in60Days = now()->addDays(60);
        $in90Days = now()->addDays(90);
        $lastMonth = now()->subDays(30);
        $lastWeek = now()->subDays(7);

        Coupon::create([
            'code' => 'WELCOME10',
            'description' => 'Welcome discount for new customers',
            'discount_type' => 'percentage',
            'discount_value' => 10.00,
            'minimum_order' => 0,
            'maximum_discount' => null,
            'start_date' => $lastWeek,
            'expire_date' => $in90Days,
            'usage_limit' => null,
            'per_customer_limit' => 1,
            'used_count' => 456,
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'NEWUSER20',
            'description' => 'Special discount for new users',
            'discount_type' => 'percentage',
            'discount_value' => 20.00,
            'minimum_order' => 50000,
            'maximum_discount' => 100000,
            'start_date' => $lastMonth,
            'expire_date' => $in60Days,
            'usage_limit' => 500,
            'per_customer_limit' => 1,
            'used_count' => 312,
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'FREESHIP',
            'description' => 'Free shipping on all orders',
            'discount_type' => 'free_shipping',
            'discount_value' => null,
            'minimum_order' => 100000,
            'maximum_discount' => null,
            'start_date' => $lastMonth,
            'expire_date' => $in90Days,
            'usage_limit' => null,
            'per_customer_limit' => 1,
            'used_count' => 892,
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'SAVE50K',
            'description' => 'Save Rp50.000 on your order',
            'discount_type' => 'fixed',
            'discount_value' => 50000.00,
            'minimum_order' => 200000,
            'maximum_discount' => null,
            'start_date' => $lastWeek,
            'expire_date' => $in30Days,
            'usage_limit' => 100,
            'per_customer_limit' => 1,
            'used_count' => 78,
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'VESTO15',
            'description' => 'Vesto exclusive 15% discount',
            'discount_type' => 'percentage',
            'discount_value' => 15.00,
            'minimum_order' => 100000,
            'maximum_discount' => 150000,
            'start_date' => $lastMonth,
            'expire_date' => $in60Days,
            'usage_limit' => 1000,
            'per_customer_limit' => 3,
            'used_count' => 567,
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'MEMBER25',
            'description' => 'Exclusive member discount',
            'discount_type' => 'percentage',
            'discount_value' => 25.00,
            'minimum_order' => 150000,
            'maximum_discount' => 200000,
            'start_date' => $lastWeek,
            'expire_date' => $in30Days,
            'usage_limit' => 50,
            'per_customer_limit' => 1,
            'used_count' => 42,
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'FLASH30',
            'description' => 'Flash sale - 30% off',
            'discount_type' => 'percentage',
            'discount_value' => 30.00,
            'minimum_order' => 200000,
            'maximum_discount' => 300000,
            'start_date' => $today,
            'expire_date' => $in7Days,
            'usage_limit' => 20,
            'per_customer_limit' => 1,
            'used_count' => 15,
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'VIP100',
            'description' => 'VIP exclusive - Rp100.000 off',
            'discount_type' => 'fixed',
            'discount_value' => 100000.00,
            'minimum_order' => 500000,
            'maximum_discount' => null,
            'start_date' => $lastMonth,
            'expire_date' => $lastWeek,
            'usage_limit' => 10,
            'per_customer_limit' => 1,
            'used_count' => 10,
            'is_active' => false,
        ]);
    }
}
