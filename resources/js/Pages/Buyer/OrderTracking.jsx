import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Truck, Package, CheckCircle, MapPin, Clock } from 'lucide-react';
import AccountSidebar from '../../Components/Buyer/AccountSidebar';
import OrderTimeline from '../../Components/Buyer/OrderTimeline';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
    }).format(value ?? 0);
}

export default function OrderTracking({ order = null }) {
    const { auth } = usePage().props;
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching tracking data
        setTimeout(() => {
            setTrackingData({
                status: order?.status || 'processing',
                estimatedDelivery: order?.estimated_delivery || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                currentLocation: 'Jakarta Distribution Center',
                trackingEvents: [
                    {
                        date: new Date().toISOString(),
                        status: 'Processing',
                        location: 'Jakarta Distribution Center',
                        description: 'Your order is being processed',
                    },
                    {
                        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                        status: 'Order Confirmed',
                        location: 'Jakarta',
                        description: 'Order confirmed and payment received',
                    },
                ],
            });
            setLoading(false);
        }, 1000);
    }, [order]);

    if (loading) {
        return (
            <div className="min-h-screen flex bg-[#0f172a]" style={{fontFamily: "'Inter', sans-serif"}}>
                <AccountSidebar activeMenu="orders" />
                <div className="ml-72 flex-1 min-h-screen">
                    <div className="px-6 py-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-gray-700 rounded w-1/3" />
                            <div className="h-64 bg-gray-800 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-[#0f172a]" style={{fontFamily: "'Inter', sans-serif"}}>
            <AccountSidebar activeMenu="orders" />

            <div className="ml-72 flex-1 min-h-screen">
                <div className="px-6 py-6">
                    {/* Header */}
                    <div className="mb-6">
                        <Link href="/buyer/orders" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Orders
                        </Link>
                        <h1 className="text-2xl font-bold text-white">Track Order #{order?.order_number}</h1>
                    </div>

                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-[#1e293b] rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-white">Order Summary</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    trackingData?.status === 'delivered' 
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : trackingData?.status === 'cancelled'
                                            ? 'bg-red-500/20 text-red-400'
                                            : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                    {trackingData?.status?.charAt(0).toUpperCase() + trackingData?.status?.slice(1)}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Order Date</p>
                                    <p className="text-sm text-white">{new Date(order?.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Total</p>
                                    <p className="text-sm text-white">{fmt(order?.grand_total)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Items</p>
                                    <p className="text-sm text-white">{order?.items?.length} items</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Payment</p>
                                    <p className="text-sm text-white">{order?.payment_method === 'cod' ? 'COD' : 'Bank Transfer'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-[#1e293b] rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Delivery Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <MapPin className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Delivery Address</p>
                                        <p className="text-sm text-white">
                                            {order?.shipping_address?.address || 'Jl. Sudirman No. 123'}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {order?.shipping_address?.city || 'Jakarta'}, {order?.shipping_address?.postal_code || '10220'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                                        <Clock className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Estimated Delivery</p>
                                        <p className="text-sm text-white">
                                            {trackingData?.estimatedDelivery 
                                                ? new Date(trackingData.estimatedDelivery).toLocaleDateString()
                                                : 'Calculating...'}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Current Location: {trackingData?.currentLocation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-[#1e293b] rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Order Progress</h2>
                            <OrderTimeline status={trackingData?.status} />
                        </div>

                        {/* Tracking Events */}
                        <div className="bg-[#1e293b] rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Tracking History</h2>
                            <div className="space-y-4">
                                {trackingData?.trackingEvents?.map((event, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full ${
                                                index === 0 ? 'bg-blue-500' : 'bg-gray-600'
                                            }`} />
                                            {index < trackingData.trackingEvents.length - 1 && (
                                                <div className="w-0.5 h-full bg-gray-700 mt-1" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-medium text-white">{event.status}</p>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(event.date).toLocaleString()}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-400">{event.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-[#1e293b] rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order?.items?.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-gray-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-white font-medium">{item.name}</p>
                                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm text-white">{fmt(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Support */}
                        <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-6">
                            <div className="flex items-center gap-3">
                                <Truck className="w-6 h-6 text-blue-400" />
                                <div className="flex-1">
                                    <p className="text-sm text-blue-300 font-medium">Need help with your order?</p>
                                    <p className="text-xs text-blue-400">Contact our support team for assistance</p>
                                </div>
                                <Link
                                    href="/contact"
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
