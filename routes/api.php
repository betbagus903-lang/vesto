<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\WishlistController;

Route::middleware(['web', 'auth'])->group(function () {
    Route::post('/coupons/validate', [CouponController::class, 'validate']);
    Route::get('/wishlists', [WishlistController::class, 'index']);
    Route::post('/wishlists/toggle', [WishlistController::class, 'toggle']);
    Route::post('/wishlists/check', [WishlistController::class, 'check']);
});
