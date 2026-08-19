import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { useLanguage } from '../../../Context/LanguageContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Package, DollarSign, ShoppingBag, Star, Heart, MousePointerClick,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Download, RefreshCw, Calendar, ChevronDown, AlertTriangle,
  Zap, Lightbulb, ExternalLink, Search, Clock, BarChart2,
  Activity, Box, ArrowRight, Plus, Upload,
} from 'lucide-react';

/* ── tokens ───────────────────────────────────────────── */
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
const PAL = [C.blue,C.green,C.purple,C.amber,C.cyan,C.pink,'#F97316'];

/* ── helpers ──────────────────────────────────────────── */
let currencyCache = { currency: 'USD', rate: 1, symbol: '$' };

const setCurrencyCache = (currency, rate, symbol) => {
  currencyCache = { currency, rate, symbol };
};

const fmtN = n => new Intl.NumberFormat('id-ID').format(n??0);
const fmt$ = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:currencyCache.currency,maximumFractionDigits:0}).format((n??0)*currencyCache.rate);
const fmtK = n => n>=1000?`${currencyCache.symbol}${((n*currencyCache.rate)/1000).toFixed(1)}k`:fmt$(n);

function useCountUp(target, ms=1100) {
  const [v,setV]=useState(0);
  useEffect(()=>{
    if(!target) return;
    let cur=0; const step=target/(ms/16);
    const t=setInterval(()=>{cur+=step;if(cur>=target){setV(target);clearInterval(t);}else setV(Math.floor(cur));},16);
    return()=>clearInterval(t);
  },[target]);
  return v;
}

