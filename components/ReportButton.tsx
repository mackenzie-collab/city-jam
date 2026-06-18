"use client";

import { useState } from "react";
import Link from "next/link";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  submitContentReport,
  reportsUnavailable,
  type ReportContentType,
  type ReportReason,
} from "@/lib/reports";

const REASONS: { value: ReportReason; label: string }[] = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment or abuse" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "copyright", label: "Copyright concern" },
  { value: "other", label: "Other" },
];

interface ReportButtonProps {
  contentType: ReportContentType;
  contentId: string;
  className?: string;
}

export default function ReportButton({ contentType, contentId, className }: ReportButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("other");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (reportsUnavailable()) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setStatus("submitting");
    setError(null);
    try {
      await submitContentReport({
        reporterId: user.id,
        contentType,
        contentId,
        reason,
        details,
      });
      setStatus("done");
      setOpen(false);
      setDetails("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Report failed");
    }
  };

  if (!isAuthenticated) {
    return (
      <Link
        href={`/login?returnUrl=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`}
        className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-cj-gold-muted hover:text-cj-gold ${className ?? ""}`}
      >
        <Flag className="h-3 w-3" /> Report
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-cj-gold-muted hover:text-cj-gold ${className ?? ""}`}
      >
        <Flag className="h-3 w-3" /> Report
      </button>

      {open && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-4">
          <div className="cj-card w-full max-w-md space-y-4">
            <h2 className="font-display text-lg uppercase text-cj-gold">Report content</h2>
            <p className="text-xs text-cj-gold-muted">
              Reports are reviewed against our{" "}
              <Link href="/terms" className="text-cj-gold underline">
                Terms
              </Link>
              . Misuse of reporting may result in account action.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                  Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ReportReason)}
                  className="cj-input !pl-4 mt-1 !w-full"
                >
                  {REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                  Details (optional)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="What happened?"
                  className="cj-input !pl-4 mt-1 min-h-[80px]"
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              {status === "done" && (
                <p className="text-xs text-cj-gold-bright">Report submitted. Thank you.</p>
              )}
              <div className="flex gap-2">
                <Button type="submit" variant="primary" size="sm" disabled={status === "submitting"}>
                  {status === "submitting" ? "Sending..." : "Submit Report"}
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
