import type { Player } from '../types'

interface Props {
  player: Player
  compact?: boolean
}

export default function PlayerChip({ player, compact = false }: Props) {
  const firstName = player.name.split(' ')[0]

  if (compact) {
    return (
      <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center select-none">
        <span className="text-white font-bold leading-tight text-center px-0.5 block truncate w-full text-center" style={{ fontSize: '0.55rem' }}>
          {firstName}
        </span>
      </div>
    )
  }

  return (
    <div className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium select-none w-full truncate">
      {player.name}
    </div>
  )
}
