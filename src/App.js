import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import SystemView from "./SystemView";
import data from "./data.json";
import Sidebar, { SidebarItem } from "./Sidebar";
import * as THREE from 'three';

export default function App() {
  return (
    <main className="App">
    <Sidebar>
      <SidebarItem text="Dashboard" alert/>
    </Sidebar>
    <Canvas
      style={{ background: "black", width: "100vw", height: "100vh" }}
      camera={{ fov: 50, position: [0, Math.cos(Math.PI / 4) * 100, Math.sin(Math.PI/4) * 100] }}
    >
      <SystemView star={data.Sun} />
      <OrbitControls enablePan={false} />
    </Canvas>
    </main>
  );
}
