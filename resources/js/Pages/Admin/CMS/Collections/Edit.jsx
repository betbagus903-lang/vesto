import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ChevronLeft, Save, Plus, Trash2, Package, Eye, ChevronRight, Upload, Sparkles, Grid3X3, LayoutGrid, Calendar, TrendingUp, Palette, Image as ImageIcon, X, Play, ArrowRight, Check } from 'lucide-react';

export default function CollectionEdit({ collection }) {
    const { data, setData, put, processing, errors } = useForm({
        name: collection.name,
        description: collection.description || '',
        type: collection.type,
        is_active: collection.is_active,
        sort_order: collection.sort_order,
        rules: collection.rules?.map((rule, index) => ({
            id: rule.id,
            field: rule.field,
            operator: rule.operator,
            value: rule.value,
            logical_operator: rule.logical_operator,
            sort_order: rule.sort_order,
        })) || [],
        layout_type: collection.layout_type || '',
        content: typeof collection.content === 'object' ? JSON.stringify(collection.content, null, 2) : collection.content || '',
        background_color: collection.background_color || '#ffffff',
        start_date: collection.start_date ? collection.start_date.slice(0, 16) : '',
        end_date: collection.end_date ? collection.end_date.slice(0, 16) : '',
        cover_image: collection.cover_image || '',
        badge: collection.badge || '',
        color_theme: collection.color_theme || '#4F6BFF',
        visibility: collection.visibility || 'homepage',
        publish_status: collection.publish_status || 'draft',
    });

    const [previewCount, setPreviewCount] = useState(0);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [coverImagePreview, setCoverImagePreview] = useState(collection.cover_image || null);
    const [selectedLayout, setSelectedLayout] = useState(collection.layout_type || 'grid');

    const ruleFields = [
        { value: 'category', label: 'Category', type: 'select' },
        { value: 'product_type', label: 'Product Type', type: 'select' },
        { value: 'brand', label: 'Brand', type: 'select' },
        { value: 'price', label: 'Price', type: 'number' },
        { value: 'discount', label: 'Discount %', type: 'number' },
        { value: 'stock', label: 'Stock', type: 'number' },
        { value: 'status', label: 'Status', type: 'select' },
        { value: 'created_date', label: 'Created Date', type: 'date' },
    ];

    const operators = [
        { value: '=', label: 'Equals' },
        { value: '!=', label: 'Not Equals' },
        { value: '>', label: 'Greater Than' },
        { value: '<', label: 'Less Than' },
        { value: '>=', label: 'Greater Than or Equal' },
        { value: '<=', label: 'Less Than or Equal' },
        { value: 'contains', label: 'Contains' },
        { value: 'in', label: 'In' },
    ];

    const colorThemes = [
        { name: 'Royal Blue', value: '#4F6BFF' },
        { name: 'Emerald', value: '#10B981' },
        { name: 'Rose', value: '#F43F5E' },
        { name: 'Amber', value: '#F59E0B' },
        { name: 'Violet', value: '#8B5CF6' },
        { name: 'Slate', value: '#64748B' },
        { name: 'Coral', value: '#FF6B6B' },
        { name: 'Teal', value: '#14B8A6' },
    ];

    const badges = [
        { name: 'New', value: 'new' },
        { name: 'Summer', value: 'summer' },
        { name: 'Trending', value: 'trending' },
        { name: 'Limited', value: 'limited' },
        { name: 'Luxury', value: 'luxury' },
        { name: 'Exclusive', value: 'exclusive' },
    ];

    const layoutOptions = [
        { id: 'grid', name: 'Product Grid', icon: Grid3X3, description: 'Classic grid layout' },
        { id: 'carousel', name: 'Carousel', icon: LayoutGrid, description: 'Horizontal scroll' },
        { id: 'hero', name: 'Hero Banner', icon: ImageIcon, description: 'Full-width hero' },
        { id: 'masonry', name: 'Masonry', icon: TrendingUp, description: 'Pinterest-style' },
    ];

    const visibilityOptions = [
        { name: 'Homepage', value: 'homepage' },
        { name: 'Category Page', value: 'category' },
        { name: 'Search Results', value: 'search' },
        { name: 'Featured', value: 'featured' },
    ];

    const publishStatuses = [
        { name: 'Draft', value: 'draft' },
        { name: 'Scheduled', value: 'scheduled' },
        { name: 'Published', value: 'published' },
    ];

    const addRule = () => {
        setData('rules', [
            ...data.rules,
            {
                id: Date.now(),
                field: 'category',
                operator: '=',
                value: '',
                logical_operator: 'AND',
                sort_order: data.rules.length,
            },
        ]);
    };

    const removeRule = (ruleId) => {
        setData('rules', data.rules.filter((rule) => rule.id !== ruleId));
    };

    const updateRule = (ruleId, field, value) => {
        setData(
            'rules',
            data.rules.map((rule) =>
                rule.id === ruleId ? { ...rule, [field]: value } : rule
            )
        );
    };

    const previewRules = async () => {
        setPreviewLoading(true);
        try {
            const response = await fetch(route('admin.cms.collections.preview'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rules: data.rules }),
            });
            const result = await response.json();
            setPreviewCount(result.count);
        } catch (error) {
            console.error('Failed to preview rules:', error);
        } finally {
            setPreviewLoading(false);
        }
    };

    useEffect(() => {
        if (data.rules.length > 0) {
            previewRules();
        } else {
            setPreviewCount(0);
        }
    }, [data.rules]);

    const handleCoverImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImagePreview(reader.result);
                setData('cover_image', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleQuickDate = (type) => {
        const now = new Date();
        const start = new Date();
        const end = new Date();

        switch (type) {
            case 'today':
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'tomorrow':
                start.setDate(start.getDate() + 1);
                start.setHours(0, 0, 0, 0);
                end.setDate(end.getDate() + 1);
                end.setHours(23, 59, 59, 999);
                break;
            case 'next_week':
                start.setDate(start.getDate() + 7);
                start.setHours(0, 0, 0, 0);
                end.setDate(end.getDate() + 14);
                end.setHours(23, 59, 59, 999);
                break;
            case 'no_expiration':
                start.setHours(0, 0, 0, 0);
                end.setFullYear(2099);
                break;
        }

        setData('start_date', start.toISOString().slice(0, 16));
        setData('end_date', end.toISOString().slice(0, 16));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.name) {
            alert('Please enter a collection name');
            return;
        }
        if (data.type === 'dynamic' && data.rules.length === 0) {
            alert('Please add at least one rule for dynamic collections');
            return;
        }

        put(route('admin.cms.collections.update', collection.id));
    };

    return (
        <AdminLayout>
            <Head title="Edit Collection" />

            <div className="min-h-screen bg-[#0B1220]">
                {/* Top Header */}
                <div className="sticky top-0 z-50 bg-[#0B1220]/80 backdrop-blur-xl border-b border-white/5">
                    <div className="max-w-[1800px] mx-auto px-8 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <Link
                                    href={route('admin.cms.collections.index')}
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                                        <ChevronLeft className="w-4 h-4" />
                                    </div>
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-semibold text-white tracking-tight">Edit Collection</h1>
                                    <p className="text-gray-500 text-sm mt-0.5">Edit {collection.name} collection</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all text-sm font-medium border border-white/5"
                                >
                                    Save Draft
                                </button>
                                <button
                                    type="button"
                                    className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all text-sm font-medium border border-white/5 flex items-center gap-2"
                                >
                                    <Play className="w-4 h-4" />
                                    Preview
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 rounded-xl bg-[#4F6BFF] text-white font-medium shadow-lg shadow-[#4F6BFF]/25 hover:shadow-xl hover:shadow-[#4F6BFF]/35 transition-all text-sm disabled:opacity-50 flex items-center gap-2"
                                >
                                    {processing ? 'Updating...' : 'Update Collection'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1800px] mx-auto px-8 py-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Column - 65% */}
                            <div className="lg:col-span-8 space-y-8">
                                {/* Collection Information Card */}
                                <div className="bg-[#111827]/50 backdrop-blur-sm rounded-[22px] border border-white/5 p-8 shadow-2xl">
                                    <h2 className="text-lg font-semibold text-white mb-8 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#4F6BFF]/10 flex items-center justify-center">
                                            <ImageIcon className="w-5 h-5 text-[#4F6BFF]" />
                                        </div>
                                        Collection Information
                                    </h2>

                                    {/* Cover Image Upload */}
                                    <div className="mb-8">
                                        <label className="block text-sm font-medium text-gray-300 mb-3">Collection Cover Image</label>
                                        <div className="relative group">
                                            {coverImagePreview ? (
                                                <div className="relative h-64 rounded-2xl overflow-hidden border-2 border-white/10">
                                                    <img src={coverImagePreview} alt="Cover" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => { setCoverImagePreview(null); setData('cover_image', ''); }}
                                                        className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="h-64 rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#4F6BFF]/30 transition-all cursor-pointer">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleCoverImageUpload}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    <div className="h-full flex flex-col items-center justify-center">
                                                        <div className="w-16 h-16 rounded-2xl bg-[#4F6BFF]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                            <Upload className="w-8 h-8 text-[#4F6BFF]" />
                                                        </div>
                                                        <p className="text-white font-medium mb-1">Upload Cover Image</p>
                                                        <p className="text-gray-500 text-sm">Recommended: 1600 x 800</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Collection Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                                Collection Name <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full bg-[#0B1220] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#4F6BFF]/30 transition-all text-base"
                                                placeholder="Summer Collection 2024"
                                            />
                                            {errors.name && <p className="text-red-400 text-sm mt-2">{errors.name}</p>}
                                        </div>

                                        {/* Collection Badge */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-3">Collection Badge</label>
                                            <div className="flex flex-wrap gap-2">
                                                {badges.map((badge) => (
                                                    <button
                                                        key={badge.value}
                                                        type="button"
                                                        onClick={() => setData('badge', data.badge === badge.value ? '' : badge.value)}
                                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                            data.badge === badge.value
                                                                ? 'bg-[#4F6BFF] text-white shadow-lg shadow-[#4F6BFF]/25'
                                                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                                                        }`}
                                                    >
                                                        {badge.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-300 mb-3">Description</label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full bg-[#0B1220] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#4F6BFF]/30 transition-all resize-none text-base"
                                            rows={4}
                                            placeholder="Describe this collection..."
                                        />
                                        {errors.description && <p className="text-red-400 text-sm mt-2">{errors.description}</p>}
                                    </div>

                                    {/* Color Theme Picker */}
                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-300 mb-3">Color Theme</label>
                                        <div className="flex flex-wrap gap-3">
                                            {colorThemes.map((theme) => (
                                                <button
                                                    key={theme.value}
                                                    type="button"
                                                    onClick={() => setData('color_theme', theme.value)}
                                                    className={`relative group transition-all ${
                                                        data.color_theme === theme.value ? 'scale-110' : 'hover:scale-105'
                                                    }`}
                                                >
                                                    <div
                                                        className="w-12 h-12 rounded-2xl shadow-lg transition-all"
                                                        style={{ backgroundColor: theme.value }}
                                                    />
                                                    {data.color_theme === theme.value && (
                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#4F6BFF] rounded-full flex items-center justify-center">
                                                            <Check className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 whitespace-nowrap">
                                                        {theme.name}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Visual Rule Builder */}
                                <div className="bg-[#111827]/50 backdrop-blur-sm rounded-[22px] border border-white/5 p-8 shadow-2xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-lg font-semibold text-white flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#4F6BFF]/10 flex items-center justify-center">
                                                <Sparkles className="w-5 h-5 text-[#4F6BFF]" />
                                            </div>
                                            Rule Builder
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={addRule}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F6BFF] hover:bg-[#3d5be0] text-white transition-all text-sm font-medium shadow-lg shadow-[#4F6BFF]/25"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Rule
                                        </button>
                                    </div>

                                    {data.rules.length === 0 ? (
                                        <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                                            <div className="w-20 h-20 rounded-2xl bg-[#4F6BFF]/10 flex items-center justify-center mx-auto mb-6">
                                                <Sparkles className="w-10 h-10 text-[#4F6BFF]" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-white mb-2">No Rules Yet</h3>
                                            <p className="text-gray-500 mb-6">Create dynamic rules to automatically organize your products</p>
                                            <button
                                                type="button"
                                                onClick={addRule}
                                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 font-medium"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add First Rule
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {data.rules.map((rule, index) => (
                                                <div
                                                    key={rule.id}
                                                    className="bg-[#0B1220] rounded-2xl p-5 border border-white/10 hover:border-[#4F6BFF]/20 transition-all group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {index > 0 && (
                                                            <select
                                                                value={rule.logical_operator}
                                                                onChange={(e) => updateRule(rule.id, 'logical_operator', e.target.value)}
                                                                className="bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:outline-none focus:border-[#4F6BFF]/30"
                                                            >
                                                                <option value="AND">AND</option>
                                                                <option value="OR">OR</option>
                                                            </select>
                                                        )}
                                                        <div className="flex-1 flex items-center gap-3">
                                                            <span className="text-gray-400 text-sm font-medium">IF</span>
                                                            <select
                                                                value={rule.field}
                                                                onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
                                                                className="bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:outline-none focus:border-[#4F6BFF]/30"
                                                            >
                                                                {ruleFields.map((field) => (
                                                                    <option key={field.value} value={field.value}>
                                                                        {field.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <select
                                                                value={rule.operator}
                                                                onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
                                                                className="bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:outline-none focus:border-[#4F6BFF]/30"
                                                            >
                                                                {operators.map((op) => (
                                                                    <option key={op.value} value={op.value}>
                                                                        {op.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <input
                                                                type="text"
                                                                value={rule.value}
                                                                onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                                                                className="flex-1 bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-medium placeholder-gray-500 focus:outline-none focus:border-[#4F6BFF]/30"
                                                                placeholder="Value"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeRule(rule.id)}
                                                            className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Live Product Preview */}
                                {data.type === 'dynamic' && (
                                    <div className="bg-[#111827]/50 backdrop-blur-sm rounded-[22px] border border-white/5 p-8 shadow-2xl">
                                        <h2 className="text-lg font-semibold text-white mb-8 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#4F6BFF]/10 flex items-center justify-center">
                                                <Eye className="w-5 h-5 text-[#4F6BFF]" />
                                            </div>
                                            Matching Products
                                        </h2>
                                        <div className="text-center py-8">
                                            {previewLoading ? (
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="w-8 h-8 rounded-full border-2 border-[#4F6BFF] border-t-transparent animate-spin" />
                                                    <p className="text-gray-400">Loading products...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-5xl font-bold text-white mb-3">{previewCount}</p>
                                                    <p className="text-gray-400">Products match these rules</p>
                                                    {previewCount > 0 && (
                                                        <div className="mt-6 grid grid-cols-4 gap-4">
                                                            {[...Array(Math.min(4, previewCount))].map((_, i) => (
                                                                <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/10 animate-pulse" />
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - 35% */}
                            <div className="lg:col-span-4 space-y-8">
                                {/* Collection Settings */}
                                <div className="bg-[#111827]/50 backdrop-blur-sm rounded-[22px] border border-white/5 p-6 shadow-2xl">
                                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#4F6BFF]/10 flex items-center justify-center">
                                            <Grid3X3 className="w-5 h-5 text-[#4F6BFF]" />
                                        </div>
                                        Collection Settings
                                    </h2>

                                    {/* Publish Status */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-300 mb-3">Publish Status</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {publishStatuses.map((status) => (
                                                <button
                                                    key={status.value}
                                                    type="button"
                                                    onClick={() => setData('publish_status', status.value)}
                                                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                                        data.publish_status === status.value
                                                            ? 'bg-[#4F6BFF] text-white shadow-lg shadow-[#4F6BFF]/25'
                                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                                                    }`}
                                                >
                                                    {status.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Visibility */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-300 mb-3">Visibility</label>
                                        <div className="space-y-2">
                                            {visibilityOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => setData('visibility', option.value)}
                                                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                                                        data.visibility === option.value
                                                            ? 'bg-[#4F6BFF]/10 text-[#4F6BFF] border border-[#4F6BFF]/30'
                                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                                                    }`}
                                                >
                                                    {option.name}
                                                    {data.visibility === option.value && <Check className="w-4 h-4" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sort Priority Slider */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-3">Sort Priority</label>
                                        <div className="bg-[#0B1220] rounded-2xl p-5 border border-white/10">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={data.sort_order}
                                                onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#4F6BFF]"
                                            />
                                            <div className="flex justify-between mt-3 text-sm">
                                                <span className="text-gray-500">Low</span>
                                                <span className="text-white font-medium">{data.sort_order}</span>
                                                <span className="text-gray-500">High</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Collection Schedule */}
                                <div className="bg-[#111827]/50 backdrop-blur-sm rounded-[22px] border border-white/5 p-6 shadow-2xl">
                                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#4F6BFF]/10 flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-[#4F6BFF]" />
                                        </div>
                                        Schedule
                                    </h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                                            <input
                                                type="datetime-local"
                                                value={data.start_date}
                                                onChange={(e) => setData('start_date', e.target.value)}
                                                className="w-full bg-[#0B1220] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4F6BFF]/30 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                                            <input
                                                type="datetime-local"
                                                value={data.end_date}
                                                onChange={(e) => setData('end_date', e.target.value)}
                                                className="w-full bg-[#0B1220] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4F6BFF]/30 transition-all"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => handleQuickDate('today')}
                                                className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white text-xs font-medium transition-all border border-white/5"
                                            >
                                                Today
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleQuickDate('tomorrow')}
                                                className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white text-xs font-medium transition-all border border-white/5"
                                            >
                                                Tomorrow
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleQuickDate('next_week')}
                                                className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white text-xs font-medium transition-all border border-white/5"
                                            >
                                                Next Week
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleQuickDate('no_expiration')}
                                                className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white text-xs font-medium transition-all border border-white/5"
                                            >
                                                No Expiration
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Homepage Layout */}
                                <div className="bg-[#111827]/50 backdrop-blur-sm rounded-[22px] border border-white/5 p-6 shadow-2xl">
                                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#4F6BFF]/10 flex items-center justify-center">
                                            <LayoutGrid className="w-5 h-5 text-[#4F6BFF]" />
                                        </div>
                                        Homepage Layout
                                    </h2>

                                    <div className="grid grid-cols-2 gap-3">
                                        {layoutOptions.map((layout) => {
                                            const Icon = layout.icon;
                                            return (
                                                <button
                                                    key={layout.id}
                                                    type="button"
                                                    onClick={() => { setSelectedLayout(layout.id); setData('layout_type', layout.id); }}
                                                    className={`p-4 rounded-xl border transition-all text-left ${
                                                        selectedLayout === layout.id
                                                            ? 'bg-[#4F6BFF]/10 border-[#4F6BFF]/30'
                                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                    }`}
                                                >
                                                    <Icon className={`w-6 h-6 mb-2 ${selectedLayout === layout.id ? 'text-[#4F6BFF]' : 'text-gray-400'}`} />
                                                    <p className={`text-sm font-medium ${selectedLayout === layout.id ? 'text-white' : 'text-gray-400'}`}>
                                                        {layout.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">{layout.description}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Analytics Preview */}
                                <div className="bg-[#111827]/50 backdrop-blur-sm rounded-[22px] border border-white/5 p-6 shadow-2xl">
                                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#4F6BFF]/10 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-[#4F6BFF]" />
                                        </div>
                                        Analytics Preview
                                    </h2>

                                    <div className="space-y-4">
                                        <div className="bg-[#0B1220] rounded-xl p-4 border border-white/10">
                                            <p className="text-gray-500 text-sm mb-1">Estimated Products</p>
                                            <p className="text-2xl font-bold text-white">{previewCount}</p>
                                        </div>
                                        <div className="bg-[#0B1220] rounded-xl p-4 border border-white/10">
                                            <p className="text-gray-500 text-sm mb-1">Homepage Position</p>
                                            <p className="text-2xl font-bold text-white">{data.sort_order}</p>
                                        </div>
                                        <div className="bg-[#0B1220] rounded-xl p-4 border border-white/10">
                                            <p className="text-gray-500 text-sm mb-1">Expected Click Rate</p>
                                            <p className="text-2xl font-bold text-[#4F6BFF]">+{Math.round(previewCount * 0.15)}%</p>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Suggestions */}
                                <div className="bg-gradient-to-br from-[#4F6BFF]/10 to-[#4F6BFF]/5 backdrop-blur-sm rounded-[22px] border border-[#4F6BFF]/20 p-6 shadow-2xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#4F6BFF]/20 flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-[#4F6BFF]" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-white">AI Suggestions</h2>
                                    </div>

                                    <div className="space-y-3 mb-5">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Recommended Banner Color</span>
                                            <span className="text-white font-medium">Beige</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Homepage Position</span>
                                            <span className="text-white font-medium">Top Section</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Expected CTR</span>
                                            <span className="text-[#4F6BFF] font-medium">+18%</span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="w-full px-4 py-3 rounded-xl bg-[#4F6BFF] hover:bg-[#3d5be0] text-white font-medium transition-all text-sm flex items-center justify-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Apply Suggestions
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sticky Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-[#0B1220]/90 backdrop-blur-xl border-t border-white/5 z-50">
                    <div className="max-w-[1800px] mx-auto px-8 py-4">
                        <div className="flex items-center justify-between">
                            <Link
                                href={route('admin.cms.collections.index')}
                                className="px-6 py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all font-medium border border-white/5"
                            >
                                Cancel
                            </Link>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    className="px-6 py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all font-medium border border-white/5"
                                >
                                    Save Draft
                                </button>
                                <button
                                    type="button"
                                    className="px-6 py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all font-medium border border-white/5 flex items-center gap-2"
                                >
                                    <Play className="w-4 h-4" />
                                    Apply
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3 rounded-xl bg-[#4F6BFF] text-white font-medium shadow-lg shadow-[#4F6BFF]/25 hover:shadow-xl hover:shadow-[#4F6BFF]/35 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {processing ? 'Updating...' : 'Update Collection'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
