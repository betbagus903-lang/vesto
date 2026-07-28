import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { ChevronLeft, FileText, Package, User, MapPin, CreditCard, Download } from 'lucide-react';
import { PaymentStatusBadge, PageHeader, fmt } from '../components';

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

export default function InvoiceShow({ invoice }) {
  const [updating, setUpdating] = useState(false);

  const handlePaymentStatus = (status) => {
    setUpdating(true);
    router.patch(`/admin/sales/invoices/${invoice.id}/payment`, { payment_status: status }, {
      onFinish: () => setUpdating(false),
    });
  };

  const subtotal   = parseFloat(invoice.subtotal ?? 0);
  const tax        = parseFloat(invoice.tax ?? 0);
  const grandTotal = parseFloat(invoice.grand_total ?? 0);

  return (
    <AdminLayout>
      <div className="space-y-4" style={{ backgroundColor: '#111827', minHeight: '100vh', padding: '24px' }}>
        <PageHeader
          crumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Invoices', href: '/admin/sales/invoices' },
            { label: invoice.invoice_number },
          ]}
          title={invoice.invoice_number}
          actions={
            <div className="flex items-center gap-2">
              <a
                href={`/admin/sales/invoices/${invoice.id}/download`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition hover:bg-blue-600"
                style={{ backgroundColor: '#2563EB', color: '#fff' }}
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>
              <a
                href="/admin/sales/invoices"
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
            <span className="text-xs" style={{ color: '#64748B' }}>Payment Status:</span>
            <PaymentStatusBadge status={invoice.payment_status} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: '#64748B' }}>Order:</span>
            <a
              href={`/admin/sales/orders/${invoice.order?.id}`}
              className="text-xs font-mono hover:underline"
              style={{ color: '#60A5FA' }}
            >
              {invoice.order?.order_number}
            </a>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs" style={{ color: '#64748B' }}>Update Payment:</span>
            <select
              value={invoice.payment_status}
              onChange={e => handlePaymentStatus(e.target.value)}
              disabled={updating}
              className="px-3 py-1.5 rounded-lg text-xs focus:outline-none disabled:opacity-60"
              style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left */}
          <div className="lg:col-span-2 space-y-4">

            {/* Product List */}
            <SectionCard icon={Package} title="Product List">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #2C3A4D' }}>
                      {['Product', 'SKU', 'Unit Price', 'Qty', 'Tax', 'Total'].map(h => (
                        <th key={h} className="pb-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: '#2C3A4D' }}>
                    {invoice.order?.items?.map(item => {
                      const itemTax = parseFloat(item.total) * 0.11;
                      return (
                        <tr key={item.id}>
                          <td className="py-3 text-sm font-medium" style={{ color: '#F8FAFC' }}>{item.product_name}</td>
                          <td className="py-3 text-xs font-mono" style={{ color: '#64748B' }}>{item.sku || '—'}</td>
                          <td className="py-3 text-sm" style={{ color: '#94A3B8' }}>{fmt(item.price)}</td>
                          <td className="py-3 text-sm" style={{ color: '#94A3B8' }}>{item.qty}</td>
                          <td className="py-3 text-xs" style={{ color: '#64748B' }}>{fmt(itemTax)}</td>
                          <td className="py-3 text-sm font-semibold" style={{ color: '#F8FAFC' }}>{fmt(item.total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Customer Information */}
            <SectionCard icon={User} title="Customer Information">
              {invoice.order?.customer ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <div>
                    <InfoRow label="First Name" value={invoice.order.customer.first_name} />
                    <InfoRow label="Last Name"  value={invoice.order.customer.last_name} />
                    <InfoRow label="Email"      value={invoice.order.customer.email} />
                    <InfoRow label="Phone"      value={invoice.order.customer.phone} />
                  </div>
                  <div>
                    <InfoRow label="Customer Group" value={invoice.order.customer.customer_group?.name} />
                    <InfoRow label="Channel"        value={invoice.order?.channel} />
                    <div className="pt-3">
                      <a
                        href={`/admin/customers/${invoice.order.customer.id}`}
                        className="text-xs"
                        style={{ color: '#3B82F6' }}
                      >
                        View Customer Profile →
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm" style={{ color: '#64748B' }}>No customer data.</p>
              )}
            </SectionCard>

            {/* Billing Address */}
            <SectionCard icon={MapPin} title="Billing Address">
              <div className="flex flex-col items-center py-6 gap-2">
                <MapPin className="w-8 h-8" style={{ color: '#2C3A4D' }} />
                <p className="text-sm" style={{ color: '#64748B' }}>
                  Billing address will be available when the address module is implemented.
                </p>
                {invoice.order?.customer && (
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium" style={{ color: '#94A3B8' }}>
                      {invoice.order.customer.first_name} {invoice.order.customer.last_name}
                    </p>
                    <p className="text-xs" style={{ color: '#64748B' }}>{invoice.order.customer.email}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* Invoice Summary */}
            <div className="rounded-xl p-5" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4" style={{ color: '#3B82F6' }} />
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>Invoice Summary</p>
              </div>

              <div className="space-y-1">
                <InfoRow label="Subtotal" value={fmt(subtotal)} />
                <InfoRow label="Tax (11%)" value={fmt(tax)} />
              </div>

              <div className="flex justify-between items-center pt-4 mt-2" style={{ borderTop: '1px solid #2C3A4D' }}>
                <span className="text-sm font-semibold" style={{ color: '#F8FAFC' }}>Grand Total</span>
                <span className="text-xl font-bold" style={{ color: '#60A5FA' }}>{fmt(grandTotal)}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="rounded-xl p-5" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4" style={{ color: '#3B82F6' }} />
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>Payment</p>
              </div>
              <InfoRow label="Status"     value={<PaymentStatusBadge status={invoice.payment_status} />} />
              <InfoRow label="Invoice #"  value={invoice.invoice_number} />
              <InfoRow label="Issued At"  value={invoice.created_at} />
            </div>

            {/* Quick links */}
            <div className="rounded-xl p-5 space-y-2" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#64748B' }}>Quick Links</p>
              <a
                href={`/admin/sales/orders/${invoice.order?.id}`}
                className="flex items-center gap-2 text-xs py-2 hover:underline"
                style={{ color: '#3B82F6' }}
              >
                → View Order {invoice.order?.order_number}
              </a>
              {invoice.order?.customer && (
                <a
                  href={`/admin/customers/${invoice.order.customer.id}`}
                  className="flex items-center gap-2 text-xs py-2 hover:underline"
                  style={{ color: '#3B82F6' }}
                >
                  → View Customer Profile
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
