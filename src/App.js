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
import MySideNav from "./Menu";
import * as THREE from 'three';
import "./sidenav.css"

export default function App() {
  return (
    <div>
      <MySideNav classname="sidenav"></MySideNav>
    <Canvas
      style={{ background: "black", width: "100vw", height: "100vh" }}
      camera={{ fov: 50, position: [0, Math.cos(Math.PI / 4) * 100, Math.sin(Math.PI/4) * 100] }}
    >
      <SystemView star={data.Sun} />
      <OrbitControls enablePan={false} />
    </Canvas>
    </div>
  );
}
