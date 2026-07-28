import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { useTheme } from '../../../../Context/ThemeContext';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Tag,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Percent,
  DollarSign,
  Truck,
  Gift,
  LayoutGrid,
  List,
  Scissors,
} from 'lucide-react';

export default function CouponsIndex({ coupons = [], stats = {} }) {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Use stats from backend or calculate from coupons
  const couponStats = {
    total: stats.total ?? coupons.length,
    active: stats.active ?? coupons.filter(c => c.status === 'active').length,
    expired: stats.expired ?? coupons.filter(c => c.status === 'expired').length,
    used: stats.total_usage ?? coupons.reduce((sum, c) => sum + (c.used_count || 0), 0),
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600', icon: CheckCircle },
      expired: { color: theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600', icon: XCircle },
      scheduled: { color: theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600', icon: Clock },
      disabled: { color: theme === 'dark' ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600', icon: XCircle },
    };
    const config = statusConfig[status] || statusConfig.disabled;
    const Icon = config.icon;
    const displayStatus = status || 'disabled';
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      percentage: { color: theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600', icon: Percent, label: 'Percentage' },
      fixed: { color: theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600', icon: DollarSign, label: 'Fixed Amount' },
      free_shipping: { color: theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600', icon: Truck, label: 'Free Shipping' },
      buy_x_get_y: { color: theme === 'dark' ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600', icon: Gift, label: 'Buy X Get Y' },
    };
    const config = typeConfig[type] || typeConfig.percentage;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const CouponCard = ({ coupon }) => (
    <div className={`rounded-2xl shadow-sm p-6 ${
      theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Coupon Code */}
          <div className="flex items-center gap-2 mb-2">
            <Tag className={`w-4 h-4 ${theme === 'dark' ? 'text-[#4F6BFF]' : 'text-blue-500'}`} />
            <h3 className={`font-bold text-lg ${
              theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
            }`}>{coupon.code}</h3>
          </div>
          
          {/* Type Badge */}
          {getTypeBadge(coupon.type)}
        </div>
        
        {/* Status Badge */}
        {getStatusBadge(coupon.status)}
      </div>

      {/* Discount Value */}
      <div className={`mb-4 p-3 rounded-xl ${
        theme === 'dark' ? 'bg-[#0C1524]' : 'bg-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
          }`}>Discount Value</span>
          <span className={`font-bold ${
            theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
          }`}>
            {coupon.type === 'percentage' ? coupon.discount_value + '%' : 'Rp' + (coupon.discount_value || 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className={`flex items-center justify-between text-xs ${
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
        }`}>
          <span>Minimum Purchase</span>
          <span className={`font-medium ${
            theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
          }`}>Rp{(coupon.minimum_purchase || 0).toLocaleString()}</span>
        </div>
        <div className={`flex items-center justify-between text-xs ${
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
        }`}>
          <span>Usage Limit</span>
          <span className={`font-medium ${
            theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
          }`}>{coupon.usage_limit || 'Unlimited'}</span>
        </div>
        <div className={`flex items-center justify-between text-xs ${
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
        }`}>
          <span>Used</span>
          <span className={`font-medium ${
            theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
          }`}>{coupon.used_count || 0}</span>
        </div>
        <div className={`flex items-center justify-between text-xs ${
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
        }`}>
          <span>Remaining</span>
          <span className={`font-medium ${
            theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
          }`}>
            {coupon.usage_limit ? (coupon.usage_limit - (coupon.used_count || 0)) : 'Unlimited'}
          </span>
        </div>
        <div className={`flex items-center justify-between text-xs ${
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
        }`}>
          <span>Expires</span>
          <span className={`font-medium ${
            theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
          }`}>
            {coupon.expire_date ? new Date(coupon.expire_date).toLocaleDateString() : 'Never'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      {coupon.usage_limit && (
        <div className="mb-4">
          <div className={`h-2 rounded-full overflow-hidden ${
            theme === 'dark' ? 'bg-[#0C1524]' : 'bg-gray-200'
          }`}>
            <div
              className="h-full bg-gradient-to-r from-[#4F6BFF] to-[#6366F1] transition-all duration-300"
              style={{ width: `${((coupon.used_count || 0) / coupon.usage_limit) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className={`flex items-center gap-2 pt-3 border-t ${
        theme === 'dark' ? 'border-[#1E293B]' : 'border-gray-100'
      }`}>
        <button
          onClick={() => {
            navigator.clipboard.writeText(coupon.code);
            alert('Coupon code copied!');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition ${
            theme === 'dark'
              ? 'bg-[#17243B] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
              : 'bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Copy className="w-3.5 h-3.5" />
          Copy
        </button>
        <button className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition ${
          theme === 'dark'
            ? 'bg-[#17243B] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
            : 'bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}>
          <Edit className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this coupon?')) {
              router.delete(`/admin/marketing/coupons/${coupon.id}`);
            }
          }}
          className={`p-2 rounded-lg transition ${
            theme === 'dark'
              ? 'hover:bg-red-900/30 text-[#94A3B8] hover:text-red-400'
              : 'hover:bg-red-50 text-gray-500 hover:text-red-500'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <nav className={`flex items-center gap-2 text-sm mb-3 ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
          }`}>
            <a href="/admin/dashboard" className={`transition-all duration-200 ${
              theme === 'dark' ? 'hover:text-[#F8FAFC]' : 'hover:text-gray-900'
            }`}>Dashboard</a>
            <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}>/</span>
            <a href="/admin/marketing" className={`transition-all duration-200 ${
              theme === 'dark' ? 'hover:text-[#F8FAFC]' : 'hover:text-gray-900'
            }`}>Marketing</a>
            <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}>/</span>
            <span className={`font-medium ${
              theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
            }`}>Coupons</span>
          </nav>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
          }`}>Coupons</h1>
          <p className={`text-sm mt-2 ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
          }`}>Create and manage discount codes for your store.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: 'Total Coupons',
              value: couponStats.total,
              icon: Tag,
              color: theme === 'dark' ? 'text-blue-400' : 'text-blue-500',
              bg: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
            },
            {
              label: 'Active',
              value: couponStats.active,
              icon: CheckCircle,
              color: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500',
              bg: theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100',
            },
            {
              label: 'Expired',
              value: couponStats.expired,
              icon: XCircle,
              color: theme === 'dark' ? 'text-red-400' : 'text-red-500',
              bg: theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100',
            },
            {
              label: 'Total Used',
              value: couponStats.used,
              icon: TrendingUp,
              color: theme === 'dark' ? 'text-purple-400' : 'text-purple-500',
              bg: theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100',
            },
          ].map((stat, i) => (
            <div key={i} className={`rounded-2xl p-5 shadow-sm ${
              theme === 'dark' ? 'bg-[#101827]' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold mt-1 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>{stat.value.toLocaleString()}</p>
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
              }`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className={`flex flex-wrap items-center gap-4 p-4 rounded-xl shadow-sm ${
          theme === 'dark' ? 'bg-[#101827]' : 'bg-white'
        }`}>
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search coupons..."
              className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                  : 'bg-gray-50 border border-gray-200 text-gray-900'
              }`}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#4F6BFF] transition-all duration-200 ${
              theme === 'dark'
                ? 'border-gray-700 text-[#94A3B8] bg-[#0C1524]'
                : 'border-gray-200 text-gray-600 bg-white'
            }`}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="scheduled">Scheduled</option>
            <option value="disabled">Disabled</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#4F6BFF] transition-all duration-200 ${
              theme === 'dark'
                ? 'border-gray-700 text-[#94A3B8] bg-[#0C1524]'
                : 'border-gray-200 text-gray-600 bg-white'
            }`}
          >
            <option value="all">All Types</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
            <option value="free_shipping">Free Shipping</option>
            <option value="buy_x_get_y">Buy X Get Y</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#4F6BFF] transition-all duration-200 ${
              theme === 'dark'
                ? 'border-gray-700 text-[#94A3B8] bg-[#0C1524]'
                : 'border-gray-200 text-gray-600 bg-white'
            }`}
          >
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="code">Sort by: Code</option>
            <option value="used">Sort by: Most Used</option>
          </select>

          {/* View Toggle */}
          <div className={`flex items-center border rounded-xl overflow-hidden ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-all duration-200 ${
                viewMode === 'grid'
                  ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                  : theme === 'dark' ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17243B]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-all duration-200 ${
                viewMode === 'list'
                  ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                  : theme === 'dark' ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17243B]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Create Button */}
          <a
            href="/admin/marketing/coupons/create"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#4F6BFF] to-[#6366F1] text-white text-sm shadow-lg shadow-[#4F6BFF]/25 hover:shadow-xl hover:shadow-[#4F6BFF]/35 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </a>
        </div>

        {/* Coupons Grid */}
        {coupons.length === 0 ? (
          <div className={`rounded-2xl p-12 text-center ${
            theme === 'dark' ? 'bg-[#101827]' : 'bg-white'
          }`}>
            <Tag className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-300'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
            }`}>No coupons yet</h3>
            <p className={`text-sm mb-6 ${
              theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
            }`}>Create your first discount coupon to get started.</p>
            <a
              href="/admin/marketing/coupons/create"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#4F6BFF] to-[#6366F1] text-white text-sm shadow-lg shadow-[#4F6BFF]/25 hover:shadow-xl hover:shadow-[#4F6BFF]/35 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coupons.map(coupon => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
