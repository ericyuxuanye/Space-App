import { MersenneTwister19937, real } from "random-js";
import React, { useState } from "react";
import { EARTH_RADIUS_TO_SOLAR_RADIUS, orbitPos } from "./util";
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
  habitability,
  snr,
  setTargetPosition,
  showOrbit,
  orbitCallback,
  minSeparationDiam,
  telescopeDiam,
  isPlanetView,
  returnToSystemView,
}) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const mt = MersenneTwister19937.seed(hashCode(name));
  const theta = real(0, 2 * Math.PI, false)(mt);

  let [xProj, yProj] = orbitPos(theta, semiMajorAxis, eccentricity);

  // xProj *= 10;
  // yProj *= 10;
  const isObservable =
    snr * Math.pow(telescopeDiam, 2) > 5 && telescopeDiam > minSeparationDiam;

  const planetLink = 
  `https://exoplanetarchive.ipac.caltech.edu/overview/${encodeURIComponent(name)}#planet_${name.replace(/\s+/g, "-")}_collapsible`;

  return (
    <>
      <mesh position={[xProj, 0, yProj]}>
        <sphereGeometry
          args={[radius * EARTH_RADIUS_TO_SOLAR_RADIUS, 32, 32]}
        />
        {/* Increased emissiveIntensity for stronger glow */}
        <meshStandardMaterial color="white" />
        <Html position={[0, 0, 0]} center>
          <div
            onMouseOver={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => {
              if (isPlanetView) {
                returnToSystemView();
                orbitCallback(true);
              } else {
                setTargetPosition([xProj, 0, yProj], radius);
                orbitCallback(false);
                setClicked(true); 
              }
            }}
            style={{
              fontSize: "20px",
              color: isObservable ? "#70ff8c" : "#ff8d8d",
              background: "#00000030",
              borderRadius: "0.5em",
              padding: "0.5rem",
              position: "relative",
              width: "250px",
            }}
          >
            {/* {name} */}
            <a
              href={planetLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: isObservable ? "#70ff8c" : "#ff8d8d",
                textDecoration: "none",
              }}
            >
              {name}
            </a>

            {clicked && isPlanetView && (
              <div style={{ marginTop: "0.5rem", fontSize: "16px" }}>
                <div>{`Radius: ${Math.round(radius * 1000) / 1000} Earth radii`}</div>
                <div>{`Semi-Major Axis: ${Math.round(semiMajorAxis * 1000) / 1000} AU`}</div>
                <div>{`Eccentricity: ${Math.round(eccentricity * 1000) / 1000}`}</div>
              </div>
            )}
            
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: "absolute",
                    top: "-50px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "black",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    whiteSpace: "nowrap",
                    zIndex: 100,
                  }}
                  onClick={() => {
                    if (isPlanetView) {
                      returnToSystemView();
                      orbitCallback(true);
                    }
                  }}
                >
                  {isPlanetView ? (
                    <>
                      <div>{"Click to return to system view"}</div>
                    </>
                  ) : (
                    <>
                      <div>{`${name} has estimated habitability ${
                        Math.round(1000 * habitability) / 1000
                      }`}</div>
                      <div>
                        {isObservable
                          ? `A ${telescopeDiam}m diameter HWO is powerful enough to observe ${name}!`
                          : `Unfortunately, a ${telescopeDiam}m HWO isn't powerful enough to observe ${name}.`}
                      </div>
                      <div>{`The HWO needs a diameter of at least ${Math.max(
                        Math.round(10 * Math.pow(5 / snr, 1 / 2)) / 10,
                        Math.round(10 * minSeparationDiam) / 10
                      )} m to be able to observe ${name}.`}</div>
                      <div>{`Click to zoom in and learn more!`}</div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Html>
      </mesh>
      {showOrbit && (
        <OrbitTrail
          theta={theta}
          semiMajorAxis={semiMajorAxis}
          eccentricity={eccentricity}
        />
      )}
    </>
  );
}
