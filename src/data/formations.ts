import type { PositionSlot } from '../types'

export type FormationKey =
  | '4-4-2'
  | '4-3-3'
  | '4-2-3-1'
  | '3-5-2'
  | '5-3-2'
  | '3-4-3'
  | '4-5-1'
  | '7v7 3-2-1'
  | '7v7 2-3-1'
  | '7v7 3-3'

export const FORMATIONS: Record<FormationKey, PositionSlot[]> = {
  '4-4-2': [
    { id: 'gk',  label: 'GK', x: 50, y: 88 },
    { id: 'rb',  label: 'RB', x: 82, y: 73 },
    { id: 'rcb', label: 'CB', x: 62, y: 73 },
    { id: 'lcb', label: 'CB', x: 38, y: 73 },
    { id: 'lb',  label: 'LB', x: 18, y: 73 },
    { id: 'rm',  label: 'RM', x: 82, y: 50 },
    { id: 'rcm', label: 'CM', x: 60, y: 50 },
    { id: 'lcm', label: 'CM', x: 40, y: 50 },
    { id: 'lm',  label: 'LM', x: 18, y: 50 },
    { id: 'rs',  label: 'ST', x: 62, y: 18 },
    { id: 'ls',  label: 'ST', x: 38, y: 18 },
  ],
  '4-3-3': [
    { id: 'gk',  label: 'GK', x: 50, y: 88 },
    { id: 'rb',  label: 'RB', x: 82, y: 73 },
    { id: 'rcb', label: 'CB', x: 62, y: 73 },
    { id: 'lcb', label: 'CB', x: 38, y: 73 },
    { id: 'lb',  label: 'LB', x: 18, y: 73 },
    { id: 'rcm', label: 'CM', x: 72, y: 50 },
    { id: 'cm',  label: 'CM', x: 50, y: 50 },
    { id: 'lcm', label: 'CM', x: 28, y: 50 },
    { id: 'rw',  label: 'RW', x: 80, y: 18 },
    { id: 'st',  label: 'ST', x: 50, y: 18 },
    { id: 'lw',  label: 'LW', x: 20, y: 18 },
  ],
  '4-2-3-1': [
    { id: 'gk',  label: 'GK', x: 50, y: 88 },
    { id: 'rb',  label: 'RB', x: 82, y: 74 },
    { id: 'rcb', label: 'CB', x: 60, y: 74 },
    { id: 'lcb', label: 'CB', x: 40, y: 74 },
    { id: 'lb',  label: 'LB', x: 18, y: 74 },
    { id: 'rdm', label: 'DM', x: 63, y: 60 },
    { id: 'ldm', label: 'DM', x: 37, y: 60 },
    { id: 'ram', label: 'AM', x: 75, y: 40 },
    { id: 'cam', label: 'AM', x: 50, y: 40 },
    { id: 'lam', label: 'AM', x: 25, y: 40 },
    { id: 'st',  label: 'ST', x: 50, y: 16 },
  ],
  '3-5-2': [
    { id: 'gk',  label: 'GK', x: 50, y: 88 },
    { id: 'rcb', label: 'CB', x: 70, y: 73 },
    { id: 'cb',  label: 'CB', x: 50, y: 73 },
    { id: 'lcb', label: 'CB', x: 30, y: 73 },
    { id: 'rwb', label: 'WB', x: 88, y: 52 },
    { id: 'rcm', label: 'CM', x: 68, y: 52 },
    { id: 'cm',  label: 'CM', x: 50, y: 52 },
    { id: 'lcm', label: 'CM', x: 32, y: 52 },
    { id: 'lwb', label: 'WB', x: 12, y: 52 },
    { id: 'rs',  label: 'ST', x: 63, y: 18 },
    { id: 'ls',  label: 'ST', x: 37, y: 18 },
  ],
  '5-3-2': [
    { id: 'gk',  label: 'GK', x: 50, y: 88 },
    { id: 'rwb', label: 'WB', x: 88, y: 73 },
    { id: 'rcb', label: 'CB', x: 70, y: 73 },
    { id: 'cb',  label: 'CB', x: 50, y: 73 },
    { id: 'lcb', label: 'CB', x: 30, y: 73 },
    { id: 'lwb', label: 'WB', x: 12, y: 73 },
    { id: 'rcm', label: 'CM', x: 70, y: 50 },
    { id: 'cm',  label: 'CM', x: 50, y: 50 },
    { id: 'lcm', label: 'CM', x: 30, y: 50 },
    { id: 'rs',  label: 'ST', x: 63, y: 18 },
    { id: 'ls',  label: 'ST', x: 37, y: 18 },
  ],
  '3-4-3': [
    { id: 'gk',  label: 'GK', x: 50, y: 88 },
    { id: 'rcb', label: 'CB', x: 70, y: 73 },
    { id: 'cb',  label: 'CB', x: 50, y: 73 },
    { id: 'lcb', label: 'CB', x: 30, y: 73 },
    { id: 'rwb', label: 'WB', x: 82, y: 52 },
    { id: 'rcm', label: 'CM', x: 60, y: 52 },
    { id: 'lcm', label: 'CM', x: 40, y: 52 },
    { id: 'lwb', label: 'WB', x: 18, y: 52 },
    { id: 'rw',  label: 'RW', x: 78, y: 18 },
    { id: 'st',  label: 'ST', x: 50, y: 18 },
    { id: 'lw',  label: 'LW', x: 22, y: 18 },
  ],
  '4-5-1': [
    { id: 'gk',  label: 'GK', x: 50, y: 88 },
    { id: 'rb',  label: 'RB', x: 82, y: 73 },
    { id: 'rcb', label: 'CB', x: 62, y: 73 },
    { id: 'lcb', label: 'CB', x: 38, y: 73 },
    { id: 'lb',  label: 'LB', x: 18, y: 73 },
    { id: 'rm',  label: 'RM', x: 85, y: 50 },
    { id: 'rcm', label: 'CM', x: 65, y: 50 },
    { id: 'cm',  label: 'CM', x: 50, y: 50 },
    { id: 'lcm', label: 'CM', x: 35, y: 50 },
    { id: 'lm',  label: 'LM', x: 15, y: 50 },
    { id: 'st',  label: 'ST', x: 50, y: 16 },
  ],

  // 7-a-side formations (GK + 6 outfield)
  '7v7 3-2-1': [
    { id: 'gk', label: 'GK', x: 50, y: 88 },
    { id: 'rd', label: 'RD', x: 72, y: 70 },
    { id: 'cd', label: 'CD', x: 50, y: 70 },
    { id: 'ld', label: 'LD', x: 28, y: 70 },
    { id: 'rm', label: 'RM', x: 65, y: 46 },
    { id: 'lm', label: 'LM', x: 35, y: 46 },
    { id: 'st', label: 'ST', x: 50, y: 18 },
  ],
  '7v7 2-3-1': [
    { id: 'gk', label: 'GK', x: 50, y: 88 },
    { id: 'rd', label: 'RD', x: 65, y: 70 },
    { id: 'ld', label: 'LD', x: 35, y: 70 },
    { id: 'rm', label: 'RM', x: 75, y: 46 },
    { id: 'cm', label: 'CM', x: 50, y: 46 },
    { id: 'lm', label: 'LM', x: 25, y: 46 },
    { id: 'st', label: 'ST', x: 50, y: 18 },
  ],
  '7v7 3-3': [
    { id: 'gk', label: 'GK', x: 50, y: 88 },
    { id: 'rd', label: 'RD', x: 72, y: 70 },
    { id: 'cd', label: 'CD', x: 50, y: 70 },
    { id: 'ld', label: 'LD', x: 28, y: 70 },
    { id: 'rf', label: 'RF', x: 72, y: 28 },
    { id: 'cf', label: 'CF', x: 50, y: 28 },
    { id: 'lf', label: 'LF', x: 28, y: 28 },
  ],
}

export const FORMATION_KEYS = Object.keys(FORMATIONS) as FormationKey[]
