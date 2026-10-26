"use client";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider, sendEmailVerification, sendPasswordResetEmail, updateProfile, type User } from "firebase/auth";
import { firebaseClient } from "@/lib/firebase/client";
import { api } from "@/lib/api";
import type { Me } from "@/types/domain";
export async function establishSession(user: User) { await api("/auth/session", {method: "POST", body: JSON.stringify({idToken: await user.getIdToken(true)})}); return api<Me>("/auth/me"); }
export function homeFor(me: Me) { return me.role === "customer" ? "/cuenta" : me.role === "stylist" ? "/staff" : "/admin"; }
export async function login(email: string, password: string) { const result = await signInWithEmailAndPassword(firebaseClient().auth, email, password); return establishSession(result.user); }
export async function register(email: string, password: string, displayName: string, phone: string) { const result = await createUserWithEmailAndPassword(firebaseClient().auth, email, password); await updateProfile(result.user, {displayName}); await establishSession(result.user); await api("/users/me", {method: "PATCH", body: JSON.stringify({displayName, phone})}); await sendEmailVerification(result.user); return api<Me>("/auth/me"); }
export async function social(provider: "google" | "apple") { const p = provider === "google" ? new GoogleAuthProvider() : new OAuthProvider("apple.com"); if (provider === "apple") { p.addScope("email"); p.addScope("name"); } const result = await signInWithPopup(firebaseClient().auth, p); return establishSession(result.user); }
export async function resetPassword(email: string) { await sendPasswordResetEmail(firebaseClient().auth, email); }
export async function verifyEmail() { const user = firebaseClient().auth.currentUser; if (!user) throw new Error("Iniciá sesión nuevamente"); await sendEmailVerification(user); }
