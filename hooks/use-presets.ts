"use client"

import { useState, useEffect } from "react"

export type CalculatorType = "molarity" | "dilution" | "reconstitution" | "concentration" | "antibiotics"

export interface Preset {
  id: string
  name: string
  calculatorType: CalculatorType
  values: Record<string, any>
  createdAt: string
}

export function usePresets(calculatorType: CalculatorType) {
  const [presets, setPresets] = useState<Preset[]>([])

  // Load presets from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`presets-${calculatorType}`)
    if (stored) {
      try {
        setPresets(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to load presets:", e)
      }
    }
  }, [calculatorType])

  // Save presets to localStorage whenever they change
  useEffect(() => {
    if (presets.length > 0 || localStorage.getItem(`presets-${calculatorType}`)) {
      localStorage.setItem(`presets-${calculatorType}`, JSON.stringify(presets))
    }
  }, [presets, calculatorType])

  const savePreset = (name: string, values: Record<string, any>) => {
    const newPreset: Preset = {
      id: Date.now().toString(),
      name,
      calculatorType,
      values,
      createdAt: new Date().toISOString(),
    }
    setPresets((prev) => [...prev, newPreset])
    return newPreset
  }

  const deletePreset = (id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id))
  }

  const loadPreset = (id: string) => {
    return presets.find((p) => p.id === id)
  }

  return {
    presets,
    savePreset,
    deletePreset,
    loadPreset,
  }
}
