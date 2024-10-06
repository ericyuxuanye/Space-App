import React, { useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import SystemView from "./SystemView";
import mockdata from "./data.json";
import data from "./planetarydata.json";

import MySideNav from "./Menu";
import { a, useSpring } from "@react-spring/three";
import * as THREE from "three";
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
  const controlsRef = useRef();
  const [target, setTarget] = useState([0, 0, 0]); // Default camera position
  // const { x, y, z } = useSpring({
  //   x: target[0],
  //   y: target[1],
  //   z: target[2],
  //   config: { tension: 170, friction: 26 },
  // });
  const updateTarget = (t) => {
    setTarget(t);
    console.log("target", t);
  };
  console.log(transformedData["HD 181433"]);
  

  return (
    <div>
      {/* <MySideNav classname="sidenav"></MySideNav> */}
      <Canvas
        style={{ background: "black", width: "100vw", height: "100vh" }}
        camera={{
          position: [
            0,
            Math.cos(Math.PI / 4) * 100,
            Math.sin(Math.PI / 4) * 100,
          ],
          fov: 50,
        }} // Set the initial camera position
      >
        <SystemView star={transformedData["HD 181433"]} setTargetPosition={updateTarget} />

        <OrbitControls enablePan={false} target={target} />
      </Canvas>
    </div>
  );
}
