import { useState, useMemo, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import type { Player } from '../types'
import type { FormationKey } from '../data/formations'
import { FORMATIONS, FORMATION_KEYS } from '../data/formations'
import { getSupabase } from '../lib/supabase'
import Pitch from './Pitch'
import PlayerCard from './PlayerCard'
import PlayerChip from './PlayerChip'
import FormationSelector from './FormationSelector'
import PlayerList from './PlayerList'

function BenchZone({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'bench' })
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-0 rounded-lg p-1 transition-colors ${isOver ? 'bg-white/5' : ''}`}
    >
      {children}
    </div>
  )
}

export default function LineupBuilder() {
  const [formationKey, setFormationKey] = useState<FormationKey>('4-4-2')
  const [players, setPlayers] = useState<Player[]>([])
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null)
  const [teamName, setTeamName] = useState('My Team')
  const [isSaving, setIsSaving] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [lineupId, setLineupId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  )

  const positions = FORMATIONS[formationKey]

  const assignedPlayerIds = useMemo(() => new Set(Object.values(assignments)), [assignments])
  const benchPlayers = useMemo(
    () => players.filter(p => !assignedPlayerIds.has(p.id)),
    [players, assignedPlayerIds],
  )
  const activePlayer = useMemo(
    () => (activePlayerId ? players.find(p => p.id === activePlayerId) : null),
    [activePlayerId, players],
  )

  function handleDragStart({ active }: DragStartEvent) {
    setActivePlayerId(active.id as string)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActivePlayerId(null)
    if (!over) return

    const playerId = active.id as string
    const targetId = over.id as string

    setAssignments(prev => {
      const next = { ...prev }
      for (const k of Object.keys(next)) {
        if (next[k] === playerId) { delete next[k]; break }
      }
      if (targetId !== 'bench') {
        next[targetId] = playerId
      }
      return next
    })
  }

  function handleFormationChange(key: FormationKey) {
    setFormationKey(key)
    setAssignments({})
  }

  const addPlayer = useCallback((name: string) => {
    setPlayers(prev => [...prev, { id: crypto.randomUUID(), name }])
  }, [])

  const removePlayer = useCallback((playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId))
    setAssignments(prev => {
      const next = { ...prev }
      for (const k of Object.keys(next)) {
        if (next[k] === playerId) { delete next[k]; break }
      }
      return next
    })
  }, [])

  async function handleShare() {
    setIsSaving(true)
    try {
      const supabase = getSupabase()
      const payload = { team_name: teamName, formation: formationKey, players, assignments }
      if (lineupId) {
        await supabase.from('lineups').update(payload).eq('id', lineupId)
        setShareUrl(`${window.location.origin}/lineup/${lineupId}`)
      } else {
        const { data, error } = await supabase
          .from('lineups')
          .insert(payload)
          .select('id')
          .single()
        if (error) throw error
        setLineupId(data.id)
        setShareUrl(`${window.location.origin}/lineup/${data.id}`)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to save. Check that Supabase is configured in .env')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gray-900 text-white">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4 p-4 border-b lg:border-b-0 lg:border-r border-gray-700 overflow-y-auto lg:max-h-screen" style={{ maxHeight: '45vh' }}>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider">Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              className="mt-1 w-full bg-gray-800 rounded px-3 py-2 text-white text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <FormationSelector
            value={formationKey}
            options={FORMATION_KEYS}
            onChange={handleFormationChange}
          />

          <BenchZone>
            <PlayerList players={benchPlayers} onAdd={addPlayer} onRemove={removePlayer} />
          </BenchZone>

          <button
            onClick={handleShare}
            disabled={isSaving}
            className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg py-2 px-4 font-semibold text-sm transition-colors flex-shrink-0"
          >
            {isSaving ? 'Saving…' : 'Save & Share'}
          </button>

          {shareUrl && (
            <div className="text-xs bg-gray-800 rounded p-2 break-all flex-shrink-0">
              <p className="text-gray-400 mb-1">Shareable link:</p>
              <a href={shareUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                {shareUrl}
              </a>
            </div>
          )}
        </div>

        {/* Pitch */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <div className="w-full max-w-xs lg:max-w-sm">
            <p className="text-center font-bold text-lg mb-0.5">{teamName}</p>
            <p className="text-center text-gray-400 text-sm mb-3">{formationKey}</p>
            <Pitch positions={positions} assignments={assignments} players={players} />
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activePlayer && (
          <div style={{ cursor: 'grabbing' }}>
            <PlayerChip player={activePlayer} compact />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
