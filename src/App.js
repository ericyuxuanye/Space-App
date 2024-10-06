import React, {useRef, useState} from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Sphere } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import SystemView from "./SystemView";
import data from "./data.json";

import MySideNav from "./Menu";
import { a, useSpring } from '@react-spring/three';
import * as THREE from 'three';
import "./sidenav.css"

export default function App() {
  const [position, setPosition] = useState([0, Math.cos(Math.PI / 4) * 100, Math.sin(Math.PI/4) * 100]);
  const [target, setTarget] = useState(
    [0, 0, 0]
  );  // Default camera position
  // const { x, y, z } = useSpring({
  //   x: target[0],
  //   y: target[1],
  //   z: target[2],
  //   config: { tension: 170, friction: 26 },
  // });
  const updateTarget = (t) => {
    setTarget(t);
    console.log("target", t);
    setPosition([t[0], t[1] + Math.cos(Math.PI / 4) * 100, t[2] + Math.sin(Math.PI/4) * 100])
  }
  return (
    <div>
      <MySideNav classname="sidenav"></MySideNav>
    <Canvas
      style={{ background: "black", width: "100vw", height: "100vh" }}
      //camera={{ position: [0, Math.cos(Math.PI / 4) * 100, Math.sin(Math.PI/4) * 100], fov: 50 }}  // Set the initial camera position
    >
      <PerspectiveCamera makeDefault position={position} fov={50}/>
      <SystemView star={data.Sun} setTargetPosition={updateTarget} />
      
      <OrbitControls enablePan={false} target={target}/>
    </Canvas>
    </div>
  );
}
