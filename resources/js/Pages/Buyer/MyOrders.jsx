import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Package, Calendar, DollarSign, ArrowRight, Eye } from 'lucide-react';
import Navbar from '../../Components/Shared/Navbar';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function MyOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Load orders from localStorage (for demo - in production this would come from backend)
        const savedOrders = localStorage.getItem('vesto_orders');
        if (savedOrders) {
            setOrders(JSON.parse(savedOrders));
        }
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'processing':
                return 'bg-blue-100 text-blue-700';
            case 'shipped':
                return 'bg-purple-100 text-purple-700';
            case 'delivered':
                return 'bg-green-100 text-green-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

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
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-sm text-gray-500 mt-1">Track and manage your orders</p>
                    </div>
                    <Link
                        href="/shop"
                        className="flex items-center gap-2 bg-gray-900 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <Package className="w-4 h-4" />
                        Shop Now
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-sm text-gray-500 mb-6">You haven't placed any orders yet.</p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Start Shopping
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Order Number</p>
                                            <p className="text-sm font-semibold text-gray-900">{order.order_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                                            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                                            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                                                <DollarSign className="w-3 h-3" />
                                                {fmt(order.grand_total)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>

                                {/* Order Items */}
                                <div className="p-4">
                                    <div className="space-y-3">
                                        {order.items?.map((item, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                    {item.image ? (
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-gray-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                                    {item.variantName && (
                                                        <p className="text-xs text-gray-500">{item.variantName}</p>
                                                    )}
                                                    <p className="text-xs text-gray-600 mt-0.5">
                                                        Qty: {item.quantity} × {fmt(item.price)}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {fmt(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Footer */}
                                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span>Payment: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</span>
                                        <span>•</span>
                                        <span>Shipping: {order.shipping_method === 'express' ? 'Express' : 'Standard'}</span>
                                    </div>
                                    <button className="flex items-center gap-1 text-sm text-gray-900 font-semibold hover:text-gray-700 transition-colors">
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
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
