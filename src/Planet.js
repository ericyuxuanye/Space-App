import React from "react";

// assume semimajor axis is same unit as radius
export default function Planet({
  name,
  radius,
  semimajorAxis,
  eccentricity,
}) {
  const theta = 0;

  const r =
    (semimajorAxis * (1 - Math.pow(eccentricity, 2))) /
    (1 + eccentricity * Math.cos(theta));
  const xProj = r * Math.cos(theta);
  const yProj = r * Math.sin(theta);

  return (
    <mesh position={[xProj, yProj, 0]}>
      <sphereGeometry args={[radius, 32, 32]} />
      {/* Increased emissiveIntensity for stronger glow */}
      <meshStandardMaterial
      // color="black"
      />
    </mesh>
  );
}
