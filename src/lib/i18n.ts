import type { Locale, LocaleDict } from "@/types"
import en from "../../public/locales/en.json"
import ar from "../../public/locales/ar.json"

const dictionaries: Record<Locale, LocaleDict> = { en, ar }

export function getDictionary(locale: Locale): LocaleDict {
  return dictionaries[locale] ?? dictionaries.en
}

export function isRTL(locale: Locale): boolean {
  return locale === "ar"
}
