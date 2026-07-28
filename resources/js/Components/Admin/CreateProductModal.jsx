import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { X, Package, Save } from 'lucide-react';

export default function CreateProductModal({ attributeFamilies, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    attribute_family_id: '',
    type: 'simple',
    sku: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
        onSuccess(product);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-lg w-full max-w-md" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #2C3A4D' }}>
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5" style={{ color: '#F8FAFC' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#F8FAFC' }}>Create Product</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg transition"
            style={{ color: '#94A3B8' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X className="w-5 h-5" />
          </button>
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
                borderColor: errors.name ? '#EF4444' : '#2C3A4D',
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
                borderColor: errors.type ? '#EF4444' : '#2C3A4D',
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
                borderColor: errors.attribute_family_id ? '#EF4444' : '#2C3A4D',
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
                borderColor: errors.sku ? '#EF4444' : '#2C3A4D',
                color: '#F8FAFC',
                borderWidth: '1px',
              }}
            />
            {errors.sku && <p className="text-xs text-red-400 mt-1">{errors.sku}</p>}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4" style={{ borderTop: '1px solid #2C3A4D' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm transition"
              style={{ border: '1px solid #2C3A4D', color: '#94A3B8' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#3B82F6' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
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
  );
}
