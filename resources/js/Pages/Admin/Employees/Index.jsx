import React, { useState } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import {
  Users, UserCheck, Coffee, Building2, DollarSign,
  Search, Plus, Mail, Phone, CheckCircle, BarChart2,
} from 'lucide-react';

const C = {
  bg:'#0B1426', panel:'#111827', card:'#141E2E', cardHov:'#172236',
  border:'#1E2D42', blue:'#3B82F6', blueD:'#2563EB',
  blueSoft:'rgba(59,130,246,0.12)',
  green:'#10B981', greenSoft:'rgba(16,185,129,0.12)',
  amber:'#F59E0B', amberSoft:'rgba(245,158,11,0.12)',
  red:'#EF4444',   redSoft:'rgba(239,68,68,0.12)',
  purple:'#8B5CF6', purpleSoft:'rgba(139,92,246,0.12)',
  cyan:'#06B6D4',   cyanSoft:'rgba(6,182,212,0.12)',
  textPri:'#F0F6FF', textSec:'#8BA3C0', textMuted:'#4A6080',
};
const PAL=['#3B82F6','#10B981','#8B5CF6','#F59E0B','#EC4899','#06B6D4'];
const fmtN=n=>new Intl.NumberFormat('en-US').format(n??0);
const fmt$=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n??0);

function Avatar({name,i,size=42}) {
  const init=(name||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  const c=PAL[i%PAL.length];
  return <div style={{width:size,height:size,borderRadius:size*0.28,background:`${c}22`,border:`1px solid ${c}44`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:size*0.33,fontWeight:700,color:c}}>{init}</div>;
}

function StatusBadge({status}) {
  const m={active:{bg:C.greenSoft,c:C.green,l:'Active'},on_leave:{bg:C.amberSoft,c:C.amber,l:'On Leave'},inactive:{bg:C.redSoft,c:C.red,l:'Inactive'}};
  const s=m[status]??{bg:C.blueSoft,c:C.blue,l:status};
  return <span style={{background:s.bg,color:s.c,borderRadius:20,padding:'3px 10px',fontSize:11,fontWeight:600}}>{s.l}</span>;
}

function KpiCard({icon:Icon,label,value,sub,color}) {
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:'22px 24px',position:'relative',overflow:'hidden',transition:'all 0.2s'}}
      onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${color}55`;e.currentTarget.style.transform='translateY(-2px)';}}
      onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${C.border}`;e.currentTarget.style.transform='translateY(0)';}}>
      <div style={{position:'absolute',top:-24,right:-24,width:80,height:80,borderRadius:'50%',background:`${color}0d`}}/>
      <div style={{background:`${color}18`,borderRadius:10,padding:9,display:'inline-flex',marginBottom:14}}><Icon size={16} color={color}/></div>
      <div style={{color:C.textPri,fontSize:26,fontWeight:700,lineHeight:1,marginBottom:4}}>{value}</div>
      <div style={{color:C.textMuted,fontSize:11,marginBottom:sub?5:0}}>{label}</div>
      {sub&&<div style={{color:color,fontSize:11,fontWeight:500}}>{sub}</div>}
    </div>
  );
}

