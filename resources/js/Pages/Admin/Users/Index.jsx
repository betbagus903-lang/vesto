import React, { useState, useRef, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import {
  Search, Filter, Download, Plus, Eye, Trash2,
  ChevronLeft, ChevronRight, Users, X, ChevronDown,
  Edit, CheckCircle, XCircle, Shield, MoreVertical
} from 'lucide-react';

/* ── Badge helpers ─────────────────────────────────────── */
function StatusBadge({ status }) {
  const statusConfig = {
    active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Active' },
    inactive: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', label: 'Inactive' },
    suspended: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'Suspended' },
    banned: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Banned' },
  };
  
  const config = statusConfig[status] || statusConfig.inactive;
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
}

function RoleBadge({ role }) {
  const roleConfig = {
    admin: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', label: 'Admin' },
    buyer: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Buyer' },
    seller: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', label: 'Seller' },
  };
  
  const config = roleConfig[role] || roleConfig.buyer;
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
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

/* ── Create User Modal ─────────────────────────────────── */
function CreateModal({ open, onClose, onSuccess }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '', email: '', password: '', password_confirmation: '',
    role: 'buyer', phone: '', status: 'active',
    address: '', city: '', country: '', postal_code: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/users', {
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
          <h2 className="text-base font-semibold" style={{ color: '#F8FAFC' }}>Create User</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition" style={{ color: '#94A3B8' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <Field label="Name" required error={errors.name}>
              <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="John Doe" />
            </Field>
            <Field label="Email" required error={errors.email}>
              <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="john@example.com" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Password" required error={errors.password}>
                <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="••••••••" />
              </Field>
              <Field label="Confirm Password" required error={errors.password_confirmation}>
                <Input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="••••••••" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Role" required error={errors.role}>
                <Select value={data.role} onChange={e => setData('role', e.target.value)}>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </Select>
              </Field>
              <Field label="Status" required error={errors.status}>
                <Select value={data.status} onChange={e => setData('status', e.target.value)}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </Select>
              </Field>
            </div>
            <Field label="Phone" error={errors.phone}>
              <Input value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+62 812 3456 7890" />
            </Field>
            <Field label="Address" error={errors.address}>
              <Input value={data.address} onChange={e => setData('address', e.target.value)} placeholder="Street address" />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="City" error={errors.city}>
                <Input value={data.city} onChange={e => setData('city', e.target.value)} placeholder="City" />
              </Field>
              <Field label="Country" error={errors.country}>
                <Input value={data.country} onChange={e => setData('country', e.target.value)} placeholder="Country" />
              </Field>
              <Field label="Postal Code" error={errors.postal_code}>
                <Input value={data.postal_code} onChange={e => setData('postal_code', e.target.value)} placeholder="12345" />
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
              {processing ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Filter Panel ──────────────────────────────────────── */
function FilterPanel({ open, filters, onChange }) {
  if (!open) return null;
  return (
    <div
      className="absolute left-0 top-full mt-2 w-72 rounded-xl shadow-xl z-40 p-5 space-y-4"
      style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>Filters</p>
      <div>
        <label className="block text-xs mb-1.5" style={{ color: '#94A3B8' }}>Role</label>
        <Select value={filters.role} onChange={e => onChange('role', e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </Select>
      </div>
      <div>
        <label className="block text-xs mb-1.5" style={{ color: '#94A3B8' }}>Status</label>
        <Select value={filters.status} onChange={e => onChange('status', e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </Select>
      </div>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────── */
export default function UsersIndex({ users, filters }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const searchInputRef = useRef(null);

  const handleFilterChange = (key, value) => {
    router.get('/admin/users', { ...filters, [key]: value }, { preserveState: true });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    router.get('/admin/users', { ...filters, search: value }, { preserveState: true });
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    setSelectedUsers(checked ? users.data.map(u => u.id) : []);
  };

  const handleSelectUser = (id) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDelete = (user) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      router.delete(`/admin/users/${user.id}`);
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) {
      router.post('/admin/users/bulk-delete', { user_ids: selectedUsers }, {
        onSuccess: () => { setSelectedUsers([]); setSelectAll(false); }
      });
    }
  };

  const handleToggleStatus = (user) => {
    router.patch(`/admin/users/${user.id}/toggle-status`);
  };

  useEffect(() => {
    setSelectAll(false);
    setSelectedUsers([]);
  }, [users.data]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: '#F8FAFC' }}>Users</h1>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>Manage user accounts and permissions</p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition"
            style={{ backgroundColor: '#3B82F6' }}
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-xl p-4" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#3B82F6/20' }}>
                <Users className="w-5 h-5" style={{ color: '#3B82F6' }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#64748B' }}>Total Users</p>
                <p className="text-lg font-semibold" style={{ color: '#F8FAFC' }}>{users.total}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#10B981/20' }}>
                <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#64748B' }}>Active</p>
                <p className="text-lg font-semibold" style={{ color: '#F8FAFC' }}>{users.data.filter(u => u.status === 'active').length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#F59E0B/20' }}>
                <Shield className="w-5 h-5" style={{ color: '#F59E0B' }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#64748B' }}>Admins</p>
                <p className="text-lg font-semibold" style={{ color: '#F8FAFC' }}>{users.data.filter(u => u.role === 'admin').length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#EF4444/20' }}>
                <XCircle className="w-5 h-5" style={{ color: '#EF4444' }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#64748B' }}>Inactive</p>
                <p className="text-lg font-semibold" style={{ color: '#F8FAFC' }}>{users.data.filter(u => u.status !== 'active').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748B' }} />
              <Input
                ref={searchInputRef}
                placeholder="Search users..."
                value={filters.search || ''}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition hover:bg-white/10"
                style={{ color: '#94A3B8', border: '1px solid #2C3A4D' }}
              >
                <Filter className="w-4 h-4" />
                Filters
                {(filters.role || filters.status) && (
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
                )}
              </button>
              <FilterPanel open={filterOpen} filters={filters} onChange={handleFilterChange} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedUsers.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 transition hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedUsers.length})
              </button>
            )}
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition hover:bg-white/10" style={{ color: '#94A3B8', border: '1px solid #2C3A4D' }}>
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#0F172A', borderBottom: '1px solid #2C3A4D' }}>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={e => handleSelectAll(e.target.checked)}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>User</th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>Last Login</th>
                <th className="px-4 py-3 text-right text-xs font-medium" style={{ color: '#64748B' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.data.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center text-sm" style={{ color: '#64748B' }}>
                    No users found
                  </td>
                </tr>
              ) : users.data.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #2C3A4D' }}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={`/storage/${user.avatar}`} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium" style={{ backgroundColor: '#3B82F6/20', color: '#3B82F6' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>{user.name}</p>
                        <p className="text-xs" style={{ color: '#64748B' }}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#94A3B8' }}>
                    {user.phone || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#94A3B8' }}>
                    {user.city ? `${user.city}, ${user.country}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#94A3B8' }}>
                    {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.get(`/admin/users/${user.id}`)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition"
                        style={{ color: '#94A3B8' }}
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.get(`/admin/users/${user.id}/edit`)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition"
                        style={{ color: '#94A3B8' }}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition"
                        style={{ color: '#94A3B8' }}
                        title="Toggle Status"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 transition"
                          style={{ color: '#EF4444' }}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {users.links && users.links.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #2C3A4D' }}>
              <p className="text-sm" style={{ color: '#64748B' }}>
                Showing {users.from} to {users.to} of {users.total} users
              </p>
              <div className="flex items-center gap-2">
                {users.links.map((link, i) => (
                  <button
                    key={i}
                    onClick={() => link.url && router.get(link.url)}
                    disabled={!link.url}
                    className={`px-3 py-1 rounded text-sm transition ${
                      link.active
                        ? 'text-white'
                        : 'hover:bg-white/10'
                    }`}
                    style={{
                      backgroundColor: link.active ? '#3B82F6' : 'transparent',
                      color: link.active ? '#F8FAFC' : '#94A3B8',
                      cursor: link.url ? 'pointer' : 'not-allowed',
                    }}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} onSuccess={() => router.reload()} />
    </AdminLayout>
  );
}
