import React, { useState, useEffect, createContext, useContext } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { useTheme } from '../../../Context/ThemeContext';
import { getT, PAL as _PAL } from './_theme';

const TC = createContext({});
const useC = () => useContext(TC);
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Users, UserPlus, UserCheck, Repeat2, Crown, Star,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Download, RefreshCw, Calendar, ChevronDown, MapPin,
  ShoppingBag, MessageSquare, Zap, Lightbulb, Clock,
  Activity, Heart, Award, BarChart2, ExternalLink,
} from 'lucide-react';

/* ─── tokens ─────────────────────────────────────────── */
/* tokens resolved at runtime via useC() */
const PALETTE = _PAL;

/* ─── helpers ────────────────────────────────────────── */
const fmtNum = n => new Intl.NumberFormat('en-US').format(n ?? 0);
const fmt$   = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n ?? 0);
const fmtK   = n => n>=1000?`$${(n/1000).toFixed(1)}k`:fmt$(n);

function useCountUp(target, ms = 1100) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let cur = 0; const step = target / (ms / 16);
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setV(target); clearInterval(t); } else setV(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return v;
}

/* ─── Sparkline ──────────────────────────────────────── */
function Spark({ data=[], color }) {
  const C = useC();
  color = color ?? C.blue;
  if (!data.length) return <div style={{height:36}}/>;
  const nums = data.map(Number);
  const max = Math.max(...nums,1), min = Math.min(...nums);
  const rng = max-min||1, W=72,H=36,n=nums.length;
  const xs = nums.map((_,i)=>(i/(n-1||1))*W);
  const ys = nums.map(v=>H-((v-min)/rng)*(H-4)-2);
  const path = xs.map((x,i)=>`${i===0?'M':'L'} ${x} ${ys[i]}`).join(' ');
  const fill = `${path} L ${W} ${H} L 0 ${H} Z`;
  const id = `sp${color.replace(/[^a-z0-9]/gi,'')}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{overflow:'visible'}}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
        <stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      <path d={fill} fill={`url(#${id})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── KPI Card ───────────────────────────────────────── */
function KpiCard({ icon:Icon, label, raw, prefix='', suffix='', trend, note, spark, color }) {
  const C = useC();
  const animated = useCountUp(typeof raw==='number'?raw:0);
  const isUp = trend >= 0;
  const TI = isUp ? ArrowUpRight : ArrowDownRight;
  const display = typeof raw==='number' ? `${prefix}${fmtNum(animated)}${suffix}` : raw;
  return (
    <div style={{
      background:`linear-gradient(145deg,${C.card} 0%,rgba(20,30,46,0.9) 100%)`,
      border:`1px solid ${C.border}`, borderRadius:18,
      padding:'22px 22px 18px', display:'flex',flexDirection:'column',
      position:'relative',overflow:'hidden',transition:'all 0.25s',cursor:'default',
    }}
      onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${color}55`;e.currentTarget.style.boxShadow=`0 8px 32px ${color}18`;e.currentTarget.style.transform='translateY(-2px)';}}
      onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${C.border}`;e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}
    >
      <div style={{position:'absolute',top:-30,right:-30,width:90,height:90,borderRadius:'50%',background:`${color}0e`,pointerEvents:'none'}}/>
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
      <div style={{color:C.textPri,fontSize:26,fontWeight:700,lineHeight:1,marginBottom:5,fontFamily:'Plus Jakarta Sans,sans-serif'}}>{display}</div>
      <div style={{color:C.textMuted,fontSize:11,marginBottom:14}}>
        <span style={{color:isUp?C.green:C.red,fontWeight:500}}>{(trend??0)>=0?'+':''}{trend??0}%</span>{' '}{note}
      </div>
      <div style={{marginTop:'auto'}}><Spark data={spark??[]} color={color}/></div>
    </div>
  );
}

/* ─── Section card ───────────────────────────────────── */
function Card({ title, subtitle, action, noPad, children, style={} }) {
  const C = useC();
  return (
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
      {noPad ? children : <div style={{padding:'0 24px 22px'}}>{children}</div>}
    </div>
  );
}

/* ─── Tooltip ────────────────────────────────────────── */
function TTip({ active, payload, label }) {
  const C = useC();
  if (!active||!payload?.length) return null;
  return (
    <div style={{background:'#0D1929',border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 14px',boxShadow:'0 8px 24px rgba(0,0,0,0.5)'}}>
      <p style={{color:C.textSec,fontSize:10,marginBottom:5}}>{label}</p>
      {payload.map((p,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:7,marginBottom:2}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:p.color}}/>
          <span style={{color:C.textSec,fontSize:11}}>{p.name}:</span>
          <span style={{color:C.textPri,fontSize:12,fontWeight:600}}>{typeof p.value==='number'&&p.name?.toLowerCase().includes('spent')?fmt$(p.value):fmtNum(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Status badge ───────────────────────────────────── */
function Badge({ v }) {
  const C = useC();
  const m={active:{bg:C.greenSoft,c:C.green},inactive:{bg:C.redSoft,c:C.red},vip:{bg:C.amberSoft,c:C.amber}};
  const s=m[v]??{bg:C.blueSoft,c:C.blue};
  return <span style={{background:s.bg,color:s.c,borderRadius:20,padding:'3px 10px',fontSize:11,fontWeight:600,textTransform:'capitalize'}}>{v}</span>;
}

/* ─── Avatar ─────────────────────────────────────────── */
function Avatar({ name, size=34 }) {
  const C = useC();
  const initials = (name||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  const c = PALETTE[((name||'A').charCodeAt(0))%PALETTE.length];
  return (
    <div style={{width:size,height:size,borderRadius:'50%',background:`${c}22`,border:`1px solid ${c}44`,
      display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
      fontSize:size*0.35,fontWeight:700,color:c}}>
      {initials}
    </div>
  );
}

/* ─── Star rating ────────────────────────────────────── */
function Stars({ n }) {
  const C = useC();
  return (
    <div style={{display:'flex',gap:2}}>
      {[1,2,3,4,5].map(i=>(
        <Star key={i} size={11} fill={i<=Math.round(n)?C.amber:'transparent'} color={i<=Math.round(n)?C.amber:C.textMuted}/>
      ))}
    </div>
  );
}

/* ─── Empty ──────────────────────────────────────────── */
function Empty() {
  const C = useC();
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'48px 24px',textAlign:'center'}}>
      <div style={{width:60,height:60,borderRadius:'50%',background:C.blueSoft,border:`1px solid ${C.blue}33`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16}}>
        <Users size={26} color={C.blue} strokeWidth={1.5}/>
      </div>
      <p style={{color:C.textPri,fontSize:15,fontWeight:600,margin:'0 0 6px'}}>No Data Yet</p>
      <p style={{color:C.textMuted,fontSize:12,margin:0}}>Customer analytics will appear once you have data.</p>
    </div>
  );
}

/* ─── Date picker ────────────────────────────────────── */
function DatePicker({ filters, onApply }) {
  const C = useC();
  const [open,setOpen]=useState(false);
  const [s,setS]=useState(filters.start_date);
  const [e,setE]=useState(filters.end_date);
  const [active,setActive]=useState('30d');
  const presets=[{label:'Today',key:'today',d:0},{label:'7d',key:'7d',d:7},{label:'30d',key:'30d',d:30},{label:'Custom',key:'custom',d:null}];
  const applyP=p=>{setActive(p.key);if(p.d!==null){const sd=new Date();sd.setDate(sd.getDate()-p.d);const sf=sd.toISOString().split('T')[0];const ef=new Date().toISOString().split('T')[0];setS(sf);setE(ef);if(p.key!=='custom'){onApply(sf,ef);setOpen(false);}}};
  return (
    <div style={{position:'relative'}}>
      <button onClick={()=>setOpen(!open)} style={{background:C.card,border:`1px solid ${C.border}`,color:C.textSec,borderRadius:10,padding:'7px 13px',fontSize:12,fontWeight:500,cursor:'pointer',display:'flex',alignItems:'center',gap:7,transition:'all 0.2s'}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.color=C.textPri;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSec;}}>
        <Calendar size={12}/>{filters.start_date} – {filters.end_date}<ChevronDown size={11}/>
      </button>
      {open&&(
        <div style={{position:'absolute',right:0,top:'calc(100% + 8px)',background:'#0D1929',border:`1px solid ${C.border}`,borderRadius:14,padding:16,zIndex:100,minWidth:310,boxShadow:'0 20px 60px rgba(0,0,0,0.5)'}}>
          <div style={{display:'flex',gap:6,marginBottom:12}}>
            {presets.map(p=>(
              <button key={p.key} onClick={()=>applyP(p)} style={{flex:1,background:active===p.key?C.blueSoft:'transparent',border:`1px solid ${active===p.key?C.blue+'55':C.border}`,color:active===p.key?C.blue:C.textSec,borderRadius:8,padding:'5px 0',fontSize:11,fontWeight:500,cursor:'pointer'}}>{p.label}</button>
            ))}
          </div>
          {active==='custom'&&(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
              {[['Start',s,setS],['End',e,setE]].map(([l,v,fn])=>(
                <div key={l}><p style={{color:C.textMuted,fontSize:11,marginBottom:4}}>{l}</p>
                  <input type="date" value={v} onChange={ev=>fn(ev.target.value)} style={{width:'100%',background:C.panel,border:`1px solid ${C.border}`,color:C.textPri,borderRadius:8,padding:'6px 10px',fontSize:12,boxSizing:'border-box'}}/>
                </div>
              ))}
            </div>
          )}
          {active==='custom'&&(
            <button onClick={()=>{onApply(s,e);setOpen(false);}} style={{width:'100%',background:`linear-gradient(135deg,${C.blue},${C.blueD})`,color:'#fff',border:'none',borderRadius:8,padding:'8px',fontSize:12,fontWeight:600,cursor:'pointer'}}>Apply</button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Customer Growth Chart ──────────────────────────── */
function GrowthChart({ data=[] }) {
  const C = useC();
  const chartData = data.map(d=>({
    date: new Date(d.date).toLocaleDateString('en-US',{month:'short',day:'numeric'}),
    new: parseInt(d.new_customers)||0,
  }));
  return (
    <Card title="Customer Growth" subtitle="New customer acquisition over time">
      {chartData.length===0 ? <Empty/> : (
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart data={chartData} margin={{top:5,right:10,left:0,bottom:5}}>
            <defs>
              <linearGradient id="gradCG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.blue} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={C.blue} stopOpacity="0.01"/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false}/>
            <XAxis dataKey="date" stroke={C.textMuted} tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis stroke={C.textMuted} tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false} width={28}/>
            <Tooltip content={<TTip/>} cursor={{stroke:C.borderHov,strokeWidth:1,strokeDasharray:'4 4'}}/>
            <Area type="monotone" dataKey="new" name="New Customers" stroke={C.blue} strokeWidth={2.5}
              fill="url(#gradCG)" dot={false} activeDot={{r:5,fill:C.blue,stroke:C.card,strokeWidth:2}}/>
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

/* ─── Retention Chart ────────────────────────────────── */
function RetentionChart({ data=[] }) {
  const C = useC();
  return (
    <Card title="Customer Retention" subtitle="Monthly cohort new vs retained">
      {!data.length ? <Empty/> : (
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={data} margin={{top:5,right:10,left:0,bottom:5}} barCategoryGap="30%">
            <defs>
              <linearGradient id="gradNew2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.blue} stopOpacity="0.9"/>
                <stop offset="100%" stopColor={C.blueD} stopOpacity="0.7"/>
              </linearGradient>
              <linearGradient id="gradRet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.green} stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#059669" stopOpacity="0.7"/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false}/>
            <XAxis dataKey="month" stroke={C.textMuted} tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis stroke={C.textMuted} tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false} width={28}/>
            <Tooltip content={<TTip/>}/>
            <Bar dataKey="new" name="New" fill="url(#gradNew2)" radius={[4,4,0,0]}/>
            <Bar dataKey="retained" name="Retained" fill="url(#gradRet)" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

/* ─── Purchase Frequency ─────────────────────────────── */
function FrequencyChart({ data=[] }) {
  const C = useC();
  return (
    <Card title="Purchase Frequency" subtitle="Order count distribution per customer">
      {!data.length ? <Empty/> : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{top:5,right:10,left:0,bottom:5}} barCategoryGap="25%">
            <defs>
              <linearGradient id="gradFreq" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.purple} stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.7"/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false}/>
            <XAxis dataKey="label" stroke={C.textMuted} tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis stroke={C.textMuted} tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false} width={28}/>
            <Tooltip content={<TTip/>}/>
            <Bar dataKey="count" name="Customers" fill="url(#gradFreq)" radius={[6,6,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

/* ─── Segmentation Donut ─────────────────────────────── */
function SegmentationDonut({ data=[] }) {
  const C = useC();
  const total = data.reduce((s,d)=>s+(d.value||0),0)||1;
  return (
    <Card title="Customer Segmentation" subtitle="Breakdown by lifecycle stage">
      {!data.length ? <Empty/> : (
        <div style={{display:'flex',alignItems:'center',gap:20}}>
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={46} outerRadius={72}
                dataKey="value" paddingAngle={3} strokeWidth={0}>
                {data.map((d,i)=><Cell key={i} fill={d.color||PALETTE[i]}/>)}
              </Pie>
              <Tooltip contentStyle={{background:'#0D1929',border:`1px solid ${C.border}`,borderRadius:10}} itemStyle={{color:C.textPri}} formatter={v=>[fmtNum(v),'Customers']}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{flex:1,display:'flex',flexDirection:'column',gap:10}}>
            {data.map((d,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:d.color||PALETTE[i]}}/>
                  <span style={{color:C.textSec,fontSize:12}}>{d.label}</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{color:C.textPri,fontSize:12,fontWeight:600}}>{fmtNum(d.value)}</span>
                  <span style={{color:C.textMuted,fontSize:11,minWidth:34,textAlign:'right'}}>{Math.round(d.value/total*100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

/* ─── Customer Location ──────────────────────────────── */
function LocationChart({ data=[] }) {
  const C = useC();
  const max = Math.max(...data.map(d=>d.count||0),1);
  return (
    <Card title="Customer Location" subtitle="Top cities by customer count">
      {!data.length ? (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'32px 0'}}>
          <MapPin size={32} color={C.textMuted} strokeWidth={1.5}/>
          <p style={{color:C.textMuted,fontSize:12,marginTop:10}}>No location data available</p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {data.map((d,i)=>{
            const pct=Math.round((d.count/max)*100);
            return (
              <div key={i}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <MapPin size={11} color={PALETTE[i%PALETTE.length]}/>
                    <span style={{color:C.textPri,fontSize:12,fontWeight:500}}>{d.city}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <span style={{color:C.textSec,fontSize:12}}>{fmtNum(d.count)}</span>
                    <span style={{color:PALETTE[i%PALETTE.length],fontSize:11,fontWeight:600,minWidth:32,textAlign:'right'}}>{pct}%</span>
                  </div>
                </div>
                <div style={{height:5,background:C.panel,borderRadius:3,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${PALETTE[i%PALETTE.length]},${PALETTE[i%PALETTE.length]}88)`,borderRadius:3,transition:'width 0.8s ease'}}/>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* ─── CLV Card ───────────────────────────────────────── */
function CLVCard({ stats }) {
  const C = useC();
  const items = [
    { label:'Customer Lifetime Value', value:fmt$(stats.clv), color:C.blue,   icon:Crown   },
    { label:'Avg Orders / Customer',   value:stats.avg_orders, color:C.purple, icon:ShoppingBag },
    { label:'Repeat Purchase Rate',    value:`${stats.repeat_rate}%`, color:C.green, icon:Repeat2 },
    { label:'VIP Customers',           value:fmtNum(stats.vip_customers), color:C.amber, icon:Award },
  ];
  return (
    <Card title="Customer Lifetime Value" subtitle="Loyalty & value metrics">
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {items.map((it,i)=>(
          <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:12,padding:'16px',display:'flex',flexDirection:'column',gap:8,transition:'border-color 0.2s'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=`${it.color}44`}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{background:`${it.color}18`,borderRadius:8,padding:7,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <it.icon size={13} color={it.color}/>
              </div>
              <span style={{color:C.textMuted,fontSize:11}}>{it.label}</span>
            </div>
            <span style={{color:it.color,fontSize:20,fontWeight:700,lineHeight:1}}>{it.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Top Customers Table ────────────────────────────── */
function TopCustomersTable({ data=[] }) {
  const C = useC();
  return (
    <Card title="Top Customers" subtitle="Ranked by total spend in selected period" noPad>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{borderBottom:`1px solid ${C.border}`}}>
              {['#','Customer','Orders','Spent','Last Order','Action'].map((h,i)=>(
                <th key={i} style={{padding:'10px 20px',textAlign:i<=1?'left':'center',color:C.textMuted,fontSize:10,fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data.length ? (
              <tr><td colSpan={6}><Empty/></td></tr>
            ) : data.map((c,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${C.border}`,transition:'background 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.background=C.cardHov}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td style={{padding:'12px 20px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    {i===0&&<Crown size={12} color={C.amber}/>}
                    {i===1&&<Crown size={12} color="#94A3B8"/>}
                    {i===2&&<Crown size={12} color="#CD7F32"/>}
                    <span style={{color:C.textMuted,fontSize:12,fontWeight:500}}>#{i+1}</span>
                  </div>
                </td>
                <td style={{padding:'12px 20px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <Avatar name={c.name}/>
                    <div>
                      <p style={{color:C.textPri,fontSize:13,fontWeight:500,margin:0}}>{c.name}</p>
                      <p style={{color:C.textMuted,fontSize:11,margin:0}}>{c.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{textAlign:'center',padding:'12px 20px'}}>
                  <span style={{background:C.blueSoft,color:C.blue,borderRadius:20,padding:'3px 10px',fontSize:12,fontWeight:600}}>{fmtNum(c.total_orders)}</span>
                </td>
                <td style={{textAlign:'center',padding:'12px 20px'}}>
                  <span style={{color:C.green,fontSize:13,fontWeight:700}}>{fmt$(c.total_spent)}</span>
                </td>
                <td style={{textAlign:'center',padding:'12px 20px'}}>
                  <span style={{color:C.textMuted,fontSize:12}}>{c.last_order ? new Date(c.last_order).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : '—'}</span>
                </td>
                <td style={{textAlign:'center',padding:'12px 20px'}}>
                  <button onClick={()=>router.get(`/admin/customers/${c.id}`)} style={{background:C.blueSoft,border:`1px solid ${C.blue}33`,color:C.blue,borderRadius:8,padding:'5px 12px',fontSize:11,fontWeight:500,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:4}}>
                    <ExternalLink size={10}/> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ─── Recent Customers ───────────────────────────────── */
function RecentCustomers({ data=[] }) {
  const C = useC();
  return (
    <Card title="Recent Customers" subtitle="Latest signups" noPad>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{borderBottom:`1px solid ${C.border}`}}>
              {['Customer','Status','Joined',''].map((h,i)=>(
                <th key={i} style={{padding:'10px 20px',textAlign:i<2?'left':'center',color:C.textMuted,fontSize:10,fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data.length ? <tr><td colSpan={4}><Empty/></td></tr>
            : data.map((c,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${C.border}`,transition:'background 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.background=C.cardHov}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td style={{padding:'12px 20px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <Avatar name={c.name} size={32}/>
                    <div>
                      <p style={{color:C.textPri,fontSize:13,fontWeight:500,margin:0}}>{c.name}</p>
                      <p style={{color:C.textMuted,fontSize:11,margin:0}}>{c.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{padding:'12px 20px'}}><Badge v={c.status}/></td>
                <td style={{textAlign:'center',padding:'12px 20px'}}><span style={{color:C.textMuted,fontSize:12}}>{c.joined_at}</span></td>
                <td style={{textAlign:'center',padding:'12px 20px'}}>
                  <button onClick={()=>router.get(`/admin/customers/${c.id}`)} style={{background:'transparent',border:`1px solid ${C.border}`,color:C.textSec,borderRadius:8,padding:'4px 10px',fontSize:11,cursor:'pointer',transition:'all 0.15s'}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.color=C.blue;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSec;}}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ─── Review Analytics ───────────────────────────────── */
function ReviewAnalytics({ stats, ratingDist=[] }) {
  const C = useC();
  return (
    <Card title="Review Analytics" subtitle="Product satisfaction metrics">
      <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:20}}>
        <div style={{textAlign:'center'}}>
          <div style={{color:C.textPri,fontSize:36,fontWeight:800,lineHeight:1}}>{stats.avg_rating||'—'}</div>
          <Stars n={stats.avg_rating||0}/>
          <div style={{color:C.textMuted,fontSize:11,marginTop:5}}>{fmtNum(stats.total_reviews)} reviews</div>
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',gap:7}}>
          {ratingDist.map((r,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{display:'flex',alignItems:'center',gap:3,minWidth:24}}>
                <span style={{color:C.textMuted,fontSize:11}}>{r.stars}</span>
                <Star size={9} fill={C.amber} color={C.amber}/>
              </div>
              <div style={{flex:1,height:5,background:C.panel,borderRadius:3,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${r.pct}%`,background:`linear-gradient(90deg,${C.amber},${C.amber}88)`,borderRadius:3,transition:'width 0.8s ease'}}/>
              </div>
              <span style={{color:C.textMuted,fontSize:11,minWidth:28,textAlign:'right'}}>{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ─── VIP Customers ──────────────────────────────────── */
function VIPCustomers({ data=[], stats }) {
  const C = useC();
  const vips = data.filter(c=>parseFloat(c.total_spent||0)>=500).slice(0,5);
  return (
    <Card title="VIP Customers" subtitle="High-value customers spending $500+" action={
      <div style={{display:'flex',alignItems:'center',gap:6,background:C.amberSoft,border:`1px solid ${C.amber}33`,borderRadius:8,padding:'4px 10px'}}>
        <Crown size={11} color={C.amber}/><span style={{color:C.amber,fontSize:11,fontWeight:600}}>{fmtNum(stats.vip_customers)} VIPs</span>
      </div>
    }>
      {!vips.length ? (
        <div style={{textAlign:'center',padding:'24px 0'}}>
          <Crown size={28} color={C.textMuted} strokeWidth={1.5}/>
          <p style={{color:C.textMuted,fontSize:12,marginTop:8}}>No VIP customers yet</p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {vips.map((c,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,background:C.panel,border:`1px solid ${C.border}`,borderRadius:12,padding:'12px 14px',transition:'border-color 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=`${C.amber}44`}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <div style={{position:'relative'}}>
                <Avatar name={c.name} size={38}/>
                {i===0&&<Crown size={11} color={C.amber} style={{position:'absolute',bottom:-2,right:-2}}/>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{color:C.textPri,fontSize:13,fontWeight:500,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</p>
                <p style={{color:C.textMuted,fontSize:11,margin:0}}>{fmtNum(c.total_orders)} orders</p>
              </div>
              <span style={{color:C.amber,fontSize:14,fontWeight:700,flexShrink:0}}>{fmt$(c.total_spent)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ─── Activity Timeline ──────────────────────────────── */
function ActivityTimeline({ data=[] }) {
  const C = useC();
  const typeMap={signup:{icon:UserPlus,color:C.green,label:'New signup'},order:{icon:ShoppingBag,color:C.blue,label:'Placed order'},review:{icon:MessageSquare,color:C.purple,label:'Left review'}};
  return (
    <Card title="Activity Timeline" subtitle="Recent customer actions">
      {!data.length ? <Empty/> : (
        <div style={{display:'flex',flexDirection:'column',gap:0}}>
          {data.map((ev,i)=>{
            const cfg=typeMap[ev.type]??typeMap.signup;
            return (
              <div key={i} style={{display:'flex',gap:12,paddingBottom:i<data.length-1?14:0,position:'relative'}}>
                {i<data.length-1&&<div style={{position:'absolute',left:15,top:30,bottom:0,width:1,background:C.border}}/>}
                <div style={{width:30,height:30,borderRadius:'50%',background:`${cfg.color}18`,border:`1px solid ${cfg.color}33`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,zIndex:1}}>
                  <cfg.icon size={12} color={cfg.color}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                    <Avatar name={ev.name} size={20}/>
                    <span style={{color:C.textPri,fontSize:12,fontWeight:500}}>{ev.name}</span>
                    <span style={{color:C.textMuted,fontSize:11}}>·</span>
                    <span style={{color:cfg.color,fontSize:11,fontWeight:500}}>{cfg.label}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:5}}>
                    <Clock size={10} color={C.textMuted}/>
                    <span style={{color:C.textMuted,fontSize:11}}>{ev.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* ─── AI Insights ────────────────────────────────────── */
function AIInsights({ insights=[] }) {
  const C = useC();
  return (
    <Card title="AI Insights" subtitle="Automated analysis of your customer data"
      action={<div style={{background:C.amberSoft,border:`1px solid ${C.amber}33`,borderRadius:8,padding:'4px 10px',display:'flex',alignItems:'center',gap:5}}><Zap size={11} color={C.amber}/><span style={{color:C.amber,fontSize:11,fontWeight:600}}>AI Powered</span></div>}>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {insights.map((txt,i)=>(
          <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:12,padding:'14px 16px',display:'flex',alignItems:'flex-start',gap:12,transition:'border-color 0.2s'}}
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
export default function CustomerReport({
  customerGrowth=[], topCustomers=[], recentCustomers=[], customersByCity=[],
  segmentation=[], freqBuckets=[], retentionData=[], ratingDist=[],
  timeline=[], insights=[], customerStats={}, filters={},
}) {
  const { theme } = useTheme();
  const C = getT(theme);
  const [refreshing, setRefreshing] = useState(false);
  const hasData = customerStats.total_customers > 0;

  const applyRange = (s,e) => router.get('/admin/reports/customers',{start_date:s,end_date:e},{preserveState:true});

  const handleRefresh = () => {
    setRefreshing(true);
    router.reload({onFinish:()=>setRefreshing(false)});
  };

  const sparkNew    = (customerStats.spark_new    ?? []).map(Number);
  const sparkActive = (customerStats.spark_active ?? []).map(Number);
  const sparkOrders = Array.from({length:7},(_,i)=>Math.max(0,(customerStats.customers_with_orders||0)-i*3));
  const sparkClv    = Array.from({length:7},(_,i)=>((customerStats.clv||0)*(0.85+Math.sin(i)*0.1)));
  const sparkRepeat = Array.from({length:7},(_,i)=>((customerStats.repeat_rate||0)*(0.9+Math.sin(i)*0.08)));

  return (
    <TC.Provider value={C}>
    <AdminLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{font-family:'Plus Jakarta Sans',sans-serif;box-sizing:border-box;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .fu{animation:fadeUp 0.4s ease both;}
        .fu1{animation-delay:0.05s}.fu2{animation-delay:0.10s}.fu3{animation-delay:0.15s}
        .fu4{animation-delay:0.20s}.fu5{animation-delay:0.25s}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.5);}
      `}</style>

      <div style={{background:C.bg,minHeight:'100vh',padding:'0 0 48px'}}>

        {/* ── HEADER ────────────────────────────────── */}
        <div className="fu" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:14,marginBottom:26}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:5}}>
              <div style={{background:C.blueSoft,border:`1px solid ${C.blue}33`,borderRadius:10,padding:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Users size={17} color={C.blue}/>
              </div>
              <h1 style={{color:C.textPri,fontSize:21,fontWeight:700,margin:0}}>Customer Analytics</h1>
            </div>
            <p style={{color:C.textSec,fontSize:13,margin:0}}>Understand your customer base, behavior & lifecycle</p>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:9,flexWrap:'wrap'}}>
            <DatePicker filters={filters} onApply={applyRange}/>
            <button onClick={handleRefresh} disabled={refreshing} style={{background:C.card,border:`1px solid ${C.border}`,color:C.textSec,borderRadius:10,padding:'7px 13px',fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',gap:6,transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.color=C.blue;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSec;}}>
              <RefreshCw size={12} style={{animation:refreshing?'spin 1s linear infinite':'none'}}/> Refresh
            </button>
            <button onClick={()=>router.post('/admin/reports/export',{type:'customers',format:'csv',start_date:filters.start_date,end_date:filters.end_date})}
              style={{background:`linear-gradient(135deg,${C.blue},${C.blueD})`,border:'none',color:'#fff',borderRadius:10,padding:'7px 16px',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6,boxShadow:`0 4px 14px rgba(59,130,246,0.3)`,transition:'all 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 6px 20px rgba(59,130,246,0.45)`}
              onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 4px 14px rgba(59,130,246,0.3)`}>
              <Download size={12}/> Export
            </button>
          </div>
        </div>

        {!hasData ? (
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18}}><Empty/></div>
        ) : (<>

          {/* ── KPI CARDS ─────────────────────────────── */}
          <div className="fu fu1" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:14,marginBottom:22}}>
            <KpiCard icon={Users}    label="Total Customers"  raw={customerStats.total_customers}       trend={customerStats.active_trend??0} note="vs last period" spark={sparkActive} color={C.blue}/>
            <KpiCard icon={UserPlus} label="New Customers"    raw={customerStats.new_customers}         trend={customerStats.new_trend??0}    note="vs last period" spark={sparkNew}    color={C.green}/>
            <KpiCard icon={Repeat2}  label="Repeat Customers" raw={customerStats.repeat_customers}      trend={0}                             note="all time"       spark={sparkOrders} color={C.purple}/>
            <KpiCard icon={Crown}    label="CLV (avg)"        raw={customerStats.clv}                   trend={0}                             note="per customer"   spark={sparkClv}    color={C.amber}   prefix="$"/>
            <KpiCard icon={Heart}    label="Repeat Rate"      raw={customerStats.repeat_rate}           trend={0}                             note="of buyers"      spark={sparkRepeat} color={C.pink}    suffix="%"/>
          </div>

          {/* ── GROWTH + RETENTION ────────────────────── */}
          <div className="fu fu2" style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:18,marginBottom:22}}>
            <GrowthChart data={customerGrowth}/>
            <RetentionChart data={retentionData}/>
          </div>

          {/* ── SEGMENTATION + CLV + LOCATION ──────────── */}
          <div className="fu fu3" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:18,marginBottom:22}}>
            <SegmentationDonut data={segmentation}/>
            <CLVCard stats={customerStats}/>
            <LocationChart data={customersByCity}/>
          </div>

          {/* ── TOP CUSTOMERS TABLE (full) ─────────────── */}
          <div className="fu fu4" style={{marginBottom:22}}>
            <TopCustomersTable data={topCustomers}/>
          </div>

          {/* ── FREQ + VIP + TIMELINE ─────────────────── */}
          <div className="fu fu5" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:18,marginBottom:22}}>
            <FrequencyChart data={freqBuckets}/>
            <VIPCustomers data={topCustomers} stats={customerStats}/>
            <ActivityTimeline data={timeline}/>
          </div>

          {/* ── RECENT CUSTOMERS + REVIEWS ────────────── */}
          <div className="fu" style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:18,marginBottom:22}}>
            <RecentCustomers data={recentCustomers}/>
            <ReviewAnalytics stats={customerStats} ratingDist={ratingDist}/>
          </div>

          {/* ── AI INSIGHTS (full) ────────────────────── */}
          <div className="fu">
            <AIInsights insights={insights}/>
          </div>

        </>)}
      </div>
    </AdminLayout>
    </TC.Provider>
  );
}
