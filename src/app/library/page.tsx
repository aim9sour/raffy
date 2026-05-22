import { LibraryApp } from "@/components/library-app";
import { auth } from "@/lib/auth/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مكتبة رَفّي",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LibraryPage() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  return <LibraryApp />;
}
