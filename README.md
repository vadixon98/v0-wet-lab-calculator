# Wet Lab Calculator

> **Laboratory-grade calculations at your fingertips.** A performant, type-safe Next.js web application for bench scientists—molarity, dilutions, reconstitution, serial dilutions, and unit conversion with one-click protocol export.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/victoriadixon-oerthbiocoms-projects/v0-wet-lab-calculator)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/u0nliYxIOsa)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
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
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Calculation Modules

| Module | Formula | Description |
|--------|---------|-------------|
| **Molarity** | `mass = C × V × MW` | Mass (g/mg) from target molarity, volume, and molecular weight |
| **Dilution** | `C₁V₁ = C₂V₂` | Stock volume & diluent from stock/final concentration and final volume |
| **Reconstitution** | `V = mass / C` or `V = (mass/MW) / C` | Solvent volume for lyophilized powder to target concentration |
| **Concentration** | `C = mass / V`, `M = (mass/MW) / V` | mg/mL, µg/mL, % w/v, molarity from mass and volume |
| **Antibiotics** | Dilution + per-well | Common antibiotic stocks (Amp, Kan, Cm, etc.) with µg/mL working conc |
| **Batch / Serial** | `Cₙ = C₀ / factorⁿ` | Multi-step serial dilution with transfer volumes |
| **Unit Converter** | Base-unit normalization | Mass (kg→pg), Volume (L→pL), Molar (M→fM), Temp (C/F/K) |

### Supported Units

- **Mass:** g, mg, µg, ng
- **Volume:** L, mL, µL, nL, pL
- **Concentration:** M, mM, µM, nM, pM, fM | mg/mL, µg/mL, ng/mL | % w/v

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, `tailwind-merge`, `class-variance-authority` |
| **Components** | Radix UI, shadcn/ui patterns |
| **Forms** | react-hook-form, zod |
| **Charts** | Recharts |
| **Fonts** | Geist |
| **Deployment** | Vercel |

---

## Project Structure

```
v0-wet-lab-calculator/
├── app/
│   ├── layout.tsx          # Root layout, theme provider
│   ├── page.tsx            # Main app, calculator routing
│   └── globals.css         # Design tokens, animations
├── components/
│   ├── calculators/        # Calculator UIs (molarity, dilution, etc.)
│   ├── ui/                 # Base components (Button, Card, Input, etc.)
│   ├── export-protocol.tsx # HTML protocol generator
│   ├── preset-manager.tsx  # Save/load calculator presets
│   ├── unit-input.tsx      # Unit-aware numeric input
│   └── precision-selector.tsx
├── lib/
│   ├── calculations.ts     # Core calculation logic (pure functions)
│   └── utils.ts            # cn(), helpers
├── hooks/
│   ├── use-toast.ts
│   └── use-presets.ts
└── public/
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** (or npm/yarn)

### Install & Run

```bash
# Clone
git clone https://github.com/YOUR_ORG/v0-wet-lab-calculator.git
cd v0-wet-lab-calculator

# Install
pnpm install

# Development
pnpm dev
# → http://localhost:3000

# Production build
pnpm build
pnpm start
```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | Run ESLint |

---

## Features

- **7 calculation tools** — Molarity, Dilution, Reconstitution, Concentration, Antibiotics, Batch/Serial, Unit Converter
- **Export protocol** — Generate HTML protocol with inputs, results, steps; print/save as PDF
- **Presets** — Save antibiotic and other calculator configurations (localStorage)
- **Unit flexibility** — Mixed units; auto-conversion via base-unit normalization
- **Precision control** — Configurable decimal places per calculator
- **Copy results** — One-click copy; TSV for batch/serial (Excel-ready)
- **Dark mode** — System-aware theme via `next-themes`

---

## v0.app Integration

This repo is auto-synced with [v0.app](https://v0.app) deployments:

1. Edit your project at [v0.app/chat/projects/u0nliYxIOsa](https://v0.app/chat/projects/u0nliYxIOsa)
2. Deploy from the v0 interface
3. Changes are pushed to this repository
4. Vercel deploys from this repo

**Live:** [Vercel deployment](https://vercel.com/victoriadixon-oerthbiocoms-projects/v0-wet-lab-calculator)

---

## License

Private project. See repository settings for details.
