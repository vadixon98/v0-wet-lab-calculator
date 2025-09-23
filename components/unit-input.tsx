"use client"

interface UnitInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  unit: string
  onUnitChange: (unit: string) => void
  units: string[]
  placeholder?: string
}

export function UnitInput({ label, value, onChange, unit, onUnitChange, units, placeholder }: UnitInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus-within:ring-4 focus-within:ring-sky-300/60 focus-within:border-sky-500 transition-all">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 bg-transparent border-none outline-none"
        />
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          className="px-3 py-3 bg-slate-50 dark:bg-slate-700 border-l border-slate-200 dark:border-slate-600 rounded-r-xl outline-none text-sm font-medium"
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
