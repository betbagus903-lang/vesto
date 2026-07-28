<?php

namespace App\Services\AI\Tools;

use App\Models\Coupon;

class CouponTool extends BaseTool
{
    public function getName(): string
    {
        return 'create_coupon';
    }

    public function getDescription(): string
    {
        return 'Create a new discount coupon with specified parameters';
    }

    public function getParameters(): array
    {
        return [
            'code' => [
                'type' => 'string',
                'description' => 'Coupon code (e.g., SUMMER20)'
            ],
            'discount_type' => [
                'type' => 'string',
                'description' => 'Type of discount: percentage, fixed, free_shipping, or buy_x_get_y',
                'enum' => ['percentage', 'fixed', 'free_shipping', 'buy_x_get_y']
            ],
            'discount_value' => [
                'type' => 'number',
                'description' => 'Discount value (e.g., 20 for 20% or 50000 for Rp50.000)'
            ],
            'minimum_order' => [
                'type' => 'number',
                'description' => 'Minimum order amount required'
            ],
            'usage_limit' => [
                'type' => 'number',
                'description' => 'Total usage limit (null for unlimited)'
            ],
            'expire_date' => [
                'type' => 'string',
                'description' => 'Expiration date (YYYY-MM-DD format)'
            ],
            'description' => [
                'type' => 'string',
                'description' => 'Coupon description'
            ]
        ];
    }

    protected function getRequiredParameters(): array
    {
        return ['code', 'discount_type'];
    }

    public function execute(array $parameters): array
    {
        if (!$this->validate($parameters)) {
            return [
                'success' => false,
                'error' => 'Missing required parameters'
            ];
        }

        try {
            $coupon = Coupon::create([
                'code' => strtoupper($parameters['code']),
                'description' => $parameters['description'] ?? null,
                'discount_type' => $parameters['discount_type'],
                'discount_value' => $parameters['discount_value'] ?? null,
                'minimum_order' => $parameters['minimum_order'] ?? 0,
                'usage_limit' => $parameters['usage_limit'] ?? null,
                'expire_date' => $parameters['expire_date'] ?? null,
                'is_active' => true,
                'used_count' => 0,
                'per_customer_limit' => 1,
            ]);

            return [
                'success' => true,
                'data' => $coupon->toArray(),
                'message' => "Coupon '{$coupon->code}' created successfully"
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
