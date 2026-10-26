import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";
export const metadata: Metadata = { title: "lashess-priir — Estudio de Pestañas, Cejas & Belleza", description: "Estudio de belleza especializado en extensiones de pestañas, lifting, diseño y laminado de cejas." };
export default function RootLayout({children}: {children: React.ReactNode}) { return <html lang="es-UY"><body><Providers>{children}</Providers></body></html>; }
