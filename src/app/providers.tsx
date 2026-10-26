"use client";
import { ToastProvider } from "@/components/ui";
import { AuthProvider } from "@/features/auth/AuthProvider";
export default function Providers({ children }: { children: React.ReactNode }) { return <AuthProvider><ToastProvider>{children}</ToastProvider></AuthProvider>; }
