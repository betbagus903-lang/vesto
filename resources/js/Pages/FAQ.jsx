import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';
import Navbar from '../Components/Shared/Navbar';

export default function FAQ() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategory, setExpandedCategory] = useState('all');
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const CATEGORIES = [
        { id: 'orders', name: 'Orders', icon: '📦' },
        { id: 'shipping', name: 'Shipping', icon: '🚚' },
        { id: 'payments', name: 'Payments', icon: '💳' },
        { id: 'returns', name: 'Returns & Refunds', icon: '↩️' },
        { id: 'account', name: 'Account', icon: '👤' },
        { id: 'products', name: 'Products', icon: '👕' },
    ];

    const FAQ_ITEMS = {
        orders: [
            {
                q: 'How do I track my order?',
                a: 'You can track your order by going to "My Orders" in your account and clicking on "Track Order" next to your order. You will also receive email updates with tracking information.',
            },
            {
                q: 'Can I cancel my order after placing it?',
                a: 'Orders can be cancelled within 1 hour of placing them. After that, the order is processed and cannot be cancelled. Please contact our support team if you need assistance.',
            },
            {
                q: 'How do I change my shipping address?',
                a: 'Shipping address can only be changed before the order is processed. Once the order is shipped, the address cannot be changed. Please contact support immediately if you need to make changes.',
            },
        ],
        shipping: [
            {
                q: 'What are your shipping options?',
                a: 'We offer Standard Shipping (3-5 business days) and Express Shipping (1-2 business days). Free shipping is available on orders above Rp200.000.',
            },
            {
                q: 'Do you ship internationally?',
                a: 'Currently, we only ship within Indonesia. We are working on expanding our shipping options to other countries in the near future.',
            },
            {
                q: 'How long does shipping take?',
                a: 'Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. Orders are processed within 24 hours on business days.',
            },
        ],
        payments: [
            {
                q: 'What payment methods do you accept?',
                a: 'We accept bank transfers, credit/debit cards, and Cash on Delivery (COD) for eligible orders. All payments are processed securely.',
            },
            {
                q: 'Is Cash on Delivery available?',
                a: 'Yes, COD is available for orders under Rp1.000.000 within Java island. Additional fees may apply for COD orders.',
            },
            {
                q: 'How do I get a payment receipt?',
                a: 'Payment receipts are automatically sent to your email after successful payment. You can also download them from your account under "Order History".',
            },
        ],
        returns: [
            {
                q: 'What is your return policy?',
                a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original condition with tags attached. Some items like sale items are non-returnable.',
            },
            {
                q: 'How do I request a return?',
                a: 'Go to "My Orders", select the order you want to return, and click "Request Return". Follow the steps to select items and provide a reason.',
            },
            {
                q: 'How long does refund processing take?',
                a: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method.',
            },
        ],
        account: [
            {
                q: 'How do I create an account?',
                a: 'Click on "Sign Up" at the top right of the page. Fill in your details and verify your email address. You can also sign up using your social media accounts.',
            },
            {
                q: 'I forgot my password. What should I do?',
                a: 'Click on "Forgot Password" on the login page. Enter your email address and we will send you a link to reset your password.',
            },
            {
                q: 'How do I update my account information?',
                a: 'Log in to your account and go to "Account Settings". From there, you can update your personal information, shipping addresses, and preferences.',
            },
        ],
        products: [
            {
                q: 'How do I know my size?',
                a: 'Each product has a size guide that you can access by clicking on "Size Guide" next to the size selector. We also provide measurements for each size.',
            },
            {
                q: 'Are the product colors accurate?',
                a: 'We strive to display product colors as accurately as possible. However, due to monitor settings and lighting, actual colors may vary slightly.',
            },
            {
                q: 'How do I care for my products?',
                a: 'Care instructions are provided on the product page and on the product tags. Generally, we recommend following the care label instructions for best results.',
            },
        ],
    };

    const filteredFAQs = () => {
        if (!searchQuery) {
            return expandedCategory === 'all' 
                ? Object.values(FAQ_ITEMS).flat()
                : FAQ_ITEMS[expandedCategory] || [];
        }

        const allFAQs = Object.values(FAQ_ITEMS).flat();
        return allFAQs.filter(faq =>
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Top Bar */}
            <div className="bg-gray-900 text-white text-center py-2.5 text-xs tracking-widest font-medium">
                FREE SHIPPING ON ORDERS ABOVE RP200.000
            </div>

            <Navbar />

            {/* Header */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <HelpCircle className="w-16 h-16 text-gray-900 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about orders, shipping, payments, and more.
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
                        placeholder="Search for answers..."
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl shadow-lg focus:outline-none focus:border-gray-400 bg-white"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {!searchQuery && (
                    /* Categories */
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setExpandedCategory('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    expandedCategory === 'all'
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                All Topics
                            </button>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setExpandedCategory(cat.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                        expandedCategory === cat.id
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <span>{cat.icon}</span>
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* FAQ Items */}
                <div className="space-y-4">
                    {filteredFAQs().map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => toggleQuestion(index)}
                                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                            >
                                <h3 className="font-semibold text-gray-900 pr-4">{faq.q}</h3>
                                {expandedQuestion === index ? (
                                    <ChevronUp className="text-gray-400 flex-shrink-0" size={20} />
                                ) : (
                                    <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                                )}
                            </button>
                            {expandedQuestion === index && (
                                <div className="px-6 pb-6 pt-0">
                                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredFAQs().length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No results found. Try a different search term.</p>
                    </div>
                )}
            </div>

            {/* Contact CTA */}
            <div className="bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
                    <p className="text-gray-600 mb-6">
                        Can't find the answer you're looking for? Our support team is here to help.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/contact"
                            className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Contact Us
                        </Link>
                        <Link
                            href="/"
                            className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            Live Chat
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
