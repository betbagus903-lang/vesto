import React from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { Star } from 'lucide-react';

export default function CustomerReviews() {
  return (
    <AdminLayout>
      <div style={{ backgroundColor: '#111827', minHeight: '100vh', padding: '24px 28px' }}>
        <nav style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px', display: 'flex', gap: '6px' }}>
          <a href="/admin/dashboard" style={{ color: '#64748B', textDecoration: 'none' }}>Dashboard</a>
          <span>/</span>
          <a href="/admin/customers" style={{ color: '#64748B', textDecoration: 'none' }}>Customers</a>
          <span>/</span>
          <span style={{ color: '#94A3B8' }}>Reviews</span>
        </nav>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#F1F5F9', margin: '0 0 32px' }}>Reviews</h1>

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '80px 24px', backgroundColor: '#1E293B', border: '1px solid #334155',
          borderRadius: '12px', textAlign: 'center',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', backgroundColor: '#0F172A',
            border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Star size={28} style={{ color: '#3B82F6' }} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#F1F5F9', margin: '0 0 8px' }}>
            Customer Reviews
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', maxWidth: 360, lineHeight: 1.6 }}>
            Halaman ini sedang dalam pengembangan. Fitur manajemen ulasan pelanggan akan segera tersedia.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
