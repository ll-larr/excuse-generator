import { ERROR_MESSAGES } from "@/lib/config";
import {
  ExcuseError,
  generateExcuse,
  getAnthropicClient,
} from "@/lib/excuse/client";
import { GenerateRequestSchema } from "@/lib/excuse/schema";
import { getKv } from "@/lib/kv";
import { checkLimits } from "@/lib/limits";
import type { LimitResult } from "@/lib/limits";

export const runtime = "nodejs";

function json(body: unknown, status: number, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

function clientIp(request: Request): string {
  const vercel = request.headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0].trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: ERROR_MESSAGES.invalid_input }, 400);
  }

  const parsed = GenerateRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ error: ERROR_MESSAGES.invalid_input }, 400);
  }

  let limit: LimitResult;
  try {
    limit = await checkLimits(getKv(), clientIp(request));
  } catch {
    return json({ error: ERROR_MESSAGES.budget_exhausted }, 503);
  }
  if (!limit.ok) {
    if (limit.reason === "global_daily") {
      return json({ error: ERROR_MESSAGES.budget_exhausted }, 503);
    }
    return json({ error: ERROR_MESSAGES.rate_limited }, 429, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  try {
    const excuse = await generateExcuse(parsed.data, getAnthropicClient());
    return json(excuse, 200);
  } catch (error) {
    if (error instanceof ExcuseError && error.kind === "refusal") {
      return json({ error: ERROR_MESSAGES.refusal }, 422);
    }
    return json({ error: ERROR_MESSAGES.upstream }, 502);
  }
}
