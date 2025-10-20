"use client"

import { useState, useEffect } from "react"
import { Pill, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UnitInput } from "@/components/unit-input"
import { PrecisionSelector } from "@/components/precision-selector"
import { CopyButton } from "@/components/copy-button"
import { ResetButton } from "@/components/reset-button"
import { PresetManager } from "@/components/preset-manager"
import { usePresets } from "@/hooks/use-presets"
import { calculateDilution } from "@/lib/calculations"
import { useToast } from "@/hooks/use-toast"

const ANTIBIOTIC_PRESETS = [
  { name: "Ampicillin", stockConc: 100, workingConc: 100, unit: "mg/mL" },
  { name: "Kanamycin", stockConc: 50, workingConc: 50, unit: "mg/mL" },
  { name: "Chloramphenicol", stockConc: 34, workingConc: 25, unit: "mg/mL" },
  { name: "Carbenicillin", stockConc: 100, workingConc: 100, unit: "mg/mL" },
  { name: "Tetracycline", stockConc: 10, workingConc: 10, unit: "mg/mL" },
  { name: "Custom", stockConc: 0, workingConc: 0, unit: "mg/mL" },
]

export function AntibioticsCalculator() {
  const [selectedAntibiotic, setSelectedAntibiotic] = useState("Ampicillin")
  const [stockConc, setStockConc] = useState("100")
  const [stockUnit, setStockUnit] = useState("mg/mL")
  const [workingConc, setWorkingConc] = useState("100")
  const [workingUnit, setWorkingUnit] = useState("µg/mL")
  const [finalVolume, setFinalVolume] = useState("")
  const [volumeUnit, setVolumeUnit] = useState("L")
  const [plateVolume, setPlateVolume] = useState("")
  const [plateUnit, setPlateUnit] = useState("mL")
  const [precision, setPrecision] = useState(2)

  const [results, setResults] = useState<{
    stockVolume: number
    diluentVolume: number
    volumeUnit: string
    isValid: boolean
    perWellVolume?: number
  } | null>(null)

  const [errors, setErrors] = useState<string[]>([])

  const concentrationUnits = ["mg/mL", "µg/mL"]

  const { presets, savePreset, deletePreset, loadPreset } = usePresets("antibiotics")
  const { toast } = useToast()

  // Update values when antibiotic preset changes
  useEffect(() => {
    const preset = ANTIBIOTIC_PRESETS.find((ab) => ab.name === selectedAntibiotic)
    if (preset && preset.name !== "Custom") {
      setStockConc(preset.stockConc.toString())
      setWorkingConc(preset.workingConc.toString())
      setStockUnit(preset.unit)
      setWorkingUnit("µg/mL")
    }
  }, [selectedAntibiotic])

  useEffect(() => {
    const newErrors: string[] = []

    if (stockConc && (isNaN(Number(stockConc)) || Number(stockConc) <= 0)) {
      newErrors.push("Stock concentration must be a positive number")
    }
    if (workingConc && (isNaN(Number(workingConc)) || Number(workingConc) <= 0)) {
      newErrors.push("Working concentration must be a positive number")
    }
    if (finalVolume && (isNaN(Number(finalVolume)) || Number(finalVolume) <= 0)) {
      newErrors.push("Final volume must be a positive number")
    }
    if (plateVolume && (isNaN(Number(plateVolume)) || Number(plateVolume) <= 0)) {
      newErrors.push("Plate volume must be a positive number")
    }

    setErrors(newErrors)

    if (stockConc && workingConc && finalVolume && newErrors.length === 0) {
      const result = calculateDilution(
        Number(stockConc),
        stockUnit,
        Number(workingConc),
        workingUnit,
        Number(finalVolume),
        volumeUnit,
      )

      // Calculate per-well volume if plate volume provided
      let perWellVolume: number | undefined
      if (plateVolume) {
        const plateVolumeInMl = Number(plateVolume) * (plateUnit === "mL" ? 1 : plateUnit === "µL" ? 0.001 : 1000)
        const finalVolumeInMl = Number(finalVolume) * (volumeUnit === "mL" ? 1 : volumeUnit === "µL" ? 0.001 : 1000)
        perWellVolume =
          ((result.stockVolume * (volumeUnit === "mL" ? 1 : volumeUnit === "µL" ? 0.001 : 1000)) / plateVolumeInMl) *
          plateVolumeInMl
      }

      setResults({
        ...result,
        perWellVolume,
      })
    } else {
      setResults(null)
    }
  }, [stockConc, stockUnit, workingConc, workingUnit, finalVolume, volumeUnit, plateVolume, plateUnit])

  const handleReset = () => {
    setSelectedAntibiotic("Ampicillin")
    setStockConc("100")
    setWorkingConc("100")
    setFinalVolume("")
    setPlateVolume("")
    setResults(null)
    setErrors([])
  }

  const handleSavePreset = (name: string) => {
    savePreset(name, {
      selectedAntibiotic,
      stockConc,
      stockUnit,
      workingConc,
      workingUnit,
      finalVolume,
      volumeUnit,
      plateVolume,
      plateUnit,
      precision,
    })
    toast({
      title: "Preset saved!",
      description: `"${name}" has been saved to your favorites.`,
    })
  }

  const handleLoadPreset = (id: string) => {
    const preset = loadPreset(id)
    if (preset) {
      setSelectedAntibiotic(preset.values.selectedAntibiotic)
      setStockConc(preset.values.stockConc)
      setStockUnit(preset.values.stockUnit)
      setWorkingConc(preset.values.workingConc)
      setWorkingUnit(preset.values.workingUnit)
      setFinalVolume(preset.values.finalVolume)
      setVolumeUnit(preset.values.volumeUnit)
      setPlateVolume(preset.values.plateVolume)
      setPlateUnit(preset.values.plateUnit)
      setPrecision(preset.values.precision)
      toast({
        title: "Preset loaded!",
        description: `"${preset.name}" has been loaded.`,
      })
    }
  }

  const handleDeletePreset = (id: string) => {
    const preset = presets.find((p) => p.id === id)
    deletePreset(id)
    toast({
      title: "Preset deleted",
      description: `"${preset?.name}" has been removed.`,
      variant: "destructive",
    })
  }

  return (
    <Card className="rounded-2xl shadow-xl border-t-4 border-t-rose-500 bg-white/80 dark:bg-slate-900/60 backdrop-blur border border-white/60 dark:border-white/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 antibiotics-gradient rounded-xl">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent">
            Antibiotics Calculator
          </span>
        </CardTitle>
        <p className="text-slate-600 dark:text-slate-400">
          Calculate antibiotic dilutions with common presets and per-well volumes
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-end">
          <PresetManager
            presets={presets}
            onSave={handleSavePreset}
            onLoad={handleLoadPreset}
            onDelete={handleDeletePreset}
            disabled={!stockConc || !workingConc || !finalVolume || errors.length > 0}
          />
        </div>

        {/* Antibiotic Preset Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Antibiotic Preset</label>
          <div className="relative">
            <select
              value={selectedAntibiotic}
              onChange={(e) => setSelectedAntibiotic(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-4 focus:ring-rose-300/60 focus:border-rose-500 transition-all appearance-none"
            >
              {ANTIBIOTIC_PRESETS.map((preset) => (
                <option key={preset.name} value={preset.name}>
                  {preset.name}
                  {preset.name !== "Custom" &&
                    ` (${preset.stockConc} → ${preset.workingConc} ${preset.unit.replace("mg/mL", "µg/mL")})`}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UnitInput
            label="Stock Concentration (C₁)"
            value={stockConc}
            onChange={setStockConc}
            unit={stockUnit}
            onUnitChange={setStockUnit}
            units={concentrationUnits}
            placeholder="100"
          />

          <UnitInput
            label="Working Concentration (C₂)"
            value={workingConc}
            onChange={setWorkingConc}
            unit={workingUnit}
            onUnitChange={setWorkingUnit}
            units={concentrationUnits}
            placeholder="100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UnitInput
            label="Final Volume (V₂)"
            value={finalVolume}
            onChange={setFinalVolume}
            unit={volumeUnit}
            onUnitChange={setVolumeUnit}
            units={["L", "mL", "µL"]}
            placeholder="1"
          />

          <UnitInput
            label="Plate Volume (Optional)"
            value={plateVolume}
            onChange={setPlateVolume}
            unit={plateUnit}
            onUnitChange={setPlateUnit}
            units={["L", "mL", "µL"]}
            placeholder="200"
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

        {/* Results */}
        {results && results.isValid && (
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-rose-200/50 dark:border-rose-800/50">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Results</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                <span className="font-medium text-slate-700 dark:text-slate-300">Stock Volume (V₁):</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-rose-600 dark:text-rose-400 count-up">
                    {results.stockVolume.toFixed(precision)} {results.volumeUnit}
                  </span>
                  <CopyButton value={`${results.stockVolume.toFixed(precision)} ${results.volumeUnit}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/40 dark:bg-slate-800/40 rounded-lg">
                <span className="font-medium text-slate-700 dark:text-slate-300">Diluent Volume:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-pink-600 dark:text-pink-400 count-up">
                    {results.diluentVolume.toFixed(precision)} {results.volumeUnit}
                  </span>
                  <CopyButton value={`${results.diluentVolume.toFixed(precision)} ${results.volumeUnit}`} />
                </div>
              </div>

              {/* Per-well volume if calculated */}
              {results.perWellVolume && (
                <div className="flex items-center justify-between p-3 bg-rose-100/60 dark:bg-rose-900/20 rounded-lg border border-rose-200/50 dark:border-rose-800/50">
                  <span className="font-medium text-rose-800 dark:text-rose-300">Per-well Stock:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-rose-700 dark:text-rose-400 count-up">
                      {results.perWellVolume.toFixed(precision)} {plateUnit}
                    </span>
                    <CopyButton value={`${results.perWellVolume.toFixed(precision)} ${plateUnit}`} />
                  </div>
                </div>
              )}

              {/* Protocol steps */}
              <div className="mt-4 p-4 bg-rose-50/50 dark:bg-rose-900/10 rounded-lg border border-rose-200/30 dark:border-rose-800/30">
                <h4 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">Protocol:</h4>
                <ol className="text-sm text-rose-700 dark:text-rose-400 space-y-1">
                  <li>
                    1. Add {results.stockVolume.toFixed(precision)} {results.volumeUnit} of {selectedAntibiotic} stock
                  </li>
                  <li>
                    2. Add {results.diluentVolume.toFixed(precision)} {results.volumeUnit} of sterile medium/buffer
                  </li>
                  <li>
                    3. Mix thoroughly to achieve {workingConc} {workingUnit} working concentration
                  </li>
                  {plateVolume && (
                    <li>
                      4. Use {plateVolume} {plateUnit} per plate/well as needed
                    </li>
                  )}
                </ol>
              </div>

              {/* Common usage note */}
              <div className="mt-4 p-3 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-200/30 dark:border-amber-800/30">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  <strong>Note:</strong> Store antibiotic stocks at -20°C. Prepare working solutions fresh and use
                  within 24 hours. Always filter sterilize if not using sterile stock solutions.
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

        {/* Formula */}
        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
          <strong>Formula:</strong> C₁V₁ = C₂V₂, where V₁ = (C₂ × V₂) / C₁
          <br />
          <strong>Common stocks:</strong> Ampicillin (100 mg/mL), Kanamycin (50 mg/mL), Chloramphenicol (34 mg/mL)
        </div>
      </CardContent>
    </Card>
  )
}
