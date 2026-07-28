<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerGroup;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /* ── Index ──────────────────────────────────────── */
    public function index(Request $request)
    {
        $query = Customer::with('customerGroup');

        // Search
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('first_name', 'like', "%{$s}%")
                  ->orWhere('last_name',  'like', "%{$s}%")
                  ->orWhere('email',      'like', "%{$s}%")
                  ->orWhere('phone',      'like', "%{$s}%");
            });
        }

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('customer_group_id')) {
            $query->where('customer_group_id', $request->customer_group_id);
        }
        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }
        if ($request->filled('channel')) {
            $query->where('channel', $request->channel);
        }

        // Sort
        $sortBy    = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginate
        $perPage   = (int) $request->get('per_page', 10);
        $customers = $query->paginate($perPage);

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers->items(),
            'pagination' => [
                'total'        => $customers->total(),
                'per_page'     => $customers->perPage(),
                'current_page' => $customers->currentPage(),
                'last_page'    => $customers->lastPage(),
                'from'         => $customers->firstItem() ?? 0,
                'to'           => $customers->lastItem()  ?? 0,
            ],
            'filters' => [
                'search'            => $request->get('search', ''),
                'status'            => $request->get('status', ''),
                'customer_group_id' => $request->get('customer_group_id', ''),
                'gender'            => $request->get('gender', ''),
                'channel'           => $request->get('channel', ''),
                'sort_by'           => $sortBy,
                'sort_order'        => $sortOrder,
                'per_page'          => $perPage,
            ],
            'customerGroups' => CustomerGroup::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /* ── Store ──────────────────────────────────────── */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'        => 'required|string|max:255',
            'last_name'         => 'required|string|max:255',
            'email'             => 'required|email|unique:customers,email',
            'phone'             => 'nullable|string|max:20',
            'gender'            => 'required|in:male,female,other',
            'date_of_birth'     => 'nullable|date|before:today',
            'channel'           => 'required|string|max:50',
            'customer_group_id' => 'required|exists:customer_groups,id',
            'status'            => 'sometimes|in:active,inactive',
        ]);

        $validated['status'] = $validated['status'] ?? 'active';

        Customer::create($validated);

        return back()->with('success', 'Customer created successfully.');
    }

    /* ── Show ───────────────────────────────────────── */
    public function show(Customer $customer)
    {
        $customer->load('customerGroup');

        return Inertia::render('Admin/Customers/Show', [
            'customer' => [
                'id'                => $customer->id,
                'first_name'        => $customer->first_name,
                'last_name'         => $customer->last_name,
                'full_name'         => $customer->full_name,
                'email'             => $customer->email,
                'phone'             => $customer->phone,
                'gender'            => $customer->gender,
                'date_of_birth'     => $customer->date_of_birth?->format('Y-m-d'),
                'status'            => $customer->status,
                'channel'           => $customer->channel,
                'customer_group_id' => $customer->customer_group_id,
                'customer_group'    => $customer->customerGroup,
                'profile_pic'       => $customer->profile_pic,
                'created_at'        => $customer->created_at->format('d M Y, H:i'),
                'updated_at'        => $customer->updated_at->format('d M Y, H:i'),
            ],
            // Placeholder arrays — will be populated when those modules are built
            'addresses' => [],
            'orders'    => [],
            'reviews'   => [],
            'wishlist'  => [],
        ]);
    }

    /* ── Update ─────────────────────────────────────── */
    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'first_name'        => 'required|string|max:255',
            'last_name'         => 'required|string|max:255',
            'email'             => ['required', 'email', Rule::unique('customers', 'email')->ignore($customer->id)],
            'phone'             => 'nullable|string|max:20',
            'gender'            => 'required|in:male,female,other',
            'date_of_birth'     => 'nullable|date|before:today',
            'channel'           => 'required|string|max:50',
            'customer_group_id' => 'required|exists:customer_groups,id',
            'status'            => 'required|in:active,inactive',
        ]);

        $customer->update($validated);

        return back()->with('success', 'Customer updated successfully.');
    }

    /* ── Destroy ─────────────────────────────────────── */
    public function destroy(Customer $customer)
    {
        $customer->delete();

        return back()->with('success', 'Customer deleted successfully.');
    }
}
