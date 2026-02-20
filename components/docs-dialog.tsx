"use client"

import { useState } from "react"
import { BookOpen } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function DocsDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
        >
          <BookOpen className="w-4 h-4" />
          Docs
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col p-0"
        showCloseButton={true}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
            Wet Lab Calculator — Documentation
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4 [&_*]:max-w-none">
          <div className="docs-content prose prose-slate dark:prose-invert prose-sm max-w-none">
            <p className="text-slate-600 dark:text-slate-400 text-base font-medium mb-6">
              Laboratory-grade calculations at your fingertips. A performant, type-safe Next.js
              web application for bench scientists—molarity, dilutions, reconstitution, serial
              dilutions, and unit conversion with one-click protocol export.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-200">
              Architecture
            </h3>
            <pre className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-xs overflow-x-auto mb-6 font-mono text-slate-700 dark:text-slate-300">
{`┌─────────────────────────────────────────────────────────────────────────┐
│                         Wet Lab Calculator                               │
├─────────────────────────────────────────────────────────────────────────┤
│  Presentation Layer                                                      │
│  ├── Next.js 14 App Router (React 18)                                   │
│  ├── Radix UI Primitives + Tailwind CSS                                 │
│  └── Client-side state (useState, custom hooks)                          │
├─────────────────────────────────────────────────────────────────────────┤
│  Calculation Engine (lib/calculations.ts)                                │
│  ├── Unit normalization (SI prefixes: M→nM, g→ng, L→µL)                 │
│  ├── Pure functions • Zero side effects • Deterministic                  │
│  └── Exports: calculateMolarity, calculateDilution, etc.                 │
├─────────────────────────────────────────────────────────────────────────┤
│  Features                                                                │
│  ├── Export Protocol → HTML/PDF-ready documents                         │
│  ├── Preset Manager → localStorage-backed custom presets                 │
│  └── Copy to clipboard (TSV for Excel compatibility)                     │
└─────────────────────────────────────────────────────────────────────────┘`}
            </pre>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-200">
              Calculation Modules
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border border-slate-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">Module</th>
                    <th className="border border-slate-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">Formula</th>
                    <th className="border border-slate-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2 font-medium">Molarity</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2 font-mono text-xs">mass = C × V × MW</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Mass (g/mg) from target molarity, volume, and MW</td></tr>
                  <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2 font-medium">Dilution</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2 font-mono text-xs">C₁V₁ = C₂V₂</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Stock volume & diluent from concentrations and final volume</td></tr>
                  <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2 font-medium">Reconstitution</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2 font-mono text-xs">V = mass / C</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Solvent volume for lyophilized powder</td></tr>
                  <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2 font-medium">Concentration</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2 font-mono text-xs">C = mass / V</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">mg/mL, µg/mL, % w/v, molarity from mass and volume</td></tr>
                  <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2 font-medium">Antibiotics</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2 font-mono text-xs">Dilution + per-well</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Common stocks (Amp, Kan, Cm) with µg/mL working conc</td></tr>
                  <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2 font-medium">Batch / Serial</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2 font-mono text-xs">Cₙ = C₀ / factorⁿ</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Multi-step serial dilution with transfer volumes</td></tr>
                  <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2 font-medium">Unit Converter</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2 font-mono text-xs">Base-unit normalization</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Mass (kg→pg), Volume (L→pL), Molar (M→fM), Temp (C/F/K)</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-200">
              Supported Units
            </h3>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 mb-6">
              <li><strong>Mass:</strong> g, mg, µg, ng</li>
              <li><strong>Volume:</strong> L, mL, µL, nL, pL</li>
              <li><strong>Concentration:</strong> M, mM, µM, nM, pM, fM | mg/mL, µg/mL, ng/mL | % w/v</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-200">
              Tech Stack
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border border-slate-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">Layer</th>
                    <th className="border border-slate-200 dark:border-slate-700 px-3 py-2 text-left font-semibold">Technology</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Framework</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Next.js 14 (App Router)</td></tr>
                  <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Language</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">TypeScript 5</td></tr>
                  <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Styling</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Tailwind CSS 4, Radix UI</td></tr>
                  <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Forms</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">react-hook-form, zod</td></tr>
                  <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Deployment</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Vercel</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-200">
              Getting Started
            </h3>
            <pre className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-xs overflow-x-auto mb-4 font-mono text-slate-700 dark:text-slate-300">
{`pnpm install
pnpm dev    # → http://localhost:3000
pnpm build
pnpm start`}
            </pre>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-200">
              Features
            </h3>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 mb-6">
              <li>7 calculation tools — Molarity, Dilution, Reconstitution, Concentration, Antibiotics, Batch/Serial, Unit Converter</li>
              <li>Export protocol — Generate HTML protocol; print/save as PDF</li>
              <li>Presets — Save configurations (localStorage)</li>
              <li>Unit flexibility — Mixed units; auto-conversion</li>
              <li>Precision control — Configurable decimal places</li>
              <li>Copy results — One-click; TSV for Excel</li>
              <li>Dark mode — System-aware theme</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
