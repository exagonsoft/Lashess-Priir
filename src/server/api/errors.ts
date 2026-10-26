
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function ok(data: unknown, status = 200) {
  return NextResponse.json(
    { data },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

function getErrorDetails(error: unknown) {
  if (error instanceof Error) {
    const extended = error as Error & {
      code?: string | number;
      status?: number;
    };

    return {
      name: error.name,
      message: error.message,
      code: extended.code ?? null,
      status: extended.status ?? null,
      stack: error.stack ?? null,
    };
  }

  // Do not stringify arbitrary thrown values:
  // they could contain credentials or request data.
  return {
    name: "UnknownError",
    message: "A non-Error value was thrown",
    code: null,
    status: null,
    stack: null,
  };
}

export function handler(
  fn: (req: Request) => Promise<Response>,
) {
  return async (req: Request) => {
    const requestId = crypto.randomUUID();

    try {
      const response = await fn(req);

      response.headers.set(
        "X-Request-Id",
        requestId,
      );

      return response;
    } catch (e: unknown) {
      const error =
        e instanceof ZodError
          ? new ApiError(
              "VALIDATION_ERROR",
              400,
              "Datos inválidos",
            )
          : e instanceof ApiError
            ? e
            : new ApiError(
                "INTERNAL_ERROR",
                500,
                "No se pudo procesar la solicitud",
              );

      if (error.status >= 500) {
        console.error(
          JSON.stringify({
            level: "error",
            event: "API_REQUEST_FAILED",
            requestId,
            method: req.method,
            pathname: new URL(req.url).pathname,
            httpStatus: error.status,
            apiCode: error.code,
            originalError: getErrorDetails(e),
            timestamp: new Date().toISOString(),
          }),
        );
      }

      return NextResponse.json(
        {
          error: {
            code: error.code,
            message: error.message,
            requestId,
          },
        },
        {
          status: error.status,
          headers: {
            "Cache-Control": "no-store",
            "X-Request-Id": requestId,
          },
        },
      );
    }
  };
}

export async function jsonBody(req: Request) {
  if (
    !req.headers
      .get("content-type")
      ?.startsWith("application/json")
  ) {
    throw new ApiError(
      "VALIDATION_ERROR",
      415,
      "Se requiere JSON",
    );
  }

  const reader = req.body?.getReader();

  if (!reader) {
    throw new ApiError(
      "VALIDATION_ERROR",
      400,
      "Se requiere JSON",
    );
  }

  const chunks: Uint8Array[] = [];
  let size = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    size += value.byteLength;

    if (size > 16384) {
      await reader.cancel();

      throw new ApiError(
        "VALIDATION_ERROR",
        413,
        "Solicitud demasiado grande",
      );
    }

    chunks.push(value);
  }

  const bytes = new Uint8Array(size);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(
      new TextDecoder("utf-8", {
        fatal: true,
      }).decode(bytes),
    ) as unknown;
  } catch {
    throw new ApiError(
      "VALIDATION_ERROR",
      400,
      "JSON inválido",
    );
  }
}
