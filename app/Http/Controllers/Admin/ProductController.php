<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductAttributeValue;
use App\Models\Attribute;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    private const ADMIN_ROOT_VIEW = 'admin';

    public function index(Request $request)
    {
        $query = Product::with('categories')->withCount('categories');

        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('sku', 'like', '%' . $request->search . '%');
        }

        if ($request->has('status') && $request->status) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        if ($request->has('category_id') && $request->category_id) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->category_id);
            });
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 10);
        $products = $query->paginate($perPage);

        // Format products to ensure images are properly serialized
        $formattedProducts = collect($products->items())->map(function ($product) {
            $productArray = $product->toArray();
            $productArray['images'] = $product->images ?? [];
            return $productArray;
        })->values()->all();

        return Inertia::render('Admin/Products/Index', [
            'products' => $formattedProducts,
            'pagination' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ],
            'filters' => [
                'search' => $request->get('search', ''),
                'status' => $request->get('status', ''),
                'type' => $request->get('type', ''),
                'category_id' => $request->get('category_id', ''),
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'per_page' => $perPage,
            ],
            'categories' => \App\Models\Category::all(),
            'attributeFamilies' => \App\Models\AttributeFamily::all(),
        ], self::ADMIN_ROOT_VIEW);
    }

    // --- FUNGSI CREATE YANG SUDAH DIPERBAIKI ---
    public function create()
    {
        $allCategories = \App\Models\Category::orderBy('position')->orderBy('name')->get();
        $categories = $this->buildTree($allCategories);
        $attributeFamilies = \App\Models\AttributeFamily::all();
        $taxCategories = \App\Models\TaxCategory::all();
        $allProducts = Product::select('id', 'name', 'sku')->get();

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories,
            'attributeFamilies' => $attributeFamilies,
            'taxCategories' => $taxCategories,
            'allProducts' => $allProducts,
        ], self::ADMIN_ROOT_VIEW);
    }
    
    /**
     * Build tree structure from flat category list
     */
    private function buildTree($categories, $parentId = null)
    {
        $tree = [];
        foreach ($categories as $category) {
            if (($parentId === null && ($category->parent_id === null || $category->parent_id == 0)) || 
                $category->parent_id == $parentId) {
                $children = $this->buildTree($categories, $category->id);
                $tree[] = [
                    'id' => $category->id,
                    'name' => $category->name,
                    'children' => $children,
                ];
            }
        }
        return $tree;
    }

    // --- FUNGSI STORE YANG SUDAH DIPERBAIKI ---
    public function store(Request $request)
    {
        $validated = $this->validateProduct($request);

        $productData = $this->extractProductData($validated);
        $productData['price'] = $productData['price'] ?? 0;
        $productData['stock'] = $productData['stock'] ?? 0;

        // For virtual/downloadable products, set stock to null or 0
        if (in_array($productData['type'], ['virtual', 'downloadable'])) {
            $productData['stock'] = 0;
        }

        $product = Product::create($productData);

        $this->syncProductRelations($product, $validated);
        $this->syncAttributeValues($product, $request->input('attribute_values', []));

        // Handle type-specific data
        $this->handleTypeSpecificData($product, $request);

        // Redirect based on product type
        if ($product->type === 'configurable') {
            // For configurable products, return to index with modal for variant selection
            return Inertia::render('Admin/Products/Index', [
                'products' => Product::with('categories')->paginate(10)->items(),
                'pagination' => [
                    'total' => 0,
                    'per_page' => 10,
                    'current_page' => 1,
                    'last_page' => 1,
                    'from' => 0,
                    'to' => 0,
                ],
                'filters' => [
                    'search' => '',
                    'status' => '',
                    'type' => '',
                    'category_id' => '',
                    'sort_by' => 'created_at',
                    'sort_order' => 'desc',
                    'per_page' => 10,
                ],
                'categories' => \App\Models\Category::all(),
                'attributeFamilies' => \App\Models\AttributeFamily::all(),
                'createdProduct' => $this->serializeCreatedProduct($product),
            ], self::ADMIN_ROOT_VIEW)->with('success', 'Product berhasil dibuat.');
        } else {
            // For simple and other types, redirect directly to edit page
            return redirect()->route('admin.products.configurableedit', $product->id)->with('success', 'Product berhasil dibuat.');
        }
    }

    // --- FUNGSI SHOW YANG SUDAH DITAMBAHKAN ---
    public function show($id)
    {
        $product = Product::with([
            'categories',
            'relatedProducts',
            'upSellProducts',
            'crossSellProducts',
            'groupProducts',
            'attributeFamily',
            'taxCategory'
        ])->findOrFail($id);

        // Ensure images array is properly serialized
        $productArray = $product->toArray();
        $productArray['images'] = $product->images ?? [];

        return Inertia::render('Admin/Products/Show', [
            'product' => $productArray,
        ], self::ADMIN_ROOT_VIEW);
    }

    public function edit($id)
    {
        $product = Product::findOrFail($id);

        // Redirect to configurable edit if product type is configurable
        if ($product->type === 'configurable') {
            return redirect()->route('admin.products.configurableedit', $id);
        }

        $product = Product::with([
            'categories',
            'relatedProducts',
            'upSellProducts',
            'crossSellProducts',
            'groupProducts',
            'attributeFamily.groups.custom_attributes.options',
            'attributeValues.attribute',
            'taxCategory',
            'groupedProducts.associatedProduct',
            'bundleProducts.associatedProduct',
            'downloadableProduct',
            'configurableAttributes.attribute',
        ])->findOrFail($id);

        $allCategories = \App\Models\Category::orderBy('position')->orderBy('name')->get();
        $categories = $this->buildTree($allCategories);
        $attributeFamilies = \App\Models\AttributeFamily::all();
        $taxCategories     = \App\Models\TaxCategory::all();
        $allProducts       = Product::select('id', 'name', 'sku')->where('id', '!=', $id)->get();

        // Build a flat keyed map of existing attribute values: attribute_id => display value
        $existingValues = [];
        foreach ($product->attributeValues as $av) {
            $existingValues[$av->attribute_id] = $av->getValue($av->attribute->type ?? 'text');
        }

        // Build groups structure for the front-end
        $familyGroups = [];
        if ($product->attributeFamily) {
            foreach ($product->attributeFamily->groups as $group) {
                $familyGroups[] = [
                    'id'         => $group->id,
                    'name'       => $group->name,
                    'position'   => $group->position,
                    'attributes' => $group->custom_attributes->map(fn($attr) => [
                        'id'                  => $attr->id,
                        'code'                => $attr->code,
                        'admin_name'          => $attr->admin_name,
                        'type'                => $attr->type,
                        'is_required'         => $attr->is_required,
                        'is_unique'           => $attr->is_unique,
                        'value_per_locale'    => $attr->value_per_locale,
                        'value_per_channel'   => $attr->value_per_channel,
                        'options'             => $attr->options->map(fn($o) => [
                            'id'         => $o->id,
                            'admin_name' => $o->admin_name,
                            'sort_order' => $o->sort_order,
                        ])->values()->all(),
                    ])->values()->all(),
                ];
            }
        }

        // Load type-specific data
        $typeSpecificData = [];
        switch ($product->type) {
            case 'grouped':
                $typeSpecificData['grouped_products'] = $product->groupedProducts->map(fn($gp) => [
                    'id' => $gp->id,
                    'associated_product_id' => $gp->associated_product_id,
                    'associated_product' => $gp->associatedProduct,
                    'quantity' => $gp->quantity,
                    'position' => $gp->position,
                ])->values()->all();
                break;
            case 'bundle':
                $typeSpecificData['bundle_products'] = $product->bundleProducts->map(fn($bp) => [
                    'id' => $bp->id,
                    'associated_product_id' => $bp->associated_product_id,
                    'associated_product' => $bp->associatedProduct,
                    'quantity' => $bp->quantity,
                    'is_required' => $bp->is_required,
                    'is_default' => $bp->is_default,
                    'position' => $bp->position,
                ])->values()->all();
                break;
            case 'downloadable':
                $typeSpecificData['downloadable'] = $product->downloadableProduct->first() ? [
                    'file_path' => $product->downloadableProduct->first()->file_path,
                    'sample_file_path' => $product->downloadableProduct->first()->sample_file_path,
                    'download_limit' => $product->downloadableProduct->first()->download_limit,
                    'expiry_date' => $product->downloadableProduct->first()->expiry_date,
                ] : null;
                break;
            case 'configurable':
                $typeSpecificData['configurable_attributes'] = $product->configurableAttributes->pluck('attribute_id')->values()->all();
                $typeSpecificData['variants'] = $product->variants->map(fn($variant) => [
                    'id' => $variant->id,
                    'name' => $variant->name,
                    'sku' => $variant->sku,
                    'price' => $variant->price,
                    'compare_at_price' => $variant->compare_at_price,
                    'stock' => $variant->stock,
                    'images' => $variant->images,
                    'is_default' => $variant->is_default,
                    'is_active' => $variant->is_active,
                    'position' => $variant->position,
                ])->values()->all();
                break;
        }

        return Inertia::render('Admin/Products/Edit', [
            'product'           => $product,
            'categories'        => $categories,
            'attributeFamilies' => $attributeFamilies,
            'taxCategories'     => $taxCategories,
            'allProducts'       => $allProducts,
            'familyGroups'      => $familyGroups,
            'existingValues'    => $existingValues,
            'attributeFamily'   => $product->attributeFamily ? [
                'id'   => $product->attributeFamily->id,
                'name' => $product->attributeFamily->name,
            ] : null,
            'typeSpecificData'  => $typeSpecificData,
        ], self::ADMIN_ROOT_VIEW);
    }

    public function configurableEdit($id)
    {
        $product = Product::with([
            'categories',
            'relatedProducts',
            'upSellProducts',
            'crossSellProducts',
            'groupProducts',
            'attributeFamily.groups.custom_attributes.options',
            'attributeValues.attribute',
            'taxCategory',
            'groupedProducts.associatedProduct',
            'bundleProducts.associatedProduct',
            'downloadableProduct',
            'configurableAttributes.attribute',
        ])->findOrFail($id);

        // Load variants separately to ensure they're loaded
        $product->load('variants');

        $allCategories = \App\Models\Category::orderBy('position')->orderBy('name')->get();
        $categories = $this->buildTree($allCategories);
        $attributeFamilies = \App\Models\AttributeFamily::all();
        $taxCategories     = \App\Models\TaxCategory::all();
        $allProducts       = Product::select('id', 'name', 'sku')->where('id', '!=', $id)->get();

        // Build a flat keyed map of existing attribute values: attribute_id => display value
        $existingValues = [];
        foreach ($product->attributeValues as $av) {
            $existingValues[$av->attribute_id] = $av->getValue($av->attribute->type ?? 'text');
        }

        // Build groups structure for the front-end
        $familyGroups = [];
        if ($product->attributeFamily) {
            foreach ($product->attributeFamily->groups as $group) {
                $familyGroups[] = [
                    'id'         => $group->id,
                    'name'       => $group->name,
                    'position'   => $group->position,
                    'attributes' => $group->custom_attributes->map(fn($attr) => [
                        'id'                  => $attr->id,
                        'code'                => $attr->code,
                        'admin_name'          => $attr->admin_name,
                        'type'                => $attr->type,
                        'is_required'         => $attr->is_required,
                        'is_unique'           => $attr->is_unique,
                        'value_per_locale'    => $attr->value_per_locale,
                        'value_per_channel'   => $attr->value_per_channel,
                        'options'             => $attr->options->map(fn($o) => [
                            'id'         => $o->id,
                            'admin_name' => $o->admin_name,
                            'sort_order' => $o->sort_order,
                        ])->values()->all(),
                    ])->values()->all(),
                ];
            }
        }

        // Load type-specific data for configurable products
        $typeSpecificData = [];
        $typeSpecificData['configurable_attributes'] = $product->configurableAttributes->pluck('attribute_id')->values()->all();

        \Log::info('ConfigurableEdit - Product ID: ' . $product->id . ', Variants count: ' . $product->variants->count());
        \Log::info('ConfigurableEdit - Variants loaded: ' . ($product->relationLoaded('variants') ? 'Yes' : 'No'));

        $typeSpecificData['variants'] = $product->variants->map(function($variant) {
            \Log::info('Variant data for configurableEdit', [
                'id' => $variant->id,
                'name' => $variant->name,
                'sku' => $variant->sku,
                'images' => $variant->images,
                'images_type' => gettype($variant->images),
            ]);
            return [
                'id' => $variant->id,
                'name' => $variant->name,
                'sku' => $variant->sku,
                'price' => $variant->price,
                'compare_at_price' => $variant->compare_at_price,
                'stock' => $variant->stock,
                'images' => $variant->images,
                'is_default' => $variant->is_default,
                'is_active' => $variant->is_active,
                'position' => $variant->position,
            ];
        })->values()->all();

        return Inertia::render('Admin/Products/ConfigurableEdit', [
            'product'           => $product,
            'categories'        => $categories,
            'attributeFamilies' => $attributeFamilies,
            'taxCategories'     => $taxCategories,
            'allProducts'       => $allProducts,
            'familyGroups'      => $familyGroups,
            'existingValues'    => $existingValues,
            'attributeFamily'   => $product->attributeFamily ? [
                'id'   => $product->attributeFamily->id,
                'name' => $product->attributeFamily->name,
            ] : null,
            'typeSpecificData'  => $typeSpecificData,
        ], self::ADMIN_ROOT_VIEW);
    }

    public function update(Request $request, $id)
    {
        $product = Product::with('categories')->findOrFail($id);

        $validated = $this->validateProduct($request, $id);

        $productData = $this->extractProductData($validated);

        // For virtual/downloadable products, set stock to null or 0
        $productType = $productData['type'] ?? $product->type;
        if (in_array($productType, ['virtual', 'downloadable'])) {
            $productData['stock'] = 0;
        }

        $product->update($productData);

        if ($request->hasFile('new_images')) {
            $images = $product->images ?? [];
            foreach ($request->file('new_images') as $file) {
                $images[] = $file->store('products', 'public');
            }
            $product->images = $images;
            $product->save();
        }

        $this->syncProductRelations($product, $validated);
        $this->syncAttributeValues($product, $request->input('attribute_values', []));

        // Handle type-specific data
        $this->handleTypeSpecificData($product, $request);

        return redirect()->route('admin.products.index')->with('success', 'Product berhasil diperbarui.');
    }

    public function uploadImage(Request $request, $id)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $product = Product::findOrFail($id);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');

            $images = $product->images ?? [];
            $images[] = $path;
            $product->images = $images;
            $product->save();

            return response()->json(['message' => 'Image uploaded successfully', 'path' => $path]);
        }

        return response()->json(['message' => 'No image uploaded'], 400);
    }

    public function uploadVariantImage(Request $request, $variantId)
    {
        try {
            \Log::info('uploadVariantImage called', ['variant_id' => $variantId, 'has_file' => $request->hasFile('image')]);
            
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            ]);

            $variant = \App\Models\ProductVariant::findOrFail($variantId);

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $images = $variant->images ?? [];
                $images[] = $path;
                $variant->images = $images;
                $variant->save();
                \Log::info('Image uploaded and saved to variant', ['path' => $path, 'variant_id' => $variantId]);
                return response()->json(['message' => 'Image uploaded successfully', 'path' => $path], 200);
            }

            return response()->json(['message' => 'No image uploaded'], 400);
        } catch (\Exception $e) {
            \Log::error('uploadVariantImage error', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Upload failed: ' . $e->getMessage()], 500);
        }
    }

    public function updateVariant(Request $request, $variantId)
    {
        try {
            \Log::info('=== updateVariant START ===', ['variant_id' => $variantId]);
            \Log::info('Request all', $request->all());
            \Log::info('Request files', $request->allFiles());

            $variant = \App\Models\ProductVariant::findOrFail($variantId);
            \Log::info('Original variant', $variant->toArray());

            $request->validate([
                'name' => 'required|string|max:255',
                'sku' => 'required|string|max:255|unique:product_variants,sku,' . $variantId,
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'weight' => 'nullable|numeric',
                'is_active' => 'nullable',
                'existing_images' => 'nullable|array',
                'existing_images.*' => 'string',
                // Skip validation for new_images array — validate manually below
            ]);

            // Upload new images with manual validation
            $uploadedPaths = [];
            // Check for new_images in both array format and single file format
            $newImagesFiles = $request->file('new_images');
            \Log::info('New images files check', ['has_file' => $request->hasFile('new_images'), 'files' => $newImagesFiles]);
            
            if ($newImagesFiles) {
                if (!is_array($newImagesFiles)) {
                    $newImagesFiles = [$newImagesFiles];
                }
                
                foreach ($newImagesFiles as $file) {
                    // Skip if file is null or invalid
                    if (!$file || !$file->isValid()) {
                        \Log::warning('Skipping invalid file', ['file' => $file]);
                        continue;
                    }
                    
                    // Manual validation
                    $allowedMimes = ['jpeg', 'png', 'jpg', 'gif', 'svg', 'webp'];
                    $extension = strtolower($file->getClientOriginalExtension());
                    if (!in_array($extension, $allowedMimes)) {
                        throw new \Exception("File type .{$extension} is not allowed. Allowed: " . implode(', ', $allowedMimes));
                    }
                    if ($file->getSize() > 2048 * 1024) { // 2MB max
                        throw new \Exception('File size exceeds 2MB limit.');
                    }
                    
                    $path = $file->store('products', 'public');
                    $uploadedPaths[] = $path;
                    \Log::info('Uploaded new image', ['path' => $path]);
                }
            }

            // Get existing images - if not provided, use original variant images!
            $existingImagesFromRequest = $request->input('existing_images', null);
            
            // Handle FormData array format (existing_images[0], existing_images[1], etc.)
            if (is_array($existingImagesFromRequest)) {
                // Already an array, use it directly
                $existingImagesFromRequest = array_values($existingImagesFromRequest);
            } elseif ($existingImagesFromRequest === null || $existingImagesFromRequest === '') {
                // Empty or null means user wants to remove all existing images
                $existingImagesFromRequest = [];
            } elseif (is_string($existingImagesFromRequest)) {
                // Try JSON decode first
                $decoded = json_decode($existingImagesFromRequest, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $existingImagesFromRequest = $decoded;
                } else {
                    // If not valid JSON, treat as single value or fallback to original
                    $existingImagesFromRequest = $variant->images ?? [];
                }
            } else {
                // Fallback to original images
                $existingImagesFromRequest = $variant->images ?? [];
            }
            
            // Ensure it's always an array
            if (!is_array($existingImagesFromRequest)) {
                $existingImagesFromRequest = [];
            }
            \Log::info('Existing images from request', ['existing' => $existingImagesFromRequest]);

            // Merge all images
            $allImages = array_merge($existingImagesFromRequest, $uploadedPaths);
            \Log::info('All images to save', ['all' => $allImages]);

            // Update variant manually
            $variant->name = $request->name;
            $variant->sku = $request->sku;
            $variant->price = $request->price;
            $variant->stock = $request->stock;
            $variant->weight = $request->weight;
            $variant->is_active = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
            $variant->images = $allImages;
            $variant->save();

            $variantFresh = $variant->fresh();
            \Log::info('Variant after save', $variantFresh->toArray());

            return response()->json(['success' => true, 'variant' => $variantFresh]);
        } catch (\Exception $e) {
            \Log::error('updateVariant ERROR: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function storeVariant(Request $request, $productId)
    {
        $product = Product::with('configurableAttributes.attribute.options')->findOrFail($productId);

        // Validate that product is configurable
        if ($product->type !== 'configurable') {
            return response()->json([
                'message' => 'Only configurable products can have variants'
            ], 400);
        }

        $request->validate([
            'attributes' => 'required|array',
        ]);

        // Get configurable attributes from RELATION (not JSON field)
        if ($product->configurableAttributes->isEmpty()) {
            return response()->json([
                'message' => 'No configurable attributes found for this product. Please configure attributes first.'
            ], 400);
        }

        // Build variant name from attribute values
        $variantNameParts = [];
        $attributeValues = [];

        foreach ($product->configurableAttributes as $configAttr) {
            $attribute = $configAttr->attribute;
            if (!$attribute) continue;

            $inputValue = $request->input("attributes.{$attribute->code}");
            if (!$inputValue) {
                if ($attribute->is_required) {
                    return response()->json([
                        'errors' => [$attribute->code => ["{$attribute->admin_name} is required"]]
                    ], 422);
                }
                continue;
            }

            // Get option label if it's a select type
            if ($attribute->type === 'select' && $attribute->options) {
                $option = $attribute->options->firstWhere('id', $inputValue);
                if ($option) {
                    $variantNameParts[] = $option->admin_name;
                    $attributeValues[$attribute->code] = $option->admin_name;
                } else {
                    $variantNameParts[] = $inputValue;
                    $attributeValues[$attribute->code] = $inputValue;
                }
            } else {
                $variantNameParts[] = $inputValue;
                $attributeValues[$attribute->code] = $inputValue;
            }
        }

        $variantName = $product->name . ' - ' . implode(' / ', $variantNameParts);

        // Generate unique SKU
        $baseSku = $product->sku . '-' . strtoupper(substr(md5($variantName), 0, 6));
        $sku = $baseSku;
        $counter = 1;
        while (\App\Models\ProductVariant::where('sku', $sku)->exists()) {
            $sku = $baseSku . '-' . $counter;
            $counter++;
        }

        // Create variant
        $variant = \App\Models\ProductVariant::create([
            'product_id' => $product->id,
            'name' => $variantName,
            'sku' => $sku,
            'price' => $product->price,
            'stock' => 0,
            'is_active' => true,
            'is_default' => false,
            'color' => $attributeValues['color'] ?? null,
            'size' => $attributeValues['size'] ?? null,
            'images' => [],
        ]);

        return response()->json([
            'message' => 'Variant created successfully',
            'variant' => $variant
        ]);
    }

    public function destroyVariant($variantId)
    {
        $variant = \App\Models\ProductVariant::findOrFail($variantId);
        $variant->delete();

        return redirect()->back()->with('success', 'Variant deleted successfully');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product berhasil dihapus.');
    }

    // --- FUNGSI BULK ACTIONS & DUPLICATE ---
    // Perhatikan, fungsi-fungsi ini berada di luar fungsi destroy()

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:products,id'
        ]);

        Product::whereIn('id', $request->ids)->delete();

        return redirect()->route('admin.products.index')->with('success', 'Products berhasil dihapus.');
    }

    public function bulkActivate(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:products,id'
        ]);

        Product::whereIn('id', $request->ids)->update(['is_active' => true]);

        return redirect()->route('admin.products.index')->with('success', 'Products berhasil diaktifkan.');
    }

    public function bulkDeactivate(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:products,id'
        ]);

        Product::whereIn('id', $request->ids)->update(['is_active' => false]);

        return redirect()->route('admin.products.index')->with('success', 'Products berhasil dinonaktifkan.');
    }

    public function duplicate($id)
    {
        $product = Product::findOrFail($id);

        $newProduct = $product->replicate();
        $newProduct->sku = $product->sku . '-copy-' . time();
        $newProduct->name = $product->name . ' (Copy)';
        $newProduct->save();

        if ($product->categories->isNotEmpty()) {
            $newProduct->categories()->sync($product->categories->pluck('id'));
        }

        return redirect()->route('admin.products.index')->with('success', 'Product berhasil diduplikasi.');
    }

    public function configureAttributes(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        if ($product->type !== 'configurable') {
            return back()->with('error', 'Only configurable products can have attributes configured.');
        }

        // Accept both formats: selected_options (from modal) or configurable_attributes (from edit page)
        $selectedOptions = [];
        if ($request->has('selected_options')) {
            // Format from modal: { attribute_id => [option_id, option_id, ...] }
            $selectedOptions = $request->selected_options;
        } elseif ($request->has('configurable_attributes')) {
            // Format from edit page: [attribute_id, attribute_id, ...]
            $attributeIds = $request->configurable_attributes;
            $attributes = Attribute::whereIn('id', $attributeIds)->with('options')->get();
            foreach ($attributes as $attribute) {
                $selectedOptions[$attribute->id] = $attribute->options->pluck('id')->toArray();
            }
        }

        if (empty($selectedOptions)) {
            return back()->with('error', 'No attributes or options selected.');
        }

        // Delete existing variants
        $product->variants()->delete();

        // Generate variants based on selected options
        $this->generateVariantsFromOptions($product, $selectedOptions);

        if ($request->wantsJson() || $request->header('Accept') === 'application/json') {
            return response()->json(['ok' => true, 'message' => 'Variants generated successfully.', 'redirect_url' => route('admin.products.configurableedit', $product->id)]);
        }

        return redirect()->route('admin.products.configurableedit', $product->id)->with('success', 'Variants generated successfully.');
    }

    private function generateVariantsFromOptions(Product $product, array $selectedOptions)
    {
        // Get attribute details for selected options
        $attributeIds = array_keys($selectedOptions);
        $attributes = Attribute::whereIn('id', $attributeIds)->with('options')->get()->keyBy('id');
        
        if ($attributes->isEmpty()) {
            return;
        }

        // Build option combinations
        $combinations = [[]];
        
        foreach ($selectedOptions as $attributeId => $optionIds) {
            $attribute = $attributes->get($attributeId);
            if (!$attribute) continue;
            
            $options = $attribute->options->whereIn('id', $optionIds);
            $newCombinations = [];
            
            foreach ($combinations as $combination) {
                foreach ($options as $option) {
                    $newCombinations[] = array_merge($combination, [
                        [
                            'attribute_id' => $attribute->id,
                            'attribute_code' => $attribute->code,
                            'option_id' => $option->id,
                            'option_name' => $option->admin_name,
                        ]
                    ]);
                }
            }
            $combinations = $newCombinations;
        }

        // Create variants for each combination
        foreach ($combinations as $combination) {
            if (empty($combination)) continue;

            $variantName = implode(' / ', array_column($combination, 'option_name'));
            $variantSku = $product->sku . '-' . implode('-', array_map(function($item) {
                return strtolower(str_replace(' ', '', $item['option_name']));
            }, $combination));
            $variantSku = strtoupper($variantSku);

            $variantData = [
                'product_id' => $product->id,
                'sku' => $variantSku,
                'name' => $product->name . ' - ' . $variantName,
                'price' => $product->price ?? 0,
                'compare_at_price' => $product->compare_at_price,
                'stock' => 0,
                'is_active' => true,
                'is_default' => false,
                'position' => 0,
            ];

            // Set attribute values for variant
            foreach ($combination as $attr) {
                if ($attr['attribute_code'] === 'color') {
                    $variantData['color'] = $attr['option_name'];
                }
                if ($attr['attribute_code'] === 'size') {
                    $variantData['size'] = $attr['option_name'];
                }
            }

            \App\Models\ProductVariant::create($variantData);
        }

        // Set first variant as default
        $firstVariant = $product->variants()->first();
        if ($firstVariant) {
            $firstVariant->update(['is_default' => true]);
        }
    }

    private function generateVariants(Product $product, array $attributeIds)
    {
        $attributes = Attribute::whereIn('id', $attributeIds)->with('options')->get();
        
        if ($attributes->isEmpty()) {
            return;
        }

        // Get all possible combinations of attribute options
        $combinations = [[]];
        
        foreach ($attributes as $attribute) {
            $options = $attribute->options->pluck('admin_name', 'id')->toArray();
            $newCombinations = [];
            
            foreach ($combinations as $combination) {
                foreach ($options as $optionId => $optionName) {
                    $newCombinations[] = array_merge($combination, [
                        [
                            'attribute_id' => $attribute->id,
                            'attribute_code' => $attribute->code,
                            'option_id' => $optionId,
                            'option_name' => $optionName,
                        ]
                    ]);
                }
            }
            
            $combinations = $newCombinations;
        }

        // Create variants for each combination
        foreach ($combinations as $combination) {
            if (empty($combination)) continue;

            $variantData = [
                'product_id' => $product->id,
                'sku' => $product->sku . '-' . implode('-', array_column($combination, 'option_name')),
                'name' => $product->name . ' - ' . implode(' / ', array_column($combination, 'option_name')),
                'price' => $product->price,
                'compare_at_price' => $product->compare_at_price,
                'stock' => 0,
                'is_active' => true,
                'is_default' => false,
                'position' => 0,
            ];

            // Set color and size if available
            foreach ($combination as $attr) {
                if ($attr['attribute_code'] === 'color') {
                    $variantData['color'] = $attr['option_name'];
                }
                if ($attr['attribute_code'] === 'size') {
                    $variantData['size'] = $attr['option_name'];
                }
            }

            \App\Models\ProductVariant::create($variantData);
        }

        // Set first variant as default
        $firstVariant = $product->variants()->first();
        if ($firstVariant) {
            $firstVariant->update(['is_default' => true]);
        }
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $excludeId = $request->get('exclude_id', null);

        $products = Product::where('name', 'like', '%' . $query . '%')
            ->orWhere('sku', 'like', '%' . $query . '%')
            ->when($excludeId, function ($q) use ($excludeId) {
                return $q->where('id', '!=', $excludeId);
            })
            ->select('id', 'name', 'sku')
            ->limit(20)
            ->get();

        return response()->json($products);
    }

    private function validateProduct(Request $request, ?int $productId = null): array
    {
        $skuRule    = 'required|string|max:255|unique:products,sku';
        $urlKeyRule = 'nullable|string|max:255|unique:products,url_key';

        if ($productId) {
            $skuRule    .= ',' . $productId;
            $urlKeyRule .= ',' . $productId;
        }

        $rules = [
            'name'                  => 'nullable|string|max:255',
            'sku'                   => $skuRule,
            'product_number'        => 'nullable|string|max:255',
            'url_key'               => $urlKeyRule,
            'short_description'     => 'nullable|string',
            'description'           => 'nullable|string',
            'price'                 => 'nullable|numeric|min:0',
            'special_price'         => 'nullable|numeric|min:0',
            'special_price_from'    => 'nullable|date',
            'special_price_to'      => 'nullable|date|after_or_equal:special_price_from',
            'cost_price'            => 'nullable|numeric|min:0',
            'stock'                 => 'nullable|integer|min:0',
            'weight'                => 'nullable|numeric|min:0',
            'width'                 => 'nullable|numeric|min:0',
            'height'                => 'nullable|numeric|min:0',
            'length'                => 'nullable|numeric|min:0',
            'tax_category_id'       => 'nullable|exists:tax_categories,id',
            'meta_title'            => 'nullable|string|max:255',
            'meta_keywords'         => 'nullable|string',
            'meta_description'      => 'nullable|string',
            'new'                   => 'nullable|in:0,1,true,false',
            'featured'              => 'nullable|in:0,1,true,false',
            'visible_individually'  => 'nullable|in:0,1,true,false',
            'status'                => 'nullable|in:0,1,true,false',
            'guest_checkout'        => 'nullable|in:0,1,true,false',
            'allow_rma'             => 'nullable|in:0,1,true,false',
            'rma_rules'             => 'nullable|string',
            'category_ids'          => 'nullable|array',
            'category_ids.*'        => 'exists:categories,id',
            'images'                => 'nullable|array',
            'videos'                => 'nullable|array',
            'related_product_ids'   => 'nullable|array',
            'related_product_ids.*' => 'exists:products,id',
            'up_sell_product_ids'   => 'nullable|array',
            'up_sell_product_ids.*' => 'exists:products,id',
            'cross_sell_product_ids'   => 'nullable|array',
            'cross_sell_product_ids.*' => 'exists:products,id',
            'group_product_ids'     => 'nullable|array',
            'group_product_ids.*'   => 'exists:products,id',
            'sub_category_id'       => 'nullable|exists:sub_categories,id',
        ];

        if (!$productId) {
            $rules['attribute_family_id'] = 'required|exists:attribute_families,id';
            $rules['type']                = 'required|in:simple,configurable,grouped,bundle,virtual,downloadable';
        }

        $validated = $request->validate($rules);

        // Normalize nullable foreign keys
        if (array_key_exists('tax_category_id', $validated) && blank($validated['tax_category_id'])) {
            $validated['tax_category_id'] = null;
        }
        if (array_key_exists('sub_category_id', $validated) && blank($validated['sub_category_id'])) {
            $validated['sub_category_id'] = null;
        }

        // Normalize boolean fields — FormData sends '1'/'0' or 'true'/'false'
        foreach (['new', 'featured', 'visible_individually', 'status', 'guest_checkout', 'allow_rma'] as $field) {
            if (array_key_exists($field, $validated)) {
                $validated[$field] = filter_var($validated[$field], FILTER_VALIDATE_BOOLEAN);
            }
        }

        if (isset($validated['videos']) && is_string($validated['videos'])) {
            $validated['videos'] = blank($validated['videos']) ? [] : [$validated['videos']];
        }

        return $validated;
    }

    private function extractProductData(array $validated): array
    {
        return collect($validated)->except([
            'category_ids',
            'related_product_ids',
            'up_sell_product_ids',
            'cross_sell_product_ids',
            'group_product_ids',
        ])->toArray();
    }

    private function syncProductRelations(Product $product, array $validated): void
    {
        if (array_key_exists('category_ids', $validated)) {
            $product->categories()->sync($validated['category_ids'] ?? []);
        }

        if (array_key_exists('related_product_ids', $validated)) {
            $product->relatedProducts()->sync($validated['related_product_ids'] ?? []);
        }

        if (array_key_exists('up_sell_product_ids', $validated)) {
            $product->upSellProducts()->sync($validated['up_sell_product_ids'] ?? []);
        }

        if (array_key_exists('cross_sell_product_ids', $validated)) {
            $product->crossSellProducts()->sync($validated['cross_sell_product_ids'] ?? []);
        }

        if (array_key_exists('group_product_ids', $validated)) {
            $product->groupProducts()->sync($validated['group_product_ids'] ?? []);
        }
    }

    /**
     * Upsert product_attribute_values rows.
     * $values = [ attribute_id => raw_value, ... ]
     */
    private function syncAttributeValues(Product $product, array $values): void
    {
        if (empty($values)) return;

        $attributes = Attribute::whereIn('id', array_keys($values))->get()->keyBy('id');

        foreach ($values as $attributeId => $rawValue) {
            $attribute = $attributes->get($attributeId);
            if (!$attribute) continue;

            $payload = ProductAttributeValue::buildPayload($attribute, $rawValue);
            $payload['product_id'] = $product->id;

            ProductAttributeValue::updateOrCreate(
                ['product_id' => $product->id, 'attribute_id' => $attributeId],
                $payload
            );
        }
    }

    /**
     * Handle type-specific data based on product type
     */
    private function handleTypeSpecificData(Product $product, Request $request): void
    {
        switch ($product->type) {
            case 'grouped':
                $this->handleGroupedProducts($product, $request);
                break;
            case 'bundle':
                $this->handleBundleProducts($product, $request);
                break;
            case 'downloadable':
                $this->handleDownloadableProducts($product, $request);
                break;
            case 'configurable':
                $this->handleConfigurableAttributes($product, $request);
                break;
        }
    }

    /**
     * Handle grouped products data
     */
    private function handleGroupedProducts(Product $product, Request $request): void
    {
        $groupedProducts = $request->input('grouped_products', []);

        // Delete existing grouped products
        $product->groupedProducts()->delete();

        // Create new grouped products
        foreach ($groupedProducts as $item) {
            if (isset($item['associated_product_id']) && $item['associated_product_id']) {
                \App\Models\GroupedProduct::create([
                    'parent_product_id' => $product->id,
                    'associated_product_id' => $item['associated_product_id'],
                    'quantity' => $item['quantity'] ?? 1,
                    'position' => $item['position'] ?? 0,
                ]);
            }
        }
    }

    /**
     * Handle bundle products data
     */
    private function handleBundleProducts(Product $product, Request $request): void
    {
        $bundleProducts = $request->input('bundle_products', []);

        // Delete existing bundle products
        $product->bundleProducts()->delete();

        // Create new bundle products
        foreach ($bundleProducts as $item) {
            if (isset($item['associated_product_id']) && $item['associated_product_id']) {
                \App\Models\BundleProduct::create([
                    'parent_product_id' => $product->id,
                    'associated_product_id' => $item['associated_product_id'],
                    'quantity' => $item['quantity'] ?? 1,
                    'is_required' => $item['is_required'] ?? false,
                    'is_default' => $item['is_default'] ?? false,
                    'position' => $item['position'] ?? 0,
                ]);
            }
        }
    }

    /**
     * Handle downloadable products data
     */
    private function handleDownloadableProducts(Product $product, Request $request): void
    {
        $downloadableData = $request->input('downloadable', []);

        // Delete existing downloadable products
        $product->downloadableProduct()->delete();

        if (!empty($downloadableData)) {
            // Handle file upload
            $filePath = null;
            if ($request->hasFile('downloadable.file')) {
                $filePath = $request->file('downloadable.file')->store('downloads', 'public');
            }

            $sampleFilePath = null;
            if ($request->hasFile('downloadable.sample_file')) {
                $sampleFilePath = $request->file('downloadable.sample_file')->store('downloads', 'public');
            }

            \App\Models\DownloadableProduct::create([
                'product_id' => $product->id,
                'file_path' => $filePath ?? $downloadableData['file_path'] ?? null,
                'sample_file_path' => $sampleFilePath ?? $downloadableData['sample_file_path'] ?? null,
                'download_limit' => $downloadableData['download_limit'] ?? null,
                'downloads_used' => 0,
                'expiry_date' => $downloadableData['expiry_date'] ?? null,
            ]);
        }
    }

    /**
     * Handle configurable attributes data
     */
    private function handleConfigurableAttributes(Product $product, Request $request): void
    {
        $attributeIds = $request->input('configurable_attributes', []);

        // Only process if attributes are being explicitly set
        if (empty($attributeIds)) {
            return;
        }

        // Delete existing configurable attributes
        $product->configurableAttributes()->delete();

        // Create new configurable attributes
        foreach ($attributeIds as $attributeId) {
            \App\Models\ConfigurableAttribute::create([
                'product_id' => $product->id,
                'attribute_id' => $attributeId,
            ]);
        }
    }

    private function serializeCreatedProduct(Product $product): array
    {
        $product->load('attributeFamily.groups.custom_attributes.options');
        $af = $product->attributeFamily;

        return [
            'id'   => $product->id,
            'type' => $product->type,
            'name' => $product->name,
            'sku'  => $product->sku,
            'attributeFamily' => $af ? [
                'id'   => $af->id,
                'name' => $af->name,
                'attributeGroups' => $af->groups->map(fn($group) => [
                    'id'         => $group->id,
                    'name'       => $group->name,
                    'attributes' => $group->custom_attributes->map(fn($attr) => [
                        'id'              => $attr->id,
                        'code'            => $attr->code,
                        'admin_name'      => $attr->admin_name,
                        'type'            => $attr->type,
                        'is_configurable' => (bool) $attr->is_configurable,
                        'options'         => $attr->options->map(fn($o) => [
                            'id'         => $o->id,
                            'admin_name' => $o->admin_name,
                            'sort_order' => $o->sort_order,
                        ])->values()->all(),
                    ])->values()->all(),
                ])->values()->all(),
            ] : null,
        ];
    }


    public function designImage($id, $index)
    {
        $product = Product::findOrFail($id);

        // Handle "new" index for creating new design
        if ($index === 'new') {
            return Inertia::render('Admin/CMS/Banners/Designer', [
                'returnUrl'    => route('admin.products.edit', $product->id),
                'initialImage' => null, // Canvas kosong
                'canvasWidth'  => 800,
                'canvasHeight' => 800,
                'bannerType'   => 'product_image',
                'context'      => [
                    'type'        => 'product_image',
                    'productId'   => $product->id,
                    'imageIndex'  => 'new', // Flag untuk append, bukan replace
                    'productName' => $product->name,
                ],
            ]);
        }

        $images = is_array($product->images) ? $product->images : (json_decode($product->images, true) ?? []);

        $imageUrl = isset($images[$index])
            ? (str_starts_with($images[$index], 'http') ? $images[$index] : Storage::url($images[$index]))
            : null;

        return Inertia::render('Admin/CMS/Banners/Designer', [
            'returnUrl'    => route('admin.products.edit', $product->id),
            'initialImage' => $imageUrl,
            'canvasWidth'  => 800,
            'canvasHeight' => 800,
            'bannerType'   => 'product_image',
            'context'      => [
                'type'        => 'product_image',
                'productId'   => $product->id,
                'imageIndex'  => $index,
                'productName' => $product->name,
            ],
        ]);
    }

    public function designVariantImage($id, $variantId, $index)
    {
        $product = Product::findOrFail($id);
        $variant = $product->variants()->findOrFail($variantId);

        // Handle "new" index for creating new design
        if ($index === 'new') {
            $copyFromId = request('copyFrom');
            $layoutJson = null;
            
            // If copyFrom provided, get layout_json from that variant
            if ($copyFromId) {
                $sourceVariant = $product->variants()->find($copyFromId);
                \Log::info('Copy Layout Debug', [
                    'copyFromId' => $copyFromId,
                    'sourceVariant' => $sourceVariant ? $sourceVariant->id : null,
                    'has_design_layout' => $sourceVariant ? !is_null($sourceVariant->design_layout) : false,
                    'design_layout_type' => $sourceVariant && $sourceVariant->design_layout ? gettype($sourceVariant->design_layout) : null,
                ]);
                
                if ($sourceVariant && $sourceVariant->design_layout) {
                    $layoutJson = $sourceVariant->design_layout;
                }
            }
            
            return Inertia::render('Admin/CMS/Banners/Designer', [
                'returnUrl'    => route('admin.products.configurableedit', $product->id),
                'initialImage' => null, // Canvas kosong
                'canvasWidth'  => 800,
                'canvasHeight' => 800,
                'bannerType'   => 'product_variant',
                'layoutJson'   => $layoutJson, // Copy layout dari variant lain
                'context'      => [
                    'type'        => 'variant_image',
                    'productId'   => $product->id,
                    'variantId'   => $variantId,
                    'imageIndex'  => 'new', // Flag untuk append
                    'productName' => $product->name,
                    'copiedFrom'  => $copyFromId ?? null,
                ],
            ]);
        }

        $images = is_array($variant->images) ? $variant->images : (json_decode($variant->images, true) ?? []);

        $imageUrl = isset($images[$index])
            ? (str_starts_with($images[$index], 'http') ? $images[$index] : Storage::url($images[$index]))
            : null;

        // Load existing layout if available
        $layoutJson = $variant->design_layout ?? null;

        return Inertia::render('Admin/CMS/Banners/Designer', [
            'returnUrl'    => route('admin.products.configurableedit', $product->id),
            'initialImage' => $imageUrl,
            'layoutJson'   => $layoutJson, // Load existing layout for editing
            'canvasWidth'  => 800,
            'canvasHeight' => 800,
            'bannerType'   => 'product_variant',
            'context'      => [
                'type'        => 'variant_image',
                'productId'   => $product->id,
                'variantId'   => $variantId,
                'imageIndex'  => $index,
                'productName' => $product->name,
            ],
        ]);
    }

    public function saveProductDesign(Request $request)
    {
        $request->validate([
            'image' => 'required|string',
            'layout_json' => 'required',
            'product_id' => 'required|integer',
            'type' => 'required|in:product_image,variant_image',
            'image_index' => 'required', // bisa integer atau 'new'
        ]);

        $product = Product::findOrFail($request->product_id);
        $imagePath = $this->saveDesignImage($request->image);

        if ($request->type === 'product_image') {
            // Product images
            $images = is_array($product->images) ? $product->images : (json_decode($product->images, true) ?? []);
            
            if ($request->image_index === 'new') {
                // Append new image
                $images[] = $imagePath;
            } else {
                // Replace existing image at index
                $images[(int)$request->image_index] = $imagePath;
            }
            
            $product->images = $images;
            $product->save();
        } elseif ($request->type === 'variant_image') {
            $variant = $product->variants()->findOrFail($request->variant_id);
            $images = is_array($variant->images) ? $variant->images : (json_decode($variant->images, true) ?? []);
            
            if ($request->image_index === 'new') {
                // Append new image
                $images[] = $imagePath;
            } else {
                // Replace existing image at index - IMPORTANT: Always replace, never append
                $imageIndex = (int)$request->image_index;
                if (isset($images[$imageIndex])) {
                    // Delete old image file
                    $oldImage = $images[$imageIndex];
                    if ($oldImage && !str_starts_with($oldImage, 'http')) {
                        Storage::disk('public')->delete($oldImage);
                    }
                }
                $images[$imageIndex] = $imagePath;
            }
            
            $variant->images = array_values($images); // Re-index array
            
            // Save layout_json to variant for future copy
            if ($request->has('layout_json')) {
                $variant->design_layout = $request->layout_json;
            }
            
            $variant->save();
        }

        return response()->json([
            'success' => true,
            'url' => Storage::url($imagePath),
            'path' => $imagePath,
            'message' => 'Design saved successfully',
        ]);
    }

    private function saveDesignImage($base64Image)
    {
        $imageData = explode(',', $base64Image);
        $image = base64_decode(end($imageData));
        $fileName = 'product-design-' . time() . '.png';
        $path = 'products/' . $fileName;
        Storage::disk('public')->put($path, $image);
        return $path;
    }

    public function getVariant($variantId)
    {
        $variant = \App\Models\ProductVariant::findOrFail($variantId);
        
        return response()->json([
            'variant' => [
                'id' => $variant->id,
                'name' => $variant->name,
                'sku' => $variant->sku,
                'price' => $variant->price,
                'stock' => $variant->stock,
                'weight' => $variant->weight,
                'is_active' => $variant->is_active,
                'images' => $variant->images ?? [],
            ]
        ]);
    }

    public function copyVariantDesign(Request $request, $variantId)
    {
        $request->validate([
            'target_variant_ids' => 'required|array',
            'target_variant_ids.*' => 'integer|exists:product_variants,id',
        ]);

        $sourceVariant = \App\Models\ProductVariant::findOrFail($variantId);
        
        if (empty($sourceVariant->images)) {
            return response()->json(['message' => 'Source variant has no images to copy'], 400);
        }

        $copiedCount = 0;
        
        foreach ($request->target_variant_ids as $targetId) {
            $targetVariant = \App\Models\ProductVariant::find($targetId);
            if ($targetVariant && $targetVariant->product_id === $sourceVariant->product_id) {
                // Copy images
                $targetVariant->images = $sourceVariant->images;
                
                // Copy design_layout if exists
                if ($sourceVariant->design_layout) {
                    $targetVariant->design_layout = $sourceVariant->design_layout;
                }
                
                $targetVariant->save();
                $copiedCount++;
            }
        }

        return response()->json([
            'success' => true,
            'copied_count' => $copiedCount,
            'message' => "Design copied to {$copiedCount} variant(s)",
        ]);
    }
}
