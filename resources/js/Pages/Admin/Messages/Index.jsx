import React, { useState } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import {
  MessageSquare, Send, Search, Circle,
  Users, CheckCheck, Clock, Inbox, Plus,
} from 'lucide-react';

const C = {
  bg:'#0B1426', panel:'#111827', card:'#141E2E', cardHov:'#172236',
  border:'#1E2D42', blue:'#3B82F6', blueD:'#2563EB',
  blueSoft:'rgba(59,130,246,0.12)',
  green:'#10B981', greenSoft:'rgba(16,185,129,0.12)',
  amber:'#F59E0B',
  red:'#EF4444',   redSoft:'rgba(239,68,68,0.12)',
  purple:'#8B5CF6',
  textPri:'#F0F6FF', textSec:'#8BA3C0', textMuted:'#4A6080',
};
const PAL=['#3B82F6','#10B981','#8B5CF6','#F59E0B','#EC4899','#06B6D4'];

// Stub chat messages per conversation
const CHATS = {
  1: [
    {from:'user', text:'Halo, pesanan saya belum datang padahal sudah 5 hari.', time:'10:24'},
    {from:'admin', text:'Halo Budi, maaf atas ketidaknyamanannya. Boleh share nomor order-nya?', time:'10:26'},
    {from:'user', text:'ORD-00123. Sudah bayar via transfer.', time:'10:27'},
    {from:'admin', text:'Terima kasih, saya cek sekarang ya. Mohon tunggu sebentar 🙏', time:'10:28'},
    {from:'user', text:'Halo, pesanan saya belum datang.', time:'10:30'},
  ],
  2: [
    {from:'user', text:'Terima kasih, barang sudah diterima dalam kondisi baik!', time:'09:15'},
    {from:'admin', text:'Senang mendengarnya! Jangan lupa berikan ulasan ya 😊', time:'09:17'},
  ],
  3: [
    {from:'user', text:'Bisa minta invoice untuk pesanan ORD-00089?', time:'08:45'},
    {from:'admin', text:'Tentu, saya kirimkan ke email kamu ya.', time:'08:47'},
    {from:'user', text:'Bisa minta invoice?', time:'08:50'},
  ],
  4: [
    {from:'user', text:'Stok produk A sudah kami kirim, total 200 pcs.', time:'Kemarin'},
    {from:'admin', text:'Terima kasih, kami konfirmasi penerimaan barang.', time:'Kemarin'},
  ],
  5: [
    {from:'user', text:'Produknya rusak saat sampai. Bisa refund?', time:'07:00'},
    {from:'admin', text:'Mohon maaf! Tolong kirim foto kerusakan ya, akan kami proses refund.', time:'07:05'},
    {from:'user', text:'Produknya rusak saat sampai.', time:'07:10'},
    {from:'user', text:'Ini fotonya [foto].', time:'07:11'},
  ],
  6: [
    {from:'admin', text:'Tiket #234 telah diselesaikan oleh Tim Support.', time:'Kemarin'},
    {from:'user', text:'Terima kasih, semua sudah berjalan baik.', time:'Kemarin'},
  ],
};

