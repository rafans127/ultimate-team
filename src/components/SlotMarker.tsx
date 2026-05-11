import { useDroppable } from '@dnd-kit/core'
import type { Player, PositionSlot } from '../types'
import PlayerCard from './PlayerCard'
import PlayerChip from './PlayerChip'

interface Props {
  slot: PositionSlot
  player?: Player
  readOnly?: boolean
}

export default function SlotMarker({ slot, player, readOnly = false }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: slot.id,
    disabled: readOnly,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        width: 52,
      }}
    >
      {player ? (
        <div className="flex flex-col items-center gap-0.5">
          {readOnly ? (
            <PlayerChip player={player} compact />
          ) : (
            <PlayerCard player={player} compact />
          )}
          <span
            className="text-white font-bold block text-center"
            style={{ fontSize: '0.55rem', textShadow: '0 1px 3px rgba(0,0,0,1)' }}
          >
            {slot.label}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-0.5">
          <div
            className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-colors ${
              isOver ? 'border-white bg-white/30' : 'border-white/50 bg-black/20'
            }`}
          >
            <span className="text-white/90 font-bold" style={{ fontSize: '0.55rem' }}>
              {slot.label}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
