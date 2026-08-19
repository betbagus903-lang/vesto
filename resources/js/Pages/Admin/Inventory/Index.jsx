import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import {
  Package, AlertTriangle, TrendingDown, Archive, DollarSign,
  Search, Filter, RefreshCw, Download, Edit3, Check, X,
  ChevronUp, ChevronDown, ArrowUpRight,
} from 'lucide-react';

const C = {
  bg:'#0B1426', panel:'#111827', card:'#141E2E', cardHov:'#172236',
  border:'#1E2D42', blue:'#3B82F6', blueD:'#2563EB',
  blueSoft:'rgba(59,130,246,0.12)', green:'#10B981', greenSoft:'rgba(16,185,129,0.12)',
  amber:'#F59E0B', amberSoft:'rgba(245,158,11,0.12)',
  red:'#EF4444', redSoft:'rgba(239,68,68,0.12)',
  purple:'#8B5CF6', purpleSoft:'rgba(139,92,246,0.12)',
  textPri:'#F0F6FF', textSec:'#8BA3C0', textMuted:'#4A6080',
};

const fmt$ = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n??0);
const fmtN = n => new Intl.NumberFormat('en-US').format(n??0);

function KpiCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:'22px 24px', position:'relative', overflow:'hidden', transition:'all 0.2s' }}
      onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${color}55`;e.currentTarget.style.transform='translateY(-2px)';}}
      onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${C.border}`;e.currentTarget.style.transform='translateY(0)';}}>
      <div style={{position:'absolute',top:-24,right:-24,width:80,height:80,borderRadius:'50%',background:`${color}0d`}}/>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
        <div style={{background:`${color}18`,borderRadius:10,padding:9,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Icon size={16} color={color}/>
        </div>
      </div>
      <div style={{color:C.textPri,fontSize:26,fontWeight:700,lineHeight:1,marginBottom:4}}>{value}</div>
      <div style={{color:C.textMuted,fontSize:11,marginBottom:8}}>{label}</div>
      {sub && <div style={{color:color,fontSize:11,fontWeight:500}}>{sub}</div>}
    </div>
  );
}

function StockBadge({ stock }) {
  if (stock <= 0)   return <span style={{background:C.redSoft,color:C.red,borderRadius:20,padding:'2px 9px',fontSize:11,fontWeight:600}}>Out of Stock</span>;
  if (stock <= 10)  return <span style={{background:C.amberSoft,color:C.amber,borderRadius:20,padding:'2px 9px',fontSize:11,fontWeight:600}}>Low: {stock}</span>;
  if (stock > 100)  return <span style={{background:C.purpleSoft,color:C.purple,borderRadius:20,padding:'2px 9px',fontSize:11,fontWeight:600}}>Over: {fmtN(stock)}</span>;
  return <span style={{background:C.greenSoft,color:C.green,borderRadius:20,padding:'2px 9px',fontSize:11,fontWeight:600}}>{fmtN(stock)}</span>;
}

function InlineEdit({ id, currentStock, onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(currentStock);
  const save = () => { onSave(id, val); setEditing(false); };
  if (!editing) return (
    <button onClick={() => setEditing(true)} style={{background:'transparent',border:`1px solid ${C.border}`,color:C.textSec,borderRadius:8,padding:'4px 10px',fontSize:11,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:5,transition:'all 0.15s'}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.color=C.blue;}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSec;}}>
      <Edit3 size={10}/> Edit
    </button>
  );
  return (
    <div style={{display:'flex',alignItems:'center',gap:5}}>
      <input type="number" value={val} onChange={e=>setVal(parseInt(e.target.value)||0)} min="0"
        style={{width:64,background:C.panel,border:`1px solid ${C.blue}`,color:C.textPri,borderRadius:7,padding:'4px 7px',fontSize:12,outline:'none'}}/>
      <button onClick={save} style={{background:C.greenSoft,border:`1px solid ${C.green}33`,color:C.green,borderRadius:7,padding:'4px 7px',cursor:'pointer'}}><Check size={11}/></button>
      <button onClick={()=>{setVal(currentStock);setEditing(false);}} style={{background:C.redSoft,border:`1px solid ${C.red}33`,color:C.red,borderRadius:7,padding:'4px 7px',cursor:'pointer'}}><X size={11}/></button>
    </div>
  );
}

