import React from 'react'
import { Play, ToggleLeft, ToggleRight, Sparkles, MessageSquare, Terminal } from 'lucide-react'

export default function Sidebar({
  prompt,
  setPrompt,
  isRunning,
  onRun,
  chatLog,
  useMockMode,
  setUseMockMode
}) {
  return (
    <div className="w-96 h-full bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between backdrop-blur-md z-10 shadow-2xl">
      {/* Header & Control Header */}
      <div className="p-4 border-b border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-wide">AgentAccord</h1>
          </div>
          
          {/* Mock Mode Toggle */}
          <button
            onClick={() => setUseMockMode(!useMockMode)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            title="Toggle Fallback Mock Mode (Ctrl+M)"
          >
            {useMockMode ? (
              <ToggleRight className="w-5 h-5 text-cyan-400" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-slate-600" />
            )}
            <span className={useMockMode ? 'text-cyan-400 font-semibold' : ''}>Mock Mode</span>
          </button>
        </div>
        <p className="text-xs text-slate-400">Autonomous Multi-Agent Policy Negotiation Fabric</p>
      </div>

      {/* Real-time Streaming Chat Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px] uppercase tracking-wider mb-2">
          <Terminal className="w-3.5 h-3.5" /> Live Agent Turn Stream
        </div>

        {chatLog.length === 0 ? (
          <div className="text-center py-12 text-slate-600 italic">
            Enter a governance mandate below and click RUN to initiate multi-agent negotiation.
          </div>
        ) : (
          chatLog.map((turn, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 shadow-md space-y-1 animate-fadeIn"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: turn.color }} />
                <span className="font-semibold text-slate-200" style={{ color: turn.color }}>
                  {turn.speaker}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed pl-4 border-l border-slate-800">
                {turn.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Input Box & RUN Button */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-3">
        <div>
          <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
            Policy Mandate Scenario
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isRunning}
            rows={3}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
            placeholder="e.g., We must cut 20% of R&D spend immediately due to market volatility."
          />
        </div>

        <button
          onClick={onRun}
          disabled={isRunning}
          className="w-full py-2.5 px-4 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Negotiating Policy...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>RUN POLICY WEAVER</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
