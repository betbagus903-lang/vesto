import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { useTheme } from '../../Context/ThemeContext';
import LanguageSwitcher from '../LanguageSwitcher';
import {
  Search,
  Bell,
  MessageSquare,
  Sun,
  Moon,
  ChevronDown,
  Plus,
  Menu,
  LogOut,
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const themeStyles = {
    dark: {
      bg: 'bg-[#0a1628]/80',
      border: 'border-white/10',
      text: 'text-white',
      textMuted: 'text-gray-400',
      hoverBg: 'hover:bg-white/10',
      inputBg: 'bg-white/5',
      inputBorder: 'border-white/10',
    },
    light: {
      bg: 'bg-white/80',
      border: 'border-gray-200/50',
      text: 'text-gray-900',
      textMuted: 'text-gray-500',
      hoverBg: 'hover:bg-gray-100',
      inputBg: 'bg-gray-50/50',
      inputBorder: 'border-gray-200/50',
    },
  };

  const styles = themeStyles[theme];

  const notifications = [
    { id: 1, title: 'New order received', message: 'Order #1234 has been placed', time: '2 min ago', unread: true },
    { id: 2, title: 'Low stock alert', message: 'Product XYZ is running low', time: '15 min ago', unread: true },
    { id: 3, title: 'New customer', message: 'John Doe just registered', time: '1 hour ago', unread: false },
  ];

  const messages = [
    { id: 1, sender: 'Alice', message: 'Hey, can you check the inventory?', time: '5 min ago', unread: true },
    { id: 2, sender: 'Bob', message: 'The report is ready', time: '1 hour ago', unread: false },
  ];

  return (
    <header className={`h-16 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30 ${styles.bg} backdrop-blur-xl ${styles.border}`}>
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onToggleSidebar}
          className={`lg:hidden p-2 rounded-xl ${styles.hoverBg} ${styles.textMuted} hover:${styles.text} transition-all duration-200`}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb */}
        <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <a href="/admin/dashboard" className={`hover:${styles.text} transition-all duration-200 ${styles.textMuted}`}>Dashboard</a>
          <span className="text-gray-300">/</span>
          <a href="/admin/products" className={`hover:${styles.text} transition-all duration-200 ${styles.textMuted}`}>Catalog</a>
          <span className="text-gray-300">/</span>
          <span className={`font-medium ${styles.text}`}>Products</span>
        </nav>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${styles.textMuted}`} />
          <input
            type="text"
            placeholder="Search products..."
            className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm ${styles.inputBg} ${styles.inputBorder} ${styles.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BFF]/10 focus:border-[#4F6BFF] transition-all duration-200`}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Quick Action Button */}
        <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4F6BFF] to-[#6366F1] text-white text-sm font-semibold shadow-lg shadow-[#4F6BFF]/20 hover:shadow-xl hover:shadow-[#4F6BFF]/30 transition-all duration-200">
          <Plus className="w-4 h-4" />
          <span>Quick Action</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className={`p-2 rounded-xl ${styles.hoverBg} ${styles.textMuted} hover:${styles.text} transition-all duration-200 relative`}
        >
          <Bell className="w-5 h-5" />
          {notifications.filter((n) => n.unread).length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>

        {/* Messages */}
        <button
          onClick={() => setShowMessages(!showMessages)}
          className={`p-2 rounded-xl ${styles.hoverBg} ${styles.textMuted} hover:${styles.text} transition-all duration-200 relative`}
        >
          <MessageSquare className="w-5 h-5" />
          {messages.filter((m) => m.unread).length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>

        {/* Theme Switch */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl ${styles.hoverBg} ${styles.textMuted} hover:${styles.text} transition-all duration-200`}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl ${styles.hoverBg} transition-all duration-200`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F6BFF] to-[#6366F1] flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-[#4F6BFF]/30">
              A
            </div>
            <div className="hidden md:block text-left">
              <p className={`text-sm font-semibold ${styles.text}`}>Admin User</p>
              <p className={`text-xs ${styles.textMuted}`}>Super Admin</p>
            </div>
            <ChevronDown className={`w-4 h-4 ${styles.textMuted}`} />
          </button>

          {showUserDropdown && (
            <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg shadow-gray-200/50 border ${styles.border} ${styles.bg} backdrop-blur-xl overflow-hidden z-50`}>
              <div className={`p-4 ${styles.border}`}>
                <p className={`font-semibold text-sm ${styles.text}`}>Admin User</p>
                <p className={`text-xs ${styles.textMuted}`}>admin@vesto.com</p>
              </div>
              <div className="py-1">
                <a
                  href="/admin/profile"
                  className={`block px-4 py-2.5 text-sm ${styles.textMuted} hover:${styles.text} ${styles.hoverBg} transition-all duration-200`}
                >
                  Profile
                </a>
                <a
                  href="/admin/settings"
                  className={`block px-4 py-2.5 text-sm ${styles.textMuted} hover:${styles.text} ${styles.hoverBg} transition-all duration-200`}
                >
                  Settings
                </a>
              </div>
              <div className={`border-t ${styles.border} py-1`}>
                <button
                  onClick={() => router.post('/logout')}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all duration-200 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
