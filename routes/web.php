<?php

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StorefrontController;
use App\Http\Controllers\Buyer\DashboardController as BuyerDashboardController;
use App\Http\Controllers\Buyer\ProfileController as BuyerProfileController;
use App\Http\Controllers\Buyer\WishlistController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CollectionController;
use App\Http\Controllers\Admin\AttributeController;
use App\Http\Controllers\Admin\AttributeFamilyController;
use App\Http\Controllers\Admin\CustomerGroupController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ShipmentController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Admin\Marketing\CampaignController;
use App\Http\Controllers\Admin\Marketing\CouponController;
use App\Http\Controllers\Admin\Marketing\SEOController;
use App\Http\Controllers\Admin\AIAssistantController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\FinanceController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\CalendarController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\ProductQuestionController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Welcome page (landing page pertama) - PUBLIC
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
})->name('welcome');

// Redirect /welcome to root
Route::get('/welcome', function () {
    return redirect()->route('welcome');
})->name('welcome.redirect');

// Store home page (Home.jsx dengan produk/kategori) - AUTH REQUIRED
Route::middleware(['auth'])->group(function () {
    Route::get('/home', [StorefrontController::class, 'home'])->name('home');
    
    // Earth Well landing page
    Route::get('/earthwell', fn() => Inertia::render('EarthWell'))->name('earthwell');
    
    // Shop (dengan opsi category)
    Route::get('/shop/{category?}', [StorefrontController::class, 'shop'])->name('shop');
    
    // Cart
    Route::get('/cart', fn() => Inertia::render('Cart'))->name('cart');
});

// Checkout - requires authentication
Route::middleware(['auth'])->group(function () {
    Route::get('/checkout', fn() => Inertia::render('Checkout'))->name('checkout');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
});

// Order Success - AUTH REQUIRED (after checkout)
Route::middleware(['auth'])->group(function () {
    Route::get('/order-success', fn() => Inertia::render('OrderSuccess'))->name('order.success');
});

// Product detail - AUTH REQUIRED
Route::middleware(['auth'])->group(function () {
    Route::get('/products/{slug}', [StorefrontController::class, 'product'])->name('product.show');
    Route::post('/products/{id}/questions', [ProductQuestionController::class, 'store'])->name('product.questions.store');
});

// Redirect dashboard - AUTH REQUIRED
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();
        
        if ($user->role === 'admin') {
            return redirect('/admin/dashboard');
        }
        
        return redirect()->route('buyer.dashboard');
    })->name('dashboard');
});

// Buyer routes
Route::middleware(['auth', 'buyer'])->prefix('buyer')->group(function () {
    Route::get('/dashboard', [BuyerDashboardController::class, 'index'])->name('buyer.dashboard');
    Route::get('/orders', [BuyerDashboardController::class, 'orders'])->name('buyer.orders');
    Route::get('/wishlist', [BuyerDashboardController::class, 'wishlist'])->name('buyer.wishlist');
    Route::post('/wishlist/toggle', [Buyer\WishlistController::class, 'toggle'])->name('buyer.wishlist.toggle');
    Route::get('/profile', [BuyerProfileController::class, 'index'])->name('buyer.profile');
    Route::put('/profile', [BuyerProfileController::class, 'update'])->name('buyer.profile.update');
    Route::get('/reviews', [BuyerDashboardController::class, 'reviews'])->name('buyer.reviews');
    Route::get('/coupons', [BuyerDashboardController::class, 'coupons'])->name('buyer.coupons');
    Route::get('/addresses', fn() => Inertia::render('Buyer/Addresses'))->name('buyer.addresses');
    Route::get('/payment-methods', fn() => Inertia::render('Buyer/PaymentMethods'))->name('buyer.payment-methods');
    Route::get('/notifications', fn() => Inertia::render('Buyer/Notifications'))->name('buyer.notifications');
    Route::get('/security', fn() => Inertia::render('Buyer/Security'))->name('buyer.security');
    Route::get('/settings', fn() => Inertia::render('Buyer/Settings'))->name('buyer.settings');
});

