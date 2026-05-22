import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { authClient } from "@/lib/auth/client";
import { ServiceWorkerUpdater } from "@/components/service-worker-updater";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "رَفّي | Raffy",
    template: "%s | رَفّي",
  },
  description: site.descriptionAr,
  applicationName: "رَفّي",
  manifest: "/manifest.webmanifest",
  authors: [{ name: "Raffy" }],
  creator: "Raffy",
  publisher: "Raffy",
  category: "Productivity",
  keywords: [...site.keywordsAr, ...site.keywordsEn],
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  alternates: {
    canonical: "/",
    languages: {
      ar: "/",
      en: "/en",
      "x-default": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NeonAuthUIProvider
          authClient={authClient as never}
          redirectTo="/"
          credentials={{ forgotPassword: true }}
        >
          <ServiceWorkerUpdater />
          {children}
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
