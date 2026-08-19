import { Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
    Heart, Star, Truck, RotateCcw, ShieldCheck, Headphones, ArrowRight, ChevronRight, Package, Shirt,
    Footprints, Watch, SprayCan, Zap, Sparkles, Grid3X3, List, ShoppingBag, Sun, Moon,
} from 'lucide-react';
import Navbar from '../Components/Shared/Navbar';
import { useTheme } from '../Context/ThemeContext';

/* ── Scroll Animation Hook ───────────────────────────────────── */
function useScrollAnimation(threshold = 0.1) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    return [ref, isVisible];
}

/* ── Theme Constants ───────────────────────────────────── */
const THEME = {
    background: '#FFFFFF',
    black: '#000000',
    card: '#F8F9FA',
    secondaryCard: '#E9ECEF',
    border: 'rgba(0,0,0,0.1)',
    primaryBlue: '#4F6BFF',
    purple: '#6C63FF',
    white: '#FFFFFF',
    secondaryText: '#495057',
    muted: '#6C757D',
    danger: '#EF4444',
};

/* ── Animation Keyframes (injected via style) ───────────────────────────────────── */
const animationStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    @keyframes pulse-glow {
        0%, 100% {
            box-shadow: 0 0 20px rgba(79, 107, 255, 0.3);
        }
        50% {
            box-shadow: 0 0 40px rgba(79, 107, 255, 0.6);
        }
    }

    @keyframes shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }
