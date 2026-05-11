// New Supabase schema — run this in the SQL editor before using the app:
//
// CREATE TABLE teams (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   name TEXT NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
// ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "public all" ON teams USING (true) WITH CHECK (true);
//
// CREATE TABLE players (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
//   name TEXT NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
// ALTER TABLE players ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "public all" ON players USING (true) WITH CHECK (true);
//
// DROP TABLE IF EXISTS lineups;
// CREATE TABLE lineups (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
//   name TEXT NOT NULL DEFAULT 'Lineup',
//   formation TEXT NOT NULL DEFAULT '4-4-2',
//   assignments JSONB NOT NULL DEFAULT '{}',
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );
// ALTER TABLE lineups ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "public all" ON lineups USING (true) WITH CHECK (true);

import { getSupabase } from './supabase'
import type { Player } from '../types'

export interface Team {
  id: string
  name: string
  created_at: string
}

export interface Lineup {
  id: string
  team_id: string
  name: string
  formation: string
  assignments: Record<string, string>
  created_at: string
  updated_at: string
}

const db = () => getSupabase()

export async function getTeams(): Promise<Team[]> {
  const { data, error } = await db().from('teams').select('*').order('created_at')
  if (error) throw error
  return data ?? []
}

export async function createTeam(name: string): Promise<Team> {
  const { data, error } = await db().from('teams').insert({ name }).select().single()
  if (error) throw error
  return data
}

export async function updateTeamName(id: string, name: string): Promise<void> {
  const { error } = await db().from('teams').update({ name }).eq('id', id)
  if (error) throw error
}

export async function deleteTeam(id: string): Promise<void> {
  const { error } = await db().from('teams').delete().eq('id', id)
  if (error) throw error
}

export async function getTeam(id: string): Promise<Team> {
  const { data, error } = await db().from('teams').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function getTeamPlayers(teamId: string): Promise<Player[]> {
  const { data, error } = await db().from('players').select('*').eq('team_id', teamId).order('created_at')
  if (error) throw error
  return data ?? []
}

export async function addPlayer(teamId: string, name: string): Promise<Player> {
  const { data, error } = await db().from('players').insert({ team_id: teamId, name }).select().single()
  if (error) throw error
  return data
}

export async function removePlayer(playerId: string): Promise<void> {
  const { error } = await db().from('players').delete().eq('id', playerId)
  if (error) throw error
}

export async function getTeamLineups(teamId: string): Promise<Lineup[]> {
  const { data, error } = await db().from('lineups').select('*').eq('team_id', teamId).order('created_at')
  if (error) throw error
  return data ?? []
}

export async function createLineup(teamId: string, name: string): Promise<Lineup> {
  const { data, error } = await db()
    .from('lineups')
    .insert({ team_id: teamId, name, formation: '4-4-2', assignments: {} })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getLineup(id: string): Promise<Lineup & { team: Team; players: Player[] }> {
  const { data, error } = await db().from('lineups').select('*, team:teams(*)').eq('id', id).single()
  if (error) throw error
  const players = await getTeamPlayers(data.team_id)
  return { ...data, players }
}

export async function updateLineup(id: string, updates: Partial<Pick<Lineup, 'name' | 'formation' | 'assignments'>>): Promise<void> {
  const { error } = await db()
    .from('lineups')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteLineup(id: string): Promise<void> {
  const { error } = await db().from('lineups').delete().eq('id', id)
  if (error) throw error
}
