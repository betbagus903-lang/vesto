/**
 * Shared design tokens for Admin Reports pages.
 * Call getT(theme) to get the full token object for 'dark' or 'light'.
 */
export function getT(theme) {
  const dark = {
    bg:         '#0B1426',
    panel:      '#111827',
    card:       '#141E2E',
    cardHov:    '#172236',
    border:     '#1E2D42',
    borderHov:  '#2A3F5C',
    input:      '#0D1929',
    // accents (same in both modes)
    blue:       '#3B82F6',
    blueD:      '#2563EB',
    blueSoft:   'rgba(59,130,246,0.12)',
    blueMid:    'rgba(59,130,246,0.20)',
    green:      '#10B981',
    greenSoft:  'rgba(16,185,129,0.12)',
    amber:      '#F59E0B',
    amberSoft:  'rgba(245,158,11,0.12)',
    red:        '#EF4444',
    redSoft:    'rgba(239,68,68,0.12)',
    purple:     '#8B5CF6',
    purpleSoft: 'rgba(139,92,246,0.12)',
    cyan:       '#06B6D4',
    cyanSoft:   'rgba(6,182,212,0.12)',
    pink:       '#EC4899',
    pinkSoft:   'rgba(236,72,153,0.12)',
    // text
    textPri:    '#F0F6FF',
    textSec:    '#8BA3C0',
    textMuted:  '#4A6080',
    // tooltip bg
    tooltipBg:  '#0D1929',
    // chart grid
    grid:       '#1E2D42',
  };

  const light = {
    bg:         '#F0F4FA',
    panel:      '#FFFFFF',
    card:       '#FFFFFF',
    cardHov:    '#F5F8FF',
    border:     '#DDE3EF',
    borderHov:  '#BFCCE0',
    input:      '#F5F7FC',
    // accents identical
    blue:       '#3B82F6',
    blueD:      '#2563EB',
    blueSoft:   'rgba(59,130,246,0.10)',
    blueMid:    'rgba(59,130,246,0.18)',
    green:      '#059669',
    greenSoft:  'rgba(5,150,105,0.10)',
    amber:      '#D97706',
    amberSoft:  'rgba(217,119,6,0.10)',
    red:        '#DC2626',
    redSoft:    'rgba(220,38,38,0.10)',
    purple:     '#7C3AED',
    purpleSoft: 'rgba(124,58,237,0.10)',
    cyan:       '#0891B2',
    cyanSoft:   'rgba(8,145,178,0.10)',
    pink:       '#DB2777',
    pinkSoft:   'rgba(219,39,119,0.10)',
    // text
    textPri:    '#0F1D2E',
    textSec:    '#4A6080',
    textMuted:  '#9AB0C8',
    // tooltip bg
    tooltipBg:  '#FFFFFF',
    // chart grid
    grid:       '#E8EDF5',
  };

  return theme === 'light' ? light : dark;
}

/** Shared accent palette (same in both modes) */
export const PAL = [
  '#3B82F6','#10B981','#8B5CF6','#F59E0B','#06B6D4','#EC4899','#F97316',
];

/** Currency formatter */
export const fmt$ = n =>
  new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 }).format(n ?? 0);

export const fmtK = n => (n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : fmt$(n));

export const fmtN = n => new Intl.NumberFormat('en-US').format(n ?? 0);
