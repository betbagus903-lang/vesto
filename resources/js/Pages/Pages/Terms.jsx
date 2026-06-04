import { Link } from '@inertiajs/react';

const sections = [
    {
        title: 'Acceptance of Terms',
        content: 'By accessing and using the Vesto website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this website.'
    },
    {
        title: 'Use of Website',
        content: 'You may use our website for lawful purposes only. You must not use our website in any way that breaches any applicable local, national, or international law or regulation, or to send, knowingly receive, upload, download, use or re-use any material which is harmful, offensive, or infringes any intellectual property rights.'
    },
    {
        title: 'Account Registration',
        content: 'To access certain features of our website, you may be required to register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. You are responsible for maintaining the confidentiality of your account credentials.'
    },
    {
        title: 'Products & Pricing',
        content: 'All products are subject to availability. We reserve the right to discontinue any product at any time. Prices for products are subject to change without notice. We reserve the right to modify or discontinue any service without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of service.'
    },
    {
        title: 'Orders & Payment',
        content: 'By placing an order, you are making an offer to purchase a product. We reserve the right to refuse or cancel any order for any reason. Payment must be received in full before we dispatch your order. We accept various payment methods as listed on our website.'
    },
    {
        title: 'Intellectual Property',
        content: 'The content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Vesto and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.'
    },
    {
        title: 'Limitation of Liability',
        content: 'To the fullest extent permitted by law, Vesto shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our services.'
    },
    {
        title: 'Governing Law',
        content: 'These terms shall be governed and construed in accordance with the laws of Indonesia, without regard to its conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Indonesia.'
    },
];

export default function Terms() {
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
                    <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Legal</span>
                    <h1 className="text-5xl font-black text-white mt-2 mb-4" style={{letterSpacing: '-0.03em'}}>
                        Terms of Service
                    </h1>
                    <p className="text-gray-400 text-sm">Last updated: June 2026</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-4 gap-16">

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Contents</p>
                            <ul className="space-y-2">
                                {sections.map((s, i) => (
                                    <li key={s.title}>
                                        <a href={`#section-${i}`}
                                            className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                            {i + 1}. {s.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3 space-y-10">
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Welcome to Vesto. These Terms of Service govern your use of our website and services. By using Vesto, you agree to these terms. Please read them carefully before making a purchase or using our services.
                            </p>
                        </div>

                        {sections.map((s, i) => (
                            <div key={s.title} id={`section-${i}`}>
                                <h2 className="text-xl font-black text-gray-900 mb-3">
                                    {i + 1}. {s.title}
                                </h2>
                                <p className="text-sm text-gray-600 leading-relaxed">{s.content}</p>
                            </div>
                        ))}

                        <div className="p-8 bg-gray-950 rounded-2xl">
                            <h2 className="text-xl font-black text-white mb-3">Questions?</h2>
                            <p className="text-gray-400 text-sm mb-4">
                                If you have any questions about these Terms, please contact us.
                            </p>
                            <Link href="/contact"
                                className="inline-block bg-white text-gray-900 font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
                                Get in Touch →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 py-8 text-center">
                <p className="text-xs text-gray-400">© 2026 Vesto. All rights reserved.</p>
            </div>
        </div>
    );
}