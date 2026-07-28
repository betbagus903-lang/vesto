export function getThemeStyles(theme) {
  const isDark = theme === 'dark';

  return {
    // Card styles
    card: {
      backgroundColor: isDark ? '#101827' : '#ffffff',
      border: `1px solid ${isDark ? '#1E293B' : '#e5e7eb'}`,
      borderRadius: '12px',
      marginBottom: '16px',
    },
    cardHeader: {
      padding: '16px 24px',
      borderBottom: `1px solid ${isDark ? '#1E293B' : '#e5e7eb'}`,
      fontSize: '15px',
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#111827',
    },
    cardBody: { padding: '24px' },

    // Form styles
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '500',
      color: isDark ? '#94A3B8' : '#6b7280',
      marginBottom: '6px',
    },
    input: (err = false) => ({
      width: '100%',
      padding: '9px 12px',
      backgroundColor: isDark ? '#0C1524' : '#f9fafb',
      border: `1px solid ${err ? '#EF4444' : isDark ? '#1E293B' : '#e5e7eb'}`,
      borderRadius: '8px',
      color: isDark ? '#F8FAFC' : '#111827',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
      height: '44px',
    }),
    textarea: (err = false) => ({
      width: '100%',
      padding: '9px 12px',
      backgroundColor: isDark ? '#0C1524' : '#f9fafb',
      border: `1px solid ${err ? '#EF4444' : isDark ? '#1E293B' : '#e5e7eb'}`,
      borderRadius: '8px',
      color: isDark ? '#F8FAFC' : '#111827',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
      resize: 'vertical',
    }),
    select: (err = false) => ({
      width: '100%',
      padding: '9px 12px',
      backgroundColor: isDark ? '#0C1524' : '#f9fafb',
      border: `1px solid ${err ? '#EF4444' : isDark ? '#1E293B' : '#e5e7eb'}`,
      borderRadius: '8px',
      color: isDark ? '#F8FAFC' : '#111827',
      fontSize: '14px',
      outline: 'none',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      paddingRight: '32px',
      boxSizing: 'border-box',
      height: '44px',
    }),

    // Text styles
    heading: { color: isDark ? '#F8FAFC' : '#111827' },
    body: { color: isDark ? '#94A3B8' : '#6b7280' },
    muted: { color: isDark ? '#64748B' : '#9ca3af' },

    // Border/divider
    divider: {
      borderTop: `1px solid ${isDark ? '#1E293B' : '#e5e7eb'}`,
      margin: '4px -24px 20px',
    },

    // Button styles
    btnBlue: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '9px 18px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      backgroundColor: '#3B82F6',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
    },
    btnGhost: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '9px 18px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '500',
      backgroundColor: 'transparent',
      color: isDark ? '#94A3B8' : '#6b7280',
      border: `1px solid ${isDark ? '#1E293B' : '#e5e7eb'}`,
      cursor: 'pointer',
      textDecoration: 'none',
    },

    // Error/hint
    err: { fontSize: '12px', color: '#EF4444', marginTop: '4px' },
    hint: { fontSize: '12px', color: isDark ? '#475569' : '#9ca3af', marginTop: '4px' },

    // Image upload
    imageUpload: {
      border: `1px dashed ${isDark ? '#1E293B' : '#d1d5db'}`,
      borderRadius: '8px',
      cursor: 'pointer',
      color: isDark ? '#475569' : '#9ca3af',
      fontSize: '13px',
    },

    // Toggle
    toggleTrack: (checked) => ({
      width: '44px',
      height: '24px',
      borderRadius: '12px',
      cursor: 'pointer',
      backgroundColor: checked ? '#3B82F6' : isDark ? '#1E293B' : '#d1d5db',
      position: 'relative',
      transition: 'background .2s',
      flexShrink: 0,
    }),

    // Page background
    pageBg: isDark ? '#08111F' : '#F8FAFC',

    // Breadcrumb
    breadcrumb: { color: isDark ? '#94A3B8' : '#9ca3af' },
    breadcrumbActive: { color: isDark ? '#F8FAFC' : '#111827' },
  };
}
