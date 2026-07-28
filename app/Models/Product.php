<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable([
    'attribute_family_id',
    'type',
    'sku',
    'product_number',
    'name',
    'slug',
    'url_key',
    'short_description',
    'description',
    'price',
    'compare_at_price',
    'special_price',
    'special_price_from',
    'special_price_to',
    'cost_price',
    'stock',
    'weight',
    'width',
    'height',
    'length',
    'tax_category_id',
    'meta_title',
    'meta_keywords',
    'meta_description',
    'new',
    'featured',
    'visible_individually',
    'status',
    'guest_checkout',
    'allow_rma',
    'rma_rules',
    'image',
    'images',
    'videos',
    'is_active',
    'is_featured',
])]
class Product extends Model
{
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'special_price' => 'decimal:2',
            'cost_price' => 'decimal:2',
            'special_price_from' => 'datetime',
            'special_price_to' => 'datetime',
            'stock' => 'integer',
            'weight' => 'decimal:2',
            'width' => 'decimal:2',
            'height' => 'decimal:2',
            'length' => 'decimal:2',
            'images' => 'array',
            'videos' => 'array',
            'new' => 'boolean',
            'featured' => 'boolean',
            'visible_individually' => 'boolean',
            'status' => 'boolean',
            'guest_checkout' => 'boolean',
            'allow_rma' => 'boolean',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    protected function appends(): array
    {
        return ['thumbnail_url'];
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        $images = $this->images ?? [];
        if (count($images) > 0) {
            return asset('storage/' . $images[0]);
        }
        return null;
    }

    protected static function booted(): void
    {
        static::saving(function (Product $product): void {
            if (blank($product->slug)) {
                $baseSlug = Str::slug($product->name);
                $slug = $baseSlug;
                $counter = 1;

                // Ensure unique slug
                while (self::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                    $slug = $baseSlug . '-' . $counter++;
                }

                $product->slug = $slug;
            }
            if (blank($product->url_key)) {
                $baseKey = Str::slug($product->name);
                $urlKey = $baseKey;
                $counter = 1;

                // Ensure unique url_key
                while (self::where('url_key', $urlKey)->where('id', '!=', $product->id)->exists()) {
                    $urlKey = $baseKey . '-' . $counter++;
                }

                $product->url_key = $urlKey;
            }
            if (!blank($product->sku)) {
                $product->sku = strtoupper($product->sku);
            }
        });
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function relatedProducts(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_related', 'product_id', 'related_product_id');
    }

    public function upSellProducts(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_up_sell', 'product_id', 'up_sell_product_id');
    }

    public function crossSellProducts(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_cross_sell', 'product_id', 'cross_sell_product_id');
    }

    public function groupProducts(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_group', 'group_id', 'product_id');
    }

    public function attributeFamily(): BelongsTo
    {
        return $this->belongsTo(AttributeFamily::class);
    }

    public function taxCategory(): BelongsTo
    {
        return $this->belongsTo(TaxCategory::class);
    }

    public function attributeValues(): HasMany
    {
        return $this->hasMany(ProductAttributeValue::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('position')->orderBy('id');
    }

    public function groupedProducts(): HasMany
    {
        return $this->hasMany(GroupedProduct::class, 'parent_product_id')->orderBy('position');
    }

    public function bundleProducts(): HasMany
    {
        return $this->hasMany(BundleProduct::class, 'parent_product_id')->orderBy('position');
    }

    public function downloadableProduct(): HasMany
    {
        return $this->hasMany(DownloadableProduct::class);
    }

    public function configurableAttributes(): HasMany
    {
        return $this->hasMany(ConfigurableAttribute::class);
    }

    // Product Type Helpers
    public function isSimple(): bool
    {
        return $this->type === 'simple';
    }

    public function isConfigurable(): bool
    {
        return $this->type === 'configurable';
    }

    public function isGrouped(): bool
    {
        return $this->type === 'grouped';
    }

    public function isBundle(): bool
    {
        return $this->type === 'bundle';
    }

    public function isVirtual(): bool
    {
        return $this->type === 'virtual';
    }

    public function isDownloadable(): bool
    {
        return $this->type === 'downloadable';
    }

    // Section Visibility Helpers
    public function shouldShowInventory(): bool
    {
        return !$this->isVirtual() && !$this->isDownloadable();
    }

    public function shouldShowShipping(): bool
    {
        return !$this->isVirtual() && !$this->isDownloadable();
    }

    public function shouldShowWeightDimensions(): bool
    {
        return !$this->isVirtual() && !$this->isDownloadable();
    }

    public function shouldShowVariants(): bool
    {
        return $this->isConfigurable();
    }

    public function shouldShowGroupedProducts(): bool
    {
        return $this->isGrouped();
    }

    public function shouldShowBundleOptions(): bool
    {
        return $this->isBundle();
    }

    public function shouldShowDownloadableSection(): bool
    {
        return $this->isDownloadable();
    }

    public function shouldShowConfigureAttributes(): bool
    {
        return $this->isConfigurable();
    }
}