// Admin routes (Vue.js)
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/settings', fn() => Inertia::render('Admin/Settings'))->name('settings');
        // Products routes
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/search', [ProductController::class, 'search'])->name('products.search');
    
    // Route untuk Bulk Actions & Duplicate (Harus di atas route /products/{id}!)
    Route::post('/products/bulk-delete', [ProductController::class, 'bulkDelete'])->name('products.bulk-delete');
    Route::post('/products/bulk-activate', [ProductController::class, 'bulkActivate'])->name('products.bulk-activate');
    Route::post('/products/bulk-deactivate', [ProductController::class, 'bulkDeactivate'])->name('products.bulk-deactivate');
    Route::post('/products/{id}/images', [ProductController::class, 'uploadImage'])->name('products.uploadImage');
    Route::post('/products/{id}/configure-attributes', [ProductController::class, 'configureAttributes'])->name('products.configure-attributes');
    
    // Product Variants routes (MUST be before generic /products/{id} routes!)
    Route::post('/products/{id}/variants', [ProductController::class, 'storeVariant'])->name('products.variants.store');
 Route::get('/product-variants/{variant}', [ProductController::class, 'getVariant'])->name('product-variants.show');
    Route::post('/product-variants/{variant}/images', [ProductController::class, 'uploadVariantImage'])->name('product-variants.uploadImage');
    Route::post('/product-variants/{variant}/update', [ProductController::class, 'updateVariant'])->name('product-variants.update-with-files');
    Route::put('/product-variants/{variant}', [ProductController::class, 'updateVariant'])->name('product-variants.update');
    Route::delete('/product-variants/{variant}', [ProductController::class, 'destroyVariant'])->name('product-variants.destroy');
    
    // Product Designer routes (MUST be before generic /products/{id} routes!)
    Route::get('/products/design/{id}/image/{index}', [ProductController::class, 'designImage'])->name('products.design.image');
    Route::get('/products/design/{id}/variant/{variantId}/image/{index}', [ProductController::class, 'designVariantImage'])->name('products.design.variant.image');
    Route::post('/products/save-design', [ProductController::class, 'saveProductDesign'])->name('products.save-design');
    Route::post('/product-variants/{variant}/copy-design', [ProductController::class, 'copyVariantDesign'])->name('product-variants.copy-design');
    
    // Route Detail, Edit, Update, Delete, Duplicate
    Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
    Route::get('/products/{id}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::get('/products/{id}/configurableedit', [ProductController::class, 'configurableEdit'])->name('products.configurableedit');
    Route::put('/products/{id}', [ProductController::class, 'update'])->name('products.update');
    Route::post('/products/{id}/duplicate', [ProductController::class, 'duplicate'])->name('products.duplicate');
    Route::delete('/products/{id}', [ProductController::class, 'destroy'])->name('products.destroy');
    
    // Attributes routes
    Route::post('/attributes/bulk-delete', [AttributeController::class, 'bulkDelete'])->name('attributes.bulk-delete');
    Route::get('/attributes', [AttributeController::class, 'index'])->name('attributes.index');
    Route::get('/attributes/create', [AttributeController::class, 'create'])->name('attributes.create');
    Route::post('/attributes', [AttributeController::class, 'store'])->name('attributes.store');
    Route::get('/attributes/{id}/edit', [AttributeController::class, 'edit'])->name('attributes.edit');
    Route::put('/attributes/{id}', [AttributeController::class, 'update'])->name('attributes.update');
    Route::delete('/attributes/{id}', [AttributeController::class, 'destroy'])->name('attributes.destroy');

    // Attribute Families routes
    Route::post('/attribute-families/bulk-delete', [AttributeFamilyController::class, 'bulkDelete'])->name('attribute-families.bulk-delete');
    Route::get('/attribute-families', [AttributeFamilyController::class, 'index'])->name('attribute-families.index');
    Route::get('/attribute-families/create', [AttributeFamilyController::class, 'create'])->name('attribute-families.create');
    Route::post('/attribute-families', [AttributeFamilyController::class, 'store'])->name('attribute-families.store');
    Route::get('/attribute-families/{id}/edit', [AttributeFamilyController::class, 'edit'])->name('attribute-families.edit');
    Route::put('/attribute-families/{id}', [AttributeFamilyController::class, 'update'])->name('attribute-families.update');
    Route::delete('/attribute-families/{id}', [AttributeFamilyController::class, 'destroy'])->name('attribute-families.destroy');

    // Users Management
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::post('/users/bulk-delete', [UserController::class, 'bulkDelete'])->name('users.bulk-delete');
    // User detail routes — wildcard AFTER named sub-routes
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::put('/users/{user}/status', [UserController::class, 'updateStatus'])->name('users.status');
    Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/sales', [ReportController::class, 'sales'])->name('reports.sales');
    Route::get('/reports/customers', [ReportController::class, 'customers'])->name('reports.customers');
    Route::get('/reports/products', [ReportController::class, 'products'])->name('reports.products');
    Route::get('/reports/inventory', [ReportController::class, 'inventory'])->name('reports.inventory');
    Route::post('/reports/export', [ReportController::class, 'export'])->name('reports.export');

    // Customers routes
    Route::get('/customers',                            [CustomerController::class, 'index'])->name('customers.index');
    Route::post('/customers',                           [CustomerController::class, 'store'])->name('customers.store');
    // Customer Groups — must be BEFORE /customers/{customer} wildcard
    Route::get('/customers/groups',                     [CustomerGroupController::class, 'index'])->name('customers.groups');
    Route::post('/customers/groups',                    [CustomerGroupController::class, 'store'])->name('customers.groups.store');
    Route::put('/customers/groups/{customerGroup}',     [CustomerGroupController::class, 'update'])->name('customers.groups.update');
    Route::delete('/customers/groups/{customerGroup}',  [CustomerGroupController::class, 'destroy'])->name('customers.groups.destroy');
    Route::get('/customers/reviews',                    fn() => Inertia::render('Admin/Customers/Reviews'))->name('customers.reviews');
    Route::get('/customers/gdpr-data-requests',         fn() => Inertia::render('Admin/Customers/GdprDataRequests'))->name('customers.gdpr');
    // Customer detail routes — wildcard AFTER named sub-routes
    Route::get('/customers/{customer}',                 [CustomerController::class, 'show'])->name('customers.show');
    Route::put('/customers/{customer}',                 [CustomerController::class, 'update'])->name('customers.update');
    Route::delete('/customers/{customer}',              [CustomerController::class, 'destroy'])->name('customers.destroy');

    // Sales — Orders
    Route::get('/sales/orders',                          [AdminOrderController::class, 'index'])->name('sales.orders.index');
    Route::get('/sales/orders/create',                   [AdminOrderController::class, 'create'])->name('sales.orders.create');
    Route::post('/sales/orders',                         [AdminOrderController::class, 'store'])->name('sales.orders.store');
    Route::get('/sales/orders/{order}',                  [AdminOrderController::class, 'show'])->name('sales.orders.show');
    Route::patch('/sales/orders/{order}/status',         [AdminOrderController::class, 'updateStatus'])->name('sales.orders.status');
    Route::post('/sales/orders/{order}/invoice',         [AdminOrderController::class, 'createInvoice'])->name('sales.orders.create-invoice');
    Route::post('/sales/orders/{order}/shipment',        [AdminOrderController::class, 'createShipment'])->name('sales.orders.create-shipment');
    Route::get('/sales/orders/search/customers',         [AdminOrderController::class, 'searchCustomers'])->name('sales.orders.search-customers');
    Route::get('/sales/orders/search/products',          [AdminOrderController::class, 'searchProducts'])->name('sales.orders.search-products');

    // Sales — Shipments
    Route::get('/sales/shipments',                       [ShipmentController::class, 'index'])->name('sales.shipments.index');
    Route::get('/sales/shipments/{shipment}',            [ShipmentController::class, 'show'])->name('sales.shipments.show');
    Route::patch('/sales/shipments/{shipment}/status',   [ShipmentController::class, 'updateStatus'])->name('sales.shipments.status');

    // Sales — Invoices
    Route::get('/sales/invoices',                        [InvoiceController::class, 'index'])->name('sales.invoices.index');
    Route::get('/sales/invoices/{invoice}',              [InvoiceController::class, 'show'])->name('sales.invoices.show');
    Route::get('/sales/invoices/{invoice}/download',     [InvoiceController::class, 'download'])->name('sales.invoices.download');
    Route::patch('/sales/invoices/{invoice}/payment',    [InvoiceController::class, 'updatePaymentStatus'])->name('sales.invoices.payment');

    // Categories routes
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/search', [CategoryController::class, 'search'])->name('categories.search');
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{id}', [CategoryController::class, 'show'])->name('categories.show');
    Route::get('/categories/{id}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::post('/categories/upload-image', [CategoryController::class, 'uploadImage'])->name('categories.upload-image');
    Route::put('/categories/{id}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    Route::post('/categories/bulk-delete', [CategoryController::class, 'bulkDelete'])->name('categories.bulk-delete');
    Route::post('/categories/bulk-activate', [CategoryController::class, 'bulkActivate'])->name('categories.bulk-activate');
    Route::post('/categories/bulk-deactivate', [CategoryController::class, 'bulkDeactivate'])->name('categories.bulk-deactivate');

    // Catalog — Reviews
    Route::get('/catalog/reviews', [AdminReviewController::class, 'index'])->name('catalog.reviews.index');
    Route::post('/catalog/reviews/{review}/approve', [AdminReviewController::class, 'approve'])->name('catalog.reviews.approve');
    Route::post('/catalog/reviews/{review}/hide', [AdminReviewController::class, 'hide'])->name('catalog.reviews.hide');
    Route::delete('/catalog/reviews/{review}', [AdminReviewController::class, 'destroy'])->name('catalog.reviews.destroy');

    // CMS — Banners
    Route::prefix('cms')->name('cms.')->group(function () {
        Route::get('/banners', [BannerController::class, 'index'])->name('banners.index');
        Route::get('/banners/create', [BannerController::class, 'create'])->name('banners.create');
        Route::post('/banners', [BannerController::class, 'store'])->name('banners.store');
        Route::post('/banners/upload-image', [BannerController::class, 'uploadImage'])->name('banners.upload-image');
        Route::post('/banners/upload-design-asset', [BannerController::class, 'uploadDesignAsset'])->name('banners.upload-design-asset');
        Route::get('/banners/designer', [BannerController::class, 'designer'])->name('banners.designer');
        Route::post('/banners/save-design', [BannerController::class, 'saveDesign'])->name('banners.save-design');
        Route::get('/banners/{banner}/edit', [BannerController::class, 'edit'])->name('banners.edit');
        Route::get('/banners/{banner}/designer', [BannerController::class, 'designerEdit'])->name('banners.designer-edit');
        Route::put('/banners/{banner}', [BannerController::class, 'update'])->name('banners.update');
        Route::delete('/banners/{banner}', [BannerController::class, 'destroy'])->name('banners.destroy');

        // CMS — Collections
        Route::get('/collections', [CollectionController::class, 'index'])->name('collections.index');
        Route::get('/collections/create', [CollectionController::class, 'create'])->name('collections.create');
        Route::post('/collections', [CollectionController::class, 'store'])->name('collections.store');
        Route::post('/collections/preview', [CollectionController::class, 'preview'])->name('collections.preview');
        Route::get('/collections/search', [CollectionController::class, 'search'])->name('collections.search');
        Route::get('/collections/{collection}/edit', [CollectionController::class, 'edit'])->name('collections.edit');
        Route::put('/collections/{collection}', [CollectionController::class, 'update'])->name('collections.update');
        Route::delete('/collections/{collection}', [CollectionController::class, 'destroy'])->name('collections.destroy');
    });

    // Marketing — Campaigns
    Route::prefix('marketing')->name('marketing.')->group(function () {
        Route::get('/campaigns', [CampaignController::class, 'index'])->name('campaigns.index');
        Route::get('/campaigns/create', [CampaignController::class, 'create'])->name('campaigns.create');
        Route::post('/campaigns', [CampaignController::class, 'store'])->name('campaigns.store');
        Route::get('/campaigns/{campaign}/edit', [CampaignController::class, 'edit'])->name('campaigns.edit');
        Route::put('/campaigns/{campaign}', [CampaignController::class, 'update'])->name('campaigns.update');
        Route::delete('/campaigns/{campaign}', [CampaignController::class, 'destroy'])->name('campaigns.destroy');

        // Marketing — Coupons
        Route::get('/coupons', [CouponController::class, 'index'])->name('coupons.index');
        Route::get('/coupons/create', [CouponController::class, 'create'])->name('coupons.create');
        Route::post('/coupons', [CouponController::class, 'store'])->name('coupons.store');
        Route::get('/coupons/{coupon}/edit', [CouponController::class, 'edit'])->name('coupons.edit');
        Route::put('/coupons/{coupon}', [CouponController::class, 'update'])->name('coupons.update');
        Route::delete('/coupons/{coupon}', [CouponController::class, 'destroy'])->name('coupons.destroy');

        // Marketing — SEO
        Route::get('/seo', [SEOController::class, 'index'])->name('seo.index');
        Route::put('/seo', [SEOController::class, 'update'])->name('seo.update');
    });

    // ── Inventory ─────────────────────────────────────────────────────────────
    Route::get('/inventory',                    [InventoryController::class, 'index'])->name('inventory.index');
    Route::patch('/inventory/{id}/stock',       [InventoryController::class, 'update'])->name('inventory.update');
    Route::post('/inventory/bulk-update',       [InventoryController::class, 'bulkUpdate'])->name('inventory.bulk-update');

    // ── Suppliers ─────────────────────────────────────────────────────────────
    Route::get('/suppliers',                    [SupplierController::class, 'index'])->name('suppliers.index');
    Route::get('/suppliers/{id}',               [SupplierController::class, 'show'])->name('suppliers.show');

    // ── Finance ───────────────────────────────────────────────────────────────
    Route::get('/finance',                      [FinanceController::class, 'index'])->name('finance.index');
    Route::get('/finance/transactions',         fn() => redirect()->route('admin.finance.index'))->name('finance.transactions');
    Route::get('/finance/invoices',             fn() => redirect()->route('admin.finance.index'))->name('finance.invoices');
    Route::get('/finance/expenses',             fn() => redirect()->route('admin.finance.index'))->name('finance.expenses');

    // ── Employees ─────────────────────────────────────────────────────────────
    Route::get('/employees',                    [EmployeeController::class, 'index'])->name('employees.index');

    // ── Calendar ──────────────────────────────────────────────────────────────
    Route::get('/calendar',                     [CalendarController::class, 'index'])->name('calendar.index');

    // ── Messages ──────────────────────────────────────────────────────────────
    Route::get('/messages',                     [MessageController::class, 'index'])->name('messages.index');

    // ── Product Questions ──────────────────────────────────────────────────────
    Route::get('/product-questions',            [ProductQuestionController::class, 'index'])->name('product-questions.index');
    Route::get('/product-questions/{id}',       [ProductQuestionController::class, 'show'])->name('product-questions.show');
    Route::post('/product-questions/{id}/answer', [ProductQuestionController::class, 'answer'])->name('product-questions.answer');
    Route::delete('/product-questions/{id}',    [ProductQuestionController::class, 'destroy'])->name('product-questions.destroy');

    // AI Assistant
    Route::prefix('ai')->name('ai.')->group(function () {
        Route::post('/chat', [AIAssistantController::class, 'chat'])->name('chat');
        Route::post('/execute', [AIAssistantController::class, 'execute'])->name('execute');
        Route::get('/suggestions', [AIAssistantController::class, 'suggestions'])->name('suggestions');
        Route::get('/sessions', [AIAssistantController::class, 'sessions'])->name('sessions');
        Route::post('/sessions/new', [AIAssistantController::class, 'newSession'])->name('newSession');
        Route::post('/sessions/load', [AIAssistantController::class, 'loadSession'])->name('loadSession');
        Route::put('/sessions/update', [AIAssistantController::class, 'updateSession'])->name('updateSession');
        Route::delete('/sessions', [AIAssistantController::class, 'deleteSession'])->name('deleteSession');
    });
});

// Profile (Breeze default)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// API routes
Route::prefix('api')->middleware(['auth'])->name('api.')->group(function () {
    Route::get('/categories/{id}',                         [CategoryController::class, 'apiShow']);
    Route::get('/notifications/unread-count',              [NotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');
    Route::get('/notifications/list',                       [NotificationController::class, 'getNotifications'])->name('notifications.list');
});

// Test route for notifications (no auth required for testing)
Route::get('/test-notifications', function () {
    $user = auth()->user();
    $notifications = \App\Models\Notification::with('user')->latest()->get();
    return response()->json([
        'auth_user' => $user ? ['id' => $user->id, 'name' => $user->name, 'role' => $user->role] : null,
        'total' => $notifications->count(),
        'notifications' => $notifications->map(function ($n) {
            return [
                'id' => $n->id,
                'user_id' => $n->user_id,
                'user_name' => $n->user->name ?? 'N/A',
                'user_role' => $n->user->role ?? 'N/A',
                'title' => $n->title,
                'message' => $n->message,
                'is_read' => $n->is_read,
                'created_at' => $n->created_at,
            ];
        }),
    ]);
})->name('test.notifications');

// Notifications
Route::middleware(['auth'])->group(function () {
    Route::get('/notifications',                           [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{notification}/mark-read',  [NotificationController::class, 'markAsRead'])->name('notifications.mark-read');
    Route::post('/notifications/mark-all-read',            [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::delete('/notifications/{notification}',          [NotificationController::class, 'destroy'])->name('notifications.destroy');
});

// Static pages
// Static pages - AUTH REQUIRED
Route::middleware(['auth'])->group(function () {
    Route::get('/faq', fn() => Inertia::render('Pages/Faq'))->name('faq');
    Route::get('/shipping', fn() => Inertia::render('Pages/Shipping'))->name('shipping');
    Route::get('/returns', fn() => Inertia::render('Pages/Returns'))->name('returns');
    Route::get('/contact', fn() => Inertia::render('Pages/Contact'))->name('contact');
    Route::get('/privacy-policy', fn() => Inertia::render('Pages/PrivacyPolicy'))->name('privacy');
    Route::get('/terms', fn() => Inertia::render('Pages/Terms'))->name('terms');
});

require __DIR__.'/auth.php';