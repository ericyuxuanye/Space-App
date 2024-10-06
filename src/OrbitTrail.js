import React, { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { orbitPos } from "./util";
import { Line } from "@react-three/drei";

export default function OrbitTrail({ theta, semiMajorAxis, eccentricity }) {
  const meshRef = useRef();

  // Generate points for the orbit path (circle)
  const points = [];
  const segments = 100;

  for (let i = 0; i <= segments; i++) {
    const angle = theta + (i / segments) * Math.PI * 2;
    let [x, y] = orbitPos(angle, semiMajorAxis, eccentricity);
    // temporary; remove this later
    // x *= 10;
    // y *= 10;
    points.push(new THREE.Vector3(x, 0, y));
  }

  return <Line points={points} lineWidth={1} color={"white"} />;

  // // Create a curve based on the points
  // const curve = new THREE.CatmullRomCurve3(points);

  // // Create a function that defines the varying radius (thickness)
  // const tubeRadius = (t) => {
  //   return 0.5 + 2 * (1 - t); // Starts thicker and gets thinner
  // };

  // // Generate TubeGeometry with variable radius along the curve
  // const tubeGeometry = new THREE.TubeGeometry(curve, segments, 0.1, 8, true);
  // tubeGeometry.attributes.position.needsUpdate = true;

  // // Update the radius per point for the variable thickness effect
  // const vertices = tubeGeometry.attributes.position.array;
  // for (let i = 0; i < segments; i++) {
  //   const t = i / segments;
  //   const currentRadius = tubeRadius(t);
  //   for (let j = 0; j < 8; j++) {
  //     const index = (i * 8 + j) * 3; // Calculate the index of each vertex
  //     vertices[index] *= currentRadius;
  //     vertices[index + 1] *= currentRadius;
  //     vertices[index + 2] *= currentRadius;
  //   }
  // }

  // return (
  //   <mesh ref={meshRef} geometry={tubeGeometry}>
  //     <meshStandardMaterial color="blue" />
  //   </mesh>
  // );
}
