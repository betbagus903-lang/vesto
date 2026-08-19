import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useBuyerTheme } from '../../Context/BuyerThemeContext';
import { useState } from 'react';
import { Home, Package, Heart, MapPin, CreditCard, Grid, Sparkles, TrendingUp, Tag, User, Gift, Bell, Shield, Settings, LogOut, Menu, X, Sun, Moon } from 'lucide-react';

export default function AccountSidebar({ activeMenu }) {
    const { auth, personalStats } = usePage().props;
    const user = auth?.user;
    const wishlistCount = personalStats?.wishlist || 0;
    const { theme, toggleTheme } = useBuyerTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const themeStyles = {
        dark: {
            bg: 'bg-[#0a0f1a]',
            border: 'border-white/5',
            text: 'text-white',
            textMuted: 'text-white/30',
            textMutedLight: 'text-white/40',
            textMutedMedium: 'text-white/50',
            hoverBg: 'hover:bg-white/5',
            activeBg: 'bg-gradient-to-r from-[#3b82f6]/20 to-transparent',
            activeBorder: 'border-[#3b82f6]',
            avatarBg: 'bg-gradient-to-br from-white/10 to-white/5',
            avatarBorder: 'border-white/10',
        },
        light: {
            bg: 'bg-white',
            border: 'border-gray-200',
            text: 'text-gray-900',
            textMuted: 'text-gray-400',
            textMutedLight: 'text-gray-500',
            textMutedMedium: 'text-gray-600',
            hoverBg: 'hover:bg-gray-100',
            activeBg: 'bg-gradient-to-r from-blue-500/10 to-transparent',
            activeBorder: 'border-blue-500',
            avatarBg: 'bg-gradient-to-br from-gray-100 to-gray-50',
            avatarBorder: 'border-gray-200',
        },
    };

    const styles = themeStyles[theme] || themeStyles.light;

    const navigationGroups = [
        {
            title: 'MAIN MENU',
            items: [
                { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/buyer/dashboard' },
                { id: 'orders', label: 'My Orders', icon: Package, href: '/buyer/orders' },
                { id: 'wishlist', label: 'Wishlist', icon: Heart, href: '/buyer/wishlist' },
                { id: 'addresses', label: 'Addresses', icon: MapPin, href: '/buyer/addresses' },
                { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard, href: '/buyer/payment-methods' },
            ],
        },
        {
            title: 'SHOP',
            items: [
                { id: 'shop', label: 'Categories', icon: Grid, href: '/shop' },
                { id: 'new-arrivals', label: 'New Arrivals', icon: Sparkles, href: '/shop?sort=newest' },
                { id: 'best-sellers', label: 'Best Sellers', icon: TrendingUp, href: '/shop?sort=popularity' },
                { id: 'sale', label: 'Sale', icon: Tag, href: '/shop?discount=true' },
                { id: 'collections', label: 'Collections', icon: Grid, href: '/shop' },
            ],
        },
        {
            title: 'ACCOUNT',
            items: [
                { id: 'profile', label: 'Profile', icon: User, href: '/buyer/profile' },
                { id: 'coupons', label: 'Coupons', icon: Gift, href: '/buyer/coupons' },
                { id: 'reviews', label: 'Reviews', icon: TrendingUp, href: '/buyer/reviews' },
                { id: 'notifications', label: 'Notifications', icon: Bell, href: '/buyer/notifications' },
            ],
        },
        {
            title: 'SETTINGS',
            items: [
                { id: 'security', label: 'Security', icon: Shield, href: '/buyer/security' },
                { id: 'settings', label: 'Settings', icon: Settings, href: '/buyer/settings' },
            ],
        },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={`p-3 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <aside className={`w-72 min-h-screen ${styles.bg} border-r ${styles.border} flex flex-col fixed top-0 left-0 z-50 transform transition-transform duration-300 ${
                mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
                {/* Logo */}
                <div className={`px-6 py-6 border-b ${styles.border}`}>
                    <Link href="/" className={`text-2xl font-light tracking-[0.3em] ${styles.text}`}>
                        VESTO
                    </Link>
                </div>

            {/* User Info */}
            <div className={`px-6 py-5 border-b ${styles.border || 'border-gray-200'}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${styles.avatarBg} ${styles.avatarBorder} rounded-full flex items-center justify-center ${styles.text} font-light text-sm flex-shrink-0`}>
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                        <p className={`text-sm font-light ${styles.text} truncate`}>{user?.name || 'User'}</p>
                        <p className={`text-xs ${styles.textMutedLight} truncate`}>{user?.email || ''}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">
                {navigationGroups.map((group) => (
                    <div key={group.title} className="mb-6">
                        <p className={`text-xs font-light ${styles.textMuted} uppercase tracking-[0.2em] mb-3 px-2`}>{group.title}</p>
                        <nav className="flex flex-col gap-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const showBadge = item.id === 'wishlist' && wishlistCount > 0;
                                
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-light transition-all duration-200 ${
                                            activeMenu === item.id
                                                ? `${styles.activeBg} ${styles.text} border-l-2 ${styles.activeBorder}`
                                                : `${styles.textMutedMedium} hover:${styles.text} ${styles.hoverBg}`
                                        }`}
                                    >
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        <span className="flex-1">{item.label}</span>
                                        {showBadge && (
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                theme === 'dark' 
                                                    ? 'bg-blue-500/20 text-blue-400' 
                                                    : 'bg-blue-500/10 text-blue-600'
                                            }`}>
                                                {wishlistCount}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </div>

            {/* Logout */}
            <div className={`px-4 py-5 border-t ${styles.border}`}>
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-3 ${styles.textMutedMedium} hover:${styles.text} ${styles.hoverBg} text-sm font-light transition-all duration-200`}
                >
                    {theme === 'dark' ? <Sun className="w-4 h-4 flex-shrink-0" /> : <Moon className="w-4 h-4 flex-shrink-0" />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${styles.textMutedMedium} hover:${styles.text} ${styles.hoverBg} text-sm font-light transition-all duration-200`}
                >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    Logout
                </Link>
            </div>
        </aside>
        </>
    );
}
