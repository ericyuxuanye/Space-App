import { MersenneTwister19937, real } from "random-js";
import React from "react";
import { orbitPos } from "./util";
import OrbitTrail from "./OrbitTrail";
import { Html } from "@react-three/drei";

const hashCode = function (s) {
  var hash = 0,
    i,
    chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// assume semimajor axis is same unit as radius
export default function Planet({ name, radius, semiMajorAxis, eccentricity }) {
  const mt = MersenneTwister19937.seed(hashCode(name));
  const theta = real(0, 2 * Math.PI, false)(mt);
  console.log(theta);

  let [xProj, yProj] = orbitPos(theta, semiMajorAxis, eccentricity);

  xProj *= 10;
  yProj *= 10;

  return (
    <>
      <mesh position={[xProj, 0, yProj]}>
        <sphereGeometry args={[radius, 32, 32]} />
        {/* Increased emissiveIntensity for stronger glow */}
        <meshStandardMaterial color="white" />
        <Html position={[0, -0.5, 0]} center>
          <div
            onClick={() => console.log(name + " clicked")}
            style={{
              fontSize: "20px",
              color: "yellow",
              padding: "0.5em",
              background: "#00000030",
              borderRadius: "0.5em",
            }}
          >
            {name}
          </div>
        </Html>
      </mesh>
      <OrbitTrail
        theta={theta}
        semiMajorAxis={semiMajorAxis}
        eccentricity={eccentricity}
      />
    </>
  );
}
