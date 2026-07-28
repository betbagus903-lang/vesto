import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import {
  Search,
  Filter,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Settings2,
} from 'lucide-react';

const TYPE_LABELS = {
  text:        'Text',
  textarea:    'Textarea',
  boolean:     'Boolean',
  select:      'Select',
  multiselect: 'Multiselect',
  price:       'Price',
  date:        'Date',
  datetime:    'Datetime',
  image:       'Image',
};

const TYPE_COLORS = {
  text:        'bg-blue-500/10 text-blue-400 border-blue-500/20',
  textarea:    'bg-purple-500/10 text-purple-400 border-purple-500/20',
  boolean:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  select:      'bg-amber-500/10 text-amber-400 border-amber-500/20',
  multiselect: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  price:       'bg-green-500/10 text-green-400 border-green-500/20',
  date:        'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  datetime:    'bg-teal-500/10 text-teal-400 border-teal-500/20',
  image:       'bg-pink-500/10 text-pink-400 border-pink-500/20',
};

function BoolBadge({ value }) {
  return value ? (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Yes</span>
  ) : (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-slate-500/10 text-slate-400 border-slate-500/20">No</span>
  );
}

export default function AttributesIndex({ attributes, pagination, filters }) {
  const [selectedRows, setSelectedRows]       = useState([]);
  const [refreshing, setRefreshing]           = useState(false);
  const [showFilter, setShowFilter]           = useState(false);

  /* ── helpers ─────────────────────────────────────────── */
  const go = (params) =>
    router.get('/admin/attributes', { ...filters, ...params }, { preserveState: false });

  const handleSearch = (value) => {
    if (!value || value.trim() === '') {
      const { search, ...rest } = filters;
      router.get('/admin/attributes', { ...rest, page: 1 }, { preserveState: false });
    } else {
      go({ search: value, page: 1 });
    }
  };

  const handleSort = (col) => {
    const order = filters.sort_by === col && filters.sort_order === 'asc' ? 'desc' : 'asc';
    go({ sort_by: col, sort_order: order });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setSelectedRows([]);
    router.get('/admin/attributes', {}, {
      preserveState: false,
      onFinish: () => setRefreshing(false),
    });
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this attribute?')) return;
    router.delete(`/admin/attributes/${id}`, { onSuccess: handleRefresh });
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    if (!confirm(`Delete ${selectedRows.length} attribute(s)?`)) return;
    router.post('/admin/attributes/bulk-delete', { ids: selectedRows }, {
      onSuccess: () => { setSelectedRows([]); handleRefresh(); },
    });
  };

  const sortIcon = (col) => {
    if (filters.sort_by !== col) return null;
    return filters.sort_order === 'asc' ? ' ↑' : ' ↓';
  };

  /* ── render ───────────────────────────────────────────── */
  return (
    <AdminLayout>
      <div className="space-y-4" style={{ backgroundColor: '#111827', minHeight: '100vh', padding: '24px' }}>

        {/* Breadcrumb + Header */}
        <div>
          <nav className="flex items-center gap-2 text-xs mb-1">
            <a href="/admin/dashboard" className="hover:text-white transition" style={{ color: '#A8B3C5' }}>Dashboard</a>
            <span style={{ color: '#A8B3C5' }}>/</span>
            <span style={{ color: '#A8B3C5' }}>Catalog</span>
            <span style={{ color: '#A8B3C5' }}>/</span>
            <span style={{ color: '#F5F7FA' }}>Attributes</span>
          </nav>
          <div className="flex items-center justify-between mt-2">
            <h1 className="text-2xl font-bold" style={{ color: '#F8FAFC' }}>Attributes</h1>
            <a
              href="/admin/attributes/create"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition"
              style={{ backgroundColor: '#3B82F6' }}
            >
              <Plus className="w-4 h-4" />
              Create Attribute
            </a>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative" style={{ width: '280px' }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by name or code…"
              defaultValue={filters.search}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
              onBlur={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none transition"
              style={{ backgroundColor: '#1A2235', borderColor: '#2C3A4D', borderWidth: '1px', color: '#F8FAFC' }}
            />
          </div>

          <span className="text-sm" style={{ color: '#94A3B8' }}>{pagination.total} Results</span>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition"
              style={{ backgroundColor: 'transparent', borderColor: '#2C3A4D', color: '#94A3B8' }}
            >
              <Filter className="w-4 h-4" />Filter
            </button>
            {showFilter && (
              <div
                className="absolute left-0 top-full mt-2 w-64 rounded-lg shadow-lg z-50 p-4 space-y-4"
                style={{ backgroundColor: '#1E293B', borderColor: '#2C3A4D', borderWidth: '1px' }}
              >
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#94A3B8' }}>Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => go({ type: e.target.value, page: 1 })}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                    style={{ backgroundColor: '#1A2235', borderColor: '#2C3A4D', borderWidth: '1px', color: '#F8FAFC' }}
                  >
                    <option value="">All Types</option>
                    {Object.entries(TYPE_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#94A3B8' }}>Required</label>
                  <select
                    value={filters.is_required}
                    onChange={(e) => go({ is_required: e.target.value, page: 1 })}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                    style={{ backgroundColor: '#1A2235', borderColor: '#2C3A4D', borderWidth: '1px', color: '#F8FAFC' }}
                  >
                    <option value="">All</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Per page */}
          <select
            value={filters.per_page}
            onChange={(e) => go({ per_page: Number(e.target.value), page: 1 })}
            className="px-3 py-2 rounded-lg text-sm focus:outline-none"
            style={{ backgroundColor: '#1A2235', borderColor: '#2C3A4D', borderWidth: '1px', color: '#F8FAFC' }}
          >
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="text-sm" style={{ color: '#94A3B8' }}>Per Page</span>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg border transition disabled:opacity-50"
            style={{ backgroundColor: 'transparent', borderColor: '#2C3A4D', color: '#94A3B8' }}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Pagination mini */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => go({ page: pagination.current_page - 1 })}
              disabled={pagination.current_page === 1}
              className="p-1 rounded disabled:opacity-40"
              style={{ color: '#94A3B8' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm" style={{ color: '#94A3B8' }}>
              {pagination.current_page} of {pagination.last_page}
            </span>
            <button
              onClick={() => go({ page: pagination.current_page + 1 })}
              disabled={pagination.current_page === pagination.last_page}
              className="p-1 rounded disabled:opacity-40"
              style={{ color: '#94A3B8' }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bulk delete */}
          {selectedRows.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition"
              style={{ borderColor: '#EF4444', color: '#EF4444' }}
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedRows.length})
            </button>
          )}
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1E293B', borderColor: '#2C3A4D', borderWidth: '1px' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#1A2235' }}>
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === attributes.length && attributes.length > 0}
                      onChange={(e) => setSelectedRows(e.target.checked ? attributes.map((a) => a.id) : [])}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  {[['id','ID'],['code','Code'],['admin_name','Name'],['type','Type']].map(([col, label]) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-white transition"
                      style={{ color: '#94A3B8' }}
                      onClick={() => handleSort(col)}
                    >
                      {label}{sortIcon(col)}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>Required</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>Unique</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>Locale Based</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>Channel Based</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-white transition" style={{ color: '#94A3B8' }} onClick={() => handleSort('created_at')}>
                    Created At{sortIcon('created_at')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#2C3A4D' }}>
                {attributes.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center" style={{ color: '#94A3B8' }}>
                      <div className="flex flex-col items-center gap-3">
                        <Settings2 className="w-12 h-12" style={{ color: '#64748B' }} />
                        <span>No attributes found</span>
                      </div>
                    </td>
                  </tr>
                ) : attributes.map((attr, idx) => (
                  <tr
                    key={attr.id}
                    className="transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#263244'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(attr.id)}
                        onChange={() => setSelectedRows((prev) =>
                          prev.includes(attr.id) ? prev.filter((id) => id !== attr.id) : [...prev, attr.id]
                        )}
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium" style={{ color: '#64748B' }}>{attr.id}</td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-mono" style={{ color: '#94A3B8' }}>{attr.code}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium" style={{ color: '#F8FAFC' }}>{attr.admin_name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${TYPE_COLORS[attr.type] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {TYPE_LABELS[attr.type] || attr.type}
                      </span>
                    </td>
                    <td className="px-4 py-4"><BoolBadge value={attr.is_required} /></td>
                    <td className="px-4 py-4"><BoolBadge value={attr.is_unique} /></td>
                    <td className="px-4 py-4"><BoolBadge value={attr.value_per_locale} /></td>
                    <td className="px-4 py-4"><BoolBadge value={attr.value_per_channel} /></td>
                    <td className="px-4 py-4 text-xs" style={{ color: '#64748B' }}>
                      {attr.created_at ? new Date(attr.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <a
                          href={`/admin/attributes/${attr.id}/edit`}
                          className="p-2 rounded-lg transition hover:bg-white/10"
                          style={{ color: '#94A3B8' }}
                        >
                          <Edit className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(attr.id)}
                          className="p-2 rounded-lg transition hover:bg-red-500/10 hover:text-red-400"
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
          <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: '#2C3A4D', backgroundColor: '#1A2235' }}>
            <span className="text-sm" style={{ color: '#94A3B8' }}>
              Showing {pagination.from || 0}–{pagination.to || 0} of {pagination.total}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => go({ page: pagination.current_page - 1 })}
                disabled={pagination.current_page === 1}
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
                disabled={pagination.current_page === pagination.last_page}
                className="p-2 rounded-lg transition disabled:opacity-40 hover:bg-white/10"
                style={{ color: '#94A3B8' }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
