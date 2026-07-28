import React from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Folder,
  Calendar,
  Clock,
  Tag,
  Settings,
  Image as ImageIcon,
  Check,
  X,
  ChevronRight,
} from 'lucide-react';

export default function CategoryShow({ category }) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this category?')) {
      router.delete(`/admin/categories/${category.id}`, {
        onSuccess: () => {
          router.visit('/admin/categories');
        },
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <nav className="flex items-center gap-2 text-xs mb-2">
            <a href="/admin/dashboard" className="text-[#94A3B8] hover:text-[#F8FAFC] transition">
              Dashboard
            </a>
            <span className="text-[#94A3B8]">/</span>
            <a href="/admin/catalog" className="text-[#94A3B8] hover:text-[#F8FAFC] transition">
              Catalog
            </a>
            <span className="text-[#94A3B8]">/</span>
            <a href="/admin/categories" className="text-[#94A3B8] hover:text-[#F8FAFC] transition">
              Categories
            </a>
            <span className="text-[#94A3B8]">/</span>
            <span className="text-[#F8FAFC] font-medium">{category.name}</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-[#F8FAFC]">Category Details</h1>
            <div className="flex items-center gap-2">
              <a
                href={`/admin/categories/${category.id}/edit`}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#0C1524] hover:bg-[#17243B] text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl transition border border-[#1E293B] text-sm"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </a>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition border border-red-500/20 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (70%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Information Card */}
            <div className="bg-[#101827] rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-medium text-[#F8FAFC] mb-5">General Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Folder className="w-3 h-3 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-[#94A3B8] mb-1">Category Name</label>
                    <p className="text-sm text-[#F8FAFC]">{category.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Tag className="w-3 h-3 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-[#94A3B8] mb-1">Slug</label>
                    <p className="text-sm text-[#94A3B8] font-mono">{category.slug}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Folder className="w-3 h-3 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-[#94A3B8] mb-1">Parent Category</label>
                    <p className="text-sm text-[#F8FAFC]">{category.parent || '-'}</p>
                  </div>
                </div>

                {category.description && (
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Folder className="w-3 h-3 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-[#94A3B8] mb-1">Description</label>
                      <p className="text-sm text-[#94A3B8]">{category.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Images Card */}
            {(category.logo_path || category.banner_path) && (
              <div className="bg-[#101827] rounded-xl p-6 shadow-sm">
                <h2 className="text-base font-medium text-[#F8FAFC] mb-5">Images</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.logo_path && (
                    <div>
                      <label className="block text-xs text-[#94A3B8] mb-2">Logo</label>
                      <img
                        src={`/storage/${category.logo_path}`}
                        alt="Logo"
                        className="w-full h-32 object-cover rounded-xl"
                      />
                    </div>
                  )}
                  {category.banner_path && (
                    <div>
                      <label className="block text-xs text-[#94A3B8] mb-2">Banner</label>
                      <img
                        src={`/storage/${category.banner_path}`}
                        alt="Banner"
                        className="w-full h-32 object-cover rounded-xl"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Children Categories */}
            {category.children && category.children.length > 0 && (
              <div className="bg-[#101827] rounded-xl p-6 shadow-sm">
                <h2 className="text-base font-medium text-[#F8FAFC] mb-5">Sub Categories</h2>
                
                <div className="space-y-2">
                  {category.children.map((child) => (
                    <a
                      key={child.id}
                      href={`/admin/categories/${child.id}`}
                      className="flex items-center gap-2 p-3 rounded-lg hover:bg-[#17243B] transition"
                    >
                      <Folder className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-[#F8FAFC]">{child.name}</span>
                      <ChevronRight className="w-4 h-4 text-[#94A3B8] ml-auto" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (30%) */}
          <div className="space-y-6">
            {/* Settings Card */}
            <div className="bg-[#101827] rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Settings className="w-5 h-5 text-[#94A3B8]" />
                <h2 className="text-base font-medium text-[#F8FAFC]">Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs text-[#94A3B8]">Position</label>
                    <p className="text-sm text-[#F8FAFC]">{category.position}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs text-[#94A3B8]">Display Mode</label>
                    <p className="text-sm text-[#F8FAFC] capitalize">{category.display_mode}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs text-[#94A3B8]">Visible in Menu</label>
                    <p className="text-sm text-[#F8FAFC]">
                      {category.visible_in_menu ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Check className="w-4 h-4" />
                          Yes
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400">
                          <X className="w-4 h-4" />
                          No
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Card */}
            <div className="bg-[#101827] rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Tag className="w-5 h-5 text-[#94A3B8]" />
                <h2 className="text-base font-medium text-[#F8FAFC]">SEO</h2>
              </div>

              <div className="space-y-4">
                {category.meta_title && (
                  <div>
                    <label className="block text-xs text-[#94A3B8] mb-1">Meta Title</label>
                    <p className="text-sm text-[#94A3B8]">{category.meta_title}</p>
                  </div>
                )}

                {category.meta_keywords && (
                  <div>
                    <label className="block text-xs text-[#94A3B8] mb-1">Meta Keywords</label>
                    <p className="text-sm text-[#94A3B8]">{category.meta_keywords}</p>
                  </div>
                )}

                {category.meta_description && (
                  <div>
                    <label className="block text-xs text-[#94A3B8] mb-1">Meta Description</label>
                    <p className="text-sm text-[#94A3B8]">{category.meta_description}</p>
                  </div>
                )}

                {!category.meta_title && !category.meta_keywords && !category.meta_description && (
                  <p className="text-sm text-[#94A3B8]">No SEO information set</p>
                )}
              </div>
            </div>

            {/* Filterable Attributes */}
            {category.filterable_attributes && category.filterable_attributes.length > 0 && (
              <div className="bg-[#101827] rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Settings className="w-5 h-5 text-[#94A3B8]" />
                  <h2 className="text-base font-medium text-[#F8FAFC]">Filterable Attributes</h2>
                </div>

                <div className="space-y-2">
                  {category.filterable_attributes.map((attr) => (
                    <div
                      key={attr.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#0C1524]"
                    >
                      <span className="text-sm text-[#F8FAFC]">{attr.name}</span>
                      <span className="text-xs text-[#94A3B8] capitalize">{attr.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps Card */}
            <div className="bg-[#101827] rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-medium text-[#F8FAFC] mb-5">Timestamps</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-[#94A3B8] mt-0.5" />
                  <div className="flex-1">
                    <label className="block text-xs text-[#94A3B8] mb-1">Created At</label>
                    <p className="text-sm text-[#F8FAFC]">{category.created_at}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#94A3B8] mt-0.5" />
                  <div className="flex-1">
                    <label className="block text-xs text-[#94A3B8] mb-1">Updated At</label>
                    <p className="text-sm text-[#F8FAFC]">{category.updated_at}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
