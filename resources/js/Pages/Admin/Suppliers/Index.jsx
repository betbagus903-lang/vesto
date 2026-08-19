import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import {
  Building2, DollarSign, ShoppingBag, Star, TrendingUp,
  Search, Plus, ExternalLink, MapPin, Phone, Mail,
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
const PAL = ['#3B82F6','#10B981','#8B5CF6','#F59E0B','#EC4899'];
const fmt$ = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n??0);
const fmtN = n => new Intl.NumberFormat('en-US').format(n??0);

function Avatar({ name, i }) {
  const init = (name||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  const c = PAL[i%PAL.length];
  return <div style={{width:42,height:42,borderRadius:12,background:`${c}22`,border:`1px solid ${c}44`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:14,fontWeight:700,color:c}}>{init}</div>;
}

function KpiCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:'22px 24px',position:'relative',overflow:'hidden',transition:'all 0.2s'}}
      onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${color}55`;e.currentTarget.style.transform='translateY(-2px)';}}
      onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${C.border}`;e.currentTarget.style.transform='translateY(0)';}}>
      <div style={{position:'absolute',top:-24,right:-24,width:80,height:80,borderRadius:'50%',background:`${color}0d`}}/>
      <div style={{background:`${color}18`,borderRadius:10,padding:9,display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
        <Icon size={16} color={color}/>
      </div>
      <div style={{color:C.textPri,fontSize:26,fontWeight:700,lineHeight:1,marginBottom:4}}>{value}</div>
      <div style={{color:C.textMuted,fontSize:11,marginBottom:sub?6:0}}>{label}</div>
      {sub && <div style={{color:color,fontSize:11,fontWeight:500}}>{sub}</div>}
    </div>
  );
}

export default function SuppliersIndex({ suppliers = [], stats = {} }) {
  const [search, setSearch] = useState('');
  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*{font-family:'Plus Jakarta Sans',sans-serif;box-sizing:border-box;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp 0.4s ease both;}.fu1{animation-delay:.05s}.fu2{animation-delay:.10s}.fu3{animation-delay:.15s}`}</style>
      <div style={{background:C.bg,minHeight:'100vh',padding:'0 0 48px'}}>

        {/* Header */}
        <div className="fu" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:14,marginBottom:24}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:5}}>
              <div style={{background:C.blueSoft,border:`1px solid ${C.blue}33`,borderRadius:10,padding:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Building2 size={17} color={C.blue}/>
              </div>
              <h1 style={{color:C.textPri,fontSize:21,fontWeight:700,margin:0}}>Suppliers</h1>
            </div>
            <p style={{color:C.textSec,fontSize:13,margin:0}}>Manage your supplier network and partnerships</p>
          </div>
          <button style={{background:`linear-gradient(135deg,${C.blue},${C.blueD})`,border:'none',color:'#fff',borderRadius:10,padding:'8px 18px',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:7,boxShadow:`0 4px 14px ${C.blue}35`}}>
            <Plus size={13}/> Add Supplier
          </button>
        </div>

        {/* KPI */}
        <div className="fu fu1" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(178px,1fr))',gap:14,marginBottom:22}}>
          <KpiCard icon={Building2}  label="Total Suppliers"  value={fmtN(stats.total)}        color={C.blue}   sub={`${stats.active} active`}/>
          <KpiCard icon={ShoppingBag} label="Total Orders"    value={fmtN(stats.total_orders)}  color={C.green}  sub="All time"/>
          <KpiCard icon={DollarSign}  label="Total Value"     value={fmt$(stats.total_value)}   color={C.purple} sub="Procurement value"/>
          <KpiCard icon={Star}        label="Avg Rating"      value={`${stats.avg_rating}★`}    color={C.amber}  sub="Supplier quality"/>
        </div>

        {/* Search */}
        <div className="fu fu2" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:'16px 20px',marginBottom:18,display:'flex',alignItems:'center',gap:10}}>
          <Search size={14} color={C.textMuted}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, category, or city…"
            style={{flex:1,background:'transparent',border:'none',color:C.textPri,fontSize:13,outline:'none'}}/>
          <span style={{color:C.textMuted,fontSize:12}}>{filtered.length} results</span>
        </div>

        {/* Cards grid */}
        <div className="fu fu3" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:16}}>
          {filtered.map((s,i)=>(
            <div key={s.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden',transition:'all 0.25s',cursor:'pointer'}}
              onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${PAL[i%PAL.length]}44`;e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 8px 32px rgba(0,0,0,0.25)`;}}
              onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${C.border}`;e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}>

              {/* Card header */}
              <div style={{padding:'18px 20px',display:'flex',alignItems:'flex-start',justifyContent:'space-between',borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <Avatar name={s.name} i={i}/>
                  <div>
                    <p style={{color:C.textPri,fontSize:14,fontWeight:600,margin:0}}>{s.name}</p>
                    <p style={{color:C.textMuted,fontSize:11,margin:'2px 0 0'}}>{s.contact}</p>
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
                  <span style={{background:s.status==='active'?C.greenSoft:C.redSoft,color:s.status==='active'?C.green:C.red,borderRadius:20,padding:'3px 9px',fontSize:10,fontWeight:600,textTransform:'capitalize'}}>{s.status}</span>
                  <span style={{background:C.blueSoft,color:C.blue,borderRadius:20,padding:'2px 8px',fontSize:10,fontWeight:500}}>{s.category}</span>
                </div>
              </div>

              {/* Contact info */}
              <div style={{padding:'12px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',flexDirection:'column',gap:7}}>
                {[{icon:MapPin,val:s.city},{icon:Mail,val:s.email},{icon:Phone,val:s.phone}].map(({icon:Ic,val},j)=>(
                  <div key={j} style={{display:'flex',alignItems:'center',gap:8}}>
                    <Ic size={11} color={C.textMuted}/>
                    <span style={{color:C.textSec,fontSize:12}}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div style={{padding:'14px 20px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:0}}>
                {[
                  {label:'Products',val:fmtN(s.products),color:C.blue},
                  {label:'Orders',  val:fmtN(s.total_orders),color:C.green},
                  {label:'Rating',  val:`${s.rating}★`,color:C.amber},
                ].map((m,j)=>(
                  <div key={j} style={{textAlign:'center',borderRight:j<2?`1px solid ${C.border}`:'none'}}>
                    <div style={{color:m.color,fontSize:16,fontWeight:700,lineHeight:1,marginBottom:3}}>{m.val}</div>
                    <div style={{color:C.textMuted,fontSize:10}}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{padding:'12px 20px',borderTop:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{color:C.textMuted,fontSize:11}}>Joined {new Date(s.joined).toLocaleDateString('en-US',{month:'short',year:'numeric'})}</span>
                <button onClick={()=>router.get(`/admin/suppliers/${s.id}`)} style={{background:C.blueSoft,border:`1px solid ${C.blue}33`,color:C.blue,borderRadius:8,padding:'5px 12px',fontSize:11,fontWeight:500,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:5}}>
                  <ExternalLink size={10}/> View
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:'64px 24px',textAlign:'center'}}>
            <Building2 size={40} color={C.textMuted} strokeWidth={1.2} style={{margin:'0 auto 14px'}}/>
            <p style={{color:C.textPri,fontSize:15,fontWeight:600,margin:'0 0 6px'}}>No suppliers found</p>
            <p style={{color:C.textMuted,fontSize:12,margin:0}}>Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
