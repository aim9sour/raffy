import { AccountView } from "@neondatabase/auth/react";
import type { Metadata } from "next";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "إعدادات حساب رَفّي",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="min-h-screen bg-stone-50 p-4 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl">
        <AccountView path={path} />
      </div>
    </main>
  );
}
