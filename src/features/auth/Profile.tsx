"use client";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { verifyEmail } from "./actions";
import { api } from "@/lib/api";
import { authError } from "@/lib/firebase/errors";
import { Button, Input, Label, Card } from "@/components/ui";
export default function Profile() {
 const {me, refresh, logout} = useAuth(); const [message,setMessage] = useState(""); const [busy,setBusy] = useState(false);
 async function run(fn: () => Promise<unknown>) { setBusy(true); setMessage(""); try { await fn(); setMessage("Listo. Revisá tu correo si solicitaste verificación."); } catch(e) { setMessage(authError(e)); } finally { setBusy(false); } }
 if (!me) return <p className="text-muted">Cargando perfil…</p>;
 return <Card className="max-w-xl p-6"><h1 className="font-display text-3xl">Mi perfil</h1><p className="my-4 text-muted">{me.email}</p><form className="space-y-4" onSubmit={e => {e.preventDefault(); const data = new FormData(e.currentTarget); void run(async () => { await api("/users/me", {method: "PATCH",body: JSON.stringify({displayName: data.get("displayName"),phone: data.get("phone")})}); await refresh(); });}}><Label htmlFor="profile-name">Nombre</Label><Input id="profile-name" name="displayName" required maxLength={100} defaultValue={me.profile.displayName}/><Label htmlFor="profile-phone">Teléfono</Label><Input id="profile-phone" name="phone" maxLength={30} defaultValue={me.profile.phone}/><Button type="submit" loading={busy}>Guardar perfil</Button></form>{!me.emailVerified && <Button className="mt-4" variant="outline" disabled={busy} onClick={() => void run(verifyEmail)}>Verificar email</Button>}<Button className="mt-4 ml-3" variant="ghost" disabled={busy} onClick={() => void run(logout)}>Cerrar sesión</Button>{message && <p role="status" className="mt-4 text-sm text-deep-rose">{message}</p>}</Card>;
}
