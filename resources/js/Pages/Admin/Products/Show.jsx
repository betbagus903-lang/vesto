import React from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import {
  Edit,
  Trash2,
  ArrowLeft,
  Package,
  DollarSign,
  Box,
  Tag,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Video,
  FileText,
  Settings,
  Truck,
} from 'lucide-react';

export default function ShowProduct({ product }) {
  // const handleDelete = () => {
  //   if (confirm('Are you sure you want to delete this product?')) {
  //     router.delete(`/admin/products/${product.id}`);
  //   }
  // };

  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return `/storage/${product.images[0]}`;
    }
    return null;
  };

  const getCategoryName = () => {
    if (product.categories && product.categories.length > 0) {
      return product.categories.map(c => c.name).join(', ');
    }
    return '-';
  };

  return (
    <AdminLayout>
      <div style={{ backgroundColor: '#111827', minHeight: '100vh', padding: '24px' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <a
              href="/admin/products"
              className="p-2 rounded-lg transition"
              style={{ color: '#94A3B8', backgroundColor: 'transparent', border: '1px solid #2C3A4D' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <h1 className="text-2xl font-bold" style={{ color: '#F8FAFC', fontSize: '24px', fontWeight: '700' }}>
              {product.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/admin/products/${product.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"
              style={{ backgroundColor: '#3B82F6', color: '#F8FAFC' }}
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Product Image & Gallery (2 columns) */}
          <div className="col-span-2 space-y-6">
            {/* Product Image Card */}
            <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D', borderRadius: '12px' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#F8FAFC', fontSize: '20px', fontWeight: '700' }}>Product Image</h2>
              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#1A2235', borderRadius: '8px' }}>
                {getProductImage() ? (
                  <img
                    src={getProductImage()}
                    alt={product.name}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center">
                    <ImageIcon className="w-16 h-16" style={{ color: '#64748B' }} />
                  </div>
                )}
              </div>
              
              {/* Gallery of all images */}
              {product.images && product.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {product.images.map((img, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden border border-gray-700"
                      style={{ backgroundColor: '#1A2235' }}
                    >
                      <img
                        src={`/storage/${img}`}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* General Information Card */}
            <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D', borderRadius: '12px' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#F8FAFC', fontSize: '20px', fontWeight: '700' }}>General Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>SKU</label>
                  <div className="px-4 py-2.5 rounded-lg" style={{ backgroundColor: '#1A2235', color: '#F8FAFC', borderRadius: '8px' }}>
                    {product.sku || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>Product Number</label>
                  <div className="px-4 py-2.5 rounded-lg" style={{ backgroundColor: '#1A2235', color: '#F8FAFC', borderRadius: '8px' }}>
                    {product.product_number || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>URL Key</label>
                  <div className="px-4 py-2.5 rounded-lg" style={{ backgroundColor: '#1A2235', color: '#F8FAFC', borderRadius: '8px' }}>
                    {product.url_key || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>Type</label>
                  <div className="px-4 py-2.5 rounded-lg" style={{ backgroundColor: '#1A2235', color: '#F8FAFC', borderRadius: '8px' }}>
                    {product.type || 'Simple'}
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D', borderRadius: '12px' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#F8FAFC', fontSize: '20px', fontWeight: '700' }}>Description</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>Short Description</label>
                  <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: '#1A2235', color: '#F8FAFC', borderRadius: '8px', minHeight: '80px' }}>
                    {product.short_description || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>Full Description</label>
                  <div 
                    className="px-4 py-3 rounded-lg prose prose-invert max-w-none"
                    style={{ backgroundColor: '#1A2235', color: '#F8FAFC', borderRadius: '8px', minHeight: '150px' }}
                    dangerouslySetInnerHTML={{ __html: product.description || '-' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details (1 column) */}
          <div className="space-y-6">
            {/* Price & Stock Card */}
            <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D', borderRadius: '12px' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#F8FAFC', fontSize: '20px', fontWeight: '700' }}>Price & Stock</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#1A2235', borderRadius: '8px' }}>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5" style={{ color: '#10B981' }} />
                    <span className="text-sm" style={{ color: '#94A3B8' }}>Price</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: '#F8FAFC' }}>${product.price || '0.00'}</span>
                </div>
                {product.special_price && (
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#1A2235', borderRadius: '8px' }}>
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5" style={{ color: '#3B82F6' }} />
                      <span className="text-sm" style={{ color: '#94A3B8' }}>Special Price</span>
                    </div>
                    <span className="text-lg font-bold" style={{ color: '#F8FAFC' }}>${product.special_price}</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#1A2235', borderRadius: '8px' }}>
                  <div className="flex items-center gap-3">
                    <Box className="w-5 h-5" style={{ color: '#64748B' }} />
                    <span className="text-sm" style={{ color: '#94A3B8' }}>Stock</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: product.stock > 0 ? '#10B981' : '#EF4444' }}>{product.stock || 0}</span>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D', borderRadius: '12px' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#F8FAFC', fontSize: '20px', fontWeight: '700' }}>Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#1A2235', borderRadius: '8px' }}>
                  <span className="text-sm" style={{ color: '#94A3B8' }}>Active</span>
                  {product.status ? (
                    <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
                  ) : (
                    <XCircle className="w-5 h-5" style={{ color: '#EF4444' }} />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#1A2235', borderRadius: '8px' }}>
                  <span className="text-sm" style={{ color: '#94A3B8' }}>Visible Individually</span>
                  {product.visible_individually ? (
                    <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
                  ) : (
                    <XCircle className="w-5 h-5" style={{ color: '#EF4444' }} />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#1A2235', borderRadius: '8px' }}>
                  <span className="text-sm" style={{ color: '#94A3B8' }}>Featured</span>
                  {product.featured ? (
                    <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
                  ) : (
                    <XCircle className="w-5 h-5" style={{ color: '#EF4444' }} />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#1A2235', borderRadius: '8px' }}>
                  <span className="text-sm" style={{ color: '#94A3B8' }}>New</span>
                  {product.new ? (
                    <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
                  ) : (
                    <XCircle className="w-5 h-5" style={{ color: '#EF4444' }} />
                  )}
                </div>
              </div>
            </div>

            {/* Categories Card */}
            <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D', borderRadius: '12px' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#F8FAFC', fontSize: '20px', fontWeight: '700' }}>Categories</h2>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#1A2235', borderRadius: '8px' }}>
                <span className="text-sm" style={{ color: '#F8FAFC' }}>{getCategoryName()}</span>
              </div>
            </div>

            {/* SEO Card */}
            <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D', borderRadius: '12px' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#F8FAFC', fontSize: '20px', fontWeight: '700' }}>SEO</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>Meta Title</label>
                  <div className="px-4 py-2.5 rounded-lg" style={{ backgroundColor: '#1A2235', color: '#F8FAFC', borderRadius: '8px' }}>
                    {product.meta_title || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>Meta Keywords</label>
                  <div className="px-4 py-2.5 rounded-lg" style={{ backgroundColor: '#1A2235', color: '#F8FAFC', borderRadius: '8px' }}>
                    {product.meta_keywords || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>Meta Description</label>
                  <div className="px-4 py-2.5 rounded-lg" style={{ backgroundColor: '#1A2235', color: '#F8FAFC', borderRadius: '8px' }}>
                    {product.meta_description || '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Card */}
            <div className="rounded-xl p-6" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D', borderRadius: '12px' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#F8FAFC', fontSize: '20px', fontWeight: '700' }}>Shipping</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#1A2235', borderRadius: '8px' }}>
                  <span className="text-sm" style={{ color: '#94A3B8' }}>Weight</span>
                  <span className="text-sm font-medium" style={{ color: '#F8FAFC' }}>{product.weight || '-'} kg</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#1A2235', borderRadius: '8px' }}>
                  <span className="text-sm" style={{ color: '#94A3B8' }}>Dimensions</span>
                  <span className="text-sm font-medium" style={{ color: '#F8FAFC' }}>
                    {product.width || '-'} x {product.height || '-'} x {product.length || '-'} cm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
