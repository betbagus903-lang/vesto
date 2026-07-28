import React, { useState, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import {
  Plus, Search, Edit2, Trash2,
  ChevronLeft, ChevronRight,
  X, Users, CheckCircle, AlertCircle,
  RefreshCw, Filter,
} from 'lucide-react';

/* ─── design tokens ───────────────────────────────────────────── */
const C = {
  bg:       '#0F172A',
  surface:  '#1E293B',
  card:     '#1E293B',
  border:   '#334155',
  input:    '#0F172A',
  textPrimary:   '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted:     '#64748B',
  blue:     '#3B82F6',
  blueHover:'#2563EB',
  red:      '#EF4444',
  redHover: '#DC2626',
  green:    '#22C55E',
  divider:  '#1E293B',
};

/* ─── shared element styles ───────────────────────────────────── */
const inp = (err = false) => ({
  width: '100%', padding: '9px 12px', boxSizing: 'border-box',
  backgroundColor: C.input, border: `1px solid ${err ? C.red : C.border}`,
  borderRadius: '6px', color: C.textPrimary, fontSize: '14px',
  outline: 'none', transition: 'border-color .15s',
});

const btnBlue = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  padding: '8px 16px', borderRadius: '6px', fontSize: '13px',
  fontWeight: '500', backgroundColor: C.blue, color: '#fff',
  border: 'none', cursor: 'pointer', transition: 'background .15s',
};

const btnGhost = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  padding: '8px 14px', borderRadius: '6px', fontSize: '13px',
  fontWeight: '500', backgroundColor: 'transparent',
  color: C.textSecondary, border: `1px solid ${C.border}`,
  cursor: 'pointer', transition: 'background .15s',
};

/* ─── slug helper ─────────────────────────────────────────────── */
const toSlug = (str) =>
  str.toLowerCase().trim()
     .replace(/[^a-z0-9\s-]/g, '')
     .replace(/[\s_]+/g, '-')
     .replace(/-+/g, '-')
     .replace(/^-|-$/g, '');

