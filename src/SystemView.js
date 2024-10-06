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
  const [orbit, setOrbit] = useState(true);
  const maxSemiMajorAxis = getMaxSemiMajorAxis(star.planets);
  const [position, setPosition] = useState([0, Math.cos(Math.PI / 4) * maxSemiMajorAxis * 400, Math.sin(Math.PI/4) * maxSemiMajorAxis * 400]);
  const [target, setTarget] = useState(
    [0, 0, 0]
  );  // Default camera position
  const updateTarget = (t, radius) => {
    setTarget(t);
    console.log("target", t);
    setPosition([t[0], t[1] + Math.cos(Math.PI / 4) * radius / 10, t[2] + Math.sin(Math.PI/4) * radius / 10])
  }
  return (
    <>
      <Environment background files="StudioHDR_2_StarField_01_4K.hdr" />
      <Star setTargetPosition={updateTarget} orbitCallback={setOrbit} {...star} />
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
            
      <OrbitControls enablePan={false} target={target}/>
      <PerspectiveCamera makeDefault position={position} fov={50} far={1e9} near={1e-5}/>
    </>
  );
}
