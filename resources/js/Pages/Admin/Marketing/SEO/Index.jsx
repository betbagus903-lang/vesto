import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { useTheme } from '../../../../Context/ThemeContext';
import {
  Search,
  Globe,
  BarChart3,
  LayoutGrid,
  FileText,
  Tag,
  Image as ImageIcon,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Settings,
  RefreshCw,
  Eye,
  Copy,
  ExternalLink,
  ChevronDown,
  Save,
  X,
  Zap,
  Target,
} from 'lucide-react';

export default function SEOIndex({ seoSettings = {}, stats = {} }) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('homepage');
  const [autoGenerate, setAutoGenerate] = useState({
    meta: true,
    slug: true,
    keywords: true,
    description: true,
  });

  // Use stats from backend or fallback to mock data
  const seoStats = {
    seo_score: stats.seo_score ?? 85,
    indexed_pages: stats.indexed_pages ?? 124,
    meta_completed: stats.meta_completed ?? 89,
    broken_links: stats.broken_links ?? 0,
    organic_traffic: stats.organic_traffic ?? 18523,
  };

  const tabs = [
    { id: 'homepage', label: 'Homepage SEO', icon: LayoutGrid },
    { id: 'products', label: 'Products SEO', icon: Tag },
    { id: 'categories', label: 'Categories SEO', icon: FileText },
    { id: 'collections', label: 'Collections SEO', icon: Sparkles },
    { id: 'blog', label: 'Blog SEO', icon: FileText },
  ];

  const SEOForm = ({ tab }) => (
    <div className="space-y-6">
      {/* Meta Title */}
      <div>
        <label className={`block text-xs font-medium mb-2 ${
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
        }`}>
          Meta Title
        </label>
        <input
          type="text"
          defaultValue={seoSettings[tab]?.meta_title || ''}
          placeholder="Enter meta title"
          className={`w-full px-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
              : 'bg-gray-50 border border-gray-200 text-gray-900'
          }`}
        />
        <div className="flex items-center justify-between mt-1">
          <span className={`text-xs ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
          }`}>
            {(seoSettings[tab]?.meta_title || '').length}/60 characters
          </span>
          {(seoSettings[tab]?.meta_title || '').length > 60 ? (
            <span className="text-xs text-red-400">Too long</span>
          ) : (
            <span className="text-xs text-emerald-400">Good length</span>
          )}
        </div>
      </div>

      {/* Meta Description */}
      <div>
        <label className={`block text-xs font-medium mb-2 ${
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
        }`}>
          Meta Description
        </label>
        <textarea
          defaultValue={seoSettings[tab]?.meta_description || ''}
          placeholder="Enter meta description"
          rows={4}
          className={`w-full px-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 resize-none ${
            theme === 'dark'
              ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
              : 'bg-gray-50 border border-gray-200 text-gray-900'
          }`}
        />
        <div className="flex items-center justify-between mt-1">
          <span className={`text-xs ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
          }`}>
            {(seoSettings[tab]?.meta_description || '').length}/160 characters
          </span>
          {(seoSettings[tab]?.meta_description || '').length > 160 ? (
            <span className="text-xs text-red-400">Too long</span>
          ) : (
            <span className="text-xs text-emerald-400">Good length</span>
          )}
        </div>
      </div>

      {/* Keywords */}
      <div>
        <label className={`block text-xs font-medium mb-2 ${
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
        }`}>
          Keywords
        </label>
        <input
          type="text"
          defaultValue={seoSettings[tab]?.keywords || ''}
          placeholder="fashion, clothing, minimalist, modern"
          className={`w-full px-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
              : 'bg-gray-50 border border-gray-200 text-gray-900'
          }`}
        />
        <p className={`text-xs mt-1 ${
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
        }`}>Separate keywords with commas</p>
      </div>

      {/* OG Image */}
      <div>
        <label className={`block text-xs font-medium mb-2 ${
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
        }`}>
          OG Image
        </label>
        <div className={`border-2 border-dashed rounded-xl p-6 text-center ${
          theme === 'dark'
            ? 'border-gray-700 hover:border-[#4F6BFF]'
            : 'border-gray-200 hover:border-[#4F6BFF]'
        } transition-colors cursor-pointer`}>
          <ImageIcon className={`w-12 h-12 mx-auto mb-3 ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
          }`} />
          <p className={`text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
          }`}>Upload OG image</p>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
          }`}>Recommended: 1200x630px</p>
        </div>
      </div>
    </div>
  );

  const GooglePreview = () => (
    <div className={`rounded-xl p-4 border ${
      theme === 'dark' ? 'bg-[#0C1524] border-gray-700' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gray-300" />
          <span className={`text-xs ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
          }`}>vesto.com</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </div>
        <p className={`text-sm font-medium text-blue-600 hover:underline cursor-pointer ${
          theme === 'dark' ? 'text-blue-400' : ''
        }`}>
          {seoSettings[activeTab]?.meta_title || 'Your Meta Title Here - Vesto Fashion Store'}
        </p>
        <p className={`text-xs ${
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
        }`}>
          {seoSettings[activeTab]?.meta_description || 'Your meta description will appear here. Make it compelling to improve click-through rates.'}
        </p>
      </div>
    </div>
  );

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
            <span className={`font-medium ${
              theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
            }`}>SEO</span>
          </nav>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
          }`}>SEO Management</h1>
          <p className={`text-sm mt-2 ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
          }`}>Optimize your website for search engines.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: 'SEO Score',
              value: seoStats.seo_score + '%',
              icon: BarChart3,
              color: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500',
              bg: theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100',
            },
            {
              label: 'Indexed Pages',
              value: seoStats.indexed_pages,
              icon: Globe,
              color: theme === 'dark' ? 'text-blue-400' : 'text-blue-500',
              bg: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
            },
            {
              label: 'Meta Completed',
              value: seoStats.meta_completed + '%',
              icon: Tag,
              color: theme === 'dark' ? 'text-purple-400' : 'text-purple-500',
              bg: theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100',
            },
            {
              label: 'Organic Traffic',
              value: seoStats.organic_traffic.toLocaleString(),
              icon: Target,
              color: theme === 'dark' ? 'text-orange-400' : 'text-orange-500',
              bg: theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100',
            },
          ].map((stat, i) => (
            <div key={i} className={`rounded-2xl p-5 shadow-sm ${
              theme === 'dark' ? 'bg-[#101827]' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold mt-1 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>{stat.value}</p>
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
              }`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tabs and Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className={`rounded-2xl shadow-sm p-2 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? theme === 'dark'
                          ? 'bg-[#4F6BFF] text-white'
                          : 'bg-[#4F6BFF] text-white'
                        : theme === 'dark'
                          ? 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#17243B]'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SEO Form */}
            <div className={`rounded-2xl shadow-sm p-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                }`}>{tabs.find(t => t.id === activeTab)?.label}</h2>
                <button className={`flex items-center gap-2 text-xs font-medium ${
                  theme === 'dark' ? 'text-[#94A3B8] hover:text-[#F8FAFC]' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
              
              <SEOForm tab={activeTab} />
            </div>

            {/* Auto Generate Settings */}
            <div className={`rounded-2xl shadow-sm p-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>Auto Generate SEO</h2>
              
              <div className="space-y-4">
                {[
                  { key: 'meta', label: 'Auto Generate Meta', icon: Sparkles },
                  { key: 'slug', label: 'Auto Slug', icon: Target },
                  { key: 'keywords', label: 'Auto Keywords', icon: Tag },
                  { key: 'description', label: 'Auto Description', icon: FileText },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                      }`}>{item.label}</span>
                    </div>
                    <button
                      onClick={() => setAutoGenerate(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        autoGenerate[item.key] ? 'bg-[#4F6BFF]' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        autoGenerate[item.key] ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Robots Settings */}
            <div className={`rounded-2xl shadow-sm p-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>Robots Settings</h2>
              
              <div className="space-y-5">
                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Robots.txt
                  </label>
                  <textarea
                    defaultValue="User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nSitemap: https://vesto.com/sitemap.xml"
                    rows={6}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 resize-none ${
                      theme === 'dark'
                        ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
                  }`}>
                    Canonical URL
                  </label>
                  <input
                    type="url"
                    defaultValue="https://vesto.com"
                    placeholder="https://yourstore.com"
                    className={`w-full px-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                      theme === 'dark'
                        ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview and Actions */}
          <div className="space-y-6">
            {/* Google Preview */}
            <div className={`rounded-2xl shadow-sm p-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                }`}>Google Preview</h2>
                <button className={`flex items-center gap-2 text-xs font-medium ${
                  theme === 'dark' ? 'text-[#94A3B8] hover:text-[#F8FAFC]' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  <ExternalLink className="w-3.5 h-3.5" />
                  Test Live
                </button>
              </div>
              
              <GooglePreview />
            </div>

            {/* Sitemap */}
            <div className={`rounded-2xl shadow-sm p-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                }`}>Sitemap</h2>
                <button className={`flex items-center gap-2 text-xs font-medium ${
                  theme === 'dark' ? 'text-[#94A3B8] hover:text-[#F8FAFC]' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate
                </button>
              </div>
              
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-[#0C1524]' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <Globe className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'
                    }`} />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                    }`}>sitemap.xml</span>
                  </div>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>Generated</span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-[#0C1524]' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <Globe className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'
                    }`} />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                    }`}>sitemap-products.xml</span>
                  </div>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>Generated</span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-[#0C1524]' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <Globe className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'
                    }`} />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
                    }`}>sitemap-categories.xml</span>
                  </div>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>Generated</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={`rounded-2xl shadow-sm p-6 sticky top-6 ${
              theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
              }`}>Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#4F6BFF] to-[#6366F1] text-white text-sm font-medium shadow-lg shadow-[#4F6BFF]/25 hover:shadow-xl hover:shadow-[#4F6BFF]/35 transition-all duration-200">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>

                <button className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  theme === 'dark'
                    ? 'border-gray-700 text-[#94A3B8] hover:bg-[#17243B]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}>
                  <Zap className="w-4 h-4" />
                  <span>Run SEO Audit</span>
                </button>

                <button className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  theme === 'dark'
                    ? 'border-gray-700 text-[#94A3B8] hover:bg-[#17243B]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}>
                  <Copy className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
