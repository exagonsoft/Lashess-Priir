"use client";
import { useEffect, useRef, useState } from "react";
import { collection, query, orderBy, limitToLast, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/features/auth/AuthProvider";
import { firebaseClient } from "@/lib/firebase/client";
import { api } from "@/lib/api";
import { useLiveData } from "./LiveData";
import { Button, Avatar, Badge } from "@/components/ui";
import type { MessageRecord } from "@/types/integration";
export default function Messenger(){
 const {CONVERSATIONS}=useLiveData();const {me,user}=useAuth();const [selected,setSelected]=useState("");
 const active=CONVERSATIONS.find(t=>t.id===selected)??CONVERSATIONS[0];
 const [text,setText]=useState("");const [messages,setMessages]=useState<MessageRecord[]>([]);const [loading,setLoading]=useState(false);const [error,setError]=useState("");const [sending,setSending]=useState(false);const pending=useRef<{id:string;text:string;thread:string}|null>(null);const busy=useRef(false);
 useEffect(()=>{setMessages([]);setError("");if(!active||!me)return;let disposed=false;setLoading(true);
 const path="salons/"+me.salonId+"/chatThreads/"+active.id+"/messages";
 if(!user||user.uid!==me.uid){setLoading(false);setError("Volvé a iniciar sesión para recibir mensajes en vivo.");return;}
 let unsubscribe=()=>{};try{unsubscribe=onSnapshot(query(collection(firebaseClient().db,path),orderBy("createdAt"),limitToLast(50)),snapshot=>{if(disposed)return;setMessages(snapshot.docs.filter(d=>d.data().fixture!==true&&d.data().salonId===me.salonId).map(d=>({id:d.id,senderUid:String(d.data().senderUid??""),senderRole:String(d.data().senderRole??""),text:String(d.data().text??""),createdAt:d.data().createdAt?.toDate?.().toISOString()??""})));setLoading(false);api("/chat/threads/"+active.id+"/read",{method:"POST"}).catch(()=>setError("No se pudo guardar el estado de lectura."));},()=>{setLoading(false);setError("No se pudieron cargar los mensajes. Revisá tu sesión y recargá la página.");});}catch{setLoading(false);setError("No se pudo iniciar la conexión de mensajes.");}
 return ()=>{disposed=true;unsubscribe();};
 },[active,me,user]);
 async function send(){if(!active||!text.trim()||busy.current)return;busy.current=true;setSending(true);setError("");const attempt=pending.current?.text===text.trim()&&pending.current.thread===active.id?pending.current:{id:crypto.randomUUID(),text:text.trim(),thread:active.id};pending.current=attempt;try{await api("/chat/threads/"+active.id+"/messages",{method:"POST",body:JSON.stringify({id:attempt.id,text:attempt.text})});setText("");pending.current=null;}catch{setError("No se pudo enviar. Podés reintentar sin duplicar el mensaje.");}finally{busy.current=false;setSending(false);}}
 return <div className="grid min-h-[520px] grid-cols-1 overflow-hidden rounded-xl border border-border-soft bg-white lg:grid-cols-[280px_1fr]">
 <div className="border-r border-border-soft">{CONVERSATIONS.length===0&&<p className="p-5 text-muted">No hay conversaciones disponibles.</p>}{CONVERSATIONS.map(t=><button key={t.id} className="flex w-full items-start gap-3 border-b border-border-soft p-4 text-left hover:bg-blush/30" onClick={()=>setSelected(t.id)}><Avatar name={t.customerName}/><span><strong className="text-plum">{t.customerName}</strong><p className="text-xs text-muted">{t.lastMessage}</p><Badge>{t.status}</Badge></span></button>)}</div>
 <div className="flex flex-col"><div className="border-b border-border-soft p-4 font-semibold text-plum">{active?.customerName??"Seleccioná una conversación"}</div><div className="flex-1 space-y-3 bg-blush/10 p-4" aria-live="polite">{loading&&<p>Cargando mensajes…</p>}{!loading&&active&&messages.length===0&&<p className="text-muted">Todavía no hay mensajes.</p>}{messages.map(m=><div key={m.id} className={"flex "+(m.senderUid===me?.uid?"justify-end":"justify-start")}><div className={"max-w-[80%] rounded-2xl px-4 py-3 text-sm "+(m.senderUid===me?.uid?"bg-fashion text-white":"bg-white text-plum shadow-sm")}><p>{m.text}</p><small>{m.createdAt?new Intl.DateTimeFormat("es-UY",{dateStyle:"short",timeStyle:"short",timeZone:"America/Montevideo"}).format(new Date(m.createdAt)):""}</small></div></div>)}</div>{error&&<p role="alert" className="p-3 text-red-700">{error}</p>}<form className="flex gap-2 border-t border-border-soft p-3" onSubmit={e=>{e.preventDefault();void send();}}><input aria-label="Mensaje" maxLength={4000} disabled={!active||active.fixture||sending} value={text} onChange={e=>setText(e.target.value)} className="min-w-0 flex-1 rounded-full border border-border-soft px-4 py-2"/><Button type="submit" disabled={!active||active.fixture||sending||!text.trim()}>{sending?"Enviando…":"Enviar"}</Button></form></div>
 </div>;
}
