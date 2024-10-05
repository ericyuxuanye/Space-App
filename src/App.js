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

export default function App() {
  console.log(data.Sun);
  
  return (
    <Canvas
      style={{ background: "black", width: "100vw", height: "100vh" }}
      camera={{ fov: 50 }}
    >
      <SystemView star={data.Sun} />
      <OrbitControls />
    </Canvas>
  );
}
