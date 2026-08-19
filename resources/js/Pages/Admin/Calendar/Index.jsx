import React, { useState, useMemo } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import {
  Calendar, ChevronLeft, ChevronRight, Clock, ShoppingCart,
  Users, Bell, Megaphone, CheckCircle, AlertCircle, Plus,
} from 'lucide-react';

const C = {
  bg:'#0B1426', panel:'#111827', card:'#141E2E', cardHov:'#172236',
  border:'#1E2D42', blue:'#3B82F6', blueD:'#2563EB',
  blueSoft:'rgba(59,130,246,0.12)',
  green:'#10B981', greenSoft:'rgba(16,185,129,0.12)',
  amber:'#F59E0B', amberSoft:'rgba(245,158,11,0.12)',
  red:'#EF4444',   redSoft:'rgba(239,68,68,0.12)',
  purple:'#8B5CF6',purpleSoft:'rgba(139,92,246,0.12)',
  pink:'#EC4899',  pinkSoft:'rgba(236,72,153,0.12)',
  textPri:'#F0F6FF', textSec:'#8BA3C0', textMuted:'#4A6080',
};

const TYPE_ICON = {
  order:    { icon: ShoppingCart, color: '#3B82F6' },
  customer: { icon: Users,        color: '#10B981' },
  reminder: { icon: Bell,         color: '#F59E0B' },
  meeting:  { icon: Users,        color: '#8B5CF6' },
  task:     { icon: CheckCircle,  color: '#EF4444' },
  campaign: { icon: Megaphone,    color: '#EC4899' },
};

const DAYS  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS= ['January','February','March','April','May','June','July','August','September','October','November','December'];

function KpiCard({icon:Icon,label,value,color}) {
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:'20px 22px',display:'flex',alignItems:'center',gap:14,transition:'all 0.2s'}}
      onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${color}55`;e.currentTarget.style.transform='translateY(-2px)';}}
      onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${C.border}`;e.currentTarget.style.transform='translateY(0)';}}>
      <div style={{background:`${color}18`,borderRadius:12,padding:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
        <Icon size={17} color={color}/>
      </div>
      <div>
        <div style={{color:C.textPri,fontSize:22,fontWeight:700,lineHeight:1,marginBottom:3}}>{value}</div>
        <div style={{color:C.textMuted,fontSize:11}}>{label}</div>
      </div>
    </div>
  );
}