/* ─── Toast ───────────────────────────────────────────────────── */
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, []);

  const isSuccess = type === 'success';
  return (
    <div style={{
      position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '12px 18px', borderRadius: '8px', minWidth: '280px',
      backgroundColor: isSuccess ? '#052e16' : '#1f0607',
      border: `1px solid ${isSuccess ? '#16a34a' : '#b91c1c'}`,
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      animation: 'toastIn .2s ease',
    }}>
      {isSuccess
        ? <CheckCircle size={16} style={{ color: C.green, flexShrink: 0 }} />
        : <AlertCircle size={16} style={{ color: C.red, flexShrink: 0 }} />}
      <span style={{ fontSize: '13px', color: C.textPrimary, flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex' }}>
        <X size={14} />
      </button>
    </div>
  );
}

/* ─── Delete Confirm Dialog ───────────────────────────────────── */
function DeleteDialog({ group, onCancel, onConfirm, loading }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        backgroundColor: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '10px', width: '100%', maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        animation: 'modalIn .18s ease',
      }}>
        {/* header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: C.textPrimary }}>Delete Group</span>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>
        {/* body */}
        <div style={{ padding: '20px' }}>
          <p style={{ fontSize: '14px', color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
            Are you sure you want to delete the group{' '}
            <strong style={{ color: C.textPrimary }}>"{group.name}"</strong>?
            <br />This action cannot be undone.
          </p>
        </div>
        {/* footer */}
        <div style={{ padding: '0 20px 20px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{ ...btnBlue, backgroundColor: C.red, opacity: loading ? 0.6 : 1 }}
          >
            {loading
              ? <><Spin />Deleting…</>
              : <><Trash2 size={13} />Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Spinner ─────────────────────────────────────────────────── */
function Spin() {
  return (
    <span style={{
      width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: '#fff', borderRadius: '50%',
      display: 'inline-block', animation: 'spin .6s linear infinite',
    }} />
  );
}

/* ─── Group Modal (Create / Edit) ────────────────────────────── */
function GroupModal({ group, onClose, onSaved }) {
  const isEdit = !!group;

  const [form, setForm]       = useState({ code: group?.code ?? '', name: group?.name ?? '' });
  const [errors, setErrors]   = useState({});
  const [saving, setSaving]   = useState(false);
  const [nameEdited, setNameEdited] = useState(false); // track if user manually typed code
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  // auto-generate code from name (only when not editing manually)
  const handleNameChange = (val) => {
    setForm(p => ({
      ...p,
      name: val,
      code: nameEdited ? p.code : toSlug(val),
    }));
  };

  const handleCodeChange = (val) => {
    setNameEdited(true);
    setForm(p => ({ ...p, code: toSlug(val) }));
  };

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = 'The Code field is required.';
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.code)) e.code = 'The Code may only contain lowercase letters, numbers and hyphens.';
    if (!form.name.trim()) e.name = 'The Name field is required.';
    return e;
  };

  const submit = (e) => {
    e.preventDefault();
    const clientErrors = validate();
    if (Object.keys(clientErrors).length) { setErrors(clientErrors); return; }

    setSaving(true);
    setErrors({});

    const url    = isEdit ? `/admin/customers/groups/${group.id}` : '/admin/customers/groups';
    const method = isEdit ? 'put' : 'post';

    router[method](url, form, {
      preserveScroll: true,
      onSuccess: () => {
        setSaving(false);
        onSaved(isEdit ? 'Group updated successfully.' : 'Group created successfully.');
      },
      onError: (errs) => {
        setSaving(false);
        setErrors(errs);
      },
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        backgroundColor: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '10px', width: '100%', maxWidth: '460px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        animation: 'modalIn .18s ease',
      }}>
        {/* header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: C.textPrimary }}>
            {isEdit ? 'Edit Group' : 'Create Group'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        {/* body */}
        <form onSubmit={submit}>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: C.textSecondary, marginBottom: '6px' }}>
                Name <span style={{ color: C.red }}>*</span>
              </label>
              <input
                ref={nameRef}
                value={form.name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Wholesale Customer"
                style={inp(!!errors.name)}
                onFocus={e => e.target.style.borderColor = C.blue}
                onBlur={e => e.target.style.borderColor = errors.name ? C.red : C.border}
              />
              {errors.name && <p style={{ fontSize: '12px', color: C.red, marginTop: '4px' }}>{errors.name}</p>}
            </div>

            {/* Code */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: C.textSecondary, marginBottom: '6px' }}>
                Code <span style={{ color: C.red }}>*</span>
              </label>
              <input
                value={form.code}
                onChange={e => handleCodeChange(e.target.value)}
                placeholder="e.g. wholesale-customer"
                style={inp(!!errors.code)}
                onFocus={e => e.target.style.borderColor = C.blue}
                onBlur={e => e.target.style.borderColor = errors.code ? C.red : C.border}
              />
              <p style={{ fontSize: '11px', color: C.textMuted, marginTop: '4px' }}>
                Auto-generated from name. Lowercase, numbers and hyphens only.
              </p>
              {errors.code && <p style={{ fontSize: '12px', color: C.red, marginTop: '2px' }}>{errors.code}</p>}
            </div>

          </div>

          {/* footer */}
          <div style={{ padding: '0 20px 20px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={btnGhost}>Cancel</button>
            <button type="submit" disabled={saving} style={{ ...btnBlue, opacity: saving ? 0.6 : 1 }}>
              {saving
                ? <><Spin />{isEdit ? 'Updating…' : 'Saving…'}</>
                : isEdit ? 'Update Group' : 'Save Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════ PAGE COMPONENT ════════════════════════════ */
export default function CustomerGroups({ groups = [], pagination = {}, filters = {} }) {
  const { props } = usePage();
  const flash = props.flash || {};

  /* ── state ─────────────────────────────────────────────────── */
  const [showModal,  setShowModal]  = useState(false);
  const [editGroup,  setEditGroup]  = useState(null);   // null = create, object = edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,   setDeleting]   = useState(false);
  const [toast,      setToast]      = useState(null);   // { message, type }
  const [refreshing, setRefreshing] = useState(false);

  /* show flash from server (e.g. after full redirect) */
  useEffect(() => {
    if (flash.success) setToast({ message: flash.success, type: 'success' });
    if (flash.error)   setToast({ message: flash.error,   type: 'error' });
  }, [flash.success, flash.error]);

  /* ── navigation helper ─────────────────────────────────────── */
  const go = (params) =>
    router.get('/admin/customers/groups',
      { ...filters, ...params },
      { preserveState: false, replace: true }
    );

  /* ── search ────────────────────────────────────────────────── */
  const handleSearch = (val) => {
    if (!val || !val.trim()) {
      const { search, ...rest } = filters;
      router.get('/admin/customers/groups', { ...rest, page: 1 }, { preserveState: false });
    } else {
      go({ search: val.trim(), page: 1 });
    }
  };

  /* ── refresh ───────────────────────────────────────────────── */
  const refresh = () => {
    setRefreshing(true);
    router.get('/admin/customers/groups', filters, {
      preserveState: false,
      onFinish: () => setRefreshing(false),
    });
  };

  /* ── delete ────────────────────────────────────────────────── */
  const confirmDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    router.delete(`/admin/customers/groups/${deleteTarget.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleting(false);
        setDeleteTarget(null);
        setToast({ message: 'Group deleted successfully.', type: 'success' });
        refresh();
      },
      onError: () => {
        setDeleting(false);
        setToast({ message: 'Failed to delete group.', type: 'error' });
      },
    });
  };

  /* ── after modal save ──────────────────────────────────────── */
  const handleSaved = (message) => {
    setShowModal(false);
    setEditGroup(null);
    setToast({ message, type: 'success' });
    refresh();
  };

  /* ── sort icon ─────────────────────────────────────────────── */
  const sortIcon = (col) => {
    if (filters.sort_by !== col) return null;
    return filters.sort_order === 'asc' ? ' ↑' : ' ↓';
  };

  const handleSort = (col) => {
    const order = filters.sort_by === col && filters.sort_order === 'asc' ? 'desc' : 'asc';
    go({ sort_by: col, sort_order: order, page: 1 });
  };

  /* ── render ─────────────────────────────────────────────────── */
  return (
    <AdminLayout>
      <div style={{ backgroundColor: C.bg, minHeight: '100vh', padding: '24px 28px' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: '12px', color: C.textMuted, marginBottom: '4px', display: 'flex', gap: '6px' }}>
          <a href="/admin/dashboard" style={{ color: C.textMuted, textDecoration: 'none' }}>Dashboard</a>
          <span>/</span>
          <a href="/admin/customers" style={{ color: C.textMuted, textDecoration: 'none' }}>Customers</a>
          <span>/</span>
          <span style={{ color: C.textSecondary }}>Groups</span>
        </nav>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: C.textPrimary, margin: 0 }}>
            Customer Groups
          </h1>
          <button
            onClick={() => { setEditGroup(null); setShowModal(true); }}
            style={btnBlue}
          >
            <Plus size={14} /> Create Group
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>

          {/* Search */}
          <div style={{ position: 'relative', flex: '0 0 260px' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: C.textMuted }} />
            <input
              defaultValue={filters.search || ''}
              placeholder="Search by name or code…"
              onKeyDown={e => e.key === 'Enter' && handleSearch(e.target.value)}
              onBlur={e => handleSearch(e.target.value)}
              style={{
                ...inp(), paddingLeft: '30px',
                fontSize: '13px', height: '36px', padding: '0 12px 0 30px',
              }}
            />
          </div>

          {/* result count */}
          <span style={{ fontSize: '13px', color: C.textMuted }}>
            {pagination.total ?? 0} Results
          </span>

          {/* per page */}
          <select
            value={filters.per_page || 10}
            onChange={e => go({ per_page: Number(e.target.value), page: 1 })}
            style={{
              padding: '6px 10px', backgroundColor: C.surface, border: `1px solid ${C.border}`,
              borderRadius: '6px', color: C.textSecondary, fontSize: '13px', outline: 'none',
            }}
          >
            {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n} per page</option>)}
          </select>

          {/* refresh */}
          <button
            onClick={refresh}
            disabled={refreshing}
            style={{ ...btnGhost, padding: '6px 10px' }}
          >
            <RefreshCw size={13} style={{ animation: refreshing ? 'spin .6s linear infinite' : 'none' }} />
          </button>

          {/* pagination mini */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
            <button
              onClick={() => go({ page: (pagination.current_page || 1) - 1 })}
              disabled={(pagination.current_page || 1) <= 1}
              style={{ ...btnGhost, padding: '4px 8px', opacity: (pagination.current_page || 1) <= 1 ? 0.4 : 1 }}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: '13px', color: C.textSecondary, padding: '0 6px' }}>
              {pagination.current_page || 1} / {pagination.last_page || 1}
            </span>
            <button
              onClick={() => go({ page: (pagination.current_page || 1) + 1 })}
              disabled={(pagination.current_page || 1) >= (pagination.last_page || 1)}
              style={{ ...btnGhost, padding: '4px 8px', opacity: (pagination.current_page || 1) >= (pagination.last_page || 1) ? 0.4 : 1 }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{
          backgroundColor: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '10px', overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#162032' }}>
                <tr>
                  {/* ID */}
                  <th
                    onClick={() => handleSort('id')}
                    style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600',
                      color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em',
                      cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap', width: '60px' }}
                  >
                    ID{sortIcon('id')}
                  </th>
                  {/* Code */}
                  <th
                    onClick={() => handleSort('code')}
                    style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600',
                      color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em',
                      cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  >
                    Code{sortIcon('code')}
                  </th>
                  {/* Name */}
                  <th
                    onClick={() => handleSort('name')}
                    style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600',
                      color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em',
                      cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                  >
                    Name{sortIcon('name')}
                  </th>
                  {/* Actions */}
                  <th style={{ padding: '11px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '600',
                    color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {groups.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '56px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: 52, height: 52, borderRadius: '50%',
                          backgroundColor: '#0F172A', border: `1px solid ${C.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Users size={22} style={{ color: C.textMuted }} />
                        </div>
                        <p style={{ fontSize: '14px', color: C.textMuted, margin: 0 }}>
                          No customer groups found.
                        </p>
                        <button
                          onClick={() => { setEditGroup(null); setShowModal(true); }}
                          style={{ ...btnBlue, fontSize: '12px', padding: '6px 14px' }}
                        >
                          <Plus size={12} /> Create First Group
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : groups.map((group, idx) => (
                  <tr
                    key={group.id}
                    style={{
                      borderTop: `1px solid ${C.border}`,
                      transition: 'background .12s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a2840'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: C.textMuted, width: '60px' }}>
                      {group.id}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        fontFamily: 'monospace', fontSize: '12px',
                        backgroundColor: '#0F172A', border: `1px solid ${C.border}`,
                        borderRadius: '4px', padding: '2px 8px', color: '#93C5FD',
                      }}>
                        {group.code}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '14px', color: C.textPrimary, fontWeight: '500' }}>
                      {group.name}
                    </td>
                    <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                        {/* Edit */}
                        <button
                          onClick={() => { setEditGroup(group); setShowModal(true); }}
                          title="Edit"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: C.textSecondary, padding: '6px', borderRadius: '6px',
                            display: 'flex', transition: 'all .12s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1E3A5F'; e.currentTarget.style.color = '#60A5FA'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.textSecondary; }}
                        >
                          <Edit2 size={15} />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget(group)}
                          title="Delete"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: C.textSecondary, padding: '6px', borderRadius: '6px',
                            display: 'flex', transition: 'all .12s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2d0f0f'; e.currentTarget.style.color = '#F87171'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.textSecondary; }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer pagination */}
          {pagination.total > 0 && (
            <div style={{
              padding: '12px 16px', borderTop: `1px solid ${C.border}`,
              backgroundColor: '#162032',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '13px', color: C.textMuted }}>
                Showing {pagination.from}–{pagination.to} of {pagination.total}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={() => go({ page: (pagination.current_page || 1) - 1 })}
                  disabled={(pagination.current_page || 1) <= 1}
                  style={{ ...btnGhost, padding: '5px 9px', opacity: (pagination.current_page || 1) <= 1 ? 0.4 : 1, fontSize: '12px' }}
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <span style={{ fontSize: '13px', color: C.textSecondary, padding: '0 8px' }}>
                  Page {pagination.current_page || 1} of {pagination.last_page || 1}
                </span>
                <button
                  onClick={() => go({ page: (pagination.current_page || 1) + 1 })}
                  disabled={(pagination.current_page || 1) >= (pagination.last_page || 1)}
                  style={{ ...btnGhost, padding: '5px 9px', opacity: (pagination.current_page || 1) >= (pagination.last_page || 1) ? 0.4 : 1, fontSize: '12px' }}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modals */}
      {showModal && (
        <GroupModal
          group={editGroup}
          onClose={() => { setShowModal(false); setEditGroup(null); }}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <DeleteDialog
          group={deleteTarget}
          loading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes modalIn { from { opacity: 0; transform: scale(.96) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </AdminLayout>
  );
}
