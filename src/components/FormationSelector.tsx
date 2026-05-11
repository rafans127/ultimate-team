import type { FormationKey } from '../data/formations'

interface Props {
  value: FormationKey
  options: FormationKey[]
  onChange: (key: FormationKey) => void
}

export default function FormationSelector({ value, options, onChange }: Props) {
  return (
    <div>
      <label className="text-xs text-gray-400 uppercase tracking-wider">Formation</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value as FormationKey)}
        className="mt-1 w-full bg-gray-800 rounded px-3 py-2 text-white text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
      >
        {options.map(key => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>
    </div>
  )
}
