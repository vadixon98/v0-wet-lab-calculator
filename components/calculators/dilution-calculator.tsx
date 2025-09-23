"use client"

import { useState, useEffect } from "react"
import { Droplets, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UnitInput } from "@/components/unit-input"
import { PrecisionSelector } from "@/components/precision-selector"
import { CopyButton } from "@/components/copy-button"
import { ResetButton } from "@/components/reset-button"
import { calculateDilution } from "@/lib/calculations"

export function DilutionCalculator() {
  const [stockConc, setStockConc] = useState("")
  const [stockUnit, setStockUnit] = useState("mg/mL")
  const [finalConc, setFinalConc] = useState("")
  const [finalUnit, setFinalUnit] = useState("µg/mL")
  const [finalVolume, setFinalVolume] = useState("")
  const [volumeUnit, setVolumeUnit] = useState("mL")
  const [precision, setPrecision] = useState(2)

  const [results, setResults] = useState<{
    stockVolume: number
    diluentVolume: number
    volumeUnit: string
    isValid: boolean
  } | null>(null)

  const [errors, setErrors] = useState<string[]>([])

  const concentrationUnits = ["M", "mM", "µM", "nM", "mg/mL", "µg/mL", "% w/v"]

  useEffect(() => {
    const newErrors: string[] = []

    if (stockConc && (isNaN(Number(stockConc)) || Number(stockConc) <= 0)) {
      newErrors.push("Stock concentration must be a positive number")
    }
    if (finalConc && (isNaN(Number(finalConc)) || Number(finalConc) <= 0)) {
      newErrors.push("Final concentration must be a positive number")
    }
    if (finalVolume && (isNaN(Number(finalVolume)) || Number(finalVolume) <= 0)) {
      newErrors.push("Final volume must be a positive number")
    }

    setErrors(newErrors)

    if (stockConc && finalConc && finalVolume && newErrors.length === 0) {
      const result = calculateDilution(
        Number(stockConc),
        stockUnit,
        Number(finalConc),
        finalUnit,
        Number(finalVolume),
        volumeUnit,
      )
      setResults(result)
    } else {
      setResults(null)
    }
  }, [stockConc, stockUnit, finalConc, finalUnit, finalVolume, volumeUnit])

  const handleReset = () => {
    setStockConc("")
    setFinalConc("")
    setFinalVolume("")
    setResults(null)
    setErrors([])
  }

  return (
    <Card className="rounded-2xl shadow-xl border-t-4 border-t-emerald-500 bg-white/80 dark:bg-slate-900/60 backdrop-blur border border-white/60 dark:border-white/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 dilution-gradient rounded-xl">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            Dilution Calculator
          </span>
        </CardTitle>
        <p className="text-slate-600 dark:text-slate-400">Calculate stock and diluent volumes using C₁V₁ = C₂V₂</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UnitInput
            label="Stock Concentration (C₁)"
            value={stockConc}
            onChange={setStockConc}
            unit={stockUnit}
            onUnitChange={setStockUnit}
            units={concentrationUnits}
            placeholder="10"
          />

          <UnitInput
            label="Final Concentration (C₂)"
            value={finalConc}
            onChange={setFinalConc}
            unit={finalUnit}
            onUnitChange={setFinalUnit}
            units={concentrationUnits}
            placeholder="100"
          />

          <UnitInput
            label="Final Volume (V₂)"
            value={finalVolume}
            onChange={setFinalVolume}
            unit={volumeUnit}
            onUnitChange={setVolumeUnit}
            units={["L", "mL", "µL"]}
            placeholder="50"
          />
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

        {/* Warning for invalid dilution */}
        {results && !results.isValid && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Warning: Final concentration is higher than stock concentration!</span>
            </div>
            <p className="text-amber-600 dark:text-amber-400 text-sm mt-1">
              This would require concentration, not dilution. Please check your values.
            </p>
          </div>
        )}

        {/* Results */}
        {results && results.isValid && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-800/50">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Results</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                <span className="font-medium text-slate-700 dark:text-slate-300">Stock Volume (V₁):</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 count-up">
                    {results.stockVolume.toFixed(precision)} {results.volumeUnit}
                  </span>
                  <CopyButton value={`${results.stockVolume.toFixed(precision)} ${results.volumeUnit}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/40 dark:bg-slate-800/40 rounded-lg">
                <span className="font-medium text-slate-700 dark:text-slate-300">Diluent Volume:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-teal-600 dark:text-teal-400 count-up">
                    {results.diluentVolume.toFixed(precision)} {results.volumeUnit}
                  </span>
                  <CopyButton value={`${results.diluentVolume.toFixed(precision)} ${results.volumeUnit}`} />
                </div>
              </div>

              {/* Protocol steps */}
              <div className="mt-4 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-lg border border-emerald-200/30 dark:border-emerald-800/30">
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">Protocol:</h4>
                <ol className="text-sm text-emerald-700 dark:text-emerald-400 space-y-1">
                  <li>
                    1. Add {results.stockVolume.toFixed(precision)} {results.volumeUnit} of stock solution
                  </li>
                  <li>
                    2. Add {results.diluentVolume.toFixed(precision)} {results.volumeUnit} of diluent
                  </li>
                  <li>
                    3. Mix thoroughly to achieve final volume of {finalVolume} {results.volumeUnit}
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <PrecisionSelector value={precision} onChange={setPrecision} />
          <ResetButton onReset={handleReset} />
        </div>

        {/* Formula */}
        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
          <strong>Formula:</strong> C₁V₁ = C₂V₂, where V₁ = (C₂ × V₂) / C₁
          <br />
          <strong>Note:</strong> Diluent volume = V₂ - V₁
        </div>
      </CardContent>
    </Card>
  )
}
