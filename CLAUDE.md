# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at localhost:5173
npm run build     # type-check + production build
npm run preview   # preview production build locally
```

## Architecture

**Stack:** React 18 + TypeScript, Vite, Tailwind CSS v3, dnd-kit, Supabase, React Router v6.

### Core data flow

Formation positions are defined statically in `src/data/formations.ts` as `PositionSlot[]` (each with `id`, `label`, and `x`/`y` as 0–100% coordinates on the pitch). The builder holds two pieces of state: `players: Player[]` (all added players) and `assignments: Record<string, string>` (slotId → playerId). Bench players are derived as `players` minus assigned ones.

### Drag and drop

`DndContext` wraps `LineupBuilder`. Player cards use `useDraggable(id = player.id)`. Position slots use `useDroppable(id = slot.id)`. The bench panel uses `useDroppable(id = 'bench')`. On `dragEnd`, the player is removed from their current slot then placed in the new one; dropping on `'bench'` just removes them. `DragOverlay` renders a `PlayerChip` (the pure visual component, no dnd hooks) following the cursor.

### Component hierarchy

```
LineupBuilder (DndContext, all state)
├── BenchZone (useDroppable 'bench')
│   ├── FormationSelector
│   └── PlayerList → PlayerCard (useDraggable) → PlayerChip
└── Pitch
    └── SlotMarker (useDroppable, per slot)
        ├── PlayerCard (useDraggable) when assigned + editable
        └── PlayerChip when assigned + readOnly
```

`PlayerChip` is the pure visual chip used in `DragOverlay` and read-only views. `PlayerCard` wraps it with `useDraggable`. Keeping them separate avoids calling dnd hooks outside a `DndContext`.

### Shareable links

`/lineup/:id` loads a lineup from Supabase and renders a read-only pitch. `SharedLineup` wraps in a bare `<DndContext>` so `SlotMarker`'s `useDroppable` (with `disabled: true`) doesn't throw outside a context.

### Supabase setup

Run this SQL in the Supabase dashboard before sharing works:

```sql
CREATE TABLE lineups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL DEFAULT 'My Team',
  formation TEXT NOT NULL,
  players JSONB NOT NULL DEFAULT '[]',
  assignments JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE lineups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read"   ON lineups FOR SELECT USING (true);
CREATE POLICY "public insert" ON lineups FOR INSERT WITH CHECK (true);
CREATE POLICY "public update" ON lineups FOR UPDATE USING (true);
```

Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### Adding a formation

Add a new entry to `FORMATIONS` in `src/data/formations.ts`. The key becomes the `FormationKey` union type automatically via `FORMATION_KEYS`. Position slot `id`s must be unique within a formation (they're used as drop target ids).
