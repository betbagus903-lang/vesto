import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useBuyerTheme } from '../../Context/BuyerThemeContext';
import AccountSidebar from '../../Components/Buyer/AccountSidebar';
import { Moon, Sun, Menu, X, Star, MessageSquare, ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function Reviews() {
    const { auth, reviews } = usePage().props;
    const { theme, toggleTheme } = useBuyerTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const themeStyles = {
        dark: {
            bg: 'bg-[#0a0f1a]',
            headerBg: 'bg-[#0a1628]',
            border: 'border-white/10',
            text: 'text-white',
            textMuted: 'text-white/60',
            textMutedLight: 'text-white/40',
            cardBg: 'bg-white/5',
            cardBgLight: 'bg-white/8',
            hoverBg: 'hover:bg-white/10',
            inputBg: 'bg-[#0d1b2a]',
            inputBorder: 'border-white/10',
            inputFocus: 'focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20',
            primary: 'bg-blue-600 hover:bg-blue-700',
            primaryText: 'text-white',
            starFilled: 'text-yellow-400',
            starEmpty: 'text-white/20',
        },
        light: {
            bg: 'bg-gray-50',
            headerBg: 'bg-white',
            border: 'border-gray-200',
            text: 'text-gray-900',
            textMuted: 'text-gray-600',
            textMutedLight: 'text-gray-400',
            cardBg: 'bg-white',
            cardBgLight: 'bg-gray-50',
            hoverBg: 'hover:bg-gray-100',
            inputBg: 'bg-white',
            inputBorder: 'border-gray-300',
            inputFocus: 'focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20',
            primary: 'bg-blue-600 hover:bg-blue-700',
            primaryText: 'text-white',
            starFilled: 'text-yellow-400',
            starEmpty: 'text-gray-300',
        },
    };

    const styles = themeStyles[theme];

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
                <AccountSidebar activeMenu="reviews" />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <AccountSidebar activeMenu="reviews" />
            </div>

            {/* Main content */}
            <div className="flex-1 min-h-screen transition-all duration-300 lg:ml-72 ml-0">
                {/* Top Header */}
                <div className={`${styles.headerBg} border-b ${styles.border} px-4 md:px-6 py-5 sticky top-0 z-40`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className={`lg:hidden p-2 ${styles.hoverBg} rounded-lg transition-colors`}
                            >
                                {sidebarOpen ? <X className={`w-5 h-5 ${styles.text}`} /> : <Menu className={`w-5 h-5 ${styles.text}`} />}
                            </button>
                            <div>
                                <h1 className={`text-xl md:text-2xl font-semibold ${styles.text}`}>
                                    My Reviews
                                </h1>
                                <p className={`text-sm ${styles.textMuted} mt-0.5 hidden sm:block`}>
                                    Manage your product reviews
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

                <div className="px-4 md:px-8 py-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className={`${styles.cardBg} ${styles.border} rounded-xl p-5`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${styles.cardBgLight} rounded-lg flex items-center justify-center`}>
                                    <MessageSquare className={`w-5 h-5 ${styles.textMuted}`} />
                                </div>
                                <div>
                                    <h4 className={`text-2xl font-semibold ${styles.text}`}>{reviews?.length || 0}</h4>
                                    <p className={`text-xs ${styles.textMuted} mt-0.5`}>Total Reviews</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.cardBg} ${styles.border} rounded-xl p-5`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${styles.cardBgLight} rounded-lg flex items-center justify-center`}>
                                    <Star className={`w-5 h-5 ${styles.starFilled}`} />
                                </div>
                                <div>
                                    <h4 className={`text-2xl font-semibold ${styles.text}`}>
                                        {reviews?.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                                    </h4>
                                    <p className={`text-xs ${styles.textMuted} mt-0.5`}>Average Rating</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.cardBg} ${styles.border} rounded-xl p-5`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${styles.cardBgLight} rounded-lg flex items-center justify-center`}>
                                    <ShoppingBag className={`w-5 h-5 ${styles.textMuted}`} />
                                </div>
                                <div>
                                    <h4 className={`text-2xl font-semibold ${styles.text}`}>
                                        {reviews?.filter(r => r.status === 'approved').length || 0}
                                    </h4>
                                    <p className={`text-xs ${styles.textMuted} mt-0.5`}>Published</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="mb-6">
                        <h2 className={`text-lg font-semibold ${styles.text}`}>Your Reviews</h2>
                        <p className={`text-sm ${styles.textMuted} mt-1`}>All your product reviews and ratings</p>
                    </div>

                    {!reviews || reviews.length === 0 ? (
                        <div className={`${styles.cardBg} ${styles.border} rounded-xl p-12 text-center`}>
                            <div className={`w-16 h-16 ${styles.cardBgLight} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <MessageSquare className={`w-8 h-8 ${styles.textMuted}`} />
                            </div>
                            <h3 className={`text-lg font-medium ${styles.text} mb-2`}>No reviews yet</h3>
                            <p className={`text-sm ${styles.textMuted} mb-6 max-w-md mx-auto`}>
                                You haven't written any product reviews. Start shopping and share your experience with others!
                            </p>
                            <Link
                                href="/shop"
                                className={`inline-flex items-center gap-2 ${styles.primary} ${styles.primaryText} text-sm font-medium px-6 py-3 rounded-lg transition-colors`}
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review.id} className={`${styles.cardBg} ${styles.border} rounded-xl p-6`}>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <div className={`w-20 h-20 ${styles.cardBgLight} rounded-lg overflow-hidden`}>
                                                {review.product?.image ? (
                                                    <img
                                                        src={review.product.image.startsWith('http') ? review.product.image : `/storage/${review.product.image}`}
                                                        alt={review.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingBag className={`w-8 h-8 ${styles.textMuted}`} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Review Content */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <Link
                                                        href={`/products/${review.product?.id}`}
                                                        className={`text-sm font-medium ${styles.text} hover:opacity-80 transition-opacity`}
                                                    >
                                                        {review.product?.name || 'Product'}
                                                    </Link>
                                                    {review.variant && (
                                                        <span className={`text-xs ${styles.textMuted} ml-2`}>
                                                            · {review.variant.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {review.status === 'approved' ? (
                                                        <span className="flex items-center gap-1 text-xs text-green-500">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Published
                                                        </span>
                                                    ) : review.status === 'pending' ? (
                                                        <span className="flex items-center gap-1 text-xs text-yellow-500">
                                                            <Clock className="w-3 h-3" />
                                                            Pending
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-xs text-red-500">
                                                            <XCircle className="w-3 h-3" />
                                                            Rejected
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1 mb-3">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= review.rating ? styles.starFilled : styles.starEmpty}`}
                                                        fill={star <= review.rating ? 'currentColor' : 'none'}
                                                    />
                                                ))}
                                                <span className={`text-xs ${styles.textMuted} ml-2`}>{review.rating}/5</span>
                                            </div>

                                            {/* Review Title */}
                                            {review.title && (
                                                <h4 className={`text-sm font-medium ${styles.text} mb-2`}>{review.title}</h4>
                                            )}

                                            {/* Review Comment */}
                                            {review.comment && (
                                                <p className={`text-sm ${styles.textMuted} mb-3`}>{review.comment}</p>
                                            )}

                                            {/* Review Images */}
                                            {review.images && review.images.length > 0 && (
                                                <div className="flex gap-2 mb-3">
                                                    {review.images.map((image, index) => (
                                                        <img
                                                            key={index}
                                                            src={image.startsWith('http') ? image : `/storage/${image}`}
                                                            alt="Review image"
                                                            className="w-16 h-16 rounded-lg object-cover"
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Review Date */}
                                            <div className={`text-xs ${styles.textMutedLight} flex items-center gap-1`}>
                                                <Clock className="w-3 h-3" />
                                                {review.created_at}
                                            </div>
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