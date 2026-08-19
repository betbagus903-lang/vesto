import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useBuyerTheme } from '../../Context/BuyerThemeContext';
import AccountSidebar from '../../Components/Buyer/AccountSidebar';
import { Search, Heart, ShoppingBag, Trash2, ChevronDown, Star, ShoppingCart, Bell, Tag, Moon, Sun, Menu, X } from 'lucide-react';

export default function Wishlist() {
    const { wishlistProducts: dbWishlistProducts } = usePage().props;
    const { theme, toggleTheme } = useBuyerTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const themeStyles = {
        dark: {
            bg: 'bg-[#0a0f1a]',
            headerBg: 'bg-[#0a1628]',
            border: 'border-white/10',
            text: 'text-white',
            textMuted: 'text-white/50',
            textMutedLight: 'text-white/40',
            cardBg: 'bg-white/5',
            cardBgLight: 'bg-white/10',
            hoverBg: 'hover:bg-white/10',
            inputBg: 'bg-white/5',
        },
        light: {
            bg: 'bg-gray-50',
            headerBg: 'bg-white',
            border: 'border-gray-200',
            text: 'text-gray-900',
            textMuted: 'text-gray-600',
            textMutedLight: 'text-gray-400',
            cardBg: 'bg-white',
            cardBgLight: 'bg-gray-100',
            hoverBg: 'hover:bg-gray-100',
            inputBg: 'bg-gray-100',
        },
    };

    const styles = themeStyles[theme];

    // Mock data for testing if no data from backend
    const mockWishlistProducts = [
        {
            id: 1,
            product_id: 1,
            name: 'Oversized Denim Jacket',
            price: 699000,
            original_price: null,
            discount: null,
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
            rating: 4,
            reviews: 45,
        },
        {
            id: 2,
            product_id: 2,
            name: 'Minimal Sneakers',
            price: 679000,
            original_price: 799000,
            discount: 15,
            image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
            rating: 5,
            reviews: 78,
        },
        {
            id: 3,
            product_id: 3,
            name: 'Leather Crossbody Bag',
            price: 459000,
            original_price: null,
            discount: null,
            image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop',
            rating: 4,
            reviews: 32,
        },
        {
            id: 4,
            product_id: 4,
            name: 'Oversized Shirt',
            price: 299000,
            original_price: 399000,
            discount: 25,
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
            rating: 4,
            reviews: 56,
        },
    ];

    const wishlistProducts = dbWishlistProducts && dbWishlistProducts.length > 0 ? dbWishlistProducts : mockWishlistProducts;

    return (
        <div className={`min-h-screen flex ${styles.bg}`} style={{fontFamily: "'Inter', sans-serif"}}>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className={`fixed inset-0 z-50 lg:hidden ${theme === 'dark' ? 'bg-black/50' : 'bg-black/30'}`}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <AccountSidebar activeMenu="wishlist" />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <AccountSidebar activeMenu="wishlist" />
            </div>

            {/* Main content */}
            <div className="flex-1 min-h-screen transition-all duration-300 lg:ml-72 ml-0">
                {/* Top Header */}
                <div className={`${styles.headerBg} border-b ${styles.border} px-4 md:px-6 py-4 sticky top-0 z-40`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className={`lg:hidden p-2 ${styles.hoverBg} rounded-lg transition-colors`}
                            >
                                {sidebarOpen ? <X className={`w-5 h-5 ${styles.text}`} /> : <Menu className={`w-5 h-5 ${styles.text}`} />}
                            </button>
                            <div>
                                <h1 className={`text-lg md:text-xl font-bold ${styles.text}`}>
                                    Wishlist
                                </h1>
                                <p className={`text-xs md:text-sm ${styles.textMuted} mt-0.5 hidden sm:block`}>
                                    Your favorite products
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            <button
                                onClick={toggleTheme}
                                className={`p-2 ${styles.hoverBg} rounded-lg transition-colors`}
                                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {theme === 'dark' ? <Sun className={`w-5 h-5 ${styles.textMuted}`} /> : <Moon className={`w-5 h-5 ${styles.textMuted}`} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className={`text-2xl font-medium ${styles.text} tracking-wide`}>Wishlist</h1>
                            <p className={`text-sm ${styles.textMutedLight} mt-1`}>Produk favorit yang ingin kamu beli nanti.</p>
                        </div>
                        <div className="relative">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${styles.textMutedLight}`} size={16} />
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                className={`w-64 ${styles.inputBg} ${styles.border} rounded-xl pl-10 pr-4 py-2.5 text-sm ${styles.text} placeholder-gray-400 focus:outline-none focus:border-violet-500/50 transition-colors`}
                            />
                        </div>
                    </div>

                    {wishlistProducts.length === 0 ? (
                        <>
                            {/* Empty Wishlist Hero */}
                            <div className={`bg-gradient-to-br from-violet-900/20 via-blue-900/10 to-transparent ${styles.border} rounded-2xl p-8 mb-6`}>
                                <div className="flex items-center gap-8">
                                    {/* Left: Illustration */}
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="relative">
                                            <div className="w-48 h-48 bg-gradient-to-br from-violet-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                                                <ShoppingBag size={64} className="text-violet-400" />
                                            </div>
                                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-pink-500/30 to-red-500/30 rounded-full flex items-center justify-center">
                                                <Heart size={24} className="text-pink-400 fill-pink-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Content */}
                                    <div className="flex-1">
                                        <h2 className={`text-2xl font-medium ${styles.text} mb-2`}>Wishlist kamu kosong</h2>
                                        <p className={`${styles.textMuted} mb-6`}>Simpan produk yang kamu suka dan temukan nanti di sini.</p>
                                        <Link
                                            href="/shop"
                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-medium px-6 py-3 rounded-xl transition-all duration-300"
                                        >
                                            Mulai Belanja →
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Wishlist Toolbar */}
                            <div className="flex items-center justify-between mb-6">
                                <p className={`${styles.textMuted} text-sm`}>0 Produk di Wishlist</p>
                                <div className="flex items-center gap-3">
                                    <button className={`px-4 py-2 text-sm ${styles.textMuted} ${styles.border} rounded-lg ${styles.hoverBg} hover:${styles.textMutedLight} transition-colors disabled:opacity-50`} disabled>
                                        Pilih Semua
                                    </button>
                                    <button className={`px-4 py-2 text-sm ${styles.textMuted} ${styles.border} rounded-lg ${styles.hoverBg} hover:${styles.textMutedLight} transition-colors disabled:opacity-50`} disabled>
                                        Hapus (0)
                                    </button>
                                    <button className={`flex items-center gap-2 px-4 py-2 text-sm ${styles.textMuted} ${styles.border} rounded-lg ${styles.hoverBg} hover:${styles.textMutedLight} transition-colors disabled:opacity-50`} disabled>
                                        Urutkan: Terbaru <ChevronDown size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Empty Product Area */}
                            <div className={`${styles.cardBg} ${styles.border} rounded-2xl p-12 mb-8`}>
                                <div className="text-center">
                                    <div className={`w-20 h-20 ${styles.cardBgLight} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                        <Heart size={32} className={theme === 'dark' ? 'text-white/30' : 'text-gray-400'} />
                                    </div>
                                    <h3 className={`text-lg font-medium ${styles.text} mb-2`}>Wishlist kamu masih kosong</h3>
                                    <p className={`${styles.textMuted} text-sm mb-6`}>Tambahkan produk favoritmu ke wishlist agar tidak ketinggalan.</p>
                                    <Link
                                        href="/shop"
                                        className={`inline-flex items-center gap-2 ${styles.cardBgLight} hover:${styles.hoverBg} ${styles.text} text-sm font-medium px-6 py-3 rounded-xl transition-all duration-300`}
                                    >
                                        Mulai Belanja →
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Wishlist Toolbar */}
                            <div className="flex items-center justify-between mb-6">
                                <p className={`${styles.textMuted} text-sm`}>{wishlistProducts.length} Produk di Wishlist</p>
                                <div className="flex items-center gap-3">
                                    <button className={`px-4 py-2 text-sm ${styles.textMutedLight} ${styles.border} rounded-lg ${styles.hoverBg} hover:${styles.text} transition-colors`}>
                                        Pilih Semua
                                    </button>
                                    <button className={`px-4 py-2 text-sm ${styles.textMutedLight} ${styles.border} rounded-lg ${styles.hoverBg} hover:${styles.text} transition-colors`}>
                                        Hapus (0)
                                    </button>
                                    <button className={`flex items-center gap-2 px-4 py-2 text-sm ${styles.textMutedLight} ${styles.border} rounded-lg ${styles.hoverBg} hover:${styles.text} transition-colors`}>
                                        Urutkan: Terbaru <ChevronDown size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Product Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {wishlistProducts.map((product) => (
                                    <div key={product.id} className={`${styles.cardBg} ${styles.border} rounded-2xl overflow-hidden ${styles.hoverBg} transition-all duration-300 group`}>
                                        {/* Product Image */}
                                        <div className={`relative aspect-[3/4] ${styles.cardBgLight} overflow-hidden`}>
                                            <img
                                                src={product.image || 'https://via.placeholder.com/300x400'}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {/* Wishlist Heart Button */}
                                            <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                                                <Heart size={16} className="text-red-500 fill-red-500" />
                                            </button>
                                            {/* Discount Badge */}
                                            {product.discount && (
                                                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                                                    -{product.discount}%
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <h3 className={`${styles.text} font-medium text-sm mb-2 line-clamp-2`}>{product.name}</h3>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1 mb-2">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            className={i < (product.rating || 4) ? 'text-yellow-400 fill-yellow-400' : (theme === 'dark' ? 'text-white/20' : 'text-gray-300')}
                                                        />
                                                    ))}
                                                </div>
                                                <span className={`${styles.textMutedLight} text-xs`}>({product.reviews || 0})</span>
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <p className={`${styles.text} font-medium`}>
                                                    Rp {(product.price || 0).toLocaleString('id-ID')}
                                                </p>
                                                {product.original_price && (
                                                    <p className={`${styles.textMutedLight} text-sm line-through`}>
                                                        Rp {product.original_price.toLocaleString('id-ID')}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Add to Cart Button */}
                                            <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-300">
                                                <ShoppingCart size={16} />
                                                Tambah ke Keranjang
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Bottom Benefits Strip */}
                    <div className={`${styles.cardBg} ${styles.border} rounded-2xl p-6`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Heart size={18} className="text-violet-400" />
                                </div>
                                <div>
                                    <p className={`${styles.text} font-medium text-sm mb-1`}>Simpan Favorit</p>
                                    <p className={`${styles.textMuted} text-xs`}>Simpan produk yang kamu suka.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Bell size={18} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className={`${styles.text} font-medium text-sm mb-1`}>Dapatkan Notifikasi</p>
                                    <p className={`${styles.textMuted} text-xs`}>Dapatkan informasi saat harga turun.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Tag size={18} className="text-pink-400" />
                                </div>
                                <div>
                                    <p className={`${styles.text} font-medium text-sm mb-1`}>Jangan Kehabisan</p>
                                    <p className={`${styles.textMuted} text-xs`}>Notifikasi saat stok hampir habis.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <ShoppingBag size={18} className="text-green-400" />
                                </div>
                                <div>
                                    <p className={`${styles.text} font-medium text-sm mb-1`}>Belanja Lebih Mudah</p>
                                    <p className={`${styles.textMuted} text-xs`}>Temukan kembali produk favoritmu.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}