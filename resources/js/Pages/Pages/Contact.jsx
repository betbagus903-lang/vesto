import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const contactInfo = [
    {
        title: 'Email Us',
        value: 'support@vesto.com',
        desc: 'We reply within 24 hours',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
        )
    },
    {
        title: 'WhatsApp',
        value: '+62 812-3456-7890',
        desc: 'Mon-Fri, 09:00 - 18:00 WIB',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
        )
    },
    {
        title: 'Instagram',
        value: '@vesto.official',
        desc: 'DM us anytime',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
        )
    },
    {
        title: 'Office',
        value: 'Medan, North Sumatra',
        desc: 'Indonesia',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
        )
    },
];

export default function Contact() {
    const [sent, setSent] = useState(false);
    const { data, setData, processing, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        setSent(true);
        reset();
    };

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
                    <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Get In Touch</span>
                    <h1 className="text-5xl font-black text-white mt-2 mb-4" style={{letterSpacing: '-0.03em'}}>
                        Contact Us
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl">
                        Have a question or need help? We're here for you. Reach out and we'll get back to you as soon as possible.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-5 gap-16">

                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Reach Us</span>
                            <h2 className="text-2xl font-black text-gray-900 mt-1 mb-6">Ways to Connect</h2>
                        </div>

                        {contactInfo.map((info) => (
                            <div key={info.title} className="flex items-start gap-4 p-5 border border-gray-100 rounded-2xl hover:border-gray-300 transition-colors">
                                <div className="w-12 h-12 bg-gray-950 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                                    {info.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{info.title}</p>
                                    <p className="font-black text-gray-900 text-sm">{info.value}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{info.desc}</p>
                                </div>
                            </div>
                        ))}

                        <div className="p-5 bg-gray-950 rounded-2xl">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Business Hours</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Monday - Friday</span>
                                    <span className="text-white font-semibold">09:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Saturday</span>
                                    <span className="text-white font-semibold">10:00 - 15:00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Sunday</span>
                                    <span className="text-gray-600 font-semibold">Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</span>
                            <h2 className="text-2xl font-black text-gray-900 mt-1 mb-6">Send Us a Message</h2>
                        </div>

                        {sent ? (
                            <div className="border border-green-200 bg-green-50 rounded-2xl p-10 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">Message Sent!</h3>
                                <p className="text-gray-500 text-sm mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                                <button
                                    onClick={() => setSent(false)}
                                    className="text-sm font-semibold text-gray-900 underline underline-offset-4"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            className="w-full border border-gray-200 text-gray-900 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gray-900 transition-colors placeholder-gray-300 bg-gray-50"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            className="w-full border border-gray-200 text-gray-900 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gray-900 transition-colors placeholder-gray-300 bg-gray-50"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                        Subject
                                    </label>
                                    <select
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        required
                                        className="w-full border border-gray-200 text-gray-900 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gray-900 transition-colors bg-gray-50"
                                    >
                                        <option value="">Select a topic</option>
                                        <option value="order">Order Issue</option>
                                        <option value="shipping">Shipping & Delivery</option>
                                        <option value="return">Return & Refund</option>
                                        <option value="product">Product Question</option>
                                        <option value="payment">Payment Issue</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                        rows={6}
                                        className="w-full border border-gray-200 text-gray-900 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gray-900 transition-colors placeholder-gray-300 bg-gray-50 resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gray-900 text-white font-black text-sm py-4 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 tracking-widest uppercase"
                                >
                                    Send Message →
                                </button>

                                <p className="text-xs text-gray-400 text-center">
                                    By submitting, you agree to our{' '}
                                    <Link href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</Link>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 py-8 text-center">
                <p className="text-xs text-gray-400">© 2026 Vesto. All rights reserved.</p>
            </div>
        </div>
    );
}