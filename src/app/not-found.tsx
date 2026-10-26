import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-soft-white px-6 text-center">
      <p className="font-display text-6xl text-plum">404</p>
      <p className="mt-3 text-muted">La página que buscás no existe.</p>
      <Link href="/" className="mt-6 rounded-md bg-plum px-6 py-3 text-sm font-semibold text-white hover:bg-deep-rose">
        Volver al inicio
      </Link>
    </div>
  );
}
