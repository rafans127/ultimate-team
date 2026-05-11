import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getTeam, getTeamPlayers, getTeamLineups,
  addPlayer, removePlayer,
  createLineup, deleteLineup, updateTeamName,
  type Team, type Lineup,
} from '../lib/db'
import type { Player } from '../types'

export default function TeamPage() {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()

  const [team, setTeam] = useState<Team | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [lineups, setLineups] = useState<Lineup[]>([])
  const [loading, setLoading] = useState(true)
  const [playerInput, setPlayerInput] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [teamName, setTeamName] = useState('')

  useEffect(() => {
    if (!teamId) return
    Promise.all([getTeam(teamId), getTeamPlayers(teamId), getTeamLineups(teamId)])
      .then(([t, p, l]) => {
        setTeam(t)
        setTeamName(t.name)
        setPlayers(p)
        setLineups(l)
      })
      .finally(() => setLoading(false))
  }, [teamId])

  async function handleAddPlayer(e: React.FormEvent) {
    e.preventDefault()
    const name = playerInput.trim()
    if (!name || !teamId) return
    const player = await addPlayer(teamId, name)
    setPlayers(prev => [...prev, player])
    setPlayerInput('')
  }

  async function handleRemovePlayer(playerId: string) {
    await removePlayer(playerId)
    setPlayers(prev => prev.filter(p => p.id !== playerId))
  }

  async function handleNewLineup() {
    if (!teamId) return
    const lineup = await createLineup(teamId, `Lineup ${lineups.length + 1}`)
    navigate(`/lineup/${lineup.id}`)
  }

  async function handleDeleteLineup(e: React.MouseEvent, lineupId: string) {
    e.stopPropagation()
    if (!confirm('Delete this lineup?')) return
    await deleteLineup(lineupId)
    setLineups(prev => prev.filter(l => l.id !== lineupId))
  }

  async function handleSaveName() {
    if (!teamId || !teamName.trim()) return
    await updateTeamName(teamId, teamName.trim())
    setTeam(prev => prev ? { ...prev, name: teamName.trim() } : prev)
    setEditingName(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors text-lg">
          ←
        </button>
        {editingName ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              autoFocus
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={e => e.key === 'Enter' && handleSaveName()}
              className="flex-1 bg-gray-800 rounded px-3 py-1 text-white text-xl font-bold border border-blue-500 focus:outline-none"
            />
          </div>
        ) : (
          <h1
            className="text-2xl font-bold cursor-pointer hover:text-gray-300 transition-colors flex-1"
            onClick={() => setEditingName(true)}
            title="Tap to rename"
          >
            {team?.name}
          </h1>
        )}
      </div>

      {/* Roster */}
      <section className="mb-8">
        <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">
          Players ({players.length})
        </h2>

        <div className="flex flex-col gap-2 mb-3">
          {players.map(player => (
            <div key={player.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2.5">
              <span className="text-sm">{player.name}</span>
              <button
                onClick={() => handleRemovePlayer(player.id)}
                className="text-gray-500 hover:text-red-400 text-lg leading-none transition-colors ml-3"
              >
                ×
              </button>
            </div>
          ))}
          {players.length === 0 && (
            <p className="text-gray-500 text-sm">No players yet.</p>
          )}
        </div>

        <form onSubmit={handleAddPlayer} className="flex gap-2">
          <input
            type="text"
            value={playerInput}
            onChange={e => setPlayerInput(e.target.value)}
            placeholder="Player name"
            className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 rounded-lg px-4 py-2 text-sm font-bold transition-colors"
          >
            +
          </button>
        </form>
      </section>

      {/* Lineups */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs text-gray-400 uppercase tracking-wider">
            Lineups ({lineups.length})
          </h2>
          <button
            onClick={handleNewLineup}
            className="bg-green-600 hover:bg-green-500 rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors"
          >
            + New Lineup
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {lineups.map(lineup => (
            <div
              key={lineup.id}
              onClick={() => navigate(`/lineup/${lineup.id}`)}
              className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 rounded-xl px-5 py-4 cursor-pointer transition-colors"
            >
              <div>
                <p className="font-medium">{lineup.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{lineup.formation}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">→</span>
                <button
                  onClick={e => handleDeleteLineup(e, lineup.id)}
                  className="text-gray-600 hover:text-red-400 text-lg leading-none transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          {lineups.length === 0 && (
            <p className="text-gray-500 text-sm">No lineups yet. Create one above.</p>
          )}
        </div>
      </section>
    </div>
  )
}
