import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, XCircle, X, Info, AlertCircle } from 'lucide-react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 5000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration = 5000) => {
    return showToast(message, 'success', duration);
  };

  const error = (message, duration = 5000) => {
    return showToast(message, 'error', duration);
  };

  const info = (message, duration = 5000) => {
    return showToast(message, 'info', duration);
  };

  const warning = (message, duration = 5000) => {
    return showToast(message, 'warning', duration);
  };

  useEffect(() => {
    const handleShowToast = (event) => {
      const { message, type = 'success' } = event.detail || {};
      if (message) showToast(message, type);
    };

    window.addEventListener('show-toast', handleShowToast);
    window.showToast = showToast;

    return () => {
      window.removeEventListener('show-toast', handleShowToast);
      delete window.showToast;
    };
  }, []);

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'info':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 flex-shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 flex-shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 flex-shrink-0" />;
    }
  };

  return (
    <ToastContext.Provider value={{ success, error, info, warning, showToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 ${getToastStyles(toast.type)}`}
              style={{ minWidth: '300px', maxWidth: '400px' }}
            >
              {getToastIcon(toast.type)}
              <span className="text-sm flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-white/10 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}