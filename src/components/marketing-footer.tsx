import Link from "next/link";
import { creator } from "@/lib/site";

export function MarketingFooter({ locale }: { locale: "ar" | "en" }) {
  const isArabic = locale === "ar";

  return (
    <footer className="border-t border-stone-200 bg-white/70 px-4 py-8 text-sm text-stone-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <p>
          {isArabic ? "تم تطوير رَفّي بواسطة " : "Raffy was developed by "}
          <Link className="font-semibold text-teal-700 dark:text-teal-300" href={isArabic ? "/creator" : "/en/creator"}>
            {isArabic ? creator.nameAr : creator.nameEn}
          </Link>
          {isArabic ? " كهدية رقمية للمجتمع." : " as a digital gift to the community."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={isArabic ? "/about" : "/en/about"}>{isArabic ? "من نحن" : "About"}</Link>
          <Link href={isArabic ? "/contact" : "/en/contact"}>{isArabic ? "تواصل" : "Contact"}</Link>
          <a href={creator.github}>GitHub</a>
          <a href={creator.linkedin}>LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
