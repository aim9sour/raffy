import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "حساب رَفّي",
  robots: {
    index: false,
    follow: false,
  },
};

const titles = {
  "sign-in": {
    title: "تسجيل الدخول",
    description: "ادخل إلى مكتبتك في رَفّي باستخدام البريد الإلكتروني وكلمة المرور فقط.",
  },
  "sign-up": {
    title: "إنشاء حساب",
    description: "اكتب اسمك وبريدك وكلمة مرورك وابدأ تنظيم مكتبتك خلال دقيقة.",
  },
  "forgot-password": {
    title: "نسيت كلمة المرور",
    description: "اكتب بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.",
  },
  "reset-password": {
    title: "تعيين كلمة مرور جديدة",
    description: "اكتب كلمة مرور جديدة لحسابك ثم ارجع لتسجيل الدخول.",
  },
};

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  const mode = path in titles ? (path as keyof typeof titles) : "sign-in";
  const copy = titles[mode];

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 p-4 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Link href="/" className="text-xl font-bold text-teal-700 dark:text-teal-300">
          رَفّي
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-stone-950 dark:text-slate-50">
          {copy.title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-slate-400">
          {copy.description}
        </p>
        <AuthForm mode={mode} />
      </section>
    </main>
  );
}
