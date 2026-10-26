"use client";
import { Card } from "@/components/ui";
export default function Unavailable({title}: {title: string}) { return <><h1 className="font-display text-3xl text-plum">{title}</h1><Card className="mt-6 p-8"><p className="text-muted">Todavía no hay información disponible en este módulo.</p><p className="mt-2 text-sm text-muted">Las operaciones de este espacio estarán disponibles próximamente.</p></Card></>; }
