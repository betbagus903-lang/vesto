<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerGroup;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CustomerGroupController extends Controller
{
    public function index(Request $request)
    {
        $query = CustomerGroup::query();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%');
            });
        }

        $sortBy    = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = (int) $request->get('per_page', 10);
        $groups  = $query->paginate($perPage);

        return Inertia::render('Admin/Customers/Groups', [
            'groups' => $groups->items(),
            'pagination' => [
                'total'        => $groups->total(),
                'per_page'     => $groups->perPage(),
                'current_page' => $groups->currentPage(),
                'last_page'    => $groups->lastPage(),
                'from'         => $groups->firstItem() ?? 0,
                'to'           => $groups->lastItem()  ?? 0,
            ],
            'filters' => [
                'search'     => $request->get('search', ''),
                'sort_by'    => $sortBy,
                'sort_order' => $sortOrder,
                'per_page'   => $perPage,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:255',
                'unique:customer_groups,code',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
            ],
            'name' => 'required|string|max:255',
        ], [
            'code.regex' => 'The Code may only contain lowercase letters, numbers and hyphens.',
        ]);

        $group = CustomerGroup::create($validated);

        return back()->with('success', 'Group created successfully.');
    }

    public function update(Request $request, CustomerGroup $customerGroup)
    {
        $validated = $request->validate([
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('customer_groups', 'code')->ignore($customerGroup->id),
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
            ],
            'name' => 'required|string|max:255',
        ], [
            'code.regex' => 'The Code may only contain lowercase letters, numbers and hyphens.',
        ]);

        $customerGroup->update($validated);

        return back()->with('success', 'Group updated successfully.');
    }

    public function destroy(CustomerGroup $customerGroup)
    {
        $customerGroup->delete();

        return back()->with('success', 'Group deleted successfully.');
    }
}