export default function InventoryIndex({ products, stats, filters }) {
  const [search, setSearch]   = useState(filters.search ?? '');
  const [activeFilter, setActiveFilter] = useState(filters.filter ?? 'all');

  const applyFilter = (f) => {
    setActiveFilter(f);
    router.get('/admin/inventory', { ...filters, filter: f, search }, { preserveState: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.get('/admin/inventory', { ...filters, search }, { preserveState: true });
  };

  const handleStockSave = (id, stock) => {
    router.patch(`/admin/inventory/${id}/stock`, { stock }, { preserveState: true });
  };

  const filterTabs = [
    { key:'all',       label:'All',         color: C.blue   },
    { key:'low',       label:'Low Stock',   color: C.amber  },
    { key:'out',       label:'Out of Stock',color: C.red    },
    { key:'overstock', label:'Overstock',   color: C.purple },
  ];

  return (
    <AdminLayout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*{font-family:'Plus Jakarta Sans',sans-serif;box-sizing:border-box;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp 0.4s ease both;}.fu1{animation-delay:.05s}.fu2{animation-delay:.10s}.fu3{animation-delay:.15s}input[type=number]::-webkit-inner-spin-button{opacity:1}`}</style>
      <div style={{ background: C.bg, minHeight:'100vh', padding:'0 0 48px' }}>

        {/* Header */}
        <div className="fu" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:14,marginBottom:24}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:5}}>
              <div style={{background:C.blueSoft,border:`1px solid ${C.blue}33`,borderRadius:10,padding:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Archive size={17} color={C.blue}/>
              </div>
              <h1 style={{color:C.textPri,fontSize:21,fontWeight:700,margin:0}}>Inventory</h1>
            </div>
            <p style={{color:C.textSec,fontSize:13,margin:0}}>Monitor and manage product stock levels</p>
          </div>
          <div style={{display:'flex',gap:9}}>
            <button onClick={()=>router.reload()} style={{background:C.card,border:`1px solid ${C.border}`,color:C.textSec,borderRadius:10,padding:'7px 14px',fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.color=C.blue;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSec;}}>
              <RefreshCw size={12}/> Refresh
            </button>
            <button style={{background:`linear-gradient(135deg,${C.blue},${C.blueD})`,border:'none',color:'#fff',borderRadius:10,padding:'7px 16px',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6,boxShadow:`0 4px 14px ${C.blue}35`}}>
              <Download size={12}/> Export
            </button>
          </div>
        </div>

        {/* KPI */}
        <div className="fu fu1" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:14,marginBottom:22}}>
          <KpiCard icon={Package}       label="Total Products"  value={fmtN(stats.total_products)}   color={C.blue}   sub={`${fmtN(stats.in_stock)} in stock`}/>
          <KpiCard icon={AlertTriangle} label="Low Stock"       value={fmtN(stats.low_stock)}        color={C.amber}  sub="Need restock soon"/>
          <KpiCard icon={TrendingDown}  label="Out of Stock"    value={fmtN(stats.out_of_stock)}     color={C.red}    sub="Immediate action"/>
          <KpiCard icon={ArrowUpRight}  label="Overstock"       value={fmtN(stats.overstock)}        color={C.purple} sub="Consider discount"/>
          <KpiCard icon={DollarSign}    label="Stock Value"     value={fmt$(stats.total_stock_value)} color={C.green}  sub="Total inventory value"/>
        </div>

        {/* Filters + Search */}
        <div className="fu fu2" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:'18px 22px',marginBottom:18,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div style={{display:'flex',gap:7}}>
            {filterTabs.map(t=>(
              <button key={t.key} onClick={()=>applyFilter(t.key)} style={{background:activeFilter===t.key?`${t.color}18`:'transparent',border:`1px solid ${activeFilter===t.key?t.color+'55':C.border}`,color:activeFilter===t.key?t.color:C.textSec,borderRadius:9,padding:'6px 14px',fontSize:12,fontWeight:activeFilter===t.key?600:400,cursor:'pointer',transition:'all 0.2s'}}>
                {t.label}
              </button>
            ))}
          </div>
          <form onSubmit={handleSearch} style={{display:'flex',gap:8}}>
            <div style={{position:'relative'}}>
              <Search size={13} color={C.textMuted} style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)'}}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products or SKU…"
                style={{background:C.panel,border:`1px solid ${C.border}`,color:C.textPri,borderRadius:9,padding:'7px 12px 7px 32px',fontSize:12,outline:'none',width:230,transition:'border-color 0.2s'}}
                onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.border}/>
            </div>
            <button type="submit" style={{background:C.blueSoft,border:`1px solid ${C.blue}33`,color:C.blue,borderRadius:9,padding:'7px 14px',fontSize:12,fontWeight:500,cursor:'pointer'}}>Search</button>
          </form>
        </div>

        {/* Table */}
        <div className="fu fu3" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${C.border}`}}>
                  {['Product','SKU','Price','Stock Status','Type','Action'].map((h,i)=>(
                    <th key={i} style={{padding:'12px 20px',textAlign:i===0?'left':'center',color:C.textMuted,fontSize:10,fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(products?.data ?? []).length === 0 ? (
                  <tr><td colSpan={6}>
                    <div style={{padding:'60px 24px',textAlign:'center'}}>
                      <Package size={40} color={C.textMuted} strokeWidth={1.2} style={{margin:'0 auto 14px'}}/>
                      <p style={{color:C.textPri,fontSize:15,fontWeight:600,margin:'0 0 6px'}}>No products found</p>
                      <p style={{color:C.textMuted,fontSize:12,margin:0}}>Try adjusting your search or filter.</p>
                    </div>
                  </td></tr>
                ) : (products?.data ?? []).map((p,i)=>(
                  <tr key={p.id} style={{borderBottom:`1px solid ${C.border}`,transition:'background 0.15s'}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.cardHov}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{padding:'13px 20px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div style={{width:34,height:34,borderRadius:10,background:`${C.blue}18`,border:`1px solid ${C.blue}33`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                          <Package size={13} color={C.blue}/>
                        </div>
                        <div>
                          <p style={{color:C.textPri,fontSize:12,fontWeight:500,margin:0}}>{p.name}</p>
                          <p style={{color:C.textMuted,fontSize:10,margin:0}}>ID: {p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{textAlign:'center',padding:'13px 20px'}}>
                      <span style={{color:C.textSec,fontSize:12,fontFamily:'monospace'}}>{p.sku}</span>
                    </td>
                    <td style={{textAlign:'center',padding:'13px 20px'}}>
                      <span style={{color:C.green,fontSize:12,fontWeight:600}}>{fmt$(p.price)}</span>
                    </td>
                    <td style={{textAlign:'center',padding:'13px 20px'}}>
                      <StockBadge stock={p.stock}/>
                    </td>
                    <td style={{textAlign:'center',padding:'13px 20px'}}>
                      <span style={{background:C.blueSoft,color:C.blue,borderRadius:20,padding:'2px 9px',fontSize:11,fontWeight:500,textTransform:'capitalize'}}>{p.type}</span>
                    </td>
                    <td style={{textAlign:'center',padding:'13px 20px'}}>
                      <InlineEdit id={p.id} currentStock={p.stock} onSave={handleStockSave}/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {products?.last_page > 1 && (
            <div style={{padding:'14px 22px',borderTop:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{color:C.textMuted,fontSize:12}}>Page {products.current_page} of {products.last_page} · {fmtN(products.total)} products</span>
              <div style={{display:'flex',gap:6}}>
                {products.current_page > 1 && (
                  <button onClick={()=>router.get(products.prev_page_url,{},{preserveState:true})}
                    style={{background:C.card,border:`1px solid ${C.border}`,color:C.textSec,borderRadius:8,padding:'5px 12px',fontSize:12,cursor:'pointer'}}>← Prev</button>
                )}
                {products.current_page < products.last_page && (
                  <button onClick={()=>router.get(products.next_page_url,{},{preserveState:true})}
                    style={{background:C.blueSoft,border:`1px solid ${C.blue}33`,color:C.blue,borderRadius:8,padding:'5px 12px',fontSize:12,fontWeight:500,cursor:'pointer'}}>Next →</button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
