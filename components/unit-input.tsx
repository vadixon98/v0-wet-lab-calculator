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
      <div className="flex gap-2 items-stretch">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-4 focus:ring-sky-300/60 focus:border-sky-500 transition-all outline-none"
        />
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          className="px-4 py-3 min-w-[100px] bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-600 focus:ring-4 focus:ring-sky-300/60 focus:border-sky-500 transition-all cursor-pointer"
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
