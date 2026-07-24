import React from 'react'
import { Award, ShieldCheck, FileCheck, CheckCircle2, RotateCcw } from 'lucide-react'

export default function DecisionLedger({ accord, onReset }) {
  if (!accord) return null

  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-fadeIn">
      <div className="max-w-xl w-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl p-6 shadow-2xl shadow-amber-500/10 space-y-6 relative overflow-hidden">
        {/* Glow Header accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />

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
            onClick={onReset}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Start New Governance Scenario
          </button>
        </div>
      </div>
    </div>
  )
}
