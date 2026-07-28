import { Link } from '@inertiajs/react';

export default function Wishlist({ user }) {
    return (
        <div className="min-h-screen flex" style={{fontFamily: "'Inter', sans-serif"}}>

            {/* Sidebar */}
            <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col fixed top-0 left-0">
                <div className="px-5 py-5 border-b border-gray-100">
                    <Link href={route('home')} className="text-xl font-black tracking-widest text-gray-900">VESTO</Link>
                </div>

                <div className="flex-1 px-3 py-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-3">Account</p>
                    <nav className="flex flex-col gap-1">
                        <Link href={route('buyer.dashboard')}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                            Dashboard
                        </Link>
                        <Link href={route('buyer.orders')}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z"/></svg>
                            My Orders
                        </Link>
                        <Link href={route('buyer.wishlist')}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-100 text-gray-900 text-sm font-bold">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                            Wishlist
                        </Link>
                        <Link href={route('buyer.addresses')}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            Addresses
                        </Link>
                        <Link href={route('buyer.reviews')}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                            Reviews
                        </Link>
                        <Link href={route('buyer.profile')}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            Profile
                        </Link>
                    </nav>

                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-3 mt-6">Shop</p>
                    <nav className="flex flex-col gap-1">
                        <Link href={route('home')}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            Shop Now
                        </Link>
                    </nav>
                </div>

                <div className="border-t border-gray-100 p-3">
                    <div className="flex items-center gap-3 px-3 py-2 mb-1">
                        <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                    </div>
                    <Link href={route('logout')} method="post" as="button"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 text-sm font-semibold transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="ml-56 flex-1 min-h-screen bg-gray-50">
                <div className="px-10 py-10">

                    <div className="mb-8">
                        <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">My Account</span>
                        <h1 className="text-4xl font-black text-gray-900 mt-1" style={{letterSpacing: '-0.02em'}}>
                            Wishlist
                        </h1>
                        <p className="text-gray-500 text-sm mt-2">Items you've saved for later.</p>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                        </div>
                        <p className="font-black text-gray-900 mb-1">Your wishlist is empty</p>
                        <p className="text-sm text-gray-400 mb-6">Save items you love and come back to them later.</p>
                        <Link href={route('home')} className="inline-block bg-gray-900 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors">
                            Shop Now →
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}