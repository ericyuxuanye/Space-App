import React from "react";
import SimpleStar from "./SimpleStar";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

function hasObservablePlanet(star, isPlanetObservableFunc) {
  for (const planetData of Object.values(star.planets)) {
    if (isPlanetObservableFunc(planetData)) {
      return true;
    }
  }
  return false;
}

export default function EarthOrbitView({ stars, isPlanetObservableFunc }) {
  const goodStars = Object.values(stars).filter((star) => {
    console.log(star);
    return hasObservablePlanet(star, isPlanetObservableFunc);
  });

  return (
    <>
      <ambientLight intensity={0.05} />
      {Object.keys(goodStars).map((starName, idx) => {
        const starData = goodStars[starName];
        return <SimpleStar key={idx} name={starName} {...starData} />;
      })}
      <EffectComposer disableNormalPass>
        <Bloom
          mipmapBlur
          luminanceThreshold={1} // Lower threshold to affect more of the scene
          intensity={1.6} // Increased bloom intensity
          levels={9}
        />
        <ToneMapping />
      </EffectComposer>

      {/* restrict zoom */}
      <OrbitControls enablePan={false} target={[0, 0, 0]} />
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 50]}
        fov={50}
        far={1e3}
        near={1e-5}
      />
    </>
  );
}
