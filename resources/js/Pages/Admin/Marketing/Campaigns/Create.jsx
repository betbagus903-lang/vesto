import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { useTheme } from '../../../../Context/ThemeContext';
import {
  Save,
  X,
  Image as ImageIcon,
  Calendar,
  Target,
  LayoutGrid,
  Tag,
  Link as LinkIcon,
  ArrowUp,
  ArrowDown,
  Upload,
  Trash2,
  Plus,
  ChevronDown,
} from 'lucide-react';

export default function CampaignCreate({ categories, collections, products }) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    banner: null,
    campaign_type: 'homepage',
    start_date: '',
    end_date: '',
    status: 'draft',
    target_category: '',
    target_collection: '',
    target_products: [],
    button_text: '',
    button_url: '',
    priority: 1,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'target_products') {
        data.append(key, JSON.stringify(formData[key]));
      } else if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    router.post('/admin/marketing/campaigns', data, {
      onFinish: () => setLoading(false),
      onSuccess: () => {
        router.visit('/admin/marketing/campaigns');
      },
      onError: (errs) => {
        setErrors(errs);
        setLoading(false);
      },
    });
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, banner: file }));
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleProductToggle = (productId) => {
    setFormData(prev => ({
      ...prev,
      target_products: prev.target_products.includes(productId)
        ? prev.target_products.filter(id => id !== productId)
        : [...prev.target_products, productId],
    }));
  };

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
            <a href="/admin/marketing/campaigns" className={`transition-all duration-200 ${
              theme === 'dark' ? 'hover:text-[#F8FAFC]' : 'hover:text-gray-900'
            }`}>Campaigns</a>
            <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}>/</span>
            <span className={`font-medium ${
              theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
            }`}>Create Campaign</span>
          </nav>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
          }`}>Create Campaign</h1>
          <p className={`text-sm mt-2 ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
          }`}>Create a new promotional campaign for your store.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className={`rounded-2xl shadow-sm p-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>Basic Information</h2>
              
              <div className="space-y-5">
                {/* Campaign Name */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Campaign Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter campaign name"
                    className={`w-full px-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                      theme === 'dark'
                        ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                    }`}
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter campaign description"
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 resize-none ${
                      theme === 'dark'
                        ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                    }`}
                  />
                  {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
                </div>
              </div>
            </div>

            {/* Banner */}
            <div className={`rounded-2xl shadow-sm p-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>Campaign Banner</h2>
              
              <div className="space-y-4">
                {bannerPreview ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setBannerPreview(null);
                        setFormData(prev => ({ ...prev, banner: null }));
                      }}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center ${
                    theme === 'dark'
                      ? 'border-gray-700 hover:border-[#4F6BFF]'
                      : 'border-gray-200 hover:border-[#4F6BFF]'
                  } transition-colors`}>
                    <input
                      type="file"
                      id="banner"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="banner"
                      className="cursor-pointer"
                    >
                      <ImageIcon className={`w-12 h-12 mx-auto mb-3 ${
                        theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
                      }`} />
                      <p className={`text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                      }`}>Upload banner image</p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
                      }`}>PNG, JPG up to 5MB</p>
                    </label>
                  </div>
                )}
                {errors.banner && <p className="text-xs text-red-400 mt-1">{errors.banner}</p>}
              </div>
            </div>

            {/* Campaign Settings */}
            <div className={`rounded-2xl shadow-sm p-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>Campaign Settings</h2>
              
              <div className="space-y-5">
                {/* Campaign Type */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Campaign Type <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'homepage', label: 'Homepage', icon: LayoutGrid },
                      { value: 'collection', label: 'Collection', icon: Tag },
                      { value: 'category', label: 'Category', icon: Target },
                      { value: 'product', label: 'Product', icon: LinkIcon },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, campaign_type: type.value }))}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                          formData.campaign_type === type.value
                            ? theme === 'dark'
                              ? 'border-[#4F6BFF] bg-[#4F6BFF]/10 text-[#4F6BFF]'
                              : 'border-[#4F6BFF] bg-blue-50 text-[#4F6BFF]'
                            : theme === 'dark'
                              ? 'border-gray-700 text-[#94A3B8] hover:border-[#4F6BFF] hover:text-[#F8FAFC]'
                              : 'border-gray-200 text-gray-600 hover:border-[#4F6BFF] hover:text-gray-900'
                        }`}
                      >
                        <type.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.campaign_type && <p className="text-xs text-red-400 mt-1">{errors.campaign_type}</p>}
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${
                      theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                    }`}>
                      Start Date <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                          theme === 'dark'
                            ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                        }`}
                      />
                    </div>
                    {errors.start_date && <p className="text-xs text-red-400 mt-1">{errors.start_date}</p>}
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${
                      theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                    }`}>
                      End Date <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                          theme === 'dark'
                            ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                        }`}
                      />
                    </div>
                    {errors.end_date && <p className="text-xs text-red-400 mt-1">{errors.end_date}</p>}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                      theme === 'dark'
                        ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                  </select>
                  {errors.status && <p className="text-xs text-red-400 mt-1">{errors.status}</p>}
                </div>

                {/* Priority */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Priority
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className={`text-sm font-semibold w-8 text-center ${
                      theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                    }`}>{formData.priority}</span>
                  </div>
                  {errors.priority && <p className="text-xs text-red-400 mt-1">{errors.priority}</p>}
                </div>
              </div>
            </div>

            {/* Target Configuration */}
            {(formData.campaign_type === 'category' || formData.campaign_type === 'collection' || formData.campaign_type === 'product') && (
              <div className={`rounded-2xl shadow-sm p-6 ${
                theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
              }`}>
                <h2 className={`text-lg font-semibold mb-6 ${
                  theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                }`}>Target Configuration</h2>
                
                <div className="space-y-5">
                  {formData.campaign_type === 'category' && (
                    <div>
                      <label className={`block text-xs font-medium mb-2 ${
                        theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                      }`}>
                        Target Category
                      </label>
                      <select
                        value={formData.target_category}
                        onChange={(e) => setFormData(prev => ({ ...prev, target_category: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                          theme === 'dark'
                            ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                        }`}
                      >
                        <option value="">Select category</option>
                        {categories?.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formData.campaign_type === 'collection' && (
                    <div>
                      <label className={`block text-xs font-medium mb-2 ${
                        theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                      }`}>
                        Target Collection
                      </label>
                      <select
                        value={formData.target_collection}
                        onChange={(e) => setFormData(prev => ({ ...prev, target_collection: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                          theme === 'dark'
                            ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                        }`}
                      >
                        <option value="">Select collection</option>
                        {collections?.map(col => (
                          <option key={col.id} value={col.id}>{col.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formData.campaign_type === 'product' && (
                    <div>
                      <label className={`block text-xs font-medium mb-2 ${
                        theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                      }`}>
                        Target Products
                      </label>
                      <div className={`max-h-64 overflow-y-auto rounded-xl border p-4 space-y-2 ${
                        theme === 'dark' ? 'border-gray-700 bg-[#0C1524]' : 'border-gray-200 bg-gray-50'
                      }`}>
                        {products?.map(product => (
                          <label key={product.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#17243B] cursor-pointer transition">
                            <input
                              type="checkbox"
                              checked={formData.target_products.includes(product.id)}
                              onChange={() => handleProductToggle(product.id)}
                              className="w-4 h-4 rounded border-gray-300 text-[#4F6BFF] focus:ring-[#4F6BFF]"
                            />
                            <span className={`text-sm ${
                              theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                            }`}>{product.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Button Configuration */}
            <div className={`rounded-2xl shadow-sm p-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>Button Configuration</h2>
              
              <div className="space-y-5">
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                    placeholder="Shop Now"
                    className={`w-full px-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                      theme === 'dark'
                        ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                    }`}
                  />
                  {errors.button_text && <p className="text-xs text-red-400 mt-1">{errors.button_text}</p>}
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Button URL
                  </label>
                  <input
                    type="url"
                    value={formData.button_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, button_url: e.target.value }))}
                    placeholder="https://yourstore.com/shop"
                    className={`w-full px-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                      theme === 'dark'
                        ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                    }`}
                  />
                  {errors.button_url && <p className="text-xs text-red-400 mt-1">{errors.button_url}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className={`rounded-2xl shadow-sm p-6 sticky top-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>Actions</h2>
              
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#4F6BFF] to-[#6366F1] text-white text-sm font-medium shadow-lg shadow-[#4F6BFF]/25 hover:shadow-xl hover:shadow-[#4F6BFF]/35 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Campaign</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.visit('/admin/marketing/campaigns')}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    theme === 'dark'
                      ? 'border-gray-700 text-[#94A3B8] hover:bg-[#17243B]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>

              <div className={`mt-6 pt-6 border-t ${
                theme === 'dark' ? 'border-[#1E293B]' : 'border-gray-200'
              }`}>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
                }`}>
                  Campaign will be {formData.status === 'draft' ? 'saved as draft' : formData.status === 'scheduled' ? 'scheduled for the selected date' : 'active immediately'}.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
