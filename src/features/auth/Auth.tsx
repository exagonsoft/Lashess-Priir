"use client";
import { login, register, social, resetPassword, homeFor } from "./actions";
import { authError } from "@/lib/firebase/errors";
import { useState } from "react";
import { Link, useNavigate } from "@/lib/navigation";
import { IMAGES } from "../../data/images";
import { Button, Input, Label } from "../../components/ui";
import { Logo } from "../../components/layout/PublicLayout";

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={IMAGES.heroMain} alt="lashess-priir" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-plum/40" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="font-display text-3xl leading-tight">
            "Cada mirada cuenta una historia. Nosotros te ayudamos a contarla."
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-soft-white px-6 py-14">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function SocialButtons() {
 const navigate = useNavigate();
 const [error, setError] = useState("");
 const [busy, setBusy] = useState(false);
 async function run(provider: "google" | "apple") { setError(""); setBusy(true); try { window.location.assign(homeFor(await social(provider))); } catch(e) { setError(authError(e)); } finally { setBusy(false); } }
  return (
    <div className="space-y-3">
 {error && <p role="alert" className="text-sm text-deep-rose">{error}</p>}
      <button disabled={busy} onClick={() => void run("google")} className="flex w-full items-center justify-center gap-3 rounded-md border border-border-soft bg-white py-2.5 text-sm font-semibold text-plum shadow-sm transition hover:bg-blush/20">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.52 12.27c0-.85-.07-1.47-.22-2.12H12v3.85h6.6c-.13 1.09-.86 2.74-2.47 3.84l-.02.15 3.59 2.78.25.02c2.28-2.1 3.57-5.19 3.57-8.52z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.78-2.93c-1.02.71-2.4 1.21-4.16 1.21-3.18 0-5.88-2.09-6.84-4.99l-.14.01-3.73 2.89-.05.13C3.24 21.3 7.26 24 12 24z" />
          <path fill="#FBBC05" d="M5.16 14.38A7.17 7.17 0 014.77 12c0-.83.14-1.63.38-2.38L5.14 9.5 1.36 6.58 1.24 6.63A11.96 11.96 0 000 12c0 1.93.46 3.76 1.27 5.37l3.89-3z" />
          <path fill="#EA4335" d="M12 4.75c2.26 0 3.78.97 4.65 1.79l3.4-3.32C17.95 1.19 15.24 0 12 0 7.26 0 3.24 2.7 1.27 6.63l3.89 3C6.12 6.84 8.82 4.75 12 4.75z" />
        </svg>
        Continuar con Google
      </button>
      <button disabled={busy} onClick={() => void run("apple")} className="flex w-full items-center justify-center gap-3 rounded-md border border-plum bg-plum py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M16.365 1.43c0 1.14-.46 2.11-1.3 2.9-.9.84-2 1.33-3.02 1.25-.14-1.1.4-2.24 1.26-3.02.86-.78 2.3-1.35 3.06-1.13zM20.5 17.1c-.56 1.27-.83 1.84-1.56 2.95-1.01 1.56-2.44 3.5-4.2 3.52-1.56.02-1.96-1.02-4.08-1.01-2.12.01-2.56 1.03-4.12 1.01-1.76-.02-3.11-1.77-4.12-3.33C.03 16.76-.94 11.7 1.7 8.6c1.3-1.52 3.14-2.47 4.78-2.5 1.62-.03 2.65 1.07 4.09 1.07 1.44 0 2.21-1.07 4.1-1.03 1.5.02 3.25.6 4.5 2.1-3.95 2.17-3.31 7.74 1.33 8.86z" />
        </svg>
        Continuar con Apple
      </button>
    </div>
  );
}

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const form = new FormData(e.currentTarget); setLoading(true); setError(""); try { window.location.assign(homeFor(await login(String(form.get("email")), String(form.get("password"))))); } catch(e) { setError(authError(e)); } finally { setLoading(false); } }


  return (
    <AuthShell>
      <h1 className="font-display text-3xl text-plum">Bienvenida de nuevo</h1>
      <p className="mt-1.5 text-sm text-muted">Ingresá a tu cuenta para gestionar tus reservas.</p>
      <div className="mt-6">
        <SocialButtons />
      </div>
      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border-soft" /> o con tu email <span className="h-px flex-1 bg-border-soft" />
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-deep-rose">{error}</p>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="tu@email.com" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link to="/recuperar" className="text-xs font-semibold text-deep-rose hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Iniciar sesión
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        ¿No tenés cuenta?{" "}
        <Link to="/registro" className="font-semibold text-deep-rose hover:underline">
          Crear cuenta
        </Link>
      </p>
      <button onClick={() => navigate("/reservar")} className="mt-3 w-full text-center text-xs text-muted hover:text-plum">
        Continuar como invitada →
      </button>
      <div className="mt-8 flex justify-center gap-4 text-[11px] text-muted">
        <Link to="/staff" className="hover:text-plum">
          Acceso especialistas
        </Link>
        <span>·</span>
        <Link to="/admin" className="hover:text-plum">
          Acceso administración
        </Link>
      </div>
    </AuthShell>
  );
}