function Avatar({name,i,size=38,online=false}) {
  const init=(name||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  const c=PAL[i%PAL.length];
  return (
    <div style={{position:'relative',flexShrink:0}}>
      <div style={{width:size,height:size,borderRadius:'50%',background:`${c}22`,border:`1px solid ${c}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.33,fontWeight:700,color:c}}>{init}</div>
      {online&&<div style={{position:'absolute',bottom:0,right:0,width:10,height:10,borderRadius:'50%',background:C.green,border:`2px solid ${C.card}`}}/>}
    </div>
  );
}

function RoleBadge({role}) {
  const m={buyer:{bg:'rgba(59,130,246,0.12)',c:'#3B82F6'},supplier:{bg:'rgba(245,158,11,0.12)',c:'#F59E0B'},internal:{bg:'rgba(139,92,246,0.12)',c:'#8B5CF6'}};
  const s=m[role]??m.buyer;
  return <span style={{background:s.bg,color:s.c,borderRadius:20,padding:'2px 7px',fontSize:9,fontWeight:600,textTransform:'capitalize'}}>{role}</span>;
}

export default function MessagesIndex({conversations=[],stats={}}) {
  const [activeId,setActiveId]=useState(conversations[0]?.id ?? null);
  const [search,setSearch]=useState('');
  const [message,setMessage]=useState('');
  const [chats,setChats]=useState(CHATS);

  const active=conversations.find(c=>c.id===activeId);
  const activeIdx=conversations.findIndex(c=>c.id===activeId);
  const messages=chats[activeId]||[];

  const filtered=conversations.filter(c=>
    c.name.toLowerCase().includes(search.toLowerCase())||
    c.last_message.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage=()=>{
    if(!message.trim()) return;
    setChats(prev=>({
      ...prev,
      [activeId]:[...(prev[activeId]||[]),{from:'admin',text:message,time:'Now'}],
    }));
    setMessage('');
  };

  return (
    <AdminLayout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*{font-family:'Plus Jakarta Sans',sans-serif;box-sizing:border-box;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp 0.4s ease both;}`}</style>
      <div style={{background:C.bg,minHeight:'100vh',padding:'0 0 0'}}>

        {/* Header */}
        <div className="fu" style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:14,marginBottom:20}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:5}}>
              <div style={{background:C.blueSoft,border:`1px solid ${C.blue}33`,borderRadius:10,padding:8,display:'flex'}}>
                <MessageSquare size={17} color={C.blue}/>
              </div>
              <h1 style={{color:C.textPri,fontSize:21,fontWeight:700,margin:0}}>Messages</h1>
            </div>
            <p style={{color:C.textSec,fontSize:13,margin:0}}>Customer & team communication hub</p>
          </div>
          {/* Stats pills */}
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {[
              {icon:Inbox,   label:`${stats.total??0} Total`,     color:C.blue},
              {icon:Circle,  label:`${stats.unread??0} Unread`,   color:C.red},
              {icon:Users,   label:`${stats.online??0} Online`,   color:C.green},
              {icon:CheckCheck,label:`${stats.resolved??0} Done`, color:C.purple},
            ].map((s,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:'6px 12px',display:'flex',alignItems:'center',gap:6}}>
                <s.icon size={11} color={s.color}/>
                <span style={{color:C.textSec,fontSize:11,fontWeight:500}}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat layout */}
        <div className="fu" style={{display:'grid',gridTemplateColumns:'300px 1fr',gap:0,background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:'hidden',height:'calc(100vh - 180px)'}}>

          {/* Conversation list */}
          <div style={{borderRight:`1px solid ${C.border}`,display:'flex',flexDirection:'column',overflow:'hidden'}}>
            {/* Search */}
            <div style={{padding:'14px 14px 10px',borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:'flex',alignItems:'center',gap:8,background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:'7px 12px'}}>
                <Search size={12} color={C.textMuted}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations…"
                  style={{flex:1,background:'transparent',border:'none',color:C.textPri,fontSize:12,outline:'none'}}/>
              </div>
            </div>
            {/* List */}
            <div style={{flex:1,overflowY:'auto'}}>
              {filtered.map((conv,i)=>(
                <div key={conv.id} onClick={()=>setActiveId(conv.id)}
                  style={{padding:'12px 14px',borderBottom:`1px solid ${C.border}`,cursor:'pointer',background:activeId===conv.id?`${C.blue}10`:'transparent',transition:'background 0.15s',display:'flex',gap:10,alignItems:'flex-start'}}
                  onMouseEnter={e=>{if(activeId!==conv.id)e.currentTarget.style.background=C.cardHov;}}
                  onMouseLeave={e=>{if(activeId!==conv.id)e.currentTarget.style.background='transparent';}}>
                  <Avatar name={conv.name} i={conversations.indexOf(conv)} online={conv.online}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                      <span style={{color:C.textPri,fontSize:12,fontWeight:600}}>{conv.name}</span>
                      <span style={{color:C.textMuted,fontSize:10,flexShrink:0,marginLeft:6}}>{conv.last_time}</span>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{color:C.textSec,fontSize:11,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:140}}>{conv.last_message}</span>
                      {conv.unread>0&&<span style={{background:C.red,color:'#fff',borderRadius:20,padding:'1px 6px',fontSize:10,fontWeight:700,flexShrink:0,marginLeft:4}}>{conv.unread}</span>}
                    </div>
                    <RoleBadge role={conv.role}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat window */}
          {active ? (
            <div style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
              {/* Chat header */}
              <div style={{padding:'14px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
                <Avatar name={active.name} i={activeIdx} online={active.online} size={36}/>
                <div>
                  <p style={{color:C.textPri,fontSize:13,fontWeight:600,margin:0}}>{active.name}</p>
                  <div style={{display:'flex',alignItems:'center',gap:6,marginTop:2}}>
                    {active.online
                      ? <><Circle size={7} fill={C.green} color={C.green}/><span style={{color:C.green,fontSize:11}}>Online</span></>
                      : <><Clock size={10} color={C.textMuted}/><span style={{color:C.textMuted,fontSize:11}}>Last seen {active.last_time}</span></>
                    }
                    <span style={{color:C.textMuted,fontSize:11}}>·</span>
                    <RoleBadge role={active.role}/>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div style={{flex:1,overflowY:'auto',padding:'18px 20px',display:'flex',flexDirection:'column',gap:12}}>
                {messages.map((msg,i)=>{
                  const isAdmin=msg.from==='admin';
                  return (
                    <div key={i} style={{display:'flex',justifyContent:isAdmin?'flex-end':'flex-start'}}>
                      <div style={{maxWidth:'72%'}}>
                        <div style={{background:isAdmin?`linear-gradient(135deg,${C.blue},${C.blueD})`:`${C.panel}`,border:isAdmin?'none':`1px solid ${C.border}`,borderRadius:isAdmin?'14px 14px 2px 14px':'14px 14px 14px 2px',padding:'10px 14px',boxShadow:isAdmin?`0 4px 12px ${C.blue}35`:'none'}}>
                          <p style={{color:isAdmin?'#fff':C.textPri,fontSize:13,lineHeight:1.5,margin:0}}>{msg.text}</p>
                        </div>
                        <div style={{display:'flex',justifyContent:isAdmin?'flex-end':'flex-start',marginTop:3}}>
                          <span style={{color:C.textMuted,fontSize:10}}>{msg.time}{isAdmin&&<span> · Sent</span>}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div style={{padding:'14px 18px',borderTop:`1px solid ${C.border}`,display:'flex',gap:10,alignItems:'center',flexShrink:0}}>
                <input value={message} onChange={e=>setMessage(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&sendMessage()}
                  placeholder={`Reply to ${active.name}…`}
                  style={{flex:1,background:C.panel,border:`1px solid ${C.border}`,color:C.textPri,borderRadius:12,padding:'10px 14px',fontSize:13,outline:'none',transition:'border-color 0.2s'}}
                  onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.border}/>
                <button onClick={sendMessage} style={{background:`linear-gradient(135deg,${C.blue},${C.blueD})`,border:'none',color:'#fff',borderRadius:12,padding:'10px 16px',cursor:'pointer',display:'flex',alignItems:'center',gap:7,fontSize:12,fontWeight:600,boxShadow:`0 4px 12px ${C.blue}35`,flexShrink:0,transition:'all 0.2s'}}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 6px 18px ${C.blue}50`}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 4px 12px ${C.blue}35`}>
                  <Send size={13}/> Send
                </button>
              </div>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14}}>
              <div style={{width:72,height:72,borderRadius:'50%',background:C.blueSoft,border:`1px solid ${C.blue}33`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <MessageSquare size={30} color={C.blue} strokeWidth={1.5}/>
              </div>
              <p style={{color:C.textPri,fontSize:15,fontWeight:600,margin:0}}>Select a conversation</p>
              <p style={{color:C.textMuted,fontSize:12,margin:0}}>Choose from the list to start messaging</p>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
