import "server-only";
import { revalidatePath } from "next/cache";
import { invalidateQueryCache } from "./queries";

/** Every admin mutation affects the public site in both languages. */
export function revalidateSite() {
  invalidateQueryCache();
  revalidatePath("/[lang]", "layout");
  revalidatePath("/sitemap.xml");
}

export const str = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
};

export const optStr = (fd: FormData, key: string) => str(fd, key) || null;

export const bool = (fd: FormData, key: string) => fd.get(key) === "on" || fd.get(key) === "true";

export const int = (fd: FormData, key: string, fallback = 0) => {
  const n = Number.parseInt(str(fd, key), 10);
  return Number.isFinite(n) ? n : fallback;
};

export function json<T>(fd: FormData, key: string, fallback: T): T {
  try {
    const raw = str(fd, key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Newline-separated textarea → string[] */
export const lines = (fd: FormData, key: string) =>
  str(fd, key)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export type ActionState = { ok?: boolean; error?: string; message?: string };

/**
 * Spanish / Russian fields of a form (`nameEs`, `featuresRu`…) as the `i18n` JSON stored on database rows.
 * Empty fields are left out, so the site falls back to English for them.
 */
export function formI18n(fd: FormData, listFields: string[] = []) {
  const out: Record<"es" | "ru", Record<string, string | string[]>> = { es: {}, ru: {} };
  for (const key of new Set(fd.keys())) {
    const m = key.match(/^([a-zA-Z]+)(Es|Ru)$/);
    if (!m) continue;
    const [, field, suffix] = m;
    const lang = suffix === "Es" ? "es" : "ru";
    if (listFields.includes(field)) {
      const items = lines(fd, key);
      if (items.length) out[lang][field] = items;
    } else if (str(fd, key)) {
      out[lang][field] = str(fd, key);
    }
  }
  return out;
}
