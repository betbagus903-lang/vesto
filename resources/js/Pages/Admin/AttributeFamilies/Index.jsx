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
  Layers,
} from 'lucide-react';

export default function AttributeFamiliesIndex({ families, pagination, filters }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [refreshing, setRefreshing]     = useState(false);
  const [showFilter, setShowFilter]     = useState(false);

  const go = (params) =>
    router.get('/admin/attribute-families', { ...filters, ...params }, { preserveState: false });

  const handleSearch = (value) => {
    if (!value || value.trim() === '') {
      const { search, ...rest } = filters;
      router.get('/admin/attribute-families', { ...rest, page: 1 }, { preserveState: false });
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
    router.get('/admin/attribute-families', {}, {
      preserveState: false,
      onFinish: () => setRefreshing(false),
    });
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this attribute family?')) return;
    router.delete(`/admin/attribute-families/${id}`, { onSuccess: handleRefresh });
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    if (!confirm(`Delete ${selectedRows.length} attribute family/families?`)) return;
    router.post('/admin/attribute-families/bulk-delete', { ids: selectedRows }, {
      onSuccess: () => { setSelectedRows([]); handleRefresh(); },
    });
  };

  const sortIcon = (col) => {
    if (filters.sort_by !== col) return null;
    return filters.sort_order === 'asc' ? ' ↑' : ' ↓';
  };

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
            <span style={{ color: '#F5F7FA' }}>Attribute Families</span>
          </nav>
          <div className="flex items-center justify-between mt-2">
            <h1 className="text-2xl font-bold" style={{ color: '#F8FAFC' }}>Attribute Families</h1>
            <a
              href="/admin/attribute-families/create"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition"
              style={{ backgroundColor: '#3B82F6' }}
            >
              <Plus className="w-4 h-4" />
              Create Attribute Family
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
                      checked={selectedRows.length === families.length && families.length > 0}
                      onChange={(e) => setSelectedRows(e.target.checked ? families.map((f) => f.id) : [])}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  {[['id','ID'],['code','Code'],['name','Name']].map(([col, label]) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-white transition"
                      style={{ color: '#94A3B8' }}
                      onClick={() => handleSort(col)}
                    >
                      {label}{sortIcon(col)}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>Groups</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-white transition" style={{ color: '#94A3B8' }} onClick={() => handleSort('created_at')}>
                    Created At{sortIcon('created_at')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#2C3A4D' }}>
                {families.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center" style={{ color: '#94A3B8' }}>
                      <div className="flex flex-col items-center gap-3">
                        <Layers className="w-12 h-12" style={{ color: '#64748B' }} />
                        <span>No attribute families found</span>
                      </div>
                    </td>
                  </tr>
                ) : families.map((family) => (
                  <tr
                    key={family.id}
                    className="transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#263244'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(family.id)}
                        onChange={() => setSelectedRows((prev) =>
                          prev.includes(family.id) ? prev.filter((id) => id !== family.id) : [...prev, family.id]
                        )}
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium" style={{ color: '#64748B' }}>{family.id}</td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-mono" style={{ color: '#94A3B8' }}>{family.code}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium" style={{ color: '#F8FAFC' }}>{family.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {family.attribute_groups_count ?? 0} groups
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs" style={{ color: '#64748B' }}>
                      {family.created_at ? new Date(family.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <a
                          href={`/admin/attribute-families/${family.id}/edit`}
                          className="p-2 rounded-lg transition hover:bg-white/10"
                          style={{ color: '#94A3B8' }}
                        >
                          <Edit className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(family.id)}
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
