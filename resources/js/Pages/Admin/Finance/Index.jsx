import React, { useState } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  DollarSign, TrendingUp, TrendingDown, RefreshCw, Download,
  ArrowUpRight, ArrowDownRight, CreditCard, Receipt, Wallet,
  BarChart2, CheckCircle, Clock, XCircle, Lightbulb,
} from 'lucide-react';

const C = {
  bg:'#0B1426', panel:'#111827', card:'#141E2E', cardHov:'#172236',
  border:'#1E2D42', blue:'#3B82F6', blueD:'#2563EB',
  blueSoft:'rgba(59,130,246,0.12)',
  green:'#10B981', greenSoft:'rgba(16,185,129,0.12)',
  amber:'#F59E0B', amberSoft:'rgba(245,158,11,0.12)',
  red:'#EF4444',   redSoft:'rgba(239,68,68,0.12)',
  purple:'#8B5CF6', purpleSoft:'rgba(139,92,246,0.12)',
  textPri:'#F0F6FF', textSec:'#8BA3C0', textMuted:'#4A6080',
};
const fmt$ = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n??0);
const fmtK = n => n>=1000?`$${(n/1000).toFixed(1)}k`:fmt$(n);
const fmtN = n => new Intl.NumberFormat('en-US').format(n??0);

function KpiCard({icon:Icon,label,value,trend,note,color}) {
  const isUp=trend>=0;
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:'22px 22px 18px',position:'relative',overflow:'hidden',transition:'all 0.2s'}}
      onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${color}55`;e.currentTarget.style.transform='translateY(-2px)';}}
      onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${C.border}`;e.currentTarget.style.transform='translateY(0)';}}>
      <div style={{position:'absolute',top:-24,right:-24,width:80,height:80,borderRadius:'50%',background:`${color}0d`}}/>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
        <div style={{background:`${color}18`,borderRadius:10,padding:9,display:'inline-flex'}}><Icon size={16} color={color}/></div>
        <div style={{display:'flex',alignItems:'center',gap:3,background:isUp?C.greenSoft:C.redSoft,borderRadius:20,padding:'3px 8px'}}>
          {isUp?<ArrowUpRight size={10} color={C.green}/>:<ArrowDownRight size={10} color={C.red}/>}
          <span style={{fontSize:10,fontWeight:600,color:isUp?C.green:C.red}}>{Math.abs(trend)}%</span>
        </div>
      </div>
      <div style={{color:C.textPri,fontSize:26,fontWeight:700,lineHeight:1,marginBottom:4}}>{value}</div>
      <div style={{color:C.textMuted,fontSize:11,marginBottom:3}}>{label}</div>
      <div style={{color:isUp?C.green:C.red,fontSize:11,fontWeight:500}}>{isUp?'+':''}{trend}% {note}</div>
    </div>
  );
}

function Card({title,subtitle,action,children,style={}}) {
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden',...style}}>
      {(title||action)&&(
        <div style={{padding:'20px 24px 0',display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18}}>
          <div>
            <h3 style={{color:C.textPri,fontSize:14,fontWeight:600,margin:0}}>{title}</h3>
            {subtitle&&<p style={{color:C.textMuted,fontSize:11,margin:'3px 0 0'}}>{subtitle}</p>}
          </div>
          {action&&<div>{action}</div>}
        </div>
      )}
      <div style={{padding:'0 24px 22px'}}>{children}</div>
    </div>
  );
}

