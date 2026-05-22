import { creator, site } from "@/lib/site";

export function PersonJsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/creator#abdullah-mansour`,
    name: creator.nameEn,
    alternateName: [creator.nameAr, "aim9sour"],
    jobTitle: [creator.roleEn, creator.roleAr],
    nationality: "Egyptian",
    email: creator.email,
    telephone: creator.phone,
    url: `${site.url}/creator`,
    sameAs: [creator.github, creator.linkedin],
    knowsAbout: [
      "Applied Artificial Intelligence",
      "Accessibility",
      "Digital Marketing",
      "Open Source",
      "Progressive Web Apps",
      "Assistive technology",
    ],
    description:
      "Abdullah Mansour is an Egyptian applied AI engineer, accessibility-focused maker, open-source contributor, and creator of Raffy and Hassila.",
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
