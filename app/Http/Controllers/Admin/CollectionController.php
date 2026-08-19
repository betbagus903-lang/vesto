<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\CollectionRule;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CollectionController extends Controller
{
    public function index()
    {
        $collections = Collection::withCount('banners')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(20);

        return Inertia::render('Admin/CMS/Collections/Index', [
            'collections' => $collections->items(),
            'pagination' => [
                'total' => $collections->total(),
                'per_page' => $collections->perPage(),
                'current_page' => $collections->currentPage(),
                'last_page' => $collections->lastPage(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/CMS/Collections/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:dynamic,manual',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'rules' => 'nullable|array',
            'layout_type' => 'nullable|in:grid,carousel,hero,masonry,product_grid,featured_cards,lookbook,trending,style_guide,category_highlights,bold_collection,custom_grid',
            'content' => 'nullable|array',
            'background_color' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'cover_image' => 'nullable|string',
            'badge' => 'nullable|in:new,summer,trending,limited,luxury,exclusive',
            'color_theme' => 'nullable|string',
            'visibility' => 'nullable|in:homepage,category,search,featured',
            'publish_status' => 'nullable|in:draft,scheduled,published',
        ]);

        $collection = Collection::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'],
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
            'layout_type' => $validated['layout_type'] ?? null,
            'content' => $validated['content'] ?? null,
            'background_color' => $validated['background_color'] ?? '#ffffff',
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'cover_image' => $validated['cover_image'] ?? null,
            'badge' => $validated['badge'] ?? null,
            'color_theme' => $validated['color_theme'] ?? '#4F6BFF',
            'visibility' => $validated['visibility'] ?? 'homepage',
            'publish_status' => $validated['publish_status'] ?? 'draft',
        ]);

        // Create rules if provided
        if (isset($validated['rules']) && is_array($validated['rules'])) {
            foreach ($validated['rules'] as $ruleData) {
                CollectionRule::create([
                    'collection_id' => $collection->id,
                    'field' => $ruleData['field'],
                    'operator' => $ruleData['operator'],
                    'value' => $ruleData['value'],
                    'logical_operator' => $ruleData['logical_operator'] ?? 'AND',
                    'sort_order' => $ruleData['sort_order'] ?? 0,
                ]);
            }
        }

        return redirect()->route('admin.cms.collections.index')
            ->with('success', 'Collection created successfully.');
    }

    public function edit(Collection $collection)
    {
        $collection->load('rules');

        return Inertia::render('Admin/CMS/Collections/Edit', [
            'collection' => $collection,
        ]);
    }

    public function update(Request $request, Collection $collection)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:dynamic,manual',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'rules' => 'nullable|array',
            'layout_type' => 'nullable|in:grid,carousel,hero,masonry,product_grid,featured_cards,lookbook,trending,style_guide,category_highlights,bold_collection,custom_grid',
            'content' => 'nullable|array',
            'background_color' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'cover_image' => 'nullable|string',
            'badge' => 'nullable|in:new,summer,trending,limited,luxury,exclusive',
            'color_theme' => 'nullable|string',
            'visibility' => 'nullable|in:homepage,category,search,featured',
            'publish_status' => 'nullable|in:draft,scheduled,published',
        ]);

        $collection->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'],
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
            'layout_type' => $validated['layout_type'] ?? null,
            'content' => $validated['content'] ?? null,
            'background_color' => $validated['background_color'] ?? '#ffffff',
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'cover_image' => $validated['cover_image'] ?? null,
            'badge' => $validated['badge'] ?? null,
            'color_theme' => $validated['color_theme'] ?? '#4F6BFF',
            'visibility' => $validated['visibility'] ?? 'homepage',
            'publish_status' => $validated['publish_status'] ?? 'draft',
        ]);

        // Delete existing rules
        $collection->rules()->delete();

        // Create new rules if provided
        if (isset($validated['rules']) && is_array($validated['rules'])) {
            foreach ($validated['rules'] as $ruleData) {
                CollectionRule::create([
                    'collection_id' => $collection->id,
                    'field' => $ruleData['field'],
                    'operator' => $ruleData['operator'],
                    'value' => $ruleData['value'],
                    'logical_operator' => $ruleData['logical_operator'] ?? 'AND',
                    'sort_order' => $ruleData['sort_order'] ?? 0,
                ]);
            }
        }

        return redirect()->route('admin.cms.collections.index')
            ->with('success', 'Collection updated successfully.');
    }

    public function destroy(Collection $collection)
    {
        $collection->delete();

        return redirect()->route('admin.cms.collections.index')
            ->with('success', 'Collection deleted successfully.');
    }

    public function preview(Request $request)
    {
        $validated = $request->validate([
            'rules' => 'required|array',
        ]);

        // Create a temporary collection to apply rules
        $tempCollection = new Collection();
        $tempCollection->type = 'dynamic';

        // Create temporary rules
        foreach ($validated['rules'] as $ruleData) {
            $tempRule = new CollectionRule([
                'field' => $ruleData['field'],
                'operator' => $ruleData['operator'],
                'value' => isset($ruleData['value']) ? json_encode($ruleData['value']) : null,
                'logical_operator' => $ruleData['logical_operator'] ?? 'AND',
                'sort_order' => $ruleData['sort_order'] ?? 0,
            ]);
            $tempCollection->setRelation('rules', collect([$tempRule]));
        }

        $products = $tempCollection->applyRules()->limit(10)->get();

        return response()->json([
            'count' => $tempCollection->applyRules()->count(),
            'products' => $products,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');
        
        $collections = Collection::where('is_active', true)
            ->where('name', 'like', "%{$query}%")
            ->orderBy('name')
            ->get()
            ->map(function ($collection) {
                return [
                    'id' => $collection->id,
                    'name' => $collection->name,
                    'slug' => $collection->slug,
                ];
            });

        return response()->json($collections);
    }
}
