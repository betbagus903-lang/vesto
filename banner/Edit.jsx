import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ChevronLeft, Save, Eye, Home, ShoppingBag, Tag, ExternalLink, Calendar, Clock, Monitor, Smartphone, Tablet, Crop, Replace, Trash2, Maximize2, ChevronDown, ChevronUp, Settings, Link as LinkIcon, Search, BarChart3, Activity, TrendingUp, Globe, FileText, Layers } from 'lucide-react';
import ImageUpload from '../../../../Components/Admin/ImageUpload';
import SearchableSelect from '../../../../Components/Admin/SearchableSelect';
import BannerBlockEditor from '../../../../Components/Admin/BannerBlockEditor';

export default function BannerEdit({ banner }) {
    const { data, setData, put, processing, errors } = useForm({
        type: banner.type,
        slot: banner.slot || '',
        title: banner.title,
        subtitle: banner.subtitle || '',
        image: banner.image,
        button_text: banner.button_text || '',
        button_link: banner.button_link || '',
        link_type: banner.link_type || 'home',
        link_id: banner.link_id,
        collection_id: banner.collection_id,
        layout_json: banner.layout_json || null,
        is_active: banner.is_active,
        sort_order: banner.sort_order,
        start_date: banner.start_date ? banner.start_date.slice(0, 16) : '',
        end_date: banner.end_date ? banner.end_date.slice(0, 16) : '',
    });

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingCollections, setLoadingCollections] = useState(false);
    const [previewMode, setPreviewMode] = useState('desktop');
    const [expandedSections, setExpandedSections] = useState({
        banner: true,
        button: true,
        destination: true,
        schedule: true,
        visibility: false,
        seo: false,
        analytics: false,
    });
    const [useBlockLayout, setUseBlockLayout] = useState(!!banner.layout_json);
    const [layoutBlocks, setLayoutBlocks] = useState(banner.layout_json || []);

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
        
        // Include layout_json if using block layout
        const submitData = { ...data };
        if (useBlockLayout) {
            submitData.layout_json = layoutBlocks;
        }
        
        put(route('admin.cms.banners.update', banner.id), submitData);
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const destinationTypes = [
        { value: 'home', label: 'Home', icon: Home },
        { value: 'category', label: 'Category', icon: Tag },
        { value: 'product', label: 'Product', icon: ShoppingBag },
        { value: 'collection', label: 'Collection', icon: ShoppingBag },
        { value: 'external_url', label: 'External URL', icon: ExternalLink },
    ];

    const Section = ({ title, icon: Icon, children, section, isOpen }) => (
        <div className="border-b border-white/5 last:border-0">
            <button
                type="button"
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-white">{title}</span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {isOpen && <div className="px-6 pb-6">{children}</div>}
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Edit Banner" />

            <div className="min-h-screen bg-[#0F172A]">
                {/* Page Header */}
                <div className="px-12 pt-10 pb-8 border-b border-white/5">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                        <Link href={route('admin.cms.banners.index')} className="hover:text-gray-300">CMS</Link>
                        <span>/</span>
                        <Link href={route('admin.cms.banners.index')} className="hover:text-gray-300">Banners</Link>
                        <span>/</span>
                        <span className="text-white">Edit</span>
                    </div>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Edit Banner</h1>
                            <p className="text-gray-400 text-base">Customize your hero slider banner for the homepage</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium border border-white/10">
                                <Eye className="w-4 h-4" />
                                Preview
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium border border-white/10">
                                <Save className="w-4 h-4" />
                                Save Draft
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4F6BFF] text-white hover:bg-[#3D5AE0] disabled:bg-[#4F6BFF]/50 transition-all text-sm font-medium shadow-lg shadow-[#4F6BFF]/25"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex">
                    {/* Main Content (70%) */}
                    <div className="w-[70%] p-12">
                        {/* HERO: Banner Image */}
                        <div className="mb-12">
                            <div className="relative aspect-[2.4:1] bg-[#111827] rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                                {data.image ? (
                                    <>
                                        <img
                                            src={data.image}
                                            alt="Banner preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                        <div className="absolute top-6 right-6 flex items-center gap-2">
                                            <button className="p-3 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all border border-white/10">
                                                <Replace className="w-4 h-4" />
                                            </button>
                                            <button className="p-3 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all border border-white/10">
                                                <Crop className="w-4 h-4" />
                                            </button>
                                            <button className="p-3 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all border border-white/10">
                                                <Maximize2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('image', '')}
                                                className="p-3 rounded-xl bg-black/50 backdrop-blur-sm text-red-400 hover:bg-red-500/20 transition-all border border-white/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                                            <Eye className="w-10 h-10 text-gray-500" />
                                        </div>
                                        <p className="text-gray-400 text-base mb-4">Drop your banner image here</p>
                                        <ImageUpload
                                            value={data.image}
                                            onChange={(value) => setData('image', value)}
                                        />
                                    </div>
                                )}
                            </div>
                            {/* Image Info Bar */}
                            <div className="mt-4 flex items-center justify-between px-4">
                                <div className="flex items-center gap-6 text-xs text-gray-500">
                                    <span>1920 × 800</span>
                                    <span>•</span>
                                    <span>2.4 MB</span>
                                    <span>•</span>
                                    <span>PNG</span>
                                    <span>•</span>
                                    <span className="text-emerald-400">High Quality</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="text-xs text-gray-400 hover:text-white transition-colors">Replace</button>
                                    <span className="text-gray-600">•</span>
                                    <button className="text-xs text-gray-400 hover:text-white transition-colors">Crop</button>
                                    <span className="text-gray-600">•</span>
                                    <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Delete</button>
                                </div>
                            </div>
                        </div>

                        {/* Live Preview in Browser Mockup */}
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white">Live Preview</h2>
                                <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                                    <button
                                        onClick={() => setPreviewMode('desktop')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-medium ${
                                            previewMode === 'desktop'
                                                ? 'bg-[#4F6BFF] text-white'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <Monitor className="w-3.5 h-3.5" />
                                        Desktop
                                    </button>
                                    <button
                                        onClick={() => setPreviewMode('tablet')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-medium ${
                                            previewMode === 'tablet'
                                                ? 'bg-[#4F6BFF] text-white'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <Tablet className="w-3.5 h-3.5" />
                                        Tablet
                                    </button>
                                    <button
                                        onClick={() => setPreviewMode('mobile')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-medium ${
                                            previewMode === 'mobile'
                                                ? 'bg-[#4F6BFF] text-white'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <Smartphone className="w-3.5 h-3.5" />
                                        Mobile
                                    </button>
                                </div>
                            </div>
                            <div className={`bg-[#111827] rounded-3xl border border-white/5 overflow-hidden ${
                                previewMode === 'desktop' ? 'max-w-4xl' : previewMode === 'tablet' ? 'max-w-2xl' : 'max-w-xs mx-auto'
                            }`}>
                                {/* Browser Chrome */}
                                <div className="bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="flex-1 mx-4">
                                        <div className="bg-white/5 rounded-lg px-4 py-1.5 text-xs text-gray-500">vesto.com</div>
                                    </div>
                                </div>
                                {/* Preview Content */}
                                <div className={`relative overflow-hidden ${
                                    previewMode === 'desktop' ? 'aspect-[2.4:1]' : previewMode === 'tablet' ? 'aspect-[4:3]' : 'aspect-[9:16]'
                                }`}>
                                    {data.image ? (
                                        <img
                                            src={data.image}
                                            alt="Banner preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#0F172A] flex items-center justify-center">
                                            <Eye className="w-12 h-12 text-gray-600" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
                                        {data.subtitle && (
                                            <p className="text-white/90 text-sm mb-2">{data.subtitle}</p>
                                        )}
                                        {data.title && (
                                            <h3 className="text-white text-3xl font-bold mb-3">{data.title}</h3>
                                        )}
                                        {data.button_text && (
                                            <div className="inline-block bg-[#4F6BFF] hover:bg-[#3D5AE0] text-white px-8 py-3 rounded-xl transition-colors text-sm font-medium">
                                                {data.button_text}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar (30%) */}
                    <div className="w-[30%] border-l border-white/5 p-8 space-y-6">
                        {/* Compact Settings Panel */}
                        <div className="bg-[#111827] rounded-3xl border border-white/5 overflow-hidden">
                            <Section title="Banner" icon={Eye} section="banner" isOpen={expandedSections.banner}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#4F6BFF] transition-colors"
                                            placeholder="Banner title"
                                        />
                                        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2">Subtitle</label>
                                        <input
                                            type="text"
                                            value={data.subtitle}
                                            onChange={(e) => setData('subtitle', e.target.value)}
                                            className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#4F6BFF] transition-colors"
                                            placeholder="Banner subtitle"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2">Slot</label>
                                        <input
                                            type="text"
                                            value={data.slot}
                                            onChange={(e) => setData('slot', e.target.value)}
                                            className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#4F6BFF] transition-colors"
                                            placeholder="e.g., home_hero, shop_top"
                                        />
                                        <p className="text-gray-500 text-xs mt-1">Slot identifier for where banner is displayed</p>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div>
                                            <label className="text-xs text-white flex items-center gap-2">
                                                <Layers className="w-3 h-3" />
                                                Block Layout Editor
                                            </label>
                                            <p className="text-gray-500 text-xs mt-1">Use visual block editor</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setUseBlockLayout(!useBlockLayout)}
                                            className="relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]"
                                        >
                                            <div className={`absolute inset-0 rounded-full transition-colors ${
                                                useBlockLayout ? 'bg-[#4F6BFF]' : 'bg-gray-600'
                                            }`} />
                                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                                                useBlockLayout ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    </div>
                                    {useBlockLayout && (
                                        <div className="mt-4">
                                            <label className="block text-xs text-gray-400 mb-2">Block Layout</label>
                                            <BannerBlockEditor value={layoutBlocks} onChange={setLayoutBlocks} />
                                        </div>
                                    )}
                                </div>
                            </Section>

                            <Section title="Button" icon={LinkIcon} section="button" isOpen={expandedSections.button}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2">Button Text</label>
                                        <input
                                            type="text"
                                            value={data.button_text}
                                            onChange={(e) => setData('button_text', e.target.value)}
                                            className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#4F6BFF] transition-colors"
                                            placeholder="Shop Now"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2">Button URL</label>
                                        <input
                                            type="text"
                                            value={data.button_link}
                                            onChange={(e) => setData('button_link', e.target.value)}
                                            className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#4F6BFF] transition-colors"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </div>
                            </Section>

                            <Section title="Destination" icon={Globe} section="destination" isOpen={expandedSections.destination}>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-2">
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
                                                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border transition-all text-xs font-medium ${
                                                        data.link_type === dest.value
                                                            ? 'border-[#4F6BFF] bg-[#4F6BFF]/10 text-white'
                                                            : 'border-white/10 bg-[#0F172A] text-gray-400 hover:border-white/20'
                                                    }`}
                                                >
                                                    <Icon className="w-3 h-3" />
                                                    {dest.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {data.link_type === 'category' && (
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-2">Select Category</label>
                                            <SearchableSelect
                                                value={data.link_id}
                                                onChange={(value) => setData('link_id', value)}
                                                options={categories}
                                                placeholder="Search..."
                                                isLoading={loadingCategories}
                                            />
                                        </div>
                                    )}
                                    {data.link_type === 'product' && (
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-2">Select Product</label>
                                            <SearchableSelect
                                                value={data.link_id}
                                                onChange={(value) => setData('link_id', value)}
                                                options={products}
                                                placeholder="Search..."
                                                isLoading={loadingProducts}
                                            />
                                        </div>
                                    )}
                                    {data.link_type === 'collection' && (
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-2">Select Collection</label>
                                            <SearchableSelect
                                                value={data.collection_id}
                                                onChange={(value) => setData('collection_id', value)}
                                                options={collections}
                                                placeholder="Search..."
                                                isLoading={loadingCollections}
                                            />
                                        </div>
                                    )}
                                    {data.link_type === 'external_url' && (
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-2">URL</label>
                                            <input
                                                type="text"
                                                value={data.button_link}
                                                onChange={(e) => setData('button_link', e.target.value)}
                                                className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#4F6BFF] transition-colors"
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                    )}
                                </div>
                            </Section>

                            <Section title="Schedule" icon={Calendar} section="schedule" isOpen={expandedSections.schedule}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2">Start Date</label>
                                        <input
                                            type="datetime-local"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#4F6BFF] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2">End Date</label>
                                        <input
                                            type="datetime-local"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#4F6BFF] transition-colors"
                                        />
                                    </div>
                                </div>
                            </Section>

                            <Section title="Visibility" icon={Settings} section="visibility" isOpen={expandedSections.visibility}>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-white">Active</span>
                                        <button
                                            type="button"
                                            onClick={() => setData('is_active', !data.is_active)}
                                            className="relative w-11 h-6 rounded-full transition-colors"
                                        >
                                            <div className={`absolute inset-0 rounded-full transition-colors ${
                                                data.is_active ? 'bg-[#4F6BFF]' : 'bg-white/10'
                                            }`} />
                                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                                data.is_active ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2">Sort Order</label>
                                        <input
                                            type="number"
                                            value={data.sort_order}
                                            onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                            className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#4F6BFF] transition-colors"
                                        />
                                    </div>
                                </div>
                            </Section>

                            <Section title="SEO" icon={Search} section="seo" isOpen={expandedSections.seo}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2">Meta Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#4F6BFF] transition-colors"
                                            placeholder="SEO title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2">Meta Description</label>
                                        <textarea
                                            className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#4F6BFF] transition-colors resize-none"
                                            rows="3"
                                            placeholder="SEO description"
                                        />
                                    </div>
                                </div>
                            </Section>

                            <Section title="Analytics" icon={BarChart3} section="analytics" isOpen={expandedSections.analytics}>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-[#0F172A] rounded-xl p-3 border border-white/5">
                                            <div className="text-2xl font-bold text-white">12.4K</div>
                                            <div className="text-xs text-gray-500">Views</div>
                                        </div>
                                        <div className="bg-[#0F172A] rounded-xl p-3 border border-white/5">
                                            <div className="text-2xl font-bold text-white">842</div>
                                            <div className="text-xs text-gray-500">Clicks</div>
                                        </div>
                                        <div className="bg-[#0F172A] rounded-xl p-3 border border-white/5">
                                            <div className="text-2xl font-bold text-white">6.8%</div>
                                            <div className="text-xs text-gray-500">CTR</div>
                                        </div>
                                        <div className="bg-[#0F172A] rounded-xl p-3 border border-white/5">
                                            <div className="text-2xl font-bold text-white">45.2K</div>
                                            <div className="text-xs text-gray-500">Impressions</div>
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        </div>

                        {/* Upload Guide */}
                        <div className="bg-[#111827] rounded-3xl border border-white/5 p-6">
                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#4F6BFF]" />
                                Upload Guide
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[#4F6BFF] text-xs font-medium mb-1">Recommended Size</div>
                                    <div className="text-white text-lg font-bold">1920 × 800</div>
                                </div>
                                <div className="pt-4 border-t border-white/5 space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Aspect Ratio</span>
                                        <span className="text-white">2.4:1</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Max Size</span>
                                        <span className="text-white">2 MB</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Format</span>
                                        <span className="text-white">PNG · JPG · WEBP</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    <div className="text-white text-xs font-medium mb-2">Safe Area</div>
                                    <div className="aspect-[2.4:1] bg-[#0F172A] rounded-lg border-2 border-dashed border-white/10 p-2">
                                        <div className="w-full h-4/5 border border-[#4F6BFF]/30 rounded flex items-center justify-center">
                                            <span className="text-[#4F6BFF]/40 text-[10px]">Safe content area</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Campaign Status */}
                        <div className="bg-[#111827] rounded-3xl border border-white/5 p-6">
                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-[#4F6BFF]" />
                                Campaign Status
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Status</span>
                                    <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">Active</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Last Edited</span>
                                    <span className="text-white">2 hours ago</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Created</span>
                                    <span className="text-white">3 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
