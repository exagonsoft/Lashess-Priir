import Link from "next/link";
export default function Page() { return <main className="min-h-screen bg-soft-white p-10 text-center"><h1 className="font-display text-3xl">Acceso restringido</h1><p className="my-5 text-muted">Tu cuenta no tiene permisos para este espacio.</p><Link href="/">Volver al inicio</Link></main>; }
