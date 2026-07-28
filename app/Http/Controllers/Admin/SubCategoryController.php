<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SubCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = SubCategory::with('category');

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->status !== null && $request->status !== '') {
            $query->where('status', $request->status === 'active');
        }

        $sortBy    = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage      = $request->get('per_page', 10);
        $subCategories = $query->paginate($perPage);

        return Inertia::render('Admin/SubCategories/Index', [
            'subCategories' => $subCategories->items(),
            'pagination'    => [
                'total'        => $subCategories->total(),
                'per_page'     => $subCategories->perPage(),
                'current_page' => $subCategories->currentPage(),
                'last_page'    => $subCategories->lastPage(),
                'from'         => $subCategories->firstItem(),
                'to'           => $subCategories->lastItem(),
            ],
            'filters'    => [
                'search'     => $request->get('search', ''),
                'category_id'=> $request->get('category_id', ''),
                'status'     => $request->get('status', ''),
                'sort_by'    => $sortBy,
                'sort_order' => $sortOrder,
                'per_page'   => $perPage,
            ],
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ], 'app');
    }



    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255|unique:sub_categories,slug',
            'description' => 'nullable|string',
            'status'      => 'required|boolean',
        ]);

        if (blank($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        SubCategory::create($data);

        return redirect()->route('admin.sub-categories.index')->with('success', 'Sub Category berhasil dibuat.');
    }



    public function update(Request $request, $id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'slug'        => ['nullable', 'string', 'max:255', Rule::unique('sub_categories', 'slug')->ignore($id)],
            'description' => 'nullable|string',
            'status'      => 'required|boolean',
        ]);

        if (blank($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $subCategory->update($data);

        return redirect()->route('admin.sub-categories.index')->with('success', 'Sub Category berhasil diperbarui.');
    }

    public function destroy($id)
    {
        SubCategory::findOrFail($id)->delete();

        return redirect()->route('admin.sub-categories.index')->with('success', 'Sub Category berhasil dihapus.');
    }

    // API: GET /api/sub-categories
    public function apiIndex(Request $request)
    {
        $query = SubCategory::with('category')->where('status', true);

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        return response()->json($query->orderBy('name')->get());
    }

    // API: GET /api/sub-categories/{id}
    public function apiShow($id)
    {
        return response()->json(SubCategory::with('category')->findOrFail($id));
    }

    // API: POST /api/sub-categories
    public function apiStore(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255|unique:sub_categories,slug',
            'description' => 'nullable|string',
            'status'      => 'boolean',
        ]);

        if (blank($data['slug'] ?? null)) {
            $data['slug'] = Str::slug($data['name']);
        }

        return response()->json(SubCategory::create($data), 201);
    }

    // API: PUT /api/sub-categories/{id}
    public function apiUpdate(Request $request, $id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'slug'        => ['nullable', 'string', 'max:255', Rule::unique('sub_categories', 'slug')->ignore($id)],
            'description' => 'nullable|string',
            'status'      => 'boolean',
        ]);

        if (blank($data['slug'] ?? null)) {
            $data['slug'] = Str::slug($data['name']);
        }

        $subCategory->update($data);

        return response()->json($subCategory->fresh('category'));
    }

    // API: DELETE /api/sub-categories/{id}
    public function apiDestroy($id)
    {
        SubCategory::findOrFail($id)->delete();

        return response()->json(['message' => 'Deleted successfully.']);
    }

    // API: GET /api/categories/{id}/sub-categories
    public function apiByCategory($categoryId)
    {
        $subCategories = SubCategory::where('category_id', $categoryId)
            ->where('status', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return response()->json($subCategories);
    }
}
