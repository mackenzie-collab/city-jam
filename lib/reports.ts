import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type ReportContentType = "community_post" | "circle_post" | "room_reaction";

export type ReportReason = "spam" | "harassment" | "inappropriate" | "copyright" | "other";

export interface ContentReportInput {
  reporterId: string;
  contentType: ReportContentType;
  contentId: string;
  reason: ReportReason;
  details?: string;
}

export function reportsUnavailable() {
  return !isSupabaseConfigured() || !getSupabase();
}

export async function submitContentReport(input: ContentReportInput): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Reporting is unavailable offline");

  const { error } = await supabase.from("content_reports").insert({
    reporter_id: input.reporterId,
    content_type: input.contentType,
    content_id: input.contentId,
    reason: input.reason,
    details: (input.details ?? "").trim(),
  });

  if (error) throw error;
}
