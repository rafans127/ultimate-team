export interface Player {
  id: string
  name: string
}

export interface PositionSlot {
  id: string
  label: string
  x: number // 0–100, % from left
  y: number // 0–100, % from top (0 = attacking end, 100 = defensive/GK end)
}

export interface LineupData {
  id?: string
  team_name: string
  formation: string
  players: Player[]
  assignments: Record<string, string> // slotId → playerId
}
