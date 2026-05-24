/**
 * Minimal fetch wrapper with timeout + JSON parsing + Zod validation.
 * Public NHTSA endpoints; no auth required.
 */
import { z, type ZodTypeAny } from 'zod';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export interface FetchOpts {
  timeoutMs?: number;
  signal?: AbortSignal;
}

export async function getJson<T>(url: string, opts: FetchOpts = {}): Promise<T> {
  const { timeoutMs = 15_000 } = opts;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  const signal = opts.signal
    ? anyAbort([opts.signal, ctl.signal])
    : ctl.signal;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });
    if (!res.ok) {
      throw new ApiError(`HTTP ${res.status} for ${url}`, res.status);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function getJsonValidated<S extends ZodTypeAny>(
  url: string,
  schema: S,
  opts: FetchOpts = {},
): Promise<z.infer<S>> {
  const data = await getJson<unknown>(url, opts);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    // Log issues but return raw data cast — NHTSA APIs sometimes drift; prefer
    // resilience over hard failure for end users.
    // eslint-disable-next-line no-console
    console.warn('Schema mismatch for', url, parsed.error.issues.slice(0, 3));
    return data as z.infer<S>;
  }
  return parsed.data;
}

function anyAbort(signals: AbortSignal[]): AbortSignal {
  const ctl = new AbortController();
  for (const s of signals) {
    if (s.aborted) {
      ctl.abort();
      return ctl.signal;
    }
    s.addEventListener('abort', () => ctl.abort(), { once: true });
  }
  return ctl.signal;
}

export function qs(params: Record<string, string | number | undefined | null>): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    usp.set(k, String(v));
  }
  const s = usp.toString();
  return s ? `?${s}` : '';
}
