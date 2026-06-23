"use client";

import { FormEvent, useEffect, useState } from "react";

const HEAR_ABOUT_OPTIONS = [
  "Social media",
  "Friend or colleague",
  "Music event",
  "Email or newsletter",
  "Other",
] as const;

type Track = "individual" | "band";

function trackFromHash(hash: string): Track | "" {
  if (hash === "#signup-individual") return "individual";
  if (hash === "#signup-band") return "band";
  return "";
}

export default function AffiliateForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [track, setTrack] = useState<Track | "">("");
  const [heardFrom, setHeardFrom] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const applyHash = () => {
      const preset = trackFromHash(window.location.hash);
      if (preset) setTrack(preset);
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !track || !heardFrom) {
      setError("Complete all required fields before applying.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/affiliate/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          handle: handle.trim() || null,
          track,
          heardFrom,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Application could not be submitted. Try again.");
      }

      setSuccess(true);

      if (typeof window !== "undefined" && "fbq" in window) {
        (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.("track", "Lead");
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Application could not be submitted. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="affiliate-form-card" role="status" aria-live="polite">
        <p className="affiliate-form-success">
          You&apos;re in. We&apos;ll reach out within 48 hours to schedule your onboarding session.
        </p>
      </div>
    );
  }

  return (
    <form className="affiliate-form-card" onSubmit={handleSubmit} noValidate>
      <div className="affiliate-form-grid">
        <div>
          <label className="affiliate-label" htmlFor="affiliate-name">
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            id="affiliate-name"
            className="affiliate-input"
            type="text"
            name="fullName"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label className="affiliate-label" htmlFor="affiliate-email">
            Email address <span aria-hidden="true">*</span>
          </label>
          <input
            id="affiliate-email"
            className="affiliate-input"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="affiliate-label" htmlFor="affiliate-handle">
            Instagram / TikTok handle
          </label>
          <input
            id="affiliate-handle"
            className="affiliate-input"
            type="text"
            name="handle"
            placeholder="@yourhandle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />
        </div>

        <div>
          <label className="affiliate-label" htmlFor="affiliate-track">
            Track <span aria-hidden="true">*</span>
          </label>
          <select
            id="affiliate-track"
            className="affiliate-select"
            name="track"
            required
            value={track}
            onChange={(e) => setTrack(e.target.value as Track)}
          >
            <option value="" disabled>
              Select your track
            </option>
            <option value="individual">Individual</option>
            <option value="band">Band or collective</option>
          </select>
        </div>

        <div>
          <label className="affiliate-label" htmlFor="affiliate-heard">
            How did you hear about us? <span aria-hidden="true">*</span>
          </label>
          <select
            id="affiliate-heard"
            className="affiliate-select"
            name="heardFrom"
            required
            value={heardFrom}
            onChange={(e) => setHeardFrom(e.target.value)}
          >
            <option value="" disabled>
              Select one
            </option>
            {HEAR_ABOUT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <p className="affiliate-disclaimer" style={{ color: "#e8a0a0", marginTop: "1rem" }} role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="affiliate-btn-primary affiliate-btn-full"
        style={{ marginTop: "1.5rem" }}
        disabled={submitting}
        aria-busy={submitting}
      >
        {submitting ? "Submitting..." : "Apply to become an affiliate"}
      </button>
    </form>
  );
}
