import React, { useState, useEffect, useRef } from 'react'
import Scene from './components/Scene'
import Sidebar from './components/Sidebar'
import DecisionLedger from './components/DecisionLedger'

export default function App() {
  const [prompt, setPrompt] = useState('We must cut 20% of R&D spend immediately')
  const [activeSpeaker, setActiveSpeaker] = useState(null)
  const [chatLog, setChatLog] = useState([])
  const [accord, setAccord] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [useMockMode, setUseMockMode] = useState(false)

  const eventSourceRef = useRef(null)

  // Hackathon Fail-Safe keyboard shortcut (Ctrl + M)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'm') {
        e.preventDefault()
        setUseMockMode((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleRun = () => {
    setIsRunning(true)
    setChatLog([])
    setAccord(null)
    setActiveSpeaker(null)

    if (useMockMode) {
      runMockNegotiation()
    } else {
      runLiveSSENegotiation()
    }
  }

  // Live SSE Connection to FastAPI backend endpoint
  const runLiveSSENegotiation = () => {
    const url = `http://localhost:8000/negotiate?prompt=${encodeURIComponent(prompt)}`
    const es = new EventSource(url)
    eventSourceRef.current = es

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'turn') {
          setActiveSpeaker(data.speaker)
          setChatLog((prev) => [...prev, data])
        } else if (data.type === 'accord') {
          setAccord(data)
          setActiveSpeaker(null)
          setIsRunning(false)
          es.close()
        }
      } catch (err) {
        console.error('Error parsing SSE payload:', err)
      }
    }

    es.onerror = (err) => {
      console.warn('SSE Error / Backend offline. Falling back to Mock Mode simulation.', err)
      es.close()
      runMockNegotiation()
    }
  }

  // Local Mock Simulation Engine
  const runMockNegotiation = () => {
    const mockTurns = [
      {
        type: 'turn',
        speaker: 'Finance Lead',
        color: '#ef4444',
        text: `Mandate received: '${prompt}'. Bottom-line stability requires an immediate 20% cut in R&D spend.`
      },
      {
        type: 'turn',
        speaker: 'Market Intelligence Agent',
        color: '#3b82f6',
        text: 'Querying internal budget guidelines... Document rules require AI allocation min 45%. Quantum early contract termination fee is $4.2M.'
      },
      {
        type: 'turn',
        speaker: 'R&D Project Director',
        color: '#22c55e',
        text: 'We must defend core AI technology. I propose holding AI at 55%, Quantum at 30%, and accepting a 15% Biotech concession.'
      },
      {
        type: 'turn',
        speaker: 'Ethics & Governance Officer',
        color: '#a855f7',
        text: 'This re-allocation satisfies the 20% cost reduction through project scope while guaranteeing zero involuntary layoffs.'
      }
    ]

    let step = 0
    const interval = setInterval(() => {
      if (step < mockTurns.length) {
        const turn = mockTurns[step]
        setActiveSpeaker(turn.speaker)
        setChatLog((prev) => [...prev, turn])
        step++
      } else {
        clearInterval(interval)
        setActiveSpeaker(null)
        setAccord({
          title: 'Living R&D Policy v2.1 (Simulated Accord)',
          summary: 'Compromise reached: 20% budget reduction absorbed by reallocating AI (55%), Quantum (30%), and Biotech (15%) with zero involuntary layoffs.',
          resilience_score: 8.4,
          fairness_score: 9.2
        })
        setIsRunning(false)
      }
    }, 2500)
  }

  const handleReset = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }
    setIsRunning(false)
    setActiveSpeaker(null)
    setChatLog([])
    setAccord(null)
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden relative">
      {/* Control Panel Sidebar */}
      <Sidebar
        prompt={prompt}
        setPrompt={setPrompt}
        isRunning={isRunning}
        onRun={handleRun}
        chatLog={chatLog}
        useMockMode={useMockMode}
        setUseMockMode={setUseMockMode}
      />

      {/* 3D Visual Stage Canvas */}
      <div className="flex-1 h-full relative">
        <Scene activeSpeaker={activeSpeaker} />

        {/* Mock Mode Overlay Indicator Badge */}
        {useMockMode && (
          <div className="absolute top-4 right-4 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1.5 z-20">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Mock Mode Active (Ctrl + M)
          </div>
        )}
      </div>

      {/* Golden Document Decision Ledger Modal */}
      <DecisionLedger accord={accord} onReset={handleReset} />
    </div>
  )
}
