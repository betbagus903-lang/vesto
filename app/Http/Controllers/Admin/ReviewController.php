<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Display all reviews for moderation
     */
    public function index(Request $request)
    {
        $query = Review::with(['user', 'product', 'order'])
            ->when($request->filled('status'), function ($q) use ($request) {
                return $q->where('status', $request->status);
            })
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->search;
                return $q->where('comment', 'like', "%{$search}%")
                    ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('product', fn($p) => $p->where('name', 'like', "%{$search}%"));
            })
            ->latest();

        $reviews = $query->paginate(20);

        return Inertia::render('Admin/Catalog/Reviews/Index', [
            'reviews' => $reviews->items(),
            'pagination' => [
                'total' => $reviews->total(),
                'per_page' => $reviews->perPage(),
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'from' => $reviews->firstItem() ?? 0,
                'to' => $reviews->lastItem() ?? 0,
            ],
            'filters' => [
                'status' => $request->get('status', ''),
                'search' => $request->get('search', ''),
            ],
        ]);
    }

    /**
     * Approve a review
     */
    public function approve(Review $review)
    {
        $review->update(['status' => 'approved']);
        return back()->with('success', 'Review approved successfully.');
    }

    /**
     * Hide a review
     */
    public function hide(Review $review)
    {
        $review->update(['status' => 'hidden']);
        return back()->with('success', 'Review hidden successfully.');
    }

    /**
     * Delete a review permanently
     */
    public function destroy(Review $review)
    {
        // Delete review images from storage
        if ($review->images) {
            foreach ($review->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $review->delete();
        return back()->with('success', 'Review deleted successfully.');
    }
}
