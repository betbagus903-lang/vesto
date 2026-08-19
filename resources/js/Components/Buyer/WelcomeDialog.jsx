import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function WelcomeDialog() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has seen the welcome dialog
        const hasSeenWelcome = localStorage.getItem('vesto_welcome_seen');
        if (!hasSeenWelcome) {
            setIsOpen(true);
        }
    }, []);

    const handleCompleteNow = () => {
        setIsOpen(false);
        localStorage.setItem('vesto_welcome_seen', 'true');
        // Navigate to profile page to complete profile
        window.location.href = '/buyer/profile';
    };

    const handleSkip = () => {
        setIsOpen(false);
        localStorage.setItem('vesto_welcome_seen', 'true');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e293b] rounded-xl p-6 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#3b82f6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Welcome to Vesto!</h2>
                    <p className="text-sm text-gray-400">
                        Complete your profile to get a personalized shopping experience and faster checkout.
                    </p>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="w-6 h-6 bg-[#0f172a] rounded flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span>Save multiple shipping addresses</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="w-6 h-6 bg-[#0f172a] rounded flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span>Add payment methods for quick checkout</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="w-6 h-6 bg-[#0f172a] rounded flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span>Track orders and view order history</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleCompleteNow}
                        className="flex-1 bg-[#3b82f6] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#2563eb] transition-colors"
                    >
                        Complete Now
                    </button>
                    <button
                        onClick={handleSkip}
                        className="flex-1 bg-gray-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Skip
                    </button>
                </div>
            </div>
        </div>
    );
}