export function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const form = new FormData(e.currentTarget); setLoading(true); setError(""); try { if(form.get("password") !== form.get("confirmation")) throw new Error("Las contraseñas no coinciden"); window.location.assign(homeFor(await register(String(form.get("email")), String(form.get("password")), String(form.get("displayName")), String(form.get("phone"))))); } catch(e) { setError(authError(e)); } finally { setLoading(false); } }

  return (
    <AuthShell>
      <h1 className="font-display text-3xl text-plum">Creá tu cuenta</h1>
      <p className="mt-1.5 text-sm text-muted">Reservá, seguí tus citas y guardá tus tratamientos favoritos.</p>
      <div className="mt-6">
        <SocialButtons />
      </div>
      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border-soft" /> o registrate con tu email <span className="h-px flex-1 bg-border-soft" />
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-deep-rose">{error}</p>}
      <form onSubmit={submit} className="space-y-3.5">
        <Input name="displayName" maxLength={100} required placeholder="Nombre completo" />
        <Input name="email" required type="email" placeholder="Email" />
        <Input name="phone" maxLength={30} required placeholder="Teléfono" />
        <Input name="password" minLength={8} required type="password" placeholder="Contraseña" />
        <Input name="confirmation" minLength={8} required type="password" placeholder="Confirmar contraseña" />
        <label className="flex items-start gap-2 text-xs text-muted">
          <input type="checkbox" required className="mt-0.5" />
          Acepto los términos de uso y la política de privacidad.
        </label>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Crear cuenta
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="font-semibold text-deep-rose hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
 const [error, setError] = useState("");
 const [busy, setBusy] = useState(false);
  return (
    <AuthShell>
      <h1 className="font-display text-3xl text-plum">Recuperar contraseña</h1>
      <p className="mt-1.5 text-sm text-muted">Te enviaremos un enlace para restablecer tu contraseña.</p>
      {error && <p role="alert" className="text-sm text-deep-rose">{error}</p>}
      {sent ? (
        <div className="mt-8 rounded-xl bg-blush/30 p-6 text-center">
          <p className="font-display text-lg text-plum">Revisá tu correo ✉️</p>
          <p className="mt-2 text-sm text-muted">Enviamos instrucciones a tu email para restablecer tu contraseña.</p>
        </div>
      ) : (
        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => { e.preventDefault(); const form = new FormData(e.currentTarget); setBusy(true); setError(""); try { await resetPassword(String(form.get("email"))); setSent(true); } catch(e) { setError(authError(e)); } finally { setBusy(false); } }}
        >
          <div>
            <Label htmlFor="email2">Email</Label>
            <Input id="email2" name="email" type="email" required placeholder="tu@email.com" />
          </div>
          <Button type="submit" loading={busy} className="w-full" size="lg">
            Enviar enlace
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted">
        <Link to="/login" className="font-semibold text-deep-rose hover:underline">
          ← Volver a iniciar sesión
        </Link>
      </p>
    </AuthShell>
  );
}
