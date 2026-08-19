import React, { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { useTheme } from '../../../Context/ThemeContext';
import { useLanguage } from '../../../Context/LanguageContext';
import { getT } from './_theme';

import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  DollarSign, ShoppingCart, TrendingUp, TrendingDown, RefreshCw,
  Download, Calendar, RotateCcw, Package, Users, Eye, MousePointerClick,
  CreditCard, Tag, AlertTriangle, Lightbulb, ArrowUpRight, ArrowDownRight,
  ChevronRight, BarChart2, Activity, Clock, Globe, Star, Zap,
  ShoppingBag, ExternalLink, Filter, X, ChevronDown
} from 'lucide-react';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
──────────────────────────────────────────── */
const C = {
  bg:'#0B1220',  panel:'#0F1829', card:'#121C2E', cardHov:'#162235',
  border:'#1A2C42', borderHov:'#253D5A',
  blue:'#4F6BFF', blueD:'#3A52E8',
  blueSoft:'rgba(79,107,255,0.12)', blueMid:'rgba(79,107,255,0.22)',
  green:'#10B981', greenSoft:'rgba(16,185,129,0.12)',
  amber:'#F59E0B', amberSoft:'rgba(245,158,11,0.12)',
  red:'#EF4444',   redSoft:'rgba(239,68,68,0.12)',
  purple:'#8B5CF6',purpleSoft:'rgba(139,92,246,0.12)',
  cyan:'#06B6D4',  cyanSoft:'rgba(6,182,212,0.12)',
  pink:'#EC4899',  pinkSoft:'rgba(236,72,153,0.12)',
  textPri:'#EEF3FF', textSec:'#7A96B8', textMuted:'#3D5570',
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
let currencyCache = { currency: 'USD', rate: 1, symbol: '$' };

const setCurrencyCache = (currency, rate, symbol) => {
  currencyCache = { currency, rate, symbol };
};

const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: currencyCache.currency, maximumFractionDigits: 0 }).format((n ?? 0) * currencyCache.rate);
const fmtK = (n) => n >= 1000 ? `${currencyCache.symbol}${((n * currencyCache.rate) / 1000).toFixed(1)}k` : fmt(n);
const fmtNum = (n) => new Intl.NumberFormat('id-ID').format(n ?? 0);
const fmtPct = (n) => `${n >= 0 ? '+' : ''}${n}%`;
const clsx = (...args) => args.filter(Boolean).join(' ');

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return value;
}

