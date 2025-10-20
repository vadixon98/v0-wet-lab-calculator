"use client"

import { useState, useEffect } from "react"
import { TestTube } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UnitInput } from "@/components/unit-input"
import { PrecisionSelector } from "@/components/precision-selector"
import { CopyButton } from "@/components/copy-button"
import { ResetButton } from "@/components/reset-button"
import { PresetManager } from "@/components/preset-manager"
import { usePresets } from "@/hooks/use-presets"
import { calculateReconstitution } from "@/lib/calculations"
import { useToast } from "@/hooks/use-toast"

export function ReconstitutionCalculator() {
  const [powderMass, setPowderMass] = useState("")
  const [massUnit, setMassUnit] = useState("mg")
  const [targetConc, setTargetConc] = useState("")
  const [concUnit, setConcUnit] = useState("mM")
  const [molecularWeight, setMolecularWeight] = useState("")
  const [precision, setPrecision] = useState(2)

  const [results, setResults] = useState<{
    solventVolume: number
    volumeUnit: string
    equivalents: Array<{ value: number; unit: string }>
    isMolar: boolean
  } | null>(null)

  const [errors, setErrors] = useState<string[]>([])

  const concentrationUnits = ["M", "mM", "µM", "nM", "mg/mL", "µg/mL"]
  const isMolarUnit = ["M", "mM", "µM", "nM"].includes(concUnit)

  const { presets, savePreset, deletePreset, loadPreset } = usePresets("reconstitution")
  const { toast } = useToast()

  useEffect(() => {
    const newErrors: string[] = []

    if (powderMass && (isNaN(Number(powderMass)) || Number(powderMass) <= 0)) {
      newErrors.push("Powder mass must be a positive number")
    }
    if (targetConc && (isNaN(Number(targetConc)) || Number(targetConc) <= 0)) {
      newErrors.push("Target concentration must be a positive number")
    }
    if (isMolarUnit && molecularWeight && (isNaN(Number(molecularWeight)) || Number(molecularWeight) <= 0)) {
      newErrors.push("Molecular weight must be a positive number")
    }
    if (isMolarUnit && !molecularWeight) {
      newErrors.push("Molecular weight is required for molar concentrations")
    }

    setErrors(newErrors)

    if (powderMass && targetConc && newErrors.length === 0) {
      const mw = isMolarUnit ? Number(molecularWeight) : undefined
      const result = calculateReconstitution(Number(powderMass), massUnit, Number(targetConc), concUnit, mw)
      setResults(result)
    } else {
      setResults(null)
    }
  }, [powderMass, massUnit, targetConc, concUnit, molecularWeight, isMolarUnit])

  const handleReset = () => {
    setPowderMass("")
    setTargetConc("")
    setMolecularWeight("")
    setResults(null)
    setErrors([])
  }

  const handleSavePreset = (name: string) => {
    savePreset(name, {
      powderMass,
      massUnit,
      targetConc,
      concUnit,
      molecularWeight,
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
      setPowderMass(preset.values.powderMass)
      setMassUnit(preset.values.massUnit)
      setTargetConc(preset.values.targetConc)
      setConcUnit(preset.values.concUnit)
      setMolecularWeight(preset.values.molecularWeight)
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
    <Card className="rounded-2xl shadow-xl border-t-4 border-t-violet-500 bg-white/80 dark:bg-slate-900/60 backdrop-blur border border-white/60 dark:border-white/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 reconstitution-gradient rounded-xl">
            <TestTube className="w-6 h-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-violet-600 to-violet-800 bg-clip-text text-transparent">
            Reconstitution Calculator
          </span>
        </CardTitle>
        <p className="text-slate-600 dark:text-slate-400">
          Calculate solvent volume needed to reconstitute powder to target concentration
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* PresetManager component */}
        <div className="flex justify-end">
          <PresetManager
            presets={presets}
            onSave={handleSavePreset}
            onLoad={handleLoadPreset}
            onDelete={handleDeletePreset}
            disabled={!powderMass || !targetConc || errors.length > 0}
          />
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UnitInput
            label="Powder Mass"
            value={powderMass}
            onChange={setPowderMass}
            unit={massUnit}
            onUnitChange={setMassUnit}
            units={["g", "mg", "µg"]}
            placeholder="5"
          />

          <UnitInput
            label="Target Concentration"
            value={targetConc}
            onChange={setTargetConc}
            unit={concUnit}
            onUnitChange={setConcUnit}
            units={concentrationUnits}
            placeholder="1"
          />
        </div>

        {/* Molecular Weight (only for molar units) */}
        {isMolarUnit && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Molecular Weight (g/mol) *
            </label>
            <input
              type="number"
              value={molecularWeight}
              onChange={(e) => setMolecularWeight(e.target.value)}
              placeholder="1500"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-4 focus:ring-violet-300/60 focus:border-violet-500 transition-all"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Required for molar concentration calculations
            </p>
          </div>
        )}

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
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-violet-200/50 dark:border-violet-800/50">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Results</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                <span className="font-medium text-slate-700 dark:text-slate-300">Solvent Volume:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-violet-600 dark:text-violet-400 count-up">
                    {results.solventVolume.toFixed(precision)} {results.volumeUnit}
                  </span>
                  <CopyButton value={`${results.solventVolume.toFixed(precision)} ${results.volumeUnit}`} />
                </div>
              </div>

              {results.equivalents.map((equiv, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/40 dark:bg-slate-800/40 rounded-lg"
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

              {/* Protocol steps */}
              <div className="mt-4 p-4 bg-violet-50/50 dark:bg-violet-900/10 rounded-lg border border-violet-200/30 dark:border-violet-800/30">
                <h4 className="font-semibold text-violet-800 dark:text-violet-300 mb-2">Protocol:</h4>
                <ol className="text-sm text-violet-700 dark:text-violet-400 space-y-1">
                  <li>
                    1. Add {powderMass} {massUnit} of powder to a clean container
                  </li>
                  <li>
                    2. Add {results.solventVolume.toFixed(precision)} {results.volumeUnit} of solvent
                  </li>
                  <li>3. Mix thoroughly until completely dissolved</li>
                  <li>
                    4. Final concentration: {targetConc} {concUnit}
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
          <strong>Formulas:</strong>
          <br />• For mg/mL: volume = mass / concentration
          <br />• For molarity: volume = (mass / MW) / molarity
        </div>
      </CardContent>
    </Card>
  )
}
