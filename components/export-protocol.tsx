"use client"

import { useState } from "react"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ProtocolField {
  label: string
  value: string
}

export interface ProtocolStep {
  text: string
}

interface ExportProtocolProps {
  calculatorName: string
  inputs: ProtocolField[]
  results: ProtocolField[]
  protocolSteps: ProtocolStep[]
  formula?: string
  notes?: string
  accentColor?: string
}

export function ExportProtocol({
  calculatorName,
  inputs,
  results,
  protocolSteps,
  formula,
  notes,
  accentColor = "#0ea5e9",
}: ExportProtocolProps) {
  const [generating, setGenerating] = useState(false)

  const generateProtocol = () => {
    setGenerating(true)

    const now = new Date()
    const dateStr = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${calculatorName} Protocol - ${dateStr}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    @page { 
      size: letter;
      margin: 0.75in;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      border-bottom: 3px solid ${accentColor};
      padding-bottom: 16px;
      margin-bottom: 24px;
    }

    .header h1 {
      font-size: 24px;
      font-weight: 700;
      color: ${accentColor};
      margin-bottom: 4px;
    }

    .header .subtitle {
      font-size: 13px;
      color: #64748b;
    }

    .header .meta {
      display: flex;
      gap: 24px;
      margin-top: 8px;
      font-size: 12px;
      color: #94a3b8;
    }

    .section {
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: ${accentColor};
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e2e8f0;
    }

    .fields-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .field {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 13px;
    }

    .field-label {
      color: #64748b;
      font-weight: 500;
    }

    .field-value {
      font-weight: 700;
      color: #0f172a;
    }

    .result-field {
      background: ${accentColor}08;
      border-color: ${accentColor}30;
    }

    .result-field .field-value {
      color: ${accentColor};
    }

    .steps-list {
      counter-reset: step;
      list-style: none;
    }

    .steps-list li {
      counter-increment: step;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #f1f5f9;
      font-size: 13px;
    }

    .steps-list li:last-child {
      border-bottom: none;
    }

    .steps-list li::before {
      content: counter(step);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: ${accentColor};
      color: white;
      font-size: 12px;
      font-weight: 700;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .formula-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid ${accentColor};
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 13px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      color: #475569;
    }

    .notes-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 12px;
      color: #92400e;
    }

    .notes-box strong {
      display: block;
      margin-bottom: 4px;
    }

    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #94a3b8;
    }

    .sign-line {
      margin-top: 40px;
      display: flex;
      gap: 48px;
    }

    .sign-line div {
      flex: 1;
    }

    .sign-line .line {
      border-bottom: 1px solid #cbd5e1;
      height: 32px;
    }

    .sign-line label {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 4px;
      display: block;
    }

    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${calculatorName} Protocol</h1>
    <div class="subtitle">Wet Lab Calculator - Generated Protocol</div>
    <div class="meta">
      <span>Date: ${dateStr}</span>
      <span>Time: ${timeStr}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Input Parameters</div>
    <div class="fields-grid">
      ${inputs.map((f) => `<div class="field"><span class="field-label">${f.label}</span><span class="field-value">${f.value}</span></div>`).join("")}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Calculated Results</div>
    <div class="fields-grid">
      ${results.map((f) => `<div class="field result-field"><span class="field-label">${f.label}</span><span class="field-value">${f.value}</span></div>`).join("")}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Protocol Steps</div>
    <ol class="steps-list">
      ${protocolSteps.map((s) => `<li>${s.text}</li>`).join("")}
    </ol>
  </div>

  ${
    formula
      ? `<div class="section">
    <div class="section-title">Formula Used</div>
    <div class="formula-box">${formula}</div>
  </div>`
      : ""
  }

  ${
    notes
      ? `<div class="section">
    <div class="notes-box"><strong>Notes:</strong>${notes}</div>
  </div>`
      : ""
  }

  <div class="sign-line">
    <div><div class="line"></div><label>Prepared by</label></div>
    <div><div class="line"></div><label>Date</label></div>
    <div><div class="line"></div><label>Verified by</label></div>
  </div>

  <div class="footer">
    <span>Generated by Wet Lab Calculator</span>
    <span>Page 1 of 1</span>
  </div>
</body>
</html>`

    // Open in a new window for printing / saving as PDF
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      // Small delay to ensure styles are rendered
      setTimeout(() => {
        printWindow.print()
        setGenerating(false)
      }, 500)
    } else {
      // Fallback: download as HTML
      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${calculatorName.toLowerCase().replace(/\s+/g, "-")}-protocol-${Date.now()}.html`
      a.click()
      URL.revokeObjectURL(url)
      setGenerating(false)
    }
  }

  return (
    <Button
      onClick={generateProtocol}
      disabled={generating}
      variant="outline"
      size="sm"
      className="gap-2 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
    >
      {generating ? (
        <>
          <FileText className="w-4 h-4 animate-pulse" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Export Protocol
        </>
      )}
    </Button>
  )
}