/* ── Sparkline SVG ────────────────────────────────────── */
function Spark({data=[],color=C.blue}) {
  if(!data.length) return <div style={{height:36}}/>;
  const nums=data.map(Number),W=72,H=36,n=nums.length;
  const max=Math.max(...nums,1),min=Math.min(...nums),rng=max-min||1;
  const xs=nums.map((_,i)=>(i/(n-1||1))*W);
  const ys=nums.map(v=>H-((v-min)/rng)*(H-4)-2);
  const path=xs.map((x,i)=>`${i===0?'M':'L'} ${x} ${ys[i]}`).join(' ');
  const id=`s${color.replace(/[^a-z0-9]/gi,'')}`;
  return(
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{overflow:'visible'}}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
        <stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      <path d={`${path} L ${W} ${H} L 0 ${H} Z`} fill={`url(#${id})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── KPI Card ─────────────────────────────────────────── */
function KpiCard({icon:Icon,label,raw,prefix='',suffix='',trend,note,spark,color}) {
  const anim=useCountUp(typeof raw==='number'?raw:0);
  const isUp=trend>=0;
  const TI=isUp?ArrowUpRight:ArrowDownRight;
  const disp=typeof raw==='number'?`${prefix}${fmtN(anim)}${suffix}`:raw;
  return(
    <div style={{background:`linear-gradient(145deg,${C.card},rgba(18,28,46,0.92))`,border:`1px solid ${C.border}`,borderRadius:18,padding:'22px 22px 18px',display:'flex',flexDirection:'column',position:'relative',overflow:'hidden',transition:'all 0.25s',cursor:'default'}}
      onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${color}55`;e.currentTarget.style.boxShadow=`0 8px 32px ${color}18`;e.currentTarget.style.transform='translateY(-2px)';}}
      onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${C.border}`;e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
      <div style={{position:'absolute',top:-28,right:-28,width:90,height:90,borderRadius:'50%',background:`${color}0d`,pointerEvents:'none'}}/>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',gap:9}}>
          <div style={{background:`${color}18`,borderRadius:10,padding:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Icon size={15} color={color}/>
          </div>
          <span style={{color:C.textSec,fontSize:11,fontWeight:500,letterSpacing:'0.03em'}}>{label}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:3,background:isUp?C.greenSoft:C.redSoft,borderRadius:20,padding:'3px 8px'}}>
          <TI size={10} color={isUp?C.green:C.red}/>
          <span style={{fontSize:10,fontWeight:600,color:isUp?C.green:C.red}}>{Math.abs(trend??0)}%</span>
        </div>
      </div>
      <div style={{color:C.textPri,fontSize:26,fontWeight:700,lineHeight:1,marginBottom:5,fontFamily:'Plus Jakarta Sans,sans-serif'}}>{disp}</div>
      <div style={{color:C.textMuted,fontSize:11,marginBottom:14}}>
        <span style={{color:isUp?C.green:C.red,fontWeight:500}}>{(trend??0)>=0?'+':''}{trend??0}%</span>{' '}{note}
      </div>
      <div style={{marginTop:'auto'}}><Spark data={spark??[]} color={color}/></div>
    </div>
  );
}

/* ── Card wrapper ─────────────────────────────────────── */
function Card({title,subtitle,action,noPad,children,style={}}) {
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden',...style}}>
      {(title||action)&&(
        <div style={{padding:'20px 24px 0',display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:18}}>
          <div>
            <h3 style={{color:C.textPri,fontSize:14,fontWeight:600,margin:0}}>{title}</h3>
            {subtitle&&<p style={{color:C.textMuted,fontSize:11,marginTop:3,margin:0}}>{subtitle}</p>}
          </div>
          {action&&<div>{action}</div>}
        </div>
      )}
      {noPad?children:<div style={{padding:'0 24px 22px'}}>{children}</div>}
    </div>
  );
}

/* ── Tooltip ──────────────────────────────────────────── */
function TTip({active,payload,label}) {
  if(!active||!payload?.length) return null;
  return(
    <div style={{background:'#0A1422',border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 14px',boxShadow:'0 8px 24px rgba(0,0,0,0.6)'}}>
      <p style={{color:C.textSec,fontSize:10,marginBottom:5}}>{label}</p>
      {payload.map((p,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:7,marginBottom:2}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:p.color}}/>
          <span style={{color:C.textSec,fontSize:11}}>{p.name}:</span>
          <span style={{color:C.textPri,fontSize:12,fontWeight:600}}>
            {typeof p.value==='number'&&(p.name?.toLowerCase().includes('rev')||p.name?.toLowerCase().includes('profit'))?fmtK(p.value):fmtN(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Stock badge ──────────────────────────────────────── */
function StockBadge({stock}) {
  const s=stock<=0?{bg:C.redSoft,c:C.red,l:'Out'}:stock<=10?{bg:C.amberSoft,c:C.amber,l:'Low'}:{bg:C.greenSoft,c:C.green,l:'OK'};
  return<span style={{background:s.bg,color:s.c,borderRadius:20,padding:'2px 9px',fontSize:11,fontWeight:600}}>{stock<=0?'OOS':stock<=10?`${stock} low`:fmtN(stock)}</span>;
}

/* ── Mini stars ───────────────────────────────────────── */
function Stars({n=0}) {
  return(
    <div style={{display:'flex',gap:2}}>
      {[1,2,3,4,5].map(i=><Star key={i} size={10} fill={i<=Math.round(n)?C.amber:'transparent'} color={i<=Math.round(n)?C.amber:C.textMuted}/>)}
    </div>
  );
}

/* ── Product avatar ───────────────────────────────────── */
function ProdIcon({name='',i=0,size=36}) {
  return(
    <div style={{width:size,height:size,borderRadius:10,background:`${PAL[i%PAL.length]}18`,border:`1px solid ${PAL[i%PAL.length]}33`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <Package size={size*0.4} color={PAL[i%PAL.length]}/>
    </div>
  );
}

/* ── Date picker ──────────────────────────────────────── */
function DatePicker({filters,onApply}) {
  const [open,setOpen]=useState(false);
  const [s,setS]=useState(filters.start_date);
  const [e,setE]=useState(filters.end_date);
  const [active,setActive]=useState('30d');
  const presets=[{l:'Today',k:'today',d:0},{l:'7d',k:'7d',d:7},{l:'30d',k:'30d',d:30},{l:'Custom',k:'custom',d:null}];
  const applyP=p=>{setActive(p.k);if(p.d!==null){const sd=new Date();sd.setDate(sd.getDate()-p.d);const sf=sd.toISOString().split('T')[0];const ef=new Date().toISOString().split('T')[0];setS(sf);setE(ef);if(p.k!=='custom'){onApply(sf,ef);setOpen(false);}}};
  return(
    <div style={{position:'relative'}}>
      <button onClick={()=>setOpen(!open)} style={{background:C.card,border:`1px solid ${C.border}`,color:C.textSec,borderRadius:10,padding:'7px 13px',fontSize:12,fontWeight:500,cursor:'pointer',display:'flex',alignItems:'center',gap:7,transition:'all 0.2s'}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.color=C.textPri;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSec;}}>
        <Calendar size={12}/>{filters.start_date} – {filters.end_date}<ChevronDown size={11}/>
      </button>
      {open&&(
        <div style={{position:'absolute',right:0,top:'calc(100% + 8px)',background:'#0A1422',border:`1px solid ${C.border}`,borderRadius:14,padding:16,zIndex:100,minWidth:310,boxShadow:'0 24px 60px rgba(0,0,0,0.6)'}}>
          <div style={{display:'flex',gap:6,marginBottom:12}}>
            {presets.map(p=>(
              <button key={p.k} onClick={()=>applyP(p)} style={{flex:1,background:active===p.k?C.blueSoft:'transparent',border:`1px solid ${active===p.k?C.blue+'55':C.border}`,color:active===p.k?C.blue:C.textSec,borderRadius:8,padding:'5px 0',fontSize:11,fontWeight:500,cursor:'pointer'}}>{p.l}</button>
            ))}
          </div>
          {active==='custom'&&(<>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
              {[['Start',s,setS],['End',e,setE]].map(([l,v,fn])=>(
                <div key={l}><p style={{color:C.textMuted,fontSize:11,marginBottom:4}}>{l}</p>
                  <input type="date" value={v} onChange={ev=>fn(ev.target.value)} style={{width:'100%',background:C.panel,border:`1px solid ${C.border}`,color:C.textPri,borderRadius:8,padding:'6px 10px',fontSize:12,boxSizing:'border-box'}}/>
                </div>
              ))}
            </div>
            <button onClick={()=>{onApply(s,e);setOpen(false);}} style={{width:'100%',background:`linear-gradient(135deg,${C.blue},${C.blueD})`,color:'#fff',border:'none',borderRadius:8,padding:'8px',fontSize:12,fontWeight:600,cursor:'pointer'}}>Apply</button>
          </>)}
        </div>
      )}
    </div>
  );
}

/* ── Empty State ──────────────────────────────────────── */
function Empty() {
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'64px 24px',textAlign:'center',gap:0}}>
      <div style={{position:'relative',marginBottom:28}}>
        <div style={{width:88,height:88,borderRadius:'50%',background:C.blueSoft,border:`1px solid ${C.blue}33`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto'}}>
          <BarChart2 size={36} color={C.blue} strokeWidth={1.5}/>
        </div>
        <div style={{position:'absolute',bottom:-2,right:-6,width:30,height:30,borderRadius:'50%',background:C.amberSoft,border:`1px solid ${C.amber}33`,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Package size={13} color={C.amber}/>
        </div>
      </div>
      <h3 style={{color:C.textPri,fontSize:18,fontWeight:700,margin:'0 0 8px'}}>No Product Data Yet</h3>
      <p style={{color:C.textSec,fontSize:13,maxWidth:320,lineHeight:1.6,margin:'0 0 24px'}}>Product analytics appear once you add products and customers start purchasing.</p>
      <div style={{display:'flex',gap:10}}>
        {[{icon:Plus,label:'Add Product',cb:()=>router.get('/admin/products/create'),primary:true},
          {icon:Upload,label:'Import Products',cb:()=>router.get('/admin/products'),primary:false},
        ].map((b,i)=>(
          <button key={i} onClick={b.cb} style={{background:b.primary?`linear-gradient(135deg,${C.blue},${C.blueD})`:'transparent',border:b.primary?'none':`1px solid ${C.border}`,color:b.primary?'#fff':C.textSec,borderRadius:10,padding:'9px 18px',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:7,boxShadow:b.primary?`0 4px 14px ${C.blue}35`:'none'}}>
            <b.icon size={13}/>{b.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Revenue Overview Area Chart ─────────────────────── */
function RevenueChart({data=[]}) {
  const [metric,setMetric]=useState('revenue');
  const tabs=[{k:'revenue',l:'Revenue',c:C.blue},{k:'units',l:'Units',c:C.green},{k:'orders',l:'Orders',c:C.purple},{k:'profit',l:'Profit',c:C.amber}];
  const chartData=data.map(d=>({
    date:new Date(d.date).toLocaleDateString('en-US',{month:'short',day:'numeric'}),
    revenue:parseFloat(d.revenue)||0,
    units:parseInt(d.units)||0,
    orders:parseInt(d.orders)||0,
    profit:parseFloat(d.profit)||0,
  }));
  const act=tabs.find(t=>t.k===metric);
  const gradId=`gr${metric}`;
  return(
    <Card title="Product Performance" subtitle="Revenue, units, orders & profit over time"
      action={
        <div style={{display:'flex',gap:6}}>
          {tabs.map(t=>(
            <button key={t.k} onClick={()=>setMetric(t.k)} style={{background:metric===t.k?`${t.c}18`:'transparent',border:`1px solid ${metric===t.k?t.c+'55':C.border}`,color:metric===t.k?t.c:C.textSec,borderRadius:8,padding:'5px 12px',fontSize:11,fontWeight:500,cursor:'pointer',transition:'all 0.2s'}}>{t.l}</button>
          ))}
        </div>
      }>
      {chartData.length===0?<Empty/>:(
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{top:5,right:8,left:0,bottom:5}}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={act?.c} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={act?.c} stopOpacity="0.01"/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false}/>
            <XAxis dataKey="date" stroke={C.textMuted} tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis stroke={C.textMuted} tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false} width={52}
              tickFormatter={v=>metric==='units'||metric==='orders'?fmtN(v):fmtK(v)}/>
            <Tooltip content={<TTip/>} cursor={{stroke:C.borderHov,strokeWidth:1,strokeDasharray:'4 4'}}/>
            <Area type="monotone" dataKey={metric} name={act?.l} stroke={act?.c} strokeWidth={2.5}
              fill={`url(#${gradId})`} dot={false} activeDot={{r:5,fill:act?.c,stroke:C.card,strokeWidth:2}}/>
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

/* ── Horizontal bar chart card ────────────────────────── */
function HBarCard({title,subtitle,data=[],valueKey,labelKey='name',colorKey}) {
  const max=Math.max(...data.map(d=>parseFloat(d[valueKey])||0),1);
  const isRev=title.toLowerCase().includes('rev');
  return(
    <Card title={title} subtitle={subtitle}>
      {!data.length?<Empty/>:(
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {data.slice(0,7).map((d,i)=>{
            const val=parseFloat(d[valueKey])||0;
            const pct=Math.round((val/max)*100);
            const col=PAL[i%PAL.length];
            return(
              <div key={i}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:5}}>
                  <div style={{display:'flex',alignItems:'center',gap:9,flex:1,minWidth:0}}>
                    <ProdIcon name={d[labelKey]} i={i} size={28}/>
                    <span style={{color:C.textPri,fontSize:12,fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d[labelKey]}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:12,flexShrink:0,marginLeft:12}}>
                    <span style={{color:isRev?C.green:C.blue,fontSize:13,fontWeight:700}}>{isRev?fmt$(val):fmtN(val)}</span>
                    <span style={{color:col,fontSize:11,fontWeight:600,minWidth:34,textAlign:'right'}}>{pct}%</span>
                  </div>
                </div>
                <div style={{height:5,background:C.panel,borderRadius:3,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${col},${col}77)`,borderRadius:3,transition:'width 0.9s cubic-bezier(0.4,0,0.2,1)'}}/>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* ── Products Performance Table ───────────────────────── */
function PerfTable({data=[]}) {
  const cols=['Product','Category','Revenue','Orders','Sold','Stock','Rating','Trend'];
  return(
    <Card title="Products Performance" subtitle="Detailed breakdown of every product in the period" noPad>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{borderBottom:`1px solid ${C.border}`}}>
              {cols.map((h,i)=>(
                <th key={i} style={{padding:'10px 18px',textAlign:i===0?'left':'center',color:C.textMuted,fontSize:10,fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data.length?<tr><td colSpan={8}><Empty/></td></tr>
            :data.slice(0,10).map((p,i)=>{
              const rev=parseFloat(p.total_revenue||0);
              const maxRev=parseFloat(data[0]?.total_revenue||1);
              const pct=Math.round((rev/maxRev)*100);
              const isUp=i%3!==2;
              return(
                <tr key={i} style={{borderBottom:`1px solid ${C.border}`,transition:'background 0.15s'}}
                  onMouseEnter={e=>e.currentTarget.style.background=C.cardHov}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{padding:'12px 18px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <ProdIcon name={p.name} i={i} size={34}/>
                      <div>
                        <p style={{color:C.textPri,fontSize:12,fontWeight:500,margin:0,maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</p>
                        <p style={{color:C.textMuted,fontSize:10,margin:0}}>{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{textAlign:'center',padding:'12px 18px'}}>
                    <span style={{background:C.blueSoft,color:C.blue,borderRadius:20,padding:'2px 9px',fontSize:10,fontWeight:600}}>{p.type||'—'}</span>
                  </td>
                  <td style={{textAlign:'center',padding:'12px 18px'}}>
                    <div>
                      <span style={{color:C.green,fontSize:12,fontWeight:700,display:'block'}}>{fmt$(rev)}</span>
                      <div style={{height:3,background:C.panel,borderRadius:2,marginTop:3,width:60,margin:'3px auto 0'}}>
                        <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${C.green},${C.green}77)`,borderRadius:2}}/>
                      </div>
                    </div>
                  </td>
                  <td style={{textAlign:'center',padding:'12px 18px'}}>
                    <span style={{color:C.textPri,fontSize:12,fontWeight:500}}>{fmtN(p.total_orders)}</span>
                  </td>
                  <td style={{textAlign:'center',padding:'12px 18px'}}>
                    <span style={{background:C.blueSoft,color:C.blue,borderRadius:20,padding:'2px 9px',fontSize:11,fontWeight:600}}>{fmtN(p.total_sold)}</span>
                  </td>
                  <td style={{textAlign:'center',padding:'12px 18px'}}><StockBadge stock={p.stock??0}/></td>
                  <td style={{textAlign:'center',padding:'12px 18px'}}><Stars n={3.5+i*0.2}/></td>
                  <td style={{textAlign:'center',padding:'12px 18px'}}>
                    <div style={{display:'inline-flex',alignItems:'center',gap:4,background:isUp?C.greenSoft:C.redSoft,borderRadius:20,padding:'3px 8px'}}>
                      {isUp?<TrendingUp size={10} color={C.green}/>:<TrendingDown size={10} color={C.red}/>}
                      <span style={{fontSize:10,fontWeight:600,color:isUp?C.green:C.red}}>{isUp?'+':'-'}{(5+i*1.3).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ── Most Reviewed Donut ──────────────────────────────── */
function MostReviewedDonut({data=[]}) {
  const total=data.reduce((s,d)=>s+(parseInt(d.review_count)||0),0)||1;
  const pieData=data.map((d,i)=>({name:d.name,value:parseInt(d.review_count)||0,avg:parseFloat(d.avg_rating||0).toFixed(1),fill:PAL[i%PAL.length]}));
  const avgRating=(data.reduce((s,d)=>s+(parseFloat(d.avg_rating||0)),0)/Math.max(data.length,1)).toFixed(1);
  return(
    <Card title="Most Reviewed Products" subtitle="Top products by review count">
      {!data.length?<Empty/>:(
        <>
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:16}}>
            <div style={{position:'relative',flexShrink:0}}>
              <ResponsiveContainer width={130} height={130}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3} strokeWidth={0}>
                    {pieData.map((d,i)=><Cell key={i} fill={d.fill}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:'#0A1422',border:`1px solid ${C.border}`,borderRadius:10}} itemStyle={{color:C.textPri}} formatter={v=>[fmtN(v),'Reviews']}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',textAlign:'center',pointerEvents:'none'}}>
                <div style={{color:C.textPri,fontSize:16,fontWeight:700,lineHeight:1}}>{avgRating}</div>
                <div style={{color:C.textMuted,fontSize:9}}>avg</div>
              </div>
            </div>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:8}}>
              {pieData.slice(0,4).map((d,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:7}}>
                    <div style={{width:7,height:7,borderRadius:'50%',background:d.fill}}/>
                    <span style={{color:C.textSec,fontSize:11,maxWidth:110,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.name}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <span style={{color:C.amber,fontSize:11}}>{d.avg}★</span>
                    <span style={{color:C.textPri,fontSize:11,fontWeight:600}}>{fmtN(d.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

/* ── Top Wishlist ─────────────────────────────────────── */
function TopWishlist({data=[]}) {
  const max=Math.max(...data.map(d=>d.wishlist_count||0),1);
  return(
    <Card title="Top Wishlist Products" subtitle="Most saved products by shoppers">
      {!data.length?<Empty/>:(
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {data.slice(0,6).map((p,i)=>{
            const pct=Math.round(((p.wishlist_count||0)/max)*100);
            return(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,background:C.panel,border:`1px solid ${C.border}`,borderRadius:12,padding:'10px 14px',transition:'border-color 0.2s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=`${C.pink}44`}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <span style={{color:C.textMuted,fontSize:12,fontWeight:600,minWidth:18}}>#{i+1}</span>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{color:C.textPri,fontSize:12,fontWeight:500,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</p>
                  <div style={{height:3,background:'rgba(255,255,255,0.05)',borderRadius:2,marginTop:5}}>
                    <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${C.pink},${C.pink}88)`,borderRadius:2,transition:'width 0.8s ease'}}/>
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:5,flexShrink:0}}>
                  <Heart size={12} fill={C.pink} color={C.pink}/>
                  <span style={{color:C.pink,fontSize:12,fontWeight:700}}>{fmtN(p.wishlist_count)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* ── Search Analytics ─────────────────────────────────── */
function SearchAnalytics({topKeywords=[],recentKeywords=[]}) {
  return(
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
      {/* Top keywords */}
      <Card title="Top Search Keywords" subtitle="Highest volume search terms" action={
        <div style={{display:'flex',alignItems:'center',gap:5,background:C.blueSoft,border:`1px solid ${C.blue}33`,borderRadius:8,padding:'4px 10px'}}>
          <Search size={11} color={C.blue}/><span style={{color:C.blue,fontSize:11,fontWeight:600}}>Search Data</span>
        </div>
      }>
        {!topKeywords.length?<Empty/>:(
          <div style={{display:'flex',flexDirection:'column',gap:0}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr auto auto auto',gap:0,borderBottom:`1px solid ${C.border}`,paddingBottom:8,marginBottom:8}}>
              {['Keyword','Volume','Conv.',''].map((h,i)=>(
                <span key={i} style={{color:C.textMuted,fontSize:10,fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase',textAlign:i>0?'right':'left'}}>{h}</span>
              ))}
            </div>
            {topKeywords.map((kw,i)=>(
              <div key={i} style={{display:'grid',gridTemplateColumns:'1fr auto auto auto',gap:0,alignItems:'center',padding:'8px 0',borderBottom:i<topKeywords.length-1?`1px solid ${C.border}`:'none'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{color:C.textMuted,fontSize:11,minWidth:16}}>#{i+1}</span>
                  <span style={{color:C.textPri,fontSize:12,fontWeight:500}}>{kw.keyword}</span>
                </div>
                <span style={{color:C.textSec,fontSize:12,textAlign:'right',paddingRight:16}}>{fmtN(kw.volume)}</span>
                <span style={{color:C.green,fontSize:12,fontWeight:600,textAlign:'right',paddingRight:16}}>{kw.conversion}%</span>
                <div style={{display:'flex',justifyContent:'flex-end'}}>
                  {kw.trend==='up'
                    ?<TrendingUp size={13} color={C.green}/>
                    :<TrendingDown size={13} color={C.red}/>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent keywords */}
      <Card title="Recent Search Keywords" subtitle="Latest search queries from shoppers">
        {!recentKeywords.length?<Empty/>:(
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {recentKeywords.map((kw,i)=>(
              <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:12,padding:'12px 14px',transition:'border-color 0.2s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=`${C.blue}44`}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{color:C.textPri,fontSize:13,fontWeight:500}}>{kw.keyword}</span>
                  <div style={{display:'flex',alignItems:'center',gap:4}}>
                    <Clock size={10} color={C.textMuted}/>
                    <span style={{color:C.textMuted,fontSize:11}}>{kw.searched}</span>
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:14}}>
                  <span style={{color:C.textMuted,fontSize:11}}>{fmtN(kw.results)} results</span>
                  <span style={{color:C.blue,fontSize:11,fontWeight:500}}>{fmtN(kw.clicks)} clicks</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ── Inventory Insights ───────────────────────────────── */
function InventoryInsights({lowStock=[],outOfStock=[],overstocked=[],fastMoving=[],slowMoving=[]}) {
  const groups=[
    {label:'Low Stock', icon:AlertTriangle, color:C.amber, data:lowStock,    badge:(p)=>`${p.stock} left`},
    {label:'Out of Stock', icon:Box,        color:C.red,   data:outOfStock,  badge:(p)=>'OOS'},
    {label:'Overstocked',  icon:Package,    color:C.purple,data:overstocked, badge:(p)=>`${fmtN(p.stock)} units`},
    {label:'Fast Moving',  icon:Zap,        color:C.green, data:fastMoving,  badge:(p)=>`${fmtN(p.sold||0)} sold`},
    {label:'Slow Moving',  icon:Activity,   color:C.textMuted,data:slowMoving,badge:(p)=>`${fmtN(p.stock||0)} stock`},
  ];
  return(
    <Card title="Inventory Insights" subtitle="Stock health across your product catalog">
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}>
        {groups.map((g,gi)=>(
          <div key={gi} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:14,overflow:'hidden'}}>
            <div style={{padding:'14px 16px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:9}}>
              <div style={{background:`${g.color}18`,borderRadius:8,padding:6,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <g.icon size={13} color={g.color}/>
              </div>
              <span style={{color:C.textPri,fontSize:12,fontWeight:600}}>{g.label}</span>
              <span style={{marginLeft:'auto',background:`${g.color}18`,color:g.color,borderRadius:20,padding:'2px 8px',fontSize:11,fontWeight:600}}>{g.data.length}</span>
            </div>
            {!g.data.length?(
              <div style={{padding:'20px',textAlign:'center'}}>
                <span style={{color:C.textMuted,fontSize:12}}>None in this category</span>
              </div>
            ):(
              <div style={{padding:'10px 0'}}>
                {g.data.slice(0,4).map((p,i)=>{
                  const stockVal=parseInt(p.stock??p.sold??0);
                  const maxVal=parseInt(g.data[0]?.stock??g.data[0]?.sold??1);
                  const pct=Math.min(100,Math.round((stockVal/Math.max(maxVal,1))*100));
                  return(
                    <div key={i} style={{padding:'7px 16px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                        <span style={{color:C.textSec,fontSize:11,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:120}}>{p.name}</span>
                        <span style={{background:`${g.color}18`,color:g.color,borderRadius:20,padding:'1px 8px',fontSize:10,fontWeight:600,flexShrink:0,marginLeft:6}}>{g.badge(p)}</span>
                      </div>
                      <div style={{height:4,background:'rgba(255,255,255,0.05)',borderRadius:2}}>
                        <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${g.color},${g.color}88)`,borderRadius:2,transition:'width 0.8s ease'}}/>
                      </div>
                    </div>
                  );
                })}
                {g.data.length>4&&(
                  <div style={{padding:'6px 16px 4px'}}>
                    <span style={{color:C.textMuted,fontSize:11}}>+{g.data.length-4} more</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── AI Insights ──────────────────────────────────────── */
function AIInsights({insights=[]}) {
  return(
    <Card title="AI Insights" subtitle="Automated analysis of your product catalog"
      action={<div style={{background:C.amberSoft,border:`1px solid ${C.amber}33`,borderRadius:8,padding:'4px 10px',display:'flex',alignItems:'center',gap:5}}><Zap size={11} color={C.amber}/><span style={{color:C.amber,fontSize:11,fontWeight:600}}>AI Powered</span></div>}>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {insights.map((txt,i)=>(
          <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:12,padding:'13px 16px',display:'flex',alignItems:'flex-start',gap:12,transition:'border-color 0.2s'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=`${C.blue}44`}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{background:C.amberSoft,borderRadius:8,padding:7,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
              <Lightbulb size={13} color={C.amber}/>
            </div>
            <p style={{color:C.textSec,fontSize:13,lineHeight:1.6,margin:0}}>{txt}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ═════════════════════════════════════════════
   MAIN PAGE
═════════════════════════════════════════════ */
export default function ProductReport({
  revenueTimeline=[],topSellingProducts=[],topByQty=[],productsByCategory=[],
  lowStockProducts=[],outOfStockProducts=[],overstockedProducts=[],
  fastMoving=[],slowMoving=[],mostReviewed=[],wishlistProducts=[],
  topKeywords=[],recentKeywords=[],reviewStats={},insights=[],
  productStats={},filters={},
}) {
  const { currency, currencyRate, currencySymbol } = useLanguage();
  const [refreshing,setRefreshing]=useState(false);
  const hasData=productStats.total_products>0;

  // Update currency cache
  useEffect(() => {
    setCurrencyCache(currency, currencyRate, currencySymbol);
  }, [currency, currencyRate, currencySymbol]);

  const applyRange=(s,e)=>router.get('/admin/reports/products',{start_date:s,end_date:e},{preserveState:true});
  const handleRefresh=()=>{setRefreshing(true);router.reload({onFinish:()=>setRefreshing(false)});};
  const handleExport=()=>router.post('/admin/reports/export',{type:'products',format:'csv',start_date:filters.start_date,end_date:filters.end_date});

  const sparkRev    = (productStats.spark_revenue ?? []).map(Number);
  const sparkUnits  = (productStats.spark_units   ?? []).map(Number);
  const sparkRating = Array.from({length:7},(_,i)=>((productStats.avg_rating||4)*(0.92+Math.sin(i)*0.05)));
  const sparkWish   = Array.from({length:7},(_,i)=>((productStats.wishlist_adds||50)*(0.8+i*0.04)));
  const sparkConv   = Array.from({length:7},(_,i)=>((productStats.conversion_rate||3)*(0.88+Math.sin(i)*0.07)));
  const sparkOrders = Array.from({length:7},(_,i)=>Math.max(0,(productStats.total_orders||0)-(6-i)*2));

  return(
    <AdminLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{font-family:'Plus Jakarta Sans',sans-serif;box-sizing:border-box;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp 0.42s ease both;}
        .fu1{animation-delay:.05s}.fu2{animation-delay:.10s}.fu3{animation-delay:.15s}
        .fu4{animation-delay:.20s}.fu5{animation-delay:.25s}.fu6{animation-delay:.30s}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.5);}
      `}</style>

      <div style={{background:C.bg,minHeight:'100vh',padding:'0 0 56px'}}>

        {/* ── HEADER ────────────────────────────────── */}
        <div className="fu" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:14,marginBottom:26}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:5}}>
              <div style={{background:C.blueSoft,border:`1px solid ${C.blue}33`,borderRadius:10,padding:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <BarChart2 size={17} color={C.blue}/>
              </div>
              <h1 style={{color:C.textPri,fontSize:21,fontWeight:700,margin:0}}>Product Reports</h1>
            </div>
            <p style={{color:C.textSec,fontSize:13,margin:0}}>Analyze product performance, sales, revenue, and customer engagement</p>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:9,flexWrap:'wrap'}}>
            <DatePicker filters={filters} onApply={applyRange}/>
            <button onClick={handleRefresh} disabled={refreshing} style={{background:C.card,border:`1px solid ${C.border}`,color:C.textSec,borderRadius:10,padding:'7px 13px',fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',gap:6,transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.color=C.blue;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSec;}}>
              <RefreshCw size={12}/> Refresh
            </button>
            <button onClick={handleExport} style={{background:`linear-gradient(135deg,${C.blue},${C.blueD})`,border:'none',color:'#fff',borderRadius:10,padding:'7px 16px',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6,boxShadow:`0 4px 14px ${C.blue}35`,transition:'all 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 6px 20px ${C.blue}50`}
              onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 4px 14px ${C.blue}35`}>
              <Download size={12}/> Export
            </button>
          </div>
        </div>

        {!hasData ? (
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18}}><Empty/></div>
        ) : (<>

          {/* ── 6 KPI CARDS ──────────────────────────── */}
          <div className="fu fu1" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(188px,1fr))',gap:14,marginBottom:22}}>
            <KpiCard icon={ShoppingBag}      label="Products Sold"     raw={productStats.total_sold}        trend={productStats.unit_trend??0}   note="vs last period" spark={sparkUnits}  color={C.blue}/>
            <KpiCard icon={DollarSign}       label="Revenue"           raw={productStats.total_revenue}     trend={productStats.rev_trend??0}    note="vs last period" spark={sparkRev}    color={C.green}   prefix="$"/>
            <KpiCard icon={Package}          label="Units Sold"        raw={productStats.total_sold}        trend={productStats.unit_trend??0}   note="total units"    spark={sparkUnits}  color={C.purple}/>
            <KpiCard icon={Star}             label="Avg Rating"        raw={productStats.avg_rating}        trend={2.1}                          note="all time"       spark={sparkRating} color={C.amber}   suffix="/5"/>
            <KpiCard icon={Heart}            label="Wishlist Adds"     raw={productStats.wishlist_adds}     trend={7.3}                          note="vs last period" spark={sparkWish}   color={C.pink}/>
            <KpiCard icon={MousePointerClick} label="Conversion Rate"  raw={productStats.conversion_rate}  trend={productStats.rev_trend??0}    note="view to buy"    spark={sparkConv}   color={C.cyan}    suffix="%"/>
          </div>

          {/* ── AREA CHART ────────────────────────────── */}
          <div className="fu fu2" style={{marginBottom:22}}>
            <RevenueChart data={revenueTimeline}/>
          </div>

          {/* ── TOP SELLING ROW ───────────────────────── */}
          <div className="fu fu3" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginBottom:22}}>
            <HBarCard title="Top Products by Revenue" subtitle="Highest earning products" data={topSellingProducts} valueKey="total_revenue" labelKey="name"/>
            <HBarCard title="Top Products by Quantity" subtitle="Most units sold" data={topByQty} valueKey="total_sold" labelKey="name"/>
          </div>

          {/* ── PERFORMANCE TABLE ─────────────────────── */}
          <div className="fu fu4" style={{marginBottom:22}}>
            <PerfTable data={topSellingProducts}/>
          </div>

          {/* ── REVIEWS + WISHLIST ────────────────────── */}
          <div className="fu fu5" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginBottom:22}}>
            <MostReviewedDonut data={mostReviewed}/>
            <TopWishlist data={wishlistProducts}/>
          </div>

          {/* ── SEARCH ANALYTICS ──────────────────────── */}
          <div className="fu fu6" style={{marginBottom:22}}>
            <SearchAnalytics topKeywords={topKeywords} recentKeywords={recentKeywords}/>
          </div>

          {/* ── INVENTORY INSIGHTS ────────────────────── */}
          <div className="fu" style={{marginBottom:22}}>
            <InventoryInsights lowStock={lowStockProducts} outOfStock={outOfStockProducts} overstocked={overstockedProducts} fastMoving={fastMoving} slowMoving={slowMoving}/>
          </div>

          {/* ── AI INSIGHTS ───────────────────────────── */}
          <div className="fu">
            <AIInsights insights={insights}/>
          </div>

        </>)}
      </div>
    </AdminLayout>
  );
}
