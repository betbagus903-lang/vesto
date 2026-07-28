import React, { useState, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import { X } from 'lucide-react';

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

function TextArea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition ${className}`}
      style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
      {...props}
    />
  );
}

export default function SubCategoryModal({ 
  open, 
  onClose, 
  subCategory = null, 
  categories = [],
  onSuccess 
}) {
  const isEdit = !!subCategory;
  
  const { data, setData, post, put, processing, errors, reset } = useForm({
    category_id: subCategory?.category_id || '',
    name: subCategory?.name || '',
    slug: subCategory?.slug || '',
    description: subCategory?.description || '',
    status: subCategory?.status ?? true,
  });

  // Reset form when modal opens/closes or subCategory changes
  useEffect(() => {
    if (open) {
      reset({
        category_id: subCategory?.category_id || '',
        name: subCategory?.name || '',
        slug: subCategory?.slug || '',
        description: subCategory?.description || '',
        status: subCategory?.status ?? true,
      });
    }
  }, [open, subCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEdit) {
      put(`/admin/sub-categories/${subCategory.id}`, {
        onSuccess: () => {
          // Show toast notification
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: 'Sub Category berhasil diperbarui.', type: 'success' }
          }));
          onSuccess();
          onClose();
        },
        onError: (errors) => {
          // Show error toast if there are validation errors
          if (errors && Object.keys(errors).length > 0) {
            window.dispatchEvent(new CustomEvent('show-toast', {
              detail: { message: 'Terdapat kesalahan validasi. Silakan periksa form.', type: 'error' }
            }));
          }
        },
      });
    } else {
      post('/admin/sub-categories', {
        onSuccess: () => {
          // Show toast notification
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: 'Sub Category berhasil dibuat.', type: 'success' }
          }));
          onSuccess();
          onClose();
        },
        onError: (errors) => {
          // Show error toast if there are validation errors
          if (errors && Object.keys(errors).length > 0) {
            window.dispatchEvent(new CustomEvent('show-toast', {
              detail: { message: 'Terdapat kesalahan validasi. Silakan periksa form.', type: 'error' }
            }));
          }
        },
      });
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (value) => {
    setData('name', value);
    if (!isEdit || !subCategory.slug) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setData('slug', slug);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #2C3A4D' }}>
          <h2 className="text-base font-semibold" style={{ color: '#F8FAFC' }}>
            {isEdit ? 'Edit Sub Category' : 'Create Sub Category'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition" style={{ color: '#94A3B8' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <Field label="Category" required error={errors.category_id}>
              <Select 
                value={data.category_id} 
                onChange={e => setData('category_id', e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </Field>

            <Field label="Name" required error={errors.name}>
              <Input 
                value={data.name} 
                onChange={e => handleNameChange(e.target.value)} 
                placeholder="e.g. T-Shirt" 
              />
            </Field>

            <Field label="Slug" error={errors.slug}>
              <Input 
                value={data.slug} 
                onChange={e => setData('slug', e.target.value)} 
                placeholder="auto-generated from name" 
              />
            </Field>

            <Field label="Description" error={errors.description}>
              <TextArea 
                value={data.description} 
                onChange={e => setData('description', e.target.value)} 
                rows={3}
                placeholder="Optional description" 
              />
            </Field>

            <Field label="Status">
              <Select 
                value={data.status ? '1' : '0'} 
                onChange={e => setData('status', e.target.value === '1')}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </Select>
            </Field>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid #2C3A4D' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-white/10"
              style={{ color: '#94A3B8', border: '1px solid #2C3A4D' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition disabled:opacity-60"
              style={{ backgroundColor: '#3B82F6' }}
            >
              {processing ? 'Saving...' : (isEdit ? 'Update Sub Category' : 'Create Sub Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}