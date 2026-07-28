import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import {
  ChevronLeft, Package, Truck, FileText, Plus, X, AlertCircle,
} from 'lucide-react';
import {
  OrderStatusBadge, PaymentStatusBadge, ShipmentStatusBadge,
  PageHeader, fmt,
} from '../components';

/* ── Reusable sub-components ───────────────────────────── */
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-2.5" style={{ borderBottom: '1px solid #1E293B' }}>
      <span className="text-sm" style={{ color: '#64748B' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: '#F8FAFC' }}>{value || '—'}</span>
    </div>
  );
}

function SectionCard({ icon: Icon, title, action, children }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #2C3A4D' }}>
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4" style={{ color: '#3B82F6' }} />
          <h3 className="text-sm font-semibold" style={{ color: '#F8FAFC' }}>{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ── Create Shipment Modal ─────────────────────────────── */
function CreateShipmentModal({ open, onClose, orderId }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    carrier: '',
    tracking_number: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/admin/sales/orders/${orderId}/shipment`, {
      onSuccess: () => { reset(); onClose(); },
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-xl shadow-2xl"
        style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #2C3A4D' }}>
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4" style={{ color: '#3B82F6' }} />
            <h2 className="text-base font-semibold" style={{ color: '#F8FAFC' }}>Create Shipment</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition" style={{ color: '#94A3B8' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#0F172A', border: '1px solid #1E3A5F' }}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#60A5FA' }} />
              <p className="text-xs" style={{ color: '#94A3B8' }}>
                Shipment will be created for this order. Order status will automatically change to <strong style={{ color: '#A78BFA' }}>Shipped</strong>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>Carrier</label>
              <input
                type="text"
                value={data.carrier}
                onChange={e => setData('carrier', e.target.value)}
                placeholder="e.g. JNE, TIKI, SiCepat"
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition"
                style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
              />
              {errors.carrier && <p className="mt-1 text-xs text-red-400">{errors.carrier}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>
                Tracking Number
                <span className="ml-1 font-normal" style={{ color: '#64748B' }}>(auto-generated if empty)</span>
              </label>
              <input
                type="text"
                value={data.tracking_number}
                onChange={e => setData('tracking_number', e.target.value)}
                placeholder="e.g. JNE123456789"
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition"
                style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>Notes</label>
              <textarea
                value={data.notes}
                onChange={e => setData('notes', e.target.value)}
                rows={2}
                placeholder="Optional shipping notes…"
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none transition"
                style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid #2C3A4D' }}>
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-white/10"
              style={{ color: '#94A3B8', border: '1px solid #2C3A4D' }}
            >
              Cancel
            </button>
            <button
              type="submit" disabled={processing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition disabled:opacity-60"
              style={{ backgroundColor: '#3B82F6' }}
            >
              <Truck className="w-4 h-4" />
              {processing ? 'Creating…' : 'Create Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
export default function OrderShow({ order }) {
  const [updatingStatus, setUpdatingStatus]     = useState(false);
  const [creatingInvoice, setCreatingInvoice]   = useState(false);
  const [showShipmentModal, setShowShipmentModal] = useState(false);

  const handleStatusChange = (status) => {
    setUpdatingStatus(true);
    router.patch(`/admin/sales/orders/${order.id}/status`, { status }, {
      onFinish: () => setUpdatingStatus(false),
    });
  };

  const handleCreateInvoice = () => {
    if (!confirm('Create invoice for this order? Order status will change to Processing.')) return;
    setCreatingInvoice(true);
    router.post(`/admin/sales/orders/${order.id}/invoice`, {}, {
      onFinish: () => setCreatingInvoice(false),
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-4" style={{ backgroundColor: '#111827', minHeight: '100vh', padding: '24px' }}>
        <PageHeader
          crumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Orders', href: '/admin/sales/orders' },
            { label: order.order_number },
          ]}
          title={order.order_number}
          actions={
            <div className="flex items-center gap-2">
              {/* Create Invoice button — only if no invoice yet */}
              {order.can_create_invoice && (
                <button
                  onClick={handleCreateInvoice}
                  disabled={creatingInvoice}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition disabled:opacity-60"
                  style={{ backgroundColor: '#059669' }}
                >
                  <FileText className="w-4 h-4" />
                  {creatingInvoice ? 'Creating…' : 'Create Invoice'}
                </button>
              )}

              {/* Create Shipment button — only if invoice exists and no shipment yet */}
              {order.can_create_shipment && (
                <button
                  onClick={() => setShowShipmentModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition"
                  style={{ backgroundColor: '#7C3AED' }}
                >
                  <Truck className="w-4 h-4" />
                  Create Shipment
                </button>
              )}

              <a
                href="/admin/sales/orders"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition hover:bg-white/10"
                style={{ border: '1px solid #2C3A4D', color: '#94A3B8' }}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </a>
            </div>
          }
        />

        {/* Status bar */}
        <div className="rounded-xl p-4 flex flex-wrap items-center gap-4" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: '#64748B' }}>Order Status:</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: '#64748B' }}>Payment:</span>
            <PaymentStatusBadge status={order.payment_status} />
          </div>

          {/* Workflow progress indicator */}
          <div className="flex items-center gap-2 ml-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#059669', color: '#fff' }}>✓</div>
              <span className="text-xs" style={{ color: '#94A3B8' }}>Order</span>
            </div>
            <div className="w-6 h-px" style={{ backgroundColor: order.invoice ? '#059669' : '#2C3A4D' }} />
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: order.invoice ? '#059669' : '#2C3A4D', color: order.invoice ? '#fff' : '#64748B' }}>
                {order.invoice ? '✓' : '2'}
              </div>
              <span className="text-xs" style={{ color: order.invoice ? '#94A3B8' : '#64748B' }}>Invoice</span>
            </div>
            <div className="w-6 h-px" style={{ backgroundColor: order.shipment ? '#059669' : '#2C3A4D' }} />
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: order.shipment ? '#059669' : '#2C3A4D', color: order.shipment ? '#fff' : '#64748B' }}>
                {order.shipment ? '✓' : '3'}
              </div>
              <span className="text-xs" style={{ color: order.shipment ? '#94A3B8' : '#64748B' }}>Shipment</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs" style={{ color: '#64748B' }}>Update Status:</span>
            <select
              value={order.status}
              onChange={e => handleStatusChange(e.target.value)}
              disabled={updatingStatus}
              className="px-3 py-1.5 rounded-lg text-xs focus:outline-none disabled:opacity-60"
              style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
            >
              {['pending','processing','shipped','completed','cancelled'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Next action hint */}
        {order.can_create_invoice && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: '#0F2A1A', border: '1px solid #065F46' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#34D399' }} />
            <p className="text-sm" style={{ color: '#6EE7B7' }}>
              Payment received? Click <strong>Create Invoice</strong> to confirm and move this order to processing.
            </p>
          </div>
        )}
        {order.can_create_shipment && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: '#1E1040', border: '1px solid #4C1D95' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#A78BFA' }} />
            <p className="text-sm" style={{ color: '#C4B5FD' }}>
              Invoice confirmed. Click <strong>Create Shipment</strong> to dispatch this order.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left */}
          <div className="lg:col-span-2 space-y-4">

            {/* Order Items */}
            <SectionCard icon={Package} title="Order Items">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #2C3A4D' }}>
                      {['Product', 'SKU', 'Price', 'Qty', 'Total'].map(h => (
                        <th key={h} className="pb-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: '#2C3A4D' }}>
                    {order.items?.map(item => (
                      <tr key={item.id}>
                        <td className="py-3 text-sm font-medium" style={{ color: '#F8FAFC' }}>{item.product_name}</td>
                        <td className="py-3 text-xs font-mono" style={{ color: '#64748B' }}>{item.sku || '—'}</td>
                        <td className="py-3 text-sm" style={{ color: '#94A3B8' }}>{fmt(item.price)}</td>
                        <td className="py-3 text-sm" style={{ color: '#94A3B8' }}>{item.qty}</td>
                        <td className="py-3 text-sm font-semibold" style={{ color: '#F8FAFC' }}>{fmt(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Invoice section */}
            <SectionCard
              icon={FileText}
              title="Invoice"
              action={
                order.can_create_invoice ? (
                  <button
                    onClick={handleCreateInvoice}
                    disabled={creatingInvoice}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition disabled:opacity-60"
                    style={{ backgroundColor: '#059669' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {creatingInvoice ? 'Creating…' : 'Create Invoice'}
                  </button>
                ) : null
              }
            >
              {order.invoice ? (
                <div className="space-y-1">
                  <InfoRow label="Invoice Number"  value={order.invoice.invoice_number} />
                  <InfoRow label="Payment Status"  value={<PaymentStatusBadge status={order.invoice.payment_status} />} />
                  <InfoRow label="Grand Total"     value={fmt(order.invoice.grand_total)} />
                  <InfoRow label="Created At"      value={order.invoice.created_at} />
                  <a
                    href={`/admin/sales/invoices/${order.invoice.id}`}
                    className="inline-flex items-center gap-1.5 mt-2 text-xs"
                    style={{ color: '#3B82F6' }}
                  >
                    View Invoice →
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D' }}>
                    <FileText className="w-5 h-5" style={{ color: '#64748B' }} />
                  </div>
                  <p className="text-sm" style={{ color: '#64748B' }}>No invoice yet. Create one after payment is confirmed.</p>
                </div>
              )}
            </SectionCard>

            {/* Shipment section */}
            <SectionCard
              icon={Truck}
              title="Shipment"
              action={
                order.can_create_shipment ? (
                  <button
                    onClick={() => setShowShipmentModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition"
                    style={{ backgroundColor: '#7C3AED' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Shipment
                  </button>
                ) : null
              }
            >
              {order.shipment ? (
                <div className="space-y-1">
                  <InfoRow label="Shipment Number"  value={order.shipment.shipment_number} />
                  <InfoRow label="Status"           value={<ShipmentStatusBadge status={order.shipment.status} />} />
                  <InfoRow label="Carrier"          value={order.shipment.carrier} />
                  <InfoRow label="Tracking Number"  value={order.shipment.tracking_number} />
                  <a
                    href={`/admin/sales/shipments/${order.shipment.id}`}
                    className="inline-flex items-center gap-1.5 mt-2 text-xs"
                    style={{ color: '#3B82F6' }}
                  >
                    View Shipment →
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D' }}>
                    <Truck className="w-5 h-5" style={{ color: '#64748B' }} />
                  </div>
                  <p className="text-sm" style={{ color: '#64748B' }}>
                    {order.invoice
                      ? 'Invoice confirmed. Ready to create shipment.'
                      : 'Create an invoice first before creating a shipment.'}
                  </p>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="rounded-xl p-5 space-y-1" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#64748B' }}>Order Summary</p>
              <InfoRow label="Subtotal"   value={fmt(order.subtotal)} />
              <InfoRow label="Tax (11%)"  value={fmt(order.tax)} />
              <InfoRow label="Shipping"   value="—" />
              <InfoRow label="Discount"   value="—" />
              <div className="flex justify-between pt-3 font-semibold" style={{ borderTop: '1px solid #2C3A4D' }}>
                <span style={{ color: '#F8FAFC' }}>Grand Total</span>
                <span style={{ color: '#60A5FA' }}>{fmt(order.grand_total)}</span>
              </div>
            </div>

            {/* Customer */}
            <div className="rounded-xl p-5 space-y-3" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>Customer</p>
              {order.customer && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                      style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
                      {(order.customer.first_name?.[0] || '?').toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>
                        {order.customer.first_name} {order.customer.last_name}
                      </p>
                      <p className="text-xs" style={{ color: '#64748B' }}>{order.customer.email}</p>
                    </div>
                  </div>
                  <InfoRow label="Phone"   value={order.customer.phone} />
                  <InfoRow label="Channel" value={order.channel} />
                  <a
                    href={`/admin/customers/${order.customer.id}`}
                    className="inline-flex items-center gap-1.5 text-xs"
                    style={{ color: '#3B82F6' }}
                  >
                    View Customer →
                  </a>
                </>
              )}
            </div>

            {/* Meta */}
            <div className="rounded-xl p-5 space-y-1" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>Details</p>
              <InfoRow label="Order ID"   value={`#${order.id}`} />
              <InfoRow label="Created At" value={order.created_at} />
              {order.notes && <InfoRow label="Notes" value={order.notes} />}
            </div>
          </div>
        </div>
      </div>

      <CreateShipmentModal
        open={showShipmentModal}
        onClose={() => setShowShipmentModal(false)}
        orderId={order.id}
      />
    </AdminLayout>
  );
}