export default function EmployeesIndex({employees=[],stats={},departments={}}) {
  const [search,setSearch]=useState('');
  const [dept,setDept]=useState('all');
  const deptList=['all',...Object.keys(departments)];

  const filtered=employees.filter(e=>{
    const matchSearch=e.name.toLowerCase().includes(search.toLowerCase())||e.role.toLowerCase().includes(search.toLowerCase());
    const matchDept=dept==='all'||e.dept===dept;
    return matchSearch&&matchDept;
  });

  return (
    <AdminLayout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*{font-family:'Plus Jakarta Sans',sans-serif;box-sizing:border-box;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp 0.4s ease both;}.fu1{animation-delay:.05s}.fu2{animation-delay:.10s}.fu3{animation-delay:.15s}`}</style>
      <div style={{background:C.bg,minHeight:'100vh',padding:'0 0 48px'}}>

        {/* Header */}
        <div className="fu" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:14,marginBottom:24}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:5}}>
              <div style={{background:C.blueSoft,border:`1px solid ${C.blue}33`,borderRadius:10,padding:8,display:'flex'}}>
                <Users size={17} color={C.blue}/>
              </div>
              <h1 style={{color:C.textPri,fontSize:21,fontWeight:700,margin:0}}>Employees</h1>
            </div>
            <p style={{color:C.textSec,fontSize:13,margin:0}}>Manage your team members and their tasks</p>
          </div>
          <button style={{background:`linear-gradient(135deg,${C.blue},${C.blueD})`,border:'none',color:'#fff',borderRadius:10,padding:'8px 18px',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:7,boxShadow:`0 4px 14px ${C.blue}35`}}>
            <Plus size={13}/> Add Employee
          </button>
        </div>

        {/* KPI */}
        <div className="fu fu1" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:14,marginBottom:22}}>
          <KpiCard icon={Users}       label="Total Employees"  value={fmtN(stats.total)}          color={C.blue}   sub={`${stats.active} active`}/>
          <KpiCard icon={UserCheck}   label="Active"           value={fmtN(stats.active)}          color={C.green}  sub="Currently working"/>
          <KpiCard icon={Coffee}      label="On Leave"         value={fmtN(stats.on_leave)}        color={C.amber}  sub="Currently absent"/>
          <KpiCard icon={Building2}   label="Departments"      value={fmtN(stats.departments)}     color={C.purple} sub="Active divisions"/>
          <KpiCard icon={DollarSign}  label="Total Payroll"    value={fmt$(stats.total_payroll)}   color={C.cyan}   sub="Monthly salary"/>
          <KpiCard icon={CheckCircle} label="Task Completion"  value={`${stats.avg_completion}%`} color={C.green}  sub="Avg across team"/>
        </div>

        {/* Filter row */}
        <div className="fu fu2" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:'16px 20px',marginBottom:18,display:'flex',alignItems:'center',flexWrap:'wrap',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:8,flex:1,minWidth:200}}>
            <Search size={13} color={C.textMuted}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or role…"
              style={{flex:1,background:'transparent',border:'none',color:C.textPri,fontSize:13,outline:'none'}}/>
          </div>
          <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
            {deptList.map(d=>(
              <button key={d} onClick={()=>setDept(d)} style={{background:dept===d?C.blueSoft:'transparent',border:`1px solid ${dept===d?C.blue+'55':C.border}`,color:dept===d?C.blue:C.textSec,borderRadius:9,padding:'5px 13px',fontSize:12,fontWeight:dept===d?600:400,cursor:'pointer',transition:'all 0.2s',textTransform:'capitalize'}}>
                {d==='all'?'All Depts':d}
              </button>
            ))}
          </div>
        </div>

        {/* Employee cards grid */}
        <div className="fu fu3" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
          {filtered.map((emp,i)=>{
            const completion=emp.tasks>0?Math.round(emp.completed/emp.tasks*100):0;
            return (
              <div key={emp.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden',transition:'all 0.25s'}}
                onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${PAL[i%PAL.length]}44`;e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.25)';}}
                onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${C.border}`;e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}>

                {/* Header */}
                <div style={{padding:'18px 20px',display:'flex',alignItems:'flex-start',justifyContent:'space-between',borderBottom:`1px solid ${C.border}`}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <Avatar name={emp.name} i={i}/>
                    <div>
                      <p style={{color:C.textPri,fontSize:14,fontWeight:600,margin:0}}>{emp.name}</p>
                      <p style={{color:C.textMuted,fontSize:11,margin:'2px 0 0'}}>{emp.role}</p>
                    </div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
                    <StatusBadge status={emp.status}/>
                    <span style={{background:C.purpleSoft,color:C.purple,borderRadius:20,padding:'2px 8px',fontSize:10,fontWeight:500}}>{emp.dept}</span>
                  </div>
                </div>

                {/* Contact */}
                <div style={{padding:'12px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',flexDirection:'column',gap:7}}>
                  {[{icon:Mail,val:emp.email},{icon:Phone,val:emp.phone}].map(({icon:Ic,val},j)=>(
                    <div key={j} style={{display:'flex',alignItems:'center',gap:8}}>
                      <Ic size={11} color={C.textMuted}/>
                      <span style={{color:C.textSec,fontSize:12}}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* Task completion */}
                <div style={{padding:'14px 20px',borderBottom:`1px solid ${C.border}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{color:C.textSec,fontSize:12}}>Task Completion</span>
                    <span style={{color:completion>=80?C.green:completion>=50?C.amber:C.red,fontSize:12,fontWeight:600}}>{emp.completed}/{emp.tasks}</span>
                  </div>
                  <div style={{height:5,background:C.panel,borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${completion}%`,background:`linear-gradient(90deg,${completion>=80?C.green:completion>=50?C.amber:C.red},${completion>=80?C.green:completion>=50?C.amber:C.red}88)`,borderRadius:3,transition:'width 0.8s ease'}}/>
                  </div>
                </div>

                {/* Footer */}
                <div style={{padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <span style={{color:C.textMuted,fontSize:10,display:'block'}}>Monthly Salary</span>
                    <span style={{color:C.green,fontSize:13,fontWeight:700}}>{fmt$(emp.salary)}</span>
                  </div>
                  <span style={{color:C.textMuted,fontSize:11}}>Since {new Date(emp.joined).getFullYear()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length===0&&(
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:'64px 24px',textAlign:'center'}}>
            <Users size={40} color={C.textMuted} strokeWidth={1.2} style={{margin:'0 auto 14px'}}/>
            <p style={{color:C.textPri,fontSize:15,fontWeight:600,margin:'0 0 6px'}}>No employees found</p>
            <p style={{color:C.textMuted,fontSize:12,margin:0}}>Try adjusting your filter.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
