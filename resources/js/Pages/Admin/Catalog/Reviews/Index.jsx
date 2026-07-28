import { Link } from '@inertiajs/react';
import { useTheme } from '../../../../Context/ThemeContext';

export default function ReviewsIndex({ reviews, filters, pagination }) {
    const { theme } = useTheme();

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <svg
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'approved':
                return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Approved</span>;
            case 'pending':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">Pending</span>;
            case 'hidden':
                return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">Hidden</span>;
            case 'deleted':
                return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Deleted</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">{status}</span>;
        }
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#08111F]' : 'bg-[#F8FAFC]'}`}>
            {/* Header */}
            <div className="px-8 py-6">
                <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'}`}>
                    Product Reviews
                </h1>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                    Manage and moderate customer reviews
                </p>
            </div>

            {/* Filters */}
            <div className={`px-8 pb-6`}>
                <div className={`flex gap-4 items-center ${theme === 'dark' ? 'bg-[#101827]' : 'bg-white'} rounded-xl p-4 shadow-sm`}>
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search reviews..."
                            defaultValue={filters.search}
                            className={`w-full px-4 py-2 rounded-lg border ${
                                theme === 'dark'
                                    ? 'bg-[#0C1524] border-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8]'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                            }`}
                        />
                    </div>
                    <select
                        defaultValue={filters.status}
                        className={`px-4 py-2 rounded-lg border ${
                            theme === 'dark'
                                ? 'bg-[#0C1524] border-[#1E293B] text-[#F8FAFC]'
                                : 'bg-gray-50 border-gray-200 text-gray-900'
                        }`}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="hidden">Hidden</option>
                    </select>
                </div>
            </div>

            {/* Reviews Table */}
            <div className="px-8 pb-8">
                {reviews.length === 0 ? (
                    <div className={`text-center py-12 ${theme === 'dark' ? 'bg-[#101827]' : 'bg-white'} rounded-xl shadow-sm`}>
                        <p className={theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'}>
                            No reviews found
                        </p>
                    </div>
                ) : (
                    <div className={`rounded-xl shadow-sm overflow-hidden ${theme === 'dark' ? 'bg-[#101827]' : 'bg-white'}`}>
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b ${theme === 'dark' ? 'border-[#1E293B]' : 'border-gray-200'}`}>
                                    <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'}`}>
                                        Product
                                    </th>
                                    <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'}`}>
                                        Customer
                                    </th>
                                    <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'}`}>
                                        Rating
                                    </th>
                                    <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'}`}>
                                        Comment
                                    </th>
                                    <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'}`}>
                                        Status
                                    </th>
                                    <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'}`}>
                                        Date
                                    </th>
                                    <th className={`text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'}`}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map(review => (
                                    <tr key={review.id} className={`border-b ${theme === 'dark' ? 'border-[#1E293B]' : 'border-gray-100'} hover:${theme === 'dark' ? 'bg-[#17243B]' : 'bg-gray-50'}`}>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/products/${review.product.id}`}
                                                className={`font-semibold ${theme === 'dark' ? 'text-[#F8FAFC] hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'}`}
                                            >
                                                {review.product.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'}>
                                                {review.user.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                {renderStars(review.rating)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <p className={`text-sm truncate ${theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
                                                {review.comment}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(review.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm ${theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {review.status === 'pending' && (
                                                    <form
                                                        method="POST"
                                                        action={`/admin/catalog/reviews/${review.id}/approve`}
                                                        className="inline"
                                                    >
                                                        <button
                                                            type="submit"
                                                            className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                    </form>
                                                )}
                                                {review.status === 'approved' && (
                                                    <form
                                                        method="POST"
                                                        action={`/admin/catalog/reviews/${review.id}/hide`}
                                                        className="inline"
                                                    >
                                                        <button
                                                            type="submit"
                                                            className="px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                                                        >
                                                            Hide
                                                        </button>
                                                    </form>
                                                )}
                                                <form
                                                    method="POST"
                                                    action={`/admin/catalog/reviews/${review.id}`}
                                                    className="inline"
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        if (confirm('Are you sure you want to delete this review?')) {
                                                            e.target.submit();
                                                        }
                                                    }}
                                                >
                                                    <input type="hidden" name="_method" value="DELETE" />
                                                    <button
                                                        type="submit"
                                                        className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {pagination.last_page > 1 && (
                            <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-[#1E293B]' : 'border-gray-200'} flex items-center justify-between`}>
                                <p className={`text-sm ${theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                                    Showing {pagination.from} to {pagination.to} of {pagination.total} reviews
                                </p>
                                <div className="flex gap-2">
                                    {pagination.current_page > 1 && (
                                        <Link
                                            href={`?page=${pagination.current_page - 1}`}
                                            className={`px-3 py-1 rounded-lg text-sm ${theme === 'dark' ? 'bg-[#0C1524] text-[#F8FAFC] hover:bg-[#17243B]' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    <span className={`px-3 py-1 rounded-lg text-sm ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`}>
                                        {pagination.current_page}
                                    </span>
                                    {pagination.current_page < pagination.last_page && (
                                        <Link
                                            href={`?page=${pagination.current_page + 1}`}
                                            className={`px-3 py-1 rounded-lg text-sm ${theme === 'dark' ? 'bg-[#0C1524] text-[#F8FAFC] hover:bg-[#17243B]' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
