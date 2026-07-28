import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { useTheme } from '../../../Context/ThemeContext';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Grid3X3,
  List,
  MoreVertical,
  ChevronDown,
  Folder,
  Package,
  TrendingUp,
  Star,
  Shirt,
  Moon,
  Sun,
} from 'lucide-react';

export default function CategoriesIndex({ categories, rootCategories, filters }) {
  const { theme, toggleTheme } = useTheme();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedRootCategory, setSelectedRootCategory] = useState('all');

  const handleSearch = (value) => {
    if (!value || value.trim() === '') {
      const { search, ...otherFilters } = filters;
      router.get('/admin/categories', otherFilters, { preserveState: false });
    } else {
      router.get('/admin/categories', { ...filters, search: value }, { preserveState: false });
    }
  };

  const handleFilter = (filterType, value) => {
    router.get('/admin/categories', { ...filters, [filterType]: value }, { preserveState: false });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      router.delete(`/admin/categories/${id}`);
    }
  };

  const CategoryCard = ({ category }) => {
    return (
      <div className={`rounded-2xl shadow-sm flex overflow-hidden ${
        theme === 'dark'
          ? 'bg-[#101827] border border-[#1E293B]'
          : 'bg-white border border-gray-100'
      }`}>
        {/* Left - Image */}
        <div className="w-[140px] h-full min-h-[160px] overflow-hidden rounded-l-lg flex-shrink-0">
          {category.logo_path ? (
            <img
              src={`/storage/${category.logo_path}`}
              alt={category.name}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
                : 'bg-gradient-to-br from-blue-100 to-purple-100'
            }`}>
              <Folder className={`w-12 h-12 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
              }`} />
            </div>
          )}
        </div>

        {/* Right - Info */}
        <div className="flex-1 flex flex-col p-5">
          {/* Top Row */}
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
              theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-50'
            }`}>
              <Folder className={`w-3 h-3 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
              }`} />
            </div>
            <span className={`font-semibold text-base flex-1 ${
              theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
            }`}>{category.name}</span>
            {category.visible_in_menu && (
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                theme === 'dark'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-blue-100 text-blue-600'
              }`}>Featured</span>
            )}
            {category.parent && (
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                theme === 'dark'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-purple-100 text-purple-600'
              }`}>{category.parent.name}</span>
            )}
            <button className={`transition ${
              theme === 'dark' ? 'text-[#94A3B8] hover:text-[#F8FAFC]' : 'text-gray-400 hover:text-gray-600'
            }`}>
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Slug */}
          <span className={`text-xs mb-1 ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
          }`}>{category.slug}</span>

          {/* Description */}
          {category.description && (
            <p className={`text-xs line-clamp-2 mb-2 ${
              theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
            }`}>{category.description}</p>
          )}

          {/* Statistics */}
          <div className="flex items-center gap-4 mb-auto">
            <span className={`text-xs ${
              theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
            }`}>
              <span className="font-semibold">{category.products_count || 0}</span> Products
            </span>
          </div>

          {/* Footer */}
          <div className={`flex justify-between items-center pt-3 border-t ${
            theme === 'dark' ? 'border-[#1E293B]' : 'border-gray-100'
          }`}>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
            }`}>Updated 2 hours ago</span>
            <div className="flex items-center gap-2">
              <a
                href={`/admin/categories/${category.id}`}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                  theme === 'dark'
                    ? 'bg-[#17243B] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#2D3748]'
                    : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
              </a>
              <a
                href={`/admin/categories/${category.id}/edit`}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                  theme === 'dark'
                    ? 'bg-[#17243B] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#2D3748]'
                    : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Edit className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleDelete(category.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                  theme === 'dark'
                    ? 'bg-[#17243B] border border-[#1E293B] text-[#94A3B8] hover:text-red-400 hover:border-red-500/20'
                    : 'bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className={`min-h-screen p-8 ${
        theme === 'dark' ? 'bg-[#08111F]' : 'bg-[#F8FAFC]'
      }`}>
        {/* Header Section */}
        <div className="flex flex-col gap-1 mb-8">
          <nav className={`flex items-center gap-2 text-xs ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
          }`}>
            <a href="/admin/dashboard" className={`transition ${
              theme === 'dark' ? 'hover:text-[#F8FAFC]' : 'hover:text-gray-700'
            }`}>
              Dashboard
            </a>
            <span>/</span>
            <a href="/admin/catalog" className={`transition ${
              theme === 'dark' ? 'hover:text-[#F8FAFC]' : 'hover:text-gray-700'
            }`}>
              Catalog
            </a>
            <span>/</span>
            <span className={`font-medium ${
              theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
            }`}>Categories</span>
          </nav>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
          }`}>Categories</h1>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
          }`}>Manage your product categories and organize your store</p>
        </div>

        {/* Root Categories Navigation */}
        <div className={`mb-6 p-4 rounded-xl shadow-sm ${
          theme === 'dark' ? 'bg-[#101827]' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
            }`}>Root Categories</h3>
            <a
              href="/admin/categories/create"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Root</span>
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedRootCategory('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                selectedRootCategory === 'all'
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-[#0C1524] text-[#94A3B8] hover:bg-[#17243B]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {rootCategories && rootCategories.map((root) => (
              <div key={root.id} className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedRootCategory(root.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    selectedRootCategory === root.id
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-600 text-white'
                      : theme === 'dark'
                        ? 'bg-[#0C1524] text-[#94A3B8] hover:bg-[#17243B]'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {root.name}
                </button>
                <a
                  href={`/admin/categories/${root.id}/edit`}
                  className={`p-1.5 rounded-md transition ${
                    theme === 'dark'
                      ? 'hover:bg-[#17243B] text-[#94A3B8] hover:text-[#F8FAFC]'
                      : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                  }`}
                  title="Edit Root Category"
                >
                  <Edit className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Categories Card */}
          <div className={`rounded-2xl shadow-sm p-5 ${
            theme === 'dark' ? 'bg-[#101827]' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-xs font-medium ${
                  theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
                }`}>Total Categories</p>
                <p className={`text-2xl font-bold mt-1 ${
                  theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                }`}>{categories.length}</p>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
                }`}>All child categories</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <Folder className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                }`} />
              </div>
            </div>
          </div>

          {/* Active Categories Card */}
          <div className={`rounded-2xl shadow-sm p-5 ${
            theme === 'dark' ? 'bg-[#101827]' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-xs font-medium ${
                  theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
                }`}>Active Categories</p>
                <p className={`text-2xl font-bold mt-1 ${
                  theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                }`}>
                  {categories.filter(c => c.visible_in_menu).length}
                </p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${
                  theme === 'dark' ? 'text-emerald-400' : 'text-green-500'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  Visible in menu
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-emerald-500/20' : 'bg-green-100'
              }`}>
                <Star className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-emerald-400' : 'text-green-500'
                }`} />
              </div>
            </div>
          </div>

          {/* Total Products Card */}
          <div className={`rounded-2xl shadow-sm p-5 ${
            theme === 'dark' ? 'bg-[#101827]' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-xs font-medium ${
                  theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
                }`}>Total Products</p>
                <p className={`text-2xl font-bold mt-1 ${
                  theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                }`}>
                  {categories.reduce((sum, c) => sum + (c.products_count || 0), 0)}
                </p>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
                }`}>Across all categories</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
              }`}>
                <Package className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
                }`} />
              </div>
            </div>
          </div>

          {/* Root Categories Card */}
          <div className={`rounded-2xl shadow-sm p-5 overflow-hidden relative ${
            theme === 'dark' ? 'bg-[#101827]' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center relative z-10">
              <div>
                <p className={`text-xs font-medium ${
                  theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
                }`}>Root Categories</p>
                <p className={`text-2xl font-bold mt-1 ${
                  theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                }`}>
                  {rootCategories?.length || 0}
                </p>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
                }`}>Main category groups</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100'
              }`}>
                <Shirt className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-orange-400' : 'text-orange-500'
                }`} />
              </div>
            </div>
            {/* Decorative clothing image placeholder */}
            <div className="absolute right-0 top-0 w-24 h-full opacity-10">
              <Shirt className={`w-full h-full ${
                theme === 'dark' ? 'text-orange-400' : 'text-orange-500'
              }`} />
            </div>
          </div>
        </div>

        {/* Toolbar & Control Row */}
        <div className={`flex justify-between items-center p-4 rounded-xl shadow-sm mb-6 ${
          theme === 'dark' ? 'bg-[#101827]' : 'bg-white'
        }`}>
          {/* Left - Controls */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search categories..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className={`rounded-lg pl-9 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:border-blue-500 ${
                  theme === 'dark'
                    ? 'bg-[#0C1524] border-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] focus:border-blue-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition ${
                  theme === 'dark'
                    ? 'bg-[#0C1524] border-[#1E293B] text-[#94A3B8] hover:bg-[#17243B]'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              {showFilterDropdown && (
                <div className={`absolute right-0 top-full mt-2 w-64 rounded-lg shadow-lg border overflow-hidden z-50 ${
                  theme === 'dark'
                    ? 'bg-[#101827] border-[#1E293B]'
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="p-3 space-y-3">
                    <div>
                      <label className={`block text-xs mb-1 ${
                        theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
                      }`}>Visible in Menu</label>
                      <select
                        value={filters.visible_in_menu}
                        onChange={(e) => handleFilter('visible_in_menu', e.target.value)}
                        className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 ${
                          theme === 'dark'
                            ? 'bg-[#0C1524] border-[#1E293B] text-[#F8FAFC]'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                        }`}
                      >
                        <option value="">All</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <button className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition ${
              theme === 'dark'
                ? 'bg-[#0C1524] border-[#1E293B] text-[#94A3B8] hover:bg-[#17243B]'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}>
              <span>Sort: Newest First</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* View Toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'grid'
                    ? theme === 'dark'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-blue-100 text-blue-600'
                    : theme === 'dark'
                      ? 'bg-[#0C1524] text-[#94A3B8] hover:text-[#F8FAFC]'
                      : 'bg-gray-50 text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'list'
                    ? theme === 'dark'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-blue-100 text-blue-600'
                    : theme === 'dark'
                      ? 'bg-[#0C1524] text-[#94A3B8] hover:text-[#F8FAFC]'
                      : 'bg-gray-50 text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition ${
                theme === 'dark'
                  ? 'bg-[#0C1524] text-[#94A3B8] hover:text-[#F8FAFC]'
                  : 'bg-gray-50 text-gray-400 hover:text-gray-600'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Right - Create Button */}
          <a
            href="/admin/categories/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Category</span>
          </a>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length === 0 ? (
            <div className={`col-span-full py-12 text-center ${
              theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
            }`}>
              No categories found
            </div>
          ) : (
            categories
              .filter(cat => selectedRootCategory === 'all' || cat.parent_id === selectedRootCategory)
              .map(category => (
              <CategoryCard key={category.id} category={category} />
            ))
          )}
        </div>

        {/* Pagination Footer */}
        <div className={`flex justify-between items-center mt-8 pt-4 border-t ${
          theme === 'dark' ? 'border-[#1E293B]' : 'border-gray-200'
        }`}>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
          }`}>
            Showing {categories.filter(cat => selectedRootCategory === 'all' || cat.parent_id === selectedRootCategory).length} categories
          </p>
          <div className="flex items-center gap-1">
            <button className={`p-2 rounded-lg transition ${
              theme === 'dark'
                ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17243B]'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}>
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
            <button className={`w-8 h-8 rounded-lg text-sm font-medium ${
              theme === 'dark'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-600 text-white'
            }`}>1</button>
            <button className={`w-8 h-8 rounded-lg text-sm transition ${
              theme === 'dark'
                ? 'text-[#94A3B8] hover:bg-[#17243B]'
                : 'text-gray-600 hover:bg-gray-100'
            }`}>2</button>
            <button className={`w-8 h-8 rounded-lg text-sm transition ${
              theme === 'dark'
                ? 'text-[#94A3B8] hover:bg-[#17243B]'
                : 'text-gray-600 hover:bg-gray-100'
            }`}>3</button>
            <button className={`w-8 h-8 rounded-lg text-sm transition ${
              theme === 'dark'
                ? 'text-[#94A3B8] hover:bg-[#17243B]'
                : 'text-gray-600 hover:bg-gray-100'
            }`}>4</button>
            <button className={`p-2 rounded-lg transition ${
              theme === 'dark'
                ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17243B]'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}>
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
