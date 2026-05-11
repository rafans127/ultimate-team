import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { getLineup, updateLineup, type Lineup } from '../lib/db'
import type { Player } from '../types'
import type { FormationKey } from '../data/formations'
import { FORMATIONS, FORMATION_KEYS } from '../data/formations'
import Pitch from '../components/Pitch'
import PlayerCard from '../components/PlayerCard'
import PlayerChip from '../components/PlayerChip'
import FormationSelector from '../components/FormationSelector'
import PlayerList from '../components/PlayerList'

type SaveStatus = 'saved' | 'saving' | 'error'

function BenchZone({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'bench' })
  return (
    <div ref={setNodeRef} className={`flex-1 min-h-0 rounded-lg p-1 transition-colors ${isOver ? 'bg-white/5' : ''}`}>
      {children}
    </div>
  )
}

export default function LineupEditorPage() {
  const { lineupId } = useParams<{ lineupId: string }>()
  const navigate = useNavigate()

  const [lineup, setLineup] = useState<Lineup | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [formation, setFormation] = useState<FormationKey>('4-4-2')
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [lineupName, setLineupName] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const saveTimer = useRef<ReturnType<typeof setTimeout>>()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  )

  useEffect(() => {
    if (!lineupId) return
    getLineup(lineupId)
      .then(data => {
        setLineup(data)
        setPlayers(data.players)
        setFormation(data.formation as FormationKey)
        setAssignments(data.assignments)
        setLineupName(data.name)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [lineupId])

  function scheduleSave(updates: Partial<Pick<Lineup, 'name' | 'formation' | 'assignments'>>) {
    if (!lineupId) return
    clearTimeout(saveTimer.current)
    setSaveStatus('saving')
    saveTimer.current = setTimeout(async () => {
      try {
        await updateLineup(lineupId, updates)
        setSaveStatus('saved')
      } catch {
        setSaveStatus('error')
      }
    }, 800)
  }

  function handleFormationChange(key: FormationKey) {
    const next = {} as Record<string, string>
    setFormation(key)
    setAssignments(next)
    scheduleSave({ formation: key, assignments: next })
  }

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
      if (targetId !== 'bench') next[targetId] = playerId
      scheduleSave({ assignments: next })
      return next
    })
  }

  async function handleSaveName() {
    const name = lineupName.trim()
    if (!name || !lineupId) return
    setEditingName(false)
    scheduleSave({ name })
  }

  function handleShare() {
    const url = `${window.location.origin}/share/${lineupId}`
    setShareUrl(url)
    navigator.clipboard?.writeText(url).catch(() => {})
  }

  const positions = FORMATIONS[formation]
  const assignedIds = new Set(Object.values(assignments))
  const benchPlayers = players.filter(p => !assignedIds.has(p.id))
  const activePlayer = activePlayerId ? players.find(p => p.id === activePlayerId) : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading lineup…</p>
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gray-900 text-white">
        {/* Sidebar */}
        <div
          className="w-full lg:w-64 flex-shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-700"
          style={{ maxHeight: '45vh', minHeight: 0 }}
        >
          {/* Back + name — pinned top */}
          <div className="flex-shrink-0 flex items-center gap-2 px-4 pt-4 pb-2">
            <button
              onClick={() => lineup && navigate(`/team/${lineup.team_id}`)}
              className="text-gray-400 hover:text-white transition-colors text-lg flex-shrink-0"
            >
              ←
            </button>
            {editingName ? (
              <input
                autoFocus
                value={lineupName}
                onChange={e => setLineupName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                className="flex-1 bg-gray-800 rounded px-2 py-1 text-white text-sm font-semibold border border-blue-500 focus:outline-none"
              />
            ) : (
              <span
                className="flex-1 font-semibold text-sm cursor-pointer hover:text-gray-300 truncate"
                onClick={() => setEditingName(true)}
                title="Tap to rename"
              >
                {lineupName}
              </span>
            )}
            <span className={`text-xs flex-shrink-0 ${saveStatus === 'saving' ? 'text-yellow-400' : saveStatus === 'error' ? 'text-red-400' : 'text-green-400'}`}>
              {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'error' ? 'Error' : '✓'}
            </span>
          </div>

          {/* Scrollable middle section */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 px-4 py-2 min-h-0">
            <FormationSelector value={formation} options={FORMATION_KEYS} onChange={handleFormationChange} />
            <BenchZone>
              <PlayerList players={benchPlayers} onAdd={() => {}} onRemove={() => {}} readOnly />
            </BenchZone>
          </div>

          {/* Pinned bottom */}
          <div className="flex-shrink-0 px-4 pb-4 pt-2 flex flex-col gap-2 border-t border-gray-700">
            <button
              onClick={handleShare}
              className="w-full bg-green-600 hover:bg-green-500 rounded-lg py-2 px-4 font-semibold text-sm transition-colors"
            >
              Share Lineup
            </button>
            {shareUrl && (
              <div className="text-xs bg-gray-800 rounded p-2 break-all">
                <p className="text-gray-400 mb-1">Copied! Link:</p>
                <a href={shareUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                  {shareUrl}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Pitch */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <div className="w-full max-w-xs lg:max-w-sm">
            <p className="text-center font-bold text-lg mb-0.5">{lineup?.name}</p>
            <p className="text-center text-gray-400 text-sm mb-3">{formation}</p>
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
