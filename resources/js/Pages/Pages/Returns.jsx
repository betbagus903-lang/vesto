import { Link } from '@inertiajs/react';

const steps = [
    { step: '01', title: 'Initiate Return', desc: 'Contact us within 30 days of delivery with your order number and reason for return.' },
    { step: '02', title: 'Get Approval', desc: 'Our team will review your request and send you a return authorization within 24 hours.' },
    { step: '03', title: 'Ship It Back', desc: 'Pack the item securely and ship it to our address using the provided return label.' },
    { step: '04', title: 'Get Refund', desc: 'Once we receive and inspect the item, your refund will be processed within 5-7 business days.' },
];

const eligible = [
    'Unworn and unwashed items',
    'Items with original tags still attached',
    'Items in original packaging',
    'Items returned within 30 days of delivery',
    'Defective or damaged items (within 48 hours)',
];

const notEligible = [
    'Sale or discounted items',
    'Worn, washed, or altered items',
    'Items without original tags',
    'Intimate apparel and swimwear',
    'Items damaged due to misuse',
    'Items returned after 30 days',
];

export default function Returns() {
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
                        Returns &<br/>Refunds
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl">
                        We want you to love everything you buy. If something isn't right, we'll make it right.
                    </p>
                    <div className="flex gap-6 mt-8">
                        <div>
                            <p className="text-3xl font-black text-white">30</p>
                            <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">Days Return</p>
                        </div>
                        <div className="w-px bg-gray-800"></div>
                        <div>
                            <p className="text-3xl font-black text-white">5-7</p>
                            <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">Days Refund</p>
                        </div>
                        <div className="w-px bg-gray-800"></div>
                        <div>
                            <p className="text-3xl font-black text-white">100%</p>
                            <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">Satisfaction</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">

                {/* Return Process */}
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Process</span>
                    <h2 className="text-3xl font-black text-gray-900 mt-1 mb-8">How to Return</h2>
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

                {/* Eligible / Not Eligible */}
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Policy</span>
                    <h2 className="text-3xl font-black text-gray-900 mt-1 mb-8">Return Eligibility</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="border border-gray-100 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                    </svg>
                                </div>
                                <h3 className="font-black text-gray-900">Eligible for Return</h3>
                            </div>
                            <ul className="space-y-3">
                                {eligible.map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="border border-gray-100 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </div>
                                <h3 className="font-black text-gray-900">Not Eligible for Return</h3>
                            </div>
                            <ul className="space-y-3">
                                {notEligible.map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                                        <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gray-950 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-white mb-2">Need to start a return?</h2>
                        <p className="text-gray-400 text-sm">Our support team is ready to help you through the process.</p>
                    </div>
                    <Link href="/contact"
                        className="bg-white text-gray-900 font-black text-sm px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap">
                        Contact Support →
                    </Link>
                </div>
            </div>

            <div className="border-t border-gray-100 py-8 text-center">
                <p className="text-xs text-gray-400">© 2026 Vesto. All rights reserved.</p>
            </div>
        </div>
    );
}