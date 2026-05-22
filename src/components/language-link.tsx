import Link from "next/link";

export function LanguageLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link className="secondary-link" href={href} hrefLang={label === "English" ? "en" : "ar"}>
      {label}
    </Link>
  );
}
