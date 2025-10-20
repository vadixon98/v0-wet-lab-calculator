"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy, Download, Info } from "lucide-react"
import { UnitInput } from "@/components/unit-input"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DilutionStep {
  step: number
  concentration: number
  concentrationUnit: string
  volumeToTransfer: number
  diluentVolume: number
  totalVolume: number
}

export function BatchCalculator() {
  const { toast } = useToast()
  const [startConcentration, setStartConcentration] = useState("")
  const [startUnit, setStartUnit] = useState("M")
  const [dilutionFactor, setDilutionFactor] = useState("2")
  const [numberOfSteps, setNumberOfSteps] = useState("6")
  const [totalVolume, setTotalVolume] = useState("1000")
  const [volumeUnit, setVolumeUnit] = useState("µL")
  const [calculationType, setCalculationType] = useState<"serial" | "custom">("serial")
  const [results, setResults] = useState<DilutionStep[]>([])

  const concentrationUnits = ["M", "mM", "µM", "nM", "mg/mL", "µg/mL", "ng/mL", "%"]
  const volumeUnits = ["L", "mL", "µL", "nL"]

  const calculateSerialDilution = () => {
    const start = Number.parseFloat(startConcentration)
    const factor = Number.parseFloat(dilutionFactor)
    const steps = Number.parseInt(numberOfSteps)
    const volume = Number.parseFloat(totalVolume)

    if (!start || !factor || !steps || !volume || factor <= 1) {
      toast({
        title: "Invalid Input",
        description: "Please check your values. Dilution factor must be > 1.",
        variant: "destructive",
      })
      return
    }

    const dilutionSteps: DilutionStep[] = []

    for (let i = 0; i < steps; i++) {
      const concentration = start / Math.pow(factor, i)
      const volumeToTransfer = volume / factor
      const diluentVolume = volume - volumeToTransfer

      dilutionSteps.push({
        step: i + 1,
        concentration,
        concentrationUnit: startUnit,
        volumeToTransfer,
        diluentVolume,
        totalVolume: volume,
      })
    }

    setResults(dilutionSteps)
  }

  const copyTableToClipboard = () => {
    if (results.length === 0) return

    // Create TSV format for Excel
    const headers = [
      "Step",
      "Concentration",
      "Unit",
      "Transfer Volume",
      "Diluent Volume",
      "Total Volume",
      "Volume Unit",
    ]
    const rows = results.map((r) => [
      r.step,
      r.concentration.toExponential(3),
      r.concentrationUnit,
      r.volumeToTransfer.toFixed(2),
      r.diluentVolume.toFixed(2),
      r.totalVolume.toFixed(2),
      volumeUnit,
    ])

    const tsv = [headers.join("\t"), ...rows.map((row) => row.join("\t"))].join("\n")

    navigator.clipboard.writeText(tsv)
    toast({
      title: "Copied to Clipboard! 📋",
      description: "Table copied in Excel-compatible format. Paste into your spreadsheet.",
    })
  }

  const downloadCSV = () => {
    if (results.length === 0) return

    const headers = [
      "Step",
      "Concentration",
      "Unit",
      "Transfer Volume",
      "Diluent Volume",
      "Total Volume",
      "Volume Unit",
    ]
    const rows = results.map((r) => [
      r.step,
      r.concentration.toExponential(3),
      r.concentrationUnit,
      r.volumeToTransfer.toFixed(2),
      r.diluentVolume.toFixed(2),
      r.totalVolume.toFixed(2),
      volumeUnit,
    ])

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `serial-dilution-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded! 📥",
      description: "CSV file saved to your downloads folder.",
    })
  }

  return (
    <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/60 dark:border-slate-700/60 shadow-xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Batch Calculator
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Calculate serial dilutions and generate tables for plate setups
          </p>
        </div>

        {/* Calculation Type Selector */}
        <div className="space-y-2">
          <Label>Calculation Type</Label>
          <Select value={calculationType} onValueChange={(v) => setCalculationType(v as "serial" | "custom")}>
            <SelectTrigger className="bg-white dark:bg-slate-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="serial">Serial Dilution</SelectItem>
              <SelectItem value="custom" disabled>
                Custom Series (Coming Soon)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-conc">Starting Concentration</Label>
            <UnitInput
              id="start-conc"
              value={startConcentration}
              onChange={setStartConcentration}
              unit={startUnit}
              onUnitChange={setStartUnit}
              units={concentrationUnits}
              placeholder="e.g., 1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dilution-factor">Dilution Factor</Label>
            <UnitInput
              id="dilution-factor"
              value={dilutionFactor}
              onChange={setDilutionFactor}
              unit=""
              onUnitChange={() => {}}
              units={[]}
              placeholder="e.g., 2 (for 1:2)"
              hideUnitSelector
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num-steps">Number of Steps</Label>
            <UnitInput
              id="num-steps"
              value={numberOfSteps}
              onChange={setNumberOfSteps}
              unit=""
              onUnitChange={() => {}}
              units={[]}
              placeholder="e.g., 6"
              hideUnitSelector
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="total-volume">Total Volume per Step</Label>
            <UnitInput
              id="total-volume"
              value={totalVolume}
              onChange={setTotalVolume}
              unit={volumeUnit}
              onUnitChange={setVolumeUnit}
              units={volumeUnits}
              placeholder="e.g., 1000"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={calculateSerialDilution}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
        >
          Calculate Series
        </Button>

        {/* Info Box */}
        <div className="flex items-start gap-2 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-indigo-900 dark:text-indigo-200">
            <p className="font-medium mb-1">Serial Dilution Protocol:</p>
            <ol className="list-decimal list-inside space-y-1 text-indigo-700 dark:text-indigo-300">
              <li>Prepare tubes with the calculated diluent volume</li>
              <li>Transfer the specified volume from the previous tube</li>
              <li>Mix thoroughly before the next transfer</li>
              <li>The first tube uses your starting stock solution</li>
            </ol>
          </div>
        </div>

        {/* Results Table */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Dilution Series Results</h3>
              <div className="flex gap-2">
                <Button onClick={copyTableToClipboard} variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Copy className="w-4 h-4" />
                  Copy Table
                </Button>
                <Button onClick={downloadCSV} variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Download CSV
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Step</th>
                    <th className="px-4 py-3 text-left font-semibold">Concentration</th>
                    <th className="px-4 py-3 text-left font-semibold">Transfer Volume</th>
                    <th className="px-4 py-3 text-left font-semibold">Diluent Volume</th>
                    <th className="px-4 py-3 text-left font-semibold">Total Volume</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900">
                  {results.map((result, index) => (
                    <tr
                      key={result.step}
                      className={`border-b border-slate-200 dark:border-slate-700 ${
                        index % 2 === 0 ? "bg-slate-50 dark:bg-slate-800/50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{result.step}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {result.concentration.toExponential(3)} {result.concentrationUnit}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {result.volumeToTransfer.toFixed(2)} {volumeUnit}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {result.diluentVolume.toFixed(2)} {volumeUnit}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {result.totalVolume.toFixed(2)} {volumeUnit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-indigo-600 dark:text-indigo-400">Dilution Factor</p>
                  <p className="font-semibold text-indigo-900 dark:text-indigo-100">1:{dilutionFactor}</p>
                </div>
                <div>
                  <p className="text-indigo-600 dark:text-indigo-400">Total Steps</p>
                  <p className="font-semibold text-indigo-900 dark:text-indigo-100">{results.length}</p>
                </div>
                <div>
                  <p className="text-indigo-600 dark:text-indigo-400">Concentration Range</p>
                  <p className="font-semibold text-indigo-900 dark:text-indigo-100">
                    {results[0].concentration.toExponential(2)} →{" "}
                    {results[results.length - 1].concentration.toExponential(2)}
                  </p>
                </div>
                <div>
                  <p className="text-indigo-600 dark:text-indigo-400">Total Volume Needed</p>
                  <p className="font-semibold text-indigo-900 dark:text-indigo-100">
                    {(results.length * Number.parseFloat(totalVolume)).toFixed(0)} {volumeUnit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
