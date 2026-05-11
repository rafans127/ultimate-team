import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTeams, createTeam, deleteTeam, type Team } from '../lib/db'

export default function TeamsPage() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getTeams()
      .then(setTeams)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    setCreating(true)
    try {
      const team = await createTeam(name)
      navigate(`/team/${team.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create team')
      setCreating(false)
    }
  }

  async function handleDelete(e: React.MouseEvent, teamId: string) {
    e.stopPropagation()
    if (!confirm('Delete this team and all its lineups?')) return
    await deleteTeam(teamId)
    setTeams(prev => prev.filter(t => t.id !== teamId))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">⚽</span>
        <h1 className="text-2xl font-bold">My Teams</h1>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : (
        <div className="flex flex-col gap-3 mb-8">
          {teams.length === 0 && (
            <p className="text-gray-500 text-sm">No teams yet. Create your first one below.</p>
          )}
          {teams.map(team => (
            <div
              key={team.id}
              onClick={() => navigate(`/team/${team.id}`)}
              className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 rounded-xl px-5 py-4 cursor-pointer transition-colors"
            >
              <span className="font-semibold">{team.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">→</span>
                <button
                  onClick={e => handleDelete(e, team.id)}
                  className="text-gray-600 hover:text-red-400 text-lg leading-none transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Team name"
          className="flex-1 bg-gray-800 rounded-xl px-4 py-3 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={creating}
          className="bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-xl px-5 py-3 font-semibold transition-colors"
        >
          {creating ? '…' : '+ New Team'}
        </button>
      </form>
    </div>
  )
}
