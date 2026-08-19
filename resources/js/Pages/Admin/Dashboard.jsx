import AdminLayout from '../../Components/Admin/AdminLayout';
import { Link } from '@inertiajs/react';
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, AlertTriangle, ArrowUpRight, ArrowDownRight, Activity, Target, Zap } from 'lucide-react';
import { useLanguage } from '../../Context/LanguageContext';
import { useTheme } from '../../Context/ThemeContext';

export default function Dashboard({ stats = {}, recentQuestions = [], salesData = [], topProducts = [], recentOrders = [], topCategories = [], achievement = {} }) {
    const { currency, currencyRate } = useLanguage();
    const { theme } = useTheme();

    const themeStyles = {
        dark: {
            bg: 'bg-[#0a0f1a]',
            cardBg: 'bg-[#111827]',
            border: 'border-[#1f2937]',
            text: 'text-white',
            textMuted: 'text-gray-400',
            textMutedLight: 'text-gray-500',
            hoverBorder: 'hover:border-[#3b82f6]',
            inputBg: 'bg-[#1f2937]',
            chartBg: 'bg-[#1f2937]',
        },
        light: {
            bg: 'bg-gray-50',
            cardBg: 'bg-white',
            border: 'border-gray-200',
            text: 'text-gray-900',
            textMuted: 'text-gray-600',
            textMutedLight: 'text-gray-500',
            hoverBorder: 'hover:border-[#3b82f6]',
            inputBg: 'bg-gray-100',
            chartBg: 'bg-gray-100',
        },
    };

    const styles = themeStyles[theme];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num || 0);
    };

    // Use real sales data for chart, fallback to empty array
    const chartData = salesData && salesData.length > 0 ? salesData : [];
    const maxSales = chartData.length > 0 ? Math.max(...chartData.map(d => d.revenue || 0)) : 1;

    return (
        <AdminLayout title="Dashboard">
            <div className={`${styles.bg} min-h-screen p-6`}>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className={`${styles.cardBg} ${styles.border} rounded-xl p-5 ${styles.hoverBorder} transition-all duration-300`}>
                        <div className="flex items-center justify-between mb-3">
                            <p className={`text-sm ${styles.textMuted}`}>Total Sales</p>
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-400" />
                            </div>
                        </div>
                        <p className={`text-3xl font-bold ${styles.text}`}>{formatCurrency(stats?.total_revenue ?? 0)}</p>
                        <div className="flex items-center gap-1 mt-2">
                            {stats?.revenue_trend >= 0 ? <ArrowUpRight className="w-3 h-3 text-green-400" /> : <ArrowDownRight className="w-3 h-3 text-red-400" />}
                            <span className={`text-xs font-medium ${stats?.revenue_trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {stats?.revenue_trend >= 0 ? '+' : ''}{Math.round(stats?.revenue_trend || 0)}%
                            </span>
                            <span className={`text-xs ${styles.textMutedLight}`}>vs last month</span>
                        </div>
                    </div>

                    <div className={`${styles.cardBg} ${styles.border} rounded-xl p-5 ${styles.hoverBorder} transition-all duration-300`}>
                        <div className="flex items-center justify-between mb-3">
                            <p className={`text-sm ${styles.textMuted}`}>Total Orders</p>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 text-blue-400" />
                            </div>
                        </div>
                        <p className={`text-3xl font-bold ${styles.text}`}>{formatNumber(stats?.total_orders ?? 0)}</p>
                        <div className="flex items-center gap-1 mt-2">
                            {stats?.orders_trend >= 0 ? <ArrowUpRight className="w-3 h-3 text-green-400" /> : <ArrowDownRight className="w-3 h-3 text-red-400" />}
                            <span className={`text-xs font-medium ${stats?.orders_trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {stats?.orders_trend >= 0 ? '+' : ''}{Math.round(stats?.orders_trend || 0)}%
                            </span>
                            <span className={`text-xs ${styles.textMutedLight}`}>vs last month</span>
                        </div>
                    </div>

                    <div className={`${styles.cardBg} ${styles.border} rounded-xl p-5 ${styles.hoverBorder} transition-all duration-300`}>
                        <div className="flex items-center justify-between mb-3">
                            <p className={`text-sm ${styles.textMuted}`}>Total Victories</p>
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg flex items-center justify-center">
                                <Activity className="w-5 h-5 text-yellow-400" />
                            </div>
                        </div>
                        <p className={`text-3xl font-bold ${styles.text}`}>{formatNumber(stats?.total_victories ?? 0)}</p>
                        <div className="flex items-center gap-1 mt-2">
                            <ArrowUpRight className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400 font-medium">Monthly Wins</span>
                            <span className={`text-xs ${styles.textMutedLight}`}>achievements</span>
                        </div>
                    </div>

                    <div className={`${styles.cardBg} ${styles.border} rounded-xl p-6 ${styles.hoverBorder} transition-all duration-300`}>
                        <div className="flex items-center justify-between mb-4">
                            <p className={`text-sm ${styles.textMuted}`}>Top Categories</p>
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-orange-400" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <svg viewBox="0 0 100 100" className="w-20 h-20">
                                    {topCategories.length > 0 ? (
                                        <>
                                            <circle cx="50" cy="50" r="40" fill="none" stroke={theme === 'dark' ? '#1f2937' : '#e5e7eb'} strokeWidth="12" />
                                            {topCategories.map((cat, index) => {
                                                const total = topCategories.reduce((sum, c) => sum + c.revenue, 0);
                                                const percentage = (cat.revenue / total) * 100;
                                                const circumference = 2 * Math.PI * 40;
                                                const arcLength = circumference * (percentage / 100);
                                                const colors = ['#F97316', '#FB923C', '#FDBA74', '#FED7AA'];
                                                const prevPercentage = topCategories.slice(0, index).reduce((sum, c) => sum + c.revenue, 0) / total;
                                                const prevOffset = circumference * prevPercentage;
                                                return (
                                                    <circle
                                                        key={cat.id}
                                                        cx="50"
                                                        cy="50"
                                                        r="40"
                                                        fill="none"
                                                        stroke={colors[index]}
                                                        strokeWidth="12"
                                                        strokeDasharray={[arcLength, circumference - arcLength]}
                                                        strokeDashoffset={-prevOffset}
                                                        transform="rotate(-90 50 50)"
                                                    />
                                                );
                                            })}
                                        </>
                                    ) : (
                                        <circle cx="50" cy="50" r="40" fill="none" stroke={theme === 'dark' ? '#1f2937' : '#e5e7eb'} strokeWidth="12" />
                                    )}
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-xs ${styles.textMuted}`}>Total</span>
                                    <span className={`text-sm font-bold ${styles.text}`}>
                                        {formatCurrency(topCategories.reduce((sum, cat) => sum + cat.revenue, 0))}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                {topCategories.slice(0, 3).map((cat, index) => {
                                    const total = topCategories.reduce((sum, c) => sum + c.revenue, 0);
                                    const percentage = ((cat.revenue / total) * 100).toFixed(0);
                                    const colors = ['#F97316', '#FB923C', '#FDBA74'];
                                    return (
                                        <div key={cat.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded" style={{ backgroundColor: colors[index] }}></div>
                                                <span className={`text-xs ${styles.textMuted}`}>{cat.name}</span>
                                            </div>
                                            <span className={`text-xs font-medium ${styles.text}`}>{formatCurrency(cat.revenue)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sales Chart & Monthly Target Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Sales Chart */}
                    <div className="lg:col-span-2 ${styles.cardBg} ${styles.border} rounded-xl">
                        <div className={`p-6 ${styles.border} flex items-center justify-between`}>
                            <div>
                                <h3 className={`font-bold ${styles.text}`}>Revenue Analytics</h3>
                                <p className={`text-sm ${styles.textMuted}`}>Last 8 days</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 text-xs font-medium bg-[#3b82f6] text-white rounded-lg">Daily</button>
                                <button className={`px-4 py-2 text-xs font-medium ${styles.inputBg} ${styles.textMuted} rounded-lg hover:bg-gray-600 transition-colors`}>Weekly</button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="h-64 w-7/12 flex items-end gap-2">
                                {chartData.length > 0 ? chartData.map((data, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full bg-gradient-to-t from-[#3b82f6] to-[#8b5cf6] rounded-t-lg relative group cursor-pointer" style={{ height: `${(data.revenue / maxSales) * 100}%` }}>
                                            <div className={`absolute -top-8 left-1/2 -translate-x-1/2 ${styles.inputBg} ${styles.text} text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${styles.border}`}>
                                                {formatCurrency(data.revenue)}
                                            </div>
                                        </div>
                                        <span className={`text-xs ${styles.textMuted} font-medium`}>{new Date(data.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                )) : (
                                    <div className={`w-full text-center ${styles.textMuted} py-20`}>No data available</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Monthly Target */}
                    <div className={`${styles.cardBg} ${styles.border} rounded-xl p-6 flex flex-col`}>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className={`font-bold ${styles.text} text-lg`}>Monthly Target</h3>
                            <button className={`${styles.textMuted} hover:${styles.text} transition-colors`}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <circle cx="10" cy="5" r="1.5" />
                                    <circle cx="10" cy="10" r="1.5" />
                                    <circle cx="10" cy="15" r="1.5" />
                                </svg>
                            </button>
                        </div>

                        {/* Gauge Chart */}
                        <div className="relative mb-6 flex-1 flex items-center justify-center">
                            <svg viewBox="0 0 200 100" className="w-full h-28">
                                {/* Background Arc */}
                                <path
                                    d="M 20 100 A 80 80 0 0 1 180 100"
                                    fill="none"
                                    stroke="#FFEDD5"
                                    strokeWidth="16"
                                    strokeLinecap="round"
                                />
                                {/* Progress Arc */}
                                <path
                                    d="M 20 100 A 80 80 0 0 1 180 100"
                                    fill="none"
                                    stroke="#F97316"
                                    strokeWidth="16"
                                    strokeLinecap="round"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 - (251.2 * (achievement?.progress_percentage || 0) / 100)}
                                />
                            </svg>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '35%' }}>
                                <span className={`text-4xl font-bold ${styles.text}`}>
                                    {achievement?.progress_percentage > 0 ? Math.round(achievement?.progress_percentage) + '%' : '-'}
                                </span>
                                <span className="text-sm text-green-400 font-medium mt-1">
                                    {achievement?.target_achieved ? 'Target Achieved! 🎉' : 'Keep going!'}
                                </span>
                            </div>
                        </div>

                        {/* Progress Message */}
                        <div className="text-center mb-6">
                            <p className={`text-lg font-semibold ${styles.text}`}>
                                {achievement?.target_achieved ? 'Target Achieved! 🎉' : 'Great Progress!'}
                            </p>
                            <p className={`text-sm ${styles.textMuted} mt-1`}>
                                Current: {formatCurrency(achievement?.current_revenue || 0)} / {formatCurrency(achievement?.target_amount || 0)}
                            </p>
                        </div>

                        {/* Footer Metrics */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                                <p className={`text-xs ${styles.textMuted} mb-1`}>Target</p>
                                <p className={`text-lg font-bold ${styles.text}`}>{formatCurrency(achievement?.target_amount || 0)}</p>
                            </div>
                            <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                                <p className={`text-xs ${styles.textMuted} mb-1`}>Revenue</p>
                                <p className={`text-lg font-bold ${styles.text}`}>{formatCurrency(achievement?.current_revenue || 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Revenue Trend Line Chart */}
                    <div className={`${styles.cardBg} ${styles.border} rounded-xl`}>
                        <div className={`p-6 ${styles.border}`}>
                            <h3 className={`font-bold ${styles.text}`}>Revenue Trend</h3>
                            <p className={`text-sm ${styles.textMuted}`}>Last 7 days</p>
                        </div>
                        <div className="p-6">
                            <svg viewBox="0 0 300 120" className="w-full h-32">
                                <defs>
                                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,100 L0,60 L50,45 L100,55 L150,30 L200,40 L250,20 L300,35 L300,120 L0,120 Z"
                                    fill="url(#lineGradient)"
                                />
                                <path
                                    d="M0,60 L50,45 L100,55 L150,30 L200,40 L250,20 L300,35"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle cx="0" cy="60" r="3" fill="#3b82f6"/>
                                <circle cx="50" cy="45" r="3" fill="#3b82f6"/>
                                <circle cx="100" cy="55" r="3" fill="#3b82f6"/>
                                <circle cx="150" cy="30" r="3" fill="#3b82f6"/>
                                <circle cx="200" cy="40" r="3" fill="#3b82f6"/>
                                <circle cx="250" cy="20" r="3" fill="#3b82f6"/>
                                <circle cx="300" cy="35" r="3" fill="#3b82f6"/>
                            </svg>
                            <div className={`flex justify-between mt-2 text-xs ${styles.textMuted}`}>
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                                <span>Sun</span>
                            </div>
                        </div>
                    </div>

                    {/* Category Distribution Pie Chart */}
                    <div className={`${styles.cardBg} ${styles.border} rounded-xl`}>
                        <div className={`p-6 ${styles.border}`}>
                            <h3 className={`font-bold ${styles.text}`}>Category Distribution</h3>
                            <p className={`text-sm ${styles.textMuted}`}>Sales by category</p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-center gap-6">
                                <div 
                                    className="w-32 h-32 rounded-full relative"
                                    style={{
                                        background: 'conic-gradient(#3b82f6 0% 35%, #8b5cf6 35% 55%, #10b981 55% 75%, #f59e0b 75% 90%, #ef4444 90% 100%)'
                                    }}
                                >
                                    <div className={`absolute inset-4 ${styles.cardBg} rounded-full flex items-center justify-center`}>
                                        <span className={`text-sm font-bold ${styles.text}`}>Total</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                                        <span className={`text-xs ${styles.textMuted}`}>Men (35%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
                                        <span className={`text-xs ${styles.textMuted}`}>Women (20%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                                        <span className={`text-xs ${styles.textMuted}`}>Accessories (20%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                                        <span className={`text-xs ${styles.textMuted}`}>Shoes (15%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                                        <span className={`text-xs ${styles.textMuted}`}>Other (10%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Status Donut Chart */}
                    <div className={`${styles.cardBg} ${styles.border} rounded-xl`}>
                        <div className={`p-6 ${styles.border}`}>
                            <h3 className={`font-bold ${styles.text}`}>Order Status</h3>
                            <p className={`text-sm ${styles.textMuted}`}>Current status distribution</p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-center gap-6">
                                <div 
                                    className="w-32 h-32 rounded-full relative"
                                    style={{
                                        background: 'conic-gradient(#10b981 0% 45%, #3b82f6 45% 70%, #8b5cf6 70% 85%, #f59e0b 85% 100%)'
                                    }}
                                >
                                    <div className={`absolute inset-4 ${styles.cardBg} rounded-full flex items-center justify-center`}>
                                        <span className={`text-lg font-bold ${styles.text}`}>856</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                                        <span className={`text-xs ${styles.textMuted}`}>Completed (45%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                                        <span className={`text-xs ${styles.textMuted}`}>Processing (25%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
                                        <span className={`text-xs ${styles.textMuted}`}>Shipped (15%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                                        <span className={`text-xs ${styles.textMuted}`}>Pending (15%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Top Products */}
                    <div className={`${styles.cardBg} ${styles.border} rounded-xl`}>
                        <div className={`p-6 ${styles.border} flex items-center justify-between`}>
                            <h3 className={`font-bold ${styles.text}`}>Top Products</h3>
                            <Link href="/admin/products" className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                                View All →
                            </Link>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {(topProducts.length > 0 ? topProducts : [
                                    { name: 'Classic White T-Shirt', sales: 156, revenue: 7850000, image: null },
                                    { name: 'Denim Jacket', sales: 98, revenue: 15700000, image: null },
                                    { name: 'Slim Fit Jeans', sales: 87, revenue: 13050000, image: null },
                                    { name: 'Polo Shirt', sales: 76, revenue: 6080000, image: null },
                                    { name: 'Casual Sneakers', sales: 65, revenue: 16250000, image: null },
                                ]).map((product, index) => (
                                    <div key={index} className={`flex items-center gap-4 p-4 ${styles.inputBg} rounded-lg hover:bg-gray-600 transition-colors`}>
                                        <div className="w-10 h-10 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium ${styles.text} truncate`}>{product.name}</p>
                                            <p className={`text-xs ${styles.textMuted}`}>{formatNumber(product.sales)} sold</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-bold ${styles.text}`}>{formatCurrency(product.revenue)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className={`${styles.cardBg} ${styles.border} rounded-xl`}>
                        <div className={`p-6 ${styles.border} flex items-center justify-between`}>
                            <h3 className={`font-bold ${styles.text}`}>Recent Orders</h3>
                            <Link href="/admin/sales/orders" className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                                View All →
                            </Link>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {(recentOrders.length > 0 ? recentOrders : [
                                    { id: 'ORD-001', customer: 'John Doe', total: 450000, status: 'completed', date: '2024-01-15' },
                                    { id: 'ORD-002', customer: 'Jane Smith', total: 780000, status: 'processing', date: '2024-01-15' },
                                    { id: 'ORD-003', customer: 'Bob Johnson', total: 320000, status: 'pending', date: '2024-01-14' },
                                    { id: 'ORD-004', customer: 'Alice Brown', total: 1560000, status: 'completed', date: '2024-01-14' },
                                    { id: 'ORD-005', customer: 'Charlie Wilson', total: 890000, status: 'shipped', date: '2024-01-13' },
                                ]).map((order, index) => (
                                    <div key={index} className={`flex items-center gap-4 p-4 ${styles.inputBg} rounded-lg hover:bg-gray-600 transition-colors`}>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium ${styles.text}`}>{order.id}</p>
                                            <p className={`text-xs ${styles.textMuted}`}>{order.customer}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-bold ${styles.text}`}>{formatCurrency(order.total)}</p>
                                            <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                                                order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                                                order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-amber-500/20 text-amber-400'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className={`${styles.cardBg} ${styles.border} rounded-xl p-5 ${styles.hoverBorder} transition-all duration-300`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center">
                                <Activity className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className={`text-sm ${styles.textMuted}`}>Conversion Rate</p>
                                <p className={`text-2xl font-bold ${styles.text}`}>{stats?.total_orders > 0 && stats?.total_users > 0 ? ((stats?.total_orders / stats?.total_users) * 100).toFixed(1) : '0'}%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400 font-medium">Orders / Users</span>
                        </div>
                    </div>

                    <div className={`${styles.cardBg} ${styles.border} rounded-xl p-5 ${styles.hoverBorder} transition-all duration-300`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                                <p className={`text-sm ${styles.textMuted}`}>Avg Order Value</p>
                                <p className={`text-2xl font-bold ${styles.text}`}>{formatCurrency(stats?.total_orders > 0 ? stats?.total_revenue / stats?.total_orders : 0)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Target className="w-3 h-3 text-orange-400" />
                            <span className="text-xs text-orange-400 font-medium">Per order</span>
                        </div>
                    </div>
                </div>

                {/* Recent Questions */}
                <div className={`${styles.cardBg} ${styles.border} rounded-xl`}>
                    <div className={`p-6 ${styles.border} flex items-center justify-between`}>
                        <h3 className={`font-bold ${styles.text}`}>Recent Product Questions</h3>
                        <Link href="/admin/product-questions" className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                            View All →
                        </Link>
                    </div>
                    <div className="p-6">
                        {recentQuestions.length === 0 ? (
                            <div className="text-center py-8">
                                <p className={`text-sm ${styles.textMuted}`}>No questions yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentQuestions.map((question) => (
                                    <div key={question.id} className={`flex items-start gap-4 p-4 ${styles.inputBg} rounded-lg hover:bg-gray-600 transition-colors`}>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                                            {question.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className={`text-sm font-bold ${styles.text}`}>{question.user?.name}</p>
                                                <span className={`text-xs ${styles.textMuted}`}>• {question.created_at}</span>
                                            </div>
                                            <p className={`text-sm ${styles.textMuted} mb-2 truncate`}>{question.question}</p>
                                            <p className={`text-xs ${styles.textMuted}`}>
                                                Product: <span className={`font-medium ${styles.text}`}>{question.product?.name}</span>
                                            </p>
                                            {question.answer ? (
                                                <span className="inline-block mt-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                    Answered
                                                </span>
                                            ) : (
                                                <span className="inline-block mt-2 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                        <Link href={`/admin/product-questions/${question.id}`} className="text-sm text-blue-400 hover:text-blue-300 font-medium flex-shrink-0">
                                            View
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}