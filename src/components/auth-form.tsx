"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";

type AuthMode = "sign-in" | "sign-up" | "forgot-password" | "reset-password";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (mode === "sign-in") {
        const result = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/library",
        });
        if (result.error) throw new Error(result.error.message);
        router.push("/library");
        router.refresh();
        return;
      }

      if (mode === "sign-up") {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: "/library",
        });
        if (result.error) throw new Error(result.error.message);
        router.push("/library");
        router.refresh();
        return;
      }

      if (mode === "reset-password") {
        if (password !== confirmPassword) {
          throw new Error("كلمتا المرور غير متطابقتين.");
        }

        const result = await authClient.resetPassword({
          newPassword: password,
          token: searchParams.get("token") ?? undefined,
        });
        if (result.error) throw new Error(result.error.message);
        setMessage("تم تغيير كلمة المرور. يمكنك الآن تسجيل الدخول بكلمتك الجديدة.");
        return;
      }

      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (result.error) throw new Error(result.error.message);
      setMessage("تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني إذا كان الحساب موجودًا.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "تعذر إتمام العملية، حاول مرة أخرى.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      {mode === "sign-up" ? (
        <Field label="الاسم">
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input"
            autoComplete="name"
          />
        </Field>
      ) : null}

      {mode !== "reset-password" ? (
        <Field label="البريد الإلكتروني">
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input"
            autoComplete="email"
            dir="ltr"
          />
        </Field>
      ) : null}

      {mode !== "forgot-password" ? (
        <Field label={mode === "reset-password" ? "كلمة المرور الجديدة" : "كلمة المرور"}>
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input"
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
          />
        </Field>
      ) : null}

      {mode === "reset-password" ? (
        <Field label="تأكيد كلمة المرور">
          <input
            required
            type="password"
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="input"
            autoComplete="new-password"
          />
        </Field>
      ) : null}

      {error ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-11 w-full items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "جاري التنفيذ..." : buttonLabel(mode)}
      </button>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        {mode !== "sign-in" ? (
          <Link className="text-teal-700 hover:underline dark:text-teal-300" href="/auth/sign-in">
            لدي حساب بالفعل
          </Link>
        ) : (
          <Link
            className="text-teal-700 hover:underline dark:text-teal-300"
            href="/auth/forgot-password"
          >
            نسيت كلمة المرور؟
          </Link>
        )}

        {mode !== "sign-up" && mode !== "reset-password" ? (
          <Link className="text-teal-700 hover:underline dark:text-teal-300" href="/auth/sign-up">
            إنشاء حساب جديد
          </Link>
        ) : null}
      </div>
    </form>
  );
}

function buttonLabel(mode: AuthMode) {
  if (mode === "sign-in") return "تسجيل الدخول";
  if (mode === "sign-up") return "إنشاء الحساب";
  if (mode === "reset-password") return "تغيير كلمة المرور";
  return "إرسال رابط الاستعادة";
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm font-medium text-stone-700 dark:text-slate-300">
      <span>{label}</span>
      {children}
    </label>
  );
}
