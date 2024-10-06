import { MersenneTwister19937, real } from "random-js";
import React, { useState } from "react";
import { orbitPos } from "./util";
import OrbitTrail from "./OrbitTrail";
import { Html } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";

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
export default function Planet({
  name,
  radius,
  semiMajorAxis,
  eccentricity,
  setTargetPosition
}) {
  const [hovered, setHovered] = useState(false);
  const mt = MersenneTwister19937.seed(hashCode(name));
  const theta = real(0, 2 * Math.PI, false)(mt);

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
            onMouseOver={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setTargetPosition([xProj, 0, yProj])}
            style={{
              fontSize: "20px",
              color: "yellow",
              padding: "0.5em",
              background: "#00000030",
              borderRadius: "0.5em",
              position: "relative",
            }}
          >
            {name}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: "absolute",
                    top: "30px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "black",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div>
                    {`${name} has radius ${radius}x Earth's`}
                  </div>
                  <div>
                    {`Click to learn more`}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
