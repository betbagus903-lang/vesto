import { useState } from 'react';
import { X, Heart, ShoppingCart, ZoomIn } from 'lucide-react';
import { Link } from '@inertiajs/react';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
    }).format(value ?? 0);
}

export default function QuickViewModal({ product, onClose, onAddToCart }) {
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    if (!product) return null;

    const isConfigurable = product.type === 'configurable' && product.variants?.length > 0;
    const displayPrice = selectedVariant?.price || product.price;
    const displayImage = selectedVariant?.image || product.image || product.images?.[0];

    const handleAddToCart = () => {
        const item = {
            id: product.id,
            name: product.name,
            price: displayPrice,
            quantity,
            image: displayImage,
            variant: selectedVariant,
        };
        onAddToCart?.(item);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                    <X size={20} className="text-gray-700" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                    {/* Product Image */}
                    <div className="relative">
                        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                            {displayImage ? (
                                <img
                                    src={displayImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingCart className="w-16 h-16 text-gray-300" />
                                </div>
                            )}
                        </div>
                        <Link
                            href={`/product/${product.id}`}
                            className="absolute bottom-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        >
                            <ZoomIn size={20} className="text-gray-700" />
                        </Link>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                        <p className="text-3xl font-bold text-gray-900 mb-4">{fmt(displayPrice)}</p>

                        {product.description && (
                            <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                                {product.description}
                            </p>
                        )}

                        {/* Variants */}
                        {isConfigurable && product.variants?.length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-gray-900 mb-3">Select Variant</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`p-3 border-2 rounded-lg text-left transition-all ${
                                                selectedVariant?.id === variant.id
                                                    ? 'border-gray-900 bg-gray-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <p className="text-sm font-medium text-gray-900">
                                                {variant.name}
                                            </p>
                                            <p className="text-sm text-gray-600">{fmt(variant.price)}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-900 mb-3">Quantity</p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                    <span className="text-xl font-bold text-gray-700">-</span>
                                </button>
                                <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                    <span className="text-xl font-bold text-gray-700">+</span>
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-auto">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={`p-3 border-2 rounded-lg transition-colors ${
                                    isWishlisted
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <Heart 
                                    size={20} 
                                    className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-700'} 
                                />
                            </button>
                        </div>

                        {/* View Full Details */}
                        <Link
                            href={`/product/${product.id}`}
                            className="mt-4 text-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            View Full Details →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
