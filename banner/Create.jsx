import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ChevronLeft, Save, Eye, Home, ShoppingBag, Tag, ExternalLink, Calendar, Clock, ToggleLeft, ToggleRight, Layers } from 'lucide-react';
import ImageUpload from '../../../../Components/Admin/ImageUpload';
import SearchableSelect from '../../../../Components/Admin/SearchableSelect';
import BannerBlockEditor from '../../../../Components/Admin/BannerBlockEditor';

export default function BannerCreate({ type }) {
    const { data, setData, post, processing, errors } = useForm({
        type: type || 'hero_slider',
        slot: '',
        title: '',
        subtitle: '',
        image: '',
        button_text: '',
        button_link: '',
        link_type: 'home',
        link_id: null,
        collection_id: null,
        layout_json: null,
        is_active: true,
        sort_order: 0,
        start_date: '',
        end_date: '',
    });

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingCollections, setLoadingCollections] = useState(false);
    const [useBlockLayout, setUseBlockLayout] = useState(false);
    const [layoutBlocks, setLayoutBlocks] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
        fetchCollections();
    }, []);

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const response = await fetch(route('admin.categories.search'));
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const response = await fetch(route('admin.products.search'));
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const fetchCollections = async () => {
        setLoadingCollections(true);
        try {
            const response = await fetch(route('admin.cms.collections.search'));
            const data = await response.json();
            setCollections(data);
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        } finally {
            setLoadingCollections(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!data.image) {
            alert('Please upload a banner image');
            return;
        }
        if (!data.title) {
            alert('Please enter a title');
            return;
        }
        if (data.link_type === 'category' && !data.link_id) {
            alert('Please select a category');
            return;
        }
        if (data.link_type === 'product' && !data.link_id) {
            alert('Please select a product');
            return;
        }
        if (data.link_type === 'collection' && !data.collection_id) {
            alert('Please select a collection');
            return;
        }
        if (data.link_type === 'external_url' && !data.button_link) {
            alert('Please enter a URL');
            return;
        }

        // Include layout_json if using block layout
        const submitData = { ...data };
        if (useBlockLayout) {
            submitData.layout_json = layoutBlocks;
        }

        post(route('admin.cms.banners.store'), submitData);
    };

    const handleSaveAndContinue = (e) => {
        e.preventDefault();
        
        // Validation
        if (!data.image) {
            alert('Please upload a banner image');
            return;
        }
        if (!data.title) {
            alert('Please enter a title');
            return;
        }

        post(route('admin.cms.banners.store'), {
            onSuccess: () => {
                // Stay on page for continued editing
                window.location.reload();
            }
        });
    };

    const destinationTypes = [
        { value: 'home', label: 'Home', icon: Home },
        { value: 'shop', label: 'Shop', icon: ShoppingBag },
        { value: 'category', label: 'Category', icon: Tag },
        { value: 'product', label: 'Product', icon: ShoppingBag },
        { value: 'collection', label: 'Collection', icon: ShoppingBag },
        { value: 'external_url', label: 'External URL', icon: ExternalLink },
    ];

    return (
        <AdminLayout>
            <Head title="Create Banner" />

            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={route('admin.cms.banners.index', { type })}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Banners
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Banner</h1>
                    <p className="text-gray-400">Create a new {type.replace('_', ' ')} banner</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Upload & Preview */}
                        <div className="space-y-6">
                            {/* Upload Card */}
                            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Eye className="w-5 h-5" />
                                    Banner Image
                                </h2>
                                <ImageUpload
                                    value={data.image}
                                    onChange={(value) => setData('image', value)}
                                />
                            </div>

                            {/* Live Preview Card */}
                            {data.image && (
                                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
                                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <Eye className="w-5 h-5" />
                                        Live Preview
                                    </h2>
                                    <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden">
                                        <img
                                            src={data.image}
                                            alt="Banner preview"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Text Overlay Simulation */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                                            {data.subtitle && (
                                                <p className="text-white/90 text-sm mb-1">{data.subtitle}</p>
                                            )}
                                            {data.title && (
                                                <h3 className="text-white text-2xl font-bold mb-2">{data.title}</h3>
                                            )}
                                            {data.button_text && (
                                                <div className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                                                    {data.button_text}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Form Fields */}
                        <div className="space-y-6">
                            {/* Banner Details Card */}
                            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
                                <h2 className="text-lg font-semibold text-white mb-6">Banner Details</h2>
                                
                                <div className="space-y-5">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Title <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="Banner title"
                                        />
                                        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                                    </div>

                                    {/* Subtitle */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Subtitle
                                        </label>
                                        <input
                                            type="text"
                                            value={data.subtitle}
                                            onChange={(e) => setData('subtitle', e.target.value)}
                                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="Banner subtitle (optional)"
                                        />
                                        {errors.subtitle && <p className="text-red-400 text-sm mt-1">{errors.subtitle}</p>}
                                    </div>

                                    {/* Slot */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Slot
                                        </label>
                                        <input
                                            type="text"
                                            value={data.slot}
                                            onChange={(e) => setData('slot', e.target.value)}
                                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="e.g., home_hero, shop_top, promo_1"
                                        />
                                        <p className="text-gray-500 text-xs mt-1">Slot identifier for where banner is displayed</p>
                                        {errors.slot && <p className="text-red-400 text-sm mt-1">{errors.slot}</p>}
                                    </div>

                                    {/* Layout Mode Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl">
                                        <div>
                                            <label className="text-sm font-medium text-white flex items-center gap-2">
                                                <Layers className="w-4 h-4" />
                                                Block Layout Editor
                                            </label>
                                            <p className="text-gray-400 text-xs mt-1">Use visual block editor instead of traditional fields</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setUseBlockLayout(!useBlockLayout)}
                                            className="relative w-14 h-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            <div className={`absolute inset-0 rounded-full transition-colors ${
                                                useBlockLayout ? 'bg-blue-600' : 'bg-gray-600'
                                            }`} />
                                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                                                useBlockLayout ? 'translate-x-6' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    </div>

                                    {/* Puck Editor */}
                                    {useBlockLayout && (
                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                                Block Layout
                                            </label>
                                            <BannerBlockEditor value={layoutBlocks} onChange={setLayoutBlocks} />
                                        </div>
                                    )}

                                    {/* Traditional Fields (hidden when using block layout) */}
                                    {!useBlockLayout && (
                                        <>
                                            {/* Button Text */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Button Text
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.button_text}
                                                    onChange={(e) => setData('button_text', e.target.value)}
                                                    className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                    placeholder="Shop Now"
                                                />
                                                {errors.button_text && <p className="text-red-400 text-sm mt-1">{errors.button_text}</p>}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Destination Card */}
                            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
                                <h2 className="text-lg font-semibold text-white mb-6">Destination</h2>
                                
                                <div className="space-y-5">
                                    {/* Destination Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-3">
                                            Destination Type <span className="text-red-400">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {destinationTypes.map((dest) => {
                                                const Icon = dest.icon;
                                                return (
                                                    <button
                                                        key={dest.value}
                                                        type="button"
                                                        onClick={() => {
                                                            setData('link_type', dest.value);
                                                            setData('link_id', null);
                                                            setData('button_link', '');
                                                        }}
                                                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                                                            data.link_type === dest.value
                                                                ? 'border-blue-500 bg-blue-500/10 text-white'
                                                                : 'border-gray-600 bg-gray-700 text-gray-400 hover:border-gray-500'
                                                        }`}
                                                    >
                                                        <Icon className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{dest.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {errors.link_type && <p className="text-red-400 text-sm mt-1">{errors.link_type}</p>}
                                    </div>

                                    {/* Dynamic Destination Field */}
                                    {data.link_type === 'category' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Select Category <span className="text-red-400">*</span>
                                            </label>
                                            <SearchableSelect
                                                value={data.link_id}
                                                onChange={(value) => setData('link_id', value)}
                                                options={categories}
                                                placeholder="Search categories..."
                                                isLoading={loadingCategories}
                                            />
                                            {errors.link_id && <p className="text-red-400 text-sm mt-1">{errors.link_id}</p>}
                                        </div>
                                    )}

                                    {data.link_type === 'product' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Select Product <span className="text-red-400">*</span>
                                            </label>
                                            <SearchableSelect
                                                value={data.link_id}
                                                onChange={(value) => setData('link_id', value)}
                                                options={products}
                                                placeholder="Search products..."
                                                isLoading={loadingProducts}
                                            />
                                            {errors.link_id && <p className="text-red-400 text-sm mt-1">{errors.link_id}</p>}
                                        </div>
                                    )}

                                    {data.link_type === 'collection' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Select Collection <span className="text-red-400">*</span>
                                            </label>
                                            <SearchableSelect
                                                value={data.collection_id}
                                                onChange={(value) => setData('collection_id', value)}
                                                options={collections}
                                                placeholder="Search collections..."
                                                isLoading={loadingCollections}
                                            />
                                            {errors.collection_id && <p className="text-red-400 text-sm mt-1">{errors.collection_id}</p>}
                                        </div>
                                    )}

                                    {data.link_type === 'external_url' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                URL <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.button_link}
                                                onChange={(e) => setData('button_link', e.target.value)}
                                                className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                placeholder="https://example.com"
                                            />
                                            {errors.button_link && <p className="text-red-400 text-sm mt-1">{errors.button_link}</p>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Schedule Card */}
                            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
                                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Schedule
                                </h2>
                                
                                <div className="space-y-5">
                                    {/* Start Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Start Date
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                        <p className="text-gray-500 text-xs mt-1">Leave empty for immediate activation</p>
                                        {errors.start_date && <p className="text-red-400 text-sm mt-1">{errors.start_date}</p>}
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            End Date
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                        <p className="text-gray-500 text-xs mt-1">Leave empty for no expiration</p>
                                        {errors.end_date && <p className="text-red-400 text-sm mt-1">{errors.end_date}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Settings Card */}
                            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
                                <h2 className="text-lg font-semibold text-white mb-6">Settings</h2>
                                
                                <div className="space-y-5">
                                    {/* Active Status */}
                                    <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl">
                                        <div>
                                            <label className="text-sm font-medium text-white">Active Status</label>
                                            <p className="text-gray-400 text-xs mt-1">Banner will be displayed on the website</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setData('is_active', !data.is_active)}
                                            className="relative w-14 h-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            <div className={`absolute inset-0 rounded-full transition-colors ${
                                                data.is_active ? 'bg-blue-600' : 'bg-gray-600'
                                            }`} />
                                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                                                data.is_active ? 'translate-x-6' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    </div>

                                    {/* Sort Order */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Sort Order
                                        </label>
                                        <input
                                            type="number"
                                            value={data.sort_order}
                                            onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                            className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                        <p className="text-gray-500 text-xs mt-1">Lower numbers appear first</p>
                                        {errors.sort_order && <p className="text-red-400 text-sm mt-1">{errors.sort_order}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-700">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-8 py-3 rounded-xl transition-colors font-medium"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Saving...' : 'Save Banner'}
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveAndContinue}
                            disabled={processing}
                            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white px-8 py-3 rounded-xl transition-colors font-medium"
                        >
                            <Save className="w-4 h-4" />
                            Save & Continue Editing
                        </button>
                        <Link
                            href={route('admin.cms.banners.index', { type })}
                            className="px-8 py-3 border-2 border-gray-600 text-gray-300 hover:bg-gray-700 rounded-xl transition-colors font-medium"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
