import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";

function hasObservablePlanet(star, isPlanetObservableFunc) {
  for (const planetData of Object.values(star.planets)) {
    if (isPlanetObservableFunc(planetData)) {
      return true;
    }
  }
  return false;
}

function hasHabitablePlanet(star) {
  return false; // implement later; unclear if will be used
}

const randomPosition = (radius) => {
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos(Math.random() * 2 - 1);
  const r = Math.random() * radius;
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

export default function EarthView({
  stars,
  isPlanetObservableFunc,
  starColorCodingFunc,
}) {
  const meshRef = useRef();
  const { invalidate, gl } = useThree();

  const goodStars = Object.entries(stars).filter(([_, star]) =>
    hasObservablePlanet(star, isPlanetObservableFunc)
  );

  // const { positions, colors } = useMemo(() => {
  //   const tempPositions = [];
  //   const tempColors = [];
  //   goodStars.forEach(([_, star]) => {
  //     const position = randomPosition(50);
  //     tempPositions.push(position);

  //     const color = new THREE.Color().setHSL(
  //       0.8, // this is supposed to be some "observabilityScore"
  //       1,
  //       0.5
  //     ); // Hue based on observabilityScore
  //     tempColors.push(color);
  //   });
  //   return { positions: tempPositions, colors: tempColors };
  // }, [goodStars]);

  // useEffect(() => {
  //   if (!meshRef.current) return;

  //   goodStars.forEach((_, index) => {
  //     // Set the position for each star
  //     meshRef.current.setMatrixAt(
  //       index,
  //       new THREE.Matrix4().makeTranslation(
  //         positions[index].x,
  //         positions[index].y,
  //         positions[index].z
  //       )
  //     );
  //     meshRef.current.setColorAt(index, colors[index]);
  //   });

  //   meshRef.current.instanceMatrix.needsUpdate = true; // Request update for instance matrix
  // }, [positions, goodStars]);

  return (
    <>
      {/* <instancedMesh
        ref={meshRef}
        args={[null, null, Object.keys(goodStars).length]}
      >
        <sphereGeometry args={[1, 32, 32]} />{" "}
        <meshBasicMaterial vertexColors color="white" />
        <ambientLight color={"white"} intensity={1} />
        <pointLight />
      </instancedMesh> */}
      <ambientLight intensity={100} />
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          emissive={"#abcdef"}
          emissiveIntensity={4}
          color="white"
        />
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
      <OrbitControls enablePan={false} />
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 10]}
        fov={50}
        far={100}
        near={1e-5}
      />
    </>
  );
}
