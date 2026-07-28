import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { useFormSubmit } from '../../../hooks/useFormSubmit';
import { Save, X, Plus, Trash2, ChevronDown, ChevronRight, Search, Upload } from 'lucide-react';

export default function EditProductFixed({
  product,
  categories,
  attributeFamilies,
  taxCategories,
  allProducts,
  familyGroups = [],
  existingValues = {},
}) {
  const form = useFormSubmit({
    onSuccessMessage: 'Product berhasil diperbarui.',
    onErrorMessage: 'Terdapat kesalahan validasi.',
    redirectTo: '/admin/products',
  });

  const [formData, setFormData] = useState({
    name: product.name || '',
    sku: product.sku || '',
    product_number: product.product_number || '',
    url_key: product.url_key || '',
    tax_category_id: product.tax_category_id || '',
    short_description: product.short_description || '',
    description: product.description || '',
    price: product.price || '',
    special_price: product.special_price || '',
    special_price_from: product.special_price_from || '',
    special_price_to: product.special_price_to || '',
    cost_price: product.cost_price || '',
    stock: product.stock ?? 0,
    weight: product.weight || '',
    width: product.width || '',
    height: product.height || '',
    length: product.length || '',
    meta_title: product.meta_title || '',
    meta_keywords: product.meta_keywords || '',
    meta_description: product.meta_description || '',
    new: !!product.new,
    featured: !!product.featured,
    visible_individually: product.visible_individually !== undefined ? product.visible_individually : true,
    status: product.status !== undefined ? product.status : true,
    guest_checkout: product.guest_checkout !== undefined ? product.guest_checkout : true,
    allow_rma: !!product.allow_rma,
    rma_rules: product.rma_rules || '',
    category_ids: product.categories?.map(c => c.id) || [],
    images: Array.isArray(product.images) ? product.images : [],
    videos: product.videos || [],
    related_product_ids: product.relatedProducts?.map(p => p.id) || [],
    up_sell_product_ids: product.upSellProducts?.map(p => p.id) || [],
    cross_sell_product_ids: product.crossSellProducts?.map(p => p.id) || [],
    group_product_ids: product.groupProducts?.map(p => p.id) || [],
    sub_category_id: product.sub_category_id || '',
  });

  const [attrValues, setAttrValues] = useState(() => {
    const init = {};
    Object.entries(existingValues || {}).forEach(([k, v]) => { init[k] = v; });
    return init;
  });

  const [newImages, setNewImages] = useState([]);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('_method', 'PUT');
    
    // Add all form data
    Object.keys(formData).forEach(key => {
      if (key === 'images' || key === 'videos' || key.includes('_ids')) {
        // Handle arrays separately
        return;
      }
      data.append(key, formData[key]);
    });

    // Handle arrays
    formData.images.forEach(img => data.append('images[]', img));
    formData.videos.forEach(video => data.append('videos[]', video));
    formData.category_ids.forEach(id => data.append('category_ids[]', id));
    formData.related_product_ids.forEach(id => data.append('related_product_ids[]', id));
    formData.up_sell_product_ids.forEach(id => data.append('up_sell_product_ids[]', id));
    formData.cross_sell_product_ids.forEach(id => data.append('cross_sell_product_ids[]', id));
    formData.group_product_ids.forEach(id => data.append('group_product_ids[]', id));
    
    // Add new images
    newImages.forEach(file => data.append('new_images[]', file));
    
    // Add attribute values
    Object.entries(attrValues).forEach(([attrId, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => data.append(`attribute_values[${attrId}][]`, v));
        } else {
          data.append(`attribute_values[${attrId}]`, value);
        }
      }
    });

    form.post(`/admin/products/${product.id}`, data, {
      forceFormData: true,
      onError: (errors) => {
        setErrors(errors);
      },
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const removeImage = (index, isNew = false) => {
    if (isNew) {
      setNewImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const setField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error for this field
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const toggleCategory = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId]
    }));
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Edit Product</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.get('/admin/products')}
              className="px-4 py-2 text-sm border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={form.processing}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {form.processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">General Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">SKU *</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setField('sku', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white ${errors.sku ? 'border-red-500' : 'border-gray-700'}`}
                />
                {errors.sku && <p className="text-sm text-red-400 mt-1">{errors.sku}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setField('name', e.target.value);
                    // Auto-generate URL key
                    if (!formData.url_key) {
                      const urlKey = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '');
                      setField('url_key', urlKey);
                    }
                  }}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white ${errors.name ? 'border-red-500' : 'border-gray-700'}`}
                />
                {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">URL Key</label>
                <input
                  type="text"
                  value={formData.url_key}
                  onChange={(e) => setField('url_key', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white ${errors.url_key ? 'border-red-500' : 'border-gray-700'}`}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Product Number</label>
                <input
                  type="text"
                  value={formData.product_number}
                  onChange={(e) => setField('product_number', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Pricing</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setField('price', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white ${errors.price ? 'border-red-500' : 'border-gray-700'}`}
                />
                {errors.price && <p className="text-sm text-red-400 mt-1">{errors.price}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Stock *</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setField('stock', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white ${errors.stock ? 'border-red-500' : 'border-gray-700'}`}
                />
                {errors.stock && <p className="text-sm text-red-400 mt-1">{errors.stock}</p>}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
              {categories.map(category => (
                <div key={category.id} className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id={`cat-${category.id}`}
                    checked={formData.category_ids.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`cat-${category.id}`} className="text-sm text-white">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Images</h2>
            
            <div className="flex flex-wrap gap-4">
              {/* Existing Images */}
              {formData.images.map((image, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-700">
                    <img
                      src={`/storage/${image}`}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index, false)}
                    className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              
              {/* New Images */}
              {newImages.map((file, index) => (
                <div key={`new-${index}`} className="relative group">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-700">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index, true)}
                    className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              
              {/* Upload Button */}
              <label className="cursor-pointer">
                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center hover:border-gray-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-500 mb-2" />
                  <span className="text-sm text-gray-400">Add Image</span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
            
            <div className="space-y-4">
              {[
                ['new', 'New'],
                ['featured', 'Featured'],
                ['status', 'Status'],
                ['visible_individually', 'Visible Individually'],
                ['guest_checkout', 'Guest Checkout'],
                ['allow_rma', 'Allow RMA'],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-white">{label}</span>
                  <button
                    type="button"
                    onClick={() => setField(key, !formData[key])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData[key] ? 'bg-blue-600' : 'bg-gray-700'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${formData[key] ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
              <h3 className="text-red-400 font-semibold mb-2">Please fix the following errors:</h3>
              <ul className="text-sm text-red-300 space-y-1">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>• {message}</li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}