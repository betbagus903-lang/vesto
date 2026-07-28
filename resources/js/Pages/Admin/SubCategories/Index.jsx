import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import SubCategoryModal from '../../../Components/Admin/SubCategoryModal';
import { Plus, Search, Edit2, Trash2, ChevronUp, ChevronDown, Eye } from 'lucide-react';

const S = {
    page:   { backgroundColor: '#111827', minHeight: '100vh', padding: '24px' },
    card:   { backgroundColor: '#1E293B', border: '1px solid #2C3A4D', borderRadius: '12px' },
    th:     { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #2C3A4D' },
    td:     { padding: '14px 16px', fontSize: '14px', color: '#F8FAFC', borderBottom: '1px solid #1a2535' },
    input:  { backgroundColor: '#0F172A', border: '1px solid #2C3A4D', borderRadius: '8px', color: '#F8FAFC', padding: '8px 12px', fontSize: '14px', outline: 'none' },
    btn:    { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', border: 'none' },
};

function Badge({ active }) {
    return (
        <span style={{
            padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
            backgroundColor: active ? '#052e16' : '#1c1917',
            color: active ? '#4ade80' : '#a8a29e',
            border: `1px solid ${active ? '#166534' : '#44403c'}`,
        }}>
            {active ? 'Active' : 'Inactive'}
        </span>
    );
}

export default function SubCategoriesIndex({ subCategories = [], pagination = {}, filters = {}, categories = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const timer = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);

    const go = (params) => router.get('/admin/sub-categories', { ...filters, ...params }, { preserveState: false });

    const handleSearch = (val) => {
        setSearch(val);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => go({ search: val, page: 1 }), 400);
    };

    const handleSort = (col) => {
        const order = filters.sort_by === col && filters.sort_order === 'asc' ? 'desc' : 'asc';
        go({ sort_by: col, sort_order: order });
    };

    const SortIcon = ({ col }) => {
        if (filters.sort_by !== col) return null;
        return filters.sort_order === 'asc' ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />;
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this sub category?')) return;
        router.delete(`/admin/sub-categories/${id}`);
    };

    return (
        <AdminLayout>
            <div style={S.page}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 style={{ color: '#F8FAFC', fontSize: '22px', fontWeight: '700' }}>Sub Categories</h1>
                        <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '2px' }}>
                            {pagination.total ?? 0} sub categories total
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingSubCategory(null);
                            setShowModal(true);
                        }}
                        style={{ ...S.btn, backgroundColor: '#3B82F6', color: '#fff' }}
                    >
                        <Plus className="w-4 h-4" /> Add Sub Category
                    </button>
                </div>

                {/* Filters */}
                <div style={{ ...S.card, padding: '16px', marginBottom: '20px' }}>
                    <div className="flex flex-wrap gap-3">
                        <div className="relative flex-1 min-w-48">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
                            <input
                                style={{ ...S.input, paddingLeft: '36px', width: '100%' }}
                                placeholder="Search sub categories…"
                                value={search}
                                onChange={e => handleSearch(e.target.value)}
                            />
                        </div>
                        <select
                            style={{ ...S.input, minWidth: '160px' }}
                            value={filters.category_id || ''}
                            onChange={e => go({ category_id: e.target.value, page: 1 })}
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select
                            style={{ ...S.input, minWidth: '130px' }}
                            value={filters.status || ''}
                            onChange={e => go({ status: e.target.value, page: 1 })}
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div style={S.card}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {[['name', 'Name'], ['category_id', 'Category'], ['status', 'Status'], ['created_at', 'Created At']].map(([col, label]) => (
                                        <th key={col} style={S.th}>
                                            <button onClick={() => handleSort(col)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit', fontWeight: 'inherit', textTransform: 'inherit', letterSpacing: 'inherit' }}>
                                                {label}<SortIcon col={col} />
                                            </button>
                                        </th>
                                    ))}
                                    <th style={S.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ ...S.td, textAlign: 'center', color: '#94A3B8', padding: '48px' }}>
                                            No sub categories found
                                        </td>
                                    </tr>
                                ) : subCategories.map(sub => (
                                    <tr key={sub.id} style={{ transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#17243B'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td style={S.td}>
                                            <div style={{ fontWeight: '600' }}>{sub.name}</div>
                                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{sub.slug}</div>
                                        </td>
                                        <td style={S.td}>
                                            <span style={{ color: '#94A3B8' }}>{sub.category?.name ?? '—'}</span>
                                        </td>
                                        <td style={S.td}><Badge active={sub.status} /></td>
                                        <td style={S.td}>
                                            <span style={{ color: '#94A3B8', fontSize: '13px' }}>
                                                {new Date(sub.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td style={S.td}>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => {
                                                    setEditingSubCategory(sub);
                                                    setShowModal(true);
                                                }}
                                                    style={{ padding: '6px', borderRadius: '6px', color: '#3B82F6', backgroundColor: '#1e3a5f', border: 'none', cursor: 'pointer', display: 'flex' }}
                                                    title="Edit">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(sub.id)}
                                                    style={{ padding: '6px', borderRadius: '6px', color: '#EF4444', backgroundColor: '#2d1515', border: 'none', cursor: 'pointer', display: 'flex' }}
                                                    title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #2C3A4D' }}>
                            <span style={{ color: '#94A3B8', fontSize: '13px' }}>
                                Showing {pagination.from}–{pagination.to} of {pagination.total}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => go({ page: pagination.current_page - 1 })}
                                    disabled={pagination.current_page <= 1}
                                    style={{ ...S.btn, backgroundColor: '#17243B', color: '#94A3B8', opacity: pagination.current_page <= 1 ? 0.4 : 1 }}>
                                    ← Prev
                                </button>
                                <span style={{ padding: '8px 12px', color: '#F8FAFC', fontSize: '14px' }}>
                                    {pagination.current_page} / {pagination.last_page}
                                </span>
                                <button
                                    onClick={() => go({ page: pagination.current_page + 1 })}
                                    disabled={pagination.current_page >= pagination.last_page}
                                    style={{ ...S.btn, backgroundColor: '#17243B', color: '#94A3B8', opacity: pagination.current_page >= pagination.last_page ? 0.4 : 1 }}>
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <SubCategoryModal
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingSubCategory(null);
                }}
                subCategory={editingSubCategory}
                categories={categories}
                onSuccess={() => router.reload({ only: ['subCategories', 'pagination'] })}
            />
        </AdminLayout>
    );
}
