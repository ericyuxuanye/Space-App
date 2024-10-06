import React, {
  useRef,
  useEffect,
  Suspense,
  useLayoutEffect,
  useMemo,
} from "react";
import SimpleStar from "./SimpleStar";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import {
  Html,
  OrbitControls,
  PerspectiveCamera,
  PointerLockControls,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { SphereGeometry } from "three";
import * as THREE from "three";
import { convertRADecToXYZ } from "./SimpleStar";
import { starColor } from "./util";

function hasObservablePlanet(star, isPlanetObservableFunc) {
  for (const planetData of Object.values(star.planets)) {
    if (isPlanetObservableFunc(planetData)) {
      return true;
    }
  }
  return false;
}

const CameraControls = () => {
  // const controlsRef = useRef();
  // const cameraRef = useRef();

  // // Custom camera update function
  // const updateCameraOrbit = () => {
  //   const forward = new THREE.Vector3();
  //   cameraRef.current.getWorldDirection(forward);
  //   controlsRef.current.target.copy(cameraRef.current.position).add(forward);
  // };

  // useEffect(() => {

  //   const controls = controlsRef.current;
  //   if (controls) {
  //     // controls.addEventListener('end', updateCameraOrbit);
  //     // return () => controls.removeEventListener('end', updateCameraOrbit);
  //     console.log(controls)
  //     controls.current.rotateSpeed=-0.5;
  //   }
  // }, []);
  return (
    <>
      <perspectiveCamera makeDefault fov={60} position={[0, 0, 0]} />
      <OrbitControls
        target={[0, 0, 0]}
        minDistance={0.01}
        maxDistance={0.01}
        enablePan={false}
      />
    </>
  );
};

export default function EarthOrbitView({ stars, isPlanetObservableFunc }) {
  const ref = useRef();
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  // const ref = useLayoutEffect((imesh) => {
  //   imesh.setMatrixAt(0, new THREE.Matrix4().makeTranslation(0, 0, 0));
  // });
  const geometry = new SphereGeometry(0.5, 32, 32);
  const goodStars = Object.values(stars).filter((star) => {
    return hasObservablePlanet(star, isPlanetObservableFunc);
  });
  const intanceMatrix = useMemo(() => new THREE.Matrix4(), []);
  const onHover = (event) => {
    console.log(event);
    setStarName(goodStars[event.instanceId]["name"]);
    setStarPosition(event.point);
  };
  const [starName, setStarName] = React.useState(null);
  const [starPosition, setStarPosition] = React.useState(null);
  useEffect(() => {
    for (let i = 0; i < goodStars.length; i++) {
      const star = goodStars[i];
      const dummy = new THREE.Object3D();
      dummy.position.set(
        ...convertRADecToXYZ(
          star["Proper Motion(ra)"],
          star["Proper Motion(dec)"],
          1000
        )
      );
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
      ref.current.setColorAt(i, new THREE.Color(starColor(star.starClass)));
    }
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.instanceColor.needsUpdate = true;
  }, [goodStars]);
  // const starLocs = goodStars.map((star) => {
  //   return convertRADecToXYZ(star["Proper Motion(ra)"], star["Proper Motion(dec)"], 1000);
  // });
  // console.log(starLocs);
  return (
    <>
      <ambientLight intensity={100} />
      {/* {Object.keys(goodStars).map((starName, idx) => {
        const starData = goodStars[starName];
        return <SimpleStar key={starName} name={starData.name} ra={starData["Proper Motion(ra)"]} dec={starData["Proper Motion(dec)"]} distSun={1000}/>;
      })} */}
      <instancedMesh
        ref={ref}
        args={[null, null, goodStars.length]}
        onPointerEnter={onHover}
        onPointerLeave={() => setStarName(null)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial />
      </instancedMesh>
      {starName && (
        <Html position={starPosition}>
          <div
            style={{
              fontSize: "20px",
              color: "white",
              padding: "0.5em",
              background: "#00000030",
              borderRadius: "0.5em",
            }}
          >
            {starName}
          </div>
        </Html>
      )}

      {/* <CameraControls /> */}
      <EffectComposer disableNormalPass>
        <Bloom
          mipmapBlur
          luminanceThreshold={1} // Lower threshold to affect more of the scene
          intensity={1.6} // Increased bloom intensity
          levels={9}
        />
        <ToneMapping />
      </EffectComposer>
      <CameraControls />
    </>
  );
}
