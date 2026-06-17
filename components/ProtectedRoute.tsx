"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppChrome from "@/components/AppChrome";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  returnUrl: string;
}

export default function ProtectedRoute({
  children,
  returnUrl,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [loading, isAuthenticated, router, returnUrl]);

  if (loading) {
    return (
      <AppChrome>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="font-display text-2xl uppercase tracking-widest text-cj-gold-muted">
            Loading...
          </p>
        </div>
      </AppChrome>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
