import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import SystemView from './SystemView'

export default function App() {
  return (
    <Canvas style={{ background: 'black', width: "100vw", height: "100vh" }} camera={{fov: 50}}>
      <SystemView />
    </Canvas>
  )
}
