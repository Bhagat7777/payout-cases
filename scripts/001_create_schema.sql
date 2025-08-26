-- PropFirm Payout Cases Database Schema
-- Step 2: Database schema for firms + cases + rollups + aggregates

-- Create enums
CREATE TYPE case_type AS ENUM ('approval', 'denial');
CREATE TYPE workflow_status AS ENUM ('submitted', 'under_review', 'published', 'rejected');
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');

-- Firms table
CREATE TABLE IF NOT EXISTS firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  website TEXT,
  country TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle TEXT UNIQUE,
  role user_role DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cases (approvals/denials)
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  type case_type NOT NULL,
  payout_date DATE NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  notes TEXT,
  evidence_urls TEXT[],
  submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  workflow_status workflow_status DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Daily rollups per firm (for charts)
CREATE TABLE IF NOT EXISTS firm_daily_rollups (
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  day DATE NOT NULL,
  approvals INTEGER DEFAULT 0,
  denials INTEGER DEFAULT 0,
  ratings_count INTEGER DEFAULT 0,
  rating_sum INTEGER DEFAULT 0,
  PRIMARY KEY (firm_id, day)
);

-- Aggregated snapshot for leaderboard
CREATE TABLE IF NOT EXISTS firms_agg (
  firm_id UUID PRIMARY KEY REFERENCES firms(id) ON DELETE CASCADE,
  approvals_7d INTEGER DEFAULT 0,
  approvals_30d INTEGER DEFAULT 0,
  approvals_total INTEGER DEFAULT 0,
  denials_7d INTEGER DEFAULT 0,
  denials_30d INTEGER DEFAULT 0,
  denials_total INTEGER DEFAULT 0,
  ratings_count INTEGER DEFAULT 0,
  rating_sum INTEGER DEFAULT 0,
  avg_rating NUMERIC(3,2) GENERATED ALWAYS AS (
    CASE 
      WHEN ratings_count > 0 THEN ROUND((rating_sum::NUMERIC / ratings_count)::NUMERIC, 2) 
      ELSE 0 
    END
  ) STORED,
  approval_rate_30d NUMERIC(5,2),
  last_case_at TIMESTAMPTZ,
  ranking_score NUMERIC(8,4) DEFAULT 0
);

-- Moderation events for audit trail
CREATE TABLE IF NOT EXISTS moderation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  reason TEXT,
  actor UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cases_firm_id ON cases(firm_id);
CREATE INDEX IF NOT EXISTS idx_cases_type_status_published ON cases(type, workflow_status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_cases_payout_date ON cases(payout_date);
CREATE INDEX IF NOT EXISTS idx_firm_daily_rollups_day ON firm_daily_rollups(day);
CREATE INDEX IF NOT EXISTS idx_moderation_events_case_created ON moderation_events(case_id, created_at);
