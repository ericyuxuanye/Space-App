import { MersenneTwister19937, real } from "random-js";
import React from "react";

const hashCode = function(s) {
  var hash = 0,
    i, chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}



// assume semimajor axis is same unit as radius
export default function Planet({ name, radius, semiMajorAxis, eccentricity }) {
  const mt = MersenneTwister19937.seed(hashCode(name));
  const theta = real(0, 2 * Math.PI, false)(mt);
  console.log(theta);

  const r =
    (10 * semiMajorAxis * (1 - Math.pow(eccentricity, 2))) /
    (1 + eccentricity * Math.cos(theta));
  // console.log(r);
  const xProj = r * Math.cos(theta);
  const yProj = r * Math.sin(theta);

  // console.log(xProj, yProj);

  return (
    <mesh position={[xProj, yProj, 0]}>
      <sphereGeometry args={[radius, 32, 32]} />
      {/* Increased emissiveIntensity for stronger glow */}
      <meshStandardMaterial color="white" />
    </mesh>
  );
}
