import type { Locale } from "@/i18n/config";

/**
 * Anchor targets on the About page. The same list drives the header dropdown,
 * the mobile accordion and the page's own index, so ids can never drift apart.
 * Kept free of heavy imports: the Navbar (client) bundles this file.
 */
export const aboutSections = [
  { id: "biz-kimiz", tr: "Biz Kimiz?", en: "Who We Are", fr: "Qui sommes-nous ?", es: "Quiénes somos", ru: "Кто мы" },
  { id: "hikayemiz", tr: "Hikâyemiz", en: "Our Story", fr: "Notre histoire", es: "Nuestra historia", ru: "Наша история" },
  { id: "marka-bakisi", tr: "YEG’in Marka Bakışı", en: "YEG’s Brand Perspective", fr: "La vision de marque de YEG", es: "La visión de marca de YEG", ru: "Взгляд бренда YEG" },
  { id: "sirket-olarak-yeg", tr: "Şirket Olarak YEG", en: "YEG as a Company", fr: "YEG, l’entreprise", es: "YEG como empresa", ru: "YEG как компания" },
  { id: "uretim-kapasitesi", tr: "Üretim Kapasitesi", en: "Production Capacity", fr: "Capacité de production", es: "Capacidad de producción", ru: "Производственная мощность" },
  { id: "uretim-alanlari", tr: "Üretim Alanlarımız", en: "Our Production Areas", fr: "Nos domaines de production", es: "Nuestras áreas de producción", ru: "Наши производственные направления" },
  { id: "kalite", tr: "Kalite ve Sorumluluk", en: "Quality & Responsibility", fr: "Qualité et responsabilité", es: "Calidad y responsabilidad", ru: "Качество и ответственность" },
  { id: "is-yapma-bicimimiz", tr: "İş Yapma Biçimimiz", en: "How We Work", fr: "Notre façon de travailler", es: "Cómo trabajamos", ru: "Как мы работаем" },
  { id: "uluslararasi", tr: "Uluslararası Yapılanma", en: "International Structure", fr: "Structure internationale", es: "Estructura internacional", ru: "Международная структура" },
  { id: "gelecege-bakis", tr: "Geleceğe Bakış", en: "Looking Ahead", fr: "Regard vers l’avenir", es: "Mirando al futuro", ru: "Взгляд в будущее" },
] as const;

export type AboutSectionId = (typeof aboutSections)[number]["id"];

export const ABOUT_PATH = "/about";

const ui = {
  tr: { submenu: "Hakkımızda alt menüsü", onThisPage: "Bu sayfada" },
  en: { submenu: "About submenu", onThisPage: "On this page" },
  fr: { submenu: "Sous-menu À propos", onThisPage: "Sur cette page" },
  es: { submenu: "Submenú Nosotros", onThisPage: "En esta página" },
  ru: { submenu: "Подменю «О нас»", onThisPage: "На этой странице" },
};

export function aboutMenu(lang: Locale) {
  return {
    ...ui[lang],
    items: aboutSections.map((s, i) => ({ id: s.id, label: s[lang], index: String(i + 1).padStart(2, "0") })),
  };
}
