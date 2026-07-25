import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import * as THREE from 'three'
import AgentOrb from './AgentOrb'

export default function Scene({ activeSpeaker, hideLabels = false }) {
  // Floating 3D Ambient Particle Field Background Component
  const ParticleField = ({ count = 250 }) => {
    const pointsRef = useRef()

    const positions = useMemo(() => {
      const pos = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 20
        pos[i * 3 + 1] = (Math.random() - 0.5) * 12 + 2
        pos[i * 3 + 2] = (Math.random() - 0.5) * 20
      }
      return pos
    }, [count])

    useFrame((state, delta) => {
      if (pointsRef.current) {
        pointsRef.current.rotation.y += delta * 0.03
        pointsRef.current.rotation.x += delta * 0.015
      }
    })

    return (
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#38bdf8"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
    )
  }

  const agents = [
    { role: 'Finance Lead', color: '#ef4444', position: [-2.5, 0.5, 0] },
    { role: 'Market Intelligence Agent', color: '#3b82f6', position: [0, 0.5, 2.5] },
    { role: 'R&D Project Director', color: '#22c55e', position: [2.5, 0.5, 0] },
    { role: 'Ethics & Governance Officer', color: '#a855f7', position: [0, 0.5, -2.5] },
  ]

  return (
    <div className="w-full h-full relative bg-slate-950">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 4.5, 7.5]} fov={50} />
        <OrbitControls
          enableZoom={true}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={4}
          maxDistance={14}
          autoRotate={!activeSpeaker}
          autoRotateSpeed={0.5}
        />
        
        {/* Background Starfield & Floating Particles */}
        <Stars radius={40} depth={50} count={2000} factor={4} saturation={0.5} fade speed={1} />
        <ParticleField count={300} />

        {/* Cinematic Lighting Setup */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[6, 10, 6]} intensity={1.5} color="#ffffff" castShadow />
        <directionalLight position={[-6, 5, -6]} intensity={0.5} color="#0284c7" />
        <pointLight position={[0, 2.5, 0]} intensity={2.0} color="#06b6d4" distance={8} />

        {/* Central Conference Glass Table Mesh */}
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <cylinderGeometry args={[2.9, 2.9, 0.12, 64]} />
          <meshStandardMaterial
            color="#0b1329"
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.92}
          />
        </mesh>
        
        {/* Futuristic Emissive Cyan Table Rim Ring */}
        <mesh position={[0, -0.13, 0]}>
          <ringGeometry args={[2.85, 2.95, 64]} />
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
        </mesh>

        {/* Center Holographic Core Ring */}
        <mesh position={[0, -0.12, 0]}>
          <ringGeometry args={[0.4, 0.5, 32]} />
          <meshBasicMaterial color="#06b6d4" side={THREE.DoubleSide} />
        </mesh>

        {/* Render 4 Floating Interactive Agent Orbs */}
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

