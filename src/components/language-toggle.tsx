"use client";

import type { Locale } from "@/lib/i18n";
import { localeLabels, saveBrowserLocale } from "@/lib/i18n";

export function LanguageToggle({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  const next = locale === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      className="secondary-button h-10"
      onClick={() => {
        saveBrowserLocale(next);
        onChange(next);
      }}
    >
      {localeLabels[locale].other}
    </button>
  );
}
