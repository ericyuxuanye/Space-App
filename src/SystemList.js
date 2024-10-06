import React from "react";
import { starColor } from "./util";
import "./SystemList.css";

export default function SystemList({
  stars,
  getSystemScore,
  systemScoreName,
  setSystemName,
  telescopeDiam,
}) {
  // sort in descending order
  let systemList = [];
  for (let starName of Object.keys(stars)) {
    for (let i = 0; i < stars[starName].planets.length; i++) {
      if (stars[starName].planets[i].snr * Math.pow(telescopeDiam, 4) > 5) {
        systemList.push([
          getSystemScore(stars[starName]),
          starName,
          starColor(stars[starName].starClass),
        ]);
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
        height: "30vh",
        background: "#1a1a1a",
        color: "#6D87A8",
        zIndex: "10",
        width: "30vw",
        overflowY: "auto",
        border: "1px solid black",
      }}
    >
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
            <div style={{ fontWeight: 500, fontSize: "2rem", color: color }}>
              {name}
            </div>
            <div style={{ marginTop: "0.25em" }}>
              Top planet has {systemScoreName}{" "}
              <span>{Math.round(100 * score) / 100}</span>
            </div>
            <div
              style={{ marginTop: "0.25em", fontWeight: 500 }}
              className={"underline-hover"}
              onClick={() => setSystemName(name)}
            >
              Learn more about this system!
            </div>
          </div>
        );
      })}
    </div>
  );
}
