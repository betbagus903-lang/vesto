<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $wishlists = Wishlist::where('user_id', $user->id)
            ->with('product')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'wishlists' => $wishlists->map(function ($wishlist) {
                return [
                    'id' => $wishlist->id,
                    'product_id' => $wishlist->product_id,
                    'name' => $wishlist->product->name,
                    'price' => $wishlist->product->price,
                    'image' => $wishlist->product->thumbnail_url,
                ];
            }),
        ]);
    }

    public function toggle(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            \Log::error('User not authenticated in wishlist toggle');
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated',
            ], 401);
        }

        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $productId = $request->product_id;

        \Log::info('Wishlist toggle request', [
            'user_id' => $user->id,
            'product_id' => $productId,
        ]);

        $existingWishlist = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($existingWishlist) {
            // Remove from wishlist
            $existingWishlist->delete();
            \Log::info('Removed from wishlist', ['product_id' => $productId]);
            return response()->json([
                'success' => true,
                'action' => 'removed',
                'message' => 'Removed from wishlist',
                'product_id' => $productId,
                'in_wishlist' => false,
            ]);
        } else {
            // Add to wishlist
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);
            \Log::info('Added to wishlist', ['product_id' => $productId]);
            return response()->json([
                'success' => true,
                'action' => 'added',
                'message' => 'Added to wishlist',
                'product_id' => $productId,
                'in_wishlist' => true,
            ]);
        }
    }

    public function check(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = Auth::user();
        $productId = $request->product_id;

        $isWishlisted = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->exists();

        return response()->json([
            'success' => true,
            'is_wishlisted' => $isWishlisted,
        ]);
    }
}
