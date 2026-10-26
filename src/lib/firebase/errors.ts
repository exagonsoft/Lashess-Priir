export function authError(error: unknown): string {
 const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
 const messages: Record<string, string> = {
  "auth/popup-closed-by-user": "Cancelaste el inicio de sesión. Podés volver a intentarlo.",
  "auth/cancelled-popup-request": "Ya hay una ventana de acceso abierta.",
  "auth/popup-blocked": "El navegador bloqueó la ventana. Permití ventanas emergentes para este sitio y reintentá.",
  "auth/account-exists-with-different-credential": "Ya existe una cuenta con otro método. Ingresá con ese método. La vinculación requiere verificar ambas cuentas; no se vinculan automáticamente.",
  "auth/operation-not-allowed": "Este proveedor no está habilitado. Configurá Google o Apple en Firebase Console.",
  "auth/unauthorized-domain": "Este dominio no está autorizado en Firebase Authentication.",
  "auth/invalid-credential": "Email o contraseña incorrectos.",
  "auth/email-already-in-use": "No se pudo registrar esta cuenta. Probá iniciar sesión o recuperar la contraseña.",
  "auth/weak-password": "Usá una contraseña de al menos 8 caracteres.",
  "auth/too-many-requests": "Demasiados intentos. Esperá unos minutos.",
  "auth/network-request-failed": "No se pudo conectar. Revisá tu conexión.",
 };
 return messages[code] ?? (error instanceof Error && !code ? error.message : "No se pudo completar la autenticación. Revisá la configuración de Firebase.");
}
