import React, { useState, useRef, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import {
  Search, Filter, Download, Plus, Eye, Trash2,
  ChevronLeft, ChevronRight, Users, X, ChevronDown,
} from 'lucide-react';

/* ── Badge helpers ─────────────────────────────────────── */
function StatusBadge({ status }) {
  const active = status === 'active';
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
      active
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }`}>
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function GenderBadge({ gender }) {
  const map = {
    male:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
    female: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    other:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  return gender ? (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${map[gender] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
      {gender.charAt(0).toUpperCase() + gender.slice(1)}
    </span>
  ) : <span className="text-[#64748B] text-xs">—</span>;
}

/* ── Field component ───────────────────────────────────── */
function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition ${className}`}
      style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
      {...props}
    />
  );
}

function Select({ children, className = '', ...props }) {
  return (
    <select
      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition ${className}`}
      style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
      {...props}
    >
      {children}
    </select>
  );
}

/* ── Create Customer Modal ─────────────────────────────── */
function CreateModal({ open, onClose, customerGroups, onSuccess }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    first_name: '', last_name: '', email: '', phone: '',
    gender: '', date_of_birth: '', channel: 'web',
    customer_group_id: '', status: 'active',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/customers', {
      onSuccess: () => { reset(); onSuccess(); onClose(); },
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #2C3A4D' }}>
          <h2 className="text-base font-semibold" style={{ color: '#F8FAFC' }}>Create Customer</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition" style={{ color: '#94A3B8' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" required error={errors.first_name}>
                <Input value={data.first_name} onChange={e => setData('first_name', e.target.value)} placeholder="John" />
              </Field>
              <Field label="Last Name" required error={errors.last_name}>
                <Input value={data.last_name} onChange={e => setData('last_name', e.target.value)} placeholder="Doe" />
              </Field>
            </div>
            <Field label="Email" required error={errors.email}>
              <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="john@example.com" />
            </Field>
            <Field label="Contact Number" error={errors.phone}>
              <Input value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+62 812 3456 7890" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date of Birth" error={errors.date_of_birth}>
                <Input type="date" value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} />
              </Field>
              <Field label="Gender" required error={errors.gender}>
                <Select value={data.gender} onChange={e => setData('gender', e.target.value)}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Channel" required error={errors.channel}>
                <Select value={data.channel} onChange={e => setData('channel', e.target.value)}>
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="pos">POS</option>
                </Select>
              </Field>
              <Field label="Customer Group" required error={errors.customer_group_id}>
                <Select value={data.customer_group_id} onChange={e => setData('customer_group_id', e.target.value)}>
                  <option value="">Select Group</option>
                  {customerGroups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </Select>
              </Field>
            </div>
          </div>

          {/* Footer */}
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
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition disabled:opacity-60"
              style={{ backgroundColor: '#3B82F6' }}
            >
              {processing ? 'Creating…' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Filter Panel ──────────────────────────────────────── */
function FilterPanel({ open, filters, customerGroups, onChange }) {
  if (!open) return null;
  return (
    <div
      className="absolute left-0 top-full mt-2 w-72 rounded-xl shadow-xl z-40 p-5 space-y-4"
      style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>Filters</p>
      <div>
        <label className="block text-xs mb-1.5" style={{ color: '#94A3B8' }}>Status</label>
        <Select value={filters.status} onChange={e => onChange('status', e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>
      <div>
        <label className="block text-xs mb-1.5" style={{ color: '#94A3B8' }}>Customer Group</label>
        <Select value={filters.customer_group_id} onChange={e => onChange('customer_group_id', e.target.value)}>
          <option value="">All Groups</option>
          {customerGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </Select>
      </div>
      <div>
        <label className="block text-xs mb-1.5" style={{ color: '#94A3B8' }}>Gender</label>
        <Select value={filters.gender} onChange={e => onChange('gender', e.target.value)}>
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
      </div>
      <div>
        <label className="block text-xs mb-1.5" style={{ color: '#94A3B8' }}>Channel</label>
        <Select value={filters.channel} onChange={e => onChange('channel', e.target.value)}>
          <option value="">All Channels</option>
          <option value="web">Web</option>
          <option value="mobile">Mobile</option>
          <option value="pos">POS</option>
        </Select>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
export default function CustomersIndex({ customers = [], pagination = {}, filters = {}, customerGroups = [] }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [showFilter, setShowFilter]     = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [search, setSearch]             = useState(filters.search || '');
  const filterRef                       = useRef(null);
  const searchTimer                     = useRef(null);

  // Close filter on outside click
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const go = (params) =>
    router.get('/admin/customers', { ...filters, ...params }, { preserveState: false });

  // Realtime search with debounce
  const handleSearch = (value) => {
    setSearch(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const { search: _, ...rest } = filters;
      if (value.trim()) go({ search: value.trim(), page: 1 });
      else router.get('/admin/customers', { ...rest, page: 1 }, { preserveState: false });
    }, 400);
  };

  const handleFilterChange = (key, value) => go({ [key]: value, page: 1 });

  const handleDelete = (id) => {
    if (!confirm('Delete this customer?')) return;
    router.delete(`/admin/customers/${id}`, { onSuccess: () => setSelectedRows(prev => prev.filter(r => r !== id)) });
  };

  const activeFiltersCount = ['status', 'customer_group_id', 'gender', 'channel']
    .filter(k => filters[k]).length;

  return (
    <AdminLayout>
      <div className="space-y-4" style={{ backgroundColor: '#111827', minHeight: '100vh', padding: '24px' }}>

        {/* Breadcrumb + Header */}
        <div>
          <nav className="flex items-center gap-2 text-xs mb-1">
            <a href="/admin/dashboard" className="hover:text-white transition" style={{ color: '#A8B3C5' }}>Dashboard</a>
            <span style={{ color: '#A8B3C5' }}>/</span>
            <span style={{ color: '#F5F7FA' }}>Customers</span>
          </nav>
          <div className="flex items-center justify-between mt-2">
            <h1 className="text-2xl font-bold" style={{ color: '#F8FAFC' }}>Customers</h1>
            <div className="flex items-center gap-2">
              {/* Export */}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-white/10"
                style={{ border: '1px solid #2C3A4D', color: '#94A3B8' }}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              {/* Create */}
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition"
                style={{ backgroundColor: '#3B82F6' }}
              >
                <Plus className="w-4 h-4" />
                Create Customer
              </button>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative" style={{ width: '280px' }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search name, email, phone…"
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
                backgroundColor: activeFiltersCount > 0 ? '#1E3A5F' : 'transparent',
                borderColor: activeFiltersCount > 0 ? '#3B82F6' : '#2C3A4D',
                color: activeFiltersCount > 0 ? '#60A5FA' : '#94A3B8',
              }}
            >
              <Filter className="w-4 h-4" />
              Filter
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-blue-500 text-white">{activeFiltersCount}</span>
              )}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <FilterPanel
              open={showFilter}
              filters={filters}
              customerGroups={customerGroups}
              onChange={handleFilterChange}
            />
          </div>

          {/* Per page */}
          <select
            value={filters.per_page || 10}
            onChange={e => go({ per_page: Number(e.target.value), page: 1 })}
            className="px-3 py-2 rounded-lg text-sm focus:outline-none"
            style={{ backgroundColor: '#1A2235', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
          >
            {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>

          {/* Pagination mini */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => go({ page: pagination.current_page - 1 })}
              disabled={pagination.current_page <= 1}
              className="p-1.5 rounded-lg transition disabled:opacity-40 hover:bg-white/10"
              style={{ color: '#94A3B8' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm px-2" style={{ color: '#94A3B8' }}>
              {pagination.current_page} / {pagination.last_page || 1}
            </span>
            <button
              onClick={() => go({ page: pagination.current_page + 1 })}
              disabled={pagination.current_page >= pagination.last_page}
              className="p-1.5 rounded-lg transition disabled:opacity-40 hover:bg-white/10"
              style={{ color: '#94A3B8' }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#1A2235' }}>
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === customers.length && customers.length > 0}
                      onChange={e => setSelectedRows(e.target.checked ? customers.map(c => c.id) : [])}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>Contact Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>Customer Information</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>Statistics</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#2C3A4D' }}>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D' }}>
                          <Users className="w-7 h-7" style={{ color: '#3B82F6' }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1" style={{ color: '#F1F5F9' }}>No customers found</p>
                          <p className="text-xs" style={{ color: '#64748B' }}>Get started by creating your first customer.</p>
                        </div>
                        <button
                          onClick={() => setShowModal(true)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                          style={{ backgroundColor: '#3B82F6' }}
                        >
                          <Plus className="w-4 h-4" /> Create Customer
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : customers.map(customer => (
                  <tr
                    key={customer.id}
                    className="transition-colors"
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#263244'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(customer.id)}
                        onChange={() => setSelectedRows(prev =>
                          prev.includes(customer.id) ? prev.filter(id => id !== customer.id) : [...prev, customer.id]
                        )}
                        className="w-4 h-4 rounded"
                      />
                    </td>

                    {/* Customer Name + Email */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold text-white"
                          style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
                          {(customer.first_name?.[0] || '?').toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-xs" style={{ color: '#64748B' }}>{customer.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-4 text-sm" style={{ color: '#94A3B8' }}>
                      {customer.phone || <span style={{ color: '#64748B' }}>—</span>}
                    </td>

                    {/* Customer Information */}
                    <td className="px-4 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={customer.status} />
                          <GenderBadge gender={customer.gender} />
                        </div>
                        <p className="text-xs" style={{ color: '#64748B' }}>
                          {customer.customer_group?.name || '—'} · #{customer.id}
                        </p>
                        <p className="text-xs" style={{ color: '#64748B' }}>
                          {customer.channel ? customer.channel.charAt(0).toUpperCase() + customer.channel.slice(1) : '—'}
                        </p>
                      </div>
                    </td>

                    {/* Statistics */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                          Revenue: <span style={{ color: '#F8FAFC' }}>Rp 0</span>
                        </p>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                          Orders: <span style={{ color: '#F8FAFC' }}>0</span>
                        </p>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                          Addresses: <span style={{ color: '#F8FAFC' }}>0</span>
                        </p>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <a
                          href={`/admin/customers/${customer.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition hover:bg-blue-500/20"
                          style={{ color: '#60A5FA', border: '1px solid #1E3A5F' }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </a>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="p-1.5 rounded-lg transition hover:bg-red-500/10 hover:text-red-400"
                          style={{ color: '#94A3B8' }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer pagination */}
          {customers.length > 0 && (
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid #2C3A4D', backgroundColor: '#1A2235' }}>
              <span className="text-sm" style={{ color: '#94A3B8' }}>
                Showing {pagination.from ?? 0}–{pagination.to ?? 0} of {pagination.total ?? 0}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => go({ page: pagination.current_page - 1 })}
                  disabled={pagination.current_page <= 1}
                  className="p-2 rounded-lg transition disabled:opacity-40 hover:bg-white/10"
                  style={{ color: '#94A3B8' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm px-3" style={{ color: '#94A3B8' }}>
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
                <button
                  onClick={() => go({ page: pagination.current_page + 1 })}
                  disabled={pagination.current_page >= pagination.last_page}
                  className="p-2 rounded-lg transition disabled:opacity-40 hover:bg-white/10"
                  style={{ color: '#94A3B8' }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateModal
        open={showModal}
        onClose={() => setShowModal(false)}
        customerGroups={customerGroups}
        onSuccess={() => router.reload({ only: ['customers', 'pagination'] })}
      />
    </AdminLayout>
  );
}
