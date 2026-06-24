"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface AuthBackButtonProps {
  /** When set, back navigates to this path instead of browser history */
  href?: string | null;
  label?: string;
}

function safeReturnPath(path: string | null | undefined): string | null {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return null;
  return path;
}

export default function AuthBackButton({
  href,
  label = "Back",
}: AuthBackButtonProps) {
  const router = useRouter();
  const safeHref = safeReturnPath(href);

  const className =
    "fixed left-4 top-[max(1rem,env(safe-area-inset-top))] z-50 flex min-h-11 items-center gap-2 rounded-sm border border-transparent px-2 font-mono text-xs uppercase tracking-widest text-cj-gold-muted transition-colors hover:border-brand-gold/30 hover:text-brand-gold";

  if (safeHref) {
    return (
      <Link href={safeHref} className={className} aria-label={label}>
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
          return;
        }
        router.push("/");
      }}
    >
      <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
      <span>{label}</span>
    </button>
  );
}
