import { Link } from '@inertiajs/react';
import { useState } from 'react';
import AccountSidebar from '../../Components/Buyer/AccountSidebar';
import { useBuyerTheme } from '../../Context/BuyerThemeContext';
import ShippingProgressTracker from '../../Components/Buyer/ShippingProgressTracker';
import StatusHistoryTimeline from '../../Components/Buyer/StatusHistoryTimeline';
import OrderDetailCard from '../../Components/Buyer/OrderDetailCard';
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle, AlertCircle, ExternalLink, Moon, Sun, Menu, X, Search, Heart, Bell } from 'lucide-react';

export default function Orders({ orders }) {
    const [selectedOrder, setSelectedOrder] = useState(orders.length > 0 ? orders[0] : null);
    const { theme, toggleTheme } = useBuyerTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const themeStyles = {
        dark: {
            bg: 'bg-[#0a0f1a]',
            headerBg: 'bg-[#0a1628]',
            border: 'border-white/10',
            text: 'text-white',
            textMuted: 'text-white/50',
            textMutedLight: 'text-white/40',
            cardBg: 'bg-white/5',
            cardBgLight: 'bg-white/10',
            hoverBg: 'hover:bg-white/10',
            inputBg: 'bg-[#1e3a5f]',
        },
        light: {
            bg: 'bg-gray-50',
            headerBg: 'bg-white',
            border: 'border-gray-200',
            text: 'text-gray-900',
            textMuted: 'text-gray-600',
            textMutedLight: 'text-gray-400',
            cardBg: 'bg-white',
            cardBgLight: 'bg-gray-100',
            hoverBg: 'hover:bg-gray-100',
            inputBg: 'bg-gray-100',
        },
    };

    const styles = themeStyles[theme];

    const getStatusColor = (status) => {
        switch(status) {
            case 'Menunggu Pembayaran':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Dikemas':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Dikirim':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'Selesai':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Dibatalkan':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Menunggu Pembayaran':
                return <Clock className="w-4 h-4" />;
            case 'Dikemas':
                return <AlertCircle className="w-4 h-4" />;
            case 'Dikirim':
                return <Truck className="w-4 h-4" />;
            case 'Selesai':
                return <CheckCircle className="w-4 h-4" />;
            case 'Dibatalkan':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getShippingStage = (status) => {
        switch(status) {
            case 'pending':
                return 'dikemas';
            case 'processing':
                return 'dikemas';
            case 'shipped':
                return 'dikirim';
            case 'delivered':
                return 'diterima';
            case 'completed':
                return 'diterima';
            case 'cancelled':
                return 'dikemas';
            default:
                return 'dikemas';
        }
    };

    const getStatusHistory = (order) => {
        // Use real status history from backend if available
        if (order.status_history && order.status_history.length > 0) {
            return order.status_history;
        }

        // Fallback to mock data with realistic timestamps if no history exists
        const history = [];
        const status = order.status_raw || 'pending';

        // Base date from order
        const baseDate = new Date(order.date);

        history.push({
            id: 1,
            status: 'dikemas',
            label: 'Dikemas',
            date: formatDateTime(baseDate, 0, 9, 15), // 09:15
            description: 'Pesanan selesai dikemas'
        });

        if (status === 'shipped' || status === 'delivered' || status === 'completed') {
            history.push({
                id: 2,
                status: 'dikirim',
                label: 'Dikirim',
                date: formatDateTime(baseDate, 0, 13, 20), // 13:20 same day
                description: 'Pesanan telah diambil oleh kurir'
            });
        }

        if (status === 'delivered' || status === 'completed') {
            history.push({
                id: 3,
                status: 'dalam_perjalanan',
                label: 'Dalam Perjalanan',
                date: formatDateTime(baseDate, 0, 18, 40), // 18:40 same day
                description: 'Pesanan sedang dalam perjalanan'
            });
            history.push({
                id: 4,
                status: 'diterima',
                label: 'Diterima',
                date: formatDateTime(baseDate, 1, 14, 25), // 14:25 next day
                description: 'Pesanan telah diterima oleh pembeli'
            });
        }

        return history;
    };

    const formatDateTime = (baseDate, dayOffset, hours, minutes) => {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + dayOffset);
        date.setHours(hours, minutes, 0, 0);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' + 
               date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div className={`min-h-screen flex ${styles.bg}`} style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className={`fixed inset-0 z-50 lg:hidden ${theme === 'dark' ? 'bg-black/50' : 'bg-black/30'}`}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <AccountSidebar activeMenu="orders" />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <AccountSidebar activeMenu="orders" />
            </div>

            <div className="flex-1 min-h-screen transition-all duration-300 lg:ml-72 ml-0">
                {/* Top Header */}
                <div className={`${styles.headerBg} border-b ${styles.border} px-4 md:px-6 py-4 sticky top-0 z-40`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className={`lg:hidden p-2 ${styles.hoverBg} rounded-lg transition-colors`}
                            >
                                {sidebarOpen ? <X className={`w-5 h-5 ${styles.text}`} /> : <Menu className={`w-5 h-5 ${styles.text}`} />}
                            </button>
                            <div>
                                <h1 className={`text-lg md:text-xl font-bold ${styles.text}`}>
                                    My Orders
                                </h1>
                                <p className={`text-xs md:text-sm ${styles.textMuted} mt-0.5 hidden sm:block`}>
                                    Track and manage your orders
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            <button
                                onClick={toggleTheme}
                                className={`p-2 ${styles.hoverBg} rounded-lg transition-colors`}
                                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {theme === 'dark' ? <Sun className={`w-5 h-5 ${styles.textMuted}`} /> : <Moon className={`w-5 h-5 ${styles.textMuted}`} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8">

                    <div className="mb-8">
                        <h1 className={`text-2xl font-medium ${styles.text} tracking-wide`}>My Orders</h1>
                        <p className={`text-sm ${styles.textMutedLight} mt-1`}>Lihat dan lacak semua pesanan yang telah kamu buat.</p>
                    </div>

                    {/* Orders List */}
                    {orders.length === 0 ? (
                        <div className={`${styles.cardBg} ${styles.border} rounded-2xl p-16 text-center`}>
                            <div className={`w-16 h-16 ${styles.cardBgLight} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <Package className={`w-8 h-8 ${styles.textMutedLight}`} />
                            </div>
                            <p className={`font-medium ${styles.text} mb-1`}>Belum ada pesanan</p>
                            <p className={`text-sm ${styles.textMutedLight} mb-6`}>Mulai belanja untuk melihat pesanan Anda di sini.</p>
                            <Link href="/shop" className={`inline-block ${styles.cardBgLight} ${styles.text} text-sm font-medium px-6 py-3 rounded-xl ${styles.hoverBg} transition-colors`}>
                                Mulai Belanja →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Selected Order Header */}
                            {selectedOrder && (
                                <div className={`${styles.cardBg} ${styles.border} rounded-2xl p-5`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-16 h-16 ${styles.cardBgLight} rounded-xl overflow-hidden flex-shrink-0`}>
                                            <img
                                                src={selectedOrder.image || 'https://via.placeholder.com/64'}
                                                alt={selectedOrder.product}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`${styles.textMuted} text-xs mb-1`}>#{selectedOrder.order_number}</p>
                                            <p className={`${styles.text} font-medium mb-1`}>{selectedOrder.product}</p>
                                            <p className={`${styles.textMuted} text-sm`}>{selectedOrder.date}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className={`${styles.textMutedLight} text-xs mb-1`}>{selectedOrder.items_count} Item · {formatPrice(selectedOrder.total)}</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(selectedOrder.status)}`}>
                                                {getStatusIcon(selectedOrder.status)}
                                                {selectedOrder.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Shipping Progress Tracker */}
                            {selectedOrder && (
                                <ShippingProgressTracker currentStage={getShippingStage(selectedOrder.status_raw)} />
                            )}

                            {/* Delivery Summary */}
                            {selectedOrder && selectedOrder.shipment && (
                                <div className={`${styles.cardBg} ${styles.border} rounded-2xl p-5`}>
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className={`${styles.textMuted} text-xs mb-1`}>Kurir</p>
                                                <p className={`${styles.text} text-sm`}>{selectedOrder.shipment.carrier || '-'}</p>
                                            </div>
                                            <div>
                                                <p className={`${styles.textMuted} text-xs mb-1`}>No. Resi</p>
                                                <p className={`${styles.text} text-sm font-mono`}>{selectedOrder.shipment.tracking_number || '-'}</p>
                                            </div>
                                            {selectedOrder.shipment.estimated_delivery && (
                                                <div>
                                                    <p className={`${styles.textMuted} text-xs mb-1`}>Estimasi Tiba</p>
                                                    <p className={`${styles.text} text-sm`}>{selectedOrder.shipment.estimated_delivery}</p>
                                                </div>
                                            )}
                                            <div>
                                                <p className={`${styles.textMuted} text-xs mb-1`}>Status</p>
                                                <p className={`${styles.text} text-sm`}>{selectedOrder.status}</p>
                                            </div>
                                        </div>
                                        {selectedOrder.shipment.tracking_number && (
                                            <button className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-300">
                                                Lacak Pesanan <ExternalLink size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Two Column: Status History + Order Detail */}
                            {selectedOrder && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <StatusHistoryTimeline
                                        history={getStatusHistory(selectedOrder)}
                                        currentStatus={getShippingStage(selectedOrder.status_raw)}
                                    />
                                    <OrderDetailCard order={selectedOrder} />
                                </div>
                            )}

                            {/* Orders List */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-lg font-medium ${styles.text}`}>Semua Pesanan</h3>
                                    <p className={`text-xs ${styles.textMuted}`}>Riwayat seluruh pesananmu</p>
                                </div>
                                <div className="space-y-3">
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className={`${styles.cardBg} ${styles.border} rounded-xl p-4 ${styles.hoverBg} transition-all duration-300 cursor-pointer ${
                                                selectedOrder?.id === order.id ? 'border-violet-500/50 bg-violet-500/5' : ''
                                            }`}
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 ${styles.cardBgLight} rounded-lg overflow-hidden flex-shrink-0`}>
                                                    <img
                                                        src={order.image || 'https://via.placeholder.com/56'}
                                                        alt={order.product}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`${styles.textMuted} text-xs mb-1`}>{order.order_number}</p>
                                                    <p className={`${styles.text} font-medium text-sm mb-1 truncate`}>{order.product}</p>
                                                    <p className={`${styles.textMutedLight} text-xs`}>{order.date}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className={`${styles.textMutedLight} text-xs mb-1`}>{order.items_count} Item</p>
                                                    <p className={`${styles.text} font-medium text-sm`}>{formatPrice(order.total)}</p>
                                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <Link
                                                    href={`/buyer/orders/${order.id}`}
                                                    className={`text-sm ${styles.textMuted} hover:${styles.text} transition-colors flex items-center gap-1 flex-shrink-0`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <ChevronRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}