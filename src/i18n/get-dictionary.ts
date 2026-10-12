import "server-only";
import type { Locale } from "./config";
import en from "./dictionaries/en";
import es from "./dictionaries/es";
import fr from "./dictionaries/fr";
import ru from "./dictionaries/ru";

const dictionaries = { en, es, ru, fr };

export const getDictionary = (lang: Locale) => dictionaries[lang];
export type { Dictionary } from "./dictionaries/en";
