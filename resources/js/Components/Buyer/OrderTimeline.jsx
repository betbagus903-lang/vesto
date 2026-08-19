import { CheckCircle, Clock, Package, Truck, Home, XCircle, MapPin } from 'lucide-react';

const ORDER_STEPS = [
    { key: 'pending', label: 'Menunggu Pembayaran', icon: Clock, description: 'Pesanan Anda telah diterima' },
    { key: 'processing', label: 'Dikemas', icon: Package, description: 'Pesanan Anda sedang disiapkan' },
    { key: 'shipped', label: 'Dikirim', icon: Truck, description: 'Pesanan sedang dalam perjalanan' },
    { key: 'delivered', label: 'Selesai', icon: Home, description: 'Pesanan telah diterima' },
];

export default function OrderTimeline({ status = 'pending', shipment = null }) {
    const currentStepIndex = ORDER_STEPS.findIndex(step => step.key === status.toLowerCase());
    const isCancelled = status.toLowerCase() === 'cancelled';

    if (isCancelled) {
        return (
            <div className="flex items-center justify-center gap-3 p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                <XCircle size={24} className="text-red-400" />
                <div>
                    <p className="font-semibold text-white">Pesanan Dibatalkan</p>
                    <p className="text-sm text-white/60">Pesanan ini telah dibatalkan</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6">
            <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10">
                    <div
                        className="w-full bg-gradient-to-b from-violet-500 to-blue-500 transition-all duration-500"
                        style={{
                            height: currentStepIndex >= 0 ? `${((currentStepIndex + 1) / ORDER_STEPS.length) * 100}%` : '0%'
                        }}
                    />
                </div>

                {/* Steps */}
                <div className="space-y-8">
                    {ORDER_STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const isPending = index > currentStepIndex;

                        return (
                            <div key={step.key} className="relative flex items-start gap-4">
                                {/* Icon */}
                                <div
                                    className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                                        isCompleted
                                            ? 'bg-gradient-to-br from-violet-500 to-blue-500 border-violet-500'
                                            : isCurrent
                                                ? 'bg-white/10 border-violet-500'
                                                : 'bg-white/5 border-white/20'
                                    }`}
                                >
                                    <Icon
                                        size={16}
                                        className={
                                            isCompleted
                                                ? 'text-white'
                                                : isCurrent
                                                    ? 'text-violet-400'
                                                    : 'text-white/30'
                                        }
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <p
                                        className={`font-medium transition-colors ${
                                            isCompleted || isCurrent
                                                ? 'text-white'
                                                : 'text-white/40'
                                        }`}
                                    >
                                        {step.label}
                                    </p>
                                    <p
                                        className={`text-sm transition-colors ${
                                            isCompleted || isCurrent
                                                ? 'text-white/60'
                                                : 'text-white/30'
                                        }`}
                                    >
                                        {step.description}
                                    </p>
                                </div>

                                {/* Checkmark for completed steps */}
                                {isCompleted && index < currentStepIndex && (
                                    <div className="absolute left-4 top-0 w-8 h-8 flex items-center justify-center">
                                        <CheckCircle size={16} className="text-violet-400" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Shipment Info */}
            {shipment && (status === 'shipped' || status === 'delivered') && (
                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin size={16} className="text-violet-400" />
                        <p className="text-sm font-medium text-white">Informasi Pengiriman</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-white/50">Kurir</span>
                            <span className="text-sm text-white">{shipment.carrier || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-white/50">Nomor Resi</span>
                            <span className="text-sm text-white">{shipment.tracking_number || '-'}</span>
                        </div>
                        {shipment.estimated_delivery && (
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-white/50">Estimasi Tiba</span>
                                <span className="text-sm text-white">{shipment.estimated_delivery}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
