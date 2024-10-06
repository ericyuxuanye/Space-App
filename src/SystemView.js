import React, { useState } from "react";

import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { lerp } from "three/src/math/MathUtils.js";
import Planet from "./Planet";
import Star from "./Star";
import { AU_TO_SOLAR_RADIUS } from "./util";


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
  const { invalidate, gl } = useThree();
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
  const updateTargetPlanet = (t, radius) => {
    setTarget(t);
    setFuturePosition([
      t[0],
      t[1] + (Math.cos(Math.PI / 4) * radius) / 10,
      t[2] + (Math.sin(Math.PI / 4) * radius) / 10,
    ]);
    invalidate();
  };
  const updateTargetStar = () => {
    setTarget([0, 0, 0]);
    setFuturePosition(initialPosition);
    invalidate();
  };
  useFrame(() => {
    const lerpSpeed =
      target[0] == 0 && target[1] == 0 && target[2] == 0 ? 0.2 : 0.35;

    const newX = lerp(position[0], futurePosition[0], lerpSpeed);
    const newY = lerp(position[1], futurePosition[1], lerpSpeed);
    const newZ = lerp(position[2], futurePosition[2], lerpSpeed);

    if (
      Math.pow(futurePosition[0] - position[0], 2) +
        Math.pow(futurePosition[1] - position[1], 2) +
        Math.pow(futurePosition[2] - position[2], 2) >
      1e-5
    ) {
      setPosition([newX, newY, newZ]);
      invalidate();
    }
  });
  console.log(star);
  return (
    <>
      <Environment background files="StudioHDR_2_StarField_01_4K.hdr" />
      <Star
        setTargetPosition={updateTargetStar}
        orbitCallback={setOrbit}
        {...star}
      />
      <ambientLight intensity={0.05} />
      {star.planets.map((planet, i) => (
        <Planet
          key={i}
          setTargetPosition={updateTargetPlanet}
          showOrbit={orbit}
          orbitCallback={setOrbit}
          {...planet}
          // radius={planet.radius}
          // semimajorAxis={planet.semimajorAxis}
          // eccentricity={planet.eccentricity}
        />
      ))}
      {/* Habitable zone */}
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[star["Habitable-Zone-upper"] * AU_TO_SOLAR_RADIUS, star["Habitable-Zone-lower"] * AU_TO_SOLAR_RADIUS, 128]} />
        <meshBasicMaterial color="#86fead" side={THREE.DoubleSide} transparent opacity={0.1} />
      </mesh>
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
