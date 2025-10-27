export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          role: string | null
          created_at: string | null
          updated_at: string | null
          is_challenge_completed: boolean | null
          is_disqualified: boolean | null
          admin_notes: string | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
          is_challenge_completed?: boolean | null
          is_disqualified?: boolean | null
          admin_notes?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
          is_challenge_completed?: boolean | null
          is_disqualified?: boolean | null
          admin_notes?: string | null
        }
      }
      firms: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          website_url: string | null
          headquarters: string | null
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          website_url?: string | null
          headquarters?: string | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          website_url?: string | null
          headquarters?: string | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      cases: {
        Row: {
          id: string
          firm_id: string
          type: "approval" | "denial"
          payout_date: string
          rating: number
          title: string | null
          notes: string | null
          evidence_urls: string[] | null
          submitted_by: string | null
          workflow_status: "submitted" | "under_review" | "published" | "rejected"
          created_at: string | null
          published_at: string | null
        }
        Insert: {
          id?: string
          firm_id: string
          type: "approval" | "denial"
          payout_date: string
          rating: number
          title?: string | null
          notes?: string | null
          evidence_urls?: string[] | null
          submitted_by?: string | null
          workflow_status?: "submitted" | "under_review" | "published" | "rejected"
          created_at?: string | null
          published_at?: string | null
        }
        Update: {
          id?: string
          firm_id?: string
          type?: "approval" | "denial"
          payout_date?: string
          rating?: number
          title?: string | null
          notes?: string | null
          evidence_urls?: string[] | null
          submitted_by?: string | null
          workflow_status?: "submitted" | "under_review" | "published" | "rejected"
          created_at?: string | null
          published_at?: string | null
        }
      }
      firms_agg: {
        Row: {
          firm_id: string
          approvals_7d: number | null
          approvals_30d: number | null
          approvals_total: number | null
          denials_7d: number | null
          denials_30d: number | null
          denials_total: number | null
          avg_rating: number | null
          approval_rate_30d: number | null
          ranking_score: number | null
          last_case_at: string | null
        }
        Insert: {
          firm_id: string
          approvals_7d?: number | null
          approvals_30d?: number | null
          approvals_total?: number | null
          denials_7d?: number | null
          denials_30d?: number | null
          denials_total?: number | null
          avg_rating?: number | null
          approval_rate_30d?: number | null
          ranking_score?: number | null
          last_case_at?: string | null
        }
        Update: {
          firm_id?: string
          approvals_7d?: number | null
          approvals_30d?: number | null
          approvals_total?: number | null
          denials_7d?: number | null
          denials_30d?: number | null
          denials_total?: number | null
          avg_rating?: number | null
          approval_rate_30d?: number | null
          ranking_score?: number | null
          last_case_at?: string | null
        }
      }
    }
  }
}