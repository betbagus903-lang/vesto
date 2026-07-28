<?php

namespace App\Http\Controllers\Admin\Marketing;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampaignController extends Controller
{
    public function index()
    {
        $campaigns = Campaign::orderBy('created_at', 'desc')->get();
        
        $stats = [
            'total' => Campaign::count(),
            'active' => Campaign::where('status', 'active')->count(),
            'scheduled' => Campaign::where('status', 'scheduled')->count(),
            'ended' => Campaign::whereIn('status', ['finished', 'expired'])->count(),
        ];
        
        return Inertia::render('Admin/Marketing/Campaigns/Index', [
            'campaigns' => $campaigns,
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Marketing/Campaigns/Create', [
            'categories' => Category::select('id', 'name')->get(),
            'collections' => Collection::select('id', 'name')->get(),
            'products' => Product::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'banner' => 'nullable|string',
            'campaign_type' => 'required|in:homepage,collection,category,product',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:draft,scheduled,active,expired,finished',
            'target_category_id' => 'nullable|exists:categories,id',
            'target_collection_id' => 'nullable|exists:collections,id',
            'target_products' => 'nullable|array',
            'button_text' => 'nullable|string|max:255',
            'button_url' => 'nullable|string|max:255',
            'priority' => 'nullable|integer|min:1',
        ]);

        Campaign::create($validated);
        return redirect()->route('admin.marketing.campaigns.index');
    }

    public function edit($id)
    {
        $campaign = Campaign::findOrFail($id);
        
        return Inertia::render('Admin/Marketing/Campaigns/Create', [
            'campaign' => $campaign,
            'categories' => Category::select('id', 'name')->get(),
            'collections' => Collection::select('id', 'name')->get(),
            'products' => Product::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $campaign = Campaign::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'banner' => 'nullable|string',
            'campaign_type' => 'required|in:homepage,collection,category,product',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:draft,scheduled,active,expired,finished',
            'target_category_id' => 'nullable|exists:categories,id',
            'target_collection_id' => 'nullable|exists:collections,id',
            'target_products' => 'nullable|array',
            'button_text' => 'nullable|string|max:255',
            'button_url' => 'nullable|string|max:255',
            'priority' => 'nullable|integer|min:1',
        ]);

        $campaign->update($validated);
        return redirect()->route('admin.marketing.campaigns.index');
    }

    public function destroy($id)
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->delete();
        return redirect()->route('admin.marketing.campaigns.index');
    }
}
