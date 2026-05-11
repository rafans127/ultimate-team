import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// SQL to run in Supabase dashboard:
//
// CREATE TABLE lineups (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   team_name TEXT NOT NULL DEFAULT 'My Team',
//   formation TEXT NOT NULL,
//   players JSONB NOT NULL DEFAULT '[]',
//   assignments JSONB NOT NULL DEFAULT '{}',
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// ALTER TABLE lineups ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "public read"   ON lineups FOR SELECT USING (true);
// CREATE POLICY "public insert" ON lineups FOR INSERT WITH CHECK (true);
// CREATE POLICY "public update" ON lineups FOR UPDATE USING (true);

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
  if (!_client) _client = createClient(url, key)
  return _client
}
