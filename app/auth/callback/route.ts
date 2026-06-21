import { NextResponse } from "next/server";
import { getRedirectOrigin } from "@/lib/site-url";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = getRedirectOrigin(request);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/profile";
  const oauthError = searchParams.get("error_description") ?? searchParams.get("error");

  if (oauthError) {
    const params = new URLSearchParams({ error: oauthError });
    return NextResponse.redirect(`${origin}/login?${params.toString()}`);
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      const params = new URLSearchParams({
        error_description: error.message,
      });
      return NextResponse.redirect(`${origin}/login?${params.toString()}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
