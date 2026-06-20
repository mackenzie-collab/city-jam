"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import VinylCard from "@/components/analog/VinylCard";
import VinylDisc from "@/components/analog/VinylDisc";

type OAuthProvider = "google" | "facebook" | "apple";

interface AuthCardProps {
  mode: "login" | "register";
  onSubmit: (data: {
    email: string;
    password: string;
    confirmPassword?: string;
    displayName?: string;
  }) => void | Promise<void>;
  onOAuth?: (provider: OAuthProvider) => void | Promise<void>;
  onForgotPassword?: (email: string) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
  returnUrl?: string;
}

const OAUTH_BUTTONS: { id: OAuthProvider; label: string }[] = [
  { id: "google", label: "Continue with Google" },
  { id: "facebook", label: "Continue with Facebook" },
  { id: "apple", label: "Continue with Apple" },
];

function OAuthIcon({ provider }: { provider: OAuthProvider }) {
  if (provider === "google") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    );
  }
  if (provider === "facebook") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83v-3.47h-2.034c-1.993 0-2.617 1.237-2.617 2.507v3.008h4.461v3.47h-4.461v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-1.78-1.96-2.54-2.94-.76-.98-1.27-1.98-1.53-3.01-.26-1.03-.39-2.09-.39-3.18 0-1.17.13-2.23.39-3.18.26-1.03.77-2.03 1.53-3.01.76-.98 1.56-1.96 2.54-2.94.98-.98 2.04-1.47 3.18-1.47 1.22 0 2.28.49 3.18 1.47.98.98 1.78 1.96 2.54 2.94.76.98 1.27 1.98 1.53 3.01.26 1.03.39 2.09.39 3.18 0 1.17-.13 2.23-.39 3.18-.26 1.03-.77 2.03-1.53 3.01-.76.98-1.56 1.96-2.54 2.94-.98.98-2.04 1.47-3.18 1.47-1.22 0-2.28-.49-3.18-1.47z" />
    </svg>
  );
}

export default function AuthCard({
  mode,
  onSubmit,
  onOAuth,
  onForgotPassword,
  loading = false,
  error,
}: AuthCardProps) {
  const isLogin = mode === "login";
  const [localError, setLocalError] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    const form = new FormData(e.currentTarget);
    try {
      await onSubmit({
        email: form.get("email") as string,
        password: form.get("password") as string,
        confirmPassword: form.get("confirmPassword") as string | undefined,
        displayName: form.get("displayName") as string | undefined,
      });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleOAuth = async (provider: OAuthProvider) => {
    if (!onOAuth) return;
    setLocalError(null);
    try {
      await onOAuth(provider);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : `${provider} sign-in failed`);
    }
  };

  const displayError = error ?? localError;

  return (
    <VinylCard showDisc className="cj-auth-card w-full max-w-md !p-6 sm:!p-8 md:!p-10">
      <div className="mb-6 flex justify-center">
        <VinylDisc size={56} />
      </div>

      <div className="space-y-3">
        {OAUTH_BUTTONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleOAuth(id)}
            disabled={loading || !onOAuth}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-cj-gold-border bg-cj-dark py-3 text-sm text-cj-gold transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            <OAuthIcon provider={id} />
            {label}
          </button>
        ))}
      </div>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-cj-gold-border" />
        <span className="text-xs uppercase tracking-widest text-cj-gold-muted">Or email</span>
        <div className="h-px flex-1 bg-cj-gold-border" />
      </div>

      {displayError && (
        <p className="mb-4 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {displayError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cj-gold-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <input name="email" type="email" required disabled={loading} placeholder="Email" className="cj-input" />
        </div>

        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cj-gold-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <input name="password" type="password" required disabled={loading} placeholder="Password" className="cj-input" />
        </div>

        {!isLogin && (
          <input name="displayName" type="text" required disabled={loading} placeholder="Display name / artist name" className="cj-input !pl-4" />
        )}

        {!isLogin && (
          <input name="confirmPassword" type="password" required disabled={loading} placeholder="Confirm Password" className="cj-input !pl-4" />
        )}

        {isLogin && (
          <div className="text-right">
            {showForgot ? (
              <div className="space-y-2 text-left">
                <input name="forgotEmail" type="email" required disabled={loading} placeholder="Your email" className="cj-input !pl-4" />
                {forgotSent ? (
                  <p className="text-xs text-cj-gold-bright">Check your inbox for a reset link.</p>
                ) : (
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary" size="sm" disabled={loading || !onForgotPassword} onClick={async () => {
                      const input = document.querySelector<HTMLInputElement>('input[name="forgotEmail"]');
                      const email = input?.value?.trim();
                      if (!email || !onForgotPassword) return;
                      setLocalError(null);
                      try {
                        await onForgotPassword(email);
                        setForgotSent(true);
                      } catch (err) {
                        setLocalError(err instanceof Error ? err.message : "Could not send reset email");
                      }
                    }}>
                      Send reset link
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForgot(false); setForgotSent(false); }}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <button type="button" className="text-xs text-cj-gold-muted hover:text-cj-gold" onClick={() => setShowForgot(true)}>
                Forgot password?
              </button>
            )}
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Log In" : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-cj-gold-muted">
        {isLogin ? (
          <>Don&apos;t have an account? <Link href="/register" className="text-cj-gold hover:underline">Create one</Link></>
        ) : (
          <>Already have an account? <Link href="/login" className="text-cj-gold hover:underline">Log in</Link></>
        )}
      </p>

      <p className="mt-4 text-center text-[10px] leading-relaxed text-cj-gold-muted">
        By continuing, you agree to our <Link href="/terms" className="text-cj-gold hover:underline">Terms</Link> and{" "}
        <Link href="/privacy" className="text-cj-gold hover:underline">Privacy Policy</Link>.
      </p>
    </VinylCard>
  );
}
