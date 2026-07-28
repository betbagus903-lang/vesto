import React, { useState } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import {
  User, MapPin, ShoppingBag, Star, Heart,
  ChevronLeft, Mail, Phone, Calendar, Tag, Globe, Hash,
} from 'lucide-react';

/* ── Helpers ───────────────────────────────────────────── */
function StatusBadge({ status }) {
  const active = status === 'active';
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
      active
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }`}>
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid #1E293B' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0F172A' }}>
        <Icon className="w-4 h-4" style={{ color: '#3B82F6' }} />
      </div>
      <div>
        <p className="text-xs mb-0.5" style={{ color: '#64748B' }}>{label}</p>
        <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>{value || '—'}</p>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D' }}>
        <Icon className="w-5 h-5" style={{ color: '#64748B' }} />
      </div>
      <p className="text-sm" style={{ color: '#64748B' }}>{message}</p>
    </div>
  );
}

const TABS = [
  { key: 'info',      label: 'Customer Information', icon: User },
  { key: 'addresses', label: 'Addresses',             icon: MapPin },
  { key: 'orders',    label: 'Orders',                icon: ShoppingBag },
  { key: 'reviews',   label: 'Reviews',               icon: Star },
  { key: 'wishlist',  label: 'Wishlist',              icon: Heart },
];

export default function CustomerShow({ customer, addresses = [], orders = [], reviews = [], wishlist = [] }) {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <AdminLayout>
      <div className="space-y-4" style={{ backgroundColor: '#111827', minHeight: '100vh', padding: '24px' }}>

        {/* Breadcrumb + Header */}
        <div>
          <nav className="flex items-center gap-2 text-xs mb-1">
            <a href="/admin/dashboard" className="hover:text-white transition" style={{ color: '#A8B3C5' }}>Dashboard</a>
            <span style={{ color: '#A8B3C5' }}>/</span>
            <a href="/admin/customers" className="hover:text-white transition" style={{ color: '#A8B3C5' }}>Customers</a>
            <span style={{ color: '#A8B3C5' }}>/</span>
            <span style={{ color: '#F5F7FA' }}>{customer.full_name}</span>
          </nav>
          <div className="flex items-center gap-3 mt-2">
            <a
              href="/admin/customers"
              className="p-2 rounded-lg transition hover:bg-white/10"
              style={{ color: '#94A3B8', border: '1px solid #2C3A4D' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </a>
            <h1 className="text-2xl font-bold" style={{ color: '#F8FAFC' }}>{customer.full_name}</h1>
            <StatusBadge status={customer.status} />
          </div>
        </div>

        {/* Profile Card */}
        <div className="rounded-xl p-5 flex items-center gap-5" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
            {(customer.first_name?.[0] || '?').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold" style={{ color: '#F8FAFC' }}>{customer.full_name}</h2>
            <p className="text-sm" style={{ color: '#64748B' }}>{customer.email}</p>
            <div className="flex items-center gap-3 mt-2">
              {customer.customer_group && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {customer.customer_group.name}
                </span>
              )}
              {customer.channel && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-slate-500/10 text-slate-400 border-slate-500/20">
                  {customer.channel.charAt(0).toUpperCase() + customer.channel.slice(1)}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: '#64748B' }}>Customer ID</p>
            <p className="text-sm font-mono font-medium" style={{ color: '#94A3B8' }}>#{customer.id}</p>
            <p className="text-xs mt-1" style={{ color: '#64748B' }}>Joined {customer.created_at}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto" style={{ borderBottom: '1px solid #2C3A4D' }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition"
              style={{
                color: activeTab === tab.key ? '#60A5FA' : '#94A3B8',
                borderBottom: activeTab === tab.key ? '2px solid #3B82F6' : '2px solid transparent',
              }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-xl" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>

          {/* Customer Information */}
          {activeTab === 'info' && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <div>
                <InfoRow icon={User}     label="First Name"      value={customer.first_name} />
                <InfoRow icon={User}     label="Last Name"       value={customer.last_name} />
                <InfoRow icon={Mail}     label="Email"           value={customer.email} />
                <InfoRow icon={Phone}    label="Contact Number"  value={customer.phone} />
                <InfoRow icon={Tag}      label="Gender"          value={customer.gender ? customer.gender.charAt(0).toUpperCase() + customer.gender.slice(1) : null} />
              </div>
              <div>
                <InfoRow icon={Calendar} label="Date of Birth"   value={customer.date_of_birth} />
                <InfoRow icon={Hash}     label="Status"          value={customer.status ? customer.status.charAt(0).toUpperCase() + customer.status.slice(1) : null} />
                <InfoRow icon={Tag}      label="Customer Group"  value={customer.customer_group?.name} />
                <InfoRow icon={Globe}    label="Channel"         value={customer.channel ? customer.channel.charAt(0).toUpperCase() + customer.channel.slice(1) : null} />
                <InfoRow icon={Calendar} label="Created At"      value={customer.created_at} />
              </div>
            </div>
          )}

          {/* Addresses */}
          {activeTab === 'addresses' && (
            addresses.length === 0
              ? <EmptyState icon={MapPin} message="No address found." />
              : (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr, i) => (
                    <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D' }}>
                      <p className="text-sm font-medium mb-1" style={{ color: '#F8FAFC' }}>{addr.name}</p>
                      <p className="text-xs" style={{ color: '#94A3B8' }}>{addr.address}</p>
                    </div>
                  ))}
                </div>
              )
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            orders.length === 0
              ? <EmptyState icon={ShoppingBag} message="No orders found." />
              : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#1A2235' }}>
                      <tr>
                        {['Order ID', 'Status', 'Grand Total', 'Date'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: '#2C3A4D' }}>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td className="px-4 py-3 text-sm font-mono" style={{ color: '#94A3B8' }}>#{order.id}</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs border bg-blue-500/10 text-blue-400 border-blue-500/20">{order.status}</span></td>
                          <td className="px-4 py-3 text-sm" style={{ color: '#F8FAFC' }}>{order.grand_total}</td>
                          <td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            reviews.length === 0
              ? <EmptyState icon={Star} message="No reviews found." />
              : (
                <div className="p-6 space-y-3">
                  {reviews.map((r, i) => (
                    <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D' }}>
                      <p className="text-sm" style={{ color: '#F8FAFC' }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )
          )}

          {/* Wishlist */}
          {activeTab === 'wishlist' && (
            wishlist.length === 0
              ? <EmptyState icon={Heart} message="No wishlist items found." />
              : (
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {wishlist.map((item, i) => (
                    <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D' }}>
                      <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>{item.name}</p>
                    </div>
                  ))}
                </div>
              )
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
