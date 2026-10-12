import type { Locale } from "@/i18n/config";

/**
 * Default info beside the homepage showcase photos, one entry per slot (1–5).
 * Shown when a slot has no admin text; the admin form is prefilled with these so they can be edited.
 */
export type ShowcaseDefault = { name: string; description: string; color: string; material: string };

export const SHOWCASE_DEFAULTS: Record<Locale | "tr", ShowcaseDefault[]> = {
  tr: [
    { name: "Şehir Ritmi", description: "Gün boyu şehirde, akşam da aynı netlikte. Rahat kalıp, düzgün duruş.", color: "Toprak tonları", material: "Keten karışımı" },
    { name: "Sakin Güç", description: "Gösterişe ihtiyaç duymayan bir rahatlık. Sade kesim, güçlü bir ifade.", color: "Kum ve kahve", material: "Doğal keten" },
    { name: "Ham Doku", description: "Yıkanmış yüzey, geniş kalıp ve kendi karakterini taşıyan bir set.", color: "Buz mavisi", material: "Yıkamalı denim" },
    { name: "Kendi Çizgisinde", description: "Kalabalığa karışmak için değil, farkını hissettirmek için tasarlandı.", color: "Gece tonları", material: "Örme ve dokuma" },
    { name: "Atölyeden", description: "İlk kesimden son dikişe kadar kendi atölyemizde, aynı özenle üretildi.", color: "Nötr palet", material: "Pamuk karışımı" },
  ],
  en: [
    { name: "City Rhythm", description: "All day in the city, just as sharp at night. Relaxed fit, clean line.", color: "Earth tones", material: "Linen blend" },
    { name: "Quiet Strength", description: "Ease that needs no show. A plain cut with a strong expression.", color: "Sand and brown", material: "Natural linen" },
    { name: "Raw Texture", description: "Washed surface, wide fit — a set with a character of its own.", color: "Ice blue", material: "Washed denim" },
    { name: "Its Own Line", description: "Made not to blend into the crowd, but to make the difference felt.", color: "Night tones", material: "Knit and woven" },
    { name: "From the Workshop", description: "From first cut to last stitch, made with the same care in our own workshop.", color: "Neutral palette", material: "Cotton blend" },
  ],
  fr: [
    { name: "Rythme urbain", description: "Toute la journée en ville, aussi net le soir. Coupe ample, ligne propre.", color: "Tons terre", material: "Lin mélangé" },
    { name: "Force tranquille", description: "Une aisance sans ostentation. Une coupe simple, une expression forte.", color: "Sable et brun", material: "Lin naturel" },
    { name: "Texture brute", description: "Surface délavée, coupe large — un ensemble au caractère propre.", color: "Bleu glacier", material: "Denim délavé" },
    { name: "Sa propre ligne", description: "Pensé non pour se fondre dans la foule, mais pour faire sentir la différence.", color: "Tons de nuit", material: "Maille et chaîne et trame" },
    { name: "De l’atelier", description: "De la première coupe au dernier point, fabriqué avec le même soin dans notre atelier.", color: "Palette neutre", material: "Coton mélangé" },
  ],
  es: [
    { name: "Ritmo urbano", description: "Todo el día en la ciudad e igual de impecable por la noche. Corte holgado, línea limpia.", color: "Tonos tierra", material: "Mezcla de lino" },
    { name: "Fuerza serena", description: "Una comodidad que no necesita alardes. Un corte sencillo con una expresión firme.", color: "Arena y marrón", material: "Lino natural" },
    { name: "Textura cruda", description: "Superficie lavada, corte amplio: un conjunto con carácter propio.", color: "Azul hielo", material: "Denim lavado" },
    { name: "Su propia línea", description: "Pensado no para mezclarse con la multitud, sino para que la diferencia se sienta.", color: "Tonos de noche", material: "Punto y tejido plano" },
    { name: "Desde el taller", description: "Del primer corte a la última puntada, hecho con el mismo cuidado en nuestro propio taller.", color: "Paleta neutra", material: "Mezcla de algodón" },
  ],
  ru: [
    { name: "Ритм города", description: "Весь день в городе и так же безупречно вечером. Свободный крой, чистая линия.", color: "Землистые тона", material: "Смесовый лён" },
    { name: "Спокойная сила", description: "Комфорт, которому не нужна показность. Простой крой, сильное высказывание.", color: "Песочный и коричневый", material: "Натуральный лён" },
    { name: "Сырая фактура", description: "Стираная поверхность, широкий крой — комплект со своим характером.", color: "Ледяной голубой", material: "Стираный деним" },
    { name: "Своя линия", description: "Создано не для того, чтобы раствориться в толпе, а чтобы дать почувствовать разницу.", color: "Ночные тона", material: "Трикотаж и ткань" },
    { name: "Из ателье", description: "От первого кроя до последнего стежка — с одинаковой заботой в нашем собственном ателье.", color: "Нейтральная палитра", material: "Смесовый хлопок" },
  ],
};
