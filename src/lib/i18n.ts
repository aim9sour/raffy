export type Locale = "ar" | "en";

export const localeLabels = {
  ar: {
    dir: "rtl",
    other: "English",
    code: "AR",
  },
  en: {
    dir: "ltr",
    other: "العربية",
    code: "EN",
  },
} satisfies Record<Locale, { dir: "rtl" | "ltr"; other: string; code: string }>;

export function getBrowserLocale(): Locale {
  if (typeof window === "undefined") return "ar";
  const saved = window.localStorage.getItem("raffy-language");
  return saved === "en" ? "en" : "ar";
}

export function saveBrowserLocale(locale: Locale) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("raffy-language", locale);
}
