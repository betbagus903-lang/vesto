import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2, Package, ToggleLeft, ToggleRight } from 'lucide-react';

export default function CollectionsIndex({ collections, pagination }) {
    return (
        <AdminLayout>
            <Head title="Collections" />

            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Collections</h1>
                        <p className="text-gray-400">Manage product collections with rule-based filtering</p>
                    </div>
                    <Link
                        href={route('admin.cms.collections.create')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Create Collection
                    </Link>
                </div>

                {/* Collections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((collection) => (
                        <div
                            key={collection.id}
                            className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl hover:border-gray-600 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                        <Package className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{collection.name}</h3>
                                        <p className="text-gray-400 text-sm">{collection.type === 'dynamic' ? 'Dynamic' : 'Manual'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {collection.is_active ? (
                                        <ToggleRight className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <ToggleLeft className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>
                            </div>

                            {collection.description && (
                                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{collection.description}</p>
                            )}

                            <div className="flex items-center justify-between text-sm mb-4">
                                <span className="text-gray-400">
                                    {collection.rules_count || 0} rules
                                </span>
                                <span className="text-gray-400">
                                    {collection.banners_count || 0} banners
                                </span>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-gray-700">
                                <Link
                                    href={route('admin.cms.collections.edit', collection.id)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </Link>
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this collection?')) {
                                            // Handle delete
                                        }
                                    }}
                                    className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {collections.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No collections yet</h3>
                        <p className="text-gray-400 mb-6">Create your first collection to get started</p>
                        <Link
                            href={route('admin.cms.collections.create')}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Create Collection
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {pagination.total > pagination.per_page && (
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
                        <p className="text-gray-400 text-sm">
                            Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                            {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                            {pagination.total} collections
                        </p>
                        <div className="flex items-center gap-2">
                            {pagination.current_page > 1 && (
                                <Link
                                    href={route('admin.cms.collections.index', { page: pagination.current_page - 1 })}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    Previous
                                </Link>
                            )}
                            {pagination.current_page < pagination.last_page && (
                                <Link
                                    href={route('admin.cms.collections.index', { page: pagination.current_page + 1 })}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
