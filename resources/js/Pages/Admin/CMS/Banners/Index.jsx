import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Copy, BarChart3, Search, Filter, Upload, Download, Image as ImageIcon, Clock, TrendingUp, Users, ArrowRight, ChevronRight } from 'lucide-react';

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

export default function BannersIndex({ banners, pagination, current_type }) {
    const [selectedType, setSelectedType] = useState(current_type || 'hero_slider');

    const bannerTypes = [
        { id: 'hero_slider', label: 'Hero Slider' },
        { id: 'promo_banner', label: 'Promo Banner' },
        { id: 'category_banner', label: 'Category Banner' },
        { id: 'collection_banner', label: 'Collection Banner' },
    ];

    // Example banners with luxury fashion campaign look
    const exampleBanners = [
        {
            id: 1,
            title: 'Spring / Summer 2026',
            subtitle: 'New Collection',
            type: 'hero_slider',
            position: 1,
            is_active: true,
            image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=800&fit=crop',
            views: 45230,
            clicks: 8920,
            ctr: '19.7%',
            updated_at: '2 hours ago',
        },
        {
            id: 2,
            title: 'Summer Sale',
            subtitle: 'Up to 20% Off',
            type: 'promo_banner',
            position: 2,
            is_active: true,
            image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=800&fit=crop',
            views: 38450,
            clicks: 12450,
            ctr: '32.4%',
            updated_at: '5 hours ago',
        },
        {
            id: 3,
            title: 'Accessories Collection',
            subtitle: 'Premium Quality',
            type: 'category_banner',
            position: 3,
            is_active: true,
            image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1920&h=800&fit=crop',
            views: 28900,
            clicks: 5680,
            ctr: '19.6%',
            updated_at: '1 day ago',
        },
        {
            id: 4,
            title: 'Minimal Essentials',
            subtitle: 'Timeless Design',
            type: 'collection_banner',
            position: 4,
            is_active: false,
            image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&h=800&fit=crop',
            views: 0,
            clicks: 0,
            ctr: '-',
            updated_at: '2 days ago',
        },
    ];

    const displayBanners = banners.length > 0 ? banners : exampleBanners;

    const stats = {
        total: 24,
        published: 18,
        scheduled: 4,
        draft: 2,
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
        router.get(route('admin.cms.banners.index'), { type });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this banner?')) {
            router.delete(route('admin.cms.banners.destroy', id));
        }
    };

    const getTypeLabel = (type) => {
        const t = bannerTypes.find(bt => bt.id === type);
        return t ? t.label : type;
    };

    const StatCard = ({ icon: Icon, label, value, description, color }) => (
        <div className="rounded-2xl p-8 hover:border-white/10 transition-all duration-300" style={{ backgroundColor: THEME.card, border: `1px solid ${THEME.border}` }}>
            <div className="flex items-start justify-between mb-6">
                <div className="p-4 rounded-2xl" style={{ backgroundColor: `${color}20` }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <span className="text-4xl font-bold tracking-tight" style={{ color: THEME.white }}>{value}</span>
            </div>
            <h3 className="text-sm font-medium tracking-wide" style={{ color: THEME.secondaryText }}>{label}</h3>
            <p className="text-xs mt-1" style={{ color: THEME.muted }}>{description}</p>
        </div>
    );

    const BannerCard = ({ banner }) => (
        <div className="rounded-2xl overflow-hidden transition-all duration-300" style={{ backgroundColor: THEME.card, border: `1px solid ${THEME.border}` }}>
            <div className="flex h-[180px]">
                {/* Left: Banner Preview (40%) */}
                <div className="w-[40%] relative overflow-hidden" style={{ backgroundColor: THEME.background }}>
                    {banner.image ? (
                        <img
                            src={banner.image.startsWith('http') ? banner.image : `/storage/${banner.image}`}
                            alt={banner.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(to bottom right, ${THEME.card}, ${THEME.background})` }}>
                            <ImageIcon className="w-12 h-12" style={{ color: THEME.muted }} />
                        </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-medium tracking-wide border ${
                            banner.is_active
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                            {banner.is_active ? 'Published' : 'Draft'}
                        </span>
                    </div>
                </div>

                {/* Right: Banner Information (60%) */}
                <div className="w-[60%] p-5 flex flex-col justify-between">
                    <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base mb-1 tracking-tight truncate" style={{ color: THEME.white }}>{banner.title}</h3>
                                <div className="flex items-center gap-2 text-xs" style={{ color: THEME.secondaryText }}>
                                    <span className="font-medium" style={{ color: THEME.primaryBlue }}>{getTypeLabel(banner.type)}</span>
                                    <span style={{ color: THEME.muted }}>•</span>
                                    <span>Pos {banner.position}</span>
                                    <span style={{ color: THEME.muted }}>•</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {banner.updated_at}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="font-semibold text-sm" style={{ color: THEME.white }}>{(banner.views || 0).toLocaleString()}</div>
                                <div className="text-[11px] tracking-wide" style={{ color: THEME.muted }}>Views</div>
                            </div>
                            <div className="w-px h-4" style={{ backgroundColor: THEME.border }}></div>
                            <div className="flex items-center gap-2">
                                <div className="font-semibold text-sm" style={{ color: THEME.white }}>{(banner.clicks || 0).toLocaleString()}</div>
                                <div className="text-[11px] tracking-wide" style={{ color: THEME.muted }}>Clicks</div>
                            </div>
                            <div className="w-px h-4" style={{ backgroundColor: THEME.border }}></div>
                            <div className="flex items-center gap-2">
                                <div className="font-semibold text-sm" style={{ color: THEME.white }}>{banner.ctr || '-'}</div>
                                <div className="text-[11px] tracking-wide" style={{ color: THEME.muted }}>CTR</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-3">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all" style={{ backgroundColor: THEME.background, color: THEME.secondaryText, borderColor: THEME.border }}>
                            <Eye className="w-3.5 h-3.5" />
                            Preview
                        </button>
                        <Link
                            href={route('admin.cms.banners.create', { type: banner.type, bannerId: banner.id })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-white"
                            style={{ backgroundColor: THEME.primaryBlue }}
                        >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                        </Link>
                        <button className="p-1.5 rounded-lg border transition-all" style={{ backgroundColor: THEME.background, color: THEME.secondaryText, borderColor: THEME.border }}>
                            <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg border transition-all" style={{ backgroundColor: THEME.background, color: THEME.secondaryText, borderColor: THEME.border }}>
                            <BarChart3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => handleDelete(banner.id)}
                            className="p-1.5 rounded-lg border transition-all"
                            style={{ backgroundColor: THEME.background, color: THEME.secondaryText, borderColor: THEME.border }}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Banner Management" />

            <div style={{ backgroundColor: THEME.background }}>
                {/* Breadcrumb */}
                <div className="px-8 pt-6 pb-3">
                    <div className="flex items-center gap-2 text-xs" style={{ color: THEME.muted }}>
                        <span className="hover:text-gray-300 cursor-pointer">Dashboard</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="hover:text-gray-300 cursor-pointer">CMS</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span style={{ color: THEME.white }}>Banners</span>
                    </div>
                </div>

                <div className="px-8 pb-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 tracking-tight" style={{ color: THEME.white }}>Banner Management</h1>
                            <p className="text-sm" style={{ color: THEME.secondaryText }}>Manage homepage campaigns, promotional banners and marketing visuals.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={route('admin.cms.banners.create', { type: selectedType })}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white text-sm"
                                style={{ background: `linear-gradient(135deg, ${THEME.primaryBlue}, ${THEME.purple})` }}
                            >
                                <Plus className="w-4 h-4" />
                                Create Banner
                            </Link>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            icon={ImageIcon}
                            label="Total Banners"
                            value={stats.total}
                            description="All banners in system"
                            color="#4F6DFF"
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Published"
                            value={stats.published}
                            description="Live on website"
                            color="#10B981"
                        />
                        <StatCard
                            icon={Clock}
                            label="Scheduled"
                            value={stats.scheduled}
                            description="Upcoming campaigns"
                            color="#F59E0B"
                        />
                        <StatCard
                            icon={Users}
                            label="Draft"
                            value={stats.draft}
                            description="Unpublished banners"
                            color="#6B7280"
                        />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex items-center gap-1 mb-6" style={{ borderBottom: `1px solid ${THEME.border}` }}>
                        {bannerTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => handleTypeChange(type.id)}
                                className={`relative px-5 py-3 text-sm font-medium transition-all duration-200 ${
                                    selectedType === type.id
                                        ? 'text-white'
                                        : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                {type.label}
                                {selectedType === type.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: THEME.primaryBlue, boxShadow: `0 0 20px ${THEME.primaryBlue}80` }} />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: THEME.muted }} />
                                <input
                                    type="text"
                                    placeholder="Search Banner..."
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
                                    style={{ backgroundColor: THEME.card, border: `1px solid ${THEME.border}`, color: THEME.white }}
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all" style={{ backgroundColor: THEME.card, color: THEME.secondaryText, border: `1px solid ${THEME.border}` }}>
                                <Filter className="w-3.5 h-3.5" />
                                Filter
                            </button>
                            <select className="px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all" style={{ backgroundColor: THEME.card, color: THEME.secondaryText, border: `1px solid ${THEME.border}` }}>
                                <option value="">Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="scheduled">Scheduled</option>
                            </select>
                            <select className="px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all" style={{ backgroundColor: THEME.card, color: THEME.secondaryText, border: `1px solid ${THEME.border}` }}>
                                <option value="latest">Latest</option>
                                <option value="oldest">Oldest</option>
                                <option value="name">Name A-Z</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all" style={{ backgroundColor: THEME.card, color: THEME.secondaryText, border: `1px solid ${THEME.border}` }}>
                                <Upload className="w-3.5 h-3.5" />
                                Import
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all" style={{ backgroundColor: THEME.card, color: THEME.secondaryText, border: `1px solid ${THEME.border}` }}>
                                <Download className="w-3.5 h-3.5" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Banner Cards */}
                        <div className="lg:col-span-3">
                            <div className="space-y-4">
                                {displayBanners.map((banner) => (
                                    <BannerCard key={banner.id} banner={banner} />
                                ))}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-1 space-y-4">
                            {/* Campaign Overview */}
                            <div className="rounded-2xl p-5" style={{ backgroundColor: THEME.card, border: `1px solid ${THEME.border}` }}>
                                <h3 className="text-sm font-semibold mb-4 tracking-tight" style={{ color: THEME.white }}>Campaign Overview</h3>
                                {/* Mini Line Chart */}
                                <div className="mb-4 h-20 flex items-end gap-1">
                                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((height, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 rounded-t transition-all hover:opacity-80"
                                            style={{ height: `${height}%`, backgroundColor: `${THEME.primaryBlue}33` }}
                                        />
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: THEME.secondaryText }}>Active Campaigns</span>
                                        <span className="font-semibold text-sm" style={{ color: THEME.white }}>{stats.published}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: THEME.secondaryText }}>Upcoming Schedule</span>
                                        <span className="font-semibold text-sm" style={{ color: THEME.white }}>{stats.scheduled}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: THEME.secondaryText }}>Total Clicks</span>
                                        <span className="font-semibold text-sm" style={{ color: THEME.white }}>284.5K</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs" style={{ color: THEME.secondaryText }}>Total Impressions</span>
                                        <span className="font-semibold text-sm" style={{ color: THEME.white }}>1.2M</span>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Guide */}
                            <div className="rounded-2xl p-5" style={{ backgroundColor: THEME.card, border: `1px solid ${THEME.border}` }}>
                                <h3 className="text-sm font-semibold mb-4 tracking-tight" style={{ color: THEME.white }}>Upload Guide</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium mb-2 text-xs" style={{ color: THEME.primaryBlue }}>Recommended Hero Size</h4>
                                        <div className="text-lg font-semibold tracking-tight" style={{ color: THEME.white }}>1920 × 800</div>
                                    </div>
                                    <div className="pt-4 space-y-2" style={{ borderTop: `1px solid ${THEME.border}` }}>
                                        <div className="flex items-center justify-between text-xs" style={{ color: THEME.secondaryText }}>
                                            <span>Maximum File Size</span>
                                            <span style={{ color: THEME.white }}>2 MB</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs" style={{ color: THEME.secondaryText }}>
                                            <span>Supported Format</span>
                                            <span style={{ color: THEME.white }}>JPG · PNG · WEBP</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="rounded-2xl p-5" style={{ backgroundColor: THEME.card, border: `1px solid ${THEME.border}` }}>
                                <h3 className="text-sm font-semibold mb-4 tracking-tight" style={{ color: THEME.white }}>Tips</h3>
                                <ul className="space-y-3 text-xs" style={{ color: THEME.secondaryText }}>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5" style={{ color: THEME.primaryBlue }}>•</span>
                                        <span>Use high-quality images</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5" style={{ color: THEME.primaryBlue }}>•</span>
                                        <span>Keep text short</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5" style={{ color: THEME.primaryBlue }}>•</span>
                                        <span>Leave enough white space</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-0.5" style={{ color: THEME.primaryBlue }}>•</span>
                                        <span>Maintain brand consistency</span>
                                    </li>
                                </ul>
                                <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-all" style={{ backgroundColor: THEME.background, color: THEME.primaryBlue, borderColor: THEME.border }}>
                                    Learn More
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
