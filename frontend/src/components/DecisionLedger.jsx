import React from 'react'
import { Award, ShieldCheck, FileCheck, CheckCircle2, Download, RotateCcw, X } from 'lucide-react'
import { jsPDF } from 'jspdf'

export default function DecisionLedger({ accord, prompt, chatLog, onReset }) {
  if (!accord) return null

  const handleDownload = () => {
    const turns = chatLog
      .map(
        (turn, index) => `${index + 1}. ${turn.speaker}\n${turn.text}`
      )
      .join('\n\n')
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const marginX = 44
    const topMargin = 52
    const contentWidth = pageWidth - marginX * 2
    const safeTitle = accord.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase()
    const lineColor = [64, 81, 102]

    const addHeader = () => {
      pdf.setFillColor(15, 23, 42)
      pdf.rect(0, 0, pageWidth, pageHeight, 'F')

      pdf.setDrawColor(...lineColor)
      pdf.setLineWidth(1)
      pdf.line(marginX, 112, pageWidth - marginX, 112)

      pdf.setTextColor(248, 250, 252)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(22)
      pdf.text('Agent Accord Summary', marginX, 32)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(191, 219, 254)
      pdf.text(`Generated ${new Date().toLocaleString()}`, marginX, 46)

      pdf.setTextColor(226, 232, 240)
      pdf.setFontSize(12)
      pdf.text(accord.title, marginX, 72, { maxWidth: contentWidth })

      pdf.setFontSize(9)
      pdf.setTextColor(148, 163, 184)
      pdf.text('Final stress-test document', marginX, 90)
    }

    const writeSection = (title, body, y) => {
      pdf.setTextColor(148, 163, 184)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10)
      pdf.text(title.toUpperCase(), marginX, y)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.setTextColor(226, 232, 240)
      const lines = pdf.splitTextToSize(body, contentWidth)
      pdf.text(lines, marginX, y + 14)

      return y + 14 + lines.length * 12 + 10
    }

    let cursorY = topMargin + 72
    addHeader()

    const metricsLines = [
      `Resilience Score: ${accord.resilience_score} / 10.0`,
      `Fairness Score: ${accord.fairness_score} / 10.0`,
    ].join('\n')

    const blocks = [
      ['Stress Test Summary', accord.summary],
      ['Metrics', metricsLines],
      ['Scenario Prompt', prompt || 'N/A'],
      ['Dialogue Turns', turns || 'No dialogue captured.'],
      ['Closing Note', 'This document summarizes the final stress-test accord and can be archived or shared for review.'],
    ]

    blocks.forEach(([title, body]) => {
      const requiredHeight = pdf.splitTextToSize(body, contentWidth).length * 12 + 34
      if (cursorY + requiredHeight > pageHeight - 50) {
        pdf.addPage()
        addHeader()
        cursorY = topMargin + 72
      }

      cursorY = writeSection(title, body, cursorY)
    })

    pdf.save(`${safeTitle || 'agent-accord-summary'}.pdf`)
  }

  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-fadeIn">
      <div className="max-w-xl w-full bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl p-6 shadow-2xl shadow-amber-500/10 space-y-6 relative overflow-hidden">
        {/* Glow Header accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />

        <button
          type="button"
          onClick={onReset}
          aria-label="Close decision ledger and return home"
          className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/30">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold tracking-wider">
                Auditable Golden Document
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">{accord.title}</h2>
            </div>
          </div>
          
          <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Enforceable Accord
          </div>
        </div>

        {/* Compromise Summary */}
        <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <h3 className="text-xs font-mono uppercase text-slate-400">Policy Compromise Summary</h3>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">{accord.summary}</p>
        </div>

        {/* Metrics Overlay Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Predictive Resilience
            </div>
            <div className="text-2xl font-bold text-cyan-400 font-mono">
              {accord.resilience_score} <span className="text-xs text-slate-500 font-normal">/ 10.0</span>
            </div>
            <p className="text-[10px] text-slate-500">Evaluated via NumPy Market Shock Matrix</p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <FileCheck className="w-4 h-4 text-purple-400" /> Fairness & Governance
            </div>
            <div className="text-2xl font-bold text-purple-400 font-mono">
              {accord.fairness_score} <span className="text-xs text-slate-500 font-normal">/ 10.0</span>
            </div>
            <p className="text-[10px] text-slate-500">Zero involuntary workforce layoffs</p>
          </div>
        </div>

        {/* Reset Action */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:border-cyan-500/40 hover:bg-slate-800"
          >
            <Download className="h-4 w-4" /> Download Summary
          </button>

          <button
            onClick={onReset}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4" /> Start New Governance Scenario
          </button>
        </div>
      </div>
    </div>
  )
}
