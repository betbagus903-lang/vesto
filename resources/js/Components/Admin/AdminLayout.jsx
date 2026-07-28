import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import FlashHandler from '../FlashHandler';
import AIAssistant from '../AI/AIAssistant';
import { useTheme } from '../../Context/ThemeContext';

export default function AdminLayout({ children }) {
  const { theme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 1024);
    if (!isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`min-h-screen font-['Arial'] ${
      theme === 'dark' ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'
    }`}>
      <FlashHandler />

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onToggleCollapse={toggleSidebar}
        onCloseMobile={closeMobileSidebar}
      />

      <div
        className="transition-all duration-300 ease-in-out min-h-screen"
        style={{
          marginLeft: isMobile ? '0' : isSidebarCollapsed ? '5rem' : '280px',
        }}
      >
        <Navbar onToggleSidebar={toggleSidebar} />

        <main className="p-6 lg:p-8">{children}</main>
      </div>

      {/* Toast Notification Area */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2"></div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}
