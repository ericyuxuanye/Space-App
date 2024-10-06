import React, { useState } from "react";

import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import Star from "./Star";
import Planet from "./Planet";
import { Environment } from "@react-three/drei";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { lerp } from "three/src/math/MathUtils.js";
import { useFrame } from "@react-three/fiber";

// name,
// radius,
// semimajorAxis,
// eccentricity,

function getMaxSemiMajorAxis(planets) {
  let max = 0;
  for (let planet of planets) {
    if (planet.semiMajorAxis > max) {
      max = planet.semiMajorAxis;
    }
  }
  return max;
}

export default function SystemView({ star }) {
  console.log(star);
  const maxSemiMajorAxis = getMaxSemiMajorAxis(star.planets);

  const initialPosition = [
    0,
    Math.cos(Math.PI / 4) * maxSemiMajorAxis * 400,
    Math.sin(Math.PI / 4) * maxSemiMajorAxis * 400,
  ];
  const [orbit, setOrbit] = useState(true);
  const [position, setPosition] = useState(initialPosition);
  const [futurePosition, setFuturePosition] = useState(initialPosition);
  const [target, setTarget] = useState([0, 0, 0]); // Default camera position
  const updateTarget = (t, radius) => {
    setTarget(t);
    setFuturePosition([
      t[0],
      t[1] + (Math.cos(Math.PI / 4) * radius) / 10,
      t[2] + (Math.sin(Math.PI / 4) * radius) / 10,
    ]);
  };
  // useFrame(() => {
  //   const newX = lerp(position[0], futurePosition[0], 0.05); // Adjust 0.05 for speed
  //   const newY = lerp(position[1], futurePosition[1], 0.05);
  //   const newZ = lerp(position[2], futurePosition[2], 0.05);

  //   setPosition([newX, newY, newZ]);
  // });
  return (
    <>
      <Environment background files="StudioHDR_2_StarField_01_4K.hdr" />
      <Star
        setTargetPosition={updateTarget}
        orbitCallback={setOrbit}
        {...star}
      />
      <ambientLight intensity={0.05} />
      {star.planets.map((planet, i) => (
        <Planet
          key={i}
          setTargetPosition={updateTarget}
          showOrbit={orbit}
          orbitCallback={setOrbit}
          {...planet}
          // radius={planet.radius}
          // semimajorAxis={planet.semimajorAxis}
          // eccentricity={planet.eccentricity}
        />
      ))}
      <EffectComposer disableNormalPass>
        <Bloom
          mipmapBlur
          luminanceThreshold={1} // Lower threshold to affect more of the scene
          intensity={1.6} // Increased bloom intensity
          levels={9}
        />
        <ToneMapping />
      </EffectComposer>

      <OrbitControls enablePan={false} target={target} />
      <PerspectiveCamera
        makeDefault
        position={position}
        fov={50}
        far={1e9}
        near={1e-5}
      />
    </>
  );
}
