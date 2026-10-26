"use client";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, limit, onSnapshot, type DocumentData, type QueryConstraint } from "firebase/firestore";
import { firebaseClient } from "@/lib/firebase/client";
import { useAuth } from "@/features/auth/AuthProvider";
import type { Me } from "@/types/domain";
type Kind = "appointments" | "schedule" | "messages" | "notifications" | "crm";
type State = { data: DocumentData[]; loading: boolean; error: string | null };
// Subscribe only in the active screen. Key changes dispose subscriptions before replacement.
function useScopedListener(kind: Kind, resource?: string) {
 const { me, user } = useAuth();
 const key = JSON.stringify([kind, resource, me?.uid, me?.salonId, me?.role, user?.uid]);
 const [state, setState] = useState<State & { key: string }>({ data: [], loading: false, error: null, key });
 useEffect(() => {
  if (!me || !user || user.uid !== me.uid) return;
  let unsubscribe = () => {};
  setState({key, data: [], loading: true, error: null});
  try {
   const { path, constraints } = listenerQuery(kind, me, resource);
   unsubscribe = onSnapshot(query(collection(firebaseClient().db, path), ...constraints), snapshot => setState({ key, data: snapshot.docs.filter(d=>d.data().fixture!==true && d.data().salonId===me.salonId).map(d => ({...d.data(), id: d.id})), loading: false, error: null }), () => setState({key, data: [], loading: false, error: "No se pudieron cargar las actualizaciones"}));
  } catch { setState({key, data: [], loading: false, error: "No se pudo iniciar la conexión"}); }
  return () => unsubscribe();
 // The stable key contains every identity and query input; avoid unstable object subscriptions.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [key]);
 return state.key === key ? state : { data: [], loading: Boolean(me && user), error: null };
}
export function listenerQuery(kind: Kind, me: Me, resource?: string): {path: string; constraints: QueryConstraint[]} {
 const base = "salons/" + me.salonId + "/";
 if (kind === "notifications") return {path: base + "notifications", constraints: [where("recipientUid", "==", me.uid), orderBy("createdAt", "desc"), limit(30)]};
 if (kind === "messages") { if (!resource || !/^[a-zA-Z0-9_-]+$/.test(resource)) throw new Error("Thread required"); return {path: base + "chatThreads/" + resource + "/messages", constraints: [orderBy("createdAt", "desc"), limit(50)]}; }
 if (kind === "crm") { if (!["owner","admin","receptionist"].includes(me.role)) throw new Error("Forbidden"); return {path: base + "appointments", constraints: [orderBy("startsAt"), limit(50)]}; }
 if (kind === "schedule" && me.role !== "stylist") throw new Error("Forbidden");
 return {path: base + "appointments", constraints: [where(kind === "schedule" ? "stylistUid" : "customerUid", "==", me.uid), orderBy("startsAt"), limit(50)]};
}
export const useAppointmentStatus = () => useScopedListener("appointments");
export const useStylistSchedule = () => useScopedListener("schedule");
export const useCustomerMessages = (threadId: string) => useScopedListener("messages", threadId);
export const useNotifications = () => useScopedListener("notifications");
export const useCrmAppointments = () => useScopedListener("crm");
