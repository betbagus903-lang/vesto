import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Listen for Inertia events
    window.addEventListener('inertia:success', (event) => {
      const message = event.detail?.message || 'Operation completed successfully';
      addToast(message, 'success');
    });

    window.addEventListener('inertia:error', (event) => {
      const message = event.detail?.message || 'An error occurred';
      addToast(message, 'error');
    });

    // Custom event for showing toast
    window.addEventListener('show-toast', (event) => {
      const { message, type = 'success' } = event.detail || {};
      if (message) {
        addToast(message, type);
      }
    });

    return () => {
      window.removeEventListener('inertia:success', () => {});
      window.removeEventListener('inertia:error', () => {});
      window.removeEventListener('show-toast', () => {});
    };
  }, []);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}
          style={{ minWidth: '300px' }}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0" />
          )}
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
  );
}