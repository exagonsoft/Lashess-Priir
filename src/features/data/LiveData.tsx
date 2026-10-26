"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { allowedResource } from "@/lib/data-access";
import { api } from "@/lib/api";
import { useAuth } from "@/features/auth/AuthProvider";
import { collections, type DataMap, type DataPage, type Resource } from "@/types/integration";
const empty:DataMap={SERVICES:[],STYLISTS:[],CUSTOMERS:[],APPOINTMENTS:[],PRODUCTS:[],SUPPLIERS:[],PURCHASES:[],EXPENSES:[],REVIEWS:[],CONVERSATIONS:[],NOTIFICATIONS:[],EMPLOYEES:[],PAYMENTS:[],COMMISSIONS:[]};
const Context=createContext<{data:DataMap;reload:()=>void}>({data:empty,reload:()=>{}});
export function useLiveData(){const context=useContext(Context);return useMemo(()=>({...context.data,reload:context.reload,getProduct:(id:string)=>context.data.PRODUCTS.find(p=>p.id===id),getService:(id:string)=>context.data.SERVICES.find(p=>p.id===id),getStylist:(id:string)=>context.data.STYLISTS.find(p=>p.id===id)}),[context]);}
export function LiveData({resources,publicView=false,children}:{resources:Resource[];publicView?:boolean;children:React.ReactNode}){
 const {me,loading:authLoading}=useAuth();const pathname=usePathname();
 const [revision,setRevision]=useState(0);const [cursors,setCursors]=useState<Partial<Record<Resource,string>>>({});
 const resourceKey=resources.join(",");const identity=publicView?"public":me?.salonId+":"+me?.uid+":"+me?.role;
 const key=JSON.stringify([resourceKey,identity,pathname,revision,cursors]);
 const [result,setResult]=useState<{key:string;data:DataMap;pages:Partial<Record<Resource,DataPage>>;error:string|null}>({key:"",data:empty,pages:{},error:null});
 useEffect(()=>{
  if(!publicView&&!me)return;
  const controller=new AbortController();const selected=(resourceKey.split(",").filter(Boolean) as Resource[]).filter(r=>publicView || (me && allowedResource(r,me.role)));
  Promise.all(selected.map(async resource=>{
   const endpoint=resource==="CONVERSATIONS"?"chat/threads":collections[resource];
   const params=new URLSearchParams({limit:"50",view:publicView?"public":"private"});
   if(cursors[resource])params.set("cursor",cursors[resource]!);
   const parts=pathname.split("/").filter(Boolean);if(publicView&&parts.length===2&&((parts[0]==="servicios"&&resource==="SERVICES")||(parts[0]==="especialistas"&&resource==="STYLISTS")))params.set("slug",decodeURIComponent(parts[1]));
   return [resource,await api<DataPage>("/"+endpoint+"?"+params,{signal:controller.signal})] as const;
  })).then(entries=>{if(controller.signal.aborted)return;const data={...empty};const pages:Partial<Record<Resource,DataPage>>={};for(const [resource,page] of entries){Object.assign(data,{[resource]:page.items});pages[resource]=page;}setResult({key,data,pages,error:null});}).catch(()=>{if(!controller.signal.aborted)setResult({key,data:empty,pages:{},error:"No se pudieron cargar los datos. Revisá tu sesión y volvé a intentar."});});
  return ()=>controller.abort();
 },[key,resourceKey,publicView,me,pathname,cursors]);
 const reload=()=>setRevision(v=>v+1);
 if(!publicView&&authLoading)return <DataNotice message="Verificando sesión…"/>;
 if(!publicView&&!me)return <DataNotice message="Iniciá sesión para consultar esta sección." login/>;
 if(result.key!==key)return <DataNotice message="Cargando datos del salón…"/>;
 if(result.error)return <DataNotice message={result.error} retry={reload} login/>;
 const samples=Object.values(result.data).reduce((n,rows)=>n+rows.filter((r:{fixture:boolean})=>r.fixture).length,0);
 return <Context.Provider value={{data:result.data,reload}}>
  {samples>0&&<p role="status" className="border-b border-amber-200 bg-amber-50 p-3 text-center text-sm text-amber-900">Hay {samples} registros de muestra en esta página. Se identifican como [Muestra] y no representan actividad real.</p>}
  {children}
  <div className="flex flex-wrap justify-center gap-3 bg-soft-white p-4">{resources.map(resource=><div key={resource} className="text-sm text-muted">{result.data[resource].length===0&&<p>{resource==="APPOINTMENTS"?"No hay reservas programadas.":resource==="REVIEWS"?"No hay opiniones verificadas disponibles.":"No hay registros de "+collections[resource]+" disponibles."}</p>}{result.pages[resource]?.nextCursor&&<button className="rounded border border-border-soft px-3 py-2 text-plum" onClick={()=>setCursors(c=>({...c,[resource]:result.pages[resource]!.nextCursor!}))}>Siguiente página · {collections[resource]}</button>}{cursors[resource]&&<button className="ml-2 text-deep-rose" onClick={()=>setCursors(c=>({...c,[resource]:undefined}))}>Primera página</button>}</div>)}</div>
 </Context.Provider>;
}
export function DataNotice({message,retry,login=false}:{message:string;retry?:()=>void;login?:boolean}){return <div className="m-6 rounded-xl border border-border-soft bg-white p-6 text-plum" role={retry?"alert":"status"}><p>{message}</p>{retry&&<button className="mt-3 rounded bg-plum px-4 py-2 text-white" onClick={retry}>Reintentar</button>}{login&&<a className="ml-4 text-deep-rose" href="/login">Iniciar sesión</a>}</div>;}