`;

/* ── Helpers ───────────────────────────────────────────── */
function fmt(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
    }).format(value ?? 0);
}

function useCountdown(initial) {
    const [time, setTime] = useState(initial);
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(prev => {
                let { days, hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else if (minutes > 0) { minutes--; seconds = 59; }
                else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
                else if (days > 0) { days--; hours = 23; minutes = 59; seconds = 59; }
                return { days, hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    return time;
}

const FALLBACK_CATEGORIES = [
    { name: 'T-Shirts', slug: 't-shirts', icon: Shirt },
    { name: 'Hoodies', slug: 'hoodies', icon: Shirt },
    { name: 'Shirts', slug: 'shirts', icon: Shirt },
    { name: 'Pants', slug: 'pants', icon: Package },
    { name: 'Shoes', slug: 'shoes', icon: Footprints },
    { name: 'Accessories', slug: 'accessories', icon: Watch },
    { name: 'Bags', slug: 'bags', icon: ShoppingBag },
    { name: 'Perfume', slug: 'perfume', icon: SprayCan },
];

const NAV_LINKS_FALLBACK = [
    { id: 'men', name: 'Men', slug: 'men' },
    { id: 'women', name: 'Women', slug: 'women' },
    { id: 'shoes', name: 'Shoes', slug: 'shoes' },
    { id: 'accessories', name: 'Accessories', slug: 'accessories' },
    { id: 'collections', name: 'Collections', slug: 'collections' },
    { id: 'sale', name: 'Sale', slug: 'sale' },
];

/* ── Product Card ───────────────────────────────────────── */
function ProductCard({ product, badgeType = 'discount', theme = 'light', delay = 0 }) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const displayPrice = product.special_price ?? product.price;
    const hasDiscount = !!product.special_price;
    const discountPct = hasDiscount ? Math.round((1 - product.special_price / product.price) * 100) : 0;
    const isNew = badgeType === 'new';

    const currentTheme = theme === 'dark' ? {
        card: '#111827',
        border: 'rgba(255,255,255,0.08)',
        white: '#FFFFFF',
        secondaryText: '#A8B3CF',
        muted: '#667085',
    } : {
        card: '#F8F9FA',
        border: '#E9ECEF',
        white: '#1A1A1A',
        secondaryText: '#6C757D',
        muted: '#6C757D',
    };

    return (
        <div 
            className="group"
            style={{
                animation: `fadeInUp 0.6s ease-out ${delay}ms both`,
                opacity: 0
            }}
        >
            <div className="relative rounded-2xl overflow-hidden mb-3 aspect-square transition-all duration-500 hover:shadow-xl hover:-translate-y-2" style={{ backgroundColor: currentTheme.card, border: `1px solid ${currentTheme.border}` }}>
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package size={36} style={{ color: currentTheme.muted }} />
                        </div>
                    )}
                </Link>

                {(isNew || hasDiscount) && (
                    <span
                        className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide pointer-events-none animate-pulse"
                        style={{ backgroundColor: isNew ? THEME.primaryBlue : THEME.danger, color: '#FFFFFF' }}
                    >
                        {isNew ? 'NEW' : `-${discountPct}%`}
                    </span>
                )}

                <button
                    onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 hover:rotate-12"
                    style={{ backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.9)' }}
                    aria-label="Toggle wishlist"
                >
                    <Heart size={14} className={`transition-all duration-300 ${isWishlisted ? 'fill-red-500 text-red-500 scale-125' : (theme === 'dark' ? 'text-white' : 'text-gray-800')}`} />
                </button>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Quick View
                    </button>
                </div>
            </div>

            <Link href={`/products/${product.slug}`} className="block">
                <h3 className="text-sm font-semibold truncate transition-colors duration-300 hover:text-blue-500" style={{ color: currentTheme.white }}>{product.name}</h3>
            </Link>
            <p className="text-xs mb-1.5" style={{ color: currentTheme.secondaryText }}>
                {product.categories?.[0]?.name ?? 'Collection'}
            </p>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-bold truncate transition-colors duration-300" style={{ color: currentTheme.white }}>{fmt(displayPrice)}</span>
                    {hasDiscount && (
                        <span className="text-xs line-through shrink-0" style={{ color: currentTheme.muted }}>{fmt(product.price)}</span>
                    )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <Star size={12} className="fill-yellow-400 text-yellow-400 transition-transform duration-300 hover:scale-125" />
                    <span className="text-xs" style={{ color: currentTheme.muted }}>{product.rating ?? '4.7'}</span>
                </div>
            </div>
        </div>
    );
}


/* ── Hero Banner Slider ───────────────────────────────────── */
function HeroBannerSlider({ banners = [], theme = 'light' }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const bannerRef = useRef(null);

    const currentTheme = theme === 'dark' ? {
        background: '#0A0D14',
        card: '#111827',
        secondaryCard: '#161F2F',
        border: 'rgba(255,255,255,0.08)',
        primaryBlue: '#4F6BFF',
        purple: '#6C63FF',
        white: '#FFFFFF',
        secondaryText: '#A8B3CF',
        muted: '#667085',
        danger: '#EF4444',
    } : {
        background: '#FFFFFF',
        card: '#F8F9FA',
        secondaryCard: '#E9ECEF',
        border: 'rgba(0,0,0,0.1)',
        primaryBlue: '#4F6BFF',
        purple: '#6C63FF',
        white: '#FFFFFF',
        secondaryText: '#495057',
        muted: '#6C757D',
        danger: '#EF4444',
    };
    
    if (!banners || banners.length === 0) {
        // Fallback to static hero if no banners
        return (
            <section className="relative overflow-hidden w-full" style={{ background: `linear-gradient(160deg, ${currentTheme.background} 0%, ${currentTheme.card} 60%, ${currentTheme.secondaryCard} 100%)` }}>
                <div className="px-4 md:px-6 lg:px-16 py-10 md:py-16 lg:py-20">
                    <div>
                        <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(79,107,255,0.1)', color: currentTheme.primaryBlue, border: '1px solid rgba(79,107,255,0.3)' }}>
                            <Sparkles size={13} /> New Collection
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-5" style={{ color: currentTheme.white }}>
                            Elevate Your<br />Style, Define You
                        </h1>
                        <p className="text-sm md:text-base lg:text-lg mb-8 max-w-2xl leading-relaxed" style={{ color: currentTheme.secondaryText }}>
                            Discover the latest trends in fashion and express your unique style with VESTO.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <button 
                                onClick={() => router.visit('/shop')}
                                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold cursor-pointer" 
                                style={{ background: `linear-gradient(135deg, ${currentTheme.primaryBlue}, ${currentTheme.purple})`, color: '#FFFFFF' }}
                            >
                                Shop Now <ArrowRight size={16} />
                            </button>
                            <Link href="/collections" className="px-7 py-3.5 rounded-xl text-sm font-bold" style={{ border: `1px solid ${currentTheme.border}`, color: currentTheme.white }}>
                                Explore Collection
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const currentBanner = banners[activeIndex];
    const hasAnimations = currentBanner?.animations && currentBanner.animations.length > 0;

    // Auto-advance carousel
    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    // Apply animations when banner changes
    useEffect(() => {
        if (!hasAnimations || !bannerRef.current) return;
        
        const container = bannerRef.current;
        const animations = currentBanner.animations;
        
        // Reset all animated elements
        const animatedElements = container.querySelectorAll('[data-anim-id]');
        animatedElements.forEach(el => {
            el.style.transition = 'none';
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        
        // Apply animations
        animations.forEach(anim => {
            const element = container.querySelector(`[data-anim-id="${anim.objectId}"]`);
            if (!element) return;
            
            const easing = anim.easing || 'ease-in-out';
            const duration = anim.duration || 1000;
            const delay = anim.delay || 0;
            
            element.style.transition = `all ${duration}ms ${easing} ${delay}ms`;
            
            // Apply initial state based on preset
            switch (anim.preset) {
                case 'fade':
                    element.style.opacity = '0';
                    setTimeout(() => element.style.opacity = '1', delay);
                    break;
                case 'slideLeft':
                    element.style.transform = 'translateX(-100%)';
                    setTimeout(() => element.style.transform = 'translateX(0)', delay);
                    break;
                case 'slideRight':
                    element.style.transform = 'translateX(100%)';
                    setTimeout(() => element.style.transform = 'translateX(0)', delay);
                    break;
                case 'slideUp':
                    element.style.transform = 'translateY(100%)';
                    setTimeout(() => element.style.transform = 'translateY(0)', delay);
                    break;
                case 'slideDown':
                    element.style.transform = 'translateY(-100%)';
                    setTimeout(() => element.style.transform = 'translateY(0)', delay);
                    break;
                case 'bounce':
                    element.style.transform = 'scale(0)';
                    setTimeout(() => element.style.transform = 'scale(1.1)', delay);
                    setTimeout(() => element.style.transform = 'scale(1)', delay + duration * 0.5);
                    break;
                case 'rotate':
                    element.style.transform = 'rotate(-180deg) scale(0)';
                    setTimeout(() => element.style.transform = 'rotate(0) scale(1)', delay);
                    break;
                case 'scale':
                    element.style.transform = 'scale(0)';
                    setTimeout(() => element.style.transform = 'scale(1)', delay);
                    break;
                case 'positionSwap':
                    element.style.transform = 'translateX(0)';
                    setTimeout(() => element.style.transform = 'translateX(200px)', delay);
                    setTimeout(() => element.style.transform = 'translateX(0)', delay + duration * 0.5);
                    break;
                case 'parallax':
                    element.style.transform = 'translateY(0)';
                    setTimeout(() => element.style.transform = 'translateY(-50px)', delay);
                    setTimeout(() => element.style.transform = 'translateY(0)', delay + duration * 0.5);
                    break;
            }
        });
        
        setIsAnimating(true);
        const maxDuration = Math.max(...animations.map(a => a.duration + a.delay), 2000);
        setTimeout(() => setIsAnimating(false), maxDuration);
        
    }, [activeIndex, hasAnimations, currentBanner]);

    return (
        <section className="relative overflow-hidden w-full">
            <div ref={bannerRef} className="relative w-full overflow-hidden" style={{ aspectRatio: '2.4/1', backgroundColor: currentTheme.card }}>
                {currentBanner?.image ? (
                    <img 
                        src={currentBanner.image.startsWith('http') ? currentBanner.image : `/storage/${currentBanner.image}`} 
                        alt={currentBanner.title || 'Banner'} 
                        className="w-full h-full object-cover"
                        data-anim-id="banner-image"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: currentTheme.card }}>
                        <Package size={64} style={{ color: currentTheme.muted }} />
                    </div>
                )}
                
                {/* Banner Content Overlay */}
                {currentBanner && (
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:px-16" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }}>
                        {currentBanner.subtitle && (
                            <p 
                                data-anim-id="banner-subtitle"
                                className="text-xs md:text-sm font-medium mb-2 tracking-wide uppercase opacity-80" 
                                style={{ color: currentBanner.text_color || '#FFFFFF' }}
                            >
                                {currentBanner.subtitle}
                            </p>
                        )}
                        {currentBanner.title && (
                            <h2 
                                data-anim-id="banner-title"
                                className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4" 
                                style={{ color: currentBanner.text_color || '#FFFFFF' }}
                            >
                                {currentBanner.title}
                            </h2>
                        )}
                        {currentBanner.button_text && (
                            <Link 
                                data-anim-id="banner-button"
                                href={currentBanner.button_link || '#'} 
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold w-fit"
                                style={{ 
                                    backgroundColor: currentBanner.cta_style === 'filled_blue' ? currentTheme.primaryBlue : 
                                                   currentBanner.cta_style === 'filled_dark' ? 'rgba(0,0,0,0.6)' :
                                                   currentBanner.cta_style === 'outline' ? 'transparent' :
                                                   'transparent',
                                    border: currentBanner.cta_style === 'outline' ? '2px solid white' : 'none',
                                    color: currentBanner.text_color || '#FFFFFF'
                                }}
                            >
                                {currentBanner.button_text} <ArrowRight size={16} />
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Carousel Dots */}
            {banners.length > 1 && (
                <div className="flex items-center gap-2 mt-4 justify-center px-4">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            aria-label={`Banner ${i + 1}`}
                            className="h-1.5 rounded-full transition-all"
                            style={{ width: activeIndex === i ? '24px' : '8px', backgroundColor: activeIndex === i ? THEME.primaryBlue : THEME.border }}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

/* ── Category Strip ────────────────────────────────────── */
function CategoryStrip({ categories, theme = 'light' }) {
    const [ref, isVisible] = useScrollAnimation(0.1);
    const list = categories?.length
        ? categories.slice(0, 8).map(c => ({ name: c.name, slug: c.slug, icon: Package }))
        : FALLBACK_CATEGORIES;

    const currentTheme = theme === 'dark' ? {
        background: '#0A0D14',
        card: '#111827',
        border: 'rgba(255,255,255,0.08)',
        primaryBlue: '#4F6BFF',
        purple: '#6C63FF',
        secondaryText: '#A8B3CF',
    } : {
        background: '#FFFFFF',
        card: '#F8F9FA',
        border: 'rgba(0,0,0,0.1)',
        primaryBlue: '#4F6BFF',
        purple: '#6C63FF',
        secondaryText: '#6C757D',
    };

    return (
        <section 
            ref={ref}
            className="py-10 transition-all duration-700"
            style={{ 
                backgroundColor: currentTheme.background, 
                borderBottom: `1px solid ${currentTheme.border}`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
        >
            <div className="max-w-[1600px] mx-auto px-4 md:px-6">
                <div className="grid grid-cols-4 md:flex md:items-center md:justify-between gap-y-6 gap-x-3">
                    {list.map((cat, i) => (
                        <Link 
                            key={cat.slug ?? i} 
                            href={`/shop?category=${cat.slug}`} 
                            className="flex flex-col items-center gap-2 group"
                            style={{
                                animation: isVisible ? `fadeInUp 0.5s ease-out ${i * 100}ms both` : 'none',
                                opacity: 0
                            }}
                        >
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg" style={{ backgroundColor: currentTheme.card, border: `1px solid ${currentTheme.border}` }}>
                                <cat.icon size={22} style={{ color: currentTheme.secondaryText }} />
                            </div>
                            <span className="text-[11px] font-medium text-center transition-colors duration-300 group-hover:text-blue-500" style={{ color: currentTheme.secondaryText }}>{cat.name}</span>
                        </Link>
                    ))}
                    <Link 
                        href="/shop" 
                        className="hidden md:flex w-16 h-16 rounded-full items-center justify-center shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-lg" 
                        style={{ background: `linear-gradient(135deg, ${currentTheme.primaryBlue}, ${currentTheme.purple})` }} 
                        aria-label="View all categories"
                    >
                        <ArrowRight size={20} className="text-white" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

/* ── Feature Strip ──────────────────────────────────────── */
function FeatureStrip({ theme = 'light' }) {
    const currentTheme = theme === 'dark' ? {
        background: '#0A0D14',
        card: '#111827',
        border: 'rgba(255,255,255,0.08)',
        primaryBlue: '#4F6BFF',
        white: '#FFFFFF',
        secondaryText: '#A8B3CF',
        muted: '#667085',
    } : {
        background: '#FFFFFF',
        card: '#F8F9FA',
        border: 'rgba(0,0,0,0.1)',
        primaryBlue: '#4F6BFF',
        white: '#1A1A1A',
        secondaryText: '#495057',
        muted: '#6C757D',
    };

    const features = [
        { icon: Truck, title: 'Free Shipping', desc: 'On orders over $99' },
        { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
        { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure checkout' },
        { icon: Headphones, title: '24/7 Support', desc: "We're here to help" },
    ];
    return (
        <section className="py-8" style={{ backgroundColor: currentTheme.background }}>
            <div className="max-w-[1600px] mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: currentTheme.card, border: `1px solid ${currentTheme.border}` }}>
                            <f.icon size={20} style={{ color: currentTheme.primaryBlue }} />
                            <div>
                                <p className="text-sm font-semibold" style={{ color: currentTheme.white }}>{f.title}</p>
                                <p className="text-xs" style={{ color: currentTheme.muted }}>{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── Flash Sale ─────────────────────────────────────────── */
function FlashSale({ products = [], theme = 'light' }) {
    const [ref, isVisible] = useScrollAnimation(0.1);
    const currentTheme = theme === 'dark' ? {
        background: '#0A0D14',
        card: '#111827',
        border: 'rgba(255,255,255,0.08)',
        white: '#FFFFFF',
        muted: '#667085',
        primaryBlue: '#4F6BFF',
    } : {
        background: '#FFFFFF',
        card: '#F8F9FA',
        border: 'rgba(0,0,0,0.1)',
        white: '#1A1A1A',
        muted: '#6C757D',
        primaryBlue: '#4F6BFF',
    };

    const countdown = useCountdown({ days: 2, hours: 15, minutes: 34, seconds: 10 });
    const flashItems = products.some(p => p.special_price) ? products.filter(p => p.special_price) : products;

    if (!flashItems.length) return null;

    return (
        <section 
            ref={ref}
            className="py-14 transition-all duration-700"
            style={{ 
                backgroundColor: currentTheme.background,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
        >
            <div className="max-w-[1600px] mx-auto px-4 md:px-6">
                <div className="flex flex-wrap items-center justify-between gap-5 mb-8">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-9 h-9 rounded-lg flex items-center justify-center animate-pulse" 
                            style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
                        >
                            <Zap size={18} className="text-white" fill="white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold" style={{ color: currentTheme.white }}>Flash Sale</h2>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <span className="text-xs font-medium mr-1" style={{ color: currentTheme.muted }}>Ends in</span>
                        {Object.entries(countdown).map(([unit, value]) => (
                            <div key={unit} className="text-center">
                                <div 
                                    className="w-9 h-9 md:w-11 md:h-11 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110" 
                                    style={{ backgroundColor: currentTheme.card, border: `1px solid ${currentTheme.border}` }}
                                >
                                    <span className="text-xs md:text-sm font-bold" style={{ color: currentTheme.white }}>{String(value).padStart(2, '0')}</span>
                                </div>
                                <span className="text-[8px] uppercase tracking-wide" style={{ color: currentTheme.muted }}>{unit}</span>
                            </div>
                        ))}
                    </div>

                    <Link href="/shop?sale=true" className="flex items-center gap-1 text-sm font-semibold transition-all duration-300 hover:gap-2" style={{ color: currentTheme.primaryBlue }}>
                        View all <ChevronRight size={16} />
                    </Link>
                </div>

                <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
                    {flashItems.slice(0, 6).map((product, index) => (
                        <div key={product.id} className="flex-shrink-0 w-[42%] sm:w-40 md:w-52">
                            <ProductCard product={product} badgeType="discount" theme={theme} delay={index * 100} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── Promo Banners ──────────────────────────────────────── */
function PromoBanners({ banners = [], theme = 'light' }) {
    const currentTheme = theme === 'dark' ? {
        background: '#0A0D14',
        card: '#111827',
        border: 'rgba(255,255,255,0.08)',
        white: '#FFFFFF',
        secondaryText: '#A8B3CF',
        primaryBlue: '#4F6BFF',
        purple: '#6C63FF',
    } : {
        background: '#FFFFFF',
        card: '#F8F9FA',
        border: 'rgba(0,0,0,0.1)',
        white: '#1A1A1A',
        secondaryText: '#495057',
        primaryBlue: '#4F6BFF',
        purple: '#6C63FF',
    };

    // If no CMS banners, show fallback static banners
    if (!banners || banners.length === 0) {
        const gradient1 = theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(79,107,255,0.3), rgba(9,12,20,0.98))'
            : 'linear-gradient(135deg, rgba(79,107,255,0.15), rgba(9,12,20,0.9))';
        const gradient2 = theme === 'dark'
            ? 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(9,12,20,0.98))'
            : 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(9,12,20,0.9))';

        return (
            <section className="py-6" style={{ backgroundColor: currentTheme.background }}>
                <div className="max-w-[1600px] mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-5">
                    <div className="relative rounded-2xl overflow-hidden p-8 min-h-[220px] flex flex-col justify-end" style={{ background: gradient1, border: `1px solid ${currentTheme.border}` }}>
                        <span className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: currentTheme.secondaryText }}>Summer '24</span>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: currentTheme.white }}>New Season<br />New Vibes</h3>
                        <Link href="/shop?collection=summer" className="inline-flex items-center gap-2 text-sm font-bold w-fit px-5 py-2.5 rounded-xl" style={{ backgroundColor: currentTheme.white, color: currentTheme.background }}>
                            Shop Now <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden p-8 min-h-[220px] flex flex-col justify-end" style={{ background: gradient2, border: `1px solid ${currentTheme.border}` }}>
                        <span className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: currentTheme.secondaryText }}>Up to 50% Off</span>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: currentTheme.white }}>Limited Time<br />Offer</h3>
                        <Link href="/shop?sale=true" className="inline-flex items-center gap-2 text-sm font-bold w-fit px-5 py-2.5 rounded-xl" style={{ background: `linear-gradient(135deg, ${currentTheme.primaryBlue}, ${currentTheme.purple})`, color: currentTheme.white }}>
                            Shop Sale <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-6" style={{ backgroundColor: currentTheme.background }}>
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-5">
                {banners.slice(0, 2).map((banner, index) => (
                    <div key={banner.id || index} className="relative rounded-2xl overflow-hidden min-h-[220px]" style={{ border: `1px solid ${currentTheme.border}` }}>
                        {banner.image ? (
                            <img 
                                src={banner.image.startsWith('http') ? banner.image : `/storage/${banner.image}`} 
                                alt={banner.title || 'Promo Banner'} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: currentTheme.card }}>
                                <Package size={48} style={{ color: currentTheme.secondaryText }} />
                            </div>
                        )}
                        
                        {/* Banner Content Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }}>
                            {banner.subtitle && (
                                <span className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: banner.text_color || currentTheme.secondaryText }}>
                                    {banner.subtitle}
                                </span>
                            )}
                            {banner.title && (
                                <h3 className="text-xl md:text-3xl font-bold mb-4" style={{ color: banner.text_color || currentTheme.white }}>
                                    {banner.title}
                                </h3>
                            )}
                            {banner.button_text && (
                                <Link 
                                    href={banner.button_link || '#'} 
                                    className="inline-flex items-center gap-2 text-sm font-bold w-fit px-5 py-2.5 rounded-xl"
                                    style={{ 
                                        backgroundColor: banner.cta_style === 'filled_blue' ? currentTheme.primaryBlue : 
                                                       banner.cta_style === 'filled_dark' ? 'rgba(0,0,0,0.6)' :
                                                       banner.cta_style === 'outline' ? 'transparent' :
                                                       currentTheme.white,
                                        border: banner.cta_style === 'outline' ? '2px solid white' : 'none',
                                        color: banner.cta_style === 'filled_blue' || banner.cta_style === 'filled_dark' ? '#FFFFFF' : currentTheme.background
                                    }}
                                >
                                    {banner.button_text} <ArrowRight size={14} />
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ── New Arrivals ───────────────────────────────────────── */
function NewArrivals({ products = [], theme = 'light' }) {
    const [ref, isVisible] = useScrollAnimation(0.1);
    const currentTheme = theme === 'dark' ? {
        background: '#0A0D14',
        white: '#FFFFFF',
        primaryBlue: '#4F6BFF',
    } : {
        background: '#FFFFFF',
        white: '#1A1A1A',
        primaryBlue: '#4F6BFF',
    };

    if (!products.length) return null;
    return (
        <section 
            ref={ref}
            className="py-14 transition-all duration-700"
            style={{ 
                backgroundColor: currentTheme.background,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
        >
            <div className="max-w-[1600px] mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2" style={{ color: currentTheme.white }}>
                        <Sparkles size={18} style={{ color: currentTheme.primaryBlue }} /> New Arrivals
                    </h2>
                    <Link href="/shop?new=true" className="flex items-center gap-1 text-sm font-semibold transition-all duration-300 hover:gap-2" style={{ color: currentTheme.primaryBlue }}>
                        View all <ChevronRight size={16} />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                    {products.slice(0, 5).map((product, index) => (
                        <ProductCard key={product.id} product={product} badgeType="new" theme={theme} delay={index * 100} />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── Fashion Collection Section ───────────────────────────── */
function FashionCollection({ theme = 'light' }) {
    const [ref, isVisible] = useScrollAnimation(0.1);
    const currentTheme = theme === 'dark' ? {
        background: '#0A0D14',
        card: '#111827',
        white: '#FFFFFF',
        secondaryText: '#A8B3CF',
    } : {
        background: '#F8F9FA',
        card: '#F8F9FA',
        white: '#1A1A1A',
        secondaryText: '#495057',
    };

    const collections = [
        {
            id: 1,
            name: "MEN'S COLLECTION",
            subtitle: "Explore Collection →",
            slug: 'men',
            image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80'
        },
        {
            id: 2,
            name: "WOMEN'S COLLECTION",
            subtitle: "Explore Collection →",
            slug: 'women',
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80'
        },
        {
            id: 3,
            name: "SNEAKERS",
            subtitle: "Explore Collection →",
            slug: 'shoes',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
        },
        {
            id: 4,
            name: "ACCESSORIES",
            subtitle: "Explore Collection →",
            slug: 'accessories',
            image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80'
        },
        {
            id: 5,
            name: "CASUAL WEAR",
            subtitle: "Explore Collection →",
            slug: 'casual',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
        },
        {
            id: 6,
            name: "BEAUTY",
            subtitle: "Explore Collection →",
            slug: 'beauty',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80'
        }
    ];

    return (
        <section 
            ref={ref}
            className="py-20 md:py-24 transition-all duration-700"
            style={{ 
                backgroundColor: currentTheme.background,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
        >
            <div className="max-w-[1600px] mx-auto px-4 md:px-6">
                {/* Headline */}
                <div className="text-center mb-16">
                    <h2 
                        className="text-4xl md:text-6xl font-bold mb-4 transition-all duration-700"
                        style={{ 
                            color: currentTheme.white,
                            fontFamily: "'Playfair Display', Georgia, serif",
                            letterSpacing: '-0.02em',
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                        }}
                    >
                        Style For Every Moment
                    </h2>
                    <p 
                        className="text-base md:text-lg transition-all duration-700 delay-200"
                        style={{ 
                            color: currentTheme.secondaryText,
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                        }}
                    >
                        Temukan pilihan fashion yang sesuai dengan gaya kamu.
                    </p>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((collection, index) => (
                        <Link
                            key={collection.id}
                            href={`/shop?category=${collection.slug}`}
                            className="group relative rounded-2xl overflow-hidden cursor-pointer"
                            style={{ 
                                aspectRatio: '3/4',
                                animation: isVisible ? `fadeInUp 0.6s ease-out ${index * 100}ms both` : 'none',
                                opacity: 0
                            }}
                        >
                            {/* Image */}
                            <img
                                src={collection.image}
                                alt={collection.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h3 className="text-xl md:text-2xl font-bold mb-2 transition-transform duration-300 group-hover:translate-x-2" style={{ 
                                    color: THEME.white,
                                    fontFamily: "'Playfair Display', Georgia, serif"
                                }}>
                                    {collection.name}
                                </h3>
                                <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: THEME.secondaryText }}>
                                    {collection.subtitle}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── Featured Collection Section ─────────────────────────── */
function FeaturedCollection({ theme = 'light' }) {
    const [ref, isVisible] = useScrollAnimation(0.1);
    const currentTheme = theme === 'dark' ? {
        background: '#0A0D14',
        card: '#111827',
        white: '#FFFFFF',
        secondaryText: '#A8B3CF',
        muted: '#667085',
        border: 'rgba(255,255,255,0.08)',
    } : {
        background: '#F8F9FA',
        card: '#F8F9FA',
        white: '#1A1A1A',
        secondaryText: '#495057',
        muted: '#6C757D',
        border: 'rgba(0,0,0,0.1)',
    };

    return (
        <section 
            ref={ref}
            className="py-20 md:py-24 transition-all duration-700"
            style={{ 
                backgroundColor: currentTheme.background,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
        >
            <div className="max-w-[1600px] mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Large Image */}
                    <div 
                        className="relative transition-all duration-700"
                        style={{
                            animation: isVisible ? 'fadeInLeft 0.8s ease-out both' : 'none',
                            opacity: 0
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80"
                            alt="Featured Collection"
                            className="w-full rounded-2xl object-cover transition-transform duration-700 hover:scale-105"
                            style={{ aspectRatio: '4/3' }}
                        />
                    </div>

                    {/* Right: Editorial Content */}
                    <div 
                        className="flex flex-col justify-center transition-all duration-700 delay-200"
                        style={{
                            animation: isVisible ? 'fadeInRight 0.8s ease-out both' : 'none',
                            opacity: 0
                        }}
                    >
                        {/* Eyebrow */}
                        <span className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: THEME.primaryBlue }}>
                            NEW COLLECTION
                        </span>

                        {/* Headline */}
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ 
                            color: currentTheme.white,
                            fontFamily: "'Playfair Display', Georgia, serif",
                            letterSpacing: '-0.02em'
                        }}>
                            Discover Your<br />New Signature Style
                        </h2>

                        {/* Description */}
                        <p className="text-base leading-relaxed mb-4" style={{ color: currentTheme.secondaryText }}>
                            Explore our latest collection, thoughtfully designed for those who believe personal style is more than just what you wear. From effortless everyday essentials to statement pieces, discover modern silhouettes, refined details, and versatile designs created to elevate your wardrobe.
                        </p>

                        {/* Supporting Paragraph */}
                        <p className="text-base leading-relaxed mb-8" style={{ color: currentTheme.secondaryText }}>
                            Find pieces that move with you, express your personality, and make every look feel uniquely yours.
                        </p>

                        {/* Collection Highlights */}
                        <div className="mb-8 space-y-4">
                            <div className="flex items-start gap-3 transition-all duration-300 hover:translate-x-2">
                                <div className="w-1 h-1 rounded-full mt-2" style={{ backgroundColor: THEME.primaryBlue }}></div>
                                <div>
                                    <p className="text-sm font-semibold mb-1" style={{ color: currentTheme.white }}>NEW ARRIVALS</p>
                                    <p className="text-xs" style={{ color: currentTheme.muted }}>Latest pieces for the season</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 transition-all duration-300 hover:translate-x-2">
                                <div className="w-1 h-1 rounded-full mt-2" style={{ backgroundColor: THEME.primaryBlue }}></div>
                                <div>
                                    <p className="text-sm font-semibold mb-1" style={{ color: currentTheme.white }}>MODERN ESSENTIALS</p>
                                    <p className="text-xs" style={{ color: currentTheme.muted }}>Timeless pieces for everyday wear</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 transition-all duration-300 hover:translate-x-2">
                                <div className="w-1 h-1 rounded-full mt-2" style={{ backgroundColor: THEME.primaryBlue }}></div>
                                <div>
                                    <p className="text-sm font-semibold mb-1" style={{ color: currentTheme.white }}>STATEMENT PIECES</p>
                                    <p className="text-xs" style={{ color: currentTheme.muted }}>Bold styles made to stand out</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Link
                            href="/collections"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg mb-4"
                            style={{ 
                                backgroundColor: theme === 'dark' ? currentTheme.card : '#1A1A1A',
                                color: theme === 'dark' ? currentTheme.white : '#FFFFFF',
                                border: `1px solid ${currentTheme.border}`
                            }}
                        >
                            View Collection <ArrowRight size={16} />
                        </Link>

                        {/* Secondary Text */}
                        <p className="text-xs" style={{ color: currentTheme.muted }}>
                            Explore the latest styles →
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ── Footer ─────────────────────────────────────────────── */
function Footer({ theme }) {
    const currentTheme = theme === 'dark' ? {
        background: '#111827',
        white: '#FFFFFF',
        secondaryText: '#A8B3CF',
        muted: '#667085',
        border: 'rgba(255,255,255,0.08)',
    } : {
        background: '#F8F9FA',
        white: '#1A1A1A',
        secondaryText: '#495057',
        muted: '#6C757D',
        border: 'rgba(0,0,0,0.1)',
    };

    return (
        <footer className="py-14" style={{ backgroundColor: currentTheme.background, borderTop: `1px solid ${currentTheme.border}` }}>
            <div className="max-w-[1600px] mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-4 gap-10 mb-10">
                    <div>
                        <span className="text-2xl font-bold tracking-tight" style={{ color: currentTheme.white }}>VESTO</span>
                        <p className="text-sm mt-4 leading-relaxed" style={{ color: currentTheme.secondaryText }}>
                            Premium fashion for the modern individual.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold mb-4 tracking-wider uppercase" style={{ color: currentTheme.white }}>Shop</h4>
                        <ul className="space-y-3">
                            <li><Link href="/shop" className="text-sm hover:text-blue-400" style={{ color: currentTheme.secondaryText }}>All Products</Link></li>
                            <li><Link href="/collections" className="text-sm hover:text-blue-400" style={{ color: currentTheme.secondaryText }}>Collections</Link></li>
                            <li><Link href="/shop?sale=true" className="text-sm hover:text-blue-400" style={{ color: currentTheme.secondaryText }}>Sale</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold mb-4 tracking-wider uppercase" style={{ color: currentTheme.white }}>Support</h4>
                        <ul className="space-y-3">
                            <li><Link href="/contact" className="text-sm hover:text-blue-400" style={{ color: currentTheme.secondaryText }}>Contact Us</Link></li>
                            <li><Link href="/faq" className="text-sm hover:text-blue-400" style={{ color: currentTheme.secondaryText }}>FAQ</Link></li>
                            <li><Link href="/returns" className="text-sm hover:text-blue-400" style={{ color: currentTheme.secondaryText }}>Returns</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold mb-4 tracking-wider uppercase" style={{ color: currentTheme.white }}>Company</h4>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-sm hover:text-blue-400" style={{ color: currentTheme.secondaryText }}>About Us</Link></li>
                            <li><Link href="/privacy" className="text-sm hover:text-blue-400" style={{ color: currentTheme.secondaryText }}>Privacy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: `1px solid ${currentTheme.border}` }}>
                    <p className="text-xs" style={{ color: currentTheme.muted }}>© 2026 VESTO. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

/* ── Main Home Component ─────────────────────────────────── */
export default function Home({ latestProducts = [], bestSellers = [], featuredProducts = [], homeSections = [], categories = [], heroBanners = [], promoBanners = [] }) {
    const { theme, toggleTheme } = useTheme();
    const heroProduct = featuredProducts[0] ?? latestProducts[0] ?? null;
    const arrivals = latestProducts.length ? latestProducts : bestSellers;
    const flashPool = bestSellers.length ? bestSellers : latestProducts;

    // Dynamic theme based on current theme
    const currentTheme = theme === 'dark' ? {
        background: '#0A0D14',
        card: '#111827',
        secondaryCard: '#161F2F',
        border: 'rgba(255,255,255,0.08)',
        white: '#FFFFFF',
        secondaryText: '#A8B3CF',
        muted: '#667085',
        danger: '#EF4444',
    } : {
        background: '#FFFFFF',
        card: '#F8F9FA',
        secondaryCard: '#E9ECEF',
        border: 'rgba(0,0,0,0.1)',
        white: '#FFFFFF',
        secondaryText: '#495057',
        muted: '#6C757D',
        danger: '#EF4444',
    };

    const CURRENT_THEME = currentTheme;

    return (
        <>
            <style>{animationStyles}</style>
            <div style={{ backgroundColor: CURRENT_THEME.background, fontFamily: "'Inter', sans-serif" }}>
                {/* Top Bar */}
                <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} text-center py-2.5 text-xs tracking-widest font-medium animate-pulse`}>
                    FREE SHIPPING ON ORDERS ABOVE RP200.000 &nbsp;·&nbsp; NEW COLLECTION 2026
                </div>

                {/* Navbar */}
                <Navbar categories={categories} darkMode={theme === 'dark'} />
                <HeroBannerSlider banners={heroBanners} theme={theme} />
                <CategoryStrip categories={categories} theme={theme} />
                <FeatureStrip theme={theme} />
                <FlashSale products={flashPool} theme={theme} />
                <PromoBanners banners={promoBanners} theme={theme} />
                <NewArrivals products={arrivals} theme={theme} />
                <FashionCollection theme={theme} />
                <FeaturedCollection theme={theme} />
                <Footer theme={theme} />
            </div>
        </>
    );
}
