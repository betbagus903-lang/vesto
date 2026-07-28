<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\ReviewReply;
use App\Models\ReviewHelpfulLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReviewController extends Controller
{
    /**
     * Store a newly created review
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'order_id' => 'nullable|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string',
            'images' => 'nullable|array',
            'images.*' => 'image|max:2048',
        ]);

        // Check if user has any delivered order containing this product (any variant)
        // This allows users to review the product even if they ordered a different variant
        $hasDeliveredOrder = Order::where('user_id', auth()->id())
            ->where('status', 'delivered')
            ->whereHas('items', function($query) use ($request) {
                $query->where('product_id', $request->product_id);
            })
            ->exists();

        if (!$hasDeliveredOrder) {
            return back()->withErrors(['message' => 'You can only review products from delivered orders.']);
        }

        // If order_id is provided, check if it belongs to user and contains the product
        if ($request->order_id) {
            $order = Order::findOrFail($request->order_id);
            if ($order->user_id !== auth()->id()) {
                return back()->withErrors(['message' => 'You can only review your own orders.']);
            }

            if (!$order->items()->where('product_id', $request->product_id)->exists()) {
                return back()->withErrors(['message' => 'This product is not in your order.']);
            }
        } else {
            // Auto-select the first delivered order containing this product
            $order = Order::where('user_id', auth()->id())
                ->where('status', 'delivered')
                ->whereHas('items', function($query) use ($request) {
                    $query->where('product_id', $request->product_id);
                })
                ->first();
        }

        // Check if user already reviewed this product
        // Allow one review per product (not per variant) for more flexibility
        $existingReview = Review::where('user_id', auth()->id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingReview) {
            return back()->withErrors(['message' => 'You have already reviewed this product.']);
        }

        // Handle image uploads
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews', 'public');
                $imagePaths[] = $path;
            }
        }

        // Create review
        $review = Review::create([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id,
            'variant_id' => $request->variant_id,
            'order_id' => $order->id,
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment,
            'images' => $imagePaths,
            'status' => 'approved', // Auto-approve for immediate display
        ]);

        $product = Product::findOrFail($request->product_id);
        return redirect()->route('product.show', $product->slug)->with('success', 'Review submitted successfully.');
    }

    /**
     * Show reviews for a specific product (for buyer)
     */
    public function productReviews(Product $product)
    {
        $reviews = Review::with('user')
            ->where('product_id', $product->id)
            ->where('status', 'approved')
            ->latest()
            ->get();

        return response()->json($reviews);
    }

    /**
     * Show user's reviews (for buyer dashboard)
     */
    public function myReviews()
    {
        $reviews = Review::with(['product', 'order'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return inertia('Buyer/MyReviews', [
            'reviews' => $reviews,
        ]);
    }

    /**
     * Update a review
     */
    public function update(Request $request, Review $review)
    {
        if ($review->user_id !== auth()->id()) {
            return back()->withErrors(['message' => 'You can only edit your own reviews.']);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string',
        ]);

        $review->update([
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Review updated successfully.');
    }

    /**
     * Delete a review
     */
    public function destroy(Review $review)
    {
        if ($review->user_id !== auth()->id()) {
            return back()->withErrors(['message' => 'You can only delete your own reviews.']);
        }

        $review->delete();

        return back()->with('success', 'Review deleted successfully.');
    }

    /**
     * Store a reply to a review
     */
    public function storeReply(Request $request, Review $review)
    {
        $request->validate([
            'comment' => 'required|string',
            'parent_id' => 'nullable|exists:review_replies,id',
        ]);

        $isAdmin = auth()->user()->isAdmin();

        ReviewReply::create([
            'review_id' => $review->id,
            'user_id' => auth()->id(),
            'parent_id' => $request->parent_id,
            'comment' => $request->comment,
            'is_admin' => $isAdmin,
        ]);

        return back()->with('success', 'Reply added successfully.');
    }

    /**
     * Update a reply
     */
    public function updateReply(Request $request, Review $review, ReviewReply $reply)
    {
        if ($reply->user_id !== auth()->id()) {
            return back()->withErrors(['message' => 'You can only edit your own replies.']);
        }

        $request->validate([
            'comment' => 'required|string',
        ]);

        $reply->update([
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Reply updated successfully.');
    }

    /**
     * Delete a reply
     */
    public function destroyReply(Review $review, ReviewReply $reply)
    {
        if ($reply->user_id !== auth()->id()) {
            return back()->withErrors(['message' => 'You can only delete your own replies.']);
        }

        $reply->delete();

        return back()->with('success', 'Reply deleted successfully.');
    }

    /**
     * Toggle helpful like for a review
     */
    public function toggleHelpful(Review $review)
    {
        $existingLike = ReviewHelpfulLike::where('review_id', $review->id)
            ->where('user_id', auth()->id())
            ->first();

        if ($existingLike) {
            $existingLike->delete();
        } else {
            ReviewHelpfulLike::create([
                'review_id' => $review->id,
                'user_id' => auth()->id(),
            ]);
        }

        return back();
    }
}
