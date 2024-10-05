import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'

function GlowingSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      {/* Increased emissiveIntensity for stronger glow */}
      <meshStandardMaterial emissive="#fff269" emissiveIntensity={4} color="black" />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas style={{ background: 'black', width: "100vw", height: "100vh" }}>
      {/* Ambient and point lights */}
      <ambientLight intensity={1} />

      {/* Glowing sphere */}
      <GlowingSphere />

      {/* Orbit Controls for interaction */}
      <OrbitControls />

      {/* Post-processing for stronger glow effect */}
      <EffectComposer disableNormalPass>
        <Bloom 
          mipmapBlur
          luminanceThreshold={1}  // Lower threshold to affect more of the scene
          intensity={1.6}  // Increased bloom intensity
          levels={9}
        />
         <ToneMapping />
      </EffectComposer>
    </Canvas>
  )
}