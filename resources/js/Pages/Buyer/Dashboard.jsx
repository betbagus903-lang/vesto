import { Link, router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import AccountSidebar from '../../Components/Buyer/AccountSidebar';
import { useBuyerTheme } from '../../Context/BuyerThemeContext';
import { Search, Heart, Bell, Package, ChevronRight, ShoppingBag, Tag, Star, Gift, ArrowRight, TrendingUp, Menu, X, ShoppingCart, DollarSign, Check, Copy, Clock, Moon, Sun } from 'lucide-react';

export default function Dashboard({ personalStats, recentOrders, wishlistProducts, activityData, recommendedProducts, recentlyViewed, promotionBanner }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const { theme, toggleTheme } = useBuyerTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [wishlistedIds, setWishlistedIds] = useState([]);
    const [localWishlist, setLocalWishlist] = useState([]);

    // Status step mapping for order progress
    const statusStep = { 'Dikemas': 0, 'Dikirim': 1, 'Selesai': 2 };

    // Fallback for empty data
    const stats = personalStats || {
        totalOrders: 0,
        completedOrders: 0,
        wishlist: 0,
        coupons: 0,
        totalSpending: 0,
    };

    const orders = recentOrders || [];
    const wishlist = wishlistProducts || [];
    const activity = activityData || [];
    const recommendations = recommendedProducts || [];
    const viewed = recentlyViewed || [];

    // Initialize wishlisted IDs and local wishlist from wishlist data
    useEffect(() => {
        if (wishlistProducts && wishlistProducts.length > 0) {
            const ids = wishlistProducts.map(w => w.product_id);
            setWishlistedIds(ids);
            setLocalWishlist(wishlistProducts);
        }
    }, [wishlistProducts]);

    // Simple sparkline for stat cards
    const Sparkline = ({ data, color }) => {
        const max = Math.max(...data);
        const points = data.map((d, i) => `${i * (60 / (data.length - 1))},${20 - (d / max) * 18 - 1}`).join(' ');
        return (
            <svg width="100%" height="24" viewBox="0 0 60 24" preserveAspectRatio="none" className="mt-2">
                <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
                <circle cx="60" cy={20 - (data[data.length - 1] / max) * 18 - 1} r="1.8" fill={color} />
            </svg>
        );
    };

    // Interactive dual-line activity chart (no external chart library needed)
    const ActivityChart = () => {
        const width = 560;
        const height = 220;
        const padding = { top: 16, right: 16, bottom: 28, left: 32 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;

        // Handle empty or insufficient activity data
        if (!activity || activity.length === 0 || activity.length < 2) {
            return (
                <div className="flex items-center justify-center h-48 text-white/40 text-sm">
                    Belum ada aktivitas belanja
                </div>
            );
        }

        const maxOrders = Math.max(...activity.map(d => d.orders || 0), 1); // Prevent division by zero
        const maxSpending = Math.max(...activity.map(d => d.spending || 0), 1); // Prevent division by zero

        const xFor = (i) => padding.left + (i * (chartW / (activity.length - 1)));
        const yForOrders = (v) => padding.top + chartH - ((v || 0) / maxOrders) * chartH;
        const yForSpending = (v) => padding.top + chartH - ((v || 0) / maxSpending) * chartH;

        const ordersPoints = activity.map((d, i) => `${xFor(i)},${yForOrders(d.orders)}`).join(' ');
        const spendingPoints = activity.map((d, i) => `${xFor(i)},${yForSpending(d.spending)}`).join(' ');

        const gridLines = [0, 10, 20, 30];

        return (
            <div className="relative">
                <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                    <defs>
                        <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="spendingFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* grid lines */}
                    {gridLines.map((g) => (
                        <g key={g}>
                            <line
                                x1={padding.left}
                                x2={width - padding.right}
                                y1={padding.top + chartH - (g / 30) * chartH}
                                y2={padding.top + chartH - (g / 30) * chartH}
                                stroke="#ffffff"
                                strokeOpacity="0.06"
                            />
                            <text x={4} y={padding.top + chartH - (g / 30) * chartH + 4} fontSize="10" fill="#ffffff60">{g}</text>
                        </g>
                    ))}

                    {/* fill areas */}
                    <polygon points={`${ordersPoints} ${xFor(activity.length - 1)},${padding.top + chartH} ${xFor(0)},${padding.top + chartH}`} fill="url(#ordersFill)" />

                    {/* lines */}
                    <polyline fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={ordersPoints} />
                    <polyline fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={spendingPoints} />

                    {/* points + hover targets */}
                    {activity.map((d, i) => (
                        <g key={d.month}>
                            <circle cx={xFor(i)} cy={yForOrders(d.orders)} r="3" fill="#8b5cf6" />
                            <circle cx={xFor(i)} cy={yForSpending(d.spending)} r="3" fill="#3b82f6" />
                            {hoverIndex === i && (
                                <line x1={xFor(i)} x2={xFor(i)} y1={padding.top} y2={padding.top + chartH} stroke="#ffffff" strokeOpacity="0.15" />
                            )}
                            <rect
                                x={xFor(i) - (chartW / (activity.length - 1)) / 2}
                                y={padding.top}
                                width={chartW / (activity.length - 1)}
                                height={chartH}
                                fill="transparent"
                                onMouseEnter={() => setHoverIndex(i)}
                                onMouseLeave={() => setHoverIndex(null)}
                                style={{ cursor: 'pointer' }}
                            />
                            <text x={xFor(i)} y={height - 6} fontSize="10" fill="#ffffff60" textAnchor="middle">{d.month}</text>
                        </g>
                    ))}
                </svg>

                {hoverIndex !== null && (
                    <div
                        className="absolute bg-[#0a1628] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none"
                        style={{
                            left: `${(xFor(hoverIndex) / width) * 100}%`,
                            top: 0,
                            transform: 'translate(-50%, -100%)',
                        }}
                    >
                        <p className="text-white font-medium mb-1">{activity[hoverIndex].month} 2025</p>
                        <p className="text-white/70 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />Pesanan: {activity[hoverIndex].orders}</p>
                        <p className="text-white/70 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3b82f6]" />Pengeluaran: Rp {activity[hoverIndex].spending}M</p>
                    </div>
                )}
            </div>
        );
    };

    const OrderProgress = ({ status }) => {
        const steps = ['Dikemas', 'Dikirim', 'Selesai'];
        const current = statusStep[status] ?? 0;
        return (
            <div className="flex items-center gap-1 mt-2 w-full max-w-[140px]">
                {steps.map((s, i) => (
                    <div key={s} className="flex items-center flex-1">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i <= current ? 'bg-emerald-400' : 'bg-white/15'}`} />
                        {i < steps.length - 1 && (
                            <div className={`h-0.5 flex-1 ${i < current ? 'bg-emerald-400' : 'bg-white/15'}`} />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Dikemas': return 'bg-amber-500/20 text-amber-400';
            case 'Dikirim': return 'bg-violet-500/20 text-violet-400';
            case 'Selesai': return 'bg-emerald-500/20 text-emerald-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText('MEMO10');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleToggleWishlist = async (productId) => {
        // Find the product in recommendations
        const product = recommendations.find(p => p.id === productId);
        if (!product) return;

        // Toggle local state immediately
        if (wishlistedIds.includes(productId)) {
            setWishlistedIds(wishlistedIds.filter(id => id !== productId));
            setLocalWishlist(localWishlist.filter(w => w.product_id !== productId));
        } else {
            setWishlistedIds([...wishlistedIds, productId]);
            setLocalWishlist([...localWishlist, {
                id: Date.now(),
                product_id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
            }]);
        }

        // Send to backend
        try {
            await fetch('/api/wishlists/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({ product_id: productId }),
            });
        } catch (error) {
            // Revert on error
            if (wishlistedIds.includes(productId)) {
                setWishlistedIds([...wishlistedIds, productId]);
            } else {
                setWishlistedIds(wishlistedIds.filter(id => id !== productId));
            }
        }
    };

    const themeStyles = {
        dark: {
            bg: 'bg-[#0a0f1a]',
            headerBg: 'bg-[#0a1628]',
            border: 'border-[#1e3a5f]',
            text: 'text-white',
            textMuted: 'text-white/50',
            textMutedLight: 'text-white/40',
            cardBg: 'bg-white/5',
            hoverBg: 'hover:bg-white/5',
            inputBg: 'bg-[#1e3a5f]',
            gradientFrom: 'from-violet-500/10',
        },
        light: {
            bg: 'bg-gray-50',
            headerBg: 'bg-white',
            border: 'border-gray-200',
            text: 'text-gray-900',
            textMuted: 'text-gray-600',
            textMutedLight: 'text-gray-400',
            cardBg: 'bg-white',
            hoverBg: 'hover:bg-gray-100',
            inputBg: 'bg-gray-100',
            gradientFrom: 'from-violet-500/5',
        },
    };

    const styles = themeStyles[theme];

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
                <AccountSidebar activeMenu="dashboard" />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <AccountSidebar activeMenu="dashboard" />
            </div>

            {/* Main Content */}
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
                                    Welcome back, {user?.name?.split(' ')[0] || 'Buyer'}! 👋
                                </h1>
                                <p className={`text-xs md:text-sm ${styles.textMuted} mt-0.5 hidden sm:block`}>
                                    Style more. Save more. Enjoy the best of VESTO.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            <form onSubmit={handleSearch} className="relative hidden md:block">
                                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${styles.textMuted} w-4 h-4`} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className={`w-64 pl-10 pr-4 py-2 ${styles.inputBg} border ${styles.border} rounded-lg text-sm ${styles.text} placeholder-gray-400 focus:outline-none focus:border-[#3b82f6]`}
                                />
                            </form>
                            <button className={`md:hidden p-2 ${styles.hoverBg} rounded-lg transition-colors`}>
                                <Search className={`w-5 h-5 ${styles.textMuted}`} />
                            </button>
                            <Link href="/buyer/wishlist" className={`relative p-2 ${styles.hoverBg} rounded-lg transition-colors`}>
                                <Heart className={`w-5 h-5 ${styles.textMuted}`} />
                            </Link>
                            <Link href="/buyer/notifications" className={`relative p-2 ${styles.hoverBg} rounded-lg transition-colors`}>
                                <Bell className={`w-5 h-5 ${styles.textMuted}`} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </Link>
                            <button
                                onClick={toggleTheme}
                                className={`p-2 ${styles.hoverBg} rounded-lg transition-colors`}
                                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {theme === 'dark' ? <Sun className={`w-5 h-5 ${styles.textMuted}`} /> : <Moon className={`w-5 h-5 ${styles.textMuted}`} />}
                            </button>
                            <div className={`flex items-center gap-3 pl-2 md:pl-4 border-l ${styles.border}`}>
                                <div className="w-8 md:w-9 h-8 md:h-9 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-full flex items-center justify-center text-white font-black text-xs md:text-sm">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="hidden md:block">
                                    <p className={`text-sm font-semibold ${styles.text}`}>{user?.name || 'User'}</p>
                                    <p className={`text-xs ${styles.textMuted}`}>{user?.email || ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6">
                    {/* Welcome Section */}
                    <div className="flex items-start justify-between gap-6 mb-8">
                        <div>
                            <h1 className={`text-3xl font-light ${styles.text} mb-2`}>
                                Hi, {user?.name?.split(' ')[0] || 'Buyer'} 👋
                            </h1>
                            <p className={`${styles.textMuted} text-base`}>
                                Selamat datang kembali! Temukan style yang cocok untukmu.
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/shop" className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600/20 to-violet-600/10 hover:from-violet-600/30 hover:to-violet-600/20 border border-violet-500/30 rounded-xl text-sm ${styles.text} transition-all duration-300 flex-shrink-0`}>
                                Eksplor Koleksi <ArrowRight size={14} />
                            </Link>
                            <div className={`w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} shadow-2xl`}>
                                <img
                                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&h=150&fit=crop"
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quick Shopping Overview - 4 Cards with Sparklines */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent border border-violet-500/20 rounded-xl p-5 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-violet-500/20 rounded-lg">
                                    <ShoppingCart className="w-4 h-4 text-violet-400" />
                                </div>
                                <span className={`text-xs ${styles.textMuted} font-medium`}>Pesanan</span>
                            </div>
                            <p className={`text-3xl font-light ${styles.text} mb-2`}>{stats.totalOrders}</p>
                            <Sparkline data={[8, 12, 10, 15, 18, 24]} color="#a78bfa" />
                        </div>
                        <div className="bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent border border-pink-500/20 rounded-xl p-5 hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-pink-500/20 rounded-lg">
                                    <Heart className="w-4 h-4 text-pink-400" />
                                </div>
                                <span className={`text-xs ${styles.textMuted} font-medium`}>Wishlist</span>
                            </div>
                            <p className={`text-3xl font-light ${styles.text} mb-2`}>{stats.wishlist}</p>
                            <Sparkline data={[20, 25, 22, 28, 30, 32]} color="#f472b6" />
                        </div>
                        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-xl p-5 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-amber-500/20 rounded-lg">
                                    <Tag className="w-4 h-4 text-amber-400" />
                                </div>
                                <span className={`text-xs ${styles.textMuted} font-medium`}>Kupon</span>
                            </div>
                            <p className={`text-3xl font-light ${styles.text} mb-2`}>{stats.coupons}</p>
                            <Sparkline data={[2, 3, 2, 4, 4, 5]} color="#fbbf24" />
                        </div>
                        <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 rounded-xl p-5 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <DollarSign className="w-4 h-4 text-blue-400" />
                                </div>
                                <span className={`text-xs ${styles.textMuted} font-medium`}>Total Pengeluaran</span>
                            </div>
                            <p className={`text-3xl font-light ${styles.text} mb-2`}>Rp {(stats.totalSpending / 1000000).toFixed(2)}M</p>
                            <Sparkline data={[1.1, 1.8, 1.5, 2.2, 2.6, 4.75]} color="#60a5fa" />
                        </div>
                    </div>

                    {/* Activity Chart + Recent Orders + Wishlist */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Activity Chart */}
                        <div className="lg:col-span-1 bg-gradient-to-br from-violet-500/5 via-violet-500/[0.02] to-transparent border border-violet-500/20 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className={`text-base font-medium ${styles.text} tracking-wide`}>Aktivitas Belanja</h2>
                                    <p className={`text-xs ${styles.textMutedLight} mt-1`}>6 bulan terakhir</p>
                                </div>
                            </div>
                            <div className={`flex items-center gap-4 mb-4 text-xs ${styles.textMuted}`}>
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500" />Jumlah Pesanan</span>
                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />Total Pengeluaran</span>
                            </div>
                            <ActivityChart />
                        </div>

                        {/* Recent Orders + Wishlist */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Recent Orders */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className={`text-base font-medium ${styles.text} tracking-wide`}>Pesanan Terbaru</h2>
                                    <Link href="/buyer/orders" className={`text-xs ${styles.textMuted} hover:text-violet-400 transition-colors flex items-center gap-1`}>
                                        Lihat Semua <ChevronRight size={12} />
                                    </Link>
                                </div>
                                {orders.length === 0 ? (
                                    <div className={`text-center py-10 border border-dashed ${theme === 'dark' ? 'border-white/10' : 'border-gray-300'} rounded-xl ${styles.cardBg}`}>
                                        <Package className={`w-8 h-8 ${theme === 'dark' ? 'text-white/20' : 'text-gray-300'} mx-auto mb-2`} />
                                        <p className={`text-sm mb-3 ${styles.textMutedLight}`}>Belum ada pesanan</p>
                                        <Link href="/shop" className="text-xs text-violet-400 hover:text-violet-300">Mulai Belanja →</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {orders.slice(0, 3).map((order) => (
                                            <div key={order.id} className={`flex items-center gap-4 p-4 bg-gradient-to-r ${theme === 'dark' ? 'from-white/5' : 'from-gray-100'} to-transparent border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} rounded-xl hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300`}>
                                                <img src={order.image || 'https://via.placeholder.com/64'} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-medium ${styles.text} text-sm`}>{order.product}</p>
                                                    <p className={`text-xs ${styles.textMutedLight} mt-0.5`}>{order.id} • {order.date}</p>
                                                    <OrderProgress status={order.status} />
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className={`font-light ${styles.text} text-sm`}>Rp {order.price.toLocaleString()}</p>
                                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Wishlist */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className={`text-base font-medium ${styles.text} tracking-wide`}>Wishlist Saya</h2>
                                    {localWishlist.length > 2 && (
                                        <Link href="/buyer/wishlist" className={`text-xs ${styles.textMuted} hover:text-violet-400 transition-colors flex items-center gap-1`}>
                                            Lihat Semua <ChevronRight size={12} />
                                        </Link>
                                    )}
                                </div>
                                {localWishlist.length === 0 ? (
                                    <div className={`text-center py-10 border border-dashed ${theme === 'dark' ? 'border-white/10' : 'border-gray-300'} rounded-xl ${styles.cardBg}`}>
                                        <Heart className={`w-8 h-8 ${theme === 'dark' ? 'text-white/20' : 'text-gray-300'} mx-auto mb-2`} />
                                        <p className={`text-sm mb-3 ${styles.textMutedLight}`}>Belum ada produk di wishlist</p>
                                        <Link href="/shop" className="text-xs text-violet-400 hover:text-violet-300">Mulai Belanja →</Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {localWishlist.slice(0, 2).map((product) => (
                                            <div key={product.id} className="group">
                                                <div className={`relative overflow-hidden rounded-xl mb-2 aspect-square border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} hover:border-violet-500/30 transition-all duration-300`}>
                                                    <img
                                                        src={product.image || 'https://via.placeholder.com/128'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <button
                                                        onClick={() => handleToggleWishlist(product.product_id)}
                                                        className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white shadow-lg hover:scale-110 transition-all duration-300"
                                                    >
                                                        <Heart className="w-4 h-4 fill-white" />
                                                    </button>
                                                </div>
                                                <p className={`text-xs ${styles.text} truncate`}>{product.name}</p>
                                                <p className={`text-xs ${styles.textMutedLight}`}>Rp {product.price.toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Fashion Recommendations */}
                    <div className="mb-8">
                        <div className="mb-4">
                            <h2 className={`text-lg font-medium ${styles.text} tracking-wide`}>Rekomendasi Untukmu</h2>
                            <p className={`text-sm ${styles.textMutedLight} mt-1`}>Pilihan yang mungkin cocok dengan style kamu</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                            {recommendations.map((product) => (
                                <div key={product.id} className="group">
                                    <div className={`relative overflow-hidden rounded-2xl mb-3 aspect-square border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} hover:border-violet-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10`}>
                                        <img
                                            src={product.image || 'https://via.placeholder.com/256'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {product.discount && (
                                            <span className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white text-xs font-medium rounded-lg shadow-lg">
                                                -{product.discount}%
                                            </span>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleToggleWishlist(product.id);
                                            }}
                                            className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 hover:scale-110 shadow-lg z-10 ${
                                                wishlistedIds.includes(product.id)
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white'
                                            }`}
                                        >
                                            <Heart
                                                className={`w-4 h-4 ${wishlistedIds.includes(product.id) ? 'fill-white' : ''}`}
                                            />
                                        </button>
                                    </div>
                                    <h3 className={`font-medium ${styles.text} text-sm mb-1 truncate`}>{product.name}</h3>
                                    <div className="flex items-center gap-0.5 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className={`font-medium ${styles.text}`}>Rp {product.price.toLocaleString()}</p>
                                        {product.oldPrice && (
                                            <p className={`text-xs ${styles.textMutedLight} line-through`}>Rp {product.oldPrice.toLocaleString()}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recently Viewed */}
                    {viewed.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className={`text-base font-light ${styles.text} tracking-wide`}>Baru Dilihat</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {viewed.map((product) => (
                                    <Link key={product.id} href="#" className={`group flex items-center gap-3 p-2 rounded-lg ${styles.hoverBg} transition-colors`}>
                                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={product.image || 'https://via.placeholder.com/56'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-xs ${styles.text} truncate`}>{product.name}</p>
                                            <p className={`text-xs ${styles.textMutedLight}`}>Rp {product.price.toLocaleString()}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Personal Promotion */}
                    {promotionBanner && (
                        <div className="relative overflow-hidden rounded-2xl border border-violet-500/20">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-violet-800/80 to-transparent z-10" />
                            <img
                                src={promotionBanner.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=300&fit=crop'}
                                alt={promotionBanner.title || 'Promotion'}
                                className="w-full h-52 object-cover"
                            />
                            <div className="absolute inset-0 z-20 p-8 flex items-center">
                                <div className="max-w-md">
                                    {promotionBanner.title && (
                                        <span className="text-xs font-medium text-violet-300 uppercase tracking-[0.3em] mb-2 block">
                                            {promotionBanner.title}
                                        </span>
                                    )}
                                    <h2 className="text-4xl font-light text-white mb-3">
                                        {promotionBanner.subtitle || 'Special Offer'}
                                    </h2>
                                    <p className="text-white/60 text-base mb-5">
                                        {promotionBanner.button_text || 'Gunakan kode di bawah saat checkout'}
                                    </p>
                                    {promotionBanner.button_link ? (
                                        <Link
                                            href={promotionBanner.button_link}
                                            target={promotionBanner.open_in_new_tab ? '_blank' : '_self'}
                                            className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 rounded-xl text-white text-sm font-medium tracking-wider transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40"
                                        >
                                            {promotionBanner.button_text || 'Shop Now'}
                                            <ArrowRight size={14} />
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleCopyCode}
                                            className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 rounded-xl text-white text-sm font-medium tracking-wider transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40"
                                        >
                                            MEMO10
                                            {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
