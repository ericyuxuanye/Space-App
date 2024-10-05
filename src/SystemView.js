import React from "react";

import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import Star from "./Star";
import Planet from "./Planet";

// name,
// radius,
// semimajorAxis,
// eccentricity,

export default function SystemView({ star }) {
  console.log("s", star);
  console.log("p", star.planets);
  
  return (
    <>
      <Star {...star} />
      <ambientLight intensity={0.05} />
      {star.planets.map((planet, i) => (
        <Planet
          key={i}
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
    </>
  );
}
