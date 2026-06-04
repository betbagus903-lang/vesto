import { Link } from '@inertiajs/react';
import { useState } from 'react';

const faqs = [
    {
        category: 'Orders & Payment',
        items: [
            { q: 'How do I place an order?', a: 'Browse our collections, select your size and color, add to cart, and proceed to checkout. You can pay via credit card, debit card, or bank transfer.' },
            { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, GoPay, OVO, DANA, and bank transfers from all major Indonesian banks.' },
            { q: 'Can I modify or cancel my order?', a: 'Orders can be modified or cancelled within 1 hour of placement. After that, the order enters processing and cannot be changed.' },
            { q: 'Is it safe to shop on Vesto?', a: 'Absolutely. All transactions are secured with SSL encryption and we never store your payment details.' },
        ]
    },
    {
        category: 'Shipping & Delivery',
        items: [
            { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days. Express delivery is available for 1-2 business days at an additional cost.' },
            { q: 'Do you offer free shipping?', a: 'Yes! Free shipping on all orders above Rp200.000. Orders below that are charged a flat rate of Rp25.000.' },
            { q: 'Do you ship internationally?', a: 'Currently we only ship within Indonesia. International shipping will be available soon.' },
            { q: 'How can I track my order?', a: 'Once your order is shipped, you will receive a tracking number via email. You can track your package on the courier\'s website.' },
        ]
    },
    {
        category: 'Returns & Refunds',
        items: [
            { q: 'What is your return policy?', a: 'We offer a 30-day return policy for all unworn, unwashed items with original tags attached.' },
            { q: 'How do I initiate a return?', a: 'Contact our support team via email or WhatsApp with your order number and reason for return. We will guide you through the process.' },
            { q: 'When will I receive my refund?', a: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item.' },
            { q: 'Are sale items returnable?', a: 'Sale items are final sale and cannot be returned unless they are defective or damaged.' },
        ]
    },
    {
        category: 'Products & Sizing',
        items: [
            { q: 'How do I find my size?', a: 'Each product page includes a detailed size guide. We recommend measuring yourself and comparing with our size chart for the best fit.' },
            { q: 'Are your products authentic?', a: 'Yes, all Vesto products are 100% authentic and sourced directly from verified manufacturers and brands.' },
            { q: 'What if I receive a defective item?', a: 'If you receive a defective or damaged item, contact us within 48 hours with photos. We will replace it or issue a full refund.' },
        ]
    },
];

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-5 text-left gap-4"
            >
                <span className="text-sm font-semibold text-gray-900">{q}</span>
                <span className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-45' : ''}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                </span>
            </button>
            {open && (
                <p className="text-sm text-gray-500 leading-relaxed pb-5">{a}</p>
            )}
        </div>
    );
}

export default function Faq() {
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
            <div className="border-b border-gray-100 bg-gray-950 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Help Center</span>
                    <h1 className="text-5xl font-black text-white mt-2 mb-4" style={{letterSpacing: '-0.03em'}}>
                        Frequently Asked<br/>Questions
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl">
                        Find answers to the most common questions about shopping at Vesto.
                    </p>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Categories</p>
                            <ul className="space-y-2">
                                {faqs.map((cat) => (
                                    <li key={cat.category}>
                                        <a href={`#${cat.category.replace(/\s+/g, '-').toLowerCase()}`}
                                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                                            {cat.category}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10 p-6 bg-gray-950 rounded-2xl">
                                <p className="text-white font-bold text-sm mb-2">Still need help?</p>
                                <p className="text-gray-400 text-xs mb-4">Our team is ready to assist you.</p>
                                <Link href="/contact"
                                    className="block text-center bg-white text-gray-900 text-xs font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors">
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* FAQ List */}
                    <div className="lg:col-span-2 space-y-12">
                        {faqs.map((cat) => (
                            <div key={cat.category} id={cat.category.replace(/\s+/g, '-').toLowerCase()}>
                                <h2 className="text-lg font-black text-gray-900 mb-4 pb-4 border-b-2 border-gray-900 inline-block">
                                    {cat.category}
                                </h2>
                                <div className="bg-white border border-gray-100 rounded-2xl px-6 shadow-sm">
                                    {cat.items.map((item) => (
                                        <FaqItem key={item.q} q={item.q} a={item.a} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer simple */}
            <div className="border-t border-gray-100 py-8 text-center">
                <p className="text-xs text-gray-400">© 2026 Vesto. All rights reserved.</p>
            </div>
        </div>
    );
}