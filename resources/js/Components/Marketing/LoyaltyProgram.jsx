import { useState } from 'react';
import { Gift, Star, Trophy, Zap, ArrowRight, Check } from 'lucide-react';

function fmt(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
    }).format(value ?? 0);
}

export default function LoyaltyProgram({ userPoints = 0, compact = false }) {
    const [showRewards, setShowRewards] = useState(false);

    const REWARD_TIERS = [
        { points: 0, name: 'Bronze', color: 'bg-amber-600', benefits: ['Free shipping on orders above Rp100.000', 'Birthday discount (5%)'] },
        { points: 500, name: 'Silver', color: 'bg-gray-400', benefits: ['Free shipping on all orders', 'Birthday discount (10%)', 'Early access to sales'] },
        { points: 1500, name: 'Gold', color: 'bg-yellow-500', benefits: ['Free shipping on all orders', 'Birthday discount (15%)', 'Early access to sales', 'Exclusive member discounts'] },
        { points: 3000, name: 'Platinum', color: 'bg-slate-300', benefits: ['Free shipping on all orders', 'Birthday discount (20%)', 'Early access to sales', 'Exclusive member discounts', 'Priority customer support'] },
    ];

    const REWARDS = [
        { id: 1, name: 'Rp50.000 Discount', points: 500, description: 'Get Rp50.000 off your next order' },
        { id: 2, name: 'Free Shipping', points: 250, description: 'Free shipping on any order' },
        { id: 3, name: 'Rp100.000 Discount', points: 1000, description: 'Get Rp100.000 off your next order' },
        { id: 4, name: 'Birthday Gift', points: 1500, description: 'Exclusive birthday gift voucher' },
        { id: 5, name: 'Rp200.000 Discount', points: 2000, description: 'Get Rp200.000 off your next order' },
        { id: 6, name: 'VIP Access', points: 5000, description: 'Unlock VIP exclusive products' },
    ];

    const currentTier = REWARD_TIERS.filter(t => userPoints >= t.points).pop() || REWARD_TIERS[0];
    const nextTier = REWARD_TIERS.find(t => t.points > userPoints) || null;
    const pointsToNextTier = nextTier ? nextTier.points - userPoints : 0;

    if (compact) {
        return (
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="font-semibold">{currentTier.name} Member</span>
                    </div>
                    <span className="text-sm text-gray-300">{userPoints} points</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                    <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: nextTier ? `${(userPoints / nextTier.points) * 100}%` : '100%' }}
                    />
                </div>
                {nextTier && (
                    <p className="text-xs text-gray-300">
                        {pointsToNextTier} points to {nextTier.name}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                        <div>
                            <h3 className="text-xl font-bold">Loyalty Rewards</h3>
                            <p className="text-sm text-gray-300">Earn points with every purchase</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold">{userPoints}</p>
                        <p className="text-sm text-gray-300">Points</p>
                    </div>
                </div>

                {/* Current Tier */}
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Current Tier: {currentTier.name}</span>
                        {nextTier && (
                            <span className="text-sm text-gray-300">
                                {pointsToNextTier} points to {nextTier.name}
                            </span>
                        )}
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                        <div 
                            className="bg-yellow-400 h-3 rounded-full transition-all"
                            style={{ width: nextTier ? `${(userPoints / nextTier.points) * 100}%` : '100%' }}
                        />
                    </div>
                </div>
            </div>

            {/* Tier Benefits */}
            <div className="p-6 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Your Benefits</h4>
                <div className="space-y-2">
                    {currentTier.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-emerald-500" />
                            {benefit}
                        </div>
                    ))}
                </div>
            </div>

            {/* How to Earn */}
            <div className="p-6 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">How to Earn Points</h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Make a purchase</span>
                        <span className="font-medium text-gray-900">1 point per Rp1.000</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Write a product review</span>
                        <span className="font-medium text-gray-900">50 points</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Refer a friend</span>
                        <span className="font-medium text-gray-900">500 points</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Birthday bonus</span>
                        <span className="font-medium text-gray-900">200 points</span>
                    </div>
                </div>
            </div>

            {/* Rewards */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Redeem Rewards</h4>
                    <button
                        onClick={() => setShowRewards(!showRewards)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        {showRewards ? 'Hide' : 'View All'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {REWARDS.slice(0, showRewards ? REWARDS.length : 3).map((reward) => (
                        <div 
                            key={reward.id}
                            className={`p-4 rounded-xl border-2 transition-all ${
                                userPoints >= reward.points
                                    ? 'border-gray-200 hover:border-gray-300 cursor-pointer'
                                    : 'border-gray-100 opacity-60 cursor-not-allowed'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Gift className="w-5 h-5 text-gray-700" />
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-medium text-gray-900">{reward.name}</h5>
                                    <p className="text-sm text-gray-500 mb-2">{reward.description}</p>
                                    <div className="flex items-center gap-1">
                                        <Zap className="w-4 h-4 text-yellow-500" />
                                        <span className="text-sm font-medium text-gray-900">{reward.points} points</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
