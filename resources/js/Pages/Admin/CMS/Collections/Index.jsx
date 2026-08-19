import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Package, ToggleLeft, ToggleRight, ChevronRight, Layout, Grid } from 'lucide-react';

export default function CollectionsIndex({ collections, pagination }) {
    const getLayoutLabel = (layoutType) => {
        const labels = {
            'product_grid': 'Product Grid',
            'featured_cards': 'Featured Cards',
            'lookbook': 'Lookbook',
            'trending': 'Trending',
            'style_guide': 'Style Guide',
            'category_highlights': 'Category Highlights',
            'bold_collection': 'Bold Collection',
            'custom_grid': 'Custom Grid',
        };
        return labels[layoutType] || null;
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this collection?')) {
            router.delete(route('admin.cms.collections.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Collections" />

            <div className="min-h-screen bg-[#0B1220]">
                {/* Breadcrumb */}
                <div className="px-8 pt-6 pb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="hover:text-gray-300 cursor-pointer">Dashboard</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="hover:text-gray-300 cursor-pointer">CMS</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-white">Collections</span>
                    </div>
                </div>

                <div className="px-8 pb-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Collections</h1>
                            <p className="text-gray-400 text-sm">Manage product collections and homepage layouts</p>
                        </div>
                        <Link
                            href={route('admin.cms.collections.create')}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F6DFF] text-white font-medium shadow-lg shadow-[#4F6DFF]/20 hover:shadow-xl hover:shadow-[#4F6DFF]/30 transition-all duration-200 text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Create Collection
                        </Link>
                    </div>

                    {/* Collections Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {collections.map((collection) => (
                            <div
                                key={collection.id}
                                className="bg-[#111827] rounded-2xl border border-white/5 overflow-hidden hover:border-[#4F6DFF]/30 hover:shadow-[0_0_30px_rgba(79,109,255,0.08)] transition-all duration-300"
                            >
                                <div className="flex h-[140px]">
                                    {/* Left: Type Indicator (30%) */}
                                    <div className="w-[30%] relative overflow-hidden bg-[#0B1220] flex items-center justify-center">
                                        {collection.layout_type ? (
                                            <Layout className="w-12 h-12 text-[#4F6DFF]" />
                                        ) : (
                                            <Package className="w-12 h-12 text-gray-700" />
                                        )}
                                        {/* Status Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-medium tracking-wide ${
                                                collection.is_active
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                            }`}>
                                                {collection.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Collection Information (70%) */}
                                    <div className="w-[70%] p-5 flex flex-col justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-white font-semibold text-base mb-1 tracking-tight truncate">{collection.name}</h3>
                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                        <span className={`${collection.type === 'dynamic' ? 'text-[#4F6DFF]' : 'text-gray-400'} font-medium`}>
                                                            {collection.type === 'dynamic' ? 'Dynamic' : 'Manual'}
                                                        </span>
                                                        {collection.layout_type && (
                                                            <>
                                                                <span className="text-gray-600">•</span>
                                                                <span className="text-[#4F6DFF] font-medium">{getLayoutLabel(collection.layout_type)}</span>
                                                            </>
                                                        )}
                                                        <span className="text-gray-600">•</span>
                                                        <span>Order {collection.sort_order}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <Link
                                                href={route('admin.cms.collections.edit', collection.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4F6DFF] text-white hover:bg-[#3d5be0] transition-all text-xs font-medium"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(collection.id)}
                                                className="p-1.5 rounded-lg bg-[#0B1220] text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/5"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {collections.length === 0 && (
                        <div className="text-center py-20">
                            <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-500 text-sm">No collections found. Create your first collection!</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
