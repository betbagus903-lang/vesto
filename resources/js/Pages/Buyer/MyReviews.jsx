import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AccountSidebar from '../../Components/Buyer/AccountSidebar';

export default function MyReviews({ reviews }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <svg
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'approved':
                return <span className="text-green-400 text-xs">Approved</span>;
            case 'pending':
                return <span className="text-yellow-400 text-xs">Pending</span>;
            case 'hidden':
                return <span className="text-gray-400 text-xs">Hidden</span>;
            default:
                return <span className="text-gray-400 text-xs">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen flex bg-[#0f172a]" style={{fontFamily: "'Inter', sans-serif"}}>
            <AccountSidebar activeMenu="reviews" />

            {/* Main content */}
            <div className="ml-72 flex-1 min-h-screen">
                <div className="px-6 py-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-xl font-semibold text-white">
                            Your Reviews
                        </h1>
                    </div>

                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                        <div className="bg-[#1e293b] rounded-lg p-8 text-center">
                            <p className="text-white mb-2">No reviews yet</p>
                            <p className="text-sm text-gray-400 mb-4">You haven't reviewed any products yet.</p>
                            <Link href="/shop" className="text-sm text-gray-400 hover:text-white transition-colors">
                                Start Shopping →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {reviews.map(review => (
                                <div key={review.id} className="bg-[#1e293b] rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-0.5">
                                                {renderStars(review.rating)}
                                            </div>
                                            {getStatusBadge(review.status)}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="mb-2">
                                        <Link href={`/products/${review.product.slug}`} className="text-sm text-white hover:text-gray-300 transition-colors">
                                            {review.product.name}
                                        </Link>
                                        {review.title && (
                                            <h3 className="text-xs text-gray-400 mt-0.5">{review.title}</h3>
                                        )}
                                    </div>

                                    <p className="text-xs text-gray-400 mb-3">{review.comment}</p>

                                    <div className="pt-3 border-t border-gray-700">
                                        <p className="text-xs text-gray-500">
                                            Order: <span className="text-gray-400">{review.order.order_number}</span>
                                        </p>
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
