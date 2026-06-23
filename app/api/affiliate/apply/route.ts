import { NextResponse } from "next/server";

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

  const payload = {
    fullName,
    email,
    handle,
    track,
    heardFrom,
    source: "affiliate-landing",
    submittedAt: new Date().toISOString(),
  };

  const webhookUrl = process.env.AFFILIATE_FORM_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!webhookResponse.ok) {
        console.error("Affiliate webhook failed:", webhookResponse.status, await webhookResponse.text());
        return NextResponse.json(
          { error: "Application could not be processed. Try again shortly." },
          { status: 502 }
        );
      }
    } catch (error) {
      console.error("Affiliate webhook error:", error);
      return NextResponse.json(
        { error: "Application could not be processed. Try again shortly." },
        { status: 502 }
      );
    }
  } else if (process.env.NODE_ENV === "production") {
    console.warn("AFFILIATE_FORM_WEBHOOK_URL is not set — application accepted but not forwarded.");
  }

  return NextResponse.json({ ok: true });
}
