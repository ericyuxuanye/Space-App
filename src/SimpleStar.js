import React from "react";
import { starColor } from "./util";
import { Html } from "@react-three/drei";

export function convertRADecToXYZ(ra, dec, distSun) {
  const radRA = (ra / 24) * 2 * Math.PI; // Convert hours to radians
  const radDEC = (dec / 180) * Math.PI; // Convert degrees to radians
  const x = distSun * Math.cos(radDEC) * Math.cos(radRA);
  const y = distSun * Math.cos(radDEC) * Math.sin(radRA);
  const z = distSun * Math.sin(radDEC);
  return [x, y, z];
}

export default function SimpleStar({ name, starClass, ra, dec, distSun }) {
  return (
    <>
    <mesh position={convertRADecToXYZ(ra, dec, distSun)}>
      <sphereGeometry args={[0.1, 32, 32]} />
      {/* Increased emissiveIntensity for stronger glow */}
      <pointLight color={starColor(starClass)} intensity={1} decay={0} />
      <meshStandardMaterial
        emissive={starColor(starClass)}
        emissiveIntensity={4}
        color="black"
      />
      </mesh>
      <Html position={[0, -0.5, 0]} center>
        <div
          style={{
            fontSize: "15px",
            userSelect: "none",
            color: starColor(starClass),
            padding: "0.5em",
            background: "#00000030",
            borderRadius: "0.5em",
            zIndex: "10",
          }}
          onClick={() => {
          }}
        >
          {name}
        </div>
      </Html>
      </>
  );
}
