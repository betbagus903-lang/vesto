import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { useBuyerTheme } from '../../Context/BuyerThemeContext';
import { Bell, Check, Trash2, Package, CreditCard, Truck, Star, Gift, Moon, Sun, Menu, X } from 'lucide-react';
import AccountSidebar from '../../Components/Buyer/AccountSidebar';

export default function Notifications() {
    const { auth } = usePage().props;
    const { theme, toggleTheme } = useBuyerTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'order', title: 'Order Shipped', message: 'Your order #12345 has been shipped and is on its way!', time: '2 hours ago', read: false, icon: Truck },
        { id: 2, type: 'promotion', title: 'Special Offer', message: 'Get 20% off on your next purchase. Use code SUMMER20', time: '5 hours ago', read: false, icon: Gift },
        { id: 3, type: 'review', title: 'Review Reminder', message: 'How was your recent purchase? Leave a review to earn 50 points!', time: '1 day ago', read: true, icon: Star },
        { id: 4, type: 'payment', title: 'Payment Successful', message: 'Your payment of Rp250.000 was successful', time: '2 days ago', read: true, icon: CreditCard },
        { id: 5, type: 'order', title: 'Order Delivered', message: 'Your order #12340 has been delivered', time: '3 days ago', read: true, icon: Package },
        { id: 6, type: 'promotion', title: 'New Arrival', message: 'Check out our new summer collection!', time: '5 days ago', read: true, icon: Gift },
    ]);

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

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getNotificationIcon = (icon) => {
        const Icon = icon;
        return <Icon className="w-5 h-5" />;
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
                <AccountSidebar activeMenu="notifications" />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <AccountSidebar activeMenu="notifications" />
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
                                    Notifications
                                </h1>
                                <p className={`text-xs md:text-sm ${styles.textMuted} mt-0.5 hidden sm:block`}>
                                    Your activity updates
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
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <h1 className={`text-2xl font-bold ${styles.text}`}>Notifications</h1>
                            {unreadCount > 0 && (
                                <span className="px-3 py-1 bg-[#3b82f6] text-white text-sm font-medium rounded-full">
                                    {unreadCount} unread
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-[#1e3a5f] border rounded-xl p-5 transition-all ${
                                    !notification.read ? 'border-[#3b82f6] bg-[#1e3a5f]/80' : 'border-[#1e3a5f]'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${!notification.read ? 'bg-[#3b82f6]/20' : 'bg-gray-700'}`}>
                                        <span className={!notification.read ? 'text-[#3b82f6]' : 'text-gray-400'}>
                                            {getNotificationIcon(notification.icon)}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className={`font-semibold ${!notification.read ? 'text-white' : 'text-gray-400'}`}>
                                                    {notification.title}
                                                </h3>
                                                <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                                            </div>
                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                className="p-1 hover:bg-[#1e3a5f] rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} className="text-gray-500 hover:text-red-400" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-gray-500">{notification.time}</p>
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="flex items-center gap-1 text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
                                                >
                                                    <Check size={14} />
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {notifications.length === 0 && (
                        <div className="text-center py-16">
                            <Bell className={`w-16 h-16 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-4`} />
                            <h3 className={`text-lg font-semibold ${styles.text} mb-2`}>No notifications</h3>
                            <p className={styles.textMuted}>You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
