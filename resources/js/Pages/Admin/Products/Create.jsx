import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import ConfigurableAttributesModal from '../../../Components/Admin/ProductForms/ConfigurableAttributesModal';
import { X, Package, Save } from 'lucide-react';

export default function CreateProduct({ attributeFamilies, createdProduct: initialCreatedProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    attribute_family_id: '',
    type: 'simple',
    sku: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [createdProduct, setCreatedProduct] = useState(initialCreatedProduct || null);
  const [showConfigurableModal, setShowConfigurableModal] = useState(false);

  // Show modal if product was just created and is configurable
  useEffect(() => {
    if (createdProduct && createdProduct.type === 'configurable') {
      setShowConfigurableModal(true);
    }
  }, [createdProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    router.post('/admin/products', formData, {
      onFinish: () => {
        setLoading(false);
      },
      onSuccess: (page) => {
        const product = page.props.createdProduct;
        setCreatedProduct(product);
        
        // If configurable, show attributes modal (handled by useEffect)
        if (formData.type !== 'configurable') {
          // For other types, redirect to edit
          router.visit(`/admin/products/${product.id}/edit`);
        }
      },
      onError: (errors) => {
        setErrors(errors);
        setLoading(false);
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#111827' }}>
        <div className="w-full max-w-md rounded-xl shadow-2xl" style={{ backgroundColor: '#101827', borderColor: '#1E293B', borderWidth: '1px', borderRadius: '12px' }}>
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#1E293B' }}>
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5" style={{ color: '#3B82F6' }} />
              <h2 className="text-lg font-bold" style={{ color: '#F8FAFC', fontSize: '18px', fontWeight: '600' }}>Create Product</h2>
            </div>
            <a
              href="/admin/products"
              className="p-1 rounded-lg transition hover:bg-white/10"
              style={{ color: '#94A3B8' }}
            >
              <X className="w-5 h-5" />
            </a>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: '#0C1524',
                  borderColor: errors.name ? '#EF4444' : '#1E293B',
                  color: '#F8FAFC',
                  borderWidth: '1px',
                }}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            {/* Product Type */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>
                Product Type <span className="text-red-400">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: '#0C1524',
                  borderColor: errors.type ? '#EF4444' : '#1E293B',
                  color: '#F8FAFC',
                  borderWidth: '1px',
                }}
              >
                <option value="simple">Simple</option>
                <option value="configurable">Configurable</option>
                <option value="grouped">Grouped</option>
                <option value="bundle">Bundle</option>
                <option value="virtual">Virtual</option>
                <option value="downloadable">Downloadable</option>
              </select>
              {errors.type && <p className="text-xs text-red-400 mt-1">{errors.type}</p>}
            </div>

            {/* Attribute Family */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>
                Attribute Family <span className="text-red-400">*</span>
              </label>
              <select
                name="attribute_family_id"
                value={formData.attribute_family_id}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: '#0C1524',
                  borderColor: errors.attribute_family_id ? '#EF4444' : '#1E293B',
                  color: '#F8FAFC',
                  borderWidth: '1px',
                }}
              >
                <option value="">Select Attribute Family</option>
                {attributeFamilies.map((family) => (
                  <option key={family.id} value={family.id}>{family.name}</option>
                ))}
              </select>
              {errors.attribute_family_id && <p className="text-xs text-red-400 mt-1">{errors.attribute_family_id}</p>}
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>
                SKU <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Enter SKU"
                className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: '#0C1524',
                  borderColor: errors.sku ? '#EF4444' : '#1E293B',
                  color: '#F8FAFC',
                  borderWidth: '1px',
                }}
              />
              {errors.sku && <p className="text-xs text-red-400 mt-1">{errors.sku}</p>}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: '#1E293B' }}>
              <a
                href="/admin/products"
                className="px-4 py-2 rounded-lg text-sm transition border"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: '#1E293B',
                  color: '#94A3B8',
                }}
              >
                Cancel
              </a>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#3B82F6', color: '#F8FAFC' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Product</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Configurable Attributes Modal */}
      {showConfigurableModal && createdProduct && (
        <ConfigurableAttributesModal
          product={createdProduct}
          attributeFamily={createdProduct.attributeFamily || null}
          onClose={() => {
            setShowConfigurableModal(false);
            router.visit(`/admin/products/${createdProduct.id}/edit`);
          }}
        />
      )}
    </AdminLayout>
  );
}
