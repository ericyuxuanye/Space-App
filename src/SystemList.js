import React from "react";
import { starColor } from "./util";
import "./SystemList.css";
import { Center } from "@react-three/drei";

function DiameterScrollbar({ telescopeDiam, setTelescopeDiam }) {
  const handleChange = (e) => {
    setTelescopeDiam(Number(e.target.value));
  };

  return (
    <div style={{ zIndex: 999, color: "white" }}>
      <input
        type="range"
        id="telescopeDiameter"
        min={5}
        max={15}
        step={0.1}
        value={telescopeDiam}
        onChange={handleChange}
      />
      <div>{`Telescope diameter: ${telescopeDiam} m`}</div>
    </div>
  );
}


export default function SystemList({
  stars,
  getSystemScore,
  systemScoreName,
  setSystemName,
  telescopeDiam,
  setTelescopeDiam,
}) {
  // sort in descending order
  let systemList = [];
  for (let starName of Object.keys(stars)) {
    for (let i = 0; i < stars[starName].planets.length; i++) {
      const currPlanet = stars[starName].planets[i];

      if (
        currPlanet.snr * Math.pow(telescopeDiam, 2) > 5 &&
        telescopeDiam > currPlanet.minSeparationDiam &&
        Math.abs(
          (currPlanet.semiMajorAxis *
            (1 - Math.pow(currPlanet.eccentricity, 2))) /
            (1 - currPlanet.eccentricity) -
            (stars[starName].habitableMin + stars[starName].habitableMax) / 2
        ) <
          (stars[starName].habitableMax - stars[starName].habitableMin) / 2
      ) {
        systemList.push([
          getSystemScore(stars[starName]),
          starName,
          starColor(stars[starName].starClass),
        ]);
        break;
      }
    }
  }
  systemList.sort((a, b) => b[0] - a[0]);

  return (
    <div
      style={{
        padding: "1em",
        borderRadius: "0.5rem",
        margin: "1rem",
        height: "90vh",
        background: "#1a1a1a",
        color: "#6D87A8",
        width: "30vw",
        overflowY: "auto",
        border: "1px solid black",
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "30",
      }}
    >
      <div style={{ marginLeft: "0.5em", marginRight: "0.5em" }}>
        <div
          style={{
            fontWeight: 500,
            fontSize: "1.5rem",
          }}
        >
          Stars with HWO-observable exoplanets
        </div>
        <div>
          ranked by their habitability
        </div>
        <DiameterScrollbar
          telescopeDiam={telescopeDiam}
          setTelescopeDiam={setTelescopeDiam}
        />
      </div>
      <h2 style={{ textAlign: "center" }}>Top Habitable Systems</h2>
      {systemList.slice(0, 100).map(([score, name, color], idx) => {
        return (
          <div
            style={{
              padding: "1em",
              margin: "0.5em",
              borderRadius: "0.5rem",
              border: "1px solid black",
            }}
            key={idx}
          >
            <div>
              <span
                style={{
                  fontWeight: 500,
                  fontSize: "1.5rem",
                  color: color,
                  marginRight: "1rem",
                }}
                className={"underline-hover"}
                onClick={() => setSystemName(name)}
              >
                {name}
              </span>
              {`(hab. ${Math.round(100 * score) / 100})`}
            </div>
          </div>
        );
      })}
    </div>
  );
}
