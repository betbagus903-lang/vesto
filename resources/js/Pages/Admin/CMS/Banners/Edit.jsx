import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronLeft, Save, Calendar, Clock, Layers, Image as ImageIcon } from 'lucide-react';
import BannerBlockEditor from '../../../../Components/Admin/BannerBlockEditor';

const THEME = {
    background: '#0A0D14',
    card: '#111827',
    secondaryCard: '#161F2F',
    border: 'rgba(255,255,255,0.08)',
    primaryBlue: '#4F6BFF',
    purple: '#6C63FF',
    white: '#FFFFFF',
    secondaryText: '#A8B3CF',
    muted: '#667085',
    danger: '#EF4444',
};

const SLOT_OPTIONS = [
    { value: 'home_hero', label: 'Home Hero' },
    { value: 'home_category', label: 'Home Category Banner' },
    { value: 'shop_top', label: 'Shop Top Banner' },
    { value: 'promo_1', label: 'Promo Banner 1' },
    { value: 'promo_2', label: 'Promo Banner 2' },
    { value: 'promo_3', label: 'Promo Banner 3' },
];

export default function BannerEdit({ banner }) {
    const { data, setData, put, processing, errors } = useForm({
        type: banner.type,
        slot: banner.slot || 'home_hero',
        layout_json: banner.layout_json || [],
        is_active: banner.is_active,
        sort_order: banner.sort_order,
        start_date: banner.start_date ? banner.start_date.slice(0, 16) : '',
        end_date: banner.end_date ? banner.end_date.slice(0, 16) : '',
    });

    const [layoutBlocks, setLayoutBlocks] = useState(banner.layout_json || []);

    // Get banner image URL with proper path handling
    const getBannerImageUrl = () => {
        if (!banner.image) return null;
        return banner.image.startsWith('http') ? banner.image : `/storage/${banner.image}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const submitData = { ...data, layout_json: layoutBlocks };
        put(route('admin.cms.banners.update', banner.id), submitData);
    };

    return (
        <AdminLayout>
            <Head title="Edit Banner" />

            <div style={{ backgroundColor: THEME.background }}>
                {/* Page Header */}
                <div className="p-6 max-w-[1600px] mx-auto">
                    <Link
                        href={route('admin.cms.banners.index')}
                        className="inline-flex items-center gap-2 mb-4 transition-colors"
                        style={{ color: THEME.secondaryText }}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Banners
                    </Link>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: THEME.white }}>Edit Banner</h1>
                    <p style={{ color: THEME.secondaryText }}>Edit your banner content and settings</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="max-w-[1600px] mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Settings (1/3) */}
                            <div className="space-y-6">
                                {/* Settings Card */}
                                <div className="rounded-2xl p-6" style={{ backgroundColor: THEME.card, border: `1px solid ${THEME.border}` }}>
                                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: THEME.white }}>
                                        <Layers className="w-5 h-5" />
                                        Banner Settings
                                    </h2>
                                    
                                    <div className="space-y-5">
                                        {/* Slot */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: THEME.secondaryText }}>
                                                Slot
                                            </label>
                                            <select
                                                value={data.slot}
                                                onChange={(e) => setData('slot', e.target.value)}
                                                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                                                style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
                                            >
                                                {SLOT_OPTIONS.map(slot => (
                                                    <option key={slot.value} value={slot.value}>{slot.label}</option>
                                                ))}
                                            </select>
                                            {errors.slot && <p className="text-sm mt-1" style={{ color: THEME.danger }}>{errors.slot}</p>}
                                        </div>

                                        {/* Active Status */}
                                        <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                                            <div>
                                                <label className="text-sm font-medium" style={{ color: THEME.white }}>Active Status</label>
                                                <p className="text-xs mt-1" style={{ color: THEME.muted }}>Banner will be displayed</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setData('is_active', !data.is_active)}
                                                className="relative w-14 h-8 rounded-full transition-colors focus:outline-none"
                                            >
                                                <div className={`absolute inset-0 rounded-full transition-colors ${
                                                    data.is_active ? 'bg-[#4F6BFF]' : 'bg-gray-600'
                                                }`} />
                                                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                                                    data.is_active ? 'translate-x-6' : 'translate-x-0'
                                                }`} />
                                            </button>
                                        </div>

                                        {/* Sort Order */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: THEME.secondaryText }}>
                                                Sort Order
                                            </label>
                                            <input
                                                type="number"
                                                value={data.sort_order}
                                                onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                                                style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
                                            />
                                            <p className="text-xs mt-1" style={{ color: THEME.muted }}>Lower numbers appear first</p>
                                            {errors.sort_order && <p className="text-sm mt-1" style={{ color: THEME.danger }}>{errors.sort_order}</p>}
                                        </div>

                                        {/* Schedule */}
                                        <div className="pt-4 border-t" style={{ borderColor: THEME.border }}>
                                            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: THEME.white }}>
                                                <Calendar className="w-4 h-4" />
                                                Schedule
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs mb-2 flex items-center gap-2" style={{ color: THEME.secondaryText }}>
                                                        <Clock className="w-3 h-3" />
                                                        Start Date
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        value={data.start_date}
                                                        onChange={(e) => setData('start_date', e.target.value)}
                                                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                                                        style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
                                                    />
                                                    <p className="text-xs mt-1" style={{ color: THEME.muted }}>Leave empty for immediate</p>
                                                    {errors.start_date && <p className="text-sm mt-1" style={{ color: THEME.danger }}>{errors.start_date}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-xs mb-2 flex items-center gap-2" style={{ color: THEME.secondaryText }}>
                                                        <Clock className="w-3 h-3" />
                                                        End Date
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        value={data.end_date}
                                                        onChange={(e) => setData('end_date', e.target.value)}
                                                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                                                        style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
                                                    />
                                                    <p className="text-xs mt-1" style={{ color: THEME.muted }}>Leave empty for no expiration</p>
                                                    {errors.end_date && <p className="text-sm mt-1" style={{ color: THEME.danger }}>{errors.end_date}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Block Editor (2/3) */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Banner Image Preview */}
                                {getBannerImageUrl() && (
                                    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: THEME.card, border: `1px solid ${THEME.border}` }}>
                                        <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${THEME.border}` }}>
                                            <ImageIcon className="w-4 h-4" style={{ color: THEME.secondaryText }} />
                                            <span className="text-sm font-medium" style={{ color: THEME.white }}>Current Banner Image</span>
                                        </div>
                                        <div className="relative" style={{ aspectRatio: '2.4/1' }}>
                                            <img 
                                                src={getBannerImageUrl()} 
                                                alt="Banner Preview" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Block Editor Card */}
                                <div className="rounded-2xl p-6" style={{ backgroundColor: THEME.card, border: `1px solid ${THEME.border}` }}>
                                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: THEME.white }}>
                                        <Layers className="w-5 h-5" />
                                        Banner Content
                                    </h2>
                                    <p className="text-sm mb-6" style={{ color: THEME.secondaryText }}>
                                        Add blocks to build your banner. Use image, heading, text, and button blocks to create your design.
                                    </p>
                                    <BannerBlockEditor value={layoutBlocks} onChange={setLayoutBlocks} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-6 pb-6 px-6 border-t" style={{ borderColor: THEME.border }}>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-8 py-3 rounded-xl transition-colors font-medium text-white"
                            style={{ background: `linear-gradient(135deg, ${THEME.primaryBlue}, ${THEME.purple})` }}
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Saving...' : 'Save Banner'}
                        </button>
                        <Link
                            href={route('admin.cms.banners.index')}
                            className="px-8 py-3 rounded-xl transition-colors font-medium"
                            style={{ border: `1px solid ${THEME.border}`, color: THEME.secondaryText }}
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
