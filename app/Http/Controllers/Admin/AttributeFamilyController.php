<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\AttributeFamily;
use App\Models\AttributeGroup;
use App\Http\Requests\Admin\AttributeFamilyStoreRequest;
use App\Http\Requests\Admin\AttributeFamilyUpdateRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttributeFamilyController extends Controller
{
    private const ROOT_VIEW = 'app';

    public function index(Request $request)
    {
        $query = AttributeFamily::query();

        // Search
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%');
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $families = $query->paginate($perPage);

        return Inertia::render('Admin/AttributeFamilies/Index', [
            'families' => $families->items(),
            'pagination' => [
                'total' => $families->total(),
                'per_page' => $families->perPage(),
                'current_page' => $families->currentPage(),
                'last_page' => $families->lastPage(),
                'from' => $families->firstItem(),
                'to' => $families->lastItem(),
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
        // Load all attributes to be displayed in "Unassigned Attributes"
        $attributes = Attribute::orderBy('position')->get();

        return Inertia::render('Admin/AttributeFamilies/Create', [
            'attributes' => $attributes,
        ], self::ROOT_VIEW);
    }

    public function store(AttributeFamilyStoreRequest $request)
    {
        $validated = $request->validated();

        $family = AttributeFamily::create([
            'code' => $validated['code'],
            'name' => $validated['name'],
            'status' => $request->boolean('status', true),
            'is_user_defined' => true,
        ]);

        foreach ($validated['groups'] as $groupData) {
            $group = $family->groups()->create([
                'name' => $groupData['name'],
                'position' => $groupData['position'],
                'is_user_defined' => true,
            ]);

            if (isset($groupData['attribute_ids']) && count($groupData['attribute_ids']) > 0) {
                $syncData = [];
                foreach ($groupData['attribute_ids'] as $idx => $attrId) {
                    $syncData[$attrId] = ['position' => $idx + 1];
                }
                $group->custom_attributes()->sync($syncData);
            }
        }

        return redirect()->route('admin.attribute_families.index')->with('success', 'Attribute Family created successfully.');
    }

    public function edit($id)
    {
        $family = AttributeFamily::with(['groups.custom_attributes'])->findOrFail($id);
        $attributes = Attribute::orderBy('position')->get();

        $familyData = [
            'id' => $family->id,
            'code' => $family->code,
            'name' => $family->name,
            'status' => $family->status,
            'groups' => $family->groups->map(function ($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'position' => $group->position,
                    'attribute_ids' => $group->custom_attributes->pluck('id')->toArray(),
                ];
            }),
        ];

        return Inertia::render('Admin/AttributeFamilies/Edit', [
            'family' => $familyData,
            'attributes' => $attributes,
        ], self::ROOT_VIEW);
    }

    public function update(AttributeFamilyUpdateRequest $request, $id)
    {
        $family = AttributeFamily::findOrFail($id);
        $validated = $request->validated();

        $family->update([
            'code' => $validated['code'],
            'name' => $validated['name'],
            'status' => $request->boolean('status', true),
        ]);

        $groupIdsToKeep = [];

        foreach ($validated['groups'] as $groupData) {
            if (isset($groupData['id'])) {
                $group = AttributeGroup::findOrFail($groupData['id']);
                $group->update([
                    'name' => $groupData['name'],
                    'position' => $groupData['position'],
                ]);
            } else {
                $group = $family->groups()->create([
                    'name' => $groupData['name'],
                    'position' => $groupData['position'],
                    'is_user_defined' => true,
                ]);
            }
            $groupIdsToKeep[] = $group->id;

            $syncData = [];
            if (isset($groupData['attribute_ids'])) {
                foreach ($groupData['attribute_ids'] as $idx => $attrId) {
                    $syncData[$attrId] = ['position' => $idx + 1];
                }
            }
            $group->custom_attributes()->sync($syncData);
        }

        // Delete groups not present in update
        $family->groups()->whereNotIn('id', $groupIdsToKeep)->delete();

        return redirect()->route('admin.attribute_families.index')->with('success', 'Attribute Family updated successfully.');
    }

    public function destroy($id)
    {
        $family = AttributeFamily::findOrFail($id);
        $family->delete();

        return redirect()->route('admin.attribute_families.index')->with('success', 'Attribute Family deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:attribute_families,id',
        ]);

        AttributeFamily::whereIn('id', $validated['ids'])->delete();

        return redirect()->route('admin.attribute_families.index')->with('success', 'Attribute Families deleted successfully.');
    }
}
