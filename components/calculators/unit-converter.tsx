"use client"

import { useState, useEffect } from "react"
import { ArrowRightLeft, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyButton } from "@/components/copy-button"

type UnitCategory = "mass" | "volume" | "concentration" | "temperature"

interface ConversionUnit {
  label: string
  toBase: (val: number) => number
  fromBase: (val: number) => number
}

const UNIT_CATEGORIES: Record<
  UnitCategory,
  { label: string; color: string; units: Record<string, ConversionUnit> }
> = {
  mass: {
    label: "Mass",
    color: "sky",
    units: {
      kg: { label: "Kilograms (kg)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      g: { label: "Grams (g)", toBase: (v) => v, fromBase: (v) => v },
      mg: { label: "Milligrams (mg)", toBase: (v) => v * 1e-3, fromBase: (v) => v * 1e3 },
      ug: { label: "Micrograms (ug)", toBase: (v) => v * 1e-6, fromBase: (v) => v * 1e6 },
      ng: { label: "Nanograms (ng)", toBase: (v) => v * 1e-9, fromBase: (v) => v * 1e9 },
      pg: { label: "Picograms (pg)", toBase: (v) => v * 1e-12, fromBase: (v) => v * 1e12 },
    },
  },
  volume: {
    label: "Volume",
    color: "emerald",
    units: {
      L: { label: "Liters (L)", toBase: (v) => v, fromBase: (v) => v },
      mL: { label: "Milliliters (mL)", toBase: (v) => v * 1e-3, fromBase: (v) => v * 1e3 },
      uL: { label: "Microliters (uL)", toBase: (v) => v * 1e-6, fromBase: (v) => v * 1e6 },
      nL: { label: "Nanoliters (nL)", toBase: (v) => v * 1e-9, fromBase: (v) => v * 1e9 },
      pL: { label: "Picoliters (pL)", toBase: (v) => v * 1e-12, fromBase: (v) => v * 1e12 },
    },
  },
  concentration: {
    label: "Concentration (Molar)",
    color: "violet",
    units: {
      M: { label: "Molar (M)", toBase: (v) => v, fromBase: (v) => v },
      mM: { label: "Millimolar (mM)", toBase: (v) => v * 1e-3, fromBase: (v) => v * 1e3 },
      uM: { label: "Micromolar (uM)", toBase: (v) => v * 1e-6, fromBase: (v) => v * 1e6 },
      nM: { label: "Nanomolar (nM)", toBase: (v) => v * 1e-9, fromBase: (v) => v * 1e9 },
      pM: { label: "Picomolar (pM)", toBase: (v) => v * 1e-12, fromBase: (v) => v * 1e12 },
      fM: { label: "Femtomolar (fM)", toBase: (v) => v * 1e-15, fromBase: (v) => v * 1e15 },
    },
  },
  temperature: {
    label: "Temperature",
    color: "amber",
    units: {
      C: {
        label: "Celsius (C)",
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      F: {
        label: "Fahrenheit (F)",
        toBase: (v) => (v - 32) * (5 / 9),
        fromBase: (v) => v * (9 / 5) + 32,
      },
      K: {
        label: "Kelvin (K)",
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    },
  },
}

const CATEGORY_GRADIENTS: Record<UnitCategory, string> = {
  mass: "from-sky-500 to-blue-600",
  volume: "from-emerald-500 to-teal-600",
  concentration: "from-violet-500 to-purple-600",
  temperature: "from-amber-500 to-orange-600",
}

const CATEGORY_BORDERS: Record<UnitCategory, string> = {
  mass: "border-t-sky-500",
  volume: "border-t-emerald-500",
  concentration: "border-t-violet-500",
  temperature: "border-t-amber-500",
}

const CATEGORY_FOCUS: Record<UnitCategory, string> = {
  mass: "focus:ring-sky-300/60 focus:border-sky-500",
  volume: "focus:ring-emerald-300/60 focus:border-emerald-500",
  concentration: "focus:ring-violet-300/60 focus:border-violet-500",
  temperature: "focus:ring-amber-300/60 focus:border-amber-500",
}

const CATEGORY_TEXT: Record<UnitCategory, string> = {
  mass: "from-sky-600 to-sky-800",
  volume: "from-emerald-600 to-emerald-800",
  concentration: "from-violet-600 to-violet-800",
  temperature: "from-amber-600 to-amber-800",
}

const CATEGORY_RESULT_BG: Record<UnitCategory, string> = {
  mass: "from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border-sky-200/50 dark:border-sky-800/50",
  volume:
    "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-800/50",
  concentration:
    "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200/50 dark:border-violet-800/50",
  temperature:
    "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50 dark:border-amber-800/50",
}

const RESULT_TEXT_COLORS: Record<UnitCategory, string> = {
  mass: "text-sky-600 dark:text-sky-400",
  volume: "text-emerald-600 dark:text-emerald-400",
  concentration: "text-violet-600 dark:text-violet-400",
  temperature: "text-amber-600 dark:text-amber-400",
}

export function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("mass")
  const [inputValue, setInputValue] = useState("")
  const [fromUnit, setFromUnit] = useState("g")
  const [toUnit, setToUnit] = useState("mg")
  const [result, setResult] = useState<number | null>(null)
  const [allConversions, setAllConversions] = useState<Array<{ unit: string; label: string; value: number }>>([])

  const currentCategory = UNIT_CATEGORIES[category]
  const unitKeys = Object.keys(currentCategory.units)

  // Reset units when category changes
  useEffect(() => {
    const keys = Object.keys(UNIT_CATEGORIES[category].units)
    setFromUnit(keys[0])
    setToUnit(keys[1] || keys[0])
    setInputValue("")
    setResult(null)
    setAllConversions([])
  }, [category])

  // Calculate on input change
  useEffect(() => {
    if (!inputValue || isNaN(Number(inputValue))) {
      setResult(null)
      setAllConversions([])
      return
    }

    const val = Number(inputValue)
    const fromDef = currentCategory.units[fromUnit]
    const toDef = currentCategory.units[toUnit]

    if (!fromDef || !toDef) return

    const baseValue = fromDef.toBase(val)
    const converted = toDef.fromBase(baseValue)
    setResult(converted)

    // Calculate all conversions
    const conversions = Object.entries(currentCategory.units)
      .filter(([key]) => key !== fromUnit)
      .map(([key, def]) => ({
        unit: key,
        label: def.label,
        value: def.fromBase(baseValue),
      }))
    setAllConversions(conversions)
  }, [inputValue, fromUnit, toUnit, category, currentCategory])

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    if (result !== null) {
      setInputValue(formatNumber(result))
    }
  }

  const handleReset = () => {
    setInputValue("")
    setResult(null)
    setAllConversions([])
  }

  const formatNumber = (num: number): string => {
    if (Math.abs(num) >= 1e9 || (Math.abs(num) < 1e-6 && num !== 0)) {
      return num.toExponential(4)
    }
    if (Number.isInteger(num)) return num.toString()
    return num.toPrecision(6).replace(/\.?0+$/, "")
  }

  return (
    <Card
      className={`rounded-2xl shadow-xl border-t-4 ${CATEGORY_BORDERS[category]} bg-white/80 dark:bg-slate-900/60 backdrop-blur border border-white/60 dark:border-white/10`}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className={`p-2 bg-gradient-to-br ${CATEGORY_GRADIENTS[category]} rounded-xl`}>
            <ArrowRightLeft className="w-6 h-6 text-white" />
          </div>
          <span className={`bg-gradient-to-r ${CATEGORY_TEXT[category]} bg-clip-text text-transparent`}>
            Unit Converter
          </span>
        </CardTitle>
        <p className="text-slate-600 dark:text-slate-400">
          Quickly convert between common lab units for mass, volume, concentration, and temperature
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Selector */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(UNIT_CATEGORIES) as UnitCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                category === cat
                  ? `bg-gradient-to-r ${CATEGORY_GRADIENTS[cat]} text-white shadow-md`
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {UNIT_CATEGORIES[cat].label}
            </button>
          ))}
        </div>

        {/* Conversion Inputs */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          {/* From */}
          <div className="flex-1 w-full space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">From</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-4 ${CATEGORY_FOCUS[category]} transition-all`}
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-4 ${CATEGORY_FOCUS[category]} transition-all`}
            >
              {unitKeys.map((key) => (
                <option key={key} value={key}>
                  {currentCategory.units[key].label}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={swapUnits}
            className={`mt-6 p-3 rounded-full bg-gradient-to-br ${CATEGORY_GRADIENTS[category]} text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0`}
            aria-label="Swap units"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>

          {/* To */}
          <div className="flex-1 w-full space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">To</label>
            <div
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 min-h-[48px] flex items-center ${
                result !== null ? `font-bold text-lg ${RESULT_TEXT_COLORS[category]}` : "text-slate-400"
              }`}
            >
              {result !== null ? formatNumber(result) : "Result"}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-4 ${CATEGORY_FOCUS[category]} transition-all`}
            >
              {unitKeys.map((key) => (
                <option key={key} value={key}>
                  {currentCategory.units[key].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary Result with Copy */}
        {result !== null && (
          <div
            className={`bg-gradient-to-br ${CATEGORY_RESULT_BG[category]} rounded-xl p-4 border flex items-center justify-between`}
          >
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {inputValue} {currentCategory.units[fromUnit]?.label.split(" ")[0]} =
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold ${RESULT_TEXT_COLORS[category]} count-up`}>
                {formatNumber(result)} {currentCategory.units[toUnit]?.label.split(" ")[0]}
              </span>
              <CopyButton
                value={`${formatNumber(result)} ${currentCategory.units[toUnit]?.label.split(" ")[0]}`}
              />
            </div>
          </div>
        )}

        {/* All Conversions Table */}
        {allConversions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">All Conversions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allConversions.map((conv) => (
                <div
                  key={conv.unit}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-150 ${
                    conv.unit === toUnit
                      ? `bg-gradient-to-r ${CATEGORY_RESULT_BG[category]} border`
                      : "bg-white/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50"
                  }`}
                >
                  <span className="text-sm text-slate-600 dark:text-slate-400">{conv.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-sm font-semibold ${
                        conv.unit === toUnit ? RESULT_TEXT_COLORS[category] : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {formatNumber(conv.value)}
                    </span>
                    <CopyButton value={`${formatNumber(conv.value)} ${conv.label.split(" ")[0]}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset */}
        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Reference */}
        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
          <strong>Quick Reference:</strong>
          <br />
          {"Mass: 1 g = 1,000 mg = 1,000,000 ug | Volume: 1 L = 1,000 mL = 1,000,000 uL"}
          <br />
          {"Concentration: 1 M = 1,000 mM = 1,000,000 uM | Temp: C = (F - 32) x 5/9"}
        </div>
      </CardContent>
    </Card>
  )
}
