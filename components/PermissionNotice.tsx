"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PermissionNoticeProps {
  title: string;
  body: React.ReactNode;
  acceptLabel?: string;
  declineLabel?: string;
  onAccept: () => void;
  onDecline?: () => void;
  learnMoreHref?: string;
}

export default function PermissionNotice({
  title,
  body,
  acceptLabel = "Continue",
  declineLabel = "Not now",
  onAccept,
  onDecline,
  learnMoreHref,
}: PermissionNoticeProps) {
  return (
    <div className="cj-card mx-auto max-w-md space-y-4 text-left">
      <h2 className="font-display text-xl uppercase text-cj-gold">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-cj-gold-muted">{body}</div>
      {learnMoreHref && (
        <Link href={learnMoreHref} className="inline-block text-xs text-cj-gold underline">
          Learn more in our Privacy Policy
        </Link>
      )}
      <div className="flex flex-wrap gap-3 pt-2">
        <Button variant="primary" size="sm" onClick={onAccept}>
          {acceptLabel}
        </Button>
        {onDecline && (
          <Button variant="secondary" size="sm" onClick={onDecline}>
            {declineLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export function hasStoredConsent(key: string): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(key) === "1";
}

export function storeConsent(key: string): void {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(key, "1");
  }
}

export const MIC_CONSENT_KEY = "cj-mic-consent";
export const GEO_CONSENT_KEY = "cj-geo-consent";