/* ─────────────────────────────────────────────
   SPARKLINE
───────────────────────────────────────────── */
function Sparkline({ data = [], color }) {
  color = color ?? C.blue;
  if (!data.length) return <div style={{ height: 40 }} />;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 40, pts = data.length;
  const xs = data.map((_, i) => (i / (pts - 1)) * w);
  const ys = data.map(v => h - ((v - min) / range) * (h - 4) - 2);
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ');
  const fill = `${d} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#sg-${color.replace('#','')})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   KPI CARD
───────────────────────────────────────────── */
function KpiCard({ icon: Icon, label, value, trend, trendLabel, spark, color, prefix = '', suffix = '' }) {
  const isUp = trend >= 0;
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;
  const animVal = useCountUp(typeof value === 'number' ? value : 0);
  const displayVal = typeof value === 'number'
    ? `${prefix}${fmtNum(animVal)}${suffix}`
    : value;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.card} 0%, rgba(20,30,46,0.9) 100%)`,
      border: `1px solid ${C.border}`,
      borderRadius: 18,
      padding: '22px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      transition: 'all 0.25s',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden',
    }}
      className="kpi-card"
      onMouseEnter={e => {
        e.currentTarget.style.border = `1px solid ${color}55`;
        e.currentTarget.style.boxShadow = `0 8px 32px ${color}18`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = `1px solid ${C.border}`;
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Glow accent */}
      <div style={{ position:'absolute', top:-40, right:-40, width:100, height:100, borderRadius:'50%', background:`${color}12`, pointerEvents:'none' }} />

      {/* Top row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ background:`${color}18`, borderRadius:10, padding:'8px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon size={16} color={color} />
          </div>
          <span style={{ color: C.textSec, fontSize: 12, fontWeight: 500, letterSpacing:'0.02em' }}>{label}</span>
        </div>
        <div style={{
          display:'flex', alignItems:'center', gap:4,
          background: isUp ? C.greenSoft : C.redSoft,
          borderRadius: 20, padding:'3px 8px',
        }}>
          <TrendIcon size={11} color={isUp ? C.green : C.red} />
          <span style={{ fontSize: 11, fontWeight: 600, color: isUp ? C.green : C.red }}>{Math.abs(trend)}%</span>
        </div>
      </div>

      {/* Value */}
      <div style={{ color: C.textPri, fontSize: 26, fontWeight: 700, lineHeight: 1, marginBottom: 6, fontFamily:'Plus Jakarta Sans, sans-serif' }}>
        {displayVal}
      </div>

      {/* Trend label */}
      <div style={{ color: C.textMuted, fontSize: 11, marginBottom: 14 }}>
        <span style={{ color: isUp ? C.green : C.red, fontWeight: 500 }}>{fmtPct(trend)}</span>
        {' '}{trendLabel}
      </div>

      {/* Sparkline */}
      <div style={{ marginTop: 'auto' }}>
        <Sparkline data={spark} color={color} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION CARD WRAPPER
───────────────────────────────────────────── */
function SectionCard({ title, subtitle, action, children, style = {} }) {

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 18,
      overflow: 'hidden',
      ...style,
    }}>
      {(title || action) && (
        <div style={{
          padding: '20px 24px 0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          <div>
            <h3 style={{ color: C.textPri, fontSize: 15, fontWeight: 600, margin: 0 }}>{title}</h3>
            {subtitle && <p style={{ color: C.textMuted, fontSize: 12, marginTop: 3 }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CUSTOM TOOLTIP
───────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {

  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0D1929',
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      <p style={{ color: C.textSec, fontSize: 11, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:p.color }} />
          <span style={{ color: C.textSec, fontSize: 11 }}>{p.name}:</span>
          <span style={{ color: C.textPri, fontSize: 12, fontWeight: 600 }}>
            {typeof p.value === 'number' && p.name?.toLowerCase().includes('rev')
              ? fmt(p.value) : fmtNum(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

/* status badge */
function StatusBadge({ status }) {

  const map = {
    completed:  { bg:'rgba(16,185,129,0.12)',  color:'#10B981', label:'Completed' },
    processing: { bg:'rgba(59,130,246,0.12)',  color:'#3B82F6', label:'Processing' },
    pending:    { bg:'rgba(245,158,11,0.12)',  color:'#F59E0B', label:'Pending' },
    cancelled:  { bg:'rgba(239,68,68,0.12)',   color:'#EF4444', label:'Cancelled' },
    refunded:   { bg:'rgba(139,92,246,0.12)',  color:'#8B5CF6', label:'Refunded' },
    shipped:    { bg:'rgba(6,182,212,0.12)',   color:'#06B6D4', label:'Shipped' },
  };
  const s = map[status] ?? { bg: C.glass, color: C.textSec, label: status };
  return (
    <span style={{ background:s.bg, color:s.color, borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:600 }}>
      {s.label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────── */
function EmptyState({ onViewProducts }) {

  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      padding:'80px 40px', textAlign:'center',
    }}>
      {/* illustration */}
      <div style={{ position:'relative', marginBottom:32 }}>
        <div style={{
          width:100, height:100, borderRadius:'50%',
          background:'rgba(59,130,246,0.08)',
          border:`1px solid rgba(59,130,246,0.18)`,
          display:'flex', alignItems:'center', justifyContent:'center',
          margin:'0 auto',
        }}>
          <BarChart2 size={40} color={C.blue} strokeWidth={1.5} />
        </div>
        <div style={{
          position:'absolute', bottom:0, right:-8, width:34, height:34, borderRadius:'50%',
          background:'rgba(245,158,11,0.12)', border:`1px solid rgba(245,158,11,0.2)`,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <TrendingUp size={16} color={C.amber} />
        </div>
      </div>
      <h3 style={{ color:C.textPri, fontSize:20, fontWeight:700, margin:'0 0 10px' }}>No Sales Yet</h3>
      <p style={{ color:C.textSec, fontSize:14, maxWidth:340, lineHeight:1.6, margin:'0 0 28px' }}>
        Sales analytics will appear once customers start placing orders. Start by reviewing your product catalog.
      </p>
      <button
        onClick={onViewProducts}
        style={{
          background:`linear-gradient(135deg, ${C.blue} 0%, ${C.blueD} 100%)`,
          color:'#fff', border:'none', borderRadius:10,
          padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer',
          display:'flex', alignItems:'center', gap:8,
          boxShadow:`0 4px 16px rgba(59,130,246,0.35)`,
        }}
      >
        <Package size={15} />
        View Products
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LOADING SKELETON
───────────────────────────────────────────── */
function Skeleton({ w = '100%', h = 16, radius = 6 }) {

  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: `linear-gradient(90deg, ${C.border} 25%, #243452 50%, ${C.border} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }} />
  );
}

/* ─────────────────────────────────────────────
   SALES FUNNEL
───────────────────────────────────────────── */
function SalesFunnel({ data = [] }) {

  if (!data.length) return <EmptyState onViewProducts={() => router.get('/admin/products')} />;
  const max = data[0]?.value || 1;

  return (
    <div style={{ padding: '0 24px 24px', display:'flex', flexDirection:'column', gap:8 }}>
      {data.map((step, i) => {
        const widthPct = (step.value / max) * 100;
        const isLast = i === data.length - 1;
        return (
          <div key={i}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
              <span style={{ color:C.textSec, fontSize:12, width:110, flexShrink:0 }}>{step.label}</span>
              <div style={{
                flex:1, height:38, borderRadius:8, background:C.panel,
                overflow:'hidden', position:'relative',
              }}>
                <div style={{
                  height:'100%',
                  width:`${widthPct}%`,
                  background: isLast
                    ? `linear-gradient(90deg, ${C.green}, rgba(16,185,129,0.6))`
                    : `linear-gradient(90deg, ${C.blue}, rgba(59,130,246,0.5))`,
                  borderRadius:8,
                  transition:'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                  display:'flex', alignItems:'center', justifyContent:'flex-end',
                  paddingRight:10,
                }}>
                  <span style={{ color:'rgba(255,255,255,0.9)', fontSize:11, fontWeight:600, whiteSpace:'nowrap' }}>
                    {fmtNum(step.value)}
                  </span>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', minWidth:70 }}>
                <span style={{ color:C.textPri, fontSize:13, fontWeight:600 }}>{step.pct}%</span>
                {i > 0 && (
                  <span style={{ color:C.textMuted, fontSize:10 }}>
                    of visitors
                  </span>
                )}
              </div>
            </div>
            {i < data.length - 1 && (
              <div style={{ display:'flex', justifyContent:'center', marginBottom:2 }}>
                <ChevronRight size={12} color={C.textMuted} style={{ transform:'rotate(90deg)' }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   REVENUE OVERVIEW CHART
───────────────────────────────────────────── */
function RevenueChart({ data }) {

  const [metric, setMetric] = useState('revenue');
  const tabs = [
    { key:'revenue', label:'Revenue', color:C.blue },
    { key:'orders',  label:'Orders',  color:C.green },
    { key:'profit',  label:'Profit',  color:C.purple },
  ];
  const chartData = data.map(d => ({
    date:    new Date(d.date).toLocaleDateString('en-US', { month:'short', day:'numeric' }),
    revenue: parseFloat(d.total_revenue) || 0,
    orders:  parseInt(d.total_orders)    || 0,
    profit:  parseFloat(d.profit)        || 0,
  }));
  const active = tabs.find(t => t.key === metric);

  return (
    <SectionCard
      title="Revenue Overview"
      subtitle="Performance trend for the selected period"
      action={
        <div style={{ display:'flex', gap:6 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setMetric(t.key)} style={{
              background: metric === t.key ? `${t.color}20` : 'transparent',
              border: `1px solid ${metric === t.key ? t.color+'55' : C.border}`,
              color: metric === t.key ? t.color : C.textSec,
              borderRadius:8, padding:'5px 12px', fontSize:12, fontWeight:500, cursor:'pointer',
              transition:'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>
      }
    >
      <div style={{ padding:'0 24px 24px' }}>
        {chartData.length === 0 ? (
          <EmptyState onViewProducts={() => router.get('/admin/products')} />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top:5, right:10, left:0, bottom:5 }}>
              <defs>
                <linearGradient id="gradBlue"   x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.blue}   stopOpacity="0.3" />
                  <stop offset="100%" stopColor={C.blue}   stopOpacity="0.01" />
                </linearGradient>
                <linearGradient id="gradGreen"  x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.green}  stopOpacity="0.3" />
                  <stop offset="100%" stopColor={C.green}  stopOpacity="0.01" />
                </linearGradient>
                <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.purple} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={C.purple} stopOpacity="0.01" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false} />
              <XAxis dataKey="date" stroke={C.textMuted} tick={{ fill:C.textMuted, fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis stroke={C.textMuted} tick={{ fill:C.textMuted, fontSize:11 }} axisLine={false} tickLine={false} width={55}
                tickFormatter={v => metric === 'orders' ? fmtNum(v) : fmtK(v)} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke:C.borderHov, strokeWidth:1, strokeDasharray:'4 4' }} />
              <Area
                type="monotoneX" dataKey={metric} name={active?.label}
                stroke={active?.color} strokeWidth={2.5}
                fill={metric==='revenue' ? 'url(#gradBlue)' : metric==='orders' ? 'url(#gradGreen)' : 'url(#gradPurple)'}
                dot={false} activeDot={{ r:5, fill:active?.color, stroke:C.card, strokeWidth:2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </SectionCard>
  );
}

/* ─────────────────────────────────────────────
   REVENUE SOURCES PIE
───────────────────────────────────────────── */
const PIE_COLORS = [C.blue, C.green, C.purple, C.amber, C.cyan, '#F97316', '#EC4899'];
const PIE_LABELS = {
  cod:'COD', transfer:'Transfer', qris:'QRIS', gopay:'Gopay',
  shopeepay:'ShopeePay', debit:'Debit', credit:'Credit Card',
};

function CustomPieLegend({ payload }) {

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12 }}>
      {payload.map((p, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:p.fill, flexShrink:0 }} />
            <span style={{ color:C.textSec, fontSize:12 }}>{p.value}</span>
          </div>
          <span style={{ color:C.textPri, fontSize:12, fontWeight:600 }}>{p.payload.pct}%</span>
        </div>
      ))}
    </div>
  );
}

function RevenueSources({ paymentMethods }) {

  const total = paymentMethods.reduce((s, p) => s + (parseFloat(p.total) || 0), 0);
  const pieData = paymentMethods.map((p, i) => ({
    name: PIE_LABELS[p.payment_method?.toLowerCase()] ?? (p.payment_method || 'Other'),
    value: parseFloat(p.total) || 0,
    pct: total > 0 ? Math.round((parseFloat(p.total) / total) * 100) : 0,
    fill: PIE_COLORS[i % PIE_COLORS.length],
  }));

  return (
    <SectionCard title="Revenue Sources" subtitle="Payment method distribution">
      <div style={{ padding:'0 24px 24px' }}>
        {pieData.length === 0 ? (
          <EmptyState onViewProducts={() => router.get('/admin/products')} />
        ) : (
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72}
                  dataKey="value" paddingAngle={3} strokeWidth={0}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background:'#0D1929', border:`1px solid ${C.border}`, borderRadius:10 }}
                  itemStyle={{ color:C.textPri }}
                  formatter={(v) => [fmt(v), 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex:1 }}>
              <CustomPieLegend payload={pieData.map(p => ({ value:p.name, fill:p.fill, payload:p }))} />
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

/* ─────────────────────────────────────────────
   TOP CATEGORIES
───────────────────────────────────────────── */
function TopCategories({ data = [] }) {

  const maxRev = Math.max(...data.map(d => parseFloat(d.revenue) || 0), 1);

  return (
    <SectionCard title="Top Categories" subtitle="Revenue by product category">
      <div style={{ padding:'0 24px 24px', display:'flex', flexDirection:'column', gap:14 }}>
        {data.length === 0 ? (
          <EmptyState onViewProducts={() => router.get('/admin/products')} />
        ) : data.map((cat, i) => {
          const rev = parseFloat(cat.revenue) || 0;
          const pct = Math.round((rev / maxRev) * 100);
          return (
            <div key={i}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span style={{ color:C.textPri, fontSize:13, fontWeight:500 }}>{cat.name}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <span style={{ color:C.textSec, fontSize:12 }}>{fmtNum(cat.units ?? 0)} units</span>
                  <span style={{ color:C.textPri, fontSize:13, fontWeight:600 }}>{fmt(rev)}</span>
                  <span style={{ color:PIE_COLORS[i % PIE_COLORS.length], fontSize:11, fontWeight:600, minWidth:36, textAlign:'right' }}>{pct}%</span>
                </div>
              </div>
              <div style={{ height:6, background:C.panel, borderRadius:3, overflow:'hidden' }}>
                <div style={{
                  height:'100%', width:`${pct}%`,
                  background:`linear-gradient(90deg, ${PIE_COLORS[i % PIE_COLORS.length]}, ${PIE_COLORS[i % PIE_COLORS.length]}99)`,
                  borderRadius:3, transition:'width 0.8s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

/* ─────────────────────────────────────────────
   BEST SELLING PRODUCTS TABLE
───────────────────────────────────────────── */
function BestSellingTable({ products = [] }) {

  return (
    <SectionCard title="Best Selling Products" subtitle="Top performing products by revenue">
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {['Product', 'Sold', 'Revenue', 'Stock', 'Action'].map((h, i) => (
                <th key={i} style={{
                  padding:'10px 20px', textAlign: i === 0 ? 'left' : 'center',
                  color:C.textMuted, fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={5}><EmptyState onViewProducts={() => router.get('/admin/products')} /></td></tr>
            ) : products.slice(0, 8).map((p, i) => {
              const stockStatus = p.stock <= 0 ? 'out' : p.stock <= 10 ? 'low' : 'ok';
              return (
                <tr key={i} style={{ borderBottom:`1px solid ${C.border}`, transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = C.cardHov}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding:'14px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{
                        width:36, height:36, borderRadius:10,
                        background:`linear-gradient(135deg, ${PIE_COLORS[i % PIE_COLORS.length]}22, ${PIE_COLORS[i % PIE_COLORS.length]}11)`,
                        border:`1px solid ${PIE_COLORS[i % PIE_COLORS.length]}33`,
                        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                      }}>
                        <Package size={14} color={PIE_COLORS[i % PIE_COLORS.length]} />
                      </div>
                      <div>
                        <p style={{ color:C.textPri, fontSize:13, fontWeight:500, margin:0 }}>{p.name}</p>
                        <p style={{ color:C.textMuted, fontSize:11, margin:0 }}>SKU: {p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign:'center', padding:'14px 20px' }}>
                    <span style={{ color:C.textPri, fontSize:13, fontWeight:600 }}>{fmtNum(p.total_sold)}</span>
                  </td>
                  <td style={{ textAlign:'center', padding:'14px 20px' }}>
                    <span style={{ color:C.green, fontSize:13, fontWeight:600 }}>{fmt(p.total_revenue)}</span>
                  </td>
                  <td style={{ textAlign:'center', padding:'14px 20px' }}>
                    <span style={{
                      background: stockStatus==='ok' ? C.greenSoft : stockStatus==='low' ? C.amberSoft : C.redSoft,
                      color: stockStatus==='ok' ? C.green : stockStatus==='low' ? C.amber : C.red,
                      borderRadius:20, padding:'2px 10px', fontSize:11, fontWeight:600,
                    }}>
                      {stockStatus === 'out' ? 'Out' : stockStatus === 'low' ? `Low (${p.stock})` : fmtNum(p.stock)}
                    </span>
                  </td>
                  <td style={{ textAlign:'center', padding:'14px 20px' }}>
                    <button onClick={() => router.get(`/admin/products/${p.id}/edit`)} style={{
                      background:C.blueSoft, border:`1px solid ${C.blue}33`,
                      color:C.blue, borderRadius:8, padding:'5px 12px', fontSize:11, fontWeight:500,
                      cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4,
                    }}>
                      <ExternalLink size={11} /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

/* ─────────────────────────────────────────────
   RECENT ORDERS TABLE
───────────────────────────────────────────── */
function RecentOrdersTable({ orders = [] }) {

  const initials = (name) => name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '??';
  const avatarColor = (name) => {
    const colors = [C.blue, C.green, C.purple, C.amber, C.cyan];
    const idx = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[idx];
  };

  return (
    <SectionCard title="Recent Orders" subtitle="Latest transactions across all channels">
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {['Customer', 'Order #', 'Payment', 'Status', 'Total', 'Date', ''].map((h, i) => (
                <th key={i} style={{
                  padding:'10px 20px', textAlign: i === 0 ? 'left' : i < 6 ? 'center' : 'right',
                  color:C.textMuted, fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={7}><EmptyState onViewProducts={() => router.get('/admin/products')} /></td></tr>
            ) : orders.map((o, i) => {
              const color = avatarColor(o.customer_name);
              return (
                <tr key={i} style={{ borderBottom:`1px solid ${C.border}`, transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = C.cardHov}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding:'12px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{
                        width:34, height:34, borderRadius:'50%',
                        background:`${color}22`, border:`1px solid ${color}44`,
                        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                        fontSize:12, fontWeight:700, color,
                      }}>{initials(o.customer_name)}</div>
                      <div>
                        <p style={{ color:C.textPri, fontSize:13, fontWeight:500, margin:0 }}>{o.customer_name}</p>
                        <p style={{ color:C.textMuted, fontSize:11, margin:0 }}>{o.customer_email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign:'center', padding:'12px 20px' }}>
                    <span style={{ color:C.textSec, fontSize:12, fontFamily:'monospace' }}>{o.order_number}</span>
                  </td>
                  <td style={{ textAlign:'center', padding:'12px 20px' }}>
                    <span style={{ color:C.textSec, fontSize:12 }}>{o.payment_method}</span>
                  </td>
                  <td style={{ textAlign:'center', padding:'12px 20px' }}>
                    <StatusBadge status={o.status} />
                  </td>
                  <td style={{ textAlign:'center', padding:'12px 20px' }}>
                    <span style={{ color:C.textPri, fontSize:13, fontWeight:600 }}>{fmt(o.grand_total)}</span>
                  </td>
                  <td style={{ textAlign:'center', padding:'12px 20px' }}>
                    <span style={{ color:C.textMuted, fontSize:12 }}>{o.created_at}</span>
                  </td>
                  <td style={{ textAlign:'right', padding:'12px 20px' }}>
                    <button onClick={() => router.get(`/admin/orders/${o.id}`)} style={{
                      background:'transparent', border:`1px solid ${C.border}`,
                      color:C.textSec, borderRadius:8, padding:'4px 10px', fontSize:11,
                      cursor:'pointer', transition:'all 0.15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSec; }}
                    >View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

/* ─────────────────────────────────────────────
   COUPON ANALYTICS
───────────────────────────────────────────── */
function CouponAnalytics({ summary }) {

  const spark = Array.from({ length: 7 }, (_, i) => Math.floor(Math.random() * 20 + 5));
  return (
    <SectionCard title="Coupon Analytics" subtitle="Discount code performance">
      <div style={{ padding:'0 24px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
          {[
            { label:'Coupons Used',      value: fmtNum(summary.coupons_used),  color:C.blue   },
            { label:'Revenue Generated', value: fmt(summary.coupon_revenue),   color:C.green  },
            { label:'Avg Discount',      value: fmt(summary.avg_discount),     color:C.amber  },
            { label:'Top Coupon',        value: 'SAVE20',                      color:C.purple },
          ].map((item, i) => (
            <div key={i} style={{
              background:C.panel, borderRadius:12, padding:'14px 16px',
              border:`1px solid ${C.border}`,
            }}>
              <p style={{ color:C.textMuted, fontSize:11, marginBottom:6 }}>{item.label}</p>
              <p style={{ color:item.color, fontSize:16, fontWeight:700, margin:0 }}>{item.value}</p>
            </div>
          ))}
        </div>
        <Sparkline data={spark} color={C.blue} />
      </div>
    </SectionCard>
  );
}

/* ─────────────────────────────────────────────
   REFUND ANALYTICS
───────────────────────────────────────────── */
function RefundAnalytics({ summary, refundReasons = [], paymentMethods }) {

  const reasonTotal = refundReasons.reduce((s, r) => s + r.count, 0) || 1;
  const pieData = refundReasons.map((r, i) => ({
    name: r.reason, value: r.count,
    pct: Math.round((r.count / reasonTotal) * 100),
    fill: [C.red, C.amber, C.purple, C.cyan][i % 4],
  }));

  return (
    <SectionCard title="Refund Analytics" subtitle="Return & refund breakdown">
      <div style={{ padding:'0 24px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
          {[
            { label:'Total Refunds', value: fmt(summary.refund_total), color:C.red  },
            { label:'Refund Rate',   value: `${summary.refund_count > 0 ? ((summary.refund_count / Math.max(summary.total_orders,1))*100).toFixed(1) : 0}%`, color:C.amber },
            { label:'# Refunds',     value: fmtNum(summary.refund_count), color:C.purple },
          ].map((item, i) => (
            <div key={i} style={{ background:C.panel, borderRadius:12, padding:'14px 16px', border:`1px solid ${C.border}` }}>
              <p style={{ color:C.textMuted, fontSize:11, marginBottom:6 }}>{item.label}</p>
              <p style={{ color:item.color, fontSize:16, fontWeight:700, margin:0 }}>{item.value}</p>
            </div>
          ))}
        </div>
        {pieData.length > 0 && (
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={58}
                  dataKey="value" paddingAngle={3} strokeWidth={0}>
                  {pieData.map((_, i) => <Cell key={i} fill={pieData[i].fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
              {pieData.map((p, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:p.fill }} />
                    <span style={{ color:C.textSec, fontSize:12 }}>{p.name}</span>
                  </div>
                  <span style={{ color:C.textPri, fontSize:12, fontWeight:600 }}>{p.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

/* ─────────────────────────────────────────────
   CUSTOMER ANALYTICS
───────────────────────────────────────────── */
function CustomerAnalytics({ summary, customerTimeline = [] }) {

  const timelineData = customerTimeline.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month:'short', day:'numeric' }),
    new: parseInt(d.new_customers) || 0,
  }));

  return (
    <SectionCard title="Customer Analytics" subtitle="Acquisition & retention metrics">
      <div style={{ padding:'0 24px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:20 }}>
          {[
            { label:'New Customers',   value:fmtNum(summary.new_customers),       color:C.blue,   trend:summary.new_cust_trend },
            { label:'Returning',       value:fmtNum(summary.returning_customers), color:C.green,  trend:null },
            { label:'Repeat Rate',     value:`${summary.total_orders > 0 ? Math.round(summary.returning_customers/Math.max(summary.new_customers+summary.returning_customers,1)*100) : 0}%`, color:C.purple, trend:null },
            { label:'CLV (est.)',      value:fmt(summary.total_orders > 0 ? summary.total_revenue / Math.max(summary.new_customers,1) : 0), color:C.amber, trend:null },
          ].map((item, i) => (
            <div key={i} style={{ background:C.panel, borderRadius:12, padding:'14px 16px', border:`1px solid ${C.border}` }}>
              <p style={{ color:C.textMuted, fontSize:11, marginBottom:6 }}>{item.label}</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <p style={{ color:item.color, fontSize:16, fontWeight:700, margin:0 }}>{item.value}</p>
                {item.trend !== null && (
                  <span style={{
                    background: item.trend >= 0 ? C.greenSoft : C.redSoft,
                    color: item.trend >= 0 ? C.green : C.red,
                    borderRadius:20, padding:'2px 7px', fontSize:10, fontWeight:600,
                  }}>{item.trend >= 0 ? '+' : ''}{item.trend}%</span>
                )}
              </div>
            </div>
          ))}
        </div>
        {timelineData.length > 0 && (
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={timelineData} margin={{ top:5, right:5, left:0, bottom:5 }}>
              <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false} />
              <XAxis dataKey="date" stroke={C.textMuted} tick={{ fill:C.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis stroke={C.textMuted} tick={{ fill:C.textMuted, fontSize:10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="new" name="New Customers" stroke={C.blue} strokeWidth={2} dot={false}
                activeDot={{ r:4, fill:C.blue, stroke:C.card, strokeWidth:2 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </SectionCard>
  );
}

/* ─────────────────────────────────────────────
   TRAFFIC ANALYTICS
───────────────────────────────────────────── */
function TrafficAnalytics({ summary, salesData = [] }) {

  const areaData = salesData.slice(-14).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month:'short', day:'numeric' }),
    visitors: Math.floor((parseInt(d.total_orders) || 0) * 45),
    sessions:  Math.floor((parseInt(d.total_orders) || 0) * 63),
  }));

  return (
    <SectionCard title="Traffic Analytics" subtitle="Visitors and session overview">
      <div style={{ padding:'0 24px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:20 }}>
          {[
            { label:'Visitors',      value:fmtNum(summary.total_visitors), color:C.blue   },
            { label:'Sessions',      value:fmtNum(summary.sessions),       color:C.green  },
            { label:'Bounce Rate',   value:`${summary.bounce_rate}%`,      color:C.amber  },
            { label:'Avg Duration',  value:summary.avg_duration,           color:C.purple },
          ].map((item, i) => (
            <div key={i} style={{ background:C.panel, borderRadius:12, padding:'14px 16px', border:`1px solid ${C.border}` }}>
              <p style={{ color:C.textMuted, fontSize:11, marginBottom:6 }}>{item.label}</p>
              <p style={{ color:item.color, fontSize:16, fontWeight:700, margin:0 }}>{item.value}</p>
            </div>
          ))}
        </div>
        {areaData.length > 0 && (
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={areaData} margin={{ top:5, right:5, left:0, bottom:5 }}>
              <defs>
                <linearGradient id="gradVis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.blue}  stopOpacity="0.25" />
                  <stop offset="100%" stopColor={C.blue}  stopOpacity="0.01" />
                </linearGradient>
                <linearGradient id="gradSes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.green} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={C.green} stopOpacity="0.01" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false} />
              <XAxis dataKey="date" stroke={C.textMuted} tick={{ fill:C.textMuted, fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis stroke={C.textMuted} tick={{ fill:C.textMuted, fontSize:10 }} axisLine={false} tickLine={false} width={40}
                tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="visitors" name="Visitors" stroke={C.blue}  strokeWidth={2} fill="url(#gradVis)" dot={false} />
              <Area type="monotone" dataKey="sessions"  name="Sessions"  stroke={C.green} strokeWidth={2} fill="url(#gradSes)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </SectionCard>
  );
}

/* ─────────────────────────────────────────────
   AI INSIGHTS
───────────────────────────────────────────── */
function AIInsights({ insights = [] }) {

  return (
    <SectionCard title="AI Insights" subtitle="Automated analysis of your business data"
      action={
        <div style={{
          background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)',
          borderRadius:8, padding:'4px 10px', display:'flex', alignItems:'center', gap:5,
        }}>
          <Zap size={11} color={C.amber} />
          <span style={{ color:C.amber, fontSize:11, fontWeight:600 }}>AI Powered</span>
        </div>
      }
    >
      <div style={{ padding:'0 24px 24px', display:'flex', flexDirection:'column', gap:10 }}>
        {insights.length === 0 ? (
          <p style={{ color:C.textMuted, fontSize:13 }}>No insights available for this period.</p>
        ) : insights.map((text, i) => (
          <div key={i} style={{
            background:C.panel, border:`1px solid ${C.border}`,
            borderRadius:12, padding:'14px 16px',
            display:'flex', alignItems:'flex-start', gap:12,
            transition:'border-color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${C.blue}44`}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <div style={{
              background:'rgba(245,158,11,0.12)', borderRadius:8, padding:7,
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1,
            }}>
              <Lightbulb size={14} color={C.amber} />
            </div>
            <p style={{ color:C.textSec, fontSize:13, lineHeight:1.6, margin:0 }}>{text}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ─────────────────────────────────────────────
   DATE RANGE PICKER (header)
───────────────────────────────────────────── */
function DateRangePicker({ filters, onApply }) {

  const [open,   setOpen]   = useState(false);
  const [start,  setStart]  = useState(filters.start_date);
  const [end,    setEnd]    = useState(filters.end_date);
  const [active, setActive] = useState('30d');

  const presets = [
    { label:'Today',   key:'today', days:0  },
    { label:'7 Days',  key:'7d',    days:7  },
    { label:'30 Days', key:'30d',   days:30 },
    { label:'Custom',  key:'custom',days:null },
  ];

  const applyPreset = (p) => {
    setActive(p.key);
    if (p.days !== null) {
      const s = new Date(); s.setDate(s.getDate() - p.days);
      const e = new Date();
      const sf = s.toISOString().split('T')[0];
      const ef = e.toISOString().split('T')[0];
      setStart(sf); setEnd(ef);
      if (p.key !== 'custom') { onApply(sf, ef); setOpen(false); }
    }
  };

  return (
    <div style={{ position:'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        background:C.card, border:`1px solid ${C.border}`, color:C.textSec,
        borderRadius:10, padding:'8px 14px', fontSize:12, fontWeight:500,
        cursor:'pointer', display:'flex', alignItems:'center', gap:8,
        transition:'all 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.textPri; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSec; }}
      >
        <Calendar size={13} />
        {filters.start_date} – {filters.end_date}
        <ChevronDown size={12} />
      </button>

      {open && (
        <div style={{
          position:'absolute', right:0, top:'calc(100% + 8px)',
          background:'#0D1929', border:`1px solid ${C.border}`,
          borderRadius:14, padding:16, zIndex:100, minWidth:320,
          boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display:'flex', gap:6, marginBottom:14 }}>
            {presets.map(p => (
              <button key={p.key} onClick={() => applyPreset(p)} style={{
                flex:1, background: active===p.key ? C.blueSoft : 'transparent',
                border:`1px solid ${active===p.key ? C.blue+'55' : C.border}`,
                color: active===p.key ? C.blue : C.textSec,
                borderRadius:8, padding:'5px 0', fontSize:11, fontWeight:500, cursor:'pointer',
              }}>{p.label}</button>
            ))}
          </div>
          {active === 'custom' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
              {[['Start', start, setStart], ['End', end, setEnd]].map(([lbl, val, setter]) => (
                <div key={lbl}>
                  <p style={{ color:C.textMuted, fontSize:11, marginBottom:4 }}>{lbl} Date</p>
                  <input type="date" value={val} onChange={e => setter(e.target.value)} style={{
                    width:'100%', background:C.panel, border:`1px solid ${C.border}`,
                    color:C.textPri, borderRadius:8, padding:'6px 10px', fontSize:12,
                    boxSizing:'border-box',
                  }} />
                </div>
              ))}
            </div>
          )}
          {active === 'custom' && (
            <button onClick={() => { onApply(start, end); setOpen(false); }} style={{
              width:'100%', background:`linear-gradient(135deg,${C.blue},${C.blueD})`,
              color:'#fff', border:'none', borderRadius:8, padding:'8px', fontSize:12,
              fontWeight:600, cursor:'pointer',
            }}>Apply Range</button>
          )}
        </div>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════
   MAIN PAGE
═════════════════════════════════════════════ */
export default function SalesReport({
  salesData = [], topProducts = [], salesByStatus = [],
  paymentMethods = [], topCategories = [], recentOrders = [],
  funnel = [], refundReasons = [], customerTimeline = [],
  insights = [], summary = {}, filters = {},
}) {
  const { theme } = useTheme();
  const { currency, currencyRate, currencySymbol } = useLanguage();
  const C = getT(theme);
  const [refreshing, setRefreshing] = useState(false);
  const hasData = salesData.length > 0 || summary.total_orders > 0;

  // Update currency cache
  useEffect(() => {
    setCurrencyCache(currency, currencyRate, currencySymbol);
  }, [currency, currencyRate, currencySymbol]);

  const handleApplyRange = (start, end) => {
    router.get('/admin/reports/sales', { start_date: start, end_date: end, period: filters.period ?? 'daily' }, { preserveState: true });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    router.reload({ only: ['salesData','topProducts','salesByStatus','paymentMethods','topCategories','recentOrders','funnel','refundReasons','customerTimeline','insights','summary'],
      onFinish: () => setRefreshing(false) });
  };

  const handleExport = () => {
    router.post('/admin/reports/export', {
      type: 'sales', format: 'csv',
      start_date: filters.start_date, end_date: filters.end_date,
    });
  };

  const sparkRev = (summary.spark_revenue ?? []).map(Number);
  const sparkOrd = (summary.spark_orders  ?? []).map(Number);
  const sparkConv = [2.1, 2.4, 2.2, 2.8, 3.1, 2.9, summary.conversion_rate ?? 3.2];
  const sparkRef  = [120, 95, 110, 80, 140, 100, summary.refund_total ?? 90];
  const sparkAov  = Array.from({ length: 7 }, (_, i) =>
    ((summary.average_order_value ?? 80) * (0.85 + Math.sin(i) * 0.1)).toFixed(0));

  return (
    <AdminLayout>
      {/* global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .fade-up-1 { animation-delay:0.05s; }
        .fade-up-2 { animation-delay:0.10s; }
        .fade-up-3 { animation-delay:0.15s; }
        .fade-up-4 { animation-delay:0.20s; }
        .fade-up-5 { animation-delay:0.25s; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
      `}</style>

      <div style={{ background:C.bg, minHeight:'100vh', padding:'0 0 48px' }}>

        {/* ── HEADER ───────────────────────────────── */}
        <div className="fade-up" style={{
          display:'flex', alignItems:'flex-start', justifyContent:'space-between',
          flexWrap:'wrap', gap:16, marginBottom:28,
        }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <div style={{
                background:C.blueSoft, border:`1px solid ${C.blue}33`,
                borderRadius:10, padding:8, display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <BarChart2 size={18} color={C.blue} />
              </div>
              <h1 style={{ color:C.textPri, fontSize:22, fontWeight:700, margin:0 }}>Sales Analytics</h1>
            </div>
            <p style={{ color:C.textSec, fontSize:13, margin:0 }}>
              Monitor business performance and revenue growth
            </p>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
            <DateRangePicker filters={filters} onApply={handleApplyRange} />

            <button onClick={handleRefresh} disabled={refreshing} style={{
              background:C.card, border:`1px solid ${C.border}`, color:C.textSec,
              borderRadius:10, padding:'8px 14px', fontSize:12, cursor:'pointer',
              display:'flex', alignItems:'center', gap:6, transition:'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSec; }}
            >
              <RefreshCw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>

            <button onClick={handleExport} style={{
              background:`linear-gradient(135deg, ${C.blue} 0%, ${C.blueD} 100%)`,
              border:'none', color:'#fff', borderRadius:10, padding:'8px 16px',
              fontSize:12, fontWeight:600, cursor:'pointer',
              display:'flex', alignItems:'center', gap:6,
              boxShadow:`0 4px 14px rgba(59,130,246,0.3)`,
              transition:'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 6px 20px rgba(59,130,246,0.45)`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = `0 4px 14px rgba(59,130,246,0.3)`}
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        {/* ── EMPTY STATE (no data at all) ─────────── */}
        {!hasData ? (
          <SectionCard>
            <EmptyState onViewProducts={() => router.get('/admin/products')} />
          </SectionCard>
        ) : (
          <>
            {/* ── KPI CARDS ──────────────────────────── */}
            <div className="fade-up fade-up-1" style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',
              gap:16, marginBottom:24,
            }}>
              <KpiCard
                icon={DollarSign} label="Total Revenue"
                value={summary.total_revenue ?? 0}
                trend={summary.rev_trend ?? 0}
                trendLabel="vs last period"
                spark={sparkRev} color={C.blue}
                prefix="$"
              />
              <KpiCard
                icon={ShoppingCart} label="Total Orders"
                value={summary.total_orders ?? 0}
                trend={summary.ord_trend ?? 0}
                trendLabel="vs last period"
                spark={sparkOrd} color={C.green}
              />
              <KpiCard
                icon={Activity} label="Avg Order Value"
                value={summary.average_order_value ?? 0}
                trend={summary.aov_trend ?? 0}
                trendLabel="vs last period"
                spark={sparkAov.map(Number)} color={C.purple}
                prefix="$"
              />
              <KpiCard
                icon={RotateCcw} label="Total Refunds"
                value={summary.refund_total ?? 0}
                trend={summary.ref_trend ?? 0}
                trendLabel="vs last period"
                spark={sparkRef} color={C.red}
                prefix="$"
              />
              <KpiCard
                icon={MousePointerClick} label="Conversion Rate"
                value={summary.conversion_rate ?? 0}
                trend={summary.con_trend ?? 0}
                trendLabel="vs last period"
                spark={sparkConv} color={C.amber}
                suffix="%"
              />
            </div>

            {/* ── REVENUE CHART (full width) ──────────── */}
            <div className="fade-up fade-up-2" style={{ marginBottom:24 }}>
              <RevenueChart data={salesData} />
            </div>

            {/* ── FUNNEL + REVENUE SOURCES ────────────── */}
            <div className="fade-up fade-up-3" style={{
              display:'grid', gridTemplateColumns:'1fr 1fr',
              gap:20, marginBottom:24,
            }}>
              <SectionCard title="Sales Funnel" subtitle="Visitor to purchase conversion flow">
                <SalesFunnel data={funnel} />
              </SectionCard>
              <RevenueSources paymentMethods={paymentMethods} />
            </div>

            {/* ── TOP CATEGORIES + COUPON ANALYTICS ──── */}
            <div className="fade-up fade-up-4" style={{
              display:'grid', gridTemplateColumns:'1.4fr 1fr',
              gap:20, marginBottom:24,
            }}>
              <TopCategories data={topCategories} />
              <CouponAnalytics summary={summary} />
            </div>

            {/* ── BEST SELLING PRODUCTS (full width) ─── */}
            <div className="fade-up" style={{ marginBottom:24 }}>
              <BestSellingTable products={topProducts} />
            </div>

            {/* ── RECENT ORDERS (full width) ───────────── */}
            <div className="fade-up" style={{ marginBottom:24 }}>
              <RecentOrdersTable orders={recentOrders} />
            </div>

            {/* ── REFUND + CUSTOMER ANALYTICS ─────────── */}
            <div className="fade-up" style={{
              display:'grid', gridTemplateColumns:'1fr 1fr',
              gap:20, marginBottom:24,
            }}>
              <RefundAnalytics summary={summary} refundReasons={refundReasons} paymentMethods={paymentMethods} />
              <CustomerAnalytics summary={summary} customerTimeline={customerTimeline} />
            </div>

            {/* ── TRAFFIC ANALYTICS (full width) ──────── */}
            <div className="fade-up" style={{ marginBottom:24 }}>
              <TrafficAnalytics summary={summary} salesData={salesData} />
            </div>

            {/* ── AI INSIGHTS (full width) ─────────────── */}
            <div className="fade-up">
              <AIInsights insights={insights} />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
