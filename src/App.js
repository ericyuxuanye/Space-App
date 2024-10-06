import React, { useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Sphere } from "@react-three/drei";
import SystemView from "./SystemView";
import mockdata from "./data.json";
import data from "./planetarydata.json";

import MySideNav from "./Menu";
import "./sidenav.css";
// import EarthView from "./EarthView";
// import EarthView2 from "./EarthView2";
import EarthOrbitView from "./EarthOrbitView";

function transformPlanetData(planetName, planetData) {
  return {
    name: planetName,
    radius: planetData["Exoplanet Radius"],
    semiMajorAxis: planetData["Orbital Semi-Major Axis"],
    eccentricity: planetData["Eccentricity"],
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

const fakeStarData = {
  star1: {
    starClass: "G",
    ra: 0.5,
    dec: 0.5,
    distSun: 5,
    planets: [{}],
  },
  star2: {
    starClass: "G",
    ra: 1,
    dec: 0.5,
    distSun: 3,
    planets: [{}],
  },
  star3: {
    starClass: "K",
    ra: 1,
    dec: 2,
    distSun: 6,
    planets: [{}],
  },
};

export default function App() {
  return (
    <div>
      {/* <MySideNav classname="sidenav"></MySideNav> */}
      <Canvas
        style={{ background: "black", width: "100vw", height: "100vh" }}
        // frameloop="demand"
      >
        {/* <SystemView star={transformedData["24 Sex"]} /> */}
        <EarthOrbitView
          stars={fakeStarData}
          isPlanetObservableFunc={() => true}
        />
      </Canvas>
    </div>
  );
}
