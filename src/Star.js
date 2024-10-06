import { Html } from "@react-three/drei";
import React from "react";

function starColor(starClass) {
  switch (starClass) {
    case "O":
      return "#98adf9";
    case "B":
      return "#9fb4ed";
    case "A":
      return "#bbc6ea";
    case "F":
      return "#eaeaef";
    case "G":
      return "#ede2da";
    case "K":
      return "#ecc498";
    case "M":
      return "#f7c76c";
    default:
      return "#ede2da";   // this is fairly generic color iirc
  }
}

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
            background: "#00000030",
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
