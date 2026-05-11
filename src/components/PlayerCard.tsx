import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Player } from '../types'
import PlayerChip from './PlayerChip'

interface Props {
  player: Player
  compact?: boolean
}

export default function PlayerCard({ player, compact = false }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: player.id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.3 : 1,
        cursor: 'grab',
        touchAction: 'none',
      }}
      {...listeners}
      {...attributes}
      className="w-full"
    >
      <PlayerChip player={player} compact={compact} />
    </div>
  )
}
