import type { Player, PositionSlot } from '../types'
import SlotMarker from './SlotMarker'

interface Props {
  positions: PositionSlot[]
  assignments: Record<string, string>
  players: Player[]
  readOnly?: boolean
}

export default function Pitch({ positions, assignments, players, readOnly = false }: Props) {
  const playerById = Object.fromEntries(players.map(p => [p.id, p]))

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-2xl" style={{ aspectRatio: '68 / 105' }}>
      {/* Field markings — viewBox matches 68×105m real pitch dimensions */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 68 105"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base green */}
        <rect width="68" height="105" fill="#2d7a1b" />
        {/* Alternating stripes */}
        {[...Array(6)].map((_, i) => (
          <rect key={i} x="0" y={i * 17.5} width="68" height="8.75" fill="#297519" />
        ))}
        {/* Outer boundary */}
        <rect x="1" y="1" width="66" height="103" fill="none" stroke="white" strokeWidth="0.4" />
        {/* Halfway line */}
        <line x1="1" y1="52.5" x2="67" y2="52.5" stroke="white" strokeWidth="0.4" />
        {/* Centre circle */}
        <circle cx="34" cy="52.5" r="9.15" fill="none" stroke="white" strokeWidth="0.4" />
        <circle cx="34" cy="52.5" r="0.4" fill="white" />
        {/* Top penalty area */}
        <rect x="13.84" y="1" width="40.32" height="16.5" fill="none" stroke="white" strokeWidth="0.4" />
        {/* Top 6-yard box */}
        <rect x="24.84" y="1" width="18.32" height="5.5" fill="none" stroke="white" strokeWidth="0.4" />
        {/* Top penalty spot */}
        <circle cx="34" cy="12" r="0.4" fill="white" />
        {/* Top penalty arc */}
        <path d="M 24.3 17.5 A 9.15 9.15 0 0 1 43.7 17.5" fill="none" stroke="white" strokeWidth="0.4" />
        {/* Top goal */}
        <rect x="29.68" y="0" width="8.64" height="1.5" fill="none" stroke="white" strokeWidth="0.3" />
        {/* Bottom penalty area */}
        <rect x="13.84" y="87.5" width="40.32" height="16.5" fill="none" stroke="white" strokeWidth="0.4" />
        {/* Bottom 6-yard box */}
        <rect x="24.84" y="98.5" width="18.32" height="5.5" fill="none" stroke="white" strokeWidth="0.4" />
        {/* Bottom penalty spot */}
        <circle cx="34" cy="93" r="0.4" fill="white" />
        {/* Bottom penalty arc */}
        <path d="M 24.3 87.5 A 9.15 9.15 0 0 0 43.7 87.5" fill="none" stroke="white" strokeWidth="0.4" />
        {/* Bottom goal */}
        <rect x="29.68" y="103.5" width="8.64" height="1.5" fill="none" stroke="white" strokeWidth="0.3" />
        {/* Corner arcs */}
        <path d="M 1 3 A 2 2 0 0 0 3 1" fill="none" stroke="white" strokeWidth="0.3" />
        <path d="M 65 1 A 2 2 0 0 1 67 3" fill="none" stroke="white" strokeWidth="0.3" />
        <path d="M 1 102 A 2 2 0 0 1 3 104" fill="none" stroke="white" strokeWidth="0.3" />
        <path d="M 65 104 A 2 2 0 0 0 67 102" fill="none" stroke="white" strokeWidth="0.3" />
      </svg>

      {/* Player slots */}
      {positions.map(slot => (
        <SlotMarker
          key={slot.id}
          slot={slot}
          player={assignments[slot.id] ? playerById[assignments[slot.id]] : undefined}
          readOnly={readOnly}
        />
      ))}
    </div>
  )
}
