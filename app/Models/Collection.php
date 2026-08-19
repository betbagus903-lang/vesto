<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Collection extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'is_active',
        'sort_order',
        'layout_type',
        'content',
        'background_color',
        'start_date',
        'end_date',
        'cover_image',
        'badge',
        'color_theme',
        'visibility',
        'publish_status',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'content' => 'array',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function rules(): HasMany
    {
        return $this->hasMany(CollectionRule::class)->orderBy('sort_order');
    }

    public function banners(): HasMany
    {
        return $this->hasMany(Banner::class);
    }

    public function getProductsCountAttribute(): int
    {
        return $this->applyRules()->count();
    }

    public function applyRules()
    {
        $query = Product::query();

        foreach ($this->rules as $rule) {
            $query = $this->applyRule($query, $rule);
        }

        return $query;
    }

    private function applyRule($query, CollectionRule $rule)
    {
        $field = $rule->field;
        $operator = $rule->operator;
        $value = $rule->value;

        return match ($field) {
            'category' => $this->applyCategoryRule($query, $operator, $value),
            'price' => $this->applyPriceRule($query, $operator, $value),
            'discount' => $this->applyDiscountRule($query, $operator, $value),
            'stock' => $this->applyStockRule($query, $operator, $value),
            'status' => $this->applyStatusRule($query, $operator, $value),
            'created_date' => $this->applyCreatedDateRule($query, $operator, $value),
            default => $query,
        };
    }

    private function applyCategoryRule($query, $operator, $value)
    {
        return match ($operator) {
            '=' => $query->whereHas('categories', fn($q) => $q->where('id', $value)),
            'in' => $query->whereHas('categories', fn($q) => $q->whereIn('id', json_decode($value, true))),
            default => $query,
        };
    }

    private function applyPriceRule($query, $operator, $value)
    {
        return match ($operator) {
            '>' => $query->where('price', '>', $value),
            '<' => $query->where('price', '<', $value),
            '>=' => $query->where('price', '>=', $value),
            '<=' => $query->where('price', '<=', $value),
            '=' => $query->where('price', $value),
            default => $query,
        };
    }

    private function applyDiscountRule($query, $operator, $value)
    {
        return match ($operator) {
            '>=' => $query->where('discount_percent', '>=', $value),
            '<=' => $query->where('discount_percent', '<=', $value),
            '=' => $query->where('discount_percent', $value),
            default => $query,
        };
    }

    private function applyStockRule($query, $operator, $value)
    {
        return match ($operator) {
            '>' => $query->where('stock', '>', $value),
            '<' => $query->where('stock', '<', $value),
            '=' => $query->where('stock', $value),
            default => $query,
        };
    }

    private function applyStatusRule($query, $operator, $value)
    {
        return match ($operator) {
            '=' => $query->where('is_active', $value === 'active'),
            default => $query,
        };
    }

    private function applyCreatedDateRule($query, $operator, $value)
    {
        return match ($operator) {
            '>' => $query->where('created_at', '>', $value),
            '<' => $query->where('created_at', '<', $value),
            default => $query,
        };
    }
}
