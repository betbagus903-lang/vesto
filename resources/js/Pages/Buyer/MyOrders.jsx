import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useBuyerTheme } from '../../Context/BuyerThemeContext';
import { ShoppingCart, RefreshCw, Moon, Sun, Menu, X } from 'lucide-react';
import AccountSidebar from '../../Components/Buyer/AccountSidebar';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function MyOrders() {
    const { auth } = usePage().props;
    const { theme, toggleTheme } = useBuyerTheme();
    const [orders, setOrders] = useState([]);
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

    useEffect(() => {
        const savedOrders = localStorage.getItem('vesto_orders');
        if (savedOrders) {
            setOrders(JSON.parse(savedOrders));
        }
    }, []);

    const handleReorder = (order) => {
        // Add all items from the order to cart
        const existingCart = JSON.parse(localStorage.getItem('vesto_cart') || '[]');
        
        order.items?.forEach(item => {
            existingCart.push({
                id: item.product_id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                variant: item.variant,
            });
        });

        localStorage.setItem('vesto_cart', JSON.stringify(existingCart));
        
        // Dispatch cart update event
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: existingCart.length } }));
        
        // Navigate to cart
        window.location.href = '/cart';
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'text-yellow-400';
            case 'processing':
                return 'text-blue-400';
            case 'shipped':
                return 'text-purple-400';
            case 'delivered':
                return 'text-green-400';
            case 'cancelled':
                return 'text-red-400';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div className={`min-h-screen flex ${styles.bg}`} style={{fontFamily: "'Inter', sans-serif"}}>
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

            {/* Main content */}
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
                                    View your order history
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

                <div className="px-6 py-6">
                    <div className="mb-6">
                        <h1 className={`text-xl font-semibold ${styles.text}`}>
                            My Orders
                        </h1>
                        <p className={`text-sm ${styles.textMutedLight} mt-1`}>View and manage your order history</p>
                    </div>

                    {orders.length === 0 ? (
                        <div className={`${styles.cardBg} ${styles.border} rounded-lg p-8 text-center`}>
                            <p className={`${styles.text} mb-2`}>No orders yet</p>
                            <p className={`text-sm ${styles.textMuted} mb-4`}>You haven't placed any orders yet.</p>
                            <Link href="/shop" className={`text-sm ${styles.textMuted} hover:${styles.text} transition-colors`}>
                                Shop Now →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map((order) => (
                                <div key={order.id} className={`${styles.cardBg} ${styles.border} rounded-lg p-4`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className={`text-xs ${styles.textMuted}`}>Order</p>
                                                <p className={`text-sm ${styles.text}`}>{order.order_number}</p>
                                            </div>
                                            <div>
                                                <p className={`text-xs ${styles.textMuted}`}>Date</p>
                                                <p className={`text-sm ${styles.text}`}>{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className={`text-xs ${styles.textMuted}`}>Total</p>
                                                <p className={`text-sm ${styles.text}`}>{fmt(order.grand_total)}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {order.items?.map((item, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className={`w-12 h-12 ${styles.cardBgLight} rounded overflow-hidden flex-shrink-0`}>
                                                    {item.image ? (
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm ${styles.text}`}>{item.name}</p>
                                                    {item.variantName && (
                                                        <p className={`text-xs ${styles.textMuted}`}>{item.variantName}</p>
                                                    )}
                                                </div>
                                                <p className={`text-sm ${styles.text}`}>
                                                    {fmt(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={`mt-3 pt-3 border-t ${styles.border} flex items-center justify-between`}>
                                        <div className={`text-xs ${styles.textMuted}`}>
                                            {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'} • {order.shipping_method === 'express' ? 'Express' : 'Standard'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleReorder(order)}
                                                className={`flex items-center gap-1 text-xs ${styles.textMuted} hover:${styles.text} transition-colors`}
                                            >
                                                <RefreshCw size={12} />
                                                Reorder
                                            </button>
                                            <button className={`text-xs ${styles.textMuted} hover:${styles.text} transition-colors`}>
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
