<?php

namespace App\Http\Controllers\Buyer;

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

        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $productId = $request->product_id;

        $existingWishlist = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($existingWishlist) {
            // Remove from wishlist
            $existingWishlist->delete();
            return response()->json([
                'success' => true,
                'action' => 'removed',
                'message' => 'Removed from wishlist',
                'product_id' => $productId,
            ]);
        } else {
            // Add to wishlist
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);
            return response()->json([
                'success' => true,
                'action' => 'added',
                'message' => 'Added to wishlist',
                'product_id' => $productId,
            ]);
        }
    }
}
