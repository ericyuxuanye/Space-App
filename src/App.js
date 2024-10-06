import React, { Suspense, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Sphere,
  useProgress,
  Html,
} from "@react-three/drei";
import SystemView from "./SystemView";
import mockdata from "./data.json";
import data from "./planetarydata2.json";

import MySideNav from "./Menu";
import "./sidenav.css";
import EarthView from "./EarthView";
import EarthView2 from "./EarthView2";
import EarthOrbitView from "./EarthOrbitView";
import SystemList from "./SystemList";
import { NodePath } from "@babel/core";

function transformPlanetData(
  planetName,
  planetData,
  sunDistanceToSystem,
  habitableMin,
  habitableMax
) {
  return {
    name: planetName,
    radius: planetData["Exoplanet Radius"],
    semiMajorAxis: planetData["Orbital Semi-Major Axis"],
    eccentricity: planetData["Eccentricity"],
    snr: planetData["SNR"],
    minSeparationDiam:
      (0.4 * sunDistanceToSystem) / (planetData["Limiting_Distance"] + 1e-5),
    habitability: Math.exp(
      -Math.pow(
        ((planetData["Orbital Semi-Major Axis"] *
          (1 - Math.pow(planetData["Eccentricity"], 2)) -
          (habitableMin + habitableMax) / 2) /
          (habitableMax - habitableMin)) *
          2,
        2
      )
    ),
  };
}

function transformStarData(starData) {
  const planets = [];
  for (let planetName of Object.keys(starData["Planets"])) {
    const planetData = starData["Planets"][planetName];
    planets.push(
      transformPlanetData(
        planetName,
        planetData,
        starData["Distance"],
        starData["Habitable-Zone-lower"],
        starData["Habitable-Zone-upper"]
      )
    );
  }
  // if (starData["Host Star Name"] == "11 Com") {
  //   console.log(starData["Spectral Type"]);
  // }

  return {
    name: starData["Host Star Name"],
    radius: starData["Stellar Radius"],
    habitableMin: starData["Habitable-Zone-lower"],
    habitableMax: starData["Habitable-Zone-upper"],
    starClass: (starData["Spectral Type"] ?? "G").charAt(0),
    planets: planets,
    ...starData,
    // add more fields here
  };
}

const transformedData = {};
for (let starName of Object.keys(data)) {
  transformedData[starName] = transformStarData(data[starName]);
}

function getStarSNRScore(starData) {
  let maxSNR = -1;
  for (let planetName of Object.keys(starData.planets)) {
    if (starData.planets[planetName].snr > maxSNR) {
      maxSNR = starData.planets[planetName].snr;
    }
  }
  return maxSNR;
}

function getStarHabitabilityScore(starData) {
  let maxHab = -1;
  for (let planetName of Object.keys(starData.planets)) {
    if (starData.planets[planetName].habitability > maxHab) {
      maxHab = starData.planets[planetName].habitability;
    }
  }
  return maxHab;
}

function Loader() {
  const { progress } = useProgress();
  const { invalidate, gl } = useThree();

  useFrame(() => {
    invalidate();
  });

  return (
    <Html center>
      <div style={{ color: "white" }}>Loading... {Math.floor(progress)}%</div>
    </Html>
  );
}

function DiameterScrollbar({ diameter, setDiameter }) {
  const handleChange = (e) => {
    setDiameter(Number(e.target.value));
  };

  return (
    <div>
      <input
        type="range"
        id="telescopeDiameter"
        min={5}
        max={15}
        step={0.1}
        value={diameter}
        onChange={handleChange}
      />
      <div>{`Telescope diameter: ${diameter} m`}</div>
    </div>
  );
}

export default function App() {
  const [systemName, setSystemName] = useState("");
  const [telescopeDiam, setTelescopeDiam] = useState(6);

  return (
    <div>
      {systemName === "" ? (
        <>
          <SystemList
            stars={transformedData}
            getSystemScore={getStarHabitabilityScore}
            systemScoreName={"habitability"}
            setSystemName={setSystemName}
            telescopeDiam={telescopeDiam}
          />
          <div
            style={{
              position: "absolute",
              top: "1.5rem",
              width: "95vw",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <DiameterScrollbar
              diameter={telescopeDiam}
              setDiameter={setTelescopeDiam}
            />
          </div>
        </>
      ) : (
        <>
          <Canvas
            style={{
              background: "black",
              width: "100vw",
              height: "100vh",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            frameloop="demand"
          >
            <Suspense fallback={<Loader />}>
              <SystemView
                star={transformedData[systemName]}
                telescopeDiam={telescopeDiam}
              />
            </Suspense>
          </Canvas>
          <div
            style={{
              position: "absolute",
              bottom: "1.5rem",
              width: "95vw",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "0.25rem",
            }}
          >
            <div
              style={{
                background: "black",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                color: "white",
              }}
              onClick={() => {
                setSystemName("");
              }}
            >
              Return to Milky Way view
            </div>
          </div>
        </>
      )}
    </div>
  );
}
