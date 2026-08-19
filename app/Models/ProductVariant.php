<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'sku',
        'color',
        'size',
        'name',
        'price',
        'compare_at_price',
        'stock',
        'weight',
        'images',
        'design_layout',
        'is_default',
        'is_active',
        'position',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_at_price' => 'decimal:2',
        'stock' => 'integer',
        'images' => 'array',
        'design_layout' => 'array',
        'is_default' => 'boolean',
        'is_active' => 'boolean',
        'position' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getDisplayPriceAttribute(): float
    {
        return $this->price ?? $this->product->price ?? 0;
    }

    public function getDisplayStockAttribute(): int
    {
        return $this->stock ?? $this->product->stock ?? 0;
    }

    public function getDisplayImageAttribute(): ?string
    {
        if (!empty($this->images) && is_array($this->images) && count($this->images) > 0) {
            return asset('storage/' . $this->images[0]);
        }
        return $this->product->image ? asset('storage/' . $this->product->image) : null;
    }
}
