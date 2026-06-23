import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

interface AffiliateApplication {
  fullName: string;
  email: string;
  handle: string | null;
  track: "individual" | "band";
  heardFrom: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function persistToSupabase(payload: {
  full_name: string;
  email: string;
  handle: string | null;
  track: string;
  heard_from: string;
  source: string;
  submitted_at: string;
}) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false as const, error: "Supabase not configured" };

  const { error } = await supabase.from("affiliate_applications").insert(payload);
  if (error) {
    console.error("Affiliate Supabase insert failed:", error.message);
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const };
}

async function forwardToWebhook(payload: Record<string, unknown>) {
  const webhookUrl = process.env.AFFILIATE_FORM_WEBHOOK_URL;
  if (!webhookUrl) return { ok: false as const, skipped: true as const };

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      console.error("Affiliate webhook failed:", webhookResponse.status, await webhookResponse.text());
      return { ok: false as const, error: "Webhook failed" };
    }

    return { ok: true as const };
  } catch (error) {
    console.error("Affiliate webhook error:", error);
    return { ok: false as const, error: "Webhook error" };
  }
}

export async function POST(request: Request) {
  let body: Partial<AffiliateApplication>;

  try {
    body = (await request.json()) as Partial<AffiliateApplication>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const track = body.track;
  const heardFrom = body.heardFrom?.trim() ?? "";
  const handle = body.handle?.trim() || null;

  if (!fullName || !email || !track || !heardFrom) {
    return NextResponse.json({ error: "All required fields must be provided." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (track !== "individual" && track !== "band") {
    return NextResponse.json({ error: "Select a valid track." }, { status: 400 });
  }

  const submittedAt = new Date().toISOString();
  const clientPayload = {
    fullName,
    email,
    handle,
    track,
    heardFrom,
    source: "affiliate-waitlist",
    submittedAt,
  };

  const dbPayload = {
    full_name: fullName,
    email,
    handle,
    track,
    heard_from: heardFrom,
    source: "affiliate-waitlist",
    submitted_at: submittedAt,
  };

  const supabaseResult = isSupabaseConfigured() ? await persistToSupabase(dbPayload) : { ok: false as const };
  const webhookResult = await forwardToWebhook(clientPayload);

  const stored = supabaseResult.ok || webhookResult.ok;

  if (!stored) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Waitlist is temporarily unavailable. Email contact@cityjam.app and we'll add you manually." },
        { status: 503 }
      );
    }

    console.warn("Affiliate waitlist submission accepted in dev without storage.");
  }

  return NextResponse.json({ ok: true });
}
