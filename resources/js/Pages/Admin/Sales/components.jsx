import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

/* ── Color maps ────────────────────────────────────────── */
const ORDER_STATUS_COLORS = {
  pending:    'bg-amber-500/10 text-amber-400 border-amber-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shipped:    'bg-purple-500/10 text-purple-400 border-purple-500/20',
  completed:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled:  'bg-red-500/10 text-red-400 border-red-500/20',
};

const PAYMENT_STATUS_COLORS = {
  unpaid:   'bg-red-500/10 text-red-400 border-red-500/20',
  paid:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  refunded: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const SHIPMENT_STATUS_COLORS = {
  pending:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  shipped:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  returned:  'bg-red-500/10 text-red-400 border-red-500/20',
};

/* ── Badge ─────────────────────────────────────────────── */
export function Badge({ label, colorMap }) {
  const cls = colorMap?.[label] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {label ? label.charAt(0).toUpperCase() + label.slice(1) : '—'}
    </span>
  );
}

export const OrderStatusBadge   = ({ status })  => <Badge label={status}  colorMap={ORDER_STATUS_COLORS} />;
export const PaymentStatusBadge = ({ status })  => <Badge label={status}  colorMap={PAYMENT_STATUS_COLORS} />;
export const ShipmentStatusBadge = ({ status }) => <Badge label={status}  colorMap={SHIPMENT_STATUS_COLORS} />;

/* ── Currency format ───────────────────────────────────── */
export function fmt(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

/* ── Pagination ────────────────────────────────────────── */
export function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.last_page <= 1) return null;
  return (
    <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid #2C3A4D', backgroundColor: '#1A2235' }}>
      <span className="text-sm" style={{ color: '#94A3B8' }}>
        Showing {pagination.from}–{pagination.to} of {pagination.total}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPage(pagination.current_page - 1)}
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
          onClick={() => onPage(pagination.current_page + 1)}
          disabled={pagination.current_page >= pagination.last_page}
          className="p-2 rounded-lg transition disabled:opacity-40 hover:bg-white/10"
          style={{ color: '#94A3B8' }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ── Right Drawer ──────────────────────────────────────── */
export function Drawer({ open, onClose, title, children, width = 420 }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative h-full flex flex-col shadow-2xl"
        style={{ width, backgroundColor: '#1E293B', borderLeft: '1px solid #2C3A4D' }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #2C3A4D' }}>
          <h3 className="text-sm font-semibold" style={{ color: '#F8FAFC' }}>{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition" style={{ color: '#94A3B8' }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* ── Table wrapper ─────────────────────────────────────── */
export function TableCard({ children }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function Th({ children, className = '' }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${className}`} style={{ color: '#94A3B8' }}>
      {children}
    </th>
  );
}

export function Td({ children, className = '' }) {
  return <td className={`px-4 py-4 ${className}`}>{children}</td>;
}

/* ── Input / Select ────────────────────────────────────── */
export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition ${className}`}
      style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
      {...props}
    />
  );
}

export function SelectField({ children, ...props }) {
  return (
    <select
      className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition"
      style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
      {...props}
    >
      {children}
    </select>
  );
}

/* ── Page header ───────────────────────────────────────── */
export function PageHeader({ crumbs = [], title, actions }) {
  return (
    <div>
      <nav className="flex items-center gap-2 text-xs mb-1">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: '#A8B3C5' }}>/</span>}
            {c.href
              ? <a href={c.href} className="hover:text-white transition" style={{ color: '#A8B3C5' }}>{c.label}</a>
              : <span style={{ color: '#F5F7FA' }}>{c.label}</span>
            }
          </React.Fragment>
        ))}
      </nav>
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-2xl font-bold" style={{ color: '#F8FAFC' }}>{title}</h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/* ── Empty state ───────────────────────────────────────── */
export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D' }}>
        <Icon className="w-7 h-7" style={{ color: '#3B82F6' }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium mb-1" style={{ color: '#F1F5F9' }}>{title}</p>
        {subtitle && <p className="text-xs" style={{ color: '#64748B' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
