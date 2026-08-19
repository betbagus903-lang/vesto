import { useState } from 'react';
import { Mail, CheckCircle, X } from 'lucide-react';

export default function Newsletter({ compact = false }) {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubscribed(true);
            setEmail('');
        }, 1000);
    };

    if (isSubscribed) {
        return (
            <div className={`${compact ? 'p-4' : 'p-6'} bg-emerald-50 border border-emerald-200 rounded-xl`}>
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <p className="text-sm text-emerald-700 font-medium">
                        {compact ? 'Subscribed!' : 'Thank you for subscribing! Check your email for confirmation.'}
                    </p>
                </div>
            </div>
        );
    }

    if (compact) {
        return (
            <div className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                />
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? '...' : 'Subscribe'}
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-gray-700" />
                <h3 className="text-xl font-bold text-gray-900">Subscribe to Our Newsletter</h3>
            </div>
            <p className="text-gray-600 mb-6">
                Get the latest updates on new arrivals, exclusive offers, and style tips delivered straight to your inbox.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
                    />
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                </div>
                
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                </button>
            </form>

            <p className="text-xs text-gray-500 mt-4">
                By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
        </div>
    );
}
