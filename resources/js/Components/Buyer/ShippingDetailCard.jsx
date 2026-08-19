import { ExternalLink } from 'lucide-react';

export default function ShippingDetailCard({ order }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Detail Pengiriman</h3>

            {/* Order Info */}
            <div className="mb-4 pb-4 border-b border-white/10">
                <p className="text-white/50 text-xs mb-1">#{order.order_number}</p>
                <p className="text-white font-medium mb-1">{order.product}</p>
                <p className="text-white/60 text-sm">
                    {order.items_count} Item · {formatPrice(order.total)}
                </p>
            </div>

            {/* Status */}
            <div className="mb-4">
                <p className="text-white/50 text-xs mb-1">Status</p>
                <p className="text-white font-medium">{order.status}</p>
            </div>

            {/* Courier Info */}
            {order.shipment && (
                <>
                    <div className="mb-4">
                        <p className="text-white/50 text-xs mb-1">Kurir</p>
                        <p className="text-white">{order.shipment.carrier || '-'}</p>
                    </div>

                    <div className="mb-4">
                        <p className="text-white/50 text-xs mb-1">No. Resi</p>
                        <p className="text-white font-mono text-sm">{order.shipment.tracking_number || '-'}</p>
                    </div>

                    {order.shipment.estimated_delivery && (
                        <div className="mb-4">
                            <p className="text-white/50 text-xs mb-1">Estimasi tiba</p>
                            <p className="text-white">{order.shipment.estimated_delivery}</p>
                        </div>
                    )}
                </>
            )}

            {/* Track Button */}
            {order.shipment && order.shipment.tracking_number && (
                <button className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-medium px-4 py-3 rounded-xl transition-all duration-300">
                    Lacak Pesanan <ExternalLink size={16} />
                </button>
            )}
        </div>
    );
}
