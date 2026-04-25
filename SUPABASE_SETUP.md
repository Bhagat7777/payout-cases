# Supabase Configuration for PayoutCases

## Database Setup

### 1. Verify Tables Exist

Run these in Supabase SQL Editor to verify schema:

```sql
-- Check firms table
SELECT COUNT(*) as firms_count FROM firms;

-- Check cases table
SELECT COUNT(*) as cases_count FROM cases;

-- Check firms_agg table
SELECT COUNT(*) as firms_agg_count FROM firms_agg;

-- Check if there are published cases
SELECT COUNT(*) as published_cases 
FROM cases 
WHERE workflow_status = 'published';

-- Check firms with approvals
SELECT f.name, COUNT(c.id) as approval_count
FROM firms f
LEFT JOIN cases c ON f.id = c.firm_id AND c.type = 'approval' AND c.workflow_status = 'published'
GROUP BY f.id, f.name
HAVING COUNT(c.id) > 0
ORDER BY approval_count DESC;
```

### 2. Enable Real-Time for Supabase

The following tables need real-time enabled:

```sql
-- Enable real-time for cases table
ALTER TABLE cases REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE cases;

-- Enable real-time for firms_agg table
ALTER TABLE firms_agg REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE firms_agg;
```

### 3. Create Required Triggers

```sql
-- Trigger to auto-update firms_agg on new published case
CREATE OR REPLACE FUNCTION update_firm_agg_on_case()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.workflow_status = 'published' THEN
    UPDATE firms_agg
    SET
      approvals_total = approvals_total + (CASE WHEN NEW.type = 'approval' THEN 1 ELSE 0 END),
      denials_total = denials_total + (CASE WHEN NEW.type = 'denial' THEN 1 ELSE 0 END),
      approval_rate_30d = ROUND(
        (
          (SELECT COUNT(*) FROM cases WHERE firm_id = NEW.firm_id AND type = 'approval' AND workflow_status = 'published' AND published_at > NOW() - INTERVAL '30 days') ::numeric /
          NULLIF((SELECT COUNT(*) FROM cases WHERE firm_id = NEW.firm_id AND workflow_status = 'published' AND published_at > NOW() - INTERVAL '30 days'), 0)
        ) * 100, 2
      ),
      last_case_at = NOW()
    WHERE firm_id = NEW.firm_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_firm_agg_on_case ON cases;

-- Create trigger
CREATE TRIGGER trigger_update_firm_agg_on_case
AFTER INSERT ON cases
FOR EACH ROW
EXECUTE FUNCTION update_firm_agg_on_case();
```

### 4. Upsert Initial Data (if needed)

```sql
-- Ensure firms_agg entries exist for all firms
INSERT INTO firms_agg (firm_id, approvals_total, denials_total)
SELECT id, 0, 0 FROM firms
ON CONFLICT (firm_id) DO NOTHING;

-- Recalculate stats for existing firms
UPDATE firms_agg fa
SET
  approvals_total = (
    SELECT COUNT(*) FROM cases 
    WHERE firm_id = fa.firm_id AND type = 'approval' AND workflow_status = 'published'
  ),
  denials_total = (
    SELECT COUNT(*) FROM cases 
    WHERE firm_id = fa.firm_id AND type = 'denial' AND workflow_status = 'published'
  ),
  approval_rate_30d = ROUND(
    (
      SELECT COUNT(*) FROM cases 
      WHERE firm_id = fa.firm_id AND type = 'approval' AND workflow_status = 'published' AND published_at > NOW() - INTERVAL '30 days'
    ) ::numeric /
    NULLIF(
      (SELECT COUNT(*) FROM cases 
       WHERE firm_id = fa.firm_id AND workflow_status = 'published' AND published_at > NOW() - INTERVAL '30 days'),
      0
    ) * 100, 2
  );
```

## Row-Level Security (RLS)

### Enable RLS on tables

```sql
-- Enable RLS
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE firms ENABLE ROW LEVEL SECURITY;

-- Allow public to read published cases
CREATE POLICY "Public can read published cases"
  ON cases
  FOR SELECT
  USING (workflow_status = 'published');

-- Allow authenticated users to create cases
CREATE POLICY "Users can create cases"
  ON cases
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to update their own cases
CREATE POLICY "Users can update own cases"
  ON cases
  FOR UPDATE
  USING (submitted_by = auth.uid())
  WITH CHECK (submitted_by = auth.uid());

-- Allow public to read firms
CREATE POLICY "Public can read firms"
  ON firms
  FOR SELECT
  USING (true);

-- Allow public to read firm aggregates
ALTER TABLE firms_agg ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read firm aggregates"
  ON firms_agg
  FOR SELECT
  USING (true);
```

## Environment Configuration

### Update `.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]

# Optional: Service role key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]
```

## Testing Setup

### Add mock data for testing

```sql
-- Insert test firm
INSERT INTO firms (name, slug, logo_url, website)
VALUES ('Apex Trading Capital', 'apex-trading-capital', 'https://via.placeholder.com/48', 'https://apex.example.com')
ON CONFLICT (slug) DO NOTHING;

-- Get firm ID
SELECT id FROM firms WHERE slug = 'apex-trading-capital';

-- Insert test case (replace firm_id)
INSERT INTO cases (firm_id, type, payout_date, rating, title, notes, workflow_status, published_at)
VALUES (
  'YOUR_FIRM_ID',
  'approval',
  CURRENT_DATE - INTERVAL '5 days',
  5,
  'Successful Payout',
  'Received full account balance without issues',
  'published',
  NOW()
);

-- Verify
SELECT * FROM cases WHERE workflow_status = 'published' ORDER BY created_at DESC LIMIT 5;
```

## Deployment Checklist

- [ ] All required tables created in production Supabase
- [ ] Real-time enabled for `cases` and `firms_agg` tables
- [ ] Triggers created for auto-updating firm statistics
- [ ] RLS policies configured correctly
- [ ] Environment variables set in `.env.local`
- [ ] Test data inserted for verification
- [ ] Real-time subscriptions tested
- [ ] Backups configured in Supabase dashboard
- [ ] Database size monitoring enabled

## Troubleshooting

### Real-time not working?

1. Verify table has `REPLICA IDENTITY FULL`
2. Check that table is added to publication
3. Restart Supabase (sometimes needed after schema changes)
4. Check browser console for connection errors

### Queries returning no data?

1. Verify `workflow_status = 'published'` for public queries
2. Check RLS policies are correct
3. Run `SELECT * FROM cases LIMIT 1;` directly in SQL editor
4. Verify foreign key relationships exist

### Performance issues?

1. Add indexes on frequently queried fields:
```sql
CREATE INDEX idx_cases_firm_published ON cases(firm_id, workflow_status, published_at DESC);
CREATE INDEX idx_cases_type_published ON cases(type, workflow_status);
CREATE INDEX idx_firms_agg_approvals ON firms_agg(approvals_total DESC);
```

2. Monitor database size and connection count in dashboard

## Support Resources

- [Supabase Docs](https://supabase.com/docs)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Triggers](https://supabase.com/docs/guides/database/postgres/triggers)

---

**Last Updated:** February 2, 2026
