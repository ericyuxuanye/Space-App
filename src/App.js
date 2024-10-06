import React, { useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Sphere } from "@react-three/drei";
import SystemView from "./SystemView";
import mockdata from "./data.json";
import data from "./planetarydata.json";

import MySideNav from "./Menu";
import "./sidenav.css";

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
    // add more fields here
  };
}

const transformedData = {};
for (let starName of Object.keys(data)) {
  transformedData[starName] = transformStarData(data[starName]);
}

export default function App() {
  return (
    <div>
      {/* <MySideNav classname="sidenav"></MySideNav> */}
    <Canvas
      style={{ background: "black", width: "100vw", height: "100vh" }}
      //camera={{ position: [0, Math.cos(Math.PI / 4) * 100, Math.sin(Math.PI/4) * 100], fov: 50 }}  // Set the initial camera position
    >
      <SystemView star={transformedData["24 Sex"]} />
    </Canvas>
    </div>
  );
}
