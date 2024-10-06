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

export default function EarthOrbitView({
  stars,
  isPlanetObservableFunc,
  setSystemName,
  telescopeDiam,
}) {
  const ref = useRef();
  const [starName, setStarName] = React.useState(null);
  const [starPosition, setStarPosition] = React.useState(null);
  const { invalidate, gl } = useThree();

  const goodStars = [];
  const goodStarNames = new Set();
  for (let starName of Object.keys(stars)) {
    for (let i = 0; i < stars[starName].planets.length; i++) {
      const currPlanet = stars[starName].planets[i];
      if (
        currPlanet.snr * Math.pow(telescopeDiam, 2) > 5 &&
        telescopeDiam > currPlanet.minSeparationDiam
      ) {
        goodStars.push(stars[starName]);
        goodStarNames.add(starName);
        break;
      }
    }
  }

  const goodHabitableStarNames = new Set();
  for (let starName of goodStarNames.values()) {
    for (let i = 0; i < stars[starName].planets.length; i++) {
      const currPlanet = stars[starName].planets[i];
      if (
        Math.abs(
          (currPlanet.semiMajorAxis *
            (1 - Math.pow(currPlanet.eccentricity, 2))) /
            (1 - currPlanet.eccentricity) -
            (stars[starName].habitableMin + stars[starName].habitableMax) / 2
        ) <
        (stars[starName].habitableMax - stars[starName].habitableMin) / 2
      ) {
        goodHabitableStarNames.add(starName);
        break;
      }
    }
  }

  const onHover = (event) => {
    console.log(event);
    try {
      setStarName(goodStars[event.instanceId]["name"]);
      setStarPosition(event.point);
    }
    catch (e) {
      console.log(e);
    }
  };
  // useEffect(() => {
  //   for (let i = 0; i < goodStars.length; i++) {
  //     const star = goodStars[i];
  //     const dummy = new THREE.Object3D();
  //     dummy.position.set(
  //       ...convertRADecToXYZ(
  //         star["Proper Motion(ra)"],
  //         star["Proper Motion(dec)"],
  //         1000
  //       )
  //     );
  //     dummy.updateMatrix();
  //     ref.current.setMatrixAt(i, dummy.matrix);
  //     if (goodHabitableStarIdxs.has(i)) {
  //       ref.current.setColorAt(i, new THREE.Color("#a2ffb5"));
  //     } else {
  //       ref.current.setColorAt(i, new THREE.Color(starColor(star.starClass)));
  //     }
  //   }
  //   ref.current.instanceMatrix.needsUpdate = true;
  //   ref.current.instanceColor.needsUpdate = true;
  // }, [goodStars]);

  useEffect(() => {
    let i = 0;
    for (let starName of Object.keys(stars)) {
      const star = stars[starName];
      const dummy = new THREE.Object3D();
      dummy.position.set(
        ...convertRADecToXYZ(
          star["Proper Motion(ra)"],
          star["Proper Motion(dec)"],
          1000 // change?
        )
      );
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
      i += 1;
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);

  useEffect(() => {
    console.log(telescopeDiam);
    let i = 0;
    for (let starName of Object.keys(stars)) {
      const star = stars[starName];
      if (goodHabitableStarNames.has(starName)) {
        ref.current.setColorAt(i, new THREE.Color("#a2ffb5"));
      } else if (goodStarNames.has(starName)) {
        ref.current.setColorAt(i, new THREE.Color(starColor(star.starClass)));
      } else {
        ref.current.setColorAt(i, new THREE.Color("#000000"));
      }
      i += 1;
    }
    ref.current.instanceColor.needsUpdate = true;
    console.log(ref);

    // invalidate();
  }, [telescopeDiam]);

  // const starLocs = goodStars.map((star) => {
  //   return convertRADecToXYZ(star["Proper Motion(ra)"], star["Proper Motion(dec)"], 1000);
  // });
  // console.log(starLocs);
  return (
    <>
      <ambientLight intensity={60} />
      <instancedMesh
        ref={ref}
        args={[null, null, Object.keys(stars).length]}
        onPointerEnter={onHover}
        onClick={() => starName && setSystemName(starName)}
        // onPointerLeave={() => setStarName(null)}
      >
        <sphereGeometry args={[2, 32, 32]} />
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
            onClick={() => setSystemName(starName)}
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
