export const themeClasses = {
  dark: {
    // Backgrounds
    page: 'bg-[#0B1120]',
    card: 'bg-[#111827]',
    cardHover: 'hover:bg-[#1a2332]',
    input: 'bg-[#0C1524]',
    inputBorder: 'border-[#1E293B]',
    dropdown: 'bg-[#111827]',
    dropdownBorder: 'border-[#1E293B]',

    // Text
    heading: 'text-[#F8FAFC]',
    body: 'text-[#94A3B8]',
    muted: 'text-[#64748B]',
    accent: 'text-[#4F6BFF]',

    // Borders
    border: 'border-[#1E293B]',
    borderLight: 'border-[#1E293B]/50',

    // Hover
    hoverBg: 'hover:bg-[#1E293B]',
    hoverText: 'hover:text-[#F8FAFC]',

    // Sidebar
    sidebarBg: 'bg-[#0B1020]',
    sidebarBorder: 'border-white/8',
    sidebarText: 'text-white/50',
    sidebarTextActive: 'text-white',
    sidebarHover: 'hover:bg-white/5',
    sidebarHoverText: 'hover:text-white',

    // Navbar
    navbarBg: 'bg-[#111827]',
    navbarBorder: 'border-[#1E293B]',

    // Status
    successBg: 'bg-emerald-500/10',
    successText: 'text-emerald-400',
    warningBg: 'bg-amber-500/10',
    warningText: 'text-amber-400',
    dangerBg: 'bg-red-500/10',
    dangerText: 'text-red-400',
    infoBg: 'bg-blue-500/10',
    infoText: 'text-blue-400',

    // Stat icon backgrounds
    statIconBg: 'bg-[#1E293B]',

    // Badge
    badgeBg: 'bg-[#1E293B]',
    badgeText: 'text-[#94A3B8]',

    // Switch
    switchBg: 'bg-[#1E293B]',
    switchActive: 'bg-[#4F6BFF]',
    switchDot: 'bg-white',
  },
  light: {
    // Backgrounds
    page: 'bg-[#F8FAFC]',
    card: 'bg-white',
    cardHover: 'hover:bg-gray-50',
    input: 'bg-gray-50',
    inputBorder: 'border-gray-200',
    dropdown: 'bg-white',
    dropdownBorder: 'border-gray-200',

    // Text
    heading: 'text-gray-900',
    body: 'text-gray-500',
    muted: 'text-gray-400',
    accent: 'text-[#4F6BFF]',

    // Borders
    border: 'border-gray-100',
    borderLight: 'border-gray-100',

    // Hover
    hoverBg: 'hover:bg-gray-50',
    hoverText: 'hover:text-gray-900',

    // Sidebar (always dark)
    sidebarBg: 'bg-[#0B1020]',
    sidebarBorder: 'border-white/8',
    sidebarText: 'text-white/50',
    sidebarTextActive: 'text-white',
    sidebarHover: 'hover:bg-white/5',
    sidebarHoverText: 'hover:text-white',

    // Navbar
    navbarBg: 'bg-white',
    navbarBorder: 'border-gray-100',

    // Status
    successBg: 'bg-emerald-50',
    successText: 'text-emerald-600',
    warningBg: 'bg-amber-50',
    warningText: 'text-amber-600',
    dangerBg: 'bg-red-50',
    dangerText: 'text-red-600',
    infoBg: 'bg-blue-50',
    infoText: 'text-blue-600',

    // Stat icon backgrounds
    statIconBg: 'bg-gray-50',

    // Badge
    badgeBg: 'bg-gray-100',
    badgeText: 'text-gray-600',

    // Switch
    switchBg: 'bg-gray-200',
    switchActive: 'bg-[#4F6BFF]',
    switchDot: 'bg-white',
  },
};

export function getThemeClasses(theme) {
  return themeClasses[theme] || themeClasses.dark;
}
