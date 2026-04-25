// Supabase queries for payout systems
import { createBrowserClient } from "@/lib/supabase/client";

const supabase = createBrowserClient();

// Get only firms with at least one approved payout
export async function getFirmsWithApprovals() {
  try {
    const { data, error } = await supabase
      .from("firms_agg")
      .select(
        `
        firm_id,
        approvals_total,
        denials_total,
        approval_rate_30d,
        firms (
          id,
          name,
          slug,
          logo_url,
          website
        )
      `
      )
      .gt("approvals_total", 0)
      .order("approvals_total", { ascending: false });

    if (error) throw error;

    return data?.map((item: any) => ({
      id: item.firm_id,
      name: item.firms.name,
      slug: item.firms.slug,
      logo_url: item.firms.logo_url,
      website: item.firms.website,
      approvals_total: item.approvals_total,
      denials_total: item.denials_total,
      approval_rate: item.approval_rate_30d || 0,
    })) || [];
  } catch (error) {
    console.error("Error fetching firms with approvals:", error);
    throw error;
  }
}

// Get cases for a specific firm
export async function getFirmCases(firmId: string, type?: "approval" | "denial") {
  try {
    let query = supabase
      .from("cases")
      .select("*")
      .eq("firm_id", firmId)
      .eq("workflow_status", "published")
      .order("published_at", { ascending: false });

    if (type) {
      query = query.eq("type", type);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching firm cases:", error);
    throw error;
  }
}

// Get firm by slug
export async function getFirmBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from("firms")
      .select(
        `
        *,
        firms_agg (
          approvals_total,
          denials_total,
          approval_rate_30d,
          avg_rating
        )
      `
      )
      .eq("slug", slug)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching firm by slug:", error);
    throw error;
  }
}

// Get statistics for dashboard
export async function getPayoutStats() {
  try {
    const { data: approvalsData, error: approvalsError } = await supabase
      .from("cases")
      .select("id")
      .eq("type", "approval")
      .eq("workflow_status", "published");

    const { data: denialsData, error: denialsError } = await supabase
      .from("cases")
      .select("id")
      .eq("type", "denial")
      .eq("workflow_status", "published");

    const { data: firmsData, error: firmsError } = await supabase
      .from("firms_agg")
      .select("approvals_total")
      .gt("approvals_total", 0);

    if (approvalsError || denialsError || firmsError) {
      throw new Error("Error fetching stats");
    }

    const totalApprovals = approvalsData?.length || 0;
    const totalDenials = denialsData?.length || 0;
    const totalPayingFirms = firmsData?.length || 0;

    return {
      totalApprovals,
      totalDenials,
      totalPayingFirms,
      verificationRate: totalApprovals + totalDenials > 0 ? 100 : 0,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
}

// Subscribe to real-time case updates
export function subscribeToNewCases(
  callback: (newCase: any) => void,
  type?: "approval" | "denial"
) {
  let query = supabase
    .channel("cases_changes")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "cases",
        filter: `workflow_status=eq.published${type ? `&type=eq.${type}` : ""}`,
      },
      (payload) => {
        callback(payload.new);
      }
    );

  return query.subscribe();
}

// Subscribe to firm statistics changes
export function subscribeToFirmStatsUpdates(
  firmId: string,
  callback: (updatedAgg: any) => void
) {
  return supabase
    .channel(`firm_agg_${firmId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "firms_agg",
        filter: `firm_id=eq.${firmId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
}
