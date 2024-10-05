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
      throw Error("fuck you not valid");
  }
}

export default function Star({ name, radius, starClass, habitableZone }) {
  console.log(name, radius, starClass, habitableZone);
  
  return (
    <mesh>
      <sphereGeometry args={[radius, 32, 32]} />
      {/* Increased emissiveIntensity for stronger glow */}
      <pointLight color={starColor(starClass)} intensity={100} decay={1} />
      <meshStandardMaterial
        emissive={starColor(starClass)}
        emissiveIntensity={4}
        color="black"
      />
    </mesh>
  );
}
