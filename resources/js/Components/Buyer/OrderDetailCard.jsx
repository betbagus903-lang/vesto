import { Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';

export default function OrderDetailCard({ order }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-base font-medium text-white mb-4">Detail Pesanan</h3>

            <div className="space-y-3">
                <div>
                    <p className="text-white/50 text-xs mb-1">Product</p>
                    <p className="text-white text-sm">{order.product}</p>
                </div>

                <div>
                    <p className="text-white/50 text-xs mb-1">Quantity</p>
                    <p className="text-white text-sm">{order.items_count} Item</p>
                </div>

                <div>
                    <p className="text-white/50 text-xs mb-1">Total</p>
                    <p className="text-white text-sm font-medium">{formatPrice(order.total)}</p>
                </div>

                <div>
                    <p className="text-white/50 text-xs mb-1">Payment</p>
                    <p className="text-white text-sm">{order.payment_method || '-'}</p>
                </div>

                <div>
                    <p className="text-white/50 text-xs mb-1">Shipping</p>
                    <p className="text-white text-sm">{order.shipment?.carrier || order.shipping_method || '-'}</p>
                </div>

                {order.shipment?.tracking_number && (
                    <div>
                        <p className="text-white/50 text-xs mb-1">Tracking</p>
                        <p className="text-white text-sm font-mono">{order.shipment.tracking_number}</p>
                    </div>
                )}
            </div>

            <Link
                href={`/buyer/orders/${order.id}`}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-300"
            >
                Lihat Detail Pesanan <ExternalLink size={14} />
            </Link>
        </div>
    );
}
