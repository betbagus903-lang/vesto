import { Link, usePage, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Search, Menu, User, Heart, ShoppingCart, Sun, Moon } from 'lucide-react';
import MiniCart from './MiniCart';
import { useTheme } from '../../Context/ThemeContext';

export default function Navbar({ categories = [], darkMode = false }) {
    const { theme, toggleTheme } = useTheme();
    const { auth } = usePage().props;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [cartOpen, setCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const timer = useRef(null);

    // Custom sort order for categories
    const categoryOrder = ['all', 'mens', 'womens', 'accessories', 'footwear', 'selfcare'];
    const sortedCategories = [...categories].sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.slug.toLowerCase());
        const indexB = categoryOrder.indexOf(b.slug.toLowerCase());
        // If both are in the order, sort by order
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // If only A is in order, A comes first
        if (indexA !== -1) return -1;
        // If only B is in order, B comes first
        if (indexB !== -1) return 1;
        // If neither is in order, sort alphabetically
        return a.name.localeCompare(b.name);
    });

    useEffect(() => {
        // Load cart count from localStorage
        const savedCart = localStorage.getItem('vesto_cart');
        if (savedCart) {
            const cart = JSON.parse(savedCart);
            setCartCount(cart.length);
        }

        // Load wishlist count from localStorage
        const savedWishlistCount = localStorage.getItem('wishlist_count');
        if (savedWishlistCount) {
            setWishlistCount(parseInt(savedWishlistCount));
        }

        // Listen for cart updates
        const handleCartUpdate = (e) => {
            setCartCount(e.detail.count);
        };

        // Listen for mini cart open event
        const handleOpenMiniCart = () => {
            setCartOpen(true);
        };

        // Listen for wishlist updates
        const handleWishlistUpdate = (e) => {
            setWishlistCount(e.detail.count);
        };

        window.addEventListener('cart-updated', handleCartUpdate);
        window.addEventListener('open-mini-cart', handleOpenMiniCart);
        window.addEventListener('wishlist-updated', handleWishlistUpdate);
        return () => {
            window.removeEventListener('cart-updated', handleCartUpdate);
            window.removeEventListener('open-mini-cart', handleOpenMiniCart);
            window.removeEventListener('wishlist-updated', handleWishlistUpdate);
        };
    }, []);

    const handleSearch = (val) => {
        setSearch(val);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            router.get('/shop', { search: val }, { preserveState: true });
        }, 500);
    };

    return (
        <nav className={`border-b sticky top-0 z-50 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className="px-6 lg:px-20">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-10">
                        <Link href="/" className={`text-2xl font-black tracking-widest ${darkMode ? 'text-white' : 'text-gray-900'}`}>VESTO</Link>
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/shop" className={`text-sm font-medium hover:text-gray-900 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600'}`}>All</Link>
                            {sortedCategories.map(cat => (
                                <Link key={cat.slug} href={`/shop?category=${cat.slug}`}
                                    className={`text-sm font-medium hover:text-gray-900 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600'}`}>{cat.name}</Link>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Search - Desktop */}
                        <div className="hidden md:block relative">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <input
                                type="text"
                                placeholder="Search products…"
                                value={search}
                                onChange={e => handleSearch(e.target.value)}
                                className={`w-[280px] pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200'}`}
                            />
                        </div>

                        {/* Search - Mobile */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                            >
                                <Search className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                            </button>
                            {searchOpen && (
                                <div className={`absolute top-full left-0 right-0 border-b border-gray-200 p-4 shadow-lg ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
                                    <div className="relative">
                                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                        <input
                                            type="text"
                                            placeholder="Search products…"
                                            value={search}
                                            onChange={e => handleSearch(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200'}`}
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                            >
                                <Menu className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                            </button>
                        </div>

                        {/* Login - Mobile */}
                        {auth?.user ? (
                            <div className="md:hidden">
                                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-black">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="md:hidden px-3 py-2 text-xs font-semibold rounded-lg bg-gray-900 text-white">
                                Login
                            </Link>
                        )}

                        {/* Wishlist */}
                        <Link href="/buyer/wishlist" className={`p-2 rounded-lg transition-colors hidden sm:block relative ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                            <Heart className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <button 
                            onClick={() => setCartOpen(true)}
                            className={`p-2 rounded-lg transition-colors relative ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                        >
                            <ShoppingCart className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-colors hidden sm:block ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
                        </button>

                        {/* User */}
                        {auth?.user ? (
                            <div className="relative">
                                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-black">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </button>
                                {dropdownOpen && (
                                    <div className={`absolute right-0 mt-2 w-48 border rounded-2xl shadow-lg py-2 z-50 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                                        <Link href="/buyer/dashboard" className={`block px-4 py-2.5 text-sm hover:bg-gray-50 ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700'}`}>My Account</Link>
                                        <Link href="/logout" method="post" as="button"
                                            className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 ${darkMode ? 'text-red-400 hover:bg-gray-800' : 'text-red-600'}`}>Logout</Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className={`hidden sm:block px-4 py-2 text-sm font-semibold rounded-lg ${darkMode ? 'bg-white text-gray-900 hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className={`md:hidden border-t ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <div className="px-4 py-6 space-y-4">
                        {/* Categories */}
                        <div className="space-y-3">
                            <Link 
                                href="/shop" 
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                All Products
                            </Link>
                            {sortedCategories.map(cat => (
                                <Link 
                                    key={cat.slug} 
                                    href={`/shop?category=${cat.slug}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}></div>

                        {/* Account Links */}
                        {auth?.user ? (
                            <div className="space-y-3">
                                <Link 
                                    href="/buyer/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    My Account
                                </Link>
                                <Link 
                                    href="/buyer/wishlist"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    Wishlist
                                </Link>
                                <Link 
                                    href="/logout" 
                                    method="post" 
                                    as="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block w-full text-left py-2 text-sm font-medium ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
                                >
                                    Logout
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Link 
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    Login
                                </Link>
                                <Link 
                                    href="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Mini Cart */}
            <MiniCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </nav>
    );
}
