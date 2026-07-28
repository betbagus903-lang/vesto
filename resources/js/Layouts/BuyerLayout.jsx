import { Link, router, usePage } from '@inertiajs/react';

export default function BuyerLayout({ children, title }) {
    const { auth } = usePage().props;

    const menuItems = [
        { name: 'Profile', href: '/buyer/profile', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
        )},
        { name: 'Orders', href: '/buyer/orders', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z"/>
            </svg>
        )},
        { name: 'Wishlist', href: '/buyer/wishlist', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
        )},
        { name: 'Addresses', href: '/buyer/addresses', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
        )},
        { name: 'Reviews', href: '/buyer/reviews', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
        )},
    ];

    return (
        <div className="min-h-screen bg-gray-50" style={{fontFamily: "'Inter', sans-serif"}}>
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black tracking-widest text-gray-900">VESTO</Link>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                        <span>›</span>
                        <Link href="/buyer/dashboard" className="hover:text-gray-900 transition-colors">My Account</Link>
                        <span>›</span>
                        <span className="text-gray-900 font-medium">{title}</span>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid lg:grid-cols-4 gap-8">

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* User Card */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-black flex-shrink-0">
                                    {auth?.user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-gray-900 text-sm truncate">Hello! {auth?.user?.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{auth?.user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu */}
                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">My Account</p>
                            </div>
                            <nav className="py-2">
                                {menuItems.map((item) => {
                                    const isActive = window.location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                                                isActive
                                                    ? 'bg-gray-900 text-white font-semibold'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {item.icon}
                                                <span>{item.name}</span>
                                            </div>
                                            <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="border-t border-gray-100 py-2">
                                <button
                                    onClick={() => router.post('/logout')}
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}