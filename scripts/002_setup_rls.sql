-- Step 3: Row Level Security and Storage Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE firm_daily_rollups ENABLE ROW LEVEL SECURITY;
ALTER TABLE firms_agg ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_public" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE USING (auth.uid() = id);

-- Firms policies (public read, admin/moderator write)
CREATE POLICY "firms_select_all" ON firms FOR SELECT USING (true);
CREATE POLICY "firms_insert_admin" ON firms FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);
CREATE POLICY "firms_update_admin" ON firms FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);
CREATE POLICY "firms_delete_admin" ON firms FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- Cases policies
CREATE POLICY "cases_select_published_or_own" ON cases FOR SELECT USING (
  workflow_status = 'published' 
  OR submitted_by = auth.uid() 
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);
CREATE POLICY "cases_insert_authenticated" ON cases FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND submitted_by = auth.uid()
);
CREATE POLICY "cases_update_own_or_admin" ON cases FOR UPDATE USING (
  (submitted_by = auth.uid() AND workflow_status != 'published')
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);
CREATE POLICY "cases_delete_own_or_admin" ON cases FOR DELETE USING (
  (submitted_by = auth.uid() AND workflow_status != 'published')
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- Rollups and aggregates (public read, service role write)
CREATE POLICY "firm_daily_rollups_select_all" ON firm_daily_rollups FOR SELECT USING (true);
CREATE POLICY "firms_agg_select_all" ON firms_agg FOR SELECT USING (true);

-- Moderation events (admin/moderator access, users can see their own case events)
CREATE POLICY "moderation_events_select_admin_or_own" ON moderation_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  OR EXISTS (SELECT 1 FROM cases WHERE id = case_id AND submitted_by = auth.uid())
);
CREATE POLICY "moderation_events_insert_admin" ON moderation_events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);
