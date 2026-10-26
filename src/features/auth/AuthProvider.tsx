"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { firebaseClient } from "@/lib/firebase/client";
import { authError } from "@/lib/firebase/errors";
import { api } from "@/lib/api";
import type { Me } from "@/types/domain";
type State = { user: User | null; me: Me | null; loading: boolean; error: string | null; refresh: () => Promise<Me>; logout: () => Promise<void> };
const Context = createContext<State | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
 const [user, setUser] = useState<User | null>(null), [me, setMe] = useState<Me | null>(null), [loading, setLoading] = useState(true), [error, setError] = useState<string | null>(null);
 async function refresh() { const profile = await api<Me>("/auth/me"); setMe(profile); return profile; }
 async function logout() { await api("/auth/session", { method: "DELETE" }); await signOut(firebaseClient().auth); setMe(null); window.location.assign("/login"); }
 useEffect(() => { let active = true; let unsubscribe = () => {}; let generation = 0;
  try { unsubscribe = onAuthStateChanged(firebaseClient().auth, async current => { const version = ++generation; if (active) setUser(current); try { const profile = await api<Me>("/auth/me"); if (active && version === generation) setMe(profile); } catch { if (active && version === generation) setMe(null); } finally { if (active && version === generation) setLoading(false); } }); }
  catch (e) { setError(authError(e)); setLoading(false); }
  return () => { active = false; unsubscribe(); };
 }, []);
 return <Context.Provider value={{user, me, loading, error, refresh, logout}}>{children}</Context.Provider>;
}
export function useAuth() { const value = useContext(Context); if (!value) throw new Error("AuthProvider required"); return value; }
