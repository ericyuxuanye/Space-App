import React from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Point,
  Points,
} from "@react-three/drei";
import * as THREE from "three";

const stars = [
  // Array of stars with RA and DEC coordinates
  { ra: 10, dec: 20 },
  { ra: 45, dec: -30 },
  // Add more stars...
];

function convertRADecToXYZ(ra, dec) {
  const radRA = (ra / 24) * 2 * Math.PI; // Convert hours to radians
  const radDEC = (dec / 180) * Math.PI; // Convert degrees to radians
  const x = 3 * Math.cos(radDEC) * Math.cos(radRA);
  const y = 3 * Math.cos(radDEC) * Math.sin(radRA);
  const z = 3 * Math.sin(radDEC);
  return [x, y, z];
}

function StarField() {
  const points = stars.map(({ ra, dec }) => convertRADecToXYZ(ra, dec));
  const colors = points.map(() => "#ffffff");
  const sizes = points.map(() => 1);

  return (
    // <Points
    //   positions={points.map(() => [0, 3, 0])}
    //   colors={colors}
    //   sizes={sizes}
    // >
    //   <pointsMaterial />
    // </Points>
    <Points
      limit={1000} // Optional: max amount of items (for calculating buffer size)
      range={1000} // Optional: draw-range
    >
      <pointsMaterial vertexColors />
      <Point
        position={[1, 2, 3]}
        scale={0.01}
        color="red"
        onClick={null}
        onPointerOver={null}
      />
      // As many as you want, make them conditional, mount/unmount them, lazy
      load them, etc ...
    </Points>
  );
}

function EarthView2() {
  return (
    <>
      <Environment background files="StudioHDR_2_StarField_01_4K.hdr" />
      <ambientLight intensity={100} />
      <StarField />
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 10]}
        fov={50}
        far={1e9}
        near={1e-5}
      />
    </>
  );
}

export default EarthView2;
