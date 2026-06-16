import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json(
      {
        ok: false,
        supabase: false,
        message: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
      },
      { status: 503 }
    );
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase.rpc("try_match", {
      p_user_id: "__healthcheck__",
      p_mode: "blind-echo",
      p_frequency: null,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, supabase: true, rpc: false, message: error.message },
        { status: 503 }
      );
    }

    // Clean up healthcheck queue entry
    await supabase
      .from("match_queue")
      .delete()
      .eq("user_id", "__healthcheck__");

    return NextResponse.json({
      ok: true,
      supabase: true,
      rpc: true,
      matchStatus: data,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        message: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
