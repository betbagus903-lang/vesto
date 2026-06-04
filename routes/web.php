<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Buyer\DashboardController as BuyerDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Redirect dashboard
Route::get('/dashboard', function () {
    return match(auth()->user()->role) {
        'admin' => redirect('/admin'),
        default => redirect()->route('buyer.dashboard'),
    };
})->middleware(['auth', 'verified'])->name('dashboard');

// Buyer routes
Route::middleware(['auth', 'verified', 'buyer'])->prefix('buyer')->name('buyer.')->group(function () {
    Route::get('/dashboard', [BuyerDashboardController::class, 'index'])->name('dashboard');
});

// Profile
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
// Static pages
Route::get('/faq', fn() => Inertia::render('Pages/Faq'))->name('faq');
Route::get('/shipping', fn() => Inertia::render('Pages/Shipping'))->name('shipping');
Route::get('/returns', fn() => Inertia::render('Pages/Returns'))->name('returns');
Route::get('/contact', fn() => Inertia::render('Pages/Contact'))->name('contact');
Route::get('/privacy-policy', fn() => Inertia::render('Pages/PrivacyPolicy'))->name('privacy');
Route::get('/terms', fn() => Inertia::render('Pages/Terms'))->name('terms');
require __DIR__.'/auth.php';