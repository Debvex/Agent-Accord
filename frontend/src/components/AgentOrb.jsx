import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export default function AgentOrb({ position, role, color, activeSpeaker, hideLabel = false }) {
  const meshRef = useRef()
  const ringRef = useRef()
  const isActive = activeSpeaker === role

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Base orb rotation
    meshRef.current.rotation.y += delta * 0.6

    // Energy halo ring rotation
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (isActive ? 3.0 : 0.8)
      ringRef.current.rotation.x += delta * 0.4
    }

    // Smooth lerp scale target (1.25x when active speaker, 1.0x default)
    const targetScale = isActive ? 1.25 : 1.0
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6)

    // Smooth emissive intensity lerp
    if (meshRef.current.material) {
      const targetEmissive = isActive ? 2.8 : 0.45
      meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        meshRef.current.material.emissiveIntensity,
        targetEmissive,
        delta * 6
      )
    }
  })

  return (
    <group position={position}>
      {/* Primary Agent Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

<<<<<<< HEAD
      {/* Floating 3D HTML Speech Tag */}
      {!hideLabel && (
        <Html position={[0, 1.2, 0]} center distanceFactor={10}>
          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 shadow-lg border ${
            isActive 
              ? 'bg-slate-900/90 text-white border-cyan-400 scale-110 shadow-cyan-500/50' 
              : 'bg-slate-950/70 text-slate-400 border-slate-800'
          }`}>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
              {role}
            </div>
=======
      {/* Outer Holographic Energy Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.9, 0.02, 16, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.9 : 0.35}
        />
      </mesh>

      {/* Floating 3D HTML Speech & Role Tag */}
      <Html position={[0, 1.25, 0]} center distanceFactor={10}>
        <div
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 shadow-xl border backdrop-blur-md ${
            isActive
              ? 'bg-slate-900/95 text-white border-cyan-400 scale-110 shadow-cyan-500/50 ring-2 ring-cyan-400/40'
              : 'bg-slate-950/80 text-slate-400 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isActive ? 'animate-ping' : ''}`}
              style={{ backgroundColor: color }}
            />
            <span className="font-semibold text-slate-100">{role}</span>
            {isActive && (
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                SPEAKING
              </span>
            )}
>>>>>>> origin/main
          </div>
        </Html>
      )}
    </group>
  )
}
