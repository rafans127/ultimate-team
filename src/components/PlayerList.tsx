import { useState } from 'react'
import type { Player } from '../types'
import PlayerCard from './PlayerCard'

interface Props {
  players: Player[]
  onAdd: (name: string) => void
  onRemove: (id: string) => void
  readOnly?: boolean
}

export default function PlayerList({ players, onAdd, onRemove, readOnly = false }: Props) {
  const [input, setInput] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const name = input.trim()
    if (!name) return
    onAdd(name)
    setInput('')
  }

  return (
    <div className="flex flex-col gap-2 min-h-0">
      <label className="text-xs text-gray-400 uppercase tracking-wider">
        Bench ({players.length})
      </label>

      {!readOnly && <form onSubmit={handleSubmit} className="flex gap-1">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Player name"
          className="flex-1 min-w-0 bg-gray-800 rounded px-2 py-1.5 text-white text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 rounded px-3 py-1.5 text-sm font-bold flex-shrink-0 transition-colors"
        >
          +
        </button>
      </form>}

      <div className="flex flex-col gap-1.5 overflow-y-auto">
        {players.map(player => (
          <div key={player.id} className="flex items-center gap-1.5">
            <div className="flex-1 min-w-0">
              <PlayerCard player={player} />
            </div>
            {!readOnly && (
              <button
                onClick={() => onRemove(player.id)}
                className="text-gray-500 hover:text-red-400 text-xl leading-none flex-shrink-0 transition-colors"
                aria-label={`Remove ${player.name}`}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {players.length === 0 && (
          <p className="text-gray-500 text-xs text-center py-3">
            Add players above, then drag onto the pitch
          </p>
        )}
      </div>
    </div>
  )
}
