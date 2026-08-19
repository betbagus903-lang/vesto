import { Package, Truck, CheckCircle, ArrowRight } from 'lucide-react';

const SHIPPING_STAGES = [
    { key: 'dikemas', label: 'DIKEMAS', icon: Package, description: 'Pesanan sedang dikemas' },
    { key: 'dikirim', label: 'DIKIRIM', icon: Truck, description: 'Pesanan sudah diambil kurir' },
    { key: 'dalam_perjalanan', label: 'DALAM PERJALANAN', icon: ArrowRight, description: 'Pesanan sedang menuju alamatmu' },
    { key: 'diterima', label: 'DITERIMA', icon: CheckCircle, description: 'Pesanan telah diterima' },
];

export default function ShippingProgressTracker({ currentStage = 'dikemas' }) {
    const currentIndex = SHIPPING_STAGES.findIndex(stage => stage.key === currentStage);

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-white">Proses Pengiriman</h3>
                <p className="text-xs text-white/50">Pantau perjalanan pesananmu sampai tiba</p>
            </div>

            <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/10">
                    <div
                        className={`h-full transition-all duration-500 ${
                            currentIndex === 3 ? 'bg-green-500' : 'bg-gradient-to-r from-green-500 via-violet-500 to-blue-500'
                        }`}
                        style={{
                            width: currentIndex >= 0 ? `${((currentIndex) / (SHIPPING_STAGES.length - 1)) * 100}%` : '0%'
                        }}
                    />
                </div>

                {/* Stages */}
                <div className="flex justify-between relative">
                    {SHIPPING_STAGES.map((stage, index) => {
                        const Icon = stage.icon;
                        const isCompleted = index < currentIndex;
                        const isCurrent = index === currentIndex;
                        const isUpcoming = index > currentIndex;
                        const isAllCompleted = currentIndex === 3;

                        return (
                            <div key={stage.key} className="flex flex-col items-center gap-2 relative z-10">
                                {/* Icon Circle */}
                                <div
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                        isCompleted || isAllCompleted
                                            ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/30'
                                            : isCurrent
                                                ? 'bg-gradient-to-br from-violet-500 to-blue-500 border-violet-500 shadow-lg shadow-violet-500/50 animate-pulse'
                                                : 'bg-white/5 border-white/20'
                                    }`}
                                >
                                    <Icon
                                        size={18}
                                        className={
                                            isCompleted || isAllCompleted
                                                ? 'text-white'
                                                : isCurrent
                                                    ? 'text-white'
                                                    : 'text-white/30'
                                        }
                                    />
                                </div>

                                {/* Label */}
                                <div className="text-center">
                                    <p
                                        className={`text-[10px] font-medium ${
                                            isCompleted || isAllCompleted
                                                ? 'text-green-400'
                                                : isCurrent
                                                    ? 'text-white'
                                                    : 'text-white/40'
                                        }`}
                                    >
                                        {stage.label}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
