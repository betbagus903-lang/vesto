<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\AttributeOption;
use App\Http\Requests\Admin\AttributeStoreRequest;
use App\Http\Requests\Admin\AttributeUpdateRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttributeController extends Controller
{
    private const ROOT_VIEW = 'app';

    public function index(Request $request)
    {
        $query = Attribute::query();

        // Search
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('admin_name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%')
                  ->orWhere('type', 'like', '%' . $request->search . '%');
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $attributes = $query->paginate($perPage);

        return Inertia::render('Admin/Attributes/Index', [
            'attributes' => $attributes->items(),
            'pagination' => [
                'total' => $attributes->total(),
                'per_page' => $attributes->perPage(),
                'current_page' => $attributes->currentPage(),
                'last_page' => $attributes->lastPage(),
                'from' => $attributes->firstItem(),
                'to' => $attributes->lastItem(),
            ],
            'filters' => [
                'search' => $request->get('search', ''),
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'per_page' => $perPage,
            ],
        ], self::ROOT_VIEW);
    }

    public function create()
    {
        return Inertia::render('Admin/Attributes/Create', [], self::ROOT_VIEW);
    }

    public function store(AttributeStoreRequest $request)
    {
        $validated = $request->validated();

        $attributeData = collect($validated)->except('options')->toArray();
        
        // Ensure boolean casting
        $booleanFields = [
            'is_required', 'is_unique', 'value_per_locale', 'value_per_channel',
            'is_filterable', 'is_configurable', 'is_visible_on_front', 'is_comparable'
        ];
        foreach ($booleanFields as $field) {
            $attributeData[$field] = $request->boolean($field);
        }

        $attribute = Attribute::create($attributeData);

        if (in_array($attribute->type, ['select', 'multiselect']) && isset($validated['options'])) {
            foreach ($validated['options'] as $option) {
                $attribute->options()->create([
                    'admin_name' => $option['admin_name'],
                    'sort_order' => $option['sort_order'] ?? 0,
                ]);
            }
        }

        return redirect()->route('admin.attributes.index')->with('success', 'Attribute created successfully.');
    }

    public function edit($id)
    {
        $attribute = Attribute::with('options')->findOrFail($id);

        return Inertia::render('Admin/Attributes/Edit', [
            'attribute' => $attribute,
        ], self::ROOT_VIEW);
    }

    public function update(AttributeUpdateRequest $request, $id)
    {
        $attribute = Attribute::findOrFail($id);
        $validated = $request->validated();

        $attributeData = collect($validated)->except('options')->toArray();
        
        // Ensure boolean casting
        $booleanFields = [
            'is_required', 'is_unique', 'value_per_locale', 'value_per_channel',
            'is_filterable', 'is_configurable', 'is_visible_on_front', 'is_comparable'
        ];
        foreach ($booleanFields as $field) {
            $attributeData[$field] = $request->boolean($field);
        }

        $attribute->update($attributeData);

        if (in_array($attribute->type, ['select', 'multiselect']) && isset($validated['options'])) {
            $optionIdsToKeep = [];

            foreach ($validated['options'] as $optionData) {
                if (isset($optionData['id'])) {
                    $option = AttributeOption::findOrFail($optionData['id']);
                    $option->update([
                        'admin_name' => $optionData['admin_name'],
                        'sort_order' => $optionData['sort_order'] ?? 0,
                    ]);
                    $optionIdsToKeep[] = $option->id;
                } else {
                    $newOption = $attribute->options()->create([
                        'admin_name' => $optionData['admin_name'],
                        'sort_order' => $optionData['sort_order'] ?? 0,
                    ]);
                    $optionIdsToKeep[] = $newOption->id;
                }
            }

            // Delete options that are no longer present
            $attribute->options()->whereNotIn('id', $optionIdsToKeep)->delete();
        } else {
            // Delete all options if type is changed from select/multiselect
            $attribute->options()->delete();
        }

        return redirect()->route('admin.attributes.index')->with('success', 'Attribute updated successfully.');
    }

    public function destroy($id)
    {
        $attribute = Attribute::findOrFail($id);
        $attribute->delete();

        return redirect()->route('admin.attributes.index')->with('success', 'Attribute deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:attributes,id',
        ]);

        Attribute::whereIn('id', $validated['ids'])->delete();

        return redirect()->route('admin.attributes.index')->with('success', 'Attributes deleted successfully.');
    }
}
