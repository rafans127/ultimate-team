import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DndContext } from '@dnd-kit/core'
import { getLineup, type Lineup } from '../lib/db'
import type { Player } from '../types'
import type { FormationKey } from '../data/formations'
import { FORMATIONS } from '../data/formations'
import Pitch from '../components/Pitch'

export default function SharedLineup() {
  const { lineupId } = useParams<{ lineupId: string }>()
  const [lineup, setLineup] = useState<Lineup | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [teamName, setTeamName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!lineupId) return
    let client
    try {
      // getLineup calls getSupabase internally, handle missing config gracefully
    } catch {
      setError('Supabase is not configured.')
      setLoading(false)
      return
    }
    void client
    getLineup(lineupId)
      .then(data => {
        setLineup(data)
        setPlayers(data.players)
        setTeamName((data.team as unknown as { name: string })?.name ?? '')
      })
      .catch(() => setError('Lineup not found.'))
      .finally(() => setLoading(false))
  }, [lineupId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Loading…</p>
      </div>
    )
  }

  if (error || !lineup) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-400">{error ?? 'Something went wrong.'}</p>
      </div>
    )
  }

  const positions = FORMATIONS[lineup.formation as FormationKey] ?? []

  return (
    <DndContext>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
        {teamName && <p className="text-gray-400 text-sm mb-1">{teamName}</p>}
        <h1 className="text-2xl font-bold mb-1">{lineup.name}</h1>
        <p className="text-gray-400 text-sm mb-6">{lineup.formation}</p>
        <div className="w-full max-w-xs">
          <Pitch positions={positions} assignments={lineup.assignments} players={players} readOnly />
        </div>
        <a href="/" className="mt-8 text-blue-400 hover:underline text-sm">
          Build your own lineup →
        </a>
      </div>
    </DndContext>
  )
}
