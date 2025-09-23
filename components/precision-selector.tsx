"use client"

interface PrecisionSelectorProps {
  value: number
  onChange: (value: number) => void
}

export function PrecisionSelector({ value, onChange }: PrecisionSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Precision:</label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
      >
        {[0, 1, 2, 3, 4, 5, 6].map((p) => (
          <option key={p} value={p}>
            {p} decimal{p !== 1 ? "s" : ""}
          </option>
        ))}
      </select>
    </div>
  )
}
