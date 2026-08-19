import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { ArrowLeft, Save, X, Upload, User, Mail, Phone, MapPin, Shield, Lock } from 'lucide-react';

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

function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition resize-none ${className}`}
      style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
      {...props}
    />
  );
}

/* ── Main Component ────────────────────────────────────── */
export default function EditUser({ user }) {
  const [avatarPreview, setAvatarPreview] = useState(user.avatar ? `/storage/${user.avatar}` : null);
  
  const { data, setData, put, processing, errors, reset } = useForm({
    name: user.name || '',
    email: user.email || '',
    password: '',
    password_confirmation: '',
    role: user.role || 'buyer',
    phone: user.phone || '',
    status: user.status || 'active',
    avatar: null,
    address: user.address || '',
    city: user.city || '',
    country: user.country || '',
    postal_code: user.postal_code || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/admin/users/${user.id}`, {
      onSuccess: () => router.get('/admin/users'),
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('avatar', file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = () => {
    setData('avatar', null);
    setAvatarPreview(null);
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
              <h1 className="text-2xl font-semibold" style={{ color: '#F8FAFC' }}>Edit User</h1>
              <p className="text-sm mt-1" style={{ color: '#64748B' }}>Update user information and permissions</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Avatar & Basic Info */}
            <div className="col-span-2 space-y-6">
              {/* Avatar Section */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: '#F8FAFC' }}>Profile Picture</h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                    ) : (
                      <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-medium" style={{ backgroundColor: '#3B82F6/20', color: '#3B82F6' }}>
                        {data.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm cursor-pointer transition hover:bg-white/10" style={{ color: '#94A3B8', border: '1px solid #2C3A4D' }}>
                      <Upload className="w-4 h-4" />
                      Upload New Avatar
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs mt-2" style={{ color: '#64748B' }}>
                      Recommended: Square image, max 2MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4" style={{ color: '#3B82F6' }} />
                  <h3 className="text-sm font-semibold" style={{ color: '#F8FAFC' }}>Basic Information</h3>
                </div>
                <div className="space-y-4">
                  <Field label="Name" required error={errors.name}>
                    <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="John Doe" />
                  </Field>
                  <Field label="Email" required error={errors.email}>
                    <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="john@example.com" />
                  </Field>
                  <Field label="Phone" error={errors.phone}>
                    <Input value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+62 812 3456 7890" />
                  </Field>
                </div>
              </div>

              {/* Password */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4" style={{ color: '#3B82F6' }} />
                  <h3 className="text-sm font-semibold" style={{ color: '#F8FAFC' }}>Change Password</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-xs" style={{ color: '#64748B' }}>
                    Leave blank to keep current password
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="New Password" error={errors.password}>
                      <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="••••••••" />
                    </Field>
                    <Field label="Confirm Password" error={errors.password_confirmation}>
                      <Input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="••••••••" />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4" style={{ color: '#3B82F6' }} />
                  <h3 className="text-sm font-semibold" style={{ color: '#F8FAFC' }}>Address Information</h3>
                </div>
                <div className="space-y-4">
                  <Field label="Street Address" error={errors.address}>
                    <Textarea
                      value={data.address}
                      onChange={e => setData('address', e.target.value)}
                      placeholder="Enter full address"
                      rows={3}
                    />
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
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6">
              {/* Account Settings */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4" style={{ color: '#3B82F6' }} />
                  <h3 className="text-sm font-semibold" style={{ color: '#F8FAFC' }}>Account Settings</h3>
                </div>
                <div className="space-y-4">
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
              </div>

              {/* Account Info */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: '#F8FAFC' }}>Account Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: '#64748B' }}>User ID</span>
                    <span style={{ color: '#94A3B8' }}>#{user.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#64748B' }}>Joined</span>
                    <span style={{ color: '#94A3B8' }}>{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#64748B' }}>Last Login</span>
                    <span style={{ color: '#94A3B8' }}>
                      {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#64748B' }}>Email Verified</span>
                    <span style={{ color: user.email_verified_at ? '#10B981' : '#EF4444' }}>
                      {user.email_verified_at ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: '#F8FAFC' }}>Actions</h3>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => router.get(`/admin/users/${user.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition hover:bg-white/10"
                    style={{ color: '#94A3B8', border: '1px solid #2C3A4D' }}
                  >
                    <Mail className="w-4 h-4" />
                    View User Details
                  </button>
                  {user.role !== 'admin' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                          router.delete(`/admin/users/${user.id}`);
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm text-red-400 transition hover:bg-red-500/10"
                      style={{ border: '1px solid #EF4444/30' }}
                    >
                      <X className="w-4 h-4" />
                      Delete User
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 rounded-xl" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
            <button
              type="button"
              onClick={() => router.get('/admin/users')}
              className="px-6 py-2 rounded-lg text-sm font-medium transition hover:bg-white/10"
              style={{ color: '#94A3B8', border: '1px solid #2C3A4D' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium text-white transition disabled:opacity-60"
              style={{ backgroundColor: '#3B82F6' }}
            >
              <Save className="w-4 h-4" />
              {processing ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
