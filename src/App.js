import React, { useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Sphere } from "@react-three/drei";
import SystemView from "./SystemView";
import mockdata from "./data.json";
import data from "./planetarydata.json";

import MySideNav from "./Menu";
import "./sidenav.css";
import EarthView from "./EarthView";
import EarthView2 from "./EarthView2";
import EarthOrbitView from "./EarthOrbitView";
import SystemList from "./SystemList";

function transformPlanetData(planetName, planetData) {
  return {
    name: planetName,
    radius: planetData["Exoplanet Radius"],
    semiMajorAxis: planetData["Orbital Semi-Major Axis"],
    eccentricity: planetData["Eccentricity"],
    snr: planetData["SNR"],
  };
}

function transformStarData(starData) {
  const planets = [];
  for (let planetName of Object.keys(starData["Planets"])) {
    planets.push(
      transformPlanetData(planetName, starData["Planets"][planetName])
    );
  }
  // if (starData["Host Star Name"] == "11 Com") {
  //   console.log(starData["Spectral Type"]);
  // }

  return {
    name: starData["Host Star Name"],
    radius: starData["Stellar Radius"],
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

export default function App() {
  const [systemName, setSystemName] = useState("");

  return (
    <div>
      {systemName === "" ? (
        <SystemList
          stars={transformedData}
          getSystemScore={(starData) => {
            let maxSNR = -1;
            for (let planetName of Object.keys(starData.planets)) {
              if (starData.planets[planetName].snr > maxSNR) {
                maxSNR = starData.planets[planetName].snr;
              }
            }
            return maxSNR;
          }}
          systemScoreName={"signal-noise ratio"}
          setSystemName={setSystemName}
        />
      ) : (
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
          <SystemView star={transformedData["24 Sex"]} />
        </Canvas>
      )}
    </div>
  );
}
