"use client"

import { useState, useEffect } from "react"
import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UnitInput } from "@/components/unit-input"
import { PrecisionSelector } from "@/components/precision-selector"
import { CopyButton } from "@/components/copy-button"
import { ResetButton } from "@/components/reset-button"
import { calculateConcentration } from "@/lib/calculations"

export function ConcentrationCalculator() {
  const [mass, setMass] = useState("")
  const [massUnit, setMassUnit] = useState("mg")
  const [volume, setVolume] = useState("")
  const [volumeUnit, setVolumeUnit] = useState("mL")
  const [molecularWeight, setMolecularWeight] = useState("")
  const [precision, setPrecision] = useState(2)

  const [results, setResults] = useState<{
    mgMl: number
    ugMl: number
    percentWV: number
    molarity?: number
    equivalents: Array<{ value: number; unit: string }>
  } | null>(null)

  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const newErrors: string[] = []

    if (mass && (isNaN(Number(mass)) || Number(mass) <= 0)) {
      newErrors.push("Mass must be a positive number")
    }
    if (volume && (isNaN(Number(volume)) || Number(volume) <= 0)) {
      newErrors.push("Volume must be a positive number")
    }
    if (molecularWeight && (isNaN(Number(molecularWeight)) || Number(molecularWeight) <= 0)) {
      newErrors.push("Molecular weight must be a positive number")
    }

    setErrors(newErrors)

    if (mass && volume && newErrors.length === 0) {
      const mw = molecularWeight ? Number(molecularWeight) : undefined
      const result = calculateConcentration(Number(mass), massUnit, Number(volume), volumeUnit, mw)
      setResults(result)
    } else {
      setResults(null)
    }
  }, [mass, massUnit, volume, volumeUnit, molecularWeight])

  const handleReset = () => {
    setMass("")
    setVolume("")
    setMolecularWeight("")
    setResults(null)
    setErrors([])
  }

  return (
    <Card className="rounded-2xl shadow-xl border-t-4 border-t-amber-500 bg-white/80 dark:bg-slate-900/60 backdrop-blur border border-white/60 dark:border-white/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 concentration-gradient rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            Concentration Calculator
          </span>
        </CardTitle>
        <p className="text-slate-600 dark:text-slate-400">
          Calculate concentration from mass and volume in multiple units
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UnitInput
            label="Mass"
            value={mass}
            onChange={setMass}
            unit={massUnit}
            onUnitChange={setMassUnit}
            units={["g", "mg", "µg", "ng"]}
            placeholder="25"
          />

          <UnitInput
            label="Volume"
            value={volume}
            onChange={setVolume}
            unit={volumeUnit}
            onUnitChange={setVolumeUnit}
            units={["L", "mL", "µL"]}
            placeholder="10"
          />
        </div>

        {/* Optional Molecular Weight */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Molecular Weight (g/mol) - Optional
          </label>
          <input
            type="number"
            value={molecularWeight}
            onChange={(e) => setMolecularWeight(e.target.value)}
            placeholder="500"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-4 focus:ring-amber-300/60 focus:border-amber-500 transition-all"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Include to calculate molarity</p>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <ul className="text-red-600 dark:text-red-400 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200/50 dark:border-amber-800/50">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Results</h3>

            <div className="space-y-3">
              {/* Primary concentrations */}
              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                <span className="font-medium text-slate-700 dark:text-slate-300">Concentration (mg/mL):</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400 count-up">
                    {results.mgMl.toFixed(precision)}
                  </span>
                  <CopyButton value={`${results.mgMl.toFixed(precision)} mg/mL`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/40 dark:bg-slate-800/40 rounded-lg">
                <span className="font-medium text-slate-700 dark:text-slate-300">Concentration (µg/mL):</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-orange-600 dark:text-orange-400 count-up">
                    {results.ugMl.toFixed(precision)}
                  </span>
                  <CopyButton value={`${results.ugMl.toFixed(precision)} µg/mL`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/40 dark:bg-slate-800/40 rounded-lg">
                <span className="font-medium text-slate-700 dark:text-slate-300">Concentration (% w/v):</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400 count-up">
                    {results.percentWV.toFixed(precision)}%
                  </span>
                  <CopyButton value={`${results.percentWV.toFixed(precision)}% w/v`} />
                </div>
              </div>

              {/* Molarity if MW provided */}
              {results.molarity !== undefined && (
                <div className="flex items-center justify-between p-3 bg-amber-100/60 dark:bg-amber-900/20 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                  <span className="font-medium text-amber-800 dark:text-amber-300">Molarity:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-amber-700 dark:text-amber-400 count-up">
                      {results.molarity.toFixed(precision)} M
                    </span>
                    <CopyButton value={`${results.molarity.toFixed(precision)} M`} />
                  </div>
                </div>
              )}

              {/* Additional equivalents */}
              {results.equivalents.map((equiv, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/30 dark:bg-slate-800/30 rounded-lg"
                >
                  <span className="text-slate-600 dark:text-slate-400">Also equals:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {equiv.value.toFixed(precision)} {equiv.unit}
                    </span>
                    <CopyButton value={`${equiv.value.toFixed(precision)} ${equiv.unit}`} />
                  </div>
                </div>
              ))}

              {/* Summary card */}
              <div className="mt-4 p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-200/30 dark:border-amber-800/30">
                <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Summary:</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  {mass} {massUnit} in {volume} {volumeUnit} = {results.mgMl.toFixed(precision)} mg/mL
                  {results.molarity !== undefined && ` (${results.molarity.toFixed(precision)} M)`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <PrecisionSelector value={precision} onChange={setPrecision} />
          <ResetButton onReset={handleReset} />
        </div>

        {/* Formulas */}
        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
          <strong>Formulas:</strong>
          <br />• mg/mL = (mass in mg) / (volume in mL)
          <br />• % w/v = (mass in g) / (volume in mL) × 100
          <br />• Molarity = (mass in g) / (MW × volume in L)
        </div>
      </CardContent>
    </Card>
  )
}
