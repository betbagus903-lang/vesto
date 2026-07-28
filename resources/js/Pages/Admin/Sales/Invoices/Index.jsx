import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { Search, Filter, Eye, FileText, ChevronDown, Download } from 'lucide-react';
import {
  PaymentStatusBadge, Pagination, TableCard, Th, Td,
  SelectField, PageHeader, EmptyState, fmt,
} from '../components';

export default function InvoicesIndex({ invoices = [], pagination = {}, filters = {} }) {
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch]         = useState(filters.search || '');
  const filterRef = useRef(null);
  const timer     = useRef(null);

  const go = (params) =>
    router.get('/admin/sales/invoices', { ...filters, ...params }, { preserveState: false });

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const { search: _, ...rest } = filters;
      if (val.trim()) go({ search: val.trim(), page: 1 });
      else router.get('/admin/sales/invoices', { ...rest, page: 1 }, { preserveState: false });
    }, 400);
  };

  return (
    <AdminLayout>
      <div className="space-y-4" style={{ backgroundColor: '#111827', minHeight: '100vh', padding: '24px' }}>
        <PageHeader
          crumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Sales' },
            { label: 'Invoices' },
          ]}
          title="Invoices"
          actions={
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-white/10"
              style={{ border: '1px solid #2C3A4D', color: '#94A3B8' }}
            >
              <Download className="w-4 h-4" /> Export
            </button>
          }
        />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative" style={{ width: '280px' }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search invoice, order, customer…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none transition"
              style={{ backgroundColor: '#1A2235', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
            />
          </div>

          <span className="text-sm" style={{ color: '#94A3B8' }}>{pagination.total ?? 0} Results</span>

          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition"
              style={{
                backgroundColor: filters.payment_status ? '#1E3A5F' : 'transparent',
                borderColor: filters.payment_status ? '#3B82F6' : '#2C3A4D',
                color: filters.payment_status ? '#60A5FA' : '#94A3B8',
              }}
            >
              <Filter className="w-4 h-4" /> Filter <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showFilter && (
              <div
                className="absolute left-0 top-full mt-2 w-56 rounded-xl shadow-xl z-40 p-4"
                style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}
              >
                <label className="block text-xs mb-1.5" style={{ color: '#94A3B8' }}>Payment Status</label>
                <SelectField value={filters.payment_status} onChange={e => go({ payment_status: e.target.value, page: 1 })}>
                  <option value="">All</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </SelectField>
              </div>
            )}
          </div>

          <SelectField
            style={{ width: 'auto', backgroundColor: '#1A2235', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
            value={filters.per_page || 10}
            onChange={e => go({ per_page: Number(e.target.value), page: 1 })}
          >
            {[10, 25, 50].map(n => <option key={n} value={n}>{n} / page</option>)}
          </SelectField>
        </div>

        {/* Table */}
        <TableCard>
          <table className="w-full">
            <thead style={{ backgroundColor: '#1A2235' }}>
              <tr>
                <Th>Invoice Number</Th>
                <Th>Order Number</Th>
                <Th>Customer</Th>
                <Th>Grand Total</Th>
                <Th>Payment Status</Th>
                <Th>Invoice Date</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#2C3A4D' }}>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={FileText}
                      title="No invoices found"
                      subtitle="Invoices are created from Order detail after payment is confirmed."
                    />
                  </td>
                </tr>
              ) : invoices.map(inv => (
                <tr
                  key={inv.id}
                  className="transition-colors"
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#263244'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Td>
                    <span className="text-sm font-mono font-medium" style={{ color: '#60A5FA' }}>
                      {inv.invoice_number}
                    </span>
                  </Td>
                  <Td>
                    <a
                      href={`/admin/sales/orders/${inv.order?.id}`}
                      className="text-sm font-mono hover:underline"
                      style={{ color: '#94A3B8' }}
                    >
                      {inv.order?.order_number}
                    </a>
                  </Td>
                  <Td>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>
                        {inv.order?.customer?.first_name} {inv.order?.customer?.last_name}
                      </p>
                      <p className="text-xs" style={{ color: '#64748B' }}>{inv.order?.customer?.email}</p>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-sm font-semibold" style={{ color: '#F8FAFC' }}>{fmt(inv.grand_total)}</span>
                  </Td>
                  <Td><PaymentStatusBadge status={inv.payment_status} /></Td>
                  <Td>
                    <span className="text-xs" style={{ color: '#64748B' }}>
                      {new Date(inv.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </span>
                  </Td>
                  <Td>
                    <a
                      href={`/admin/sales/invoices/${inv.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition hover:bg-blue-500/20 w-fit"
                      style={{ color: '#60A5FA', border: '1px solid #1E3A5F' }}
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </a>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} onPage={p => go({ page: p })} />
        </TableCard>
      </div>
    </AdminLayout>
  );
}
