<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StorefrontController extends Controller
{
    private function navCategories(): \Illuminate\Support\Collection
    {
        // Ambil semua Root categories (parent_id null)
        $rootIds = Category::whereNull('parent_id')->pluck('id');

        if ($rootIds->isEmpty()) return collect();

        // Yang tampil = children langsung dari semua Root (Men, Women, dll)
        return Category::whereIn('parent_id', $rootIds)
            ->where('visible_in_menu', true)
            ->orderBy('position')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'logo_path']);
    }

    public function home()
    {
        $products = Product::where('status', true)
            ->where('is_active', true)
            ->with('categories:id,name,slug')
            ->latest()
            ->take(8)
            ->get([
                'id', 'name', 'slug', 'price', 'special_price',
                'special_price_from', 'special_price_to',
                'image', 'images', 'new', 'is_featured', 'status',
            ])
            ->map(fn($p) => $this->formatProduct($p));

        return Inertia::render('Home', [
            'products'   => $products,
            'categories' => $this->navCategories(),
        ]);
    }

    public function shop(Request $request)
    {
        $categories = $this->navCategories();

        $query = Product::where('status', true)
            ->where('is_active', true)
            ->with('categories:id,name,slug', 'variants')
            ->select(['id', 'name', 'slug', 'price', 'special_price', 'special_price_from', 'special_price_to', 'image', 'images', 'new', 'is_featured', 'status', 'type', 'attribute_family_id']);

        // Filter by category slug
        $activeCategoryId = null;
        $activeCategorySlug = '';
        $categoryParam = $request->route('category') ?? $request->get('category', '');
        if (!empty($categoryParam) && $categoryParam !== 'all') {
            $normalizedCategory = strtolower(trim($categoryParam));
            // Try original param first, then aliases
            $cat = Category::where('slug', $normalizedCategory)->first();
            if (!$cat) {
                $aliases = [
                    'mens' => 'men',
                    'womens' => 'women',
                ];
                $categorySlug = $aliases[$normalizedCategory] ?? $normalizedCategory;
                $cat = Category::where('slug', $categorySlug)->first();
            }
            if ($cat) {
                $activeCategoryId = $cat->id;
                $activeCategorySlug = $cat->slug;
                $query->whereHas('categories', fn($q) => $q->where('slug', $cat->slug));
            }
        }

        // Filter by price range
        if ($request->filled('price_min')) {
            $query->where('price', '>=', (float) $request->price_min);
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', (float) $request->price_max);
        }

        // Filter by color (based on variants) - OR logic within color group
        if ($request->filled('colors')) {
            $colors = is_array($request->colors)
                ? $request->colors
                : array_filter(array_map('trim', explode(',', $request->colors)));
            $colors = array_values(array_filter($colors));
            if (!empty($colors)) {
                $query->whereHas('variants', function ($q) use ($colors) {
                    $q->where(function ($inner) use ($colors) {
                        foreach ($colors as $color) {
                            $inner->orWhereRaw('LOWER(color) = ?', [strtolower($color)]);
                        }
                    })->where('is_active', true);
                });
            }
        }

        // Search
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) =>
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('short_description', 'like', "%{$s}%")
                  ->orWhere('sku', 'like', "%{$s}%")
            );
        }

        // Sort
        match ($request->get('sort', 'latest')) {
            'price_asc'  => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'name_asc'  => $query->orderBy('name', 'asc'),
            'name_desc' => $query->orderBy('name', 'desc'),
            default      => $query->latest(),
        };

        $perPage = $request->get('per_page', 10);
        $paginated = $query->paginate($perPage)->withQueryString();

        // Format products — kirim gambar sesuai warna filter aktif
        $activeColors = $request->filled('colors')
            ? array_values(array_filter(array_map('trim',
                is_array($request->colors) ? $request->colors : explode(',', $request->colors)
              )))
            : [];
        $primaryFilterColor = !empty($activeColors) ? strtolower($activeColors[0]) : null;

        $formattedProducts = collect($paginated->items())
            ->map(fn($p) => $this->formatProduct($p, false, $primaryFilterColor))
            ->values()->all();

        // Get price range for filter
        $priceRange = Product::where('status', true)
            ->where('is_active', true)
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();

        // Ensure min < max for slider to work
        if ($priceRange->min_price == $priceRange->max_price) {
            $priceRange->min_price = 0;
            $priceRange->max_price = max($priceRange->max_price * 2, 100000);
        }

        // Get filterable attributes
        $filterableAttributes = \App\Models\Attribute::where('is_filterable', true)
            ->with('options:id,admin_name,attribute_id')
            ->get(['id', 'code', 'admin_name', 'type']);

        // Get color filter data — eager load, no N+1
        $colorRows = \App\Models\ProductVariant::where('is_active', true)
            ->whereNotNull('color')
            ->where('color', '!=', '')
            ->selectRaw('color, COUNT(DISTINCT product_id) as cnt')
            ->groupBy('color')
            ->get();

        $colorFilters = $colorRows
            ->filter(fn($r) => $r->cnt > 0)
            ->map(fn($r) => ['name' => $r->color, 'count' => (int) $r->cnt])
            ->values()
            ->all();

        // Get active banners for current category
        $categoryBanners = [];
        $bannerQuery = \App\Models\Banner::active()
            ->where('link_type', 'category')
            ->sorted();

        if ($activeCategoryId) {
            // Kategori dipilih — cari banner spesifik kategori ini
            $categoryBanners = (clone $bannerQuery)
                ->where('link_id', $activeCategoryId)
                ->get()
                ->map(fn($b) => [
                    'id' => $b->id,
                    'title' => $b->title,
                    'subtitle' => $b->subtitle,
                    'image' => $b->image,
                    'button_text' => $b->button_text,
                    'button_link' => $b->button_link,
                    'link_type' => $b->link_type,
                    'link_id' => $b->link_id,
                ])
                ->toArray();
        }

        // Kalau gak ada banner spesifik, ambil banner pertama (default)
        if (empty($categoryBanners)) {
            $categoryBanners = (clone $bannerQuery)
                ->limit(1)
                ->get()
                ->map(fn($b) => [
                    'id' => $b->id,
                    'title' => $b->title,
                    'subtitle' => $b->subtitle,
                    'image' => $b->image,
                    'button_text' => $b->button_text,
                    'button_link' => $b->button_link,
                    'link_type' => $b->link_type,
                    'link_id' => $b->link_id,
                ])
                ->toArray();
        }

        // Also get general hero banners
        $heroBanners = \App\Models\Banner::active()
            ->where('type', 'hero_slider')
            ->sorted()
            ->limit(5)
            ->get()
            ->map(fn($b) => [
                'id' => $b->id,
                'title' => $b->title,
                'subtitle' => $b->subtitle,
                'image' => $b->image,
                'button_text' => $b->button_text,
                'button_link' => $b->button_link,
            ])
            ->toArray();

        return Inertia::render('Shop', [
            'products'          => $formattedProducts,
            'pagination'        => [
                'total'        => $paginated->total(),
                'per_page'     => $paginated->perPage(),
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'from'         => $paginated->firstItem() ?? 0,
                'to'           => $paginated->lastItem()  ?? 0,
            ],
            'categories'        => $categories,
            'activeCategory'    => $categoryParam ? (strtolower(trim($categoryParam)) === 'mens' ? 'men' : (strtolower(trim($categoryParam)) === 'womens' ? 'women' : strtolower(trim($categoryParam)))) : '',
            'search'            => $request->get('search', ''),
            'sort'              => $request->get('sort', 'latest'),
            'per_page'          => $perPage,
            'price_min'         => $request->get('price_min', $priceRange->min_price ?? 0),
            'price_max'         => $request->get('price_max', $priceRange->max_price ?? 100000),
            'price_range'       => [
                'min' => $priceRange->min_price ?? 0,
                'max' => $priceRange->max_price ?? 100000,
            ],
            'filterable_attributes' => $filterableAttributes,
            'color_filters' => $colorFilters,
            'colors'            => $request->filled('colors')
                ? array_values(array_filter(array_map('trim',
                    is_array($request->colors) ? $request->colors : explode(',', $request->colors)
                  )))
                : [],
            'categoryBanners'   => $categoryBanners,
            'heroBanners'       => $heroBanners,
        ]);
    }

    public function product(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->where('status', true)
            ->where('is_active', true)
            ->with('categories:id,name,slug', 'variants', 'attributeFamily.groups.custom_attributes.options')
            ->firstOrFail();

        $related = Product::where('status', true)
            ->where('is_active', true)
            ->where('id', '!=', $product->id)
            ->whereHas('categories', fn($q) =>
                $q->whereIn('categories.id', $product->categories->pluck('id'))
            )
            ->latest()
            ->take(4)
            ->get(['id', 'name', 'slug', 'price', 'special_price', 'image', 'images', 'new'])
            ->map(fn($p) => $this->formatProduct($p));

        // Get approved reviews for this product with replies
        $reviews = \App\Models\Review::with(['user', 'replies.user', 'helpfulLikes'])
            ->where('product_id', $product->id)
            ->where('status', 'approved')
            ->latest()
            ->get()
            ->map(function ($review) {
                // Sort replies: admin replies first, then by date
                $sortedReplies = $review->replies->sortBy(function ($reply) {
                    return [$reply->is_admin ? 0 : 1, $reply->created_at];
                })->values();

                // Check if current user liked this review
                $isLiked = auth()->check() ? $review->helpfulLikes->contains('user_id', auth()->id()) : false;

                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'title' => $review->title,
                    'comment' => $review->comment,
                    'images' => $review->images ? collect($review->images)->map(fn($img) => asset('storage/' . $img))->values()->all() : [],
                    'created_at' => $review->created_at->format('M d, Y'),
                    'helpful_count' => $review->helpfulLikes->count(),
                    'is_liked' => $isLiked,
                    'user' => [
                        'id' => $review->user->id,
                        'name' => $review->user->name,
                    ],
                    'replies' => $sortedReplies->map(function ($reply) {
                        return [
                            'id' => $reply->id,
                            'comment' => $reply->comment,
                            'is_admin' => $reply->is_admin,
                            'created_at' => $reply->created_at->format('M d, Y'),
                            'user' => [
                                'id' => $reply->user->id,
                                'name' => $reply->user->name,
                            ],
                        ];
                    })->values()->all(),
                ];
            });

        // Format variants - Show all active variants
        $variants = $product->variants
            ->filter(function ($variant) {
                return $variant->is_active;
            })
            ->map(function ($variant) use ($product) {
            // Send variant images as-is - don't fallback to parent images here
            // Frontend will handle the fallback logic
            $variantImages = $variant->images ?? [];
            // Convert images to full URLs
            $fullImageUrls = collect($variantImages)->map(function ($img) {
                return asset('storage/' . $img);
            })->values()->all();

            return [
                'id' => $variant->id,
                'sku' => $variant->sku,
                'color' => $variant->color,
                'size' => $variant->size,
                'neck' => $variant->neck,
                'sleeve' => $variant->sleeve,
                'name' => $variant->name,
                'price' => (float) ($variant->price ?? $product->price),
                'compare_at_price' => $variant->compare_at_price ? (float) $variant->compare_at_price : null,
                'stock' => $variant->stock ?? $product->stock,
                'images' => $fullImageUrls,
                'is_default' => $variant->is_default,
                'is_active' => $variant->is_active,
            ];
        })->values()->all();

        // Format attribute family for configurable products
        $configurableAttributes = [];
        if ($product->type === 'configurable' && $product->attributeFamily) {
            foreach ($product->attributeFamily->groups as $group) {
                foreach ($group->custom_attributes as $attribute) {
                    // Only include select/multiselect attributes that are configurable
                    if (($attribute->type === 'select' || $attribute->type === 'multiselect') && $attribute->is_configurable) {
                        $configurableAttributes[] = [
                            'id' => $attribute->id,
                            'code' => $attribute->code,
                            'admin_name' => $attribute->admin_name,
                            'type' => $attribute->type,
                            'options' => $attribute->options->map(fn($o) => [
                                'id' => $o->id,
                                'admin_name' => $o->admin_name,
                            ])->values()->all(),
                        ];
                    }
                }
            }
        }

        // Check if user can review this product (has delivered order)
        $canReview = false;
        if (auth()->check()) {
            $hasDeliveredOrder = \App\Models\Order::where('user_id', auth()->id())
                ->where('status', 'delivered')
                ->whereHas('items', function($query) use ($product) {
                    $query->where('product_id', $product->id);
                })
                ->exists();
            $canReview = $hasDeliveredOrder;
        }

        return Inertia::render('Product', [
            'product'    => $this->formatProduct($product, true),
            'variants'   => $variants,
            'related'    => $related,
            'categories' => $this->navCategories(),
            'configurableAttributes' => $configurableAttributes,
            'reviews'    => $reviews,
            'canReview'  => $canReview,
        ]);
    }

    private function formatProduct(Product $p, bool $full = false, ?string $filterColor = null): array
    {
        $images = is_array($p->images) ? $p->images : (json_decode($p->images ?? '[]', true) ?? []);
        $primaryImage = $p->image
            ? asset('storage/' . $p->image)
            : (count($images) > 0 ? asset('storage/' . $images[0]) : null);

        $now = now();
        $hasSale = $p->special_price &&
            (! $p->special_price_from || $now->gte($p->special_price_from)) &&
            (! $p->special_price_to   || $now->lte($p->special_price_to));

        // Untuk CONFIGURABLE products: ambil harga TERMURAH dari semua variants sebagai harga "pancingan"
        $displayPrice = $p->price;
        $displaySpecialPrice = $hasSale ? $p->special_price : null;
        
        // Pilih gambar berdasarkan: filter warna aktif → default variant → variant pertama → product image
        $variantForImage = null;
        if ($filterColor && $p->variants->isNotEmpty()) {
            $variantForImage = $p->variants->first(fn($v) =>
                strtolower(trim($v->color ?? '')) === $filterColor
            );
        }
        if (!$variantForImage) {
            $variantForImage = $p->variants->where('is_default', true)->first() ?? $p->variants->first();
        }
        
        // Jika product configurable dan ada variant
        if ($p->type === 'configurable' && $p->variants->isNotEmpty()) {
            // Ambil harga TERMURAH dari semua variants untuk display di listing
            $variantPrices = $p->variants->pluck('price')->filter()->toArray();
            if (!empty($variantPrices)) {
                $displayPrice = min($variantPrices);
            }
            
            // Ambil gambar dari variant yang dipilih
            if ($variantForImage && !empty($variantForImage->images) && is_array($variantForImage->images)) {
                $primaryImage = asset('storage/' . $variantForImage->images[0]);
            }
        } elseif ($variantForImage && !empty($variantForImage->images) && is_array($variantForImage->images)) {
            // Non-configurable tapi ada variant dengan gambar
            $primaryImage = asset('storage/' . $variantForImage->images[0]);
        }

        $data = [
            'id'            => $p->id,
            'name'          => $p->name,
            'slug'          => $p->slug,
            'type'          => $p->type,
            'price'         => (float) $displayPrice,
            'special_price' => $displaySpecialPrice ? (float) $displaySpecialPrice : null,
            'is_new'        => (bool) $p->new,
            'is_featured'   => (bool) $p->is_featured,
            'image'         => $primaryImage,
            'images'        => collect($images)->map(fn($img) => asset('storage/' . $img))->values()->all(),
            'categories'    => $p->categories->map(fn($c) => ['name' => $c->name, 'slug' => $c->slug]),
            'variants'      => $p->variants
                ->filter(function ($variant) {
                    return $variant->is_active;
                })
                ->map(function ($variant) {
                return [
                    'id' => $variant->id,
                    'color' => $variant->color,
                    'size' => $variant->size,
                    'neck' => $variant->neck,
                    'sleeve' => $variant->sleeve,
                    'price' => $variant->price ? (float) $variant->price : null,
                    'stock' => $variant->stock,
                    'image' => !empty($variant->images) && is_array($variant->images) && count($variant->images) > 0
                        ? asset('storage/' . $variant->images[0])
                        : null,
                    'is_default' => $variant->is_default,
                ];
            })->values()->all(),
        ];

        if ($full) {
            $allImages = collect($images)->map(fn($img) => asset('storage/' . $img))->values()->all();
            if ($p->image) array_unshift($allImages, asset('storage/' . $p->image));

            $data = array_merge($data, [
                'sku'               => $p->sku,
                'description'       => $p->description,
                'short_description' => $p->short_description,
                'stock'             => $p->stock,
                'images'            => array_unique($allImages),
            ]);
        }

        return $data;
    }
}
