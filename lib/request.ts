export const MAX_JSON_BYTES = 10 * 1024;

export function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function isOptIn(value: unknown): boolean {
  return value === true || value === "yes";
}

// Tab, newline and carriage return are allowed; other control characters are not.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

export function hasControlCharacters(value: string): boolean {
  return CONTROL_CHARACTERS.test(value);
}

/**
 * Reads the body as a stream and stops as soon as the cap is passed, so a request
 * without a Content-Length header cannot make the server buffer an oversized body.
 */
async function readCapped(request: Request, maxBytes: number): Promise<Uint8Array | null> {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array(0);
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => undefined);
      return null;
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return merged;
}

export async function readJsonBody(request: Request): Promise<
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413 | 415; error: string }
> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return { ok: false, status: 415, error: "JSON content type required" };
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_JSON_BYTES) {
    return { ok: false, status: 413, error: "Request body too large" };
  }

  try {
    const bytes = await readCapped(request, MAX_JSON_BYTES);
    if (bytes === null) return { ok: false, status: 413, error: "Request body too large" };
    return { ok: true, value: JSON.parse(new TextDecoder().decode(bytes)) as unknown };
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON body" };
  }
}

export const noStoreHeaders = { "Cache-Control": "no-store" };
