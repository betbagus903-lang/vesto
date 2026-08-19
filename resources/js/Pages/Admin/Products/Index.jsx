import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import ConfigurableAttributesModal from '../../../Components/Admin/ProductForms/ConfigurableAttributesModal';
import { useTheme } from '../../../Context/ThemeContext';
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Grid,
  List,
  Package,
  Heart,
  Star,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Sparkles,
  FileText,
  X,
  Save,
  Wand2,
} from 'lucide-react';

export default function ProductsIndex({ products, pagination, filters, categories, attributeFamilies, createdProduct: initialCreatedProduct }) {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedType, setSelectedType] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createdProduct, setCreatedProduct] = useState(initialCreatedProduct || null);
  const [showConfigurableModal, setShowConfigurableModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    attribute_family_id: '',
    type: 'simple',
    sku: '',
  });
  const [createErrors, setCreateErrors] = useState({});
  const [createLoading, setCreateLoading] = useState(false);

  // Show modal if product was just created and is configurable
  useEffect(() => {
    if (createdProduct && createdProduct.type === 'configurable') {
      setShowConfigurableModal(true);
    }
  }, [createdProduct]);

  // Use real products data from backend
  const displayProducts = products || [];

  // Debug: check product data
  console.log('Products from backend:', displayProducts);
  displayProducts.forEach(p => console.log('Product type:', p.type, 'Product:', p.name));

  // Calculate stats from real data
  const stats = {
    total: displayProducts.length,
    active: displayProducts.filter(p => p.is_active).length,
    lowStock: displayProducts.filter(p => p.stock > 0 && p.stock <= 10).length,
    featured: displayProducts.filter(p => p.featured).length,
    draft: displayProducts.filter(p => !p.is_active).length,
  };

  const getProductImage = (product) => {
    // Try gallery images first
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      const img = product.images[0];
      if (!img) return null;
      // Already absolute URL
      if (img.startsWith('http') || img.startsWith('/storage')) return img;
      return `/storage/${img}`;
    }
    // Fallback to single image field
    if (product.image) {
      const img = product.image;
      if (img.startsWith('http') || img.startsWith('/storage')) return img;
      return `/storage/${img}`;
    }
    return null;
  };

  const getCategoryName = (product) => {
    if (product.categories && product.categories.length > 0) {
      return product.categories[0].name;
    }
    return '-';
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header */}
        <div>
          <nav className={`flex items-center gap-2 text-sm mb-3 ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
          }`}>
            <a href="/admin/dashboard" className={`transition-all duration-200 ${
              theme === 'dark' ? 'hover:text-[#F8FAFC]' : 'hover:text-gray-900'
            }`}>Dashboard</a>
            <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}>/</span>
            <a href="/admin/products" className={`transition-all duration-200 ${
              theme === 'dark' ? 'hover:text-[#F8FAFC]' : 'hover:text-gray-900'
            }`}>Catalog</a>
            <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}>/</span>
            <span className={`font-medium ${
              theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
            }`}>Products</span>
          </nav>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
          }`}>Products</h1>
          <p className={`text-sm mt-2 ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
          }`}>Manage all fashion products from one place.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              label: 'Total Products',
              value: stats.total,
              trend: '+12%',
              trendUp: true,
              icon: Package,
              color: theme === 'dark' ? 'text-blue-400' : 'text-blue-500',
              bg: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
            },
            {
              label: 'Active Products',
              value: stats.active,
              icon: CheckCircle,
              color: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500',
              bg: theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100',
            },
            {
              label: 'Low Stock',
              value: stats.lowStock,
              icon: AlertCircle,
              color: theme === 'dark' ? 'text-amber-400' : 'text-amber-500',
              bg: theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100',
            },
            {
              label: 'Featured Products',
              value: stats.featured,
              icon: Sparkles,
              color: theme === 'dark' ? 'text-purple-400' : 'text-purple-500',
              bg: theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100',
            },
            {
              label: 'Draft Products',
              value: stats.draft,
              icon: FileText,
              color: theme === 'dark' ? 'text-pink-400' : 'text-pink-500',
              bg: theme === 'dark' ? 'bg-pink-500/20' : 'bg-pink-100',
            },
          ].map((stat, i) => (
            <div key={i} className={`rounded-2xl p-5 shadow-sm ${
              theme === 'dark' ? 'bg-[#101827]' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                {stat.trend && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    stat.trendUp ? (theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')
                  }`}>
                    {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.trend}
                  </div>
                )}
              </div>
              <p className={`text-2xl font-bold mt-1 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>{stat.value.toLocaleString()}</p>
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
              }`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                  : 'bg-gray-50 border border-gray-200 text-gray-900'
              }`}
            />
          </div>

          {/* Filter Button */}
          <button className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
            theme === 'dark'
              ? 'border-gray-700 text-[#94A3B8] hover:bg-[#17243B]'
              : 'border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}>
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>

          {/* Category Dropdown */}
          <select className={`px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#4F6BFF] transition-all duration-200 ${
            theme === 'dark'
              ? 'border-gray-700 text-[#94A3B8] bg-[#0C1524]'
              : 'border-gray-200 text-gray-600 bg-white'
          }`}>
            <option>All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Brand Dropdown */}
          <select className={`px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#4F6BFF] transition-all duration-200 ${
            theme === 'dark'
              ? 'border-gray-700 text-[#94A3B8] bg-[#0C1524]'
              : 'border-gray-200 text-gray-600 bg-white'
          }`}>
            <option>All Brands</option>
          </select>

          {/* Type Dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={`px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#4F6BFF] transition-all duration-200 ${
              theme === 'dark'
                ? 'border-gray-700 text-[#94A3B8] bg-[#0C1524]'
                : 'border-gray-200 text-gray-600 bg-white'
            }`}
          >
            <option value="">All Types</option>
            <option value="simple">Simple</option>
            <option value="configurable">Configurable</option>
            <option value="grouped">Grouped</option>
            <option value="bundle">Bundle</option>
            <option value="virtual">Virtual</option>
            <option value="downloadable">Downloadable</option>
          </select>

          {/* Status Dropdown */}
          <select className={`px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#4F6BFF] transition-all duration-200 ${
            theme === 'dark'
              ? 'border-gray-700 text-[#94A3B8] bg-[#0C1524]'
              : 'border-gray-200 text-gray-600 bg-white'
          }`}>
            <option>All Status</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Low Stock</option>
          </select>

          {/* Stock Dropdown */}
          <select className={`px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#4F6BFF] transition-all duration-200 ${
            theme === 'dark'
              ? 'border-gray-700 text-[#94A3B8] bg-[#0C1524]'
              : 'border-gray-200 text-gray-600 bg-white'
          }`}>
            <option>All Stock</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>

          {/* Sort Dropdown */}
          <select className={`px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#4F6BFF] transition-all duration-200 ${
            theme === 'dark'
              ? 'border-gray-700 text-[#94A3B8] bg-[#0C1524]'
              : 'border-gray-200 text-gray-600 bg-white'
          }`}>
            <option>Sort by: Newest</option>
            <option>Sort by: Name</option>
            <option>Sort by: Price</option>
            <option>Sort by: Stock</option>
          </select>

          {/* View Toggle */}
          <div className={`flex items-center border rounded-xl overflow-hidden ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-all duration-200 ${
                viewMode === 'grid'
                  ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                  : theme === 'dark' ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17243B]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-all duration-200 ${
                viewMode === 'list'
                  ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                  : theme === 'dark' ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17243B]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Import/Export */}
          <button className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
            theme === 'dark'
              ? 'border-gray-700 text-[#94A3B8] hover:bg-[#17243B]'
              : 'border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}>
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          {/* Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#4F6BFF] to-[#6366F1] text-white text-sm shadow-lg shadow-[#4F6BFF]/25 hover:shadow-xl hover:shadow-[#4F6BFF]/35 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Product</span>
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.filter(product => !selectedType || product.type === selectedType).map((product) => (
            <div key={product.id} className={`rounded-2xl shadow-sm flex overflow-hidden ${
              theme === 'dark'
                ? 'bg-[#101827] border border-[#1E293B]'
                : 'bg-white border border-gray-100'
            }`}>
              {/* Product Image */}
              <div className="w-full h-48 overflow-hidden relative group">
                {getProductImage(product) ? (
                  <>
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Design Button */}
                    {product.image && product.image.length > 0 && (
                      <button
                        onClick={() => window.open(`/admin/products/design/${product.id}/image/0`, '_blank')}
                        className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-lg"
                      >
                        <Wand2 size={12} />
                        Design
                      </button>
                    )}
                  </>
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' : 'bg-gradient-to-br from-blue-100 to-purple-100'
                  }`}>
                    <Package className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                  </div>
                )}

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  {product.is_active ? (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                    }`}>Published</span>
                  ) : (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      theme === 'dark' ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600'
                    }`}>Draft</span>
                  )}
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    theme === 'dark' ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {product.type || 'simple'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Name */}
                <h3 className={`font-semibold text-base flex-1 ${
                  theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                }`}>{product.name}</h3>

                {/* SKU */}
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
                }`}>SKU: {product.sku}</p>

                {/* Category */}
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
                }`}>{getCategoryName(product)}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mt-2">
                  <span className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                  }`}>
                    Rp{product.price.toLocaleString()}
                  </span>
                  {product.special_price && (
                    <span className={`text-sm line-through ${
                      theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
                    }`}>
                      Rp{product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Badge */}
                <div className="mt-3">
                  {product.stock > 10 ? (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      In Stock ({product.stock})
                    </span>
                  ) : product.stock > 0 ? (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                    }`}>
                      Low Stock ({product.stock})
                    </span>
                  ) : (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                    }`}>
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => alert('View product: ' + product.name)}
                    className={`p-1.5 rounded-md transition ${
                      theme === 'dark'
                        ? 'hover:bg-[#17243B] text-[#94A3B8] hover:text-[#F8FAFC]'
                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => router.visit(`/admin/products/${product.id}/edit`)}
                    className={`p-1.5 rounded-md transition ${
                      theme === 'dark'
                        ? 'hover:bg-[#17243B] text-[#94A3B8] hover:text-[#F8FAFC]'
                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this product?')) {
                        router.delete(`/admin/products/${product.id}`);
                      }
                    }}
                    className={`p-1.5 rounded-md transition ${
                      theme === 'dark'
                        ? 'hover:bg-red-900/30 text-[#94A3B8] hover:text-red-400'
                        : 'hover:bg-red-50 text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Product Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className={`rounded-xl shadow-sm w-full max-w-md mx-4 border ${
              theme === 'dark' ? 'bg-[#101827] border-[#1E293B]' : 'bg-white border-gray-100'
            }`}>
              {/* Modal Header */}
              <div className={`flex items-center justify-between px-6 py-4 border-b ${
                theme === 'dark' ? 'border-[#1E293B]' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-50'
                  }`}>
                    <Package className={`w-3 h-3 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                    }`} />
                  </div>
                  <h2 className={`text-base font-semibold ${
                    theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                  }`}>Create Product</h2>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`p-1 rounded-md transition ${
                    theme === 'dark'
                      ? 'hover:bg-[#17243B] text-[#94A3B8] hover:text-[#F8FAFC]'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={(e) => {
                e.preventDefault();
                setCreateLoading(true);
                setCreateErrors({});

                router.post('/admin/products', createFormData, {
                  onFinish: () => {
                    setCreateLoading(false);
                  },
                  onSuccess: (page) => {
                    const product = page.props.createdProduct;
                    setCreatedProduct(product);
                    setShowCreateModal(false);
                    setCreateFormData({
                      name: '',
                      attribute_family_id: '',
                      type: 'simple',
                      sku: '',
                    });

                    // If configurable, show attributes modal (handled by useEffect)
                    if (createFormData.type !== 'configurable') {
                      // For other types, redirect to edit
                      router.visit(`/admin/products/${product.id}/edit`);
                    }
                  },
                  onError: (errors) => {
                    setCreateErrors(errors);
                    setCreateLoading(false);
                  },
                });
              }} className="p-6 space-y-4">
                {/* Product Name */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Product Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                    className={`w-full px-3 py-2 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] ${
                      theme === 'dark'
                        ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                    }`}
                  />
                  {createErrors.name && <p className="text-xs text-red-400 mt-1">{createErrors.name}</p>}
                </div>

                {/* Product Type */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Product Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="type"
                    value={createFormData.type}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, type: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] ${
                      theme === 'dark'
                        ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="simple">Simple</option>
                    <option value="configurable">Configurable</option>
                    <option value="grouped">Grouped</option>
                    <option value="bundle">Bundle</option>
                    <option value="virtual">Virtual</option>
                    <option value="downloadable">Downloadable</option>
                  </select>
                  {createErrors.type && <p className="text-xs text-red-400 mt-1">{createErrors.type}</p>}
                </div>

                {/* Attribute Family */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Attribute Family <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="attribute_family_id"
                    value={createFormData.attribute_family_id}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, attribute_family_id: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] ${
                      theme === 'dark'
                        ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="">Select Attribute Family</option>
                    {attributeFamilies.map((family) => (
                      <option key={family.id} value={family.id}>{family.name}</option>
                    ))}
                  </select>
                  {createErrors.attribute_family_id && <p className="text-xs text-red-400 mt-1">{createErrors.attribute_family_id}</p>}
                </div>

                {/* SKU */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    SKU <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={createFormData.sku}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="Enter SKU"
                    className={`w-full px-3 py-2 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] ${
                      theme === 'dark'
                        ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                    }`}
                  />
                  {createErrors.sku && <p className="text-xs text-red-400 mt-1">{createErrors.sku}</p>}
                </div>

                {/* Modal Footer */}
                <div className={`flex items-center justify-end gap-3 pt-4 border-t ${
                  theme === 'dark' ? 'border-[#1E293B]' : 'border-gray-200'
                }`}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition border bg-transparent ${
                      theme === 'dark'
                        ? 'border-gray-700 text-[#94A3B8] hover:bg-[#17243B]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition text-white disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700"
                  >
                    {createLoading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3 h-3" />
                        <span>Save Product</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Configurable Attributes Modal */}
        {showConfigurableModal && createdProduct && (
          <ConfigurableAttributesModal
            product={createdProduct}
            attributeFamily={createdProduct.attributeFamily || null}
            onClose={() => {
              setShowConfigurableModal(false);
              setCreatedProduct(null);
              router.visit(`/admin/products/${createdProduct.id}/configurableedit`);
            }}
            onSuccess={() => {
              setShowConfigurableModal(false);
              setCreatedProduct(null);
              router.visit(`/admin/products/${createdProduct.id}/configurableedit`);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
