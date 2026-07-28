import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { ChevronLeft, Truck, Package, User, MapPin } from 'lucide-react';
import { ShipmentStatusBadge, PageHeader, fmt } from '../components';

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-2.5" style={{ borderBottom: '1px solid #1E293B' }}>
      <span className="text-sm" style={{ color: '#64748B' }}>{label}</span>
      <span className="text-sm font-medium text-right" style={{ color: '#F8FAFC' }}>{value || '—'}</span>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
      <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: '1px solid #2C3A4D' }}>
        <Icon className="w-4 h-4" style={{ color: '#3B82F6' }} />
        <h3 className="text-sm font-semibold" style={{ color: '#F8FAFC' }}>{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

const STATUS_STEPS = ['pending', 'shipped', 'delivered'];

export default function ShipmentShow({ shipment }) {
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = (status) => {
    setUpdating(true);
    router.patch(`/admin/sales/shipments/${shipment.id}/status`, { status }, {
      onFinish: () => setUpdating(false),
    });
  };

  const currentStepIdx = STATUS_STEPS.indexOf(shipment.status);

  return (
    <AdminLayout>
      <div className="space-y-4" style={{ backgroundColor: '#111827', minHeight: '100vh', padding: '24px' }}>
        <PageHeader
          crumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Shipments', href: '/admin/sales/shipments' },
            { label: shipment.shipment_number },
          ]}
          title={shipment.shipment_number}
          actions={
            <a
              href="/admin/sales/shipments"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition hover:bg-white/10"
              style={{ border: '1px solid #2C3A4D', color: '#94A3B8' }}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </a>
          }
        />

        {/* Status bar + progress */}
        <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: '#64748B' }}>Shipping Status:</span>
              <ShipmentStatusBadge status={shipment.status} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: '#64748B' }}>Update Status:</span>
              <select
                value={shipment.status}
                onChange={e => handleStatusChange(e.target.value)}
                disabled={updating}
                className="px-3 py-1.5 rounded-lg text-xs focus:outline-none disabled:opacity-60"
                style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
              >
                {['pending','shipped','delivered','returned'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress stepper */}
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((step, idx) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{
                      backgroundColor: idx <= currentStepIdx ? '#3B82F6' : '#1A2235',
                      border: `2px solid ${idx <= currentStepIdx ? '#3B82F6' : '#2C3A4D'}`,
                      color: idx <= currentStepIdx ? '#fff' : '#64748B',
                    }}
                  >
                    {idx < currentStepIdx ? '✓' : idx + 1}
                  </div>
                  <span className="text-xs capitalize" style={{ color: idx <= currentStepIdx ? '#94A3B8' : '#64748B' }}>
                    {step}
                  </span>
                </div>
                {idx < STATUS_STEPS.length - 1 && (
                  <div
                    className="flex-1 h-0.5 mb-5 mx-1"
                    style={{ backgroundColor: idx < currentStepIdx ? '#3B82F6' : '#2C3A4D' }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Products */}
          <div className="lg:col-span-2 space-y-4">
            <SectionCard icon={Package} title="Products">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #2C3A4D' }}>
                      {['Product', 'SKU', 'Qty', 'Unit Price', 'Total'].map(h => (
                        <th key={h} className="pb-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: '#2C3A4D' }}>
                    {shipment.order?.items?.map(item => (
                      <tr key={item.id}>
                        <td className="py-3 text-sm font-medium" style={{ color: '#F8FAFC' }}>{item.product_name}</td>
                        <td className="py-3 text-xs font-mono" style={{ color: '#64748B' }}>{item.sku || '—'}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-blue-500/10 text-blue-400 border-blue-500/20">
                            {item.qty}
                          </span>
                        </td>
                        <td className="py-3 text-sm" style={{ color: '#94A3B8' }}>{fmt(item.price)}</td>
                        <td className="py-3 text-sm font-semibold" style={{ color: '#F8FAFC' }}>{fmt(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: '1px solid #2C3A4D' }}>
                      <td colSpan={2} className="pt-3 text-xs font-medium uppercase" style={{ color: '#64748B' }}>Total</td>
                      <td className="pt-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold border bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {shipment.total_qty ?? shipment.order?.items?.reduce((s, i) => s + i.qty, 0)}
                        </span>
                      </td>
                      <td />
                      <td className="pt-3 text-sm font-bold" style={{ color: '#60A5FA' }}>
                        {fmt(shipment.order?.items?.reduce((s, i) => s + parseFloat(i.total), 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </SectionCard>

            {/* Shipping Address placeholder */}
            <SectionCard icon={MapPin} title="Shipping Address">
              <div className="flex flex-col items-center py-6 gap-2">
                <MapPin className="w-8 h-8" style={{ color: '#2C3A4D' }} />
                <p className="text-sm" style={{ color: '#64748B' }}>
                  Shipping address will be available when the address module is implemented.
                </p>
                {shipment.order?.customer && (
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium" style={{ color: '#94A3B8' }}>
                      {shipment.order.customer.first_name} {shipment.order.customer.last_name}
                    </p>
                    <p className="text-xs" style={{ color: '#64748B' }}>{shipment.order.customer.email}</p>
                    {shipment.order.customer.phone && (
                      <p className="text-xs" style={{ color: '#64748B' }}>{shipment.order.customer.phone}</p>
                    )}
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* Tracking Info */}
            <div className="rounded-xl p-5" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-4 h-4" style={{ color: '#3B82F6' }} />
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>Tracking Info</p>
              </div>

              {/* Tracking number highlight */}
              {shipment.tracking_number && (
                <div className="mb-4 p-3 rounded-lg text-center" style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D' }}>
                  <p className="text-xs mb-1" style={{ color: '#64748B' }}>Tracking Number</p>
                  <p className="text-base font-mono font-bold" style={{ color: '#60A5FA' }}>
                    {shipment.tracking_number}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <InfoRow label="Carrier"    value={shipment.carrier} />
                <InfoRow label="Created At" value={shipment.created_at} />
                {shipment.notes && <InfoRow label="Notes" value={shipment.notes} />}
              </div>
            </div>

            {/* Customer */}
            <div className="rounded-xl p-5" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4" style={{ color: '#3B82F6' }} />
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>Customer</p>
              </div>
              {shipment.order?.customer && (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
                    >
                      {(shipment.order.customer.first_name?.[0] || '?').toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>
                        {shipment.order.customer.first_name} {shipment.order.customer.last_name}
                      </p>
                      <p className="text-xs" style={{ color: '#64748B' }}>{shipment.order.customer.email}</p>
                    </div>
                  </div>
                  <InfoRow label="Phone" value={shipment.order.customer.phone} />
                  <div className="flex gap-2 mt-3">
                    <a
                      href={`/admin/sales/orders/${shipment.order.id}`}
                      className="text-xs"
                      style={{ color: '#3B82F6' }}
                    >
                      View Order →
                    </a>
                    <span style={{ color: '#2C3A4D' }}>·</span>
                    <a
                      href={`/admin/customers/${shipment.order.customer.id}`}
                      className="text-xs"
                      style={{ color: '#3B82F6' }}
                    >
                      View Customer →
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
