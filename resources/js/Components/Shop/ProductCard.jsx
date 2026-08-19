import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

function ProductImage({ src, alt, className = '', theme = 'light' }) {
    const [err, setErr] = useState(false);
    const currentTheme = theme === 'dark' ? {
        bg: '#1F2937',
        icon: '#667085',
    } : {
        bg: '#F3F4F6',
        icon: '#9CA3AF',
    };

    if (!src || err) {
        return (
            <div className={`flex items-center justify-center ${className}`} style={{ backgroundColor: currentTheme.bg }}>
                <svg className="w-12 h-12" style={{ color: currentTheme.icon }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        );
    }
    return <img src={src} alt={alt} className={`object-cover ${className}`} onError={() => setErr(true)} />;
}

export default function ProductCard({ product, selectedColor = null, selectedColors = [], theme = 'light' }) {
    const currentTheme = theme === 'dark' ? {
        background: '#111827',
        border: 'rgba(255,255,255,0.08)',
        white: '#FFFFFF',
        secondaryText: '#A8B3CF',
        muted: '#667085',
        bg: '#1F2937',
    } : {
        background: '#FFFFFF',
        border: 'rgba(0,0,0,0.1)',
        white: '#1A1A1A',
        secondaryText: '#6C757D',
        muted: '#6C757D',
        bg: '#F3F4F6',
    };
    const { auth } = usePage().props;
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const buttonRef = useRef(null);
    const imageContainerRef = useRef(null);

    const displayPrice = product.special_price ?? product.price;
    const hasDiscount = !!product.special_price;
    const discountPct = hasDiscount
        ? Math.round((1 - product.special_price / product.price) * 100)
        : 0;

    // Check if product is in wishlist on mount
    useEffect(() => {
        if (auth?.user) {
            checkWishlistStatus();
        }
    }, [product.id, auth?.user]);

    const checkWishlistStatus = async () => {
        try {
            const response = await axios.post('/api/wishlists/check', {
                product_id: product.id
            }, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });
            setIsInWishlist(response.data.is_wishlisted);
        } catch (error) {
            console.error('Error checking wishlist status:', error);
        }
    };

    const createFlyingAnimation = (startRect, endRect) => {
        // Create flying image element
        const flyingImg = document.createElement('img');
        flyingImg.src = displayImage;
        flyingImg.style.cssText = `
            position: fixed;
            width: ${startRect.width}px;
            height: ${startRect.height}px;
            left: ${startRect.left}px;
            top: ${startRect.top}px;
            z-index: 9999;
            border-radius: 8px;
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            opacity: 0.9;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(flyingImg);

        // Trigger animation after a small delay
        setTimeout(() => {
            flyingImg.style.left = `${endRect.left + 10}px`;
            flyingImg.style.top = `${endRect.top + 10}px`;
            flyingImg.style.width = '25px';
            flyingImg.style.height = '25px';
            flyingImg.style.opacity = '0.5';
            flyingImg.style.transform = 'scale(0.8)';
        }, 50);

        // Remove element after animation
        setTimeout(() => {
            document.body.removeChild(flyingImg);
        }, 850);
    };

    const toggleWishlist = async (e) => {
        e.preventDefault();
        
        if (!auth?.user) {
            // Redirect to login if not authenticated
            window.location.href = '/login';
            return;
        }

        if (isAnimating) return;

        setIsLoading(true);
        setIsAnimating(true);

        try {
            const response = await axios.post('/api/wishlists/toggle', {
                product_id: product.id
            }, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });
            
            if (response.data.success) {
                // Create flying animation when adding to wishlist
                if (response.data.action === 'added') {
                    const imageContainer = imageContainerRef.current;
                    const imageRect = imageContainer?.getBoundingClientRect();
                    const wishlistIcon = document.querySelector('a[href="/buyer/wishlist"]');
                    const wishlistRect = wishlistIcon?.getBoundingClientRect();

                    if (imageRect && wishlistRect) {
                        createFlyingAnimation(imageRect, wishlistRect);
                    }

                    // Update wishlist count in localStorage
                    const currentCount = parseInt(localStorage.getItem('wishlist_count') || '0');
                    localStorage.setItem('wishlist_count', (currentCount + 1).toString());
                    
                    // Dispatch event to update navbar
                    window.dispatchEvent(new CustomEvent('wishlist-updated', { 
                        detail: { count: currentCount + 1 } 
                    }));
                }

                setIsInWishlist(response.data.in_wishlist);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            if (error.response?.status === 401) {
                window.location.href = '/login';
            }
        } finally {
            setIsLoading(false);
            setTimeout(() => setIsAnimating(false), 850);
        }
    };

    // Gambar sudah dikirim benar dari server (sesuai filter warna).
    // Frontend hanya fallback jika user hover/interaksi tanpa reload.
    const primaryColor = selectedColor || (selectedColors.length > 0 ? selectedColors[0] : null);

    const getDisplayImage = () => {
        if (primaryColor && product.variants?.length > 0) {
            const match = product.variants.find(
                v => v.color?.toLowerCase().trim() === primaryColor.toLowerCase().trim()
            );
            if (match?.image) return match.image;
        }
        // Use gallery images first, then fallback to single image
        if (product.images && product.images.length > 0) {
            return product.images[0];
        }
        return product.image;
    };

    const displayImage = getDisplayImage();
    const productUrl = primaryColor
        ? `/products/${product.slug}?color=${encodeURIComponent(primaryColor)}`
        : `/products/${product.slug}`;

    return (
        <Link href={productUrl} className="group block">
            <div className="rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300" style={{ backgroundColor: currentTheme.background, border: `1px solid ${currentTheme.border}` }}>
                {/* Image Container */}
                <div ref={imageContainerRef} className="relative aspect-[3/4] overflow-hidden" style={{ backgroundColor: currentTheme.bg }}>
                    <ProductImage 
                        src={displayImage} 
                        alt={product.name} 
                        className="w-full h-full group-hover:scale-105 transition-transform duration-500" 
                        theme={theme}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {hasDiscount && (
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                -{discountPct}%
                            </span>
                        )}
                        {product.is_new && (
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                                NEW
                            </span>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <button 
                        ref={buttonRef}
                        onClick={toggleWishlist}
                        disabled={isLoading}
                        className={`absolute top-3 right-3 w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
                            isInWishlist 
                                ? 'bg-black/60 text-red-500 opacity-100' 
                                : 'bg-black/40 text-white opacity-0 group-hover:opacity-100'
                        }`}
                    >
                        <Heart 
                            className={`w-4 h-4 ${isInWishlist ? 'fill-red-500' : ''}`} 
                        />
                    </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                    {/* Product Name */}
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors" style={{ color: currentTheme.white }}>
                        {product.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2">
                        <p className="font-bold text-base" style={{ color: currentTheme.white }}>
                            {fmt(displayPrice)}
                        </p>
                        {hasDiscount && (
                            <p className="text-sm line-through" style={{ color: currentTheme.muted }}>
                                {fmt(product.price)}
                            </p>
                        )}
                    </div>

                    {/* Stock Badge */}
                    {product.variants && product.variants.length > 0 ? (
                        (() => {
                            const totalStock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
                            return totalStock > 0 ? (
                                <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ color: '#059669', backgroundColor: 'rgba(5, 150, 105, 0.1)' }}>
                                    In Stock
                                </span>
                            ) : (
                                <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ color: '#DC2626', backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
                                    Out of Stock
                                </span>
                            );
                        })()
                    ) : (
                        product.stock && product.stock > 0 ? (
                            product.stock <= 5 ? (
                                <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                                    Low Stock
                                </span>
                            ) : (
                                <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                    In Stock
                                </span>
                            )
                        ) : (
                            <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded">
                                Out of Stock
                            </span>
                        )
                    )}
                </div>
            </div>
        </Link>
    );
}
