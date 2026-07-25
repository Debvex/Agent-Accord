import React, { useState } from 'react'
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
  FolderOpen,
  MessageSquare
} from 'lucide-react'
import FileManager from './FileManager'

export default function Sidebar({
  prompt,
  setPrompt,
  isRunning,
  onRun,
  chatLog,
  useMockMode,
  setUseMockMode,
}) {
  const [activeTab, setActiveTab] = useState('dialogue') // 'dialogue' | 'files'

  const PRESET_MANDATES = [
    'We must cut 20% of R&D spend immediately due to market volatility.',
    'Reallocate 15% from long-term capital cycles to accelerate short-term AI products.',
    'Reduce total R&D budget by 25% while maintaining 100% core engineering headcount.',
  ]

  return (
    <aside className="relative h-full w-[340px] shrink-0 overflow-hidden border-r border-slate-800/80 bg-slate-950/90 text-slate-100 shadow-[8px_0_40px_rgba(2,6,23,0.5)] backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[48px_48px] opacity-25" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-slate-800/20 to-transparent" />

      <div className="relative z-10 flex h-full flex-col">
        {/* Header & App Title */}
        <header className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-slate-100">
              <Sparkles className="h-4 w-4 text-rose-400" />
              Agent Accord
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Policy Weaver Platform</p>
          </div>

          <button
            type="button"
            onClick={() => setUseMockMode(!useMockMode)}
            className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/80 px-2 py-1 text-[10px] text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
            title="Toggle Local Simulation Engine (Ctrl+M)"
          >
            <span className="text-[10px] text-slate-400 font-medium">Mock</span>
            {useMockMode ? (
              <ToggleRight className="h-4 w-4 text-cyan-400" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-slate-400" />
            )}
          </button>
        </header>

        {/* Tab Navigation Selector */}
        <nav className="flex border-b border-slate-800/80 bg-slate-950/60 p-1.5 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('dialogue')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'dialogue'
                ? 'border border-cyan-500/30 bg-cyan-950/50 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Dialogue</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('files')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'files'
                ? 'border border-cyan-500/30 bg-cyan-950/50 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
            }`}
          >
            <FolderOpen className="h-3.5 w-3.5" />
            <span>Knowledge Base</span>
          </button>
        </nav>

        {/* Tab Content Body */}
        {activeTab === 'dialogue' ? (
          <>
            <section className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-slate-400" />
                    Dialogue Stream
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Activity className="h-3 w-3 animate-pulse text-rose-400" />
                    {isRunning ? 'Live' : 'Idle'}
                  </span>
                </div>

                <div className="space-y-3">
                  {chatLog.length === 0 ? (
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 px-3 py-5 text-[11px] leading-relaxed text-slate-400">
                      <Shield className="mb-2 h-4 w-4 text-slate-400" />
                      Start a scenario to populate the dialogue stream.
                    </div>
                  ) : (
                    chatLog.map((turn, idx) => (
                      <article key={idx} className="space-y-1.5 rounded-2xl border border-slate-800/80 bg-slate-900/50 px-3 py-3">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: turn.color }} />
                          <span style={{ color: turn.color }}>{turn.speaker}</span>
                        </div>
                        <p className="pl-3 text-[11px] leading-relaxed text-slate-300">
                          {turn.text}
                        </p>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </section>

            <footer className="border-t border-slate-800/80 bg-slate-950/90 px-4 py-4 text-slate-100">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                <FileText className="h-3.5 w-3.5 text-slate-400" />
                Intervene in Policy
              </div>

              <div className="space-y-3">
                <div className="flex items-end gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3 shadow-inner">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isRunning}
                    rows={2}
                    className="min-h-10.5 flex-1 resize-none bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                    placeholder="Type direct command..."
                  />
                  <button
                    type="button"
                    onClick={onRun}
                    disabled={isRunning}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/20 text-amber-300 transition-colors hover:bg-amber-500/30 hover:text-amber-200 disabled:opacity-50 cursor-pointer"
                    aria-label="Run policy weaver"
                    title="Run policy weaver"
                  >
                    {isRunning ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
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
                      className="max-w-full truncate rounded-full border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-left text-[10px] text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 disabled:opacity-50 cursor-pointer"
                    >
                      {preset.substring(0, 20)}...
                    </button>
                  ))}
                </div>
              </div>
            </footer>
          </>
        ) : (
          <section className="flex-1 overflow-hidden p-4">
            <FileManager />
          </section>
        )}
      </div>
    </aside>
  )
}