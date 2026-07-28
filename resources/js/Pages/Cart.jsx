import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Navbar from '../Components/Shared/Navbar';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('vesto_cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        // Save cart to localStorage whenever it changes
        localStorage.setItem('vesto_cart', JSON.stringify(cartItems));
        
        // Dispatch custom event for cart count update
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: cartItems.length } }));
    }, [cartItems]);

    const removeFromCart = (index) => {
        setCartItems(prev => prev.filter((_, i) => i !== index));
    };

    const updateQuantity = (index, delta) => {
        setCartItems(prev => prev.map((item, i) => {
            if (i === index) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 200000 ? 0 : 15000;
    const total = subtotal + shipping;

    return (
        <div className="min-h-screen bg-white">
            {/* Top Bar */}
            <div className="bg-gray-900 text-white text-center py-2.5 text-xs tracking-widest font-medium">
                FREE SHIPPING ON ORDERS ABOVE RP200.000
            </div>

            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart ({cartItems.length})</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Continue Shopping
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                        {item.image ? (
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-8 h-8 text-gray-300" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-sm">
                                                    {item.name}
                                                </h3>
                                                {item.variantName && (
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {item.variantName}
                                                    </p>
                                                )}
                                                {item.sku && (
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        SKU: {item.sku}
                                                    </p>
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => removeFromCart(index)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center border border-gray-200 rounded">
                                                <button 
                                                    onClick={() => updateQuantity(index, -1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button 
                                                    onClick={() => updateQuantity(index, 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <p className="text-base font-bold text-gray-900">
                                                {fmt(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 rounded-lg p-4 sticky top-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                                
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Subtotal</span>
                                        <span className="text-sm font-semibold text-gray-900">{fmt(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Shipping</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {shipping === 0 ? 'FREE' : fmt(shipping)}
                                        </span>
                                    </div>
                                    {shipping === 0 && (
                                        <p className="text-xs text-green-600">
                                            🎉 Free shipping applied!
                                        </p>
                                    )}
                                </div>

                                <div className="border-t border-gray-200 pt-3 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-base font-bold text-gray-900">Total</span>
                                        <span className="text-base font-bold text-gray-900">{fmt(total)}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Link
                                        href="/checkout"
                                        className="w-full bg-gray-900 text-white font-semibold text-sm py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href="/shop"
                                        className="w-full border-2 border-gray-900 text-gray-900 font-semibold text-sm py-3 rounded-lg hover:bg-gray-50 transition-colors text-center block"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>

                                <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                                    <p className="text-xs text-gray-500 text-center">
                                        🔒 Secure checkout powered by Vesto
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

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
