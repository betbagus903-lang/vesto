import React from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { 
  ArrowLeft, Download, Package, DollarSign, AlertTriangle, 
  TrendingUp, Warehouse
} from 'lucide-react';

/* ── Stat Card Component ───────────────────────────────── */
function StatCard({ icon: Icon, title, value, subtitle }) {
  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#3B82F6/20' }}>
          <Icon className="w-5 h-5" style={{ color: '#3B82F6' }} />
        </div>
        <p className="text-sm" style={{ color: '#64748B' }}>{title}</p>
      </div>
      <p className="text-2xl font-bold" style={{ color: '#F8FAFC' }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: '#64748B' }}>{subtitle}</p>
    </div>
  );
}

/* ── Table Component ────────────────────────────────────── */
function Table({ columns, data }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: '#0F172A', borderBottom: '1px solid #2C3A4D' }}>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 text-left text-xs font-medium" style={{ color: '#64748B' }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-sm" style={{ color: '#64748B' }}>
                No data available
              </td>
            </tr>
          ) : data.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #2C3A4D' }}>
              {Object.values(row).map((cell, j) => (
                <td key={j} className="px-4 py-3 text-sm" style={{ color: '#94A3B8' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────── */
export default function InventoryReport({ inventoryValue, stockDistribution, needRestock }) {
  const handleExport = () => {
    router.post('/admin/reports/export', {
      type: 'inventory',
      format: 'csv',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.get('/admin/reports')}
              className="p-2 rounded-lg hover:bg-white/10 transition"
              style={{ color: '#94A3B8' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: '#F8FAFC' }}>Inventory Report</h1>
              <p className="text-sm mt-1" style={{ color: '#64748B' }}>Track inventory levels and stock value</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition hover:bg-white/10"
            style={{ color: '#94A3B8', border: '1px solid #2C3A4D' }}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard 
            icon={DollarSign} 
            title="Total Inventory Value" 
            value={`$${inventoryValue.total_value?.toFixed(2) || '0.00'}`}
            subtitle="Current stock value"
          />
          <StatCard 
            icon={Package} 
            title="Total Stock" 
            value={inventoryValue.total_stock || 0}
            subtitle="Items in inventory"
          />
          <StatCard 
            icon={Warehouse} 
            title="Total Products" 
            value={inventoryValue.total_products || 0}
            subtitle="Product SKUs"
          />
          <StatCard 
            icon={AlertTriangle} 
            title="Need Restock" 
            value={needRestock.length || 0}
            subtitle="Low stock items"
          />
        </div>

        {/* Stock Distribution */}
        <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#F8FAFC' }}>Stock Distribution</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#0F172A' }}>
              <p className="text-sm mb-2" style={{ color: '#64748B' }}>In Stock (more than 10)</p>
              <p className="text-2xl font-bold text-emerald-400">{stockDistribution.in_stock || 0}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#0F172A' }}>
              <p className="text-sm mb-2" style={{ color: '#64748B' }}>Low Stock (1-10)</p>
              <p className="text-2xl font-bold text-amber-400">{stockDistribution.low_stock || 0}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#0F172A' }}>
              <p className="text-sm mb-2" style={{ color: '#64748B' }}>Out of Stock (0)</p>
              <p className="text-2xl font-bold text-red-400">{stockDistribution.out_of_stock || 0}</p>
            </div>
          </div>
        </div>

        {/* Products Needing Restock */}
        <div>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#F8FAFC' }}>Products Needing Restock (≤10)</h3>
          <Table
            columns={['Product', 'SKU', 'Current Stock', 'Unit Price']}
            data={needRestock.map(p => ({
              name: p.name,
              sku: p.sku,
              stock: p.stock,
              price: `$${p.price?.toFixed(2) || '0.00'}`,
            }))}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