function TTip({active,payload,label}) {
  if(!active||!payload?.length) return null;
  return (
    <div style={{background:'#0D1929',border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 14px',boxShadow:'0 8px 24px rgba(0,0,0,0.5)'}}>
      <p style={{color:C.textSec,fontSize:10,marginBottom:5}}>{label}</p>
      {payload.map((p,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:7,marginBottom:2}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:p.color}}/>
          <span style={{color:C.textSec,fontSize:11}}>{p.name}:</span>
          <span style={{color:C.textPri,fontSize:12,fontWeight:600}}>{fmtK(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function InvStatusBadge({status}) {
  const m={paid:{bg:C.greenSoft,c:C.green},pending:{bg:C.amberSoft,c:C.amber},overdue:{bg:C.redSoft,c:C.red}};
  const s=m[status]??{bg:C.blueSoft,c:C.blue};
  return <span style={{background:s.bg,color:s.c,borderRadius:20,padding:'3px 10px',fontSize:11,fontWeight:600,textTransform:'capitalize'}}>{status}</span>;
}

export default function FinanceIndex({stats={},monthly=[],transactions=[],expenses=[],invoices=[]}) {
  const [chartMetric,setChartMetric]=useState('revenue');
  const tabs=[{k:'revenue',l:'Revenue',c:C.blue},{k:'profit',l:'Profit',c:C.green},{k:'expenses',l:'Expenses',c:C.red}];
  const act=tabs.find(t=>t.k===chartMetric);
  const gradId=`gf${chartMetric}`;

  return (
    <AdminLayout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*{font-family:'Plus Jakarta Sans',sans-serif;box-sizing:border-box;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp 0.4s ease both;}.fu1{animation-delay:.05s}.fu2{animation-delay:.10s}.fu3{animation-delay:.15s}`}</style>
      <div style={{background:C.bg,minHeight:'100vh',padding:'0 0 56px'}}>

        {/* Header */}
        <div className="fu" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:14,marginBottom:24}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:5}}>
              <div style={{background:C.blueSoft,border:`1px solid ${C.blue}33`,borderRadius:10,padding:8,display:'flex'}}>
                <BarChart2 size={17} color={C.blue}/>
              </div>
              <h1 style={{color:C.textPri,fontSize:21,fontWeight:700,margin:0}}>Finance</h1>
            </div>
            <p style={{color:C.textSec,fontSize:13,margin:0}}>Revenue, expenses, transactions & invoices</p>
          </div>
          <div style={{display:'flex',gap:9}}>
            <button onClick={()=>window.location.reload()} style={{background:C.card,border:`1px solid ${C.border}`,color:C.textSec,borderRadius:10,padding:'7px 14px',fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',gap:6,transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.color=C.blue;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSec;}}>
              <RefreshCw size={12}/> Refresh
            </button>
            <button style={{background:`linear-gradient(135deg,${C.blue},${C.blueD})`,border:'none',color:'#fff',borderRadius:10,padding:'7px 16px',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6,boxShadow:`0 4px 14px ${C.blue}35`}}>
              <Download size={12}/> Export
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="fu fu1" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:14,marginBottom:22}}>
          <KpiCard icon={DollarSign}   label="Total Revenue"   value={fmt$(stats.totalRevenue)}  trend={stats.monthTrend??0} note="vs last month" color={C.blue}/>
          <KpiCard icon={TrendingUp}   label="This Month"      value={fmt$(stats.thisMonth)}     trend={stats.monthTrend??0} note="vs last month" color={C.green}/>
          <KpiCard icon={Wallet}       label="Net Revenue"     value={fmt$(stats.netRevenue)}    trend={2.4}                 note="after refunds" color={C.purple}/>
          <KpiCard icon={TrendingDown} label="Total Refunds"   value={fmt$(stats.totalRefunds)}  trend={-1.2}                note="vs last month" color={C.red}/>
          <KpiCard icon={CreditCard}   label="Avg Order Value" value={fmt$(stats.avgOrderValue)} trend={stats.monthTrend??0} note="per order"     color={C.amber}/>
        </div>

        {/* Revenue chart */}
        <div className="fu fu2" style={{marginBottom:22}}>
          <Card title="Revenue Overview" subtitle="12-month financial performance"
            action={
              <div style={{display:'flex',gap:6}}>
                {tabs.map(t=>(
                  <button key={t.k} onClick={()=>setChartMetric(t.k)} style={{background:chartMetric===t.k?`${t.c}18`:'transparent',border:`1px solid ${chartMetric===t.k?t.c+'55':C.border}`,color:chartMetric===t.k?t.c:C.textSec,borderRadius:8,padding:'5px 12px',fontSize:11,fontWeight:chartMetric===t.k?600:400,cursor:'pointer',transition:'all 0.2s'}}>{t.l}</button>
                ))}
              </div>
            }>
            {!monthly.length ? <div style={{height:240,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{color:C.textMuted,fontSize:13}}>No data</span></div> : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthly} margin={{top:5,right:8,left:0,bottom:5}}>
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={act?.c} stopOpacity="0.3"/>
                      <stop offset="100%" stopColor={act?.c} stopOpacity="0.01"/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke={C.border} vertical={false}/>
                  <XAxis dataKey="month" stroke={C.textMuted} tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis stroke={C.textMuted} tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false} width={52} tickFormatter={v=>fmtK(v)}/>
                  <Tooltip content={<TTip/>} cursor={{stroke:C.border,strokeWidth:1,strokeDasharray:'4 4'}}/>
                  <Area type="monotone" dataKey={chartMetric} name={act?.l} stroke={act?.c} strokeWidth={2.5} fill={`url(#${gradId})`} dot={false} activeDot={{r:5,fill:act?.c,stroke:C.card,strokeWidth:2}}/>
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Transactions + Expense breakdown */}
        <div className="fu fu3" style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:18,marginBottom:22}}>
          {/* Recent Transactions */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden'}}>
            <div style={{padding:'20px 24px 0',marginBottom:14}}>
              <h3 style={{color:C.textPri,fontSize:14,fontWeight:600,margin:0}}>Recent Transactions</h3>
              <p style={{color:C.textMuted,fontSize:11,margin:'3px 0 0'}}>Latest payment activity</p>
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
                  {['Ref','Customer','Amount','Method','Status','Date'].map((h,i)=>(
                    <th key={i} style={{padding:'9px 18px',textAlign:i<2?'left':'center',color:C.textMuted,fontSize:10,fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase'}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {transactions.map((t,i)=>(
                    <tr key={i} style={{borderBottom:`1px solid ${C.border}`,transition:'background 0.15s'}}
                      onMouseEnter={e=>e.currentTarget.style.background=C.cardHov}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{padding:'11px 18px'}}><span style={{color:C.textSec,fontSize:11,fontFamily:'monospace'}}>{t.ref}</span></td>
                      <td style={{padding:'11px 18px'}}><span style={{color:C.textPri,fontSize:12,fontWeight:500}}>{t.customer}</span></td>
                      <td style={{textAlign:'center',padding:'11px 18px'}}><span style={{color:C.green,fontSize:12,fontWeight:700}}>{fmt$(t.amount)}</span></td>
                      <td style={{textAlign:'center',padding:'11px 18px'}}><span style={{background:C.blueSoft,color:C.blue,borderRadius:20,padding:'2px 8px',fontSize:10,fontWeight:500}}>{t.method}</span></td>
                      <td style={{textAlign:'center',padding:'11px 18px'}}>
                        <span style={{background:t.status==='completed'?C.greenSoft:t.status==='pending'?C.amberSoft:C.blueSoft,color:t.status==='completed'?C.green:t.status==='pending'?C.amber:C.blue,borderRadius:20,padding:'2px 8px',fontSize:10,fontWeight:600,textTransform:'capitalize'}}>{t.status}</span>
                      </td>
                      <td style={{textAlign:'center',padding:'11px 18px'}}><span style={{color:C.textMuted,fontSize:11}}>{t.date}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expense Breakdown */}
          <Card title="Expense Breakdown" subtitle="Cost distribution by category">
            {!expenses.length ? <div style={{padding:'40px 0',textAlign:'center'}}><span style={{color:C.textMuted,fontSize:12}}>No data</span></div> : (<>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={expenses} cx="50%" cy="50%" innerRadius={44} outerRadius={70} dataKey="amount" paddingAngle={3} strokeWidth={0}>
                    {expenses.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:'#0D1929',border:`1px solid ${C.border}`,borderRadius:10}} formatter={v=>[fmt$(v),'Amount']} itemStyle={{color:C.textPri}}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:10}}>
                {expenses.map((e,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:8,height:8,borderRadius:'50%',background:e.color}}/>
                      <span style={{color:C.textSec,fontSize:12}}>{e.category}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <span style={{color:e.color,fontSize:11,fontWeight:600}}>{e.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </>)}
          </Card>
        </div>

        {/* Invoices */}
        <div className="fu" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden'}}>
          <div style={{padding:'20px 24px 0',marginBottom:14}}>
            <h3 style={{color:C.textPri,fontSize:14,fontWeight:600,margin:0}}>Invoices</h3>
            <p style={{color:C.textMuted,fontSize:11,margin:'3px 0 0'}}>Recent billing records</p>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
                {['Invoice','Customer','Amount','Status','Due Date','Issued'].map((h,i)=>(
                  <th key={i} style={{padding:'9px 20px',textAlign:i<2?'left':'center',color:C.textMuted,fontSize:10,fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase'}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {invoices.map((inv,i)=>(
                  <tr key={i} style={{borderBottom:`1px solid ${C.border}`,transition:'background 0.15s'}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.cardHov}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{padding:'12px 20px'}}><span style={{color:C.blue,fontSize:12,fontWeight:500,fontFamily:'monospace'}}>{inv.id}</span></td>
                    <td style={{padding:'12px 20px'}}><span style={{color:C.textPri,fontSize:12,fontWeight:500}}>{inv.customer}</span></td>
                    <td style={{textAlign:'center',padding:'12px 20px'}}><span style={{color:C.green,fontSize:13,fontWeight:700}}>{fmt$(inv.amount)}</span></td>
                    <td style={{textAlign:'center',padding:'12px 20px'}}><InvStatusBadge status={inv.status}/></td>
                    <td style={{textAlign:'center',padding:'12px 20px'}}><span style={{color:inv.status==='overdue'?C.red:C.textMuted,fontSize:12}}>{inv.due}</span></td>
                    <td style={{textAlign:'center',padding:'12px 20px'}}><span style={{color:C.textMuted,fontSize:11}}>{inv.date}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