export default function CalendarIndex({events=[],upcomingToday=[],currentMonth,stats={}}) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(today);
  const [selected, setSelected] = useState(null);

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  // Group events by date
  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach(ev => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [events]);

  const prevMonth = () => setViewDate(new Date(year, month-1, 1));
  const nextMonth = () => setViewDate(new Date(year, month+1, 1));

  const selectedDateStr = selected
    ? `${year}-${String(month+1).padStart(2,'0')}-${String(selected).padStart(2,'0')}`
    : null;
  const selectedEvents = selectedDateStr ? (eventsByDate[selectedDateStr] || []) : [];

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  return (
    <AdminLayout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*{font-family:'Plus Jakarta Sans',sans-serif;box-sizing:border-box;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp 0.4s ease both;}.fu1{animation-delay:.05s}.fu2{animation-delay:.10s}`}</style>
      <div style={{background:C.bg,minHeight:'100vh',padding:'0 0 48px'}}>

        {/* Header */}
        <div className="fu" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:14,marginBottom:24}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:5}}>
              <div style={{background:C.blueSoft,border:`1px solid ${C.blue}33`,borderRadius:10,padding:8,display:'flex'}}>
                <Calendar size={17} color={C.blue}/>
              </div>
              <h1 style={{color:C.textPri,fontSize:21,fontWeight:700,margin:0}}>Calendar</h1>
            </div>
            <p style={{color:C.textSec,fontSize:13,margin:0}}>Track orders, meetings, tasks & reminders</p>
          </div>
          <button style={{background:`linear-gradient(135deg,${C.blue},${C.blueD})`,border:'none',color:'#fff',borderRadius:10,padding:'8px 18px',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:7,boxShadow:`0 4px 14px ${C.blue}35`}}>
            <Plus size={13}/> Add Event
          </button>
        </div>

        {/* KPI */}
        <div className="fu fu1" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:14,marginBottom:22}}>
          <KpiCard icon={Calendar}     label="Total Events"   value={stats.total_events??0}  color={C.blue}/>
          <KpiCard icon={ShoppingCart} label="Orders Today"   value={stats.orders_today??0}  color={C.green}/>
          <KpiCard icon={Users}        label="Meetings"       value={stats.meetings??0}       color={C.purple}/>
          <KpiCard icon={CheckCircle}  label="Tasks Due"      value={stats.tasks_due??0}      color={C.amber}/>
        </div>

        {/* Calendar + Sidebar */}
        <div className="fu fu2" style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:18,alignItems:'start'}}>

          {/* Calendar grid */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden'}}>
            {/* Month nav */}
            <div style={{padding:'18px 22px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:`1px solid ${C.border}`}}>
              <button onClick={prevMonth} style={{background:C.panel,border:`1px solid ${C.border}`,color:C.textSec,borderRadius:8,padding:'6px 10px',cursor:'pointer',display:'flex',alignItems:'center',transition:'all 0.15s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.color=C.blue;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSec;}}><ChevronLeft size={14}/></button>
              <span style={{color:C.textPri,fontSize:15,fontWeight:600}}>{MONTHS[month]} {year}</span>
              <button onClick={nextMonth} style={{background:C.panel,border:`1px solid ${C.border}`,color:C.textSec,borderRadius:8,padding:'6px 10px',cursor:'pointer',display:'flex',alignItems:'center',transition:'all 0.15s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.color=C.blue;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSec;}}><ChevronRight size={14}/></button>
            </div>

            {/* Day headers */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',borderBottom:`1px solid ${C.border}`}}>
              {DAYS.map(d=><div key={d} style={{padding:'10px 0',textAlign:'center',color:C.textMuted,fontSize:11,fontWeight:600,letterSpacing:'0.05em'}}>{d}</div>)}
            </div>

            {/* Day cells */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)'}}>
              {Array.from({length: firstDay}).map((_,i)=><div key={`e${i}`} style={{minHeight:80,borderRight:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}/>)}
              {Array.from({length: daysInMonth}).map((_,i)=>{
                const day=i+1;
                const dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const dayEvents=eventsByDate[dateStr]||[];
                const isToday=dateStr===todayStr;
                const isSelected=day===selected;
                return (
                  <div key={day} onClick={()=>setSelected(day===selected?null:day)}
                    style={{minHeight:80,borderRight:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:'7px 8px',cursor:'pointer',transition:'background 0.15s',background:isSelected?`${C.blue}10`:'transparent',position:'relative'}}
                    onMouseEnter={e=>{if(!isSelected)e.currentTarget.style.background=C.cardHov;}}
                    onMouseLeave={e=>{if(!isSelected)e.currentTarget.style.background='transparent';}}>
                    <div style={{width:24,height:24,borderRadius:'50%',background:isToday?`linear-gradient(135deg,${C.blue},${C.blueD})`:'transparent',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:4,boxShadow:isToday?`0 2px 8px ${C.blue}55`:'none'}}>
                      <span style={{color:isToday?'#fff':isSelected?C.blue:C.textSec,fontSize:12,fontWeight:isToday||isSelected?700:400}}>{day}</span>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:2}}>
                      {dayEvents.slice(0,2).map((ev,j)=>(
                        <div key={j} style={{borderRadius:4,padding:'2px 5px',fontSize:9,fontWeight:500,color:'#fff',background:ev.color,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length>2&&<span style={{fontSize:9,color:C.textMuted,paddingLeft:3}}>+{dayEvents.length-2} more</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {/* Selected day events */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden'}}>
              <div style={{padding:'16px 18px',borderBottom:`1px solid ${C.border}`}}>
                <h3 style={{color:C.textPri,fontSize:13,fontWeight:600,margin:0}}>
                  {selected ? `${MONTHS[month]} ${selected}` : 'Select a day'}
                </h3>
                <p style={{color:C.textMuted,fontSize:11,margin:'2px 0 0'}}>{selectedEvents.length} event{selectedEvents.length!==1?'s':''}</p>
              </div>
              <div style={{padding:'12px 16px',maxHeight:280,overflowY:'auto',display:'flex',flexDirection:'column',gap:8}}>
                {!selected ? (
                  <p style={{color:C.textMuted,fontSize:12,textAlign:'center',padding:'20px 0'}}>Click a date to see events</p>
                ) : selectedEvents.length===0 ? (
                  <p style={{color:C.textMuted,fontSize:12,textAlign:'center',padding:'20px 0'}}>No events on this day</p>
                ) : selectedEvents.map((ev,i)=>{
                  const cfg=TYPE_ICON[ev.type]??TYPE_ICON.reminder;
                  return (
                    <div key={i} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 12px',display:'flex',gap:10,alignItems:'flex-start',transition:'border-color 0.15s'}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=`${cfg.color}44`}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                      <div style={{background:`${cfg.color}18`,borderRadius:7,padding:6,display:'flex',flexShrink:0}}>
                        <cfg.icon size={12} color={cfg.color}/>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{color:C.textPri,fontSize:12,fontWeight:500,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ev.title}</p>
                        <div style={{display:'flex',alignItems:'center',gap:5,marginTop:3}}>
                          <Clock size={9} color={C.textMuted}/>
                          <span style={{color:C.textMuted,fontSize:10}}>{ev.time}</span>
                          {ev.meta&&<span style={{color:C.textMuted,fontSize:10}}>· {ev.meta}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming today */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden'}}>
              <div style={{padding:'16px 18px',borderBottom:`1px solid ${C.border}`}}>
                <h3 style={{color:C.textPri,fontSize:13,fontWeight:600,margin:0}}>Today's Activity</h3>
                <p style={{color:C.textMuted,fontSize:11,margin:'2px 0 0'}}>{upcomingToday.length} events today</p>
              </div>
              <div style={{padding:'12px 16px',display:'flex',flexDirection:'column',gap:8}}>
                {upcomingToday.length===0 ? (
                  <p style={{color:C.textMuted,fontSize:12,textAlign:'center',padding:'16px 0'}}>No events today 🎉</p>
                ) : upcomingToday.slice(0,5).map((ev,i)=>{
                  const cfg=TYPE_ICON[ev.type]??TYPE_ICON.reminder;
                  return (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',background:C.panel,borderRadius:9,border:`1px solid ${C.border}`}}>
                      <div style={{background:`${cfg.color}18`,borderRadius:7,padding:5,display:'flex',flexShrink:0}}>
                        <cfg.icon size={11} color={cfg.color}/>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{color:C.textPri,fontSize:11,fontWeight:500,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ev.title}</p>
                        <span style={{color:C.textMuted,fontSize:10}}>{ev.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
