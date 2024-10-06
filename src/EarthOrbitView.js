import React, {useRef, useEffect, Suspense} from "react";
import SimpleStar from "./SimpleStar";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { OrbitControls, PerspectiveCamera, PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function hasObservablePlanet(star, isPlanetObservableFunc) {
  for (const planetData of Object.values(star.planets)) {
    if (isPlanetObservableFunc(planetData)) {
      return true;
    }
  }
  return false;
}

const CameraControls = () => {
  const controlsRef = useRef();
  // const cameraRef = useRef();
  
  // // Custom camera update function
  // const updateCameraOrbit = () => {
  //   const forward = new THREE.Vector3();
  //   cameraRef.current.getWorldDirection(forward);
  //   controlsRef.current.target.copy(cameraRef.current.position).add(forward);
  // };

  // useEffect(() => {
    
  //   const controls = controlsRef.current;
  //   if (controls) {
  //     // controls.addEventListener('end', updateCameraOrbit);
  //     // return () => controls.removeEventListener('end', updateCameraOrbit);
  //     console.log(controls)
  //     controls.current.rotateSpeed=-0.5;
  //   }
  // }, []);
  return (
    <>
      <perspectiveCamera makeDefault fov={60} position={[0, 0, 0]} />
      <OrbitControls ref={controlsRef} target={[0, 0, 0]} minDistance={0.01} maxDistance={0.01} enablePan={false} />
    </>
  );
};

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
      {/* <CameraControls /> */}
      <EffectComposer disableNormalPass>
        <Bloom
          mipmapBlur
          luminanceThreshold={1} // Lower threshold to affect more of the scene
          intensity={1.6} // Increased bloom intensity
          levels={9}
        />
        <ToneMapping />
      </EffectComposer>
      <CameraControls />
    </>
  );
}
