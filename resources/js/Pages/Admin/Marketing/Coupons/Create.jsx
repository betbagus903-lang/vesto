import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { useTheme } from '../../../../Context/ThemeContext';
import {
  Save,
  X,
  Tag,
  Percent,
  DollarSign,
  Truck,
  Gift,
  Scissors,
  Calendar,
  Users,
  CheckCircle,
  ChevronDown,
  Plus,
  Trash2,
} from 'lucide-react';

export default function CouponCreate({ categories, products, customerGroups }) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    minimum_order: '',
    maximum_discount: '',
    start_date: '',
    expire_date: '',
    usage_limit: '',
    per_customer_limit: '',
    applicable_categories: [],
    applicable_products: [],
    customer_groups: [],
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    router.post('/admin/marketing/coupons', formData, {
      onFinish: () => setLoading(false),
      onSuccess: () => {
        router.visit('/admin/marketing/coupons');
      },
      onError: (errs) => {
        setErrors(errs);
        setLoading(false);
      },
    });
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      applicable_categories: prev.applicable_categories.includes(categoryId)
        ? prev.applicable_categories.filter(id => id !== categoryId)
        : [...prev.applicable_categories, categoryId],
    }));
  };

  const handleProductToggle = (productId) => {
    setFormData(prev => ({
      ...prev,
      applicable_products: prev.applicable_products.includes(productId)
        ? prev.applicable_products.filter(id => id !== productId)
        : [...prev.applicable_products, productId],
    }));
  };

  const handleCustomerGroupToggle = (groupId) => {
    setFormData(prev => ({
      ...prev,
      customer_groups: prev.customer_groups.includes(groupId)
        ? prev.customer_groups.filter(id => id !== groupId)
        : [...prev.customer_groups, groupId],
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
            <a href="/admin/marketing/coupons" className={`transition-all duration-200 ${
              theme === 'dark' ? 'hover:text-[#F8FAFC]' : 'hover:text-gray-900'
            }`}>Coupons</a>
            <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}>/</span>
            <span className={`font-medium ${
              theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
            }`}>Create Coupon</span>
          </nav>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
          }`}>Create Coupon</h1>
          <p className={`text-sm mt-2 ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
          }`}>Create a new discount coupon for your store.</p>
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
                {/* Coupon Code */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Coupon Code <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="SUMMER25"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 uppercase ${
                        theme === 'dark'
                          ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                          : 'bg-gray-50 border border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                  {errors.code && <p className="text-xs text-red-400 mt-1">{errors.code}</p>}
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
                    placeholder="Enter coupon description"
                    rows={3}
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

            {/* Discount Configuration */}
            <div className={`rounded-2xl shadow-sm p-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>Discount Configuration</h2>
              
              <div className="space-y-5">
                {/* Discount Type */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Discount Type <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'percentage', label: 'Percentage', icon: Percent },
                      { value: 'fixed', label: 'Fixed Amount', icon: DollarSign },
                      { value: 'free_shipping', label: 'Free Shipping', icon: Truck },
                      { value: 'buy_x_get_y', label: 'Buy X Get Y', icon: Gift },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, discount_type: type.value }))}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                          formData.discount_type === type.value
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
                  {errors.discount_type && <p className="text-xs text-red-400 mt-1">{errors.discount_type}</p>}
                </div>

                {/* Discount Value */}
                {formData.discount_type !== 'free_shipping' && (
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${
                      theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                    }`}>
                      Discount Value <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      {formData.discount_type === 'percentage' ? (
                        <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      ) : (
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      )}
                      <input
                        type="number"
                        value={formData.discount_value}
                        onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
                        placeholder={formData.discount_type === 'percentage' ? '25' : '50000'}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                          theme === 'dark'
                            ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                        }`}
                      />
                    </div>
                    {errors.discount_value && <p className="text-xs text-red-400 mt-1">{errors.discount_value}</p>}
                  </div>
                )}

                {/* Minimum Order */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Minimum Order Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={formData.minimum_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, minimum_order: e.target.value }))}
                      placeholder="100000"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                          : 'bg-gray-50 border border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                  {errors.minimum_order && <p className="text-xs text-red-400 mt-1">{errors.minimum_order}</p>}
                </div>

                {/* Maximum Discount */}
                {formData.discount_type === 'percentage' && (
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${
                      theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                    }`}>
                      Maximum Discount Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={formData.maximum_discount}
                        onChange={(e) => setFormData(prev => ({ ...prev, maximum_discount: e.target.value }))}
                        placeholder="50000"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                          theme === 'dark'
                            ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                        }`}
                      />
                    </div>
                    {errors.maximum_discount && <p className="text-xs text-red-400 mt-1">{errors.maximum_discount}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Date Settings */}
            <div className={`rounded-2xl shadow-sm p-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>Date Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Start Date
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
                    Expire Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.expire_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, expire_date: e.target.value }))}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                          : 'bg-gray-50 border border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                  {errors.expire_date && <p className="text-xs text-red-400 mt-1">{errors.expire_date}</p>}
                </div>
              </div>
            </div>

            {/* Usage Limits */}
            <div className={`rounded-2xl shadow-sm p-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>Usage Limits</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Total Usage Limit
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={formData.usage_limit}
                      onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: e.target.value }))}
                      placeholder="100"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                          : 'bg-gray-50 border border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
                  }`}>Leave empty for unlimited</p>
                  {errors.usage_limit && <p className="text-xs text-red-400 mt-1">{errors.usage_limit}</p>}
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Per Customer Limit
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={formData.per_customer_limit}
                      onChange={(e) => setFormData(prev => ({ ...prev, per_customer_limit: e.target.value }))}
                      placeholder="1"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                          : 'bg-gray-50 border border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
                  }`}>How many times each customer can use</p>
                  {errors.per_customer_limit && <p className="text-xs text-red-400 mt-1">{errors.per_customer_limit}</p>}
                </div>
              </div>
            </div>

            {/* Applicability */}
            <div className={`rounded-2xl shadow-sm p-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>Applicability</h2>
              
              <div className="space-y-5">
                {/* Applicable Categories */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Applicable Categories
                  </label>
                  <div className={`max-h-48 overflow-y-auto rounded-xl border p-4 space-y-2 ${
                    theme === 'dark' ? 'border-gray-700 bg-[#0C1524]' : 'border-gray-200 bg-gray-50'
                  }`}>
                    {categories?.map(category => (
                      <label key={category.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#17243B] cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={formData.applicable_categories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                          className="w-4 h-4 rounded border-gray-300 text-[#4F6BFF] focus:ring-[#4F6BFF]"
                        />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                        }`}>{category.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
                  }`}>Leave empty for all categories</p>
                </div>

                {/* Applicable Products */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Applicable Products
                  </label>
                  <div className={`max-h-48 overflow-y-auto rounded-xl border p-4 space-y-2 ${
                    theme === 'dark' ? 'border-gray-700 bg-[#0C1524]' : 'border-gray-200 bg-gray-50'
                  }`}>
                    {products?.slice(0, 10).map(product => (
                      <label key={product.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#17243B] cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={formData.applicable_products.includes(product.id)}
                          onChange={() => handleProductToggle(product.id)}
                          className="w-4 h-4 rounded border-gray-300 text-[#4F6BFF] focus:ring-[#4F6BFF]"
                        />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                        }`}>{product.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
                  }`}>Leave empty for all products</p>
                </div>

                {/* Customer Groups */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Customer Groups
                  </label>
                  <div className={`max-h-48 overflow-y-auto rounded-xl border p-4 space-y-2 ${
                    theme === 'dark' ? 'border-gray-700 bg-[#0C1524]' : 'border-gray-200 bg-gray-50'
                  }`}>
                    {customerGroups?.map(group => (
                      <label key={group.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#17243B] cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={formData.customer_groups.includes(group.id)}
                          onChange={() => handleCustomerGroupToggle(group.id)}
                          className="w-4 h-4 rounded border-gray-300 text-[#4F6BFF] focus:ring-[#4F6BFF]"
                        />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                        }`}>{group.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
                  }`}>Leave empty for all customers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className={`rounded-2xl shadow-sm p-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>Status</h2>
              
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                }`}>Active</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    formData.is_active ? 'bg-[#4F6BFF]' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    formData.is_active ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

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
                      <span>Save Coupon</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.visit('/admin/marketing/coupons')}
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
                  Coupon will be {formData.is_active ? 'active immediately' : 'saved as inactive'}.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
