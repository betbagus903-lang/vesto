import { useState } from 'react';
import { Gift, Users, Copy, Check, Share2, TrendingUp } from 'lucide-react';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
    }).format(value ?? 0);
}

export default function ReferralProgram({ userReferralCode = 'VESTO2024', referralCount = 0, totalEarned = 0, compact = false }) {
    const [copied, setCopied] = useState(false);
    const [showShare, setShowShare] = useState(false);

    const referralLink = typeof window !== 'undefined' 
        ? `${window.location.origin}?ref=${userReferralCode}` 
        : `https://vesto.com?ref=${userReferralCode}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = (platform) => {
        const shareText = `Get Rp50.000 off your first order at Vesto! Use my referral code: ${userReferralCode}`;
        let url = '';

        switch (platform) {
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + referralLink)}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`;
                break;
            default:
                return;
        }

        window.open(url, '_blank', 'width=600,height=400');
    };

    if (compact) {
        return (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <Gift className="w-6 h-6" />
                    <div className="flex-1">
                        <p className="font-semibold">Refer & Earn</p>
                        <p className="text-sm text-emerald-100">Rp50.000 for each friend</p>
                    </div>
                    <button
                        onClick={() => setShowShare(!showShare)}
                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                        <Share2 size={18} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Gift className="w-8 h-8" />
                    <div>
                        <h3 className="text-xl font-bold">Refer & Earn</h3>
                        <p className="text-sm text-emerald-100">Share Vesto with friends and earn rewards</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold">{referralCount}</p>
                        <p className="text-xs text-emerald-100">Friends Referred</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold">{fmt(totalEarned)}</p>
                        <p className="text-xs text-emerald-100">Total Earned</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold">Rp50.000</p>
                        <p className="text-xs text-emerald-100">Per Referral</p>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="p-6 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">How It Works</h4>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-600 font-bold">1</span>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Share your referral link</p>
                            <p className="text-sm text-gray-500">Send your unique link to friends via email, social media, or chat</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-600 font-bold">2</span>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Friend makes first purchase</p>
                            <p className="text-sm text-gray-500">Your friend gets Rp50.000 off their first order</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-600 font-bold">3</span>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">You both get rewarded</p>
                            <p className="text-sm text-gray-500">You earn Rp50.000 for each successful referral</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Referral Link */}
            <div className="p-6 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Your Referral Link</h4>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={referralLink}
                            readOnly
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none"
                        />
                        <button
                            onClick={handleCopyLink}
                            className="px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            {copied ? (
                                <>
                                    <Check size={16} />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy size={16} />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users size={14} />
                        <span>Referral Code: <span className="font-mono font-semibold text-gray-900">{userReferralCode}</span></span>
                    </div>
                </div>
            </div>

            {/* Share Options */}
            <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Share Now</h4>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => handleShare('whatsapp')}
                        className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                        <span className="text-2xl">📱</span>
                        <span className="text-sm font-medium text-gray-900">WhatsApp</span>
                    </button>
                    <button
                        onClick={() => handleShare('facebook')}
                        className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                        <span className="text-2xl">📘</span>
                        <span className="text-sm font-medium text-gray-900">Facebook</span>
                    </button>
                    <button
                        onClick={() => handleShare('twitter')}
                        className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                        <span className="text-2xl">🐦</span>
                        <span className="text-sm font-medium text-gray-900">Twitter</span>
                    </button>
                </div>

                {/* Terms */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="text-xs text-gray-500">
                            <p className="font-medium text-gray-700 mb-1">Terms & Conditions</p>
                            <p>Referral rewards are credited after your friend's first successful purchase. Maximum 10 referrals per month. Referral codes cannot be combined with other promotions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
