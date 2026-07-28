import { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function MiniCart({ isOpen, onClose }) {
    const [cartItems, setCartItems] = useState([]);
    const [isOpenState, setIsOpenState] = useState(isOpen);

    useEffect(() => {
        setIsOpenState(isOpen);
    }, [isOpen]);

    useEffect(() => {
        // Load cart from localStorage
        const loadCart = () => {
            const savedCart = localStorage.getItem('vesto_cart');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            } else {
                setCartItems([]);
            }
        };

        loadCart();

        // Listen for cart updates
        const handleCartUpdate = (e) => {
            loadCart();
            // Auto-close mini cart when cart becomes empty (after order placed)
            if (e?.detail?.count === 0) {
                setIsOpenState(false);
            }
        };

        // When order is placed, cart is already cleared in localStorage —
        // re-sync state and close the panel
        const handleCartCleared = () => {
            setCartItems([]);
            setIsOpenState(false);
        };

        window.addEventListener('cart-updated', handleCartUpdate);
        window.addEventListener('cart-cleared', handleCartCleared);
        return () => {
            window.removeEventListener('cart-updated', handleCartUpdate);
            window.removeEventListener('cart-cleared', handleCartCleared);
        };
    }, []);

    const saveCart = (items) => {
        localStorage.setItem('vesto_cart', JSON.stringify(items));
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: items.length } }));
    };

    const removeFromCart = (index) => {
        setCartItems(prev => {
            const newItems = prev.filter((_, i) => i !== index);
            saveCart(newItems);
            return newItems;
        });
    };

    const updateQuantity = (index, delta) => {
        setCartItems(prev => {
            const newItems = prev.map((item, i) => {
                if (i === index) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            });
            saveCart(newItems);
            return newItems;
        });
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (!isOpenState) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />
            
            {/* Slide-out Panel */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-gray-700" />
                        <h2 className="text-base font-bold text-gray-900">Shopping Cart ({cartItems.length})</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex gap-3 pb-3 border-b border-gray-100">
                                    {/* Product Image */}
                                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                        {item.image ? (
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-6 h-6 text-gray-300" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-xs truncate">
                                            {item.name}
                                        </h3>
                                        {item.variantName && (
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {item.variantName}
                                            </p>
                                        )}
                                        <p className="text-sm font-bold text-gray-900 mt-1">
                                            {fmt(item.price)}
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex items-center border border-gray-200 rounded">
                                                <button 
                                                    onClick={() => updateQuantity(index, -1)}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-7 text-center text-xs font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button 
                                                    onClick={() => updateQuantity(index, 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <button 
                                                onClick={() => removeFromCart(index)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Subtotal</span>
                            <span className="text-base font-bold text-gray-900">{fmt(subtotal)}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                            Shipping and taxes calculated at checkout
                        </p>
                        <button
                            onClick={() => window.location.href = '/cart'}
                            className="w-full bg-gray-900 text-white font-semibold text-sm py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            View Cart
                        </button>
                        <button
                            onClick={() => window.location.href = '/checkout'}
                            className="w-full border-2 border-gray-900 text-gray-900 font-semibold text-sm py-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
