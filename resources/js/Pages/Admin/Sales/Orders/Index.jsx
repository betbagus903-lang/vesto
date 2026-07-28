import React, { useState, useRef, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import {
  Search, Filter, Download, Plus, Eye, ChevronDown,
  ShoppingCart, Users, Package, X, Check, Loader2,
} from 'lucide-react';
import {
  OrderStatusBadge, PaymentStatusBadge, Pagination, Drawer,
  TableCard, Th, Td, Input, SelectField, PageHeader, EmptyState, fmt,
} from '../components';

/* ── Select Customer Drawer ────────────────────────────── */
function SelectCustomerDrawer({ open, onClose, onSelect }) {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const timer = useRef(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    first_name: '', last_name: '', email: '', phone: '',
    gender: 'male', channel: 'web', customer_group_id: '',
    status: 'active',
  });

  useEffect(() => {
    if (!open) { setQuery(''); setResults([]); setShowCreate(false); reset(); }
  }, [open]);

  const search = (val) => {
    setQuery(val);
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/admin/sales/orders/search/customers?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    post('/admin/customers', {
      onSuccess: () => {
        // Re-search to get the new customer
        fetch(`/admin/sales/orders/search/customers?q=${encodeURIComponent(data.email)}`)
          .then(r => r.json())
          .then(list => { if (list[0]) onSelect(list[0]); });
        reset();
        setShowCreate(false);
      },
    });
  };

  return (
    <Drawer open={open} onClose={onClose} title="Select Customer" width={440}>
      {!showCreate ? (
        <div className="p-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748B' }} />
            <Input
              className="pl-10"
              placeholder="Search by name, email, phone…"
              value={query}
              onChange={e => search(e.target.value)}
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="space-y-1">
            {loading && (
              <div className="flex justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#64748B' }} />
              </div>
            )}
            {!loading && results.map(c => (
              <button
                key={c.id}
                onClick={() => onSelect(c)}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition hover:bg-white/5"
                style={{ border: '1px solid #2C3A4D' }}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
                  {(c.first_name?.[0] || '?').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#F8FAFC' }}>{c.first_name} {c.last_name}</p>
                  <p className="text-xs truncate" style={{ color: '#64748B' }}>{c.email}</p>
                </div>
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#3B82F6', opacity: 0 }} />
              </button>
            ))}
            {!loading && query && results.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm mb-3" style={{ color: '#64748B' }}>No customer found for "{query}"</p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white mx-auto"
                  style={{ backgroundColor: '#3B82F6' }}
                >
                  <Plus className="w-4 h-4" /> Create Customer
                </button>
              </div>
            )}
            {!loading && !query && (
              <div className="text-center py-8">
                <p className="text-xs" style={{ color: '#64748B' }}>Type to search customers</p>
              </div>
            )}
          </div>

          {/* Create button at bottom */}
          <div className="pt-2" style={{ borderTop: '1px solid #2C3A4D' }}>
            <button
              onClick={() => setShowCreate(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-white/10"
              style={{ border: '1px solid #2C3A4D', color: '#94A3B8' }}
            >
              <Plus className="w-4 h-4" /> Create New Customer
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreate} className="p-4 space-y-4">
          <button
            type="button"
            onClick={() => setShowCreate(false)}
            className="flex items-center gap-1.5 text-xs mb-2 hover:text-white transition"
            style={{ color: '#64748B' }}
          >
            ← Back to search
          </button>
          <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>Create New Customer</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1" style={{ color: '#94A3B8' }}>First Name *</label>
              <Input value={data.first_name} onChange={e => setData('first_name', e.target.value)} placeholder="John" />
              {errors.first_name && <p className="text-xs text-red-400 mt-1">{errors.first_name}</p>}
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#94A3B8' }}>Last Name *</label>
              <Input value={data.last_name} onChange={e => setData('last_name', e.target.value)} placeholder="Doe" />
              {errors.last_name && <p className="text-xs text-red-400 mt-1">{errors.last_name}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: '#94A3B8' }}>Email *</label>
            <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="john@example.com" />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: '#94A3B8' }}>Phone</label>
            <Input value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+62 812 …" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1" style={{ color: '#94A3B8' }}>Gender *</label>
              <SelectField value={data.gender} onChange={e => setData('gender', e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </SelectField>
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#94A3B8' }}>Channel *</label>
              <SelectField value={data.channel} onChange={e => setData('channel', e.target.value)}>
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="pos">POS</option>
              </SelectField>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button" onClick={() => setShowCreate(false)}
              className="flex-1 py-2 rounded-lg text-sm transition hover:bg-white/10"
              style={{ border: '1px solid #2C3A4D', color: '#94A3B8' }}
            >
              Cancel
            </button>
            <button
              type="submit" disabled={processing}
              className="flex-1 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
              style={{ backgroundColor: '#3B82F6' }}
            >
              {processing ? 'Creating…' : 'Create & Select'}
            </button>
          </div>
        </form>
      )}
    </Drawer>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
export default function OrdersIndex({ orders = [], pagination = {}, filters = {} }) {
  const [showCustomerDrawer, setShowCustomerDrawer] = useState(false);
  const [showFilter, setShowFilter]                 = useState(false);
  const [search, setSearch]                         = useState(filters.search || '');
  const filterRef = useRef(null);
  const searchTimer = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const go = (params) =>
    router.get('/admin/sales/orders', { ...filters, ...params }, { preserveState: false });

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const { search: _, ...rest } = filters;
      if (val.trim()) go({ search: val.trim(), page: 1 });
      else router.get('/admin/sales/orders', { ...rest, page: 1 }, { preserveState: false });
    }, 400);
  };

  const handleCustomerSelected = (customer) => {
    setShowCustomerDrawer(false);
    router.get('/admin/sales/orders/create', { customer_id: customer.id });
  };

  const activeFilters = ['status', 'payment_status'].filter(k => filters[k]).length;

  return (
    <AdminLayout>
      <div className="space-y-4" style={{ backgroundColor: '#111827', minHeight: '100vh', padding: '24px' }}>
        <PageHeader
          crumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Sales' },
            { label: 'Orders' },
          ]}
          title="Orders"
          actions={
            <>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-white/10"
                style={{ border: '1px solid #2C3A4D', color: '#94A3B8' }}
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button
                onClick={() => setShowCustomerDrawer(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: '#3B82F6' }}
              >
                <Plus className="w-4 h-4" /> Create Order
              </button>
            </>
          }
        />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative" style={{ width: '280px' }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search order, customer…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none transition"
              style={{ backgroundColor: '#1A2235', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
            />
          </div>

          <span className="text-sm" style={{ color: '#94A3B8' }}>{pagination.total ?? 0} Results</span>

          {/* Filter */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition"
              style={{
                backgroundColor: activeFilters > 0 ? '#1E3A5F' : 'transparent',
                borderColor: activeFilters > 0 ? '#3B82F6' : '#2C3A4D',
                color: activeFilters > 0 ? '#60A5FA' : '#94A3B8',
              }}
            >
              <Filter className="w-4 h-4" />
              Filter
              {activeFilters > 0 && <span className="px-1.5 py-0.5 rounded-full text-xs bg-blue-500 text-white">{activeFilters}</span>}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showFilter && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-xl shadow-xl z-40 p-4 space-y-4"
                style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#94A3B8' }}>Order Status</label>
                  <SelectField value={filters.status} onChange={e => go({ status: e.target.value, page: 1 })}>
                    <option value="">All Status</option>
                    {['pending','processing','shipped','completed','cancelled'].map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </SelectField>
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#94A3B8' }}>Payment Status</label>
                  <SelectField value={filters.payment_status} onChange={e => go({ payment_status: e.target.value, page: 1 })}>
                    <option value="">All</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </SelectField>
                </div>
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
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Status</Th>
                <Th>Payment</Th>
                <Th>Grand Total</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#2C3A4D' }}>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={ShoppingCart}
                      title="No orders found"
                      subtitle="Create your first order to get started."
                      action={
                        <button
                          onClick={() => setShowCustomerDrawer(true)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                          style={{ backgroundColor: '#3B82F6' }}
                        >
                          <Plus className="w-4 h-4" /> Create Order
                        </button>
                      }
                    />
                  </td>
                </tr>
              ) : orders.map(order => (
                <tr
                  key={order.id}
                  className="transition-colors"
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#263244'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Td>
                    <span className="text-sm font-mono font-medium" style={{ color: '#60A5FA' }}>
                      {order.order_number}
                    </span>
                  </Td>
                  <Td>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>
                        {order.customer?.first_name} {order.customer?.last_name}
                      </p>
                      <p className="text-xs" style={{ color: '#64748B' }}>{order.customer?.email}</p>
                    </div>
                  </Td>
                  <Td><OrderStatusBadge status={order.status} /></Td>
                  <Td><PaymentStatusBadge status={order.payment_status} /></Td>
                  <Td>
                    <span className="text-sm font-medium" style={{ color: '#F8FAFC' }}>{fmt(order.grand_total)}</span>
                  </Td>
                  <Td>
                    <span className="text-xs" style={{ color: '#64748B' }}>
                      {new Date(order.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </Td>
                  <Td>
                    <a
                      href={`/admin/sales/orders/${order.id}`}
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

      <SelectCustomerDrawer
        open={showCustomerDrawer}
        onClose={() => setShowCustomerDrawer(false)}
        onSelect={handleCustomerSelected}
      />
    </AdminLayout>
  );
}
