import React, { createContext, useContext, useState, useEffect } from 'react';

const BuyerThemeContext = createContext();

export const useBuyerTheme = () => {
  const context = useContext(BuyerThemeContext);
  if (!context) {
    throw new Error('useBuyerTheme must be used within a BuyerThemeProvider');
  }
  return context;
};

export const BuyerThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Sync with global theme from ThemeContext
    const globalTheme = localStorage.getItem('vesto-theme');
    return globalTheme || 'light';
  });

  useEffect(() => {
    // Sync with global theme
    localStorage.setItem('vesto-theme', theme);
    localStorage.setItem('buyer-theme', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Listen for changes from global theme
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'vesto-theme') {
        setTheme(e.newValue || 'light');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <BuyerThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </BuyerThemeContext.Provider>
  );
};
