/** Languages the public site is served in. Turkish is kept only as the admin's working language. */
export const locales = ["en", "es", "ru", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Every language content can be stored in: the public ones plus the admin's Turkish. */
export type ContentLang = Locale | "tr";

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** English lives at the root, the other languages under /es, /ru and /fr. */
export function localePath(lang: Locale, path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLocale) return clean;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

/** Strip a language prefix from a browser pathname. */
export function stripLocale(pathname: string) {
  const match = pathname.match(/^\/(en|es|ru|fr|tr)(?=\/|$)/);
  return match ? pathname.slice(match[0].length) || "/" : pathname;
}

const SUFFIX: Record<ContentLang, string> = { en: "En", tr: "Tr", fr: "Fr", es: "Es", ru: "Ru" };

/**
 * Localized value of a record field: pick(product, "name", "es") → product.nameEs, or the Spanish entry in
 * product.i18n (database rows keep the newer languages there). Anything missing falls back to English.
 */
function raw(record: object, field: string, lang: ContentLang): unknown {
  const rec = record as Record<string, unknown>;
  const own = rec[`${field}${SUFFIX[lang]}`];
  if (own !== undefined && own !== null && own !== "") return own;
  const i18n = rec.i18n as Record<string, Record<string, unknown> | undefined> | null | undefined;
  return i18n?.[lang]?.[field];
}

export function pick<T extends object>(record: T, field: string, lang: ContentLang): string {
  const own = raw(record, field, lang);
  if (typeof own === "string" && own) return own;
  const en = raw(record, field, "en");
  return typeof en === "string" ? en : "";
}

export function pickList<T extends object>(record: T, field: string, lang: ContentLang): string[] {
  const read = (l: ContentLang) => {
    const value = raw(record, field, l);
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  };
  const own = read(lang);
  return own.length ? own : read("en");
}
