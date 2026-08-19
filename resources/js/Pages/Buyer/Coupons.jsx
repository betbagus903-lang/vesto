import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { useBuyerTheme } from '../../Context/BuyerThemeContext';
import { Gift, Copy, Check, Calendar, Tag, Moon, Sun, Menu, X } from 'lucide-react';
import AccountSidebar from '../../Components/Buyer/AccountSidebar';

export default function Coupons() {
    const { auth, coupons } = usePage().props;
    const { theme, toggleTheme } = useBuyerTheme();
    const [copied, setCopied] = useState(null);
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

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(null), 2000);
    };

    const activeCoupons = coupons?.filter(c => c.status === 'active') || [];
    const expiredCoupons = coupons?.filter(c => c.status === 'expired') || [];
    const usedCoupons = coupons?.filter(c => c.status === 'used') || [];

    const formatDiscount = (coupon) => {
        if (coupon.discount_type === 'percentage') {
            return `${coupon.discount_value}%`;
        } else if (coupon.discount_type === 'fixed') {
            return `Rp${coupon.discount_value.toLocaleString()}`;
        } else if (coupon.discount_type === 'free_shipping') {
            return 'Free Shipping';
        }
        return coupon.discount_value;
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
                <AccountSidebar activeMenu="coupons" />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <AccountSidebar activeMenu="coupons" />
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
                                    My Coupons
                                </h1>
                                <p className={`text-xs md:text-sm ${styles.textMuted} mt-0.5 hidden sm:block`}>
                                    Your discount codes
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

                    {/* Active Coupons */}
                    <div className="mb-8">
                        <h2 className={`text-lg font-semibold ${styles.text} mb-4`}>Active Coupons ({activeCoupons.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeCoupons.map((coupon) => (
                                <div key={coupon.id} className="bg-gradient-to-r from-[#1e3a5f] to-[#0a1628] border border-[#3b82f6] rounded-xl p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-[#3b82f6]/20 rounded-lg">
                                                <Gift className="w-6 h-6 text-[#3b82f6]" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">{formatDiscount(coupon)}</p>
                                                <p className="text-sm text-gray-400">{coupon.description}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-300 font-mono">{coupon.code}</span>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(coupon.code)}
                                            className="flex items-center gap-2 text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
                                        >
                                            {copied === coupon.code ? (
                                                <>
                                                    <Check size={16} />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={16} />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-[#1e3a5f] flex items-center gap-2 text-xs text-gray-400">
                                        <Calendar size={14} />
                                        <span>Expires: {coupon.expire_date ? new Date(coupon.expire_date).toLocaleDateString() : 'No expiry'}</span>
                                        {coupon.minimum_order > 0 && (
                                            <span>• Min purchase: Rp{coupon.minimum_order.toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Used Coupons */}
                    {usedCoupons.length > 0 && (
                        <div className="mb-8">
                            <h2 className={`text-lg font-semibold ${styles.text} mb-4`}>Used Coupons ({usedCoupons.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {usedCoupons.map((coupon) => (
                                    <div key={coupon.id} className="bg-[#1e3a5f] border border-[#1e3a5f] rounded-xl p-6 opacity-60">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-gray-700 rounded-lg">
                                                    <Gift className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-gray-400">{formatDiscount(coupon)}</p>
                                                    <p className="text-sm text-gray-500">{coupon.description}</p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-gray-700 text-gray-400 text-xs font-medium rounded-full">
                                                Used
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Tag className="w-4 h-4" />
                                            <span className="font-mono">{coupon.code}</span>
                                        </div>
                                        {coupon.used_at && (
                                            <div className="mt-2 text-xs text-gray-500">
                                                Used on {coupon.used_at}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Expired Coupons */}
                    {expiredCoupons.length > 0 && (
                        <div className="mb-8">
                            <h2 className={`text-lg font-semibold ${styles.text} mb-4`}>Expired Coupons ({expiredCoupons.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {expiredCoupons.map((coupon) => (
                                    <div key={coupon.id} className="bg-[#1e3a5f] border border-[#1e3a5f] rounded-xl p-6 opacity-40">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-gray-700 rounded-lg">
                                                    <Gift className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-gray-400">{formatDiscount(coupon)}</p>
                                                    <p className="text-sm text-gray-500">{coupon.description}</p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
                                                Expired
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Tag className="w-4 h-4" />
                                            <span className="font-mono">{coupon.code}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {(!coupons || coupons.length === 0) && (
                        <div className={`${styles.cardBg} ${styles.border} rounded-xl p-12 text-center`}>
                            <div className={`w-16 h-16 ${styles.cardBgLight} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <Gift className={`w-8 h-8 ${styles.textMuted}`} />
                            </div>
                            <h3 className={`text-lg font-medium ${styles.text} mb-2`}>No coupons yet</h3>
                            <p className={`text-sm ${styles.textMuted} mb-6 max-w-md mx-auto`}>
                                You don't have any coupons yet. Check back later for special offers and discounts!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
