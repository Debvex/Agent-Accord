import React from "react";
import {
  Play,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Terminal,
  Shield,
  FileText,
  Activity,
} from "lucide-react";

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
    "We must cut 20% of R&D spend immediately due to market volatility.",
    "Reallocate 15% from long-term capital cycles to accelerate short-term AI products.",
    "Reduce total R&D budget by 25% while maintaining 100% core engineering headcount.",
  ];

  return (
    <div className="w-96 h-full bg-slate-950/90 border-r border-slate-800/80 flex flex-col justify-between backdrop-blur-xl z-10 shadow-2xl">
      {/* Control Panel Header */}
      <div className="p-4 border-b border-slate-800/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                AgentAccord
              </h1>
              <span className="text-[10px] font-mono text-cyan-400 font-semibold tracking-widest uppercase">
                v2.1 Sentient Policy Weaver
              </span>
            </div>
          </div>

          {/* Mock Mode Toggle */}
          <button
            onClick={() => setUseMockMode(!useMockMode)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors bg-slate-900/60 p-1.5 rounded-lg border border-slate-800"
            title="Toggle Local Simulation Engine (Ctrl+M)"
          >
            {useMockMode ? (
              <ToggleRight className="w-5 h-5 text-cyan-400" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-slate-600" />
            )}
            <span
              className={
                useMockMode
                  ? "text-cyan-400 font-semibold text-[11px]"
                  : "text-[11px]"
              }
            >
              Mock
            </span>
          </button>
        </div>
      </div>

      {/* Real-time Streaming Agent Dialogue Terminal */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs">
        <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] uppercase tracking-wider mb-2 pb-1 border-b border-slate-800/60">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Agent Dialogue Stream</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>{isRunning ? "Negotiating" : "Idle"}</span>
          </div>
        </div>

        {chatLog.length === 0 ? (
          <div className="text-center py-16 px-4 text-slate-500 text-xs space-y-3">
            <Shield className="w-8 h-8 text-slate-700 mx-auto" />
            <p>
              Select a scenario mandate below and click{" "}
              <strong className="text-cyan-400">RUN POLICY WEAVER</strong> to
              initiate multi-agent governance negotiation.
            </p>
          </div>
        ) : (
          chatLog.map((turn, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-lg space-y-1.5 animate-fadeIn"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: turn.color }}
                  />
                  <span
                    className="font-bold text-slate-200"
                    style={{ color: turn.color }}
                  >
                    {turn.speaker}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-500 uppercase">
                  Turn #{idx + 1}
                </span>
              </div>
              <p
                className="text-slate-300 leading-relaxed pl-3.5 border-l-2 text-xs"
                style={{ borderColor: turn.color + "60" }}
              >
                {turn.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Preset Suggestions & Input Box */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/80 space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <FileText className="w-3 h-3 text-cyan-400" /> Policy Mandate
              Scenario
            </label>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isRunning}
            rows={3}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50 transition-all shadow-inner"
            placeholder="e.g., We must cut 20% of R&D spend immediately..."
          />
        </div>

        {/* Quick Presets */}
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-slate-500 uppercase">
            Quick Scenarios:
          </span>
          <div className="flex flex-wrap gap-1">
            {PRESET_MANDATES.map((preset, i) => (
              <button
                key={i}
                disabled={isRunning}
                onClick={() => setPrompt(preset)}
                className="text-[10px] px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md border border-slate-800 transition-colors text-left truncate max-w-full"
              >
                {preset.substring(0, 35)}...
              </button>
            ))}
          </div>
        </div>

        {/* Execution Trigger Button */}
        <button
          onClick={onRun}
          disabled={isRunning}
          className="w-full py-2.5 px-4 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 glow-cyan"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Synthesizing Policy Accord...</span>
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
  );
}
