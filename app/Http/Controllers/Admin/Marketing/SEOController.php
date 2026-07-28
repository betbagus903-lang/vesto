<?php

namespace App\Http\Controllers\Admin\Marketing;

use App\Http\Controllers\Controller;
use App\Models\SeoSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SEOController extends Controller
{
    public function index()
    {
        $seoSettings = SeoSetting::all()->keyBy('page_type');
        
        $stats = [
            'seo_score' => 92,
            'indexed_pages' => 124,
            'meta_completed' => 96,
            'broken_links' => 0,
            'organic_traffic' => 18523,
        ];
        
        return Inertia::render('Admin/Marketing/SEO/Index', [
            'seoSettings' => $seoSettings,
            'stats' => $stats,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'page_type' => 'required|string',
            'page_id' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'keywords' => 'nullable|string',
            'og_image' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'auto_generate_meta' => 'boolean',
            'auto_generate_slug' => 'boolean',
            'auto_generate_keywords' => 'boolean',
            'auto_generate_description' => 'boolean',
            'robots_txt' => 'nullable|string',
        ]);

        SeoSetting::updateOrCreate(
            ['page_type' => $validated['page_type'], 'page_id' => $validated['page_id'] ?? null],
            $validated
        );
        
        return redirect()->route('admin.marketing.seo.index');
    }
}
