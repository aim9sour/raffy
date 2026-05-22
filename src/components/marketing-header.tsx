import Link from "next/link";
import { BookOpen } from "lucide-react";
import { LanguageLink } from "@/components/language-link";
import { ThemeToggle } from "@/components/theme-toggle";

type Locale = "ar" | "en";

const nav = {
  ar: {
    home: "الرئيسية",
    features: "المميزات",
    about: "من نحن",
    creator: "المطور",
    contact: "تواصل",
    signIn: "تسجيل الدخول",
    start: "ابدأ الآن",
    language: "English",
    languageHref: "/en",
  },
  en: {
    home: "Home",
    features: "Features",
    about: "About",
    creator: "Creator",
    contact: "Contact",
    signIn: "Sign in",
    start: "Start now",
    language: "العربية",
    languageHref: "/",
  },
};

export function MarketingHeader({ locale }: { locale: Locale }) {
  const t = nav[locale];
  const isArabic = locale === "ar";
  const prefix = isArabic ? "" : "/en";

  return (
    <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
      <Link href={isArabic ? "/" : "/en"} className="flex items-center gap-3" aria-label="Raffy">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-white">
          <BookOpen size={22} />
        </span>
        <span className="text-xl font-bold">{isArabic ? "رَفّي" : "Raffy"}</span>
      </Link>
      <nav className="flex flex-wrap items-center gap-2 text-sm">
        <Link className="secondary-link hidden md:inline-flex" href={prefix || "/"}>
          {t.home}
        </Link>
        <Link className="secondary-link hidden md:inline-flex" href={`${prefix}/features`}>
          {t.features}
        </Link>
        <Link className="secondary-link hidden md:inline-flex" href={`${prefix}/about`}>
          {t.about}
        </Link>
        <Link className="secondary-link hidden md:inline-flex" href={`${prefix}/creator`}>
          {t.creator}
        </Link>
        <Link className="secondary-link hidden md:inline-flex" href={`${prefix}/contact`}>
          {t.contact}
        </Link>
        <ThemeToggle />
        <LanguageLink href={t.languageHref} label={t.language} />
        <Link className="secondary-link hidden sm:inline-flex" href="/auth/sign-in">
          {t.signIn}
        </Link>
        <Link className="primary-link" href="/auth/sign-up">
          {t.start}
        </Link>
      </nav>
    </header>
  );
}

