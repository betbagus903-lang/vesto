import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function ProfileCompletionBanner({ completionPercentage = 80 }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show banner if completion is less than 60%
        if (completionPercentage < 60) {
            // Check if user has dismissed the banner
            const hasDismissed = localStorage.getItem('vesto_profile_completion_dismissed');
            if (!hasDismissed) {
                setIsVisible(true);
            }
        }
    }, [completionPercentage]);

    const handleCompleteNow = () => {
        setIsVisible(false);
        // Navigate to profile page
        window.location.href = '/buyer/profile';
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('vesto_profile_completion_dismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#3b82f6]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">Complete Your Profile</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Your profile is {completionPercentage}% complete. Add more details for a better experience.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCompleteNow}
                        className="bg-[#3b82f6] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#2563eb] transition-colors"
                    >
                        Complete Now
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="text-gray-400 hover:text-white text-xs transition-colors"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
