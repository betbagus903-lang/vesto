import { Link, usePage, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, Grid3X3, List } from 'lucide-react';
import SidebarFilter from '../Components/Shop/SidebarFilter';
import ProductCard from '../Components/Shop/ProductCard';
import Navbar from '../Components/Shared/Navbar';
import BannerRenderer from '../Components/BannerRenderer';
import { useTheme } from '../Context/ThemeContext';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

const CATEGORY_BANNERS = {
    '': {
        title: 'Shop All',
        subtitle: 'Discover Our Collection',
        description: 'Browse through our curated selection of premium fashion essentials.',
        gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        image: '/images/shop-all-banner.jpg',
    },
    mens: {
        title: "Men's Wear",
        subtitle: 'Built for Confidence',
        description: 'Timeless pieces designed for the modern man. Quality that speaks for itself.',
        gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        image: '/images/mens.png',
    },
    womens: {
        title: "Women's Wear",
        subtitle: 'Elegance Redefined',
        description: 'Sophisticated styles that blend comfort with contemporary fashion.',
        gradient: 'linear-gradient(135deg, #2d1b3d 0%, #1a1a2e 100%)',
        image: '/images/womens.png',
    },
    accessories: {
        title: 'Accessories',
        subtitle: 'Complete Your Look',
        description: 'The finishing touches that elevate any outfit from ordinary to exceptional.',
        gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        image: '/images/akso.png',
    },
    footwear: {
        title: 'Footwear',
        subtitle: 'Step in Style',
        description: 'From sneakers to boots, find the perfect pair for every occasion.',
        gradient: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
        image: '/images/footwear-banner.jpg',
    },
    't-shirt': {
        title: 'T-Shirts',
        subtitle: 'Everyday Essentials',
        description: 'Premium cotton tees designed for comfort and lasting quality.',
        gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)',
        image: '/images/tshirt-banner.jpg',
    },
    dress: {
        title: 'Dresses',
        subtitle: 'Grace in Every Stitch',
        description: 'Flowing silhouettes and refined details for every moment.',
        gradient: 'linear-gradient(135deg, #3d1b2d 0%, #1a1a2e 100%)',
        image: '/images/dress-banner.jpg',
    },
    hoodie: {
        title: 'Hoodies',
        subtitle: 'Streetwear Essential',
        description: 'Cozy layers with bold attitude. Made for the streets.',
        gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0f172a 100%)',
        image: '/images/hoodie-banner.jpg',
    },
    jacket: {
        title: 'Jackets',
        subtitle: 'Layer Up',
        description: 'Outerwear that defines your style statement.',
        gradient: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
        image: '/images/jacket-banner.jpg',
    },
    bags: {
        title: 'Bags',
        subtitle: 'Carry in Style',
        description: 'Functional elegance for the modern lifestyle.',
        gradient: 'linear-gradient(135deg, #1a1a1a 0%, #111827 100%)',
        image: '/images/bags-banner.jpg',
    },
    sneakers: {
        title: 'Sneakers',
        subtitle: 'Walk the Talk',
        description: 'Performance meets street style in every step.',
        gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        image: '/images/sneakers-banner.jpg',
    },
    boots: {
        title: 'Boots',
        subtitle: 'Built Tough',
        description: 'Rugged durability meets refined design.',
        gradient: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
        image: '/images/boots-banner.jpg',
    },
    top: {
        title: 'Tops',
        subtitle: 'Essential Layers',
        description: 'From casual to polished, find your perfect top.',
        gradient: 'linear-gradient(135deg, #1a1a2e 0%, #1e1b4b 100%)',
        image: '/images/top-banner.jpg',
    },
    pants: {
        title: 'Pants',
        subtitle: 'Tailored Fit',
        description: 'Precision-cut trousers and jeans for every silhouette.',
        gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        image: '/images/pants-banner.jpg',
    },
    scarves: {
        title: 'Scarves',
        subtitle: 'Wrap in Luxury',
        description: 'Soft, elegant scarves to complete your ensemble.',
        gradient: 'linear-gradient(135deg, #2d1b3d 0%, #1a1a2e 100%)',
        image: '/images/scarves-banner.jpg',
    },
};

