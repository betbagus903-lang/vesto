import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Search, BookOpen, Video, FileText, ExternalLink, ArrowRight, Headphones } from 'lucide-react';
import Navbar from '../Components/Shared/Navbar';

export default function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('guides');

    const HELP_CATEGORIES = [
        {
            id: 'getting-started',
            name: 'Getting Started',
            icon: '🚀',
            description: 'Learn the basics of using Vesto',
            articles: [
                { title: 'How to create an account', readTime: '3 min' },
                { title: 'How to browse products', readTime: '2 min' },
                { title: 'How to add items to cart', readTime: '2 min' },
                { title: 'How to checkout', readTime: '4 min' },
            ],
        },
        {
            id: 'orders',
            name: 'Orders',
            icon: '📦',
            description: 'Everything about your orders',
            articles: [
                { title: 'How to track your order', readTime: '2 min' },
                { title: 'How to cancel an order', readTime: '3 min' },
                { title: 'How to reorder items', readTime: '2 min' },
                { title: 'Understanding order status', readTime: '3 min' },
            ],
        },
        {
            id: 'payments',
            name: 'Payments',
            icon: '💳',
            description: 'Payment methods and billing',
            articles: [
                { title: 'Accepted payment methods', readTime: '2 min' },
                { title: 'How to use COD', readTime: '3 min' },
                { title: 'Payment security', readTime: '2 min' },
                { title: 'Getting payment receipts', readTime: '2 min' },
            ],
        },
        {
            id: 'shipping',
            name: 'Shipping',
            icon: '🚚',
            description: 'Shipping information and options',
            articles: [
                { title: 'Shipping options and costs', readTime: '3 min' },
                { title: 'Free shipping eligibility', readTime: '2 min' },
                { title: 'International shipping', readTime: '2 min' },
                { title: 'Shipping to multiple addresses', readTime: '2 min' },
            ],
        },
        {
            id: 'returns',
            name: 'Returns & Refunds',
            icon: '↩️',
            description: 'Return policy and process',
            articles: [
                { title: 'Return policy overview', readTime: '3 min' },
                { title: 'How to request a return', readTime: '4 min' },
                { title: 'Refund processing time', readTime: '2 min' },
                { title: 'Exchange process', readTime: '3 min' },
            ],
        },
        {
            id: 'account',
            name: 'Account',
            icon: '👤',
            description: 'Manage your account settings',
            articles: [
                { title: 'Updating profile information', readTime: '2 min' },
                { title: 'Managing addresses', readTime: '2 min' },
                { title: 'Changing password', readTime: '2 min' },
                { title: 'Account security tips', readTime: '3 min' },
            ],
        },
    ];

    const VIDEO_TUTORIALS = [
        { title: 'How to place your first order', duration: '5:30', thumbnail: '🎬' },
        { title: 'Using the size guide', duration: '3:15', thumbnail: '🎬' },
        { title: 'Tracking your order', duration: '2:45', thumbnail: '🎬' },
        { title: 'Requesting a return', duration: '4:00', thumbnail: '🎬' },
    ];

    const QUICK_LINKS = [
        { title: 'Track Order', href: '/buyer/orders', icon: '📦' },
        { title: 'Contact Support', href: '/contact', icon: '💬' },
        { title: 'FAQ', href: '/faq', icon: '❓' },
        { title: 'Return Policy', href: '/help/returns', icon: '↩️' },
    ];

    const filteredCategories = HELP_CATEGORIES.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.articles.some(article => article.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Top Bar */}
            <div className="bg-gray-900 text-white text-center py-2.5 text-xs tracking-widest font-medium">
                FREE SHIPPING ON ORDERS ABOVE RP200.000
            </div>

            <Navbar />

            {/* Header */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <Headphones className="w-16 h-16 text-gray-900 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Find guides, tutorials, and resources to help you get the most out of Vesto.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="max-w-2xl mx-auto px-6 -mt-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for help articles..."
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl shadow-lg focus:outline-none focus:border-gray-400 bg-white"
                    />
                </div>
            </div>

            {/* Quick Links */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {QUICK_LINKS.map((link) => (
                        <Link
                            key={link.title}
                            href={link.href}
                            className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
                        >
                            <span className="text-2xl">{link.icon}</span>
                            <span className="font-medium text-gray-900">{link.title}</span>
                            <ArrowRight className="ml-auto text-gray-400" size={16} />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex gap-4 border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab('guides')}
                        className={`pb-4 px-2 font-medium transition-colors ${
                            activeTab === 'guides'
                                ? 'text-gray-900 border-b-2 border-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Guides
                    </button>
                    <button
                        onClick={() => setActiveTab('videos')}
                        className={`pb-4 px-2 font-medium transition-colors ${
                            activeTab === 'videos'
                                ? 'text-gray-900 border-b-2 border-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Video Tutorials
                    </button>
                </div>

                {/* Guides Tab */}
                {activeTab === 'guides' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {filteredCategories.map((category) => (
                            <div key={category.id} className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl">{category.icon}</span>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                        <p className="text-sm text-gray-500">{category.description}</p>
                                    </div>
                                </div>
                                <ul className="space-y-3">
                                    {category.articles.map((article, index) => (
                                        <li key={index}>
                                            <Link
                                                href={`/help/${category.id}/${index}`}
                                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                            >
                                                <FileText size={14} />
                                                {article.title}
                                                <span className="ml-auto text-xs text-gray-400">{article.readTime}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                {/* Videos Tab */}
                {activeTab === 'videos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {VIDEO_TUTORIALS.map((video, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
                                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                    <span className="text-4xl">{video.thumbnail}</span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Video size={14} />
                                        <span>{video.duration}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Contact CTA */}
            <div className="bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
                    <p className="text-gray-600 mb-6">
                        Our support team is available 24/7 to assist you with any questions.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/contact"
                            className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <BookOpen size={18} />
                            Contact Support
                        </Link>
                        <Link
                            href="/faq"
                            className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            View FAQ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
