import React from 'react'
import {
  Play,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Terminal,
  Shield,
  FileText,
  Activity,
  Send,
} from 'lucide-react'

export default function Sidebar({
  prompt,
  setPrompt,
  isRunning,
  onRun,
  chatLog,
  useMockMode,
  setUseMockMode,
}) {
  const PRESET_MANDATES = [
    'We must cut 20% of R&D spend immediately due to market volatility.',
    'Reallocate 15% from long-term capital cycles to accelerate short-term AI products.',
    'Reduce total R&D budget by 25% while maintaining 100% core engineering headcount.',
  ]

  return (
    <aside className="relative h-full w-[320px] shrink-0 overflow-hidden border-r border-slate-700/70 bg-[#666a76] text-slate-100 shadow-[8px_0_40px_rgba(2,6,23,0.35)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[48px_48px] opacity-25" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-white/8 to-transparent" />

      <div className="relative z-10 flex h-full flex-col">
        <header className="flex items-start justify-between border-b border-slate-500/40 px-4 py-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200/90">
              <Sparkles className="h-3.5 w-3.5 text-rose-300" />
              Dialogue Stream
            </div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-300/70">Agent Accord</p>
          </div>

          <button
            type="button"
            onClick={() => setUseMockMode(!useMockMode)}
            className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-slate-200/80 transition-colors hover:bg-white/10"
            title="Toggle Local Simulation Engine (Ctrl+M)"
          >
            {useMockMode ? (
              <ToggleRight className="h-4 w-4 text-cyan-300" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-slate-300" />
            )}
          </button>
        </header>

        <section className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200/70">
              <span className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-slate-100/70" />
                Dialogue Stream
              </span>
              <span className="flex items-center gap-1 text-slate-300/70">
                <Activity className="h-3 w-3 animate-pulse text-rose-300" />
                {isRunning ? 'Live' : 'Idle'}
              </span>
            </div>

            <div className="space-y-3">
              {chatLog.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/6 px-3 py-5 text-[11px] leading-relaxed text-slate-200/75">
                  <Shield className="mb-2 h-4 w-4 text-slate-100/70" />
                  Start a scenario to populate the dialogue stream.
                </div>
              ) : (
                chatLog.map((turn, idx) => (
                  <article key={idx} className="space-y-1.5 rounded-2xl border border-white/10 bg-white/6 px-3 py-3">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: turn.color }} />
                      <span style={{ color: turn.color }}>{turn.speaker}</span>
                    </div>
                    <p className="pl-3 text-[11px] leading-relaxed text-slate-200/80">
                      {turn.text}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-500/40 bg-[#3f4653] px-4 py-4 text-slate-100">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200/80">
            <FileText className="h-3.5 w-3.5 text-slate-100/80" />
            Intervene in Policy
          </div>

          <div className="space-y-3">
            <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-[#59606d] px-3 py-3 shadow-inner">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isRunning}
                rows={2}
                className="min-h-10.5 flex-1 resize-none bg-transparent text-sm text-slate-100 placeholder:text-slate-300/60 outline-none"
                placeholder="Type direct command..."
              />
              <button
                type="button"
                onClick={onRun}
                disabled={isRunning}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#6a717d] text-slate-100 transition-colors hover:bg-[#737a86] disabled:opacity-50"
                aria-label="Run policy weaver"
                title="Run policy weaver"
              >
                {isRunning ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-100 border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-1">
              {PRESET_MANDATES.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={isRunning}
                  onClick={() => setPrompt(preset)}
                  className="max-w-full truncate rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-left text-[10px] text-slate-200/70 transition-colors hover:bg-white/12 hover:text-white disabled:opacity-50"
                >
                  {preset.substring(0, 20)}...
                </button>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </aside>
  )
}