export default function Shop({
    products = [],
    pagination = {},
    categories = [],
    activeCategory = '',
    search: initSearch = '',
    sort: initSort = 'latest',
    per_page: initPerPage = 10,
    price_min: initPriceMin = 0,
    price_max: initPriceMax = 100000,
    price_range = { min: 0, max: 100000 },
    filterable_attributes = [],
    color_filters = [],
    colors: initColors = [],
    categoryBanners = [],
    heroBanners = []
}) {
    const { auth } = usePage().props;
    const { theme } = useTheme();
    const [search, setSearch] = useState(initSearch);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [perPage, setPerPage] = useState(initPerPage);
    const [sort, setSort] = useState(initSort);
    const [priceMax, setPriceMax] = useState(initPriceMax);
    const [selectedColors, setSelectedColors] = useState(initColors);
    const timer = useRef(null);

    // Theme colors
    const currentTheme = theme === 'dark' ? {
        background: '#0A0D14',
        card: '#111827',
        border: 'rgba(255,255,255,0.08)',
        white: '#FFFFFF',
        secondaryText: '#A8B3CF',
        muted: '#667085',
    } : {
        background: '#FFFFFF',
        card: '#F8F9FA',
        border: 'rgba(0,0,0,0.1)',
        white: '#1A1A1A',
        secondaryText: '#495057',
        muted: '#6C757D',
    };

    // Sync state dengan props dari Inertia (pagination, sort, search, refresh)
    useEffect(() => { setSelectedColors(initColors); }, [initColors.join(',')]);
    useEffect(() => { setPriceMax(initPriceMax); }, [initPriceMax]);
    useEffect(() => { setSort(initSort); }, [initSort]);
    useEffect(() => { setPerPage(initPerPage); }, [initPerPage]);
    useEffect(() => { setSearch(initSearch); }, [initSearch]);

    const buildParams = (overrides = {}) => ({
        search,
        category: activeCategory,
        sort,
        per_page: perPage,
        price_max: priceMax,
        colors: selectedColors.length > 0 ? selectedColors.join(',') : undefined,
        ...overrides,
    });

    const go = (params) => {
        // Hapus key dengan nilai kosong/undefined agar URL bersih
        const clean = Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
        );
        router.get('/shop', clean, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (val) => {
        setSearch(val);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            go(buildParams({ search: val, page: undefined }));
        }, 400);
    };

    const handleFilterChange = (filters) => {
        if (filters.colors !== undefined) setSelectedColors(filters.colors);
        if (filters.price_max !== undefined) setPriceMax(filters.price_max);

        const colorsToSend = filters.colors !== undefined ? filters.colors : selectedColors;
        go(buildParams({
            ...filters,
            colors: colorsToSend.length > 0 ? colorsToSend.join(',') : undefined,
            page: undefined,
        }));
    };

    const handleClearAll = () => {
        setSelectedColors([]);
        setPriceMax(price_range.max);
        go({
            sort: 'latest',
            per_page: 12,
            price_max: price_range.max,
        });
    };

    const handleSort = (val) => {
        setSort(val);
        go(buildParams({ sort: val, page: undefined }));
    };

    const handlePerPage = (val) => {
        setPerPage(val);
        go(buildParams({ per_page: val, page: undefined }));
    };

    const handlePageChange = (page) => {
        go(buildParams({ page }));
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: currentTheme.background, fontFamily: "'Inter', sans-serif" }}>
            {/* Top Bar */}
            <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} text-center py-2.5 text-xs tracking-widest font-medium`}>
                FREE SHIPPING ON ORDERS ABOVE RP200.000 &nbsp;·&nbsp; NEW COLLECTION 2026
            </div>

            {/* Navbar */}
            <Navbar categories={categories} darkMode={theme === 'dark'} />

            {/* Category Hero Banner */}
            {(() => {
                // Use CMS banner if available, otherwise fallback to static
                const cmsBanner = categoryBanners.length > 0 ? categoryBanners[0] : null;
                const fallbackBanner = CATEGORY_BANNERS[activeCategory] || CATEGORY_BANNERS[''];
                
                // If CMS banner has layout_json, use BannerRenderer
                if (cmsBanner && cmsBanner.layout_json) {
                    return (
                        <section className="relative overflow-hidden">
                            <BannerRenderer layoutJson={cmsBanner.layout_json} />
                        </section>
                    );
                }
                
                // Otherwise use traditional CMS banner or fallback
                if (cmsBanner) {
                    return (
                        <section className="relative overflow-hidden">
                            {/* Background image full-width */}
                            {cmsBanner.image && (
                                <img
                                    src={cmsBanner.image}
                                    alt={cmsBanner.title}
                                    className="absolute inset-0 w-full h-full object-cover object-top"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            )}
                            <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:8 py-14 sm:py-18 md:py-24 min-h-[220px] sm:min-h-[280px] md:min-h-[340px] flex items-center">
                                <div className="text-center md:text-left">
                                    {cmsBanner.subtitle && (
                                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-gray-300 mb-2 sm:mb-3">
                                            {cmsBanner.subtitle}
                                        </p>
                                    )}
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg">
                                        {cmsBanner.title}
                                    </h1>
                                    {cmsBanner.button_text && (
                                        <Link
                                            href={cmsBanner.button_link || '/shop'}
                                            className="inline-flex items-center gap-2 mt-5 sm:mt-6 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-gray-100"
                                        >
                                            {cmsBanner.button_text}
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M4 12h16M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </section>
                    );
                }

                // Fallback to static banner
                const banner = fallbackBanner;
                return (
                    <section
                        className="relative overflow-hidden"
                        style={{ background: banner.gradient }}
                    >
                        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="relative flex flex-col md:flex-row items-center gap-6 py-12 sm:py-16 md:py-20 min-h-[200px] sm:min-h-[240px] md:min-h-[280px]">
                                <div className="flex-1 text-center md:text-left z-10">
                                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 mb-2 sm:mb-3">
                                        {banner.subtitle}
                                    </p>
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                                        {banner.title}
                                    </h1>
                                    <p className="mt-3 sm:mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-gray-400 mx-auto md:mx-0">
                                        {banner.description}
                                    </p>
                                    <Link
                                        href="/shop"
                                        className="inline-flex items-center gap-2 mt-5 sm:mt-6 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-gray-100"
                                    >
                                        Shop Now
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 12h16M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </Link>
                                </div>
                                <div className="flex-shrink-0 w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px]">
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className="w-full h-auto object-contain rounded-xl opacity-80"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                                <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-5 bg-white blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full opacity-5 bg-white blur-3xl" />
                            </div>
                        </div>
                    </section>
                );
            })()}

            {/* Main Content */}
            <div className="max-w-[1600px] mx-auto px-6 pt-10 pb-8">
                <div className="flex gap-8">
                    {/* Sidebar - Desktop */}
                    <div className="hidden lg:block w-[320px] flex-shrink-0">
                        <SidebarFilter
                            categories={categories}
                            activeCategory={activeCategory}
                            priceRange={price_range}
                            currentPriceMax={priceMax}
                            filterableAttributes={filterable_attributes}
                            color_filters={color_filters}
                            activeColors={selectedColors}
                            onFilterChange={handleFilterChange}
                            onClearAll={handleClearAll}
                            theme={theme}
                        />
                    </div>

                    {/* Products Area */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4" style={{ borderBottom: `1px solid ${currentTheme.border}` }}>
                            {/* Mobile Filter Button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors"
                                style={{ 
                                    backgroundColor: currentTheme.card, 
                                    borderColor: currentTheme.border,
                                    color: currentTheme.white
                                }}
                            >
                                <Menu className="w-4 h-4" />
                                Filters
                                {selectedColors.length > 0 && (
                                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#4F6BFF', color: '#FFFFFF' }}>
                                        {selectedColors.length}
                                    </span>
                                )}
                            </button>

                            {/* Sort */}
                            <select
                                value={sort}
                                onChange={e => handleSort(e.target.value)}
                                className="px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-gray-400"
                                style={{ 
                                    backgroundColor: currentTheme.card, 
                                    borderColor: currentTheme.border,
                                    color: currentTheme.white
                                }}
                            >
                                <option value="latest">Latest</option>
                                <option value="price_asc">Price Low to High</option>
                                <option value="price_desc">Price High to Low</option>
                                <option value="name_asc">Name A-Z</option>
                                <option value="name_desc">Name Z-A</option>
                            </select>

                            <div className="flex items-center gap-4">
                                {/* Per Page */}
                                <select
                                    value={perPage}
                                    onChange={e => handlePerPage(Number(e.target.value))}
                                    className="hidden md:block px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-gray-400"
                                    style={{ 
                                        backgroundColor: currentTheme.card, 
                                        borderColor: currentTheme.border,
                                        color: currentTheme.white
                                    }}
                                >
                                    <option value={10}>10</option>
                                    <option value={24}>24</option>
                                    <option value={36}>36</option>
                                </select>

                                {/* View Toggle */}
                                <div className="hidden md:flex items-center gap-1 rounded-lg overflow-hidden" style={{ border: `1px solid ${currentTheme.border}` }}>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2.5 ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                        style={{ backgroundColor: viewMode === 'grid' ? '#111827' : currentTheme.card, color: viewMode === 'grid' ? '#FFFFFF' : currentTheme.secondaryText }}
                                    >
                                        <Grid3X3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2.5 ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                        style={{ backgroundColor: viewMode === 'list' ? '#111827' : currentTheme.card, color: viewMode === 'list' ? '#FFFFFF' : currentTheme.secondaryText }}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} selectedColor={selectedColors.length > 0 ? selectedColors[0] : null} selectedColors={selectedColors} theme={theme} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                <button
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    disabled={pagination.current_page <= 1}
                                    className="w-10 h-10 rounded-full text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors flex items-center justify-center"
                                    style={{ 
                                        border: `1px solid ${currentTheme.border}`,
                                        backgroundColor: currentTheme.card,
                                        color: currentTheme.white
                                    }}
                                >
                                    ←
                                </button>
                                {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                                    let pageNum;
                                    if (pagination.last_page <= 5) {
                                        pageNum = i + 1;
                                    } else if (pagination.current_page <= 3) {
                                        pageNum = i + 1;
                                    } else if (pagination.current_page >= pagination.last_page - 2) {
                                        pageNum = pagination.last_page - 4 + i;
                                    } else {
                                        pageNum = pagination.current_page - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className="w-10 h-10 rounded-full text-sm font-medium transition-colors flex items-center justify-center"
                                            style={{
                                                backgroundColor: pagination.current_page === pageNum ? '#111827' : currentTheme.card,
                                                color: pagination.current_page === pageNum ? '#FFFFFF' : currentTheme.white,
                                                border: pagination.current_page === pageNum ? 'none' : `1px solid ${currentTheme.border}`
                                            }}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    disabled={pagination.current_page >= pagination.last_page}
                                    className="w-10 h-10 rounded-full text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors flex items-center justify-center"
                                    style={{ 
                                        border: `1px solid ${currentTheme.border}`,
                                        backgroundColor: currentTheme.card,
                                        color: currentTheme.white
                                    }}
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div 
                        className="absolute right-0 top-0 h-full w-[320px] overflow-y-auto transition-transform duration-300"
                        style={{ backgroundColor: currentTheme.card }}
                    >
                        <div className={`p-4 flex items-center justify-between ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} style={{ borderBottom: `1px solid ${currentTheme.border}` }}>
                            <h3 className="font-bold" style={{ color: currentTheme.white }}>Filters</h3>
                            <button onClick={() => setSidebarOpen(false)} className="p-2" style={{ color: currentTheme.secondaryText }}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <SidebarFilter
                            categories={categories}
                            activeCategory={activeCategory}
                            priceRange={price_range}
                            currentPriceMax={priceMax}
                            filterableAttributes={filterable_attributes}
                            color_filters={color_filters}
                            activeColors={selectedColors}
                            onFilterChange={(filters) => {
                                handleFilterChange(filters);
                                setSidebarOpen(false);
                            }}
                            onClearAll={() => {
                                handleClearAll();
                                setSidebarOpen(false);
                            }}
                            theme={theme}
                        />
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-gray-950 text-gray-400 py-8 mt-16">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-xl font-black text-white tracking-widest">VESTO</span>
                    <p className="text-xs">© 2026 Vesto. All rights reserved.</p>
                    <div className="flex gap-4 text-xs">
                        <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy</a>
                        <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                        <a href="/contact" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
