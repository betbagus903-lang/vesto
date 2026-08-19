<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->get('type', 'hero_slider');
        
        $banners = Banner::byType($type)
            ->sorted()
            ->paginate(20);

        return Inertia::render('Admin/CMS/Banners/Index', [
            'banners' => $banners->items(),
            'pagination' => [
                'total' => $banners->total(),
                'per_page' => $banners->perPage(),
                'current_page' => $banners->currentPage(),
                'last_page' => $banners->lastPage(),
            ],
            'current_type' => $type,
        ]);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('banners', 'public');
            $url = asset('storage/' . $path);
            
            return response()->json([
                'success' => true,
                'url' => $url,
                'path' => $path,
            ]);
        }

        return response()->json(['success' => false], 400);
    }

    public function designer(Request $request)
    {
        $linkType = $request->get('bannerType', 'home');

        // Map link_type → canvas dimensions
        $sizes = [
            'home'         => ['width' => 1920, 'height' => 800],
            'category'     => ['width' => 1920, 'height' => 500],
            'product'      => ['width' => 1200, 'height' => 400],
            'collection'   => ['width' => 1920, 'height' => 600],
            'external_url' => ['width' => 1920, 'height' => 800],
            // legacy type keys
            'hero_slider'       => ['width' => 1920, 'height' => 800],
            'promo_banner'      => ['width' => 1200, 'height' => 400],
            'category_banner'   => ['width' => 1920, 'height' => 500],
            'collection_banner' => ['width' => 1920, 'height' => 600],
        ];

        $size = $sizes[$linkType] ?? $sizes['home'];

        return Inertia::render('Admin/CMS/Banners/Designer', [
            'returnUrl'    => $request->get('returnUrl', route('admin.cms.banners.create')),
            'initialImage' => $request->get('initialImage', null),
            'canvasWidth'  => $size['width'],
            'canvasHeight' => $size['height'],
            'bannerType'   => $linkType,
        ]);
    }

    public function designerEdit(Banner $banner)
    {
        // Define canvas sizes based on banner type/location
        $canvasSizes = [
            'hero_slider' => ['width' => 1920, 'height' => 800],
            'promo_banner' => ['width' => 1200, 'height' => 400],
            'category_banner' => ['width' => 1600, 'height' => 500],
            'collection_banner' => ['width' => 1400, 'height' => 600],
        ];
        
        $size = $canvasSizes[$banner->type] ?? $canvasSizes['hero_slider'];
        
        return Inertia::render('Admin/CMS/Banners/Designer', [
            'returnUrl'    => route('admin.cms.banners.edit', $banner->id),
            'initialImage' => $banner->image ? asset('storage/' . $banner->image) : null,
            'bannerId'     => $banner->id,
            'canvasWidth'  => $size['width'],
            'canvasHeight' => $size['height'],
            'bannerType'   => $banner->type,
            'layoutJson'   => $banner->layout_json,
        ]);
    }

    public function uploadDesignAsset(Request $request)
    {
        $request->validate([
            'asset' => 'required|image|mimes:jpeg,png,webp|max:10240',
        ]);

        if ($request->hasFile('asset')) {
            $path = $request->file('asset')->store('banners/assets', 'public');
            return response()->json([
                'success' => true,
                'url'     => asset('storage/' . $path),
                'path'    => $path,
            ]);
        }

        return response()->json(['success' => false], 400);
    }

    public function saveDesign(Request $request)
    {
        $request->validate([
            'image' => 'required|string',
            'layout_json' => 'required|array',
            'animations' => 'nullable|array',
        ]);

        $imagePath = $this->saveBase64Image($request->image);
        
        return response()->json([
            'success' => true,
            'url' => asset('storage/' . $imagePath),
            'path' => $imagePath,
            'animations' => $request->animations ?? []
        ]);
    }

    private function saveBase64Image($base64Image)
    {
        // Remove data URI scheme if present
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
            $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
            $type = strtolower($type[1]);
        } else {
            $type = 'png';
        }

        $base64Image = str_replace(' ', '+', $base64Image);
        $imageData = base64_decode($base64Image);
        
        if ($imageData === false) {
            return null;
        }

        $fileName = 'banner-' . uniqid() . '.' . $type;
        $filePath = 'banners/' . $fileName;
        
        Storage::disk('public')->put($filePath, $imageData);
        
        return $filePath;
    }

    public function create(Request $request)
    {
        $type = $request->get('type', 'hero_slider');
        $bannerId = $request->get('bannerId');
        
        $banner = null;
        if ($bannerId) {
            $banner = Banner::find($bannerId);
        }

        $categories  = \App\Models\Category::select('id','name')->orderBy('name')->get();
        $products    = \App\Models\Product::select('id','name')->where('is_active', true)->orderBy('name')->get();
        $collections = \App\Models\Collection::select('id','name')->orderBy('name')->get();

        return Inertia::render('Admin/CMS/Banners/Create', [
            'type'        => $type,
            'bannerId'   => $bannerId,
            'banner'     => $banner,
            'categories'  => $categories,
            'products'    => $products,
            'collections' => $collections,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:hero_slider,promo_banner,category_banner',
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            'image' => 'required|string',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:500',
            'link_type' => 'required|in:home,category,product,collection,external_url',
            'link_id' => 'nullable|integer',
            'collection_id' => 'nullable|integer',
            'animations' => 'nullable|array',
            'is_active' => 'boolean',
            'featured' => 'boolean',
            'open_in_new_tab' => 'boolean',
            'sort_order' => 'integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'cta_style' => 'nullable|in:filled_blue,filled_dark,outline,ghost',
            'text_alignment' => 'nullable|in:left,center,right',
            'text_color' => 'nullable|string|max:7',
            'display_devices' => 'nullable|array',
            'display_devices.*' => 'in:desktop,tablet,mobile',
        ]);

        // Normalize image path - store only relative path without full URL
        $validated['image'] = $this->normalizeImagePath($validated['image']);

        // Set slot based on type and link_type
        $validated['slot'] = $this->determineSlot($validated['type'], $validated['link_type']);

        Banner::create($validated);

        return redirect()->route('admin.cms.banners.index', ['type' => $validated['type']])
            ->with('success', 'Banner created successfully.');
    }

    private function determineSlot($type, $linkType)
    {
        // Map banner types and link types to slots
        // Priority: link_type determines where the banner should appear
        if ($linkType === 'home') {
            return 'home_hero';
        }
        if ($linkType === 'category') {
            return 'category_banner';
        }
        if ($type === 'promo_banner') {
            return 'home_promo';
        }
        // Default slot
        return 'home_hero';
    }

    private function normalizeImagePath($imagePath)
    {
        // If the image path is a full URL, extract just the storage path
        if (str_starts_with($imagePath, 'http://') || str_starts_with($imagePath, 'https://')) {
            // Extract path from URL like http://example.com/storage/banners/image.jpg
            $parsedUrl = parse_url($imagePath);
            $path = $parsedUrl['path'] ?? '';
            
            // Remove /storage/ prefix if present
            if (str_starts_with($path, '/storage/')) {
                return substr($path, 9); // Remove '/storage/'
            }
            
            return ltrim($path, '/');
        }
        
        // If already starts with /storage/, remove the leading slash
        if (str_starts_with($imagePath, '/storage/')) {
            return substr($imagePath, 9);
        }
        
        // If already a relative path without /storage/, return as is
        return $imagePath;
    }

    public function edit(Banner $banner)
    {
        return Inertia::render('Admin/CMS/Banners/Edit', [
            'banner' => $banner,
        ]);
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'type' => 'required|in:hero_slider,promo_banner,category_banner',
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            'image' => 'required|string',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:500',
            'link_type' => 'required|in:home,category,product,collection,external_url',
            'link_id' => 'nullable|integer',
            'collection_id' => 'nullable|integer',
            'animations' => 'nullable|array',
            'is_active' => 'boolean',
            'featured' => 'boolean',
            'open_in_new_tab' => 'boolean',
            'sort_order' => 'integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'cta_style' => 'nullable|in:filled_blue,filled_dark,outline,ghost',
            'text_alignment' => 'nullable|in:left,center,right',
            'text_color' => 'nullable|string|max:7',
            'display_devices' => 'nullable|array',
            'display_devices.*' => 'in:desktop,tablet,mobile',
        ]);

        // Normalize image path - store only relative path without full URL
        $validated['image'] = $this->normalizeImagePath($validated['image']);

        // Auto-update slot based on type and link_type
        $validated['slot'] = $this->determineSlot($validated['type'], $validated['link_type']);

        $banner->update($validated);

        return redirect()->route('admin.cms.banners.index', ['type' => $validated['type']])
            ->with('success', 'Banner updated successfully.');
    }

    public function destroy(Banner $banner)
    {
        $type = $banner->type;
        $banner->delete();

        return redirect()->route('admin.cms.banners.index', ['type' => $type])
            ->with('success', 'Banner deleted successfully.');
    }
}
