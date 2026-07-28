import { Link, usePage } from '@inertiajs/react';
import { CheckCircle, ShoppingBag, Package, MapPin, CreditCard, Truck, ChevronRight, Copy } from 'lucide-react';
import Navbar from '../Components/Shared/Navbar';
import { useState } from 'react';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
    }).format(value ?? 0);
}

export default function OrderSuccess() {
    const { flash } = usePage().props;
    const order = flash?.order ?? null;
    const [copied, setCopied] = useState(false);

    const copyOrderNumber = () => {
        if (!order?.order_number) return;
        navigator.clipboard.writeText(order.order_number).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const paymentLabel = {
        cod: 'Cash on Delivery',
        transfer: 'Bank Transfer',
    };

    const shippingLabel = {
        standard: 'Standard Shipping (3–5 days)',
        express: 'Express Shipping (1–2 days)',
    };

    return (
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="bg-gray-900 text-white text-center py-2 text-[11px] tracking-widest font-medium">
                FREE SHIPPING ON ORDERS ABOVE RP200.000
            </div>

            <Navbar />

            <div className="max-w-3xl mx-auto px-4 py-12">
                {/* ── Success hero ── */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-5">
                        <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
                    <p className="text-gray-500 text-sm">
                        Thank you for your purchase. We'll start processing your order right away.
                    </p>
                </div>

                {/* ── Order number card ── */}
                {order && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Order Number</p>
                                <p className="text-lg font-bold text-gray-900 font-mono">{order.order_number}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={copyOrderNumber}
                                    className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
                                    <Copy className="w-3.5 h-3.5" />
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-2 rounded-lg border border-amber-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                                    Pending
                                </span>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-400">Placed on {order.created_at}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    {/* ── Items ordered ── */}
                    {order?.items?.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-2xl p-5 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="w-4 h-4 text-gray-500" />
                                <h2 className="text-sm font-bold text-gray-900">Items Ordered</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                            {item.image
                                                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                : <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="w-5 h-5 text-gray-300" />
                                                  </div>
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                            {item.variantName && (
                                                <p className="text-xs text-gray-400">{item.variantName}</p>
                                            )}
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-semibold text-gray-900">{fmt(item.price * item.quantity)}</p>
                                            <p className="text-xs text-gray-400">Qty {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Delivery address ── */}
                    {order?.address && (
                        <div className="bg-white border border-gray-200 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <h2 className="text-sm font-bold text-gray-900">Delivery Address</h2>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p className="font-semibold text-gray-900">{order.address.name}</p>
                                <p>{order.address.address}</p>
                                <p>{order.address.city}, {order.address.province} {order.address.postal}</p>
                                <p>{order.address.country}</p>
                                <p className="text-gray-400 text-xs mt-2">{order.address.phone}</p>
                            </div>
                        </div>
                    )}

                    {/* ── Payment & shipping + totals ── */}
                    {order && (
                        <div className="bg-white border border-gray-200 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="w-4 h-4 text-gray-500" />
                                <h2 className="text-sm font-bold text-gray-900">Payment & Shipping</h2>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <CreditCard className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600">{paymentLabel[order.payment_method] ?? order.payment_method}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Truck className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600">{shippingLabel[order.shipping_method] ?? order.shipping_method}</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 space-y-1.5">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal</span>
                                        <span>{fmt(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Shipping</span>
                                        <span>{order.shipping_cost > 0 ? fmt(order.shipping_cost) : 'FREE'}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100">
                                        <span>Total</span>
                                        <span>{fmt(order.grand_total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── What's next ── */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-8">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">What happens next?</h3>
                    <div className="space-y-3">
                        {[
                            { step: '1', text: 'We\'ll review and confirm your order within a few minutes.' },
                            { step: '2', text: 'Your items will be packed and handed to our shipping partner.' },
                            { step: '3', text: 'You\'ll receive a tracking number once your order is shipped.' },
                        ].map(({ step, text }) => (
                            <div key={step} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {step}
                                </div>
                                <p className="text-sm text-gray-600">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Actions ── */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/shop"
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-gray-800 transition-colors">
                        <ShoppingBag className="w-4 h-4" />
                        Continue Shopping
                    </Link>
                    <Link href="/buyer/orders"
                        className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 font-semibold text-sm py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
                        <Package className="w-4 h-4" />
                        View My Orders
                    </Link>
                </div>
            </div>

            <footer className="bg-gray-950 text-gray-400 py-8 mt-8">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-xl font-black text-white tracking-widest">VESTO</span>
                    <p className="text-xs">© 2026 Vesto. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
