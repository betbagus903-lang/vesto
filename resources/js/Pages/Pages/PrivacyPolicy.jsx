import { Link } from '@inertiajs/react';

const sections = [
    {
        title: 'Information We Collect',
        content: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes your name, email address, shipping address, phone number, and payment information. We also automatically collect certain information when you visit our website, including your IP address, browser type, and browsing behavior.'
    },
    {
        title: 'How We Use Your Information',
        content: 'We use the information we collect to process your orders and payments, send you order confirmations and shipping updates, respond to your comments and questions, send you marketing communications (with your consent), improve our website and services, and comply with legal obligations.'
    },
    {
        title: 'Information Sharing',
        content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.'
    },
    {
        title: 'Data Security',
        content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment transactions are encrypted using SSL technology. However, no method of transmission over the internet is 100% secure.'
    },
    {
        title: 'Cookies',
        content: 'We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with small amounts of data that are stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.'
    },
    {
        title: 'Your Rights',
        content: 'You have the right to access, update, or delete your personal information at any time. You can do this by logging into your account or contacting us directly. You also have the right to opt-out of marketing communications by clicking the unsubscribe link in any email we send.'
    },
    {
        title: 'Third-Party Links',
        content: 'Our website may contain links to third-party websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites. We encourage you to review the privacy policy of every site you visit.'
    },
    {
        title: 'Changes to This Policy',
        content: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of our website after any changes constitutes your acceptance of the new policy.'
    },
];

export default function PrivacyPolicy() {
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
                        Privacy Policy
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
                                At Vesto, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. Please read this policy carefully.
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
                            <h2 className="text-xl font-black text-white mb-3">Contact Us</h2>
                            <p className="text-gray-400 text-sm mb-4">
                                If you have any questions about this Privacy Policy, please contact us.
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