<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    protected $fillable = [
        'order_number', 'customer_id', 'user_id', 'status', 'channel',
        'subtotal', 'tax', 'shipping_amount', 'discount', 'grand_total',
        'payment_status', 'notes',
        'payment_method', 'shipping_method', 'shipping_cost', 'billing_address_id',
    ];

    protected $casts = [
        'subtotal'        => 'decimal:2',
        'tax'             => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'discount'        => 'decimal:2',
        'grand_total'     => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->order_number)) {
                $order->order_number = 'ORD-' . strtoupper(uniqid());
            }
        });
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shipment(): HasOne
    {
        return $this->hasOne(Shipment::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    public function billingAddress(): BelongsTo
    {
        return $this->belongsTo(OrderAddress::class, 'billing_address_id');
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(OrderAddress::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
