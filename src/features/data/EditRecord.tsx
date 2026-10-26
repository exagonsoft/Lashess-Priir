"use client";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { api } from "@/lib/api";
import { useLiveData } from "./LiveData";
import { Button } from "@/components/ui";
export default function EditRecord({collection,id,initial,fixture=false}:{collection:"customers"|"products"|"suppliers"|"reviews";id:string;initial:Record<string,string|number>;fixture?:boolean}){
 const {me}=useAuth();const {reload}=useLiveData();const [values,setValues]=useState(initial);const [saving,setSaving]=useState(false);const [error,setError]=useState("");
 if(fixture||!me||!(["owner","admin"].includes(me.role)||(collection==="customers"&&me.role==="receptionist")))return null;
 const labels:Record<string,string>={name:"Nombre",email:"Correo",phone:"Teléfono",tags:"Etiquetas separadas por coma",sku:"SKU",category:"Categoría",brand:"Marca",minStock:"Stock mínimo",contact:"Contacto",response:"Respuesta",status:"Estado (Nueva, Publicada o Reportada)"};
 return <form className="mt-5 space-y-3 rounded-lg border border-border-soft p-4" onSubmit={async e=>{e.preventDefault();if(saving)return;setSaving(true);setError("");try{const payload={...values,...(collection==="customers"?{tags:String(values.tags).split(",").map(v=>v.trim()).filter(Boolean)}:{})};await api("/"+collection+"/"+id,{method:"PATCH",body:JSON.stringify(payload)});reload();}catch(e){setError(e instanceof Error?e.message:"No se pudo guardar.");}finally{setSaving(false);}}}><p className="font-semibold text-plum">Editar información</p>{Object.entries(values).map(([name,value])=><label key={name} className="block text-sm text-muted">{labels[name]??name}<input className="mt-1 w-full rounded border border-border-soft p-2 text-plum" name={name} value={value} type={typeof value==="number"?"number":"text"} onChange={e=>setValues(v=>({...v,[name]:typeof value==="number"?Number(e.target.value):e.target.value}))}/></label>)}{error&&<p role="alert" className="text-red-700">{error}</p>}<Button disabled={saving} type="submit">{saving?"Guardando…":"Guardar información"}</Button></form>;
}
