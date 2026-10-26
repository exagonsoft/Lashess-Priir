import { z } from "zod";
import { cookies } from "next/headers";
import { adminServices } from "@/server/firebase/admin";
import {
  assertSameOrigin,
  authorize,
  cookieOptions,
  sessionName,
} from "@/server/auth";
import { ensureProfile } from "@/server/profiles";
import { ApiError, handler, jsonBody, ok } from "@/server/api/errors";

export const runtime = "nodejs";

export const POST = handler(async (req) => {
  let stage = "origin-validation";

  try {
    assertSameOrigin(req);

    stage = "request-validation";

    const { idToken } = z
      .object({ idToken: z.string().min(1).max(10000) })
      .strict()
      .parse(await jsonBody(req));

    stage = "firebase-admin-initialization";

    const auth = adminServices().auth;

    stage = "verify-id-token";

    let identity;

    try {
      identity = await auth.verifyIdToken(idToken, true);
    } catch {
      throw new ApiError(
        "UNAUTHENTICATED",
        401,
        "Credenciales inválidas"
      );
    }

    stage = "authentication-time-check";

    if (Date.now() / 1000 - identity.auth_time > 300) {
      throw new ApiError(
        "UNAUTHENTICATED",
        401,
        "Volvé a iniciar sesión"
      );
    }

    stage = "ensure-profile";

    await ensureProfile(identity);

    stage = "authorize";

    await authorize(identity);

    stage = "create-session-cookie";

    const expiresIn = 5 * 24 * 60 * 60 * 1000;

    const session = await auth.createSessionCookie(idToken, {
      expiresIn,
    });

    stage = "set-cookie";

    (await cookies()).set(sessionName, session, {
      ...cookieOptions,
      maxAge: expiresIn / 1000,
    });

    return ok({ authenticated: true });
  } catch (error) {
    console.error("[AUTH SESSION ERROR]", {
      stage,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              code:
                "code" in error
                  ? String(error.code)
                  : undefined,
            }
          : "Unknown error",
    });

    throw error;
  }
});

export const DELETE = handler(async (req) => {
  assertSameOrigin(req);
  (await cookies()).set(sessionName, "", { ...cookieOptions, maxAge: 0 });
  return ok({ authenticated: false });
});
