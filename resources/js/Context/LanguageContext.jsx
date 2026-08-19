import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('vesto_language');
    return savedLanguage || 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('vesto_language', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  const currency = language === 'id' ? 'IDR' : 'USD';
  const currencySymbol = language === 'id' ? 'Rp' : '$';
  const currencyRate = language === 'id' ? 15000 : 1; // USD to IDR rate

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, currency, currencySymbol, currencyRate }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translations
const translations = {
  en: {
    // Dashboard
    dashboard: 'Dashboard',
    overview: 'Overview',
    statistics: 'Statistics',
    analytics: 'Analytics',
    
    // Catalog
    catalog: 'Catalog',
    products: 'Products',
    categories: 'Categories',
    collections: 'Collections',
    attributes: 'Attributes',
    variants: 'Variants',
    
    // Orders
    orders: 'Orders',
    orderManagement: 'Order Management',
    shipments: 'Shipments',
    invoices: 'Invoices',
    
    // Customers
    customers: 'Customers',
    customerManagement: 'Customer Management',
    customerGroups: 'Customer Groups',
    
    // Marketing
    marketing: 'Marketing',
    campaigns: 'Campaigns',
    coupons: 'Coupons',
    seo: 'SEO',
    banners: 'Banners',
    
    // Settings
    settings: 'Settings',
    general: 'General',
    payment: 'Payment',
    shipping: 'Shipping',
    users: 'Users',
    
    // Common
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    export: 'Export',
    import: 'Import',
    view: 'View',
    actions: 'Actions',
    status: 'Status',
    name: 'Name',
    price: 'Price',
    quantity: 'Quantity',
    date: 'Date',
    total: 'Total',
    
    // AI Assistant
    aiAssistant: 'AI Assistant',
    poweredByGemini: 'Powered by Gemini',
    askMeAnything: 'Ask me anything',
    suggested: 'Suggested',
    history: 'History',
    clearConversation: 'Clear conversation',
    confirmAction: 'Confirm Action',
    execute: 'Execute',
    cancelAction: 'Cancel',
    thinking: 'Thinking...',
    error: 'Error',
    
    // AI Knowledge
    productsModule: 'Products Module',
    ordersModule: 'Orders Module',
    marketingModule: 'Marketing Module',
    seoModule: 'SEO Module',
    customersModule: 'Customers Module',
    categoriesModule: 'Categories Module',
    collectionsModule: 'Collections Module',
    dashboardModule: 'Dashboard & Analytics',
    
    // AI Commands
    createCoupon: 'Create coupon',
    createCampaign: 'Create campaign',
    generateSEO: 'Generate SEO',
    showStatistics: 'Show statistics',
    pendingOrders: 'Pending orders',
    lowStock: 'Low stock',
    whatShouldIDo: 'What should I do today',
  },
  id: {
    // Dashboard
    dashboard: 'Dasbor',
    overview: 'Ikhtisar',
    statistics: 'Statistik',
    analytics: 'Analitik',
    
    // Catalog
    catalog: 'Katalog',
    products: 'Produk',
    categories: 'Kategori',
    collections: 'Koleksi',
    attributes: 'Atribut',
    variants: 'Varian',
    
    // Orders
    orders: 'Pesanan',
    orderManagement: 'Manajemen Pesanan',
    shipments: 'Pengiriman',
    invoices: 'Faktur',
    
    // Customers
    customers: 'Pelanggan',
    customerManagement: 'Manajemen Pelanggan',
    customerGroups: 'Grup Pelanggan',
    
    // Marketing
    marketing: 'Pemasaran',
    campaigns: 'Kampanye',
    coupons: 'Kupon',
    seo: 'SEO',
    banners: 'Banner',
    
    // Settings
    settings: 'Pengaturan',
    general: 'Umum',
    payment: 'Pembayaran',
    shipping: 'Pengiriman',
    users: 'Pengguna',
    
    // Common
    create: 'Buat',
    edit: 'Edit',
    delete: 'Hapus',
    save: 'Simpan',
    cancel: 'Batal',
    search: 'Cari',
    filter: 'Filter',
    sort: 'Urutkan',
    export: 'Ekspor',
    import: 'Impor',
    view: 'Lihat',
    actions: 'Aksi',
    status: 'Status',
    name: 'Nama',
    price: 'Harga',
    quantity: 'Jumlah',
    date: 'Tanggal',
    total: 'Total',
    
    // AI Assistant
    aiAssistant: 'Asisten AI',
    poweredByGemini: 'Didukung oleh Gemini',
    askMeAnything: 'Tanyakan apa saja',
    suggested: 'Disarankan',
    history: 'Riwayat',
    clearConversation: 'Hapus percakapan',
    confirmAction: 'Konfirmasi Aksi',
    execute: 'Eksekusi',
    cancelAction: 'Batal',
    thinking: 'Berpikir...',
    error: 'Error',
    
    // AI Knowledge
    productsModule: 'Modul Produk',
    ordersModule: 'Modul Pesanan',
    marketingModule: 'Modul Pemasaran',
    seoModule: 'Modul SEO',
    customersModule: 'Modul Pelanggan',
    categoriesModule: 'Modul Kategori',
    collectionsModule: 'Modul Koleksi',
    dashboardModule: 'Dasbor & Analitik',
    
    // AI Commands
    createCoupon: 'Buat kupon',
    createCampaign: 'Buat kampanye',
    generateSEO: 'Generate SEO',
    showStatistics: 'Tampilkan statistik',
    pendingOrders: 'Pesanan tertunda',
    lowStock: 'Stok rendah',
    whatShouldIDo: 'Apa yang harus saya lakukan hari ini',
  },
};
