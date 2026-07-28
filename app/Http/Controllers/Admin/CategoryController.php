<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        // Get root categories for navigation
        $rootCategories = Category::whereNull('parent_id')->orWhere('parent_id', 0)
            ->orderBy('position')
            ->orderBy('name')
            ->get();
        
        // Get only child categories (direct children of root categories)
        $rootIds = $rootCategories->pluck('id');
        $query = Category::whereIn('parent_id', $rootIds)
            ->with('parent')
            ->withCount('products')
            ->orderBy('position')
            ->orderBy('name');
        
        // Search
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('slug', 'like', '%' . $request->search . '%');
        }
        
        // Filter by visible in menu
        if ($request->has('visible_in_menu') && $request->visible_in_menu !== '') {
            $query->where('visible_in_menu', $request->visible_in_menu === 'true');
        }
        
        // Get child categories
        $categories = $query->get();
        
        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'rootCategories' => $rootCategories,
            'filters' => [
                'search' => $request->get('search', ''),
                'visible_in_menu' => $request->get('visible_in_menu', ''),
            ],
        ], 'app');
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
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'position' => $category->position,
                    'display_mode' => $category->display_mode,
                    'visible_in_menu' => $category->visible_in_menu,
                    'logo_path' => $category->logo_path,
                    'banner_path' => $category->banner_path,
                    'products_count' => $category->products_count,
                    'children' => $children,
                    'has_children' => count($children) > 0,
                ];
            }
        }
        return $tree;
    }



    public function create()
    {
        $allCategories = $this->buildTree(Category::orderBy('position')->orderBy('name')->get());
        $allAttributes = \App\Models\Attribute::whereIn('type', ['select', 'multiselect'])
            ->where('is_filterable', true)
            ->orderBy('position')
            ->get(['id', 'code', 'admin_name', 'type']);

        return Inertia::render('Admin/Categories/Create', [
            'allCategories' => $allCategories,
            'allAttributes' => $allAttributes,
        ], 'app');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                    => 'required|string|max:255',
            'slug'                    => 'required|string|max:255|unique:categories,slug',
            'description'             => 'nullable|string',
            'position'                => 'nullable|integer|min:0',
            'display_mode'            => 'nullable|string|in:products_only,description_only,products_and_description',
            'parent_id'               => 'nullable|exists:categories,id',
            'logo_path'               => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'banner_path'             => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
            'meta_title'              => 'nullable|string|max:255',
            'meta_keywords'           => 'nullable|string|max:255',
            'meta_description'        => 'nullable|string',
            'filterable_attributes'   => 'nullable|array',
            'filterable_attributes.*' => 'exists:attributes,id',
        ]);

        $logoPath   = $request->hasFile('logo_path')   ? $request->file('logo_path')->store('categories/logos', 'public')   : null;
        $bannerPath = $request->hasFile('banner_path') ? $request->file('banner_path')->store('categories/banners', 'public') : null;

        $category = Category::create([
            'name'             => $validated['name'],
            'slug'             => $validated['slug'],
            'description'      => $validated['description'] ?? null,
            'position'         => $validated['position'] ?? 0,
            'display_mode'     => $validated['display_mode'] ?? 'products_and_description',
            'visible_in_menu'  => filter_var($request->input('visible_in_menu', true), FILTER_VALIDATE_BOOLEAN),
            'parent_id'        => $validated['parent_id'] ?? null,
            'logo_path'        => $logoPath,
            'banner_path'      => $bannerPath,
            'meta_title'       => $validated['meta_title'] ?? null,
            'meta_keywords'    => $validated['meta_keywords'] ?? null,
            'meta_description' => $validated['meta_description'] ?? null,
        ]);

        if (!empty($validated['filterable_attributes'])) {
            $category->filterableAttributes()->sync($validated['filterable_attributes']);
        }

        return redirect()->route('admin.categories.index')->with('success', 'Category berhasil dibuat.');
    }



    public function edit($id)
    {
        $category      = Category::with('filterableAttributes')->findOrFail($id);
        $allCategories = $this->buildTree(Category::orderBy('position')->orderBy('name')->get());
        $allAttributes = \App\Models\Attribute::whereIn('type', ['select', 'multiselect'])
            ->where('is_filterable', true)
            ->orderBy('position')
            ->get(['id', 'code', 'admin_name', 'type']);

        return Inertia::render('Admin/Categories/Edit', [
            'category' => [
                'id'                    => $category->id,
                'name'                  => $category->name,
                'slug'                  => $category->slug,
                'description'           => $category->description,
                'parent_id'             => $category->parent_id,
                'position'              => $category->position,
                'display_mode'          => $category->display_mode ?? 'products_and_description',
                'visible_in_menu'       => $category->visible_in_menu,
                'logo_path'             => $category->logo_path,
                'banner_path'           => $category->banner_path,
                'filterable_attributes' => $category->filterableAttributes->pluck('id')->toArray(),
                'meta_title'            => $category->meta_title,
                'meta_keywords'         => $category->meta_keywords,
                'meta_description'      => $category->meta_description,
            ],
            'allCategories' => $allCategories,
            'allAttributes' => $allAttributes,
        ], 'app');
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120',
            'type' => 'required|in:logo,banner',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store($request->input('type') === 'logo' ? 'categories/logos' : 'categories/banners', 'public');

            return response()->json([
                'success' => true,
                'path' => $path,
                'url' => asset('storage/' . $path),
            ]);
        }

        return response()->json(['success' => false], 400);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        Log::info('Category update request received', [
            'category_id' => $id,
            'has_logo_file' => $request->hasFile('logo_path'),
            'logo_file_name' => $request->file('logo_path')?->getClientOriginalName(),
            'has_banner_file' => $request->hasFile('banner_path'),
            'banner_file_name' => $request->file('banner_path')?->getClientOriginalName(),
            'remove_logo' => $request->input('remove_logo'),
            'remove_banner' => $request->input('remove_banner'),
            'request_keys' => array_keys($request->all()),
        ]);

        $validated = $request->validate([
            'name'                    => 'required|string|max:255',
            'slug'                    => 'required|string|max:255|unique:categories,slug,' . $id,
            'description'             => 'nullable|string',
            'position'                => 'nullable|integer|min:0',
            'display_mode'            => 'nullable|string|in:products_only,description_only,products_and_description',
            'parent_id'               => 'nullable|exists:categories,id',
            'logo_path'               => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'banner_path'             => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
            'meta_title'              => 'nullable|string|max:255',
            'meta_keywords'           => 'nullable|string|max:255',
            'meta_description'        => 'nullable|string',
            'filterable_attributes'   => 'nullable|array',
            'filterable_attributes.*' => 'exists:attributes,id',
        ]);

        $logoPath = $category->logo_path;
        $bannerPath = $category->banner_path;

        // Handle logo
        if (filter_var($request->input('remove_logo'), FILTER_VALIDATE_BOOLEAN)) {
            if ($category->logo_path) Storage::disk('public')->delete($category->logo_path);
            $logoPath = null;
        } elseif ($request->hasFile('logo_path')) {
            if ($category->logo_path) Storage::disk('public')->delete($category->logo_path);
            $logoPath = $request->file('logo_path')->store('categories/logos', 'public');
        }

        // Handle banner
        if (filter_var($request->input('remove_banner'), FILTER_VALIDATE_BOOLEAN)) {
            if ($category->banner_path) Storage::disk('public')->delete($category->banner_path);
            $bannerPath = null;
        } elseif ($request->hasFile('banner_path')) {
            if ($category->banner_path) Storage::disk('public')->delete($category->banner_path);
            $bannerPath = $request->file('banner_path')->store('categories/banners', 'public');
        }

        $category->update([
            'name'             => $validated['name'],
            'slug'             => $validated['slug'],
            'description'      => $validated['description'] ?? null,
            'position'         => $validated['position'] ?? 0,
            'display_mode'     => $validated['display_mode'] ?? 'products_and_description',
            'visible_in_menu'  => filter_var($request->input('visible_in_menu', true), FILTER_VALIDATE_BOOLEAN),
            'parent_id'        => $validated['parent_id'] ?? null,
            'logo_path'        => $logoPath,
            'banner_path'      => $bannerPath,
            'meta_title'       => $validated['meta_title'] ?? null,
            'meta_keywords'    => $validated['meta_keywords'] ?? null,
            'meta_description' => $validated['meta_description'] ?? null,
        ]);

        $category->filterableAttributes()->sync($validated['filterable_attributes'] ?? []);

        Log::info('Category update finished', [
            'category_id' => $category->id,
            'logo_path' => $logoPath,
            'banner_path' => $bannerPath,
        ]);

        return redirect()->route('admin.categories.show', ['id' => $category->id])
            ->with('success', 'Category berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        // Delete images if they exist
        if ($category->logo_path) {
            Storage::disk('public')->delete($category->logo_path);
        }
        if ($category->banner_path) {
            Storage::disk('public')->delete($category->banner_path);
        }
        
        $category->delete();
        
        return redirect()->route('admin.categories.index')->with('success', 'Category berhasil dihapus.');
    }

    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:categories,id',
        ]);

        $categories = Category::whereIn('id', $validated['ids'])->get();
        
        foreach ($categories as $category) {
            if ($category->logo_path) {
                Storage::disk('public')->delete($category->logo_path);
            }
            if ($category->banner_path) {
                Storage::disk('public')->delete($category->banner_path);
            }
        }

        Category::whereIn('id', $validated['ids'])->delete();
        
        return redirect()->route('admin.categories.index')->with('success', 'Categories berhasil dihapus.');
    }

    public function bulkActivate(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:categories,id',
        ]);

        Category::whereIn('id', $validated['ids'])->update(['visible_in_menu' => true]);
        
        return redirect()->route('admin.categories.index')->with('success', 'Categories berhasil diaktifkan.');
    }

    public function bulkDeactivate(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:categories,id',
        ]);

        Category::whereIn('id', $validated['ids'])->update(['visible_in_menu' => false]);
        
        return redirect()->route('admin.categories.index')->with('success', 'Categories berhasil dinonaktifkan.');
    }

    /**
     * Build a flat list of categories with depth-indented labels for dropdowns.
     * Optionally exclude a category and all its descendants (for edit page).
     */
    private function flatTree(?int $excludeId = null): array
    {
        $all = Category::orderBy('parent_id')->orderBy('position')->orderBy('name')->get();

        // Build children map - keep null parent_id as null for Root
        $children = [];
        foreach ($all as $cat) {
            $parentId = $cat->parent_id;
            if ($parentId === null) {
                $parentId = 'root';
            }
            if (!isset($children[$parentId])) {
                $children[$parentId] = [];
            }
            $children[$parentId][] = $cat;
        }

        // Collect descendants of excludeId to skip them
        $excluded = [];
        if ($excludeId) {
            $stack = [$excludeId];
            while ($stack) {
                $current = array_pop($stack);
                $excluded[] = $current;
                foreach ($children[$current] ?? [] as $child) {
                    $stack[] = $child->id;
                }
            }
        }

        $result = [];
        
        // Traverse recursively with indentation
        $traverse = function ($parentId, int $depth) use (&$traverse, &$children, &$result, $excluded) {
            foreach ($children[$parentId] ?? [] as $cat) {
                if (in_array($cat->id, $excluded)) continue;
                $result[] = [
                    'id'    => $cat->id,
                    'label' => str_repeat('— ', $depth) . $cat->name,
                ];
                $traverse($cat->id, $depth + 1);
            }
        };

        // Start traversal from root (parent_id = null)
        $traverse('root', 0);
        
        return $result;
    }

    public function apiShow($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    public function show($id)
    {
        $category = Category::with('parent', 'children', 'filterableAttributes')->findOrFail($id);
        
        return Inertia::render('Admin/Categories/Show', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'parent' => $category->parent ? $category->parent->name : null,
                'position' => $category->position,
                'display_mode' => $category->display_mode,
                'visible_in_menu' => $category->visible_in_menu,
                'meta_title' => $category->meta_title,
                'meta_keywords' => $category->meta_keywords,
                'meta_description' => $category->meta_description,
                'logo_path' => $category->logo_path,
                'banner_path' => $category->banner_path,
                'products_count' => $category->products()->count(),
                'children' => $category->children->map(function ($child) {
                    return [
                        'id' => $child->id,
                        'name' => $child->name,
                    ];
                }),
                'filterable_attributes' => $category->filterableAttributes->map(function ($attr) {
                    return [
                        'id' => $attr->id,
                        'name' => $attr->name,
                        'type' => $attr->type,
                    ];
                }),
                'created_at' => $category->created_at->format('M d, Y H:i'),
                'updated_at' => $category->updated_at->format('M d, Y H:i'),
            ],
        ], 'app');
    }

    public function search(Request $request)
    {
        $search = $request->get('search', '');
        
        // Get root category IDs
        $rootIds = Category::whereNull('parent_id')->pluck('id');
        
        // Only return child categories of root (Mens, Womens, Accessories, Footwear)
        $categories = Category::whereIn('parent_id', $rootIds)
            ->where('visible_in_menu', true)
            ->where('name', 'like', '%' . $search . '%')
            ->select('id', 'name', 'slug')
            ->orderBy('position')
            ->orderBy('name')
            ->get();
            
        return response()->json($categories);
    }
}
