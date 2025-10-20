"use client"

import { useState, useEffect } from "react"
import { Beaker } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UnitInput } from "@/components/unit-input"
import { PrecisionSelector } from "@/components/precision-selector"
import { CopyButton } from "@/components/copy-button"
import { ResetButton } from "@/components/reset-button"
import { PresetManager } from "@/components/preset-manager"
import { usePresets } from "@/hooks/use-presets"
import { calculateMolarity } from "@/lib/calculations"
import { useToast } from "@/hooks/use-toast"

export function MolarityCalculator() {
  const [molecularWeight, setMolecularWeight] = useState("")
  const [concentration, setConcentration] = useState("")
  const [concentrationUnit, setConcentrationUnit] = useState("mM")
  const [volume, setVolume] = useState("")
  const [volumeUnit, setVolumeUnit] = useState("mL")
  const [precision, setPrecision] = useState(2)

  const [results, setResults] = useState<{
    mass: number
    massUnit: string
    equivalents: Array<{ value: number; unit: string }>
  } | null>(null)

  const [errors, setErrors] = useState<string[]>([])

  const { presets, savePreset, deletePreset, loadPreset } = usePresets("molarity")
  const { toast } = useToast()

  useEffect(() => {
    const newErrors: string[] = []

    if (molecularWeight && (isNaN(Number(molecularWeight)) || Number(molecularWeight) <= 0)) {
      newErrors.push("Molecular weight must be a positive number")
    }
    if (concentration && (isNaN(Number(concentration)) || Number(concentration) <= 0)) {
      newErrors.push("Concentration must be a positive number")
    }
    if (volume && (isNaN(Number(volume)) || Number(volume) <= 0)) {
      newErrors.push("Volume must be a positive number")
    }

    setErrors(newErrors)

    if (molecularWeight && concentration && volume && newErrors.length === 0) {
      const result = calculateMolarity(
        Number(molecularWeight),
        Number(concentration),
        concentrationUnit,
        Number(volume),
        volumeUnit,
      )
      setResults(result)
    } else {
      setResults(null)
    }
  }, [molecularWeight, concentration, concentrationUnit, volume, volumeUnit])

  const handleReset = () => {
    setMolecularWeight("")
    setConcentration("")
    setVolume("")
    setResults(null)
    setErrors([])
  }

  const handleSavePreset = (name: string) => {
    savePreset(name, {
      molecularWeight,
      concentration,
      concentrationUnit,
      volume,
      volumeUnit,
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
      setMolecularWeight(preset.values.molecularWeight)
      setConcentration(preset.values.concentration)
      setConcentrationUnit(preset.values.concentrationUnit)
      setVolume(preset.values.volume)
      setVolumeUnit(preset.values.volumeUnit)
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
    <Card className="rounded-2xl shadow-xl border-t-4 border-t-sky-500 bg-white/80 dark:bg-slate-900/60 backdrop-blur border border-white/60 dark:border-white/10 calculator-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 molarity-gradient rounded-xl">
            <Beaker className="w-6 h-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-sky-600 to-sky-800 bg-clip-text text-transparent">
            Molarity Calculator
          </span>
        </CardTitle>
        <p className="text-slate-600 dark:text-slate-400">
          Calculate the mass needed to prepare a solution of known molarity
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-end">
          <PresetManager
            presets={presets}
            onSave={handleSavePreset}
            onLoad={handleLoadPreset}
            onDelete={handleDeletePreset}
            disabled={!molecularWeight || !concentration || !volume || errors.length > 0}
          />
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Molecular Weight (g/mol)
            </label>
            <input
              type="number"
              value={molecularWeight}
              onChange={(e) => setMolecularWeight(e.target.value)}
              placeholder="180.16"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-4 focus:ring-sky-300/60 focus:border-sky-500 transition-all"
            />
          </div>

          <UnitInput
            label="Desired Concentration"
            value={concentration}
            onChange={setConcentration}
            unit={concentrationUnit}
            onUnitChange={setConcentrationUnit}
            units={["M", "mM", "µM", "nM"]}
            placeholder="50"
          />

          <UnitInput
            label="Desired Volume"
            value={volume}
            onChange={setVolume}
            unit={volumeUnit}
            onUnitChange={setVolumeUnit}
            units={["L", "mL", "µL"]}
            placeholder="100"
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
        {results && (
          <div className="bg-gradient-to-br from-sky-50 to-emerald-50 dark:from-sky-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-sky-200/50 dark:border-sky-800/50">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Results</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg result-item">
                <span className="font-medium text-slate-700 dark:text-slate-300">Required Mass:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-sky-600 dark:text-sky-400 count-up">
                    {results.mass.toFixed(precision)} {results.massUnit}
                  </span>
                  <CopyButton value={`${results.mass.toFixed(precision)} ${results.massUnit}`} />
                </div>
              </div>

              {results.equivalents.map((equiv, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/40 dark:bg-slate-800/40 rounded-lg result-item"
                >
                  <span className="text-slate-600 dark:text-slate-400">Equivalent:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {equiv.value.toFixed(precision)} {equiv.unit}
                    </span>
                    <CopyButton value={`${equiv.value.toFixed(precision)} ${equiv.unit}`} />
                  </div>
                </div>
              ))}
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
          <strong>Formula:</strong> mass (g) = M [mol/L] × volume (L) × MW [g/mol]
        </div>
      </CardContent>
    </Card>
  )
}
