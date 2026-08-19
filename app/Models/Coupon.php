<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'description',
        'discount_type',
        'discount_value',
        'minimum_order',
        'maximum_discount',
        'start_date',
        'expire_date',
        'usage_limit',
        'per_customer_limit',
        'used_count',
        'applicable_categories',
        'applicable_products',
        'customer_groups',
        'is_active',
    ];

    protected $casts = [
        'applicable_categories' => 'array',
        'applicable_products' => 'array',
        'customer_groups' => 'array',
        'start_date' => 'date',
        'expire_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function userCoupons(): HasMany
    {
        return $this->hasMany(UserCoupon::class);
    }

    public function getStatusAttribute()
    {
        if (!$this->is_active) {
            return 'disabled';
        }

        $now = now();

        if ($this->expire_date && $now->gt($this->expire_date)) {
            return 'expired';
        }

        if ($this->start_date && $now->lt($this->start_date)) {
            return 'scheduled';
        }

        return 'active';
    }
}
