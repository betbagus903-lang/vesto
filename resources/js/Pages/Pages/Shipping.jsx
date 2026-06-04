import { Link } from '@inertiajs/react';

const shippingOptions = [
    {
        name: 'Regular Shipping',
        duration: '3-5 Business Days',
        cost: 'Rp25.000',
        free: 'Free above Rp200.000',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
            </svg>
        )
    },
    {
        name: 'Express Shipping',
        duration: '1-2 Business Days',
        cost: 'Rp50.000',
        free: 'Free above Rp500.000',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
        )
    },
    {
        name: 'Same Day Delivery',
        duration: 'Same Day (order before 12.00)',
        cost: 'Rp75.000',
        free: 'Selected cities only',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        )
    },
];

const couriers = ['JNE', 'J&T Express', 'SiCepat', 'Anteraja', 'GoSend', 'GrabExpress'];

const steps = [
    { step: '01', title: 'Order Placed', desc: 'Your order is confirmed and payment verified.' },
    { step: '02', title: 'Processing', desc: 'We prepare and pack your items with care.' },
    { step: '03', title: 'Shipped', desc: 'Your package is handed to the courier.' },
    { step: '04', title: 'Delivered', desc: 'Package arrives at your doorstep.' },
];

export default function Shipping() {
    return (
        <div className="min-h-screen bg-white" style={{fontFamily: "'Inter', sans-serif"}}>
            {/* Navbar */}
            <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
                <Link href="/" className="text-2xl font-black tracking-widest text-gray-900">VESTO</Link>
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Back to Home
                </Link>
            </nav>

            {/* Hero */}
            <div className="bg-gray-950 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Help Center</span>
                    <h1 className="text-5xl font-black text-white mt-2 mb-4" style={{letterSpacing: '-0.03em'}}>
                        Shipping &<br/>Delivery
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl">
                        Everything you need to know about our shipping options and delivery process.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">

                {/* Shipping Options */}
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Options</span>
                    <h2 className="text-3xl font-black text-gray-900 mt-1 mb-8">Shipping Methods</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {shippingOptions.map((opt) => (
                            <div key={opt.name} className="border border-gray-100 rounded-2xl p-8 hover:border-gray-900 transition-colors">
                                <div className="text-gray-700 mb-4">{opt.icon}</div>
                                <h3 className="font-black text-gray-900 text-lg mb-1">{opt.name}</h3>
                                <p className="text-2xl font-black text-gray-900 mb-1">{opt.cost}</p>
                                <p className="text-sm text-gray-500 mb-3">{opt.duration}</p>
                                <p className="text-xs text-green-600 font-semibold">{opt.free}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delivery Process */}
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Process</span>
                    <h2 className="text-3xl font-black text-gray-900 mt-1 mb-8">How It Works</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {steps.map((s, i) => (
                            <div key={s.step} className="relative">
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gray-200 z-0"></div>
                                )}
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-black mb-4">
                                        {s.step}
                                    </div>
                                    <h3 className="font-black text-gray-900 mb-2">{s.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Couriers */}
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Partners</span>
                    <h2 className="text-3xl font-black text-gray-900 mt-1 mb-8">Our Courier Partners</h2>
                    <div className="flex flex-wrap gap-4">
                        {couriers.map((c) => (
                            <div key={c} className="border border-gray-200 rounded-xl px-6 py-4 text-sm font-bold text-gray-700">
                                {c}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Important Notes */}
                <div className="bg-gray-950 rounded-3xl p-10">
                    <h2 className="text-2xl font-black text-white mb-6">Important Notes</h2>
                    <ul className="space-y-3">
                        {[
                            'Orders placed before 3:00 PM WIB on business days will be processed the same day.',
                            'Delivery times are estimates and may vary due to unforeseen circumstances.',
                            'We are not responsible for delays caused by incorrect shipping addresses.',
                            'For bulk orders (10+ items), please contact us for special shipping rates.',
                            'Tracking information will be sent to your email once your order is shipped.',
                        ].map((note, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                                <span className="text-gray-600 mt-0.5 flex-shrink-0">—</span>
                                {note}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-100 py-8 text-center">
                <p className="text-xs text-gray-400">© 2026 Vesto. All rights reserved.</p>
            </div>
        </div>
    );
}