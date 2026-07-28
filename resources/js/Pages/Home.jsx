import { Link, usePage, router } from '@inertiajs/react';
import { useState, useRef } from 'react';

/* ── Helpers ───────────────────────────────────────────── */
function fmt(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
    }).format(value ?? 0);
}

function ProductImage({ src, alt }) {
    const [err, setErr] = useState(false);
    if (!src || err) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <svg className="w-14 h-14 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        );
    }
    return <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setErr(true)} />;
}

/* ── Navbar ────────────────────────────────────────────── */
function Navbar({ categories, auth }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen]     = useState(false);

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="px-6 lg:px-20">
                <div className="flex items-center justify-between h-16">
                    {/* Logo + Nav links */}
                    <div className="flex items-center gap-10">
                        <Link href="/" className="text-2xl font-black tracking-widest text-gray-900">VESTO</Link>
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                All
                            </Link>
                            {categories.map(cat => (
                                <Link
                                    key={cat.slug}
                                    href={`/shop?category=${cat.slug}`}
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right icons */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <Link href="/shop" className="text-gray-500 hover:text-gray-900 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                            </svg>
                        </Link>

                        {/* Wishlist */}
                        <button className="text-gray-500 hover:text-gray-900 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>

                        {/* Auth */}
                        {auth?.user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-black"
                                >
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-xs font-black text-gray-900 truncate">{auth.user.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{auth.user.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link href="/buyer/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                My Account
                                            </Link>
                                        </div>
                                        <div className="border-t border-gray-100 py-1">
                                            <Link href="/logout" method="post" as="button"
                                                className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                                Logout
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                                    Login
                                </Link>
                                <Link href="/register" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors">
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Mobile toggle */}
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden py-3 border-t border-gray-100 space-y-1">
                        <Link href="/shop" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">All</Link>
                        {categories.map(cat => (
                            <Link key={cat.slug} href={`/shop?category=${cat.slug}`}
                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}

/* ── Product Card ──────────────────────────────────────── */
function ProductCard({ product }) {
    const displayPrice = product.special_price ?? product.price;
    const hasDiscount  = !!product.special_price;

    return (
        <Link href={`/products/${product.slug}`} className="group cursor-pointer block">
            <div className="bg-gray-50 rounded-lg overflow-hidden mb-4 relative aspect-[3/4]">
                <ProductImage src={product.image} alt={product.name} />

                {/* Badges - Minimalist */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {hasDiscount && (
                        <span className="bg-black text-white text-[10px] font-medium px-2 py-1 rounded-sm tracking-wide">SALE</span>
                    )}
                    {product.is_new && (
                        <span className="bg-gray-900 text-white text-[10px] font-medium px-2 py-1 rounded-sm tracking-wide">NEW</span>
                    )}
                </div>

                {/* Quick View - Minimalist */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-xs font-medium tracking-widest uppercase">Quick View</span>
                </div>
            </div>

            {/* Info - Clean typography */}
            <p className="text-xs text-gray-400 mb-1 tracking-wide uppercase">
                {product.categories?.[0]?.name ?? ''}
            </p>
            <p className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 leading-relaxed">{product.name}</p>
            <div className="flex items-center gap-2">
                <p className="font-normal text-gray-900 text-sm">{fmt(displayPrice)}</p>
                {hasDiscount && (
                    <p className="text-xs text-gray-400 line-through">{fmt(product.price)}</p>
                )}
            </div>
        </Link>
    );
}

/* ── Main Page ─────────────────────────────────────────── */
export default function Home({ products = [], categories = [] }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* Top Bar */}
            <div className="bg-gray-900 text-white text-center py-2.5 text-xs tracking-widest font-medium">
                FREE SHIPPING ON ORDERS ABOVE RP200.000 &nbsp;·&nbsp; NEW COLLECTION 2026
            </div>

            <Navbar categories={categories} auth={auth} />

            {/* Hero Banner */}
            <section className="relative overflow-hidden flex items-center"
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', height: '80vh' }}>
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-16">
                    <div className="max-w-xl">
                        <span className="text-[10px] font-light tracking-[0.4em] text-gray-400 uppercase block mb-8">Spring / Summer 2026</span>
                        <h1 className="text-7xl md:text-8xl font-thin text-white leading-none mb-10 tracking-wider">
                            The Art of<br />
                            <span className="font-light">Simplicity</span>
                        </h1>
                        <p className="text-gray-300 text-sm mb-12 leading-loose max-w-md font-light tracking-wide">
                            Curated essentials for the modern individual. Where minimalism meets sophistication.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/shop"
                                className="bg-white text-gray-900 font-light text-xs px-12 py-5 rounded-sm hover:bg-gray-100 transition-colors tracking-[0.2em] uppercase">
                                Explore Collection
                            </Link>
                            <a href="#categories"
                                className="border border-gray-600 text-white font-light text-xs px-12 py-5 rounded-sm hover:border-white transition-colors tracking-[0.2em] uppercase">
                                Discover More
                            </a>
                        </div>
                    </div>
                    <div className="hidden md:flex w-96 h-[500px] rounded-lg items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="text-center">
                            <div className="w-24 h-24 border border-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2a2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-[10px] tracking-[0.3em] uppercase">Hero Image</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section id="categories" className="py-16 bg-white">
                    <div className="px-6 lg:px-20">
                        <div className="flex justify-center">
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {categories.map((cat, i) => (
                                    <Link
                                        key={cat.slug}
                                        href={`/shop?category=${cat.slug}`}
                                        className="flex flex-col items-center gap-3 cursor-pointer group"
                                    >
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300 ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                            {cat.logo_path ? (
                                                <img src={`/storage/${cat.logo_path}`} alt={cat.name}
                                                    className="w-8 h-8 object-contain" />
                                            ) : (
                                                <svg className={`w-8 h-8 ${i % 2 === 0 ? 'text-gray-600' : 'text-gray-400'}`}
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a6a2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </div>
                                        <p className={`font-black text-xs text-center ${i % 2 === 0 ? 'text-gray-900' : 'text-gray-900'}`}>{cat.name}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Products Grid */}
            <section id="products" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-light tracking-[0.4em] text-gray-400 uppercase mb-4 block">New Arrivals</span>
                        <h2 className="text-5xl font-thin text-gray-900 tracking-wider">Latest Collection</h2>
                        <div className="w-12 h-px bg-gray-200 mx-auto mt-8"></div>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-sm font-light">No products available yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-16">
                        <Link href="/shop" className="inline-block text-xs font-light text-gray-900 border border-gray-300 px-14 py-4 rounded-sm hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 tracking-[0.2em] uppercase">
                            View All
                        </Link>
                    </div>
                </div>
            </section>

            {/* Lookbook Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-light tracking-[0.4em] text-gray-400 uppercase mb-4 block">Lookbook</span>
                        <h2 className="text-5xl font-thin text-gray-900 tracking-wider">Summer 2026</h2>
                        <div className="w-12 h-px bg-gray-200 mx-auto mt-8"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2 row-span-2 relative aspect-square bg-gray-100 overflow-hidden group cursor-pointer">
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-8">
                                <div>
                                    <p className="text-white text-[10px] tracking-[0.3em] uppercase mb-2 font-light">Editorial</p>
                                    <h3 className="text-white text-3xl font-thin tracking-wide">Urban Minimalist</h3>
                                </div>
                            </div>
                        </div>
                        <div className="aspect-square bg-gray-100 relative overflow-hidden group cursor-pointer">
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                <span className="text-white text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity font-light">Street Style</span>
                            </div>
                        </div>
                        <div className="aspect-square bg-gray-100 relative overflow-hidden group cursor-pointer">
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                <span className="text-white text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity font-light">Casual Chic</span>
                            </div>
                        </div>
                        <div className="aspect-square bg-gray-100 relative overflow-hidden group cursor-pointer">
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                <span className="text-white text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity font-light">Evening Wear</span>
                            </div>
                        </div>
                        <div className="aspect-square bg-gray-100 relative overflow-hidden group cursor-pointer">
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                <span className="text-white text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity font-light">Office Ready</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-12">
                        <Link href="/shop" className="inline-block text-xs font-light text-gray-900 border-b border-gray-900 pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors tracking-[0.2em] uppercase">
                            View Full Lookbook
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trending Now */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <span className="text-[10px] font-light tracking-[0.4em] text-gray-400 uppercase mb-4 block">Trending</span>
                            <h2 className="text-4xl font-thin text-gray-900 tracking-wider">Now</h2>
                        </div>
                        <Link href="/shop" className="text-xs font-light text-gray-900 border-b border-gray-900 pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors hidden md:block tracking-[0.2em] uppercase">
                            Shop All
                        </Link>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                        {[
                            { name: 'Oversized Tees', count: '124 items' },
                            { name: 'Wide Leg Pants', count: '89 items' },
                            { name: 'Minimalist Jackets', count: '67 items' },
                            { name: 'Chunky Sneakers', count: '156 items' },
                            { name: 'Linen Shirts', count: '98 items' },
                        ].map((trend, i) => (
                            <Link key={i} href="/shop" className="flex-shrink-0 w-52 bg-white p-8 rounded-lg hover:shadow-lg transition-shadow group">
                                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors">
                                    <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h3 className="font-light text-gray-900 text-sm mb-2 tracking-wide">{trend.name}</h3>
                                <p className="text-[10px] text-gray-500 font-light tracking-wide">{trend.count}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Style Guide */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-light tracking-[0.4em] text-gray-400 uppercase mb-4 block">Style Guide</span>
                        <h2 className="text-5xl font-thin text-gray-900 tracking-wider">How to Wear</h2>
                        <div className="w-12 h-px bg-gray-200 mx-auto mt-8"></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { title: 'Casual Friday', desc: 'Relaxed yet polished. Pair our linen shirts with tailored shorts for effortless weekend vibes.', items: '3 looks' },
                            { title: 'Office Chic', desc: 'Elevate your work wardrobe with structured blazers and clean-cut trousers. Professional meets modern.', items: '5 looks' },
                            { title: 'Weekend Warrior', desc: 'From brunch to beach. Versatile pieces that transition seamlessly from day to night.', items: '4 looks' },
                        ].map((guide, i) => (
                            <Link key={i} href="/shop" className="group">
                                <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-6 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                        <span className="text-white text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity font-light">View Looks</span>
                                    </div>
                                </div>
                                <h3 className="font-light text-gray-900 text-xl mb-3 tracking-wide">{guide.title}</h3>
                                <p className="text-gray-600 text-sm leading-loose mb-4 font-light tracking-wide">{guide.desc}</p>
                                <p className="text-[10px] text-gray-400 font-light tracking-wide">{guide.items}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Category Highlights */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-light tracking-[0.4em] text-gray-400 uppercase mb-4 block">Collections</span>
                        <h2 className="text-5xl font-thin text-gray-900 tracking-wider">Shop by Category</h2>
                        <div className="w-12 h-px bg-gray-200 mx-auto mt-8"></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {categories.slice(0, 4).map((cat, i) => (
                            <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className="group relative aspect-[16/9] bg-gray-200 overflow-hidden rounded-lg">
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                    <div className="text-center">
                                        <h3 className="text-white text-3xl font-thin mb-3 tracking-wide">{cat.name}</h3>
                                        <span className="text-white text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity font-light">Shop Now</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bold Collections Banner */}
            <section className="py-32 bg-gray-900">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                        <div className="text-center">
                            <div className="w-24 h-24 border border-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2a2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-[10px] tracking-[0.3em] uppercase">Collection Image</p>
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] font-light tracking-[0.4em] text-gray-400 uppercase mb-6 block">Featured Collection</span>
                        <h2 className="text-6xl font-thin text-white mb-8 leading-tight tracking-wider">New Season<br />Essentials</h2>
                        <p className="text-gray-400 text-sm leading-loose mb-10 max-w-md font-light tracking-wide">
                            Discover our curated selection of timeless pieces designed for the modern wardrobe. Quality craftsmanship meets contemporary design.
                        </p>
                        <Link href="/shop" className="inline-block bg-white text-gray-900 text-xs font-light px-10 py-4 rounded-sm hover:bg-gray-100 transition-colors tracking-[0.2em] uppercase">
                            Explore Collection
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-14 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { title: 'Free Shipping', desc: 'On orders above Rp200k' },
                        { title: 'Easy Return', desc: '30 days return policy' },
                        { title: 'Secure Payment', desc: '100% secure transactions' },
                        { title: '24/7 Support', desc: 'Always here for you' },
                    ].map(item => (
                        <div key={item.title} className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="font-black text-gray-900 text-sm">{item.title}</p>
                            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-950 text-gray-400 py-20">
                <div className="px-6 lg:px-20 grid md:grid-cols-4 gap-16 mb-16">
                    <div>
                        <span className="text-2xl font-black text-white tracking-widest block mb-6">VESTO</span>
                        <p className="text-sm leading-relaxed mb-8">Premium fashion for the bold and the beautiful.</p>
                        <div className="flex gap-3">
                            {['IG', 'TK', 'TW', 'FB'].map(s => (
                                <a key={s} href="#" className="w-9 h-9 border border-gray-700 rounded-full flex items-center justify-center text-xs font-bold hover:border-white hover:text-white transition-all">{s}</a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-white font-bold mb-6 text-sm tracking-widest uppercase">Shop</p>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
                            {categories.slice(0, 4).map(cat => (
                                <li key={cat.slug}>
                                    <Link href={`/shop?category=${cat.slug}`} className="hover:text-white transition-colors">{cat.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-white font-bold mb-6 text-sm tracking-widest uppercase">Policies</p>
                        <ul className="space-y-4 text-sm">
                            {[
                                { name: 'Privacy Policy', href: '/privacy-policy' },
                                { name: 'Terms of Use', href: '/terms' },
                                { name: 'Shipping Policy', href: '/shipping' },
                                { name: 'Return Policy', href: '/returns' },
                            ].map(i => (
                                <li key={i.name}><a href={i.href} className="hover:text-white transition-colors">{i.name}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-white font-bold mb-6 text-sm tracking-widest uppercase">Newsletter</p>
                        <p className="text-sm mb-6 leading-relaxed">Subscribe to stay in touch.</p>
                        <div className="flex gap-2">
                            <input type="email" placeholder="your@email.com"
                                className="flex-1 bg-gray-800 text-white text-sm px-4 py-3 rounded-full border border-gray-700 focus:outline-none focus:border-gray-500" />
                            <button className="bg-white text-gray-900 text-sm font-bold px-5 py-3 rounded-full hover:bg-gray-100 transition-colors">→</button>
                        </div>
                    </div>
                </div>
                <div className="px-6 lg:px-20 pt-8 border-t border-gray-800 text-center text-xs">
                    © 2026 Vesto. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
