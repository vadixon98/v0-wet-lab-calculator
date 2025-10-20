"use client"

import { useState } from "react"
import { Calculator, Beaker, Droplets, TestTube, BarChart3, Pill, FlaskConical } from "lucide-react"
import { MolarityCalculator } from "@/components/calculators/molarity-calculator"
import { DilutionCalculator } from "@/components/calculators/dilution-calculator"
import { ReconstitutionCalculator } from "@/components/calculators/reconstitution-calculator"
import { ConcentrationCalculator } from "@/components/calculators/concentration-calculator"
import { AntibioticsCalculator } from "@/components/calculators/antibiotics-calculator"
import { BatchCalculator } from "@/components/calculators/batch-calculator"

type CalculatorType = "molarity" | "dilution" | "reconstitution" | "concentration" | "antibiotics" | "batch"

const calculators = [
  {
    id: "molarity" as const,
    name: "Molarity",
    emoji: "🔬",
    icon: Beaker,
    gradient: "molarity-gradient",
    color: "sky",
  },
  {
    id: "dilution" as const,
    name: "Dilution",
    emoji: "💧",
    icon: Droplets,
    gradient: "dilution-gradient",
    color: "emerald",
  },
  {
    id: "reconstitution" as const,
    name: "Reconstitution",
    emoji: "🧪",
    icon: TestTube,
    gradient: "reconstitution-gradient",
    color: "violet",
  },
  {
    id: "concentration" as const,
    name: "Concentration",
    emoji: "📊",
    icon: BarChart3,
    gradient: "concentration-gradient",
    color: "amber",
  },
  {
    id: "antibiotics" as const,
    name: "Antibiotics",
    emoji: "💊",
    icon: Pill,
    gradient: "antibiotics-gradient",
    color: "rose",
  },
  {
    id: "batch" as const,
    name: "Batch",
    emoji: "🧬",
    icon: FlaskConical,
    gradient: "batch-gradient",
    color: "indigo",
  },
]

export default function WetLabCalculator() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>("molarity")

  const renderCalculator = () => {
    switch (activeCalculator) {
      case "molarity":
        return <MolarityCalculator />
      case "dilution":
        return <DilutionCalculator />
      case "reconstitution":
        return <ReconstitutionCalculator />
      case "concentration":
        return <ConcentrationCalculator />
      case "antibiotics":
        return <AntibioticsCalculator />
      case "batch":
        return <BatchCalculator />
      default:
        return <MolarityCalculator />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50/30 to-emerald-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky-200/20 rounded-full blur-xl float" />
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-emerald-200/20 rounded-full blur-xl float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-20 w-28 h-28 bg-violet-200/20 rounded-full blur-xl float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-36 h-36 bg-amber-200/20 rounded-full blur-xl float"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="text-center py-8 px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-2xl shadow-lg pulse-glow">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Wet Lab Calculator
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Professional calculation tools for bench scientists. Accurate, fast, and beautifully designed.
          </p>
        </header>

        {/* Navigation Tabs */}
        <nav className="px-4 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 p-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-slate-700/60 shadow-xl">
              {calculators.map((calc) => {
                const isActive = activeCalculator === calc.id
                const Icon = calc.icon

                return (
                  <button
                    key={calc.id}
                    onClick={() => setActiveCalculator(calc.id)}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm transform hover:scale-105 active:scale-95
                      ${
                        isActive
                          ? `${calc.gradient} text-white shadow-lg shadow-${calc.color}-500/30 scale-105`
                          : "bg-white/70 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:shadow-md hover:bg-white/90 dark:hover:bg-white/10"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{calc.name}</span>
                    <span className="sm:hidden">{calc.emoji}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Calculator Content */}
        <main className="px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div key={activeCalculator} className="tab-content">
              {renderCalculator()}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
