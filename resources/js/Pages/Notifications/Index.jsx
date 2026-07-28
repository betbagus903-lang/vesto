import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import { Bell, Check, CheckCheck, Trash2, Search, Filter, X } from 'lucide-react';

export default function NotificationsIndex({ notifications, pagination, unread_count }) {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleMarkAsRead = async (notificationId) => {
    try {
      await router.post(`/notifications/${notificationId}/mark-read`);
      router.reload();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await router.post('/notifications/mark-all-read');
      router.reload();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    try {
      await router.delete(`/notifications/${notificationId}`);
      router.reload();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.link) {
      handleMarkAsRead(notification.id);
      router.visit(notification.link);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'unread' && !notification.is_read) ||
      (filterStatus === 'read' && notification.is_read);
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6" style={{ backgroundColor: '#111827', minHeight: '100vh', padding: '24px' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            <p className="text-gray-400 text-sm mt-1">
              {unread_count} unread notification{unread_count !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unread_count > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="rounded-xl p-4" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition"
                style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition"
                style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
              >
                <option value="all">All Types</option>
                <option value="order_created">Orders</option>
                <option value="payment_received">Payments</option>
                <option value="shipment_created">Shipments</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition"
              style={{ backgroundColor: '#0F172A', border: '1px solid #2C3A4D', color: '#F8FAFC' }}
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1E293B', border: '1px solid #2C3A4D' }}>
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-white font-medium mb-2">No notifications</h3>
              <p className="text-gray-400 text-sm">
                {searchQuery || filterType !== 'all' || filterStatus !== 'all' 
                  ? 'No notifications match your filters' 
                  : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#2C3A4D' }}>
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-[#17243B] transition cursor-pointer group ${
                    !notification.is_read ? 'bg-[#17243B]' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        !notification.is_read ? 'bg-blue-600' : 'bg-gray-600'
                      } group-hover:scale-110`}>
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                            {!notification.is_read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mt-1">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-gray-500 text-xs">{formatTime(notification.created_at)}</span>
                            <span className="text-gray-600 text-xs">•</span>
                            <span className="text-gray-500 text-xs capitalize">{notification.type.replace('_', ' ')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.is_read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="flex-shrink-0 p-1.5 rounded hover:bg-[#1E293B] transition text-gray-400 hover:text-white"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="flex-shrink-0 p-1.5 rounded hover:bg-red-500/20 transition text-gray-400 hover:text-red-400"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.total > pagination.per_page && (
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing {pagination.from} to {pagination.to} of {pagination.total} notifications
            </p>
            <div className="flex items-center gap-2">
              {pagination.current_page > 1 && (
                <button
                  onClick={() => router.visit(`/notifications?page=${pagination.current_page - 1}`)}
                  className="px-3 py-1.5 rounded bg-[#1E293B] text-white text-sm hover:bg-[#2C3A4D] transition"
                >
                  Previous
                </button>
              )}
              <span className="text-gray-400 text-sm">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              {pagination.current_page < pagination.last_page && (
                <button
                  onClick={() => router.visit(`/notifications?page=${pagination.current_page + 1}`)}
                  className="px-3 py-1.5 rounded bg-[#1E293B] text-white text-sm hover:bg-[#2C3A4D] transition"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
