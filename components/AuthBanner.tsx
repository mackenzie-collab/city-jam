"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface AuthBannerProps {
  message: string;
  returnUrl?: string;
}

export default function AuthBanner({ message, returnUrl }: AuthBannerProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  const loginHref = returnUrl
    ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
    : "/login";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 hidden items-center justify-between gap-4 border-t border-cj-gold-border bg-cj-purple-card px-6 py-4 md:flex">
      <p className="text-sm text-cj-gold-muted">{message}</p>
      <Link href={loginHref}>
        <Button variant="primary" size="sm">
          Sign In
        </Button>
      </Link>
    </div>
  );
}
