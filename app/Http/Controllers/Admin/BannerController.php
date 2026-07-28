<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
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

    public function create(Request $request)
    {
        $type = $request->get('type', 'hero_slider');
        
        return Inertia::render('Admin/CMS/Banners/Create', [
            'type' => $type,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:hero_slider,promo_banner,category_banner',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'required|string|max:255',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:255',
            'link_type' => 'required|in:home,shop,category,product,collection,external_url',
            'link_id' => 'nullable|integer',
            'collection_id' => 'nullable|integer',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        Banner::create($validated);

        return redirect()->route('admin.cms.banners.index', ['type' => $validated['type']])
            ->with('success', 'Banner created successfully.');
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
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'required|string|max:255',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:255',
            'link_type' => 'required|in:home,shop,category,product,collection,external_url',
            'link_id' => 'nullable|integer',
            'collection_id' => 'nullable|integer',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

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
