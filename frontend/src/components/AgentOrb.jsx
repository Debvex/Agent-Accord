import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export default function AgentOrb({ position, role, color, activeSpeaker, hideLabel = false }) {
  const meshRef = useRef()
  const isActive = activeSpeaker === role

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Base rotation
    meshRef.current.rotation.y += delta * 0.5

    // Smooth scaling target (1.25x scale when speaking, 1.0x baseline)
    const targetScale = isActive ? 1.25 : 1.0
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5)

    // Emissive intensity lerp
    if (meshRef.current.material) {
      const targetEmissive = isActive ? 2.5 : 0.4
      meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        meshRef.current.material.emissiveIntensity,
        targetEmissive,
        delta * 5
      )
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

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
          </div>
        </Html>
      )}
    </group>
  )
}
