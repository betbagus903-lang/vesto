import { Link } from '@inertiajs/react';

export default function Welcome({ canLogin, canRegister, auth }) {
    return (
        <div className="min-h-screen bg-white" style={{fontFamily: "'Inter', sans-serif"}}>

            {/* Top Bar */}
            <div className="bg-gray-900 text-white text-center py-2 text-xs tracking-widest">
                FREE SHIPPING ON ORDERS ABOVE RP200.000 — SHOP NOW
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <span className="text-2xl font-black tracking-widest text-gray-900">VESTO</span>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                        <a href="#" className="hover:text-gray-900 transition-colors">Home</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Men</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Women</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Accessories</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Sale</a>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <button className="text-gray-600 hover:text-gray-900">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                            </svg>
                        </button>
                        {/* Cart */}
                        <button className="text-gray-600 hover:text-gray-900 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z"/>
                            </svg>
                        </button>
                        {auth?.user ? (
                            <Link href={auth.user.role === 'admin' ? '/admin' : '/buyer/dashboard'}
                                className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                {canLogin && (
                                    <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                        Login
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link href="/register" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors">
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="bg-gray-950 min-h-screen flex items-center relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900 to-transparent z-10"></div>
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <svg className="w-64 h-64 text-gray-700" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <rect width="200" height="200" fill="#1f2937"/>
                            <path d="M60 60 L100 40 L140 60 L150 90 L130 90 L130 160 L70 160 L70 90 L50 90 Z" fill="#374151" stroke="#4b5563" strokeWidth="2"/>
                            <circle cx="100" cy="55" r="15" fill="#4b5563"/>
                        </svg>
                    </div>
                </div>
                <div className="relative z-20 max-w-7xl mx-auto px-6 py-32">
                    <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4 block">New Collection — 2026</span>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6">
                        WEAR<br/>
                        <span className="text-gray-400">YOUR</span><br/>
                        STORY
                    </h1>
                    <p className="text-gray-400 text-lg mb-10 max-w-md leading-relaxed">
                        Fashion that defines who you are. Explore our latest collection crafted for the bold and the beautiful.
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                        <Link href="/register" className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
                            Shop Now
                        </Link>
                        <a href="#categories" className="text-white border border-gray-600 px-8 py-4 rounded-full font-bold text-sm hover:border-white transition-colors">
                            View Collections
                        </a>
                    </div>
                    <div className="flex items-center gap-10 mt-16">
                        <div>
                            <p className="text-3xl font-black text-white">10K+</p>
                            <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">Customers</p>
                        </div>
                        <div className="w-px h-10 bg-gray-700"></div>
                        <div>
                            <p className="text-3xl font-black text-white">500+</p>
                            <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">Products</p>
                        </div>
                        <div className="w-px h-10 bg-gray-700"></div>
                        <div>
                            <p className="text-3xl font-black text-white">50+</p>
                            <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">Brands</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section id="categories" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Explore</span>
                            <h2 className="text-4xl font-black text-gray-900 mt-1">Shop by Category</h2>
                        </div>
                        <a href="#" className="text-sm font-semibold text-gray-900 border-b border-gray-900 pb-1 hover:text-gray-600 transition-colors">
                            View All
                        </a>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: 'Men', desc: "Men's Collection", color: 'bg-gray-900', textColor: 'text-white', icon: (
                                <svg className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                            )},
                            { name: 'Women', desc: "Women's Collection", color: 'bg-gray-100', textColor: 'text-gray-900', icon: (
                                <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                            )},
                            { name: 'Accessories', desc: 'Bags & More', color: 'bg-gray-50', textColor: 'text-gray-900', icon: (
                                <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                                </svg>
                            )},
                            { name: 'Footwear', desc: 'Shoes & Sneakers', color: 'bg-gray-900', textColor: 'text-white', icon: (
                                <svg className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M3 14h18"/>
                                </svg>
                            )},
                        ].map((cat) => (
                            <div key={cat.name} className={`${cat.color} rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 transition-transform duration-300 min-h-48`}>
                                {cat.icon}
                                <p className={`font-black text-lg mt-4 ${cat.textColor}`}>{cat.name}</p>
                                <p className={`text-xs mt-1 ${cat.textColor} opacity-60`}>{cat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Banner */}
            <section className="py-24 bg-gray-950">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-3xl p-12 border border-gray-700 min-h-72 flex flex-col justify-between">
                        <div>
                            <span className="text-xs tracking-widest text-gray-400 uppercase font-semibold">New Arrival</span>
                            <h3 className="text-4xl font-black text-white mt-3 leading-tight">Men's<br/>New Drop</h3>
                            <p className="text-gray-400 text-sm mt-3">Bold styles for the modern man. Limited stock available.</p>
                        </div>
                        <Link href="/register" className="mt-8 w-fit border border-gray-500 text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-gray-900 transition-all">
                            Shop Men →
                        </Link>
                    </div>
                    <div className="bg-gray-100 rounded-3xl p-12 min-h-72 flex flex-col justify-between">
                        <div>
                            <span className="text-xs tracking-widest text-gray-400 uppercase font-semibold">New Arrival</span>
                            <h3 className="text-4xl font-black text-gray-900 mt-3 leading-tight">Women's<br/>New Drop</h3>
                            <p className="text-gray-500 text-sm mt-3">Elegant pieces for every occasion. Fresh styles just landed.</p>
                        </div>
                        <Link href="/register" className="mt-8 w-fit border border-gray-300 text-gray-900 text-sm font-semibold px-6 py-3 rounded-full hover:bg-gray-900 hover:text-white transition-all">
                            Shop Women →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-16 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { title: 'Free Shipping', desc: 'On orders above Rp200k', icon: (
                            <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                            </svg>
                        )},
                        { title: 'Easy Return', desc: '30 days return policy', icon: (
                            <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                            </svg>
                        )},
                        { title: 'Secure Payment', desc: '100% secure transactions', icon: (
                            <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                        )},
                        { title: '24/7 Support', desc: 'Always here for you', icon: (
                            <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                            </svg>
                        )},
                    ].map((item) => (
                        <div key={item.title} className="flex flex-col items-center text-center gap-3">
                            {item.icon}
                            <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-950 text-gray-400 py-20">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
                    <div>
                        <span className="text-2xl font-black text-white tracking-widest">VESTO</span>
                        <p className="text-sm mt-4 leading-relaxed">Premium fashion for the bold and the beautiful. Quality you can feel, style you can trust.</p>
                        <div className="flex gap-4 mt-6">
                            {['IG', 'TK', 'TW'].map((s) => (
                                <a key={s} href="#" className="w-9 h-9 border border-gray-700 rounded-full flex items-center justify-center text-xs font-bold hover:border-white hover:text-white transition-all">
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-white font-bold mb-4 text-sm tracking-widest uppercase">Shop</p>
                        <ul className="space-y-3 text-sm">
                            {['Men', 'Women', 'Accessories', 'Sale'].map((i) => (
                                <li key={i}><a href="#" className="hover:text-white transition-colors">{i}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-white font-bold mb-4 text-sm tracking-widest uppercase">Help</p>
                        <ul className="space-y-3 text-sm">
                           {[
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Contact Us', href: '/contact' },
].map((i) => (
    <li key={i.name}><a href={i.href} className="hover:text-white transition-colors">{i.name}</a></li>
))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-white font-bold mb-4 text-sm tracking-widest uppercase">Newsletter</p>
                        <p className="text-sm mb-4">Get the latest drops & exclusive offers.</p>
                        <div className="flex gap-2">
                            <input type="email" placeholder="your@email.com" className="flex-1 bg-gray-800 text-white text-sm px-4 py-2 rounded-full border border-gray-700 focus:outline-none focus:border-gray-500"/>
                            <button className="bg-white text-gray-900 text-sm font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                                →
                            </button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <span>© 2026 Vesto. All rights reserved.</span>
                    <div className="flex gap-6">
                     <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
<a href="/terms" className="hover:text-white transition-colors">Terms of Use</a>
<a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}