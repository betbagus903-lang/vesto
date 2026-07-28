<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable([
    'parent_id',
    'name',
    'slug',
    'description',
    'logo_path',
    'banner_path',
    'meta_title',
    'meta_keywords',
    'meta_description',
    'display_mode',
    'visible_in_menu',
    'position',
])]
class Category extends Model
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'position' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Category $category): void {
            if (blank($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    // Self-referencing relationships for hierarchy
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Many-to-Many relationship with Products
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }

    // Many-to-Many relationship with Attributes
    public function filterableAttributes(): BelongsToMany
    {
        return $this->belongsToMany(Attribute::class, 'category_attribute');
    }
}
