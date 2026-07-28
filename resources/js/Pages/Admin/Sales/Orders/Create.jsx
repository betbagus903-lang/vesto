import React, { useState, useRef, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import {
  Search, Plus, Trash2, Package, Loader2, ChevronLeft, ShoppingCart,
} from 'lucide-react';
import { Drawer, Input, SelectField, PageHeader, fmt } from '../components';

/* ── Add Product Drawer ────────────────────────────────── */
function AddProductDrawer({ open, onClose, onAdd }) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!open) { setQuery(''); setResults([]); }
  }, [open]);

  const search = (val) => {
    setQuery(val);
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/admin/sales/orders/search/products?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return (
    <Drawer open={open} onClose={onClose} title="Add Product" width={440}>
      <div className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748B' }} />
          <Input
            className="pl-10"
            placeholder="Search by name or SKU…"
            value={query}
            onChange={e => search(e.target.value)}
            autoFocus
          />
        </div>

        <div className="space-y-1">
          {loading && (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#64748B' }} />
            </div>
          )}
          {!loading && results.map(p => (
            <button
              key={p.id}
              onClick={() => { onAdd(p); onClose(); }}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition hover:bg-white/5"
              style={{ border: '1px solid #2C3A4D' }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D' }}>
                <Package className="w-5 h-5" style={{ color: '#3B82F6' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#F8FAFC' }}>{p.name}</p>
                <p className="text-xs" style={{ color: '#64748B' }}>
                  {p.sku && <span className="mr-2">SKU: {p.sku}</span>}
                  Stock: {p.stock ?? '—'}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium" style={{ color: '#60A5FA' }}>{fmt(p.price)}</p>
              </div>
            </button>
          ))}
          {!loading && query && results.length === 0 && (
            <p className="text-center text-sm py-8" style={{ color: '#64748B' }}>No products found</p>
          )}
          {!loading && !query && (
            <p className="text-center text-xs py-8" style={{ color: '#64748B' }}>Type to search products</p>
          )}
        </div>
      </div>
    </Drawer>
  );
}

/* ── Cart Item Row ─────────────────────────────────────── */
function CartItem({ item, onQtyChange, onRemove }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D' }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
        <Package className="w-5 h-5" style={{ color: '#3B82F6' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: '#F8FAFC' }}>{item.name}</p>
        {item.sku && <p className="text-xs" style={{ color: '#64748B' }}>SKU: {item.sku}</p>}
        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{fmt(item.price)} / unit</p>
      </div>
      {/* Qty controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQtyChange(item.product_id, item.qty - 1)}
          className="w-7 h-7 rounded-md flex items-center justify-center transition hover:bg-white/10 text-lg font-medium"
          style={{ border: '1px solid #2C3A4D', color: '#94A3B8' }}
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-medium" style={{ color: '#F8FAFC' }}>{item.qty}</span>
        <button
          onClick={() => onQtyChange(item.product_id, item.qty + 1)}
          className="w-7 h-7 rounded-md flex items-center justify-center transition hover:bg-white/10 text-lg font-medium"
          style={{ border: '1px solid #2C3A4D', color: '#94A3B8' }}
        >
          +
        </button>
      </div>
      <div className="text-right w-24 flex-shrink-0">
        <p className="text-sm font-semibold" style={{ color: '#F8FAFC' }}>{fmt(item.price * item.qty)}</p>
      </div>
      <button
        onClick={() => onRemove(item.product_id)}
        className="p-1.5 rounded-lg transition hover:bg-red-500/10 hover:text-red-400 flex-shrink-0"
        style={{ color: '#64748B' }}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
export default function OrderCreate({ selectedCustomer, customerGroups = [] }) {
  const [cart, setCart]               = useState([]);
  const [showProductDrawer, setShowProductDrawer] = useState(false);
  const [notes, setNotes]             = useState('');
  const [submitting, setSubmitting]   = useState(false);

  const subtotal   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax        = Math.round(subtotal * 0.11);
  const grandTotal = subtotal + tax;

  const addProduct = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product_id === product.id);
      if (existing) {
        return prev.map(i => i.product_id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, {
        product_id: product.id,
        name:       product.name,
        sku:        product.sku,
        price:      parseFloat(product.price),
        qty:        1,
      }];
    });
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) return removeItem(productId);
    setCart(prev => prev.map(i => i.product_id === productId ? { ...i, qty } : i));
  };

  const removeItem = (productId) => setCart(prev => prev.filter(i => i.product_id !== productId));

  const handleSubmit = () => {
    if (!selectedCustomer || cart.length === 0) return;
    setSubmitting(true);
    router.post('/admin/sales/orders', {
      customer_id: selectedCustomer.id,
      items: cart.map(i => ({ product_id: i.product_id, qty: i.qty })),
      notes,
    }, {
      onFinish: () => setSubmitting(false),
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-4" style={{ backgroundColor: '#111827', minHeight: '100vh', padding: '24px' }}>
        <PageHeader
          crumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Orders', href: '/admin/sales/orders' },
            { label: 'Create Order' },
          ]}
          title="Create Order"
          actions={
            <a
              href="/admin/sales/orders"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition hover:bg-white/10"
              style={{ border: '1px solid #2C3A4D', color: '#94A3B8' }}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </a>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Cart */}
          <div className="lg:col-span-2 space-y-4">
            {/* Customer Info */}
            <div className="rounded-xl p-5" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#64748B' }}>Customer</p>
              {selectedCustomer ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
                    {(selectedCustomer.first_name?.[0] || '?').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>
                      {selectedCustomer.first_name} {selectedCustomer.last_name}
                    </p>
                    <p className="text-xs" style={{ color: '#64748B' }}>{selectedCustomer.email}</p>
                  </div>
                  <a
                    href="/admin/sales/orders"
                    className="ml-auto text-xs transition hover:text-white"
                    style={{ color: '#64748B' }}
                  >
                    Change
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-2">
                  <p className="text-sm" style={{ color: '#64748B' }}>No customer selected.</p>
                  <a href="/admin/sales/orders" className="text-xs" style={{ color: '#3B82F6' }}>← Select Customer</a>
                </div>
              )}
            </div>

            {/* Cart Items */}
            <div className="rounded-xl p-5 space-y-3" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>Cart Items</p>
                <button
                  onClick={() => setShowProductDrawer(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition"
                  style={{ backgroundColor: '#3B82F6' }}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Product
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-3">
                  <ShoppingCart className="w-10 h-10" style={{ color: '#2C3A4D' }} />
                  <p className="text-sm" style={{ color: '#64748B' }}>Cart is empty. Add products to continue.</p>
                  <button
                    onClick={() => setShowProductDrawer(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: '#3B82F6' }}
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map(item => (
                    <CartItem
                      key={item.product_id}
                      item={item}
                      onQtyChange={updateQty}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="rounded-xl p-5" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Add order notes…"
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none transition"
                style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
              />
            </div>
          </div>

          {/* Right: Summary */}
          <div className="space-y-4">
            <div className="rounded-xl p-5 space-y-4 sticky top-20" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>Order Summary</p>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#94A3B8' }}>Subtotal</span>
                  <span style={{ color: '#F8FAFC' }}>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#94A3B8' }}>Tax (11%)</span>
                  <span style={{ color: '#F8FAFC' }}>{fmt(tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#94A3B8' }}>Shipping</span>
                  <span style={{ color: '#64748B' }}>—</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#94A3B8' }}>Discount</span>
                  <span style={{ color: '#64748B' }}>—</span>
                </div>
              </div>

              <div className="flex justify-between pt-3 font-semibold" style={{ borderTop: '1px solid #2C3A4D' }}>
                <span style={{ color: '#F8FAFC' }}>Grand Total</span>
                <span style={{ color: '#60A5FA', fontSize: '16px' }}>{fmt(grandTotal)}</span>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#64748B' }}>Items</span>
                  <span style={{ color: '#94A3B8' }}>{cart.reduce((s, i) => s + i.qty, 0)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#64748B' }}>Status</span>
                  <span className="px-2 py-0.5 rounded-full text-xs border bg-amber-500/10 text-amber-400 border-amber-500/20">Pending</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !selectedCustomer || cart.length === 0}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#3B82F6' }}
              >
                {submitting ? 'Saving…' : 'Save Order'}
              </button>

              {(!selectedCustomer || cart.length === 0) && (
                <p className="text-xs text-center" style={{ color: '#64748B' }}>
                  {!selectedCustomer ? 'Select a customer first' : 'Add at least one product'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddProductDrawer
        open={showProductDrawer}
        onClose={() => setShowProductDrawer(false)}
        onAdd={addProduct}
      />
    </AdminLayout>
  );
}
