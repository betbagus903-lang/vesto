import React from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { 
  BarChart3, TrendingUp, Users, Package, DollarSign, 
  ShoppingCart, ArrowRight, Calendar, Download
} from 'lucide-react';

/* ── Stat Card Component ───────────────────────────────── */
function StatCard({ icon: Icon, title, value, change, trend = 'up' }) {
  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#3B82F6/20' }}>
          <Icon className="w-5 h-5" style={{ color: '#3B82F6' }} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs ${
            trend === 'up' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
            {change}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold" style={{ color: '#F8FAFC' }}>{value}</p>
      <p className="text-sm mt-1" style={{ color: '#64748B' }}>{title}</p>
    </div>
  );
}

/* ── Report Card Component ─────────────────────────────── */
function ReportCard({ icon: Icon, title, description, href, stats }) {
  return (
    <div 
      onClick={() => router.get(href)}
      className="rounded-xl p-6 cursor-pointer transition hover:bg-white/5"
      style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#3B82F6/20' }}>
          <Icon className="w-5 h-5" style={{ color: '#3B82F6' }} />
        </div>
        <ArrowRight className="w-4 h-4" style={{ color: '#64748B' }} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: '#F8FAFC' }}>{title}</h3>
      <p className="text-sm mb-4" style={{ color: '#64748B' }}>{description}</p>
      {stats && (
        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat, i) => (
            <div key={i} className="text-sm">
              <p className="font-medium" style={{ color: '#F8FAFC' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: '#64748B' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Component ────────────────────────────────────── */
export default function ReportsIndex() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: '#F8FAFC' }}>Reports</h1>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>Analytics and insights for your business</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition hover:bg-white/10" style={{ color: '#94A3B8', border: '1px solid #2C3A4D' }}>
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard 
            icon={DollarSign} 
            title="Total Revenue" 
            value="$124,500" 
            change="+12.5%" 
            trend="up" 
          />
          <StatCard 
            icon={ShoppingCart} 
            title="Total Orders" 
            value="1,234" 
            change="+8.2%" 
            trend="up" 
          />
          <StatCard 
            icon={Users} 
            title="Total Customers" 
            value="567" 
            change="+15.3%" 
            trend="up" 
          />
          <StatCard 
            icon={Package} 
            title="Products Sold" 
            value="3,456" 
            change="+5.7%" 
            trend="up" 
          />
        </div>

        {/* Report Categories */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#F8FAFC' }}>Available Reports</h2>
          <div className="grid grid-cols-3 gap-6">
            <ReportCard
              icon={BarChart3}
              title="Sales Report"
              description="Analyze sales performance, revenue trends, and order statistics"
              href="/admin/reports/sales"
              stats={[
                { value: '$124,500', label: 'Revenue' },
                { value: '1,234', label: 'Orders' },
              ]}
            />
            <ReportCard
              icon={Users}
              title="Customer Report"
              description="Track customer growth, spending patterns, and demographics"
              href="/admin/reports/customers"
              stats={[
                { value: '567', label: 'Customers' },
                { value: '+89', label: 'New this month' },
              ]}
            />
            <ReportCard
              icon={Package}
              title="Product Report"
              description="Monitor product performance, inventory status, and reviews"
              href="/admin/reports/products"
              stats={[
                { value: '3,456', label: 'Products' },
                { value: '89', label: 'Low stock' },
              ]}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: '#F8FAFC' }}>Recent Activity</h2>
            <button className="text-sm flex items-center gap-1" style={{ color: '#3B82F6' }}>
              <Calendar className="w-4 h-4" />
              Last 30 days
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#0F172A' }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>Sales Report Generated</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>Today at 2:30 PM</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#10B981/20', color: '#10B981' }}>
                Completed
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#0F172A' }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>Customer Data Exported</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>Yesterday at 4:15 PM</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#3B82F6/20', color: '#3B82F6' }}>
                Exported
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#0F172A' }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>Inventory Alert: Low Stock</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>2 days ago at 10:00 AM</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#F59E0B/20', color: '#F59E0B' }}>
                Alert
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
