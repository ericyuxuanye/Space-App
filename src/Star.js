import { Html } from "@react-three/drei";
import React from "react";
import { EARTH_RADIUS_TO_SOLAR_RADIUS, starColor } from "./util";

export default function Star({ name, radius, starClass, habitableZone, setTargetPosition, orbitCallback }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 32, 32]} />
      {/* Increased emissiveIntensity for stronger glow */}
      <pointLight color={starColor(starClass)} intensity={1} decay={0} />
      <meshStandardMaterial
        emissive={starColor(starClass)}
        emissiveIntensity={4}
        color="black"
      />
      <Html position={[0, -0.5, 0]} center>
        <div
          style={{
            fontSize: "20px",
            color: starColor(starClass),
            padding: "0.5em",
            background: "#00000060",
            borderRadius: "0.5em",
          }}
          onClick={() => {
            setTargetPosition();
            orbitCallback(true);
          }}
        >
          {name}
        </div>
      </Html>
    </mesh>
  );
}
