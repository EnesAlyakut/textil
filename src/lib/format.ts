import type { ContentLang } from "@/i18n/config";

const NUMBER_LOCALE: Record<ContentLang, string> = { tr: "tr-TR", en: "en-US", es: "es-ES", ru: "ru-RU", fr: "fr-FR" };
const DATE_LOCALE: Record<ContentLang, string> = { tr: "tr-TR", en: "en-GB", es: "es-ES", ru: "ru-RU", fr: "fr-FR" };

export function formatPrice(value: number, currency: string, lang: ContentLang) {
  return new Intl.NumberFormat(NUMBER_LOCALE[lang], {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function formatDate(date: Date | string, lang: ContentLang) {
  return new Intl.DateTimeFormat(DATE_LOCALE[lang], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
