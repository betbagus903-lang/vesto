import React from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { 
  ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, 
  Shield, Clock, ShoppingBag, Star, Package, CheckCircle, 
  XCircle, AlertCircle, TrendingUp
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
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}>
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
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
}

/* ── Info Card Component ───────────────────────────────── */
function InfoCard({ icon: Icon, title, children, className = '' }) {
  return (
    <div className={`rounded-xl p-6 ${className}`} style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4" style={{ color: '#3B82F6' }} />
        <h3 className="text-sm font-semibold" style={{ color: '#F8FAFC' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-2" style={{ borderBottom: '1px solid #2C3A4D' }}>
      <span className="text-sm" style={{ color: '#64748B' }}>{label}</span>
      <span className="text-sm" style={{ color: '#94A3B8' }}>{value || '—'}</span>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────── */
export default function ShowUser({ user }) {
  const stats = {
    totalOrders: user.orders?.length || 0,
    totalReviews: user.reviews?.length || 0,
    totalSpent: user.orders?.reduce((sum, order) => sum + (order.grand_total || 0), 0) || 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.get('/admin/users')}
              className="p-2 rounded-lg hover:bg-white/10 transition"
              style={{ color: '#94A3B8' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: '#F8FAFC' }}>User Details</h1>
              <p className="text-sm mt-1" style={{ color: '#64748B' }}>View user information and activity</p>
            </div>
          </div>
          <button
            onClick={() => router.get(`/admin/users/${user.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-white/10"
            style={{ color: '#94A3B8', border: '1px solid #2C3A4D' }}
          >
            <Edit className="w-4 h-4" />
            Edit User
          </button>
        </div>

        {/* Profile Header */}
        <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img src={`/storage/${user.avatar}`} alt="" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-medium" style={{ backgroundColor: '#3B82F6/20', color: '#3B82F6' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold" style={{ color: '#F8FAFC' }}>{user.name}</h2>
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
              </div>
              <div className="flex items-center gap-6 text-sm" style={{ color: '#64748B' }}>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {user.phone}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: '#64748B' }}>User ID</p>
              <p className="text-lg font-semibold" style={{ color: '#F8FAFC' }}>#{user.id}</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4">
          <InfoCard icon={ShoppingBag} title="Total Orders">
            <p className="text-3xl font-bold" style={{ color: '#F8FAFC' }}>{stats.totalOrders}</p>
            <p className="text-xs mt-1" style={{ color: '#64748B' }}>All time</p>
          </InfoCard>
          <InfoCard icon={Star} title="Total Reviews">
            <p className="text-3xl font-bold" style={{ color: '#F8FAFC' }}>{stats.totalReviews}</p>
            <p className="text-xs mt-1" style={{ color: '#64748B' }}>Product reviews</p>
          </InfoCard>
          <InfoCard icon={TrendingUp} title="Total Spent">
            <p className="text-3xl font-bold" style={{ color: '#F8FAFC' }}>${stats.totalSpent.toFixed(2)}</p>
            <p className="text-xs mt-1" style={{ color: '#64748B' }}>Lifetime value</p>
          </InfoCard>
          <InfoCard icon={Clock} title="Member Since">
            <p className="text-lg font-bold" style={{ color: '#F8FAFC' }}>{new Date(user.created_at).toLocaleDateString()}</p>
            <p className="text-xs mt-1" style={{ color: '#64748B' }}>Account age</p>
          </InfoCard>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="col-span-2 space-y-6">
            {/* Account Information */}
            <InfoCard icon={Shield} title="Account Information">
              <div className="space-y-1">
                <InfoRow label="User ID" value={`#${user.id}`} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Role" value={user.role} />
                <InfoRow label="Status" value={user.status} />
                <InfoRow label="Email Verified" value={user.email_verified_at ? 'Yes' : 'No'} />
                <InfoRow label="Last Login" value={user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'} />
                <InfoRow label="Created At" value={new Date(user.created_at).toLocaleString()} />
                <InfoRow label="Updated At" value={new Date(user.updated_at).toLocaleString()} />
              </div>
            </InfoCard>

            {/* Contact Information */}
            <InfoCard icon={Phone} title="Contact Information">
              <div className="space-y-1">
                <InfoRow label="Phone" value={user.phone} />
                <InfoRow label="Email" value={user.email} />
              </div>
            </InfoCard>

            {/* Address Information */}
            <InfoCard icon={MapPin} title="Address Information">
              <div className="space-y-1">
                <InfoRow label="Street Address" value={user.address} />
                <InfoRow label="City" value={user.city} />
                <InfoRow label="Country" value={user.country} />
                <InfoRow label="Postal Code" value={user.postal_code} />
              </div>
            </InfoCard>

            {/* Recent Orders */}
            <InfoCard icon={Package} title="Recent Orders">
              {user.orders && user.orders.length > 0 ? (
                <div className="space-y-3">
                  {user.orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#0F172A' }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>#{order.order_number}</p>
                        <p className="text-xs" style={{ color: '#64748B' }}>{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>${order.grand_total?.toFixed(2) || '0.00'}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                          order.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-slate-500/10 text-slate-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {user.orders.length > 5 && (
                    <button
                      onClick={() => router.get('/admin/sales/orders')}
                      className="w-full text-center text-sm py-2 rounded-lg transition hover:bg-white/10"
                      style={{ color: '#3B82F6' }}
                    >
                      View All Orders →
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-3" style={{ color: '#64748B' }} />
                  <p className="text-sm" style={{ color: '#64748B' }}>No orders yet</p>
                </div>
              )}
            </InfoCard>

            {/* Recent Reviews */}
            <InfoCard icon={Star} title="Recent Reviews">
              {user.reviews && user.reviews.length > 0 ? (
                <div className="space-y-3">
                  {user.reviews.slice(0, 5).map(review => (
                    <div key={review.id} className="p-3 rounded-lg" style={{ backgroundColor: '#0F172A' }}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>{review.title}</p>
                        <div className="flex items-center gap-1">
                          {Array(5).fill(0).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                              fill={i < review.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs line-clamp-2" style={{ color: '#64748B' }}>{review.comment}</p>
                    </div>
                  ))}
                  {user.reviews.length > 5 && (
                    <button
                      onClick={() => router.get('/admin/catalog/reviews')}
                      className="w-full text-center text-sm py-2 rounded-lg transition hover:bg-white/10"
                      style={{ color: '#3B82F6' }}
                    >
                      View All Reviews →
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 mx-auto mb-3" style={{ color: '#64748B' }} />
                  <p className="text-sm" style={{ color: '#64748B' }}>No reviews yet</p>
                </div>
              )}
            </InfoCard>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <InfoCard icon={Shield} title="Quick Actions">
              <div className="space-y-3">
                <button
                  onClick={() => router.get(`/admin/users/${user.id}/edit`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition hover:bg-white/10"
                  style={{ color: '#94A3B8', border: '1px solid #2C3A4D' }}
                >
                  <Edit className="w-4 h-4" />
                  Edit User
                </button>
                <button
                  onClick={() => router.patch(`/admin/users/${user.id}/toggle-status`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition hover:bg-white/10"
                  style={{ color: '#94A3B8', border: '1px solid #2C3A4D' }}
                >
                  {user.status === 'active' ? (
                    <>
                      <XCircle className="w-4 h-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Activate
                    </>
                  )}
                </button>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                        router.delete(`/admin/users/${user.id}`);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm text-red-400 transition hover:bg-red-500/10"
                    style={{ border: '1px solid #EF4444/30' }}
                  >
                    <AlertCircle className="w-4 h-4" />
                    Delete User
                  </button>
                )}
              </div>
            </InfoCard>

            {/* Account Status */}
            <InfoCard icon={Clock} title="Account Status">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#64748B' }}>Status</span>
                  <StatusBadge status={user.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#64748B' }}>Role</span>
                  <RoleBadge role={user.role} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#64748B' }}>Email Verified</span>
                  {user.email_verified_at ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </div>
            </InfoCard>

            {/* Timeline */}
            <InfoCard icon={Calendar} title="Account Timeline">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#3B82F6' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>Account Created</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>{new Date(user.created_at).toLocaleString()}</p>
                  </div>
                </div>
                {user.email_verified_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#10B981' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>Email Verified</p>
                      <p className="text-xs" style={{ color: '#64748B' }}>{new Date(user.email_verified_at).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {user.last_login_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#F59E0B' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>Last Login</p>
                      <p className="text-xs" style={{ color: '#64748B' }}>{new Date(user.last_login_at).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
