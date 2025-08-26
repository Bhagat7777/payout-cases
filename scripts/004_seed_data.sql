-- Seed sample firms and data for testing

-- Insert sample firms
INSERT INTO firms (name, slug, logo_url, website, country, description) VALUES
('FTMO', 'ftmo', '/placeholder.svg?height=40&width=40', 'https://ftmo.com', 'Czech Republic', 'Leading prop trading firm with transparent evaluation process'),
('MyForexFunds', 'myforexfunds', '/placeholder.svg?height=40&width=40', 'https://myforexfunds.com', 'Canada', 'Innovative prop trading platform with flexible rules'),
('The5ers', 'the5ers', '/placeholder.svg?height=40&width=40', 'https://the5ers.com', 'Israel', 'Professional trading firm with scaling programs'),
('TopstepTrader', 'topsteptrader', '/placeholder.svg?height=40&width=40', 'https://topsteptrader.com', 'USA', 'Established futures prop trading firm'),
('Apex Trader Funding', 'apex-trader-funding', '/placeholder.svg?height=40&width=40', 'https://apextraderfunding.com', 'USA', 'Fast-growing prop trading platform'),
('Funded Next', 'funded-next', '/placeholder.svg?height=40&width=40', 'https://fundednext.com', 'UAE', 'Modern prop trading firm with competitive conditions')
ON CONFLICT (slug) DO NOTHING;

-- Initialize firms_agg for all firms
INSERT INTO firms_agg (firm_id)
SELECT id FROM firms
ON CONFLICT (firm_id) DO NOTHING;

-- Insert some sample published cases for demonstration
WITH sample_firms AS (
  SELECT id, slug FROM firms LIMIT 3
)
INSERT INTO cases (firm_id, type, payout_date, rating, title, notes, workflow_status, published_at, created_at) 
SELECT 
  f.id,
  CASE WHEN random() > 0.7 THEN 'denial'::case_type ELSE 'approval'::case_type END,
  CURRENT_DATE - (random() * 30)::integer,
  (random() * 4 + 1)::integer,
  CASE WHEN random() > 0.5 THEN 'Quick payout received' ELSE 'Smooth withdrawal process' END,
  'Sample case for demonstration purposes',
  'published'::workflow_status,
  NOW() - (random() * interval '7 days'),
  NOW() - (random() * interval '7 days')
FROM sample_firms f, generate_series(1, 5);
