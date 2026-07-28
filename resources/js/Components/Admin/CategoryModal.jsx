import React, { useState, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Search,
  Check,
  Settings,
  Eye,
  Globe,
} from 'lucide-react';

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

export default function CategoryModal({ 
  open, 
  onClose, 
  category = null, 
  allCategories = [], 
  allAttributes = [],
  onSuccess 
}) {
  const isEdit = !!category;
  
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: category?.name || '',
    parent_id: category?.parent_id || '',
    description: category?.description || '',
    position: category?.position || 0,
    display_mode: category?.display_mode || 'grid',
    visible_in_menu: category?.visible_in_menu ?? true,
    meta_title: category?.meta_title || '',
    slug: category?.slug || '',
    meta_keywords: category?.meta_keywords || '',
    meta_description: category?.meta_description || '',
    filterable_attributes: category?.filterable_attributes || [],
  });

  const [logoImage, setLogoImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [logoPreview, setLogoPreview] = useState(category?.logo_path ? `/storage/${category.logo_path}` : null);
  const [bannerPreview, setBannerPreview] = useState(category?.banner_path ? `/storage/${category.banner_path}` : null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [removeBanner, setRemoveBanner] = useState(false);
  const [isDragOverLogo, setIsDragOverLogo] = useState(false);
  const [isDragOverBanner, setIsDragOverBanner] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [showAttributes, setShowAttributes] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState(category?.filterable_attributes || []);

  // Reset form when modal opens/closes or category changes
  useEffect(() => {
    if (open) {
      reset({
        name: category?.name || '',
        parent_id: category?.parent_id || '',
        description: category?.description || '',
        position: category?.position || 0,
        display_mode: category?.display_mode || 'grid',
        visible_in_menu: category?.visible_in_menu ?? true,
        meta_title: category?.meta_title || '',
        slug: category?.slug || '',
        meta_keywords: category?.meta_keywords || '',
        meta_description: category?.meta_description || '',
        filterable_attributes: category?.filterable_attributes || [],
      });
      setLogoPreview(category?.logo_path ? `/storage/${category.logo_path}` : null);
      setBannerPreview(category?.banner_path ? `/storage/${category.banner_path}` : null);
      setSelectedAttributes(category?.filterable_attributes || []);
      setLogoImage(null);
      setBannerImage(null);
      setRemoveLogo(false);
      setRemoveBanner(false);
    }
  }, [open, category]);

  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const renderTreeNode = (node, level = 0) => {
    if (isEdit && node.id === category.id) return null; // Don't show self as parent
    
    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 py-2.5 px-3 rounded-lg hover:bg-[#17243B] cursor-pointer transition ${
            data.parent_id === node.id ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'text-[#94A3B8]'
          }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => setData('parent_id', node.id)}
        >
          {node.children && node.children.length > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="p-1 hover:bg-[#1E293B] rounded-md transition"
            >
              {expandedNodes[node.id] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}
          {node.children && node.children.length > 0 ? (
            <FolderOpen className="w-4 h-4 text-blue-400" />
          ) : (
            <Folder className="w-4 h-4 text-blue-400" />
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        {expandedNodes[node.id] && node.children && node.children.length > 0 && (
          <div>
            {node.children.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const toggleAttribute = (attrId) => {
    const newAttributes = selectedAttributes.includes(attrId)
      ? selectedAttributes.filter(id => id !== attrId)
      : [...selectedAttributes, attrId];
    setSelectedAttributes(newAttributes);
    setData('filterable_attributes', newAttributes);
  };

  // Image upload handlers
  const handleLogoUpload = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      return;
    }

    if (file.size > maxSize) {
      return;
    }

    setLogoImage(file);
    setLogoPreview(URL.createObjectURL(file));
    setRemoveLogo(false);
  };

  const handleBannerUpload = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return;
    }

    if (file.size > maxSize) {
      return;
    }

    setBannerImage(file);
    setBannerPreview(URL.createObjectURL(file));
    setRemoveBanner(false);
  };

  const handleLogoClick = () => {
    document.getElementById('logo-input').click();
  };

  const handleBannerClick = () => {
    document.getElementById('banner-input').click();
  };

  const handleLogoDragOver = (e) => {
    e.preventDefault();
    setIsDragOverLogo(true);
  };

  const handleLogoDragLeave = () => {
    setIsDragOverLogo(false);
  };

  const handleLogoDrop = (e) => {
    e.preventDefault();
    setIsDragOverLogo(false);
    const file = e.dataTransfer.files[0];
    if (file) handleLogoUpload(file);
  };

  const handleBannerDragOver = (e) => {
    e.preventDefault();
    setIsDragOverBanner(true);
  };

  const handleBannerDragLeave = () => {
    setIsDragOverBanner(false);
  };

  const handleBannerDrop = (e) => {
    e.preventDefault();
    setIsDragOverBanner(false);
    const file = e.dataTransfer.files[0];
    if (file) handleBannerUpload(file);
  };

  const removeLogoImage = () => {
    setLogoImage(null);
    setLogoPreview(null);
    setRemoveLogo(true);
    document.getElementById('logo-input').value = '';
  };

  const removeBannerImage = () => {
    setBannerImage(null);
    setBannerPreview(null);
    setRemoveBanner(true);
    document.getElementById('banner-input').value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Add all form data
    Object.keys(data).forEach(key => {
      if (key === 'filterable_attributes') {
        data[key].forEach(attrId => {
          formData.append('filterable_attributes[]', attrId);
        });
      } else if (key === 'visible_in_menu') {
        formData.append(key, data[key] ? '1' : '0');
      } else {
        formData.append(key, data[key]);
      }
    });

    // Add images
    if (logoImage) {
      formData.append('logo_path', logoImage);
    }
    if (bannerImage) {
      formData.append('banner_path', bannerImage);
    }
    if (removeLogo) {
      formData.append('remove_logo', '1');
    }
    if (removeBanner) {
      formData.append('remove_banner', '1');
    }

    if (isEdit) {
      formData.append('_method', 'PUT');
      post(`/admin/categories/${category.id}`, {
        data: formData,
        forceFormData: true,
        onSuccess: () => {
          // Show toast notification
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: 'Category berhasil diperbarui.', type: 'success' }
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
      post('/admin/categories', {
        data: formData,
        forceFormData: true,
        onSuccess: () => {
          // Show toast notification
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: 'Category berhasil dibuat.', type: 'success' }
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #2C3A4D' }}>
          <h2 className="text-base font-semibold" style={{ color: '#F8FAFC' }}>
            {isEdit ? 'Edit Category' : 'Create Category'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition" style={{ color: '#94A3B8' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* General Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium" style={{ color: '#F8FAFC' }}>General Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category Name" required error={errors.name}>
                  <Input 
                    value={data.name} 
                    onChange={e => setData('name', e.target.value)} 
                    placeholder="Enter category name" 
                  />
                </Field>
                <Field label="Slug" required error={errors.slug}>
                  <Input 
                    value={data.slug} 
                    onChange={e => setData('slug', e.target.value)} 
                    placeholder="category-slug" 
                  />
                </Field>
              </div>

              <Field label="Parent Category">
                <div className="bg-[#0C1524] border border-[#1E293B] rounded-lg p-3 max-h-40 overflow-y-auto">
                  {allCategories.length > 0 ? (
                    allCategories.map((node) => renderTreeNode(node))
                  ) : (
                    <p className="text-sm text-[#94A3B8] py-4 text-center">No categories available</p>
                  )}
                </div>
              </Field>

              <Field label="Description" error={errors.description}>
                <TextArea 
                  value={data.description} 
                  onChange={e => setData('description', e.target.value)} 
                  rows={3}
                  placeholder="Enter category description..." 
                />
              </Field>
            </div>

            {/* Media Upload */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium" style={{ color: '#F8FAFC' }}>Media Upload</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Logo */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>
                    Category Logo
                  </label>
                  <input
                    id="logo-input"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleLogoUpload(file);
                    }}
                    className="hidden"
                  />
                  {logoPreview ? (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeLogoImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={handleLogoClick}
                      onDragOver={handleLogoDragOver}
                      onDragLeave={handleLogoDragLeave}
                      onDrop={handleLogoDrop}
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer ${
                        isDragOverLogo
                          ? 'border-[#3B82F6] bg-[#0C1524]'
                          : 'border-[#1E293B] hover:border-[#3B82F6]/50 hover:bg-[#0C1524]'
                      }`}
                    >
                      <Upload className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                      <p className="text-xs text-[#94A3B8]">Drag & drop or click to upload</p>
                      <p className="text-xs text-[#94A3B8] mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  )}
                </div>

                {/* Banner */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>
                    Banner Image
                  </label>
                  <input
                    id="banner-input"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleBannerUpload(file);
                    }}
                    className="hidden"
                  />
                  {bannerPreview ? (
                    <div className="relative">
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeBannerImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={handleBannerClick}
                      onDragOver={handleBannerDragOver}
                      onDragLeave={handleBannerDragLeave}
                      onDrop={handleBannerDrop}
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer ${
                        isDragOverBanner
                          ? 'border-[#3B82F6] bg-[#0C1524]'
                          : 'border-[#1E293B] hover:border-[#3B82F6]/50 hover:bg-[#0C1524]'
                      }`}
                    >
                      <ImageIcon className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                      <p className="text-xs text-[#94A3B8]">Drag & drop or click to upload</p>
                      <p className="text-xs text-[#94A3B8] mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium" style={{ color: '#F8FAFC' }}>Settings</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Field label="Position" error={errors.position}>
                  <Input 
                    type="number" 
                    value={data.position} 
                    onChange={e => setData('position', e.target.value)} 
                  />
                </Field>
                <Field label="Display Mode">
                  <Select 
                    value={data.display_mode} 
                    onChange={e => setData('display_mode', e.target.value)}
                  >
                    <option value="grid">Grid</option>
                    <option value="list">List</option>
                  </Select>
                </Field>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-medium" style={{ color: '#94A3B8' }}>
                    Visible in Menu
                  </label>
                  <p className="text-xs text-[#94A3B8] mt-1">Show in navigation menu</p>
                </div>
                <button
                  type="button"
                  onClick={() => setData('visible_in_menu', !data.visible_in_menu)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  style={{ backgroundColor: data.visible_in_menu ? '#3B82F6' : '#1E293B' }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      data.visible_in_menu ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium" style={{ color: '#F8FAFC' }}>SEO Settings</h3>
              
              <Field label="Meta Title">
                <Input 
                  value={data.meta_title} 
                  onChange={e => setData('meta_title', e.target.value)} 
                  placeholder="Enter meta title" 
                />
              </Field>
              
              <Field label="Meta Keywords">
                <Input 
                  value={data.meta_keywords} 
                  onChange={e => setData('meta_keywords', e.target.value)} 
                  placeholder="keyword1, keyword2, keyword3" 
                />
              </Field>
              
              <Field label="Meta Description">
                <TextArea 
                  value={data.meta_description} 
                  onChange={e => setData('meta_description', e.target.value)} 
                  rows={2}
                  placeholder="Enter meta description" 
                />
              </Field>
            </div>

            {/* Filterable Attributes */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setShowAttributes(!showAttributes)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-sm font-medium" style={{ color: '#F8FAFC' }}>Filterable Attributes</h3>
                {showAttributes ? (
                  <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                )}
              </button>

              {showAttributes && (
                <div className="bg-[#0C1524] border border-[#1E293B] rounded-lg p-3 max-h-40 overflow-y-auto">
                  {allAttributes.length > 0 ? (
                    allAttributes.map((attr) => (
                      <label
                        key={attr.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#17243B] cursor-pointer transition"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={selectedAttributes.includes(attr.id)}
                            onChange={() => toggleAttribute(attr.id)}
                            className="w-4 h-4 rounded border-[#1E293B] bg-[#0C1524] text-[#3B82F6] focus:ring-[#3B82F6] focus:ring-offset-0"
                          />
                          {selectedAttributes.includes(attr.id) && (
                            <Check className="absolute inset-0 w-4 h-4 text-[#3B82F6] pointer-events-none" />
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="text-sm text-[#F8FAFC]">{attr.name}</span>
                          <span className="text-xs text-[#94A3B8] ml-2">({attr.type})</span>
                        </div>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-[#94A3B8] py-4 text-center">No attributes available</p>
                  )}
                </div>
              )}
            </div>
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
              {processing ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}