import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Heart } from 'lucide-react';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

function ProductImage({ src, alt, className = '' }) {
    const [err, setErr] = useState(false);
    if (!src || err) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
                <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        );
    }
    return <img src={src} alt={alt} className={`object-cover ${className}`} onError={() => setErr(true)} />;
}

export default function ProductCard({ product, selectedColor = null, selectedColors = [] }) {
    const displayPrice = product.special_price ?? product.price;
    const hasDiscount = !!product.special_price;
    const discountPct = hasDiscount
        ? Math.round((1 - product.special_price / product.price) * 100)
        : 0;

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
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <ProductImage 
                        src={displayImage} 
                        alt={product.name} 
                        className="w-full h-full group-hover:scale-105 transition-transform duration-500" 
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
                        onClick={(e) => {
                            e.preventDefault();
                            // Add wishlist functionality
                        }}
                        className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                    >
                        <Heart className="w-4 h-4 text-gray-700" />
                    </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2">
                        <p className="font-bold text-gray-900 text-base">
                            {fmt(displayPrice)}
                        </p>
                        {hasDiscount && (
                            <p className="text-sm text-gray-400 line-through">
                                {fmt(product.price)}
                            </p>
                        )}
                    </div>

                    {/* Stock Badge */}
                    {product.variants && product.variants.length > 0 ? (
                        (() => {
                            const totalStock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
                            return totalStock > 0 ? (
                                <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                    In Stock
                                </span>
                            ) : (
                                <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded">
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
