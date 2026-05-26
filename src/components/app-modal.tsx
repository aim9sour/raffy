"use client";

import { X } from "lucide-react";
import { useEffect, useId } from "react";

type AppModalProps = {
  title: string;
  closeLabel: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: "md" | "lg";
};

export function AppModal({
  title,
  closeLabel,
  children,
  onClose,
  size = "md",
}: AppModalProps) {
  const titleId = useId();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={closeLabel}
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative max-h-[92vh] w-full overflow-hidden rounded-lg border border-stone-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 ${
          size === "lg" ? "max-w-3xl" : "max-w-xl"
        }`}
      >
        <header className="flex items-center justify-between gap-3 border-b border-stone-200 px-4 py-3 dark:border-slate-800 sm:px-5">
          <h2 id={titleId} className="text-lg font-bold text-stone-950 dark:text-slate-50">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            title={closeLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </header>
        <div className="max-h-[calc(92vh-58px)] overflow-y-auto p-4 sm:p-5">{children}</div>
      </section>
    </div>
  );
}
