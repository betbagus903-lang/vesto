import { Check, Circle } from 'lucide-react';

export default function StatusHistoryTimeline({ history = [], currentStatus = 'dikemas' }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-base font-medium text-white mb-4">Riwayat Status</h3>

            <div className="space-y-2">
                {history.map((item, index) => {
                    const isCompleted = index < history.findIndex(h => h.status === currentStatus);
                    const isCurrent = item.status === currentStatus;
                    const isUpcoming = !isCompleted && !isCurrent;

                    return (
                        <div key={item.id} className="flex gap-3 relative">
                            {/* Timeline Line */}
                            {index < history.length - 1 && (
                                <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-white/10">
                                    {isCompleted && (
                                        <div className="absolute top-0 left-0 w-full h-full bg-green-500/30" />
                                    )}
                                </div>
                            )}

                            {/* Icon */}
                            <div className="relative z-10 flex-shrink-0">
                                {isCompleted ? (
                                    <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-green-500 flex items-center justify-center">
                                        <Check size={10} className="text-white" />
                                    </div>
                                ) : isCurrent ? (
                                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 border-2 border-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/50">
                                        <Circle size={8} className="text-white fill-white" />
                                    </div>
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-white/5 border-2 border-white/20 flex items-center justify-center">
                                        <Circle size={8} className="text-white/30" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-2">
                                <div className="flex items-center justify-between mb-0.5">
                                    <p
                                        className={`font-medium text-xs ${
                                            isCompleted
                                                ? 'text-green-400'
                                                : isCurrent
                                                    ? 'text-white'
                                                    : 'text-white/40'
                                        }`}
                                    >
                                        {item.label}
                                    </p>
                                    <p className={`text-[10px] ${isCompleted || isCurrent ? 'text-white/60' : 'text-white/30'}`}>
                                        {item.date}
                                    </p>
                                </div>
                                <p className={`text-[10px] ${isCompleted || isCurrent ? 'text-white/60' : 'text-white/30'}`}>
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
