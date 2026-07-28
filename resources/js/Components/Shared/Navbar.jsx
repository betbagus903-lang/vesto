import { Link, usePage, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Search, Menu, User, Heart, ShoppingCart } from 'lucide-react';
import MiniCart from './MiniCart';

export default function Navbar({ categories = [] }) {
    const { auth } = usePage().props;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [cartOpen, setCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const timer = useRef(null);

    useEffect(() => {
        // Load cart count from localStorage
        const savedCart = localStorage.getItem('vesto_cart');
        if (savedCart) {
            const cart = JSON.parse(savedCart);
            setCartCount(cart.length);
        }

        // Listen for cart updates
        const handleCartUpdate = (e) => {
            setCartCount(e.detail.count);
        };

        // Listen for mini cart open event
        const handleOpenMiniCart = () => {
            setCartOpen(true);
        };

        window.addEventListener('cart-updated', handleCartUpdate);
        window.addEventListener('open-mini-cart', handleOpenMiniCart);
        return () => {
            window.removeEventListener('cart-updated', handleCartUpdate);
            window.removeEventListener('open-mini-cart', handleOpenMiniCart);
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
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="px-6 lg:px-20">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-10">
                        <Link href="/" className="text-2xl font-black tracking-widest text-gray-900">VESTO</Link>
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-gray-900">All</Link>
                            {categories.map(cat => (
                                <Link key={cat.slug} href={`/shop?category=${cat.slug}`}
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900">{cat.name}</Link>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Search - Desktop */}
                        <div className="hidden md:block relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products…"
                                value={search}
                                onChange={e => handleSearch(e.target.value)}
                                className="w-[280px] pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors"
                            />
                        </div>

                        {/* Search - Mobile */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <Search className="w-5 h-5 text-gray-600" />
                            </button>
                            {searchOpen && (
                                <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4 shadow-lg">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search products…"
                                            value={search}
                                            onChange={e => handleSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Wishlist */}
                        <Link href="/buyer/wishlist" className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block">
                            <Heart className="w-5 h-5 text-gray-700" />
                        </Link>

                        {/* Cart */}
                        <button 
                            onClick={() => setCartOpen(true)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                        >
                            <ShoppingCart className="w-5 h-5 text-gray-700" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* User */}
                        {auth?.user ? (
                            <div className="relative">
                                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-black">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-50">
                                        <Link href="/buyer/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">My Account</Link>
                                        <Link href="/logout" method="post" as="button"
                                            className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">Logout</Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="hidden sm:block px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mini Cart */}
            <MiniCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </nav>
    );
}
