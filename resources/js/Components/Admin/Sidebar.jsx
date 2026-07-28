import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Tag,
  ClipboardList,
  ShoppingCart,
  Users,
  Building2,
  UserCog,
  DollarSign,
  BarChart3,
  Megaphone,
  Bell,
  MessageSquare,
  Calendar,
  FileText,
  Settings,
  Shield,
  ScrollText,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';
import { useTheme } from '../../Context/ThemeContext';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  {
    name: 'Catalog',
    icon: Package,
    hasSubmenu: true,
    submenu: [
      { name: 'Products', href: '/admin/products' },
      { name: 'Categories', href: '/admin/categories' },
      { name: 'Reviews', href: '/admin/catalog/reviews' },
      { name: 'Attributes', href: '/admin/attributes' },
      { name: 'Attribute Families', href: '/admin/attribute-families' },
    ],
  },
  { name: 'Inventory', icon: ClipboardList, href: '/admin/inventory' },
  {
    name: 'Sales',
    icon: ShoppingCart,
    hasSubmenu: true,
    submenu: [
      { name: 'Orders',    href: '/admin/sales/orders' },
      { name: 'Shipments', href: '/admin/sales/shipments' },
      { name: 'Invoices',  href: '/admin/sales/invoices' },
    ],
  },
  {
    name: 'Customers',
    icon: Users,
    hasSubmenu: true,
    submenu: [
      { name: 'Customers',           href: '/admin/customers' },
      { name: 'Groups',              href: '/admin/customers/groups' },
      { name: 'Reviews',             href: '/admin/customers/reviews' },
      { name: 'GDPR Data Requests',  href: '/admin/customers/gdpr-data-requests' },
    ],
  },
  { name: 'Suppliers', icon: Building2, href: '/admin/suppliers' },
  { name: 'Employees', icon: UserCog, href: '/admin/employees' },
  {
    name: 'Finance',
    icon: DollarSign,
    hasSubmenu: true,
    submenu: [
      { name: 'Transactions', href: '/admin/finance/transactions' },
      { name: 'Invoices', href: '/admin/finance/invoices' },
      { name: 'Expenses', href: '/admin/finance/expenses' },
    ],
  },
  {
    name: 'Reports',
    icon: BarChart3,
    hasSubmenu: true,
    submenu: [
      { name: 'Sales Report', href: '/admin/reports/sales' },
      { name: 'Inventory Report', href: '/admin/reports/inventory' },
      { name: 'Customer Report', href: '/admin/reports/customers' },
    ],
  },
  {
    name: 'Marketing',
    icon: Megaphone,
    hasSubmenu: true,
    submenu: [
      { name: 'Campaigns', href: '/admin/marketing/campaigns' },
      { name: 'Coupons', href: '/admin/marketing/coupons' },
      { name: 'SEO', href: '/admin/marketing/seo' },
    ],
  },
  { name: 'Notifications', icon: Bell, href: '/admin/notifications' },
  { name: 'Messages', icon: MessageSquare, href: '/admin/messages' },
  { name: 'Calendar', icon: Calendar, href: '/admin/calendar' },
  {
    name: 'CMS',
    icon: FileText,
    hasSubmenu: true,
    submenu: [
      { name: 'Collections', href: '/admin/cms/collections' },
      { name: 'Banners', href: '/admin/cms/banners' },
      { name: 'Pages', href: '/admin/cms/pages' },
      { name: 'Blogs', href: '/admin/cms/blogs' },
      { name: 'Media', href: '/admin/cms/media' },
    ],
  },
  {
    name: 'Settings',
    icon: Settings,
    hasSubmenu: true,
    submenu: [
      { name: 'General', href: '/admin/settings/general' },
      { name: 'Security', href: '/admin/settings/security' },
      { name: 'Email', href: '/admin/settings/email' },
    ],
  },
  { name: 'User Management', icon: Shield, href: '/admin/users' },
  { name: 'Roles & Permissions', icon: ScrollText, href: '/admin/roles' },
  { name: 'Activity Logs', icon: FileText, href: '/admin/activity-logs' },
  { name: 'Help Center', icon: HelpCircle, href: '/admin/help' },
];

export default function Sidebar({
  isCollapsed = false,
  isMobileOpen = false,
  onToggleCollapse,
  onCloseMobile,
}) {
  const { theme } = useTheme();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [activePath, setActivePath] = useState(window.location.pathname);

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  // Auto-expand Catalog if current page is Products, Categories, Attributes, or Attribute Families
  React.useEffect(() => {
    if (
      activePath.includes('/products') ||
      activePath.includes('/categories') ||
      activePath.includes('/attributes')
    ) {
      setExpandedMenus((prev) => ({
        ...prev,
        Catalog: true,
      }));
    }
    if (activePath.includes('/customers')) {
      setExpandedMenus((prev) => ({ ...prev, Customers: true }));
    }
    if (activePath.includes('/sales')) {
      setExpandedMenus((prev) => ({ ...prev, Sales: true }));
    }
    if (activePath.includes('/cms')) {
      setExpandedMenus((prev) => ({ ...prev, CMS: true }));
    }
    if (activePath.includes('/marketing')) {
      setExpandedMenus((prev) => ({ ...prev, Marketing: true }));
    }
  }, [activePath]);

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-[280px]';

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out ${sidebarWidth} bg-[#0F172A]`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4F6BFF] to-[#6366F1] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#4F6BFF]/30">
                V
              </div>
              <span className="font-bold text-lg text-white tracking-tight">Vesto</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4F6BFF] to-[#6366F1] flex items-center justify-center text-white font-bold text-sm mx-auto shadow-lg shadow-[#4F6BFF]/30">
              V
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg transition hover:bg-white/5 text-gray-400 hover:text-white"
          >
            {!isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 custom-scrollbar" style={{ height: 'calc(100vh - 64px)' }}>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                {!item.hasSubmenu ? (
                  <a
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                      activePath === item.href
                        ? 'bg-gradient-to-r from-[#4F6BFF] to-[#6366F1] text-white shadow-lg shadow-[#4F6BFF]/25'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                  </a>
                ) : (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                        expandedMenus[item.name]
                          ? 'bg-white/5 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform duration-300 text-gray-500 ${
                            expandedMenus[item.name] ? 'rotate-90' : ''
                          }`}
                        />
                      )}
                    </button>
                    {expandedMenus[item.name] && !isCollapsed && item.submenu && (
                      <ul className="mt-1 ml-2 space-y-0.5 overflow-hidden transition-all duration-300">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.name}>
                            <a
                              href={subItem.href}
                              className={`block px-3 py-2 rounded-lg transition-all duration-200 text-sm border-l-2 ${
                                activePath === subItem.href
                                  ? 'text-white bg-gradient-to-r from-[#4F6BFF]/20 to-[#6366F1]/20 border-[#4F6BFF]'
                                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                              }`}
                            >
                              {subItem.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F6BFF] to-[#6366F1] flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-[#4F6BFF]/30">
              A
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Admin User</p>
                <p className="text-xs text-gray-400 truncate">admin@vesto.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
        />
      )}
    </>
  );
}

// Add custom scrollbar styles
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}
