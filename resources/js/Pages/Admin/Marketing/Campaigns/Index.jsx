import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { useTheme } from '../../../../Context/ThemeContext';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Calendar,
  Target,
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  Pause,
  Megaphone,
  LayoutGrid,
  List,
  FileText,
} from 'lucide-react';

export default function CampaignsIndex({ campaigns = [], stats = {} }) {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Use stats from backend or calculate from campaigns
  const campaignStats = {
    total: stats.total ?? campaigns.length,
    active: stats.active ?? campaigns.filter(c => c.status === 'active').length,
    scheduled: stats.scheduled ?? campaigns.filter(c => c.status === 'scheduled').length,
    expired: stats.ended ?? campaigns.filter(c => c.status === 'expired' || c.status === 'finished').length,
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: theme === 'dark' ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600', icon: FileText },
      scheduled: { color: theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600', icon: Clock },
      active: { color: theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600', icon: Play },
      expired: { color: theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600', icon: XCircle },
      finished: { color: theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600', icon: CheckCircle },
    };
    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    const displayStatus = status || 'draft';
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
      </span>
    );
  };

  const getTargetBadge = (target) => {
    const targetConfig = {
      homepage: { color: theme === 'dark' ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600', label: 'Homepage' },
      collection: { color: theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600', label: 'Collection' },
      category: { color: theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600', label: 'Category' },
      product: { color: theme === 'dark' ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-600', label: 'Product' },
    };
    const config = targetConfig[target] || targetConfig.homepage;
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const CampaignCard = ({ campaign }) => (
    <div className={`rounded-2xl shadow-sm overflow-hidden ${
      theme === 'dark' ? 'bg-[#101827] border border-[#1E293B]' : 'bg-white border border-gray-100'
    }`}>
      {/* Banner Preview */}
      <div className="relative h-40 overflow-hidden">
        {campaign.banner ? (
          <img
            src={`/storage/${campaign.banner}`}
            alt={campaign.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' : 'bg-gradient-to-br from-blue-100 to-purple-100'
          }`}>
            <Megaphone className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {getStatusBadge(campaign.status)}
        </div>
        {/* Target Badge */}
        <div className="absolute top-3 right-3">
          {getTargetBadge(campaign.campaign_type)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name */}
        <h3 className={`font-semibold text-base mb-2 ${
          theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
        }`}>{campaign.name}</h3>

        {/* Date Range */}
        <div className={`flex items-center gap-2 text-xs mb-3 ${
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
        }`}>
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className={`text-center p-2 rounded-lg ${
            theme === 'dark' ? 'bg-[#0C1524]' : 'bg-gray-50'
          }`}>
            <p className={`text-lg font-bold ${
              theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
            }`}>{campaign.views || 0}</p>
            <p className={`text-[10px] ${
              theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
            }`}>Views</p>
          </div>
          <div className={`text-center p-2 rounded-lg ${
            theme === 'dark' ? 'bg-[#0C1524]' : 'bg-gray-50'
          }`}>
            <p className={`text-lg font-bold ${
              theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
            }`}>{campaign.clicks || 0}</p>
            <p className={`text-[10px] ${
              theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
            }`}>Clicks</p>
          </div>
          <div className={`text-center p-2 rounded-lg ${
            theme === 'dark' ? 'bg-[#0C1524]' : 'bg-gray-50'
          }`}>
            <p className={`text-lg font-bold ${
              theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
            }`}>{campaign.ctr ? campaign.ctr + '%' : '0%'}</p>
            <p className={`text-[10px] ${
              theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
            }`}>CTR</p>
          </div>
        </div>

        {/* Products Included */}
        <div className={`flex items-center gap-2 text-xs mb-4 ${
          theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
        }`}>
          <Target className="w-3.5 h-3.5" />
          <span>{campaign.products_included || 0} products included</span>
        </div>

        {/* Actions */}
        <div className={`flex items-center gap-2 pt-3 border-t ${
          theme === 'dark' ? 'border-[#1E293B]' : 'border-gray-100'
        }`}>
          <button className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition ${
            theme === 'dark'
              ? 'bg-[#17243B] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
              : 'bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}>
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          <button className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition ${
            theme === 'dark'
              ? 'bg-[#17243B] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
              : 'bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}>
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>
          <button className={`p-2 rounded-lg transition ${
            theme === 'dark'
              ? 'hover:bg-red-900/30 text-[#94A3B8] hover:text-red-400'
              : 'hover:bg-red-50 text-gray-500 hover:text-red-500'
          }`}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
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
            }`}>Campaigns</span>
          </nav>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
          }`}>Campaign Management</h1>
          <p className={`text-sm mt-2 ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
          }`}>Manage promotional campaigns for products and collections.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: 'Total Campaigns',
              value: campaignStats.total,
              icon: Megaphone,
              color: theme === 'dark' ? 'text-blue-400' : 'text-blue-500',
              bg: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
            },
            {
              label: 'Active Campaigns',
              value: campaignStats.active,
              icon: Play,
              color: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500',
              bg: theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100',
            },
            {
              label: 'Scheduled',
              value: campaignStats.scheduled,
              icon: Clock,
              color: theme === 'dark' ? 'text-amber-400' : 'text-amber-500',
              bg: theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100',
            },
            {
              label: 'Ended',
              value: campaignStats.expired,
              icon: CheckCircle,
              color: theme === 'dark' ? 'text-purple-400' : 'text-purple-500',
              bg: theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100',
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
              }`}>{stat.value.toLocaleString()}</p>
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-400'
              }`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className={`flex flex-wrap items-center gap-4 p-4 rounded-xl shadow-sm ${
          theme === 'dark' ? 'bg-[#101827]' : 'bg-white'
        }`}>
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-[#0C1524] border border-gray-700 text-gray-100'
                  : 'bg-gray-50 border border-gray-200 text-gray-900'
              }`}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#4F6BFF] transition-all duration-200 ${
              theme === 'dark'
                ? 'border-gray-700 text-[#94A3B8] bg-[#0C1524]'
                : 'border-gray-200 text-gray-600 bg-white'
            }`}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="finished">Finished</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={`px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#4F6BFF] transition-all duration-200 ${
              theme === 'dark'
                ? 'border-gray-700 text-[#94A3B8] bg-[#0C1524]'
                : 'border-gray-200 text-gray-600 bg-white'
            }`}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#4F6BFF] transition-all duration-200 ${
              theme === 'dark'
                ? 'border-gray-700 text-[#94A3B8] bg-[#0C1524]'
                : 'border-gray-200 text-gray-600 bg-white'
            }`}
          >
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="name">Sort by: Name</option>
            <option value="views">Sort by: Views</option>
            <option value="revenue">Sort by: Revenue</option>
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
              <LayoutGrid className="w-4 h-4" />
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

          {/* Create Button */}
          <a
            href="/admin/marketing/campaigns/create"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#4F6BFF] to-[#6366F1] text-white text-sm shadow-lg shadow-[#4F6BFF]/25 hover:shadow-xl hover:shadow-[#4F6BFF]/35 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </a>
        </div>

        {/* Campaigns Grid */}
        {campaigns.length === 0 ? (
          <div className={`rounded-2xl p-12 text-center ${
            theme === 'dark' ? 'bg-[#101827]' : 'bg-white'
          }`}>
            <Megaphone className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-300'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'dark' ? 'text-[#F8FAFC]' : 'text-gray-900'
            }`}>No campaigns yet</h3>
            <p className={`text-sm mb-6 ${
              theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-500'
            }`}>Create your first promotional campaign to get started.</p>
            <a
              href="/admin/marketing/campaigns/create"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#4F6BFF] to-[#6366F1] text-white text-sm shadow-lg shadow-[#4F6BFF]/25 hover:shadow-xl hover:shadow-[#4F6BFF]/35 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {campaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
