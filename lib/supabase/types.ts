export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          handle: string | null
          role: "user" | "moderator" | "admin"
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          handle?: string | null
          role?: "user" | "moderator" | "admin"
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          handle?: string | null
          role?: "user" | "moderator" | "admin"
          avatar_url?: string | null
          created_at?: string
        }
      }
      firms: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          website: string | null
          country: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          website?: string | null
          country?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          website?: string | null
          country?: string | null
          description?: string | null
          created_at?: string
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
          created_at: string
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
          created_at?: string
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
          created_at?: string
          published_at?: string | null
        }
      }
      firms_agg: {
        Row: {
          firm_id: string
          approvals_7d: number
          approvals_30d: number
          approvals_total: number
          denials_7d: number
          denials_30d: number
          denials_total: number
          ratings_count: number
          rating_sum: number
          avg_rating: number
          approval_rate_30d: number | null
          last_case_at: string | null
          ranking_score: number
        }
        Insert: {
          firm_id: string
          approvals_7d?: number
          approvals_30d?: number
          approvals_total?: number
          denials_7d?: number
          denials_30d?: number
          denials_total?: number
          ratings_count?: number
          rating_sum?: number
          approval_rate_30d?: number | null
          last_case_at?: string | null
          ranking_score?: number
        }
        Update: {
          firm_id?: string
          approvals_7d?: number
          approvals_30d?: number
          approvals_total?: number
          denials_7d?: number
          denials_30d?: number
          denials_total?: number
          ratings_count?: number
          rating_sum?: number
          approval_rate_30d?: number | null
          last_case_at?: string | null
          ranking_score?: number
        }
      }
    }
  }
}
