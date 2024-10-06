import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SystemView from "./SystemView";
import data from "./data.json";
import Sidebar, { SidebarItem } from "./Sidebar";
import './App.css';

export default function App() {
  return (
    <main className="app-container">
      {/* Sidebar */}
      <Sidebar>
        <SidebarItem text="Dashboard" alert />
        <SidebarItem text="Settings" />
        <SidebarItem text="Profile" />
      </Sidebar>

      {/* Canvas area */}
      <div className="canvas-container">
        <Canvas
          style={{ background: "black", width: "100%", height: "100vh" }}
          camera={{ fov: 50, position: [0, Math.cos(Math.PI / 4) * 100, Math.sin(Math.PI / 4) * 100] }}
        >
          <SystemView star={data.Sun} />
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
    </main>
  );
}
