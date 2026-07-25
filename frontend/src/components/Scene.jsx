import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import AgentOrb from './AgentOrb'

export default function Scene({ activeSpeaker, hideLabels = false }) {
  const agents = [
    { role: 'Finance Lead', color: '#ef4444', position: [-2.5, 0.5, 0] },
    { role: 'Market Intelligence Agent', color: '#3b82f6', position: [0, 0.5, 2.5] },
    { role: 'R&D Project Director', color: '#22c55e', position: [2.5, 0.5, 0] },
    { role: 'Ethics & Governance Officer', color: '#a855f7', position: [0, 0.5, -2.5] },
  ]

  return (
    <div className="w-full h-full relative">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 4, 7]} fov={50} />
        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} minDistance={4} maxDistance={12} />
        
        {/* Cinematic Lighting Setup */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <pointLight position={[0, 2, 0]} intensity={1.5} color="#06b6d4" />

        {/* Central Conference Glass Table */}
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <cylinderGeometry args={[2.8, 2.8, 0.1, 64]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
        </mesh>
        
        {/* Table Rim Light Ring */}
        <mesh position={[0, -0.14, 0]}>
          <ringGeometry args={[2.75, 2.85, 64]} />
          <meshBasicMaterial color="#38bdf8" side={2} />
        </mesh>

        {/* Render 4 Floating Agent Orbs */}
        {agents.map((agent) => (
          <AgentOrb
            key={agent.role}
            role={agent.role}
            color={agent.color}
            position={agent.position}
            activeSpeaker={activeSpeaker}
            hideLabel={hideLabels}
          />
        ))}
      </Canvas>
    </div>
  )
}
