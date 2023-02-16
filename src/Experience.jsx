import * as THREE from "three";
import { OrbitControls, useTexture } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useEffect, useMemo } from "react";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { useFrame } from "@react-three/fiber";

export default function Experience() {
  const earth = useTexture("./assets/earth.jpg");
  const pointGeo = new THREE.SphereGeometry(0.02, 20, 20);
  const pointMat = new THREE.MeshBasicMaterial({ color: "red" });
  const lineMat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { value: 0 },
    },
  });

  const coordinates = [
    {
      lat: 41.0082,
      lng: -28.9784,
    },
    {
      lat: 26.8206,
      lng: -49.0025,
    },
    {
      lat: 19.683139,
      lng: 155.539693,
    },
    {
      lat: 34.0522,
      lng: 118.2437,
    },
    {
      lat: 37.5753,
      lng: -36.9228,
    },
  ];

  const getCoordinates = ({ lat, lng }) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = Math.sin(phi) * Math.cos(theta);
    const z = Math.sin(phi) * Math.sin(theta);
    const y = Math.cos(phi);

    return { x, y, z };
  };

  const getCurve = (p1, p2) => {
    const v1 = new THREE.Vector3(p1.x, p1.y, p1.z);
    const v2 = new THREE.Vector3(p2.x, p2.y, p2.z);

    const curvePoints = [];

    for (let i = 0; i < 20; i++) {
      let p = new THREE.Vector3().lerpVectors(v1, v2, i / 19);
      p.normalize();

      p.multiplyScalar(1 + 0.1 * Math.sin(Math.PI * (i / 20)));
      curvePoints.push(p);
    }
    const path = new THREE.CatmullRomCurve3(curvePoints);
    return path;
  };

  const positionsAndTubes = useMemo(() => {
    const positions = [];
    const tubes = [];

    coordinates.forEach((item, i, arr) => {
      const pos = getCoordinates(item);
      const pos2 = i != arr.length - 1 ? getCoordinates(arr[i + 1]) : null;
      //   const randDelay = Math.random() * 3;
      if (pos2) {
        // console.log(randDelay);
        tubes.push(
          <mesh
            key={i}
            material={lineMat}
            material-uniforms={{
              time: { value: 0 },
              lineDelay: { value: 3 }, //TODO: make this random for each one
            }}
          >
            <tubeGeometry args={[getCurve(pos, pos2), 20, 0.005, 8, false]} />
          </mesh>
        );
      }

      positions.push(pos);
    });

    return { positions, tubes };
  }, [coordinates]);

  useFrame(({ clock }) => {
    lineMat.uniforms.time.value = clock.elapsedTime;
  });

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <mesh>
        <icosahedronGeometry args={[1, 10]} />
        <meshStandardMaterial map={earth} />
      </mesh>
      {positionsAndTubes.positions.map((pos, i) => (
        <mesh
          geometry={pointGeo}
          material={pointMat}
          position={[pos.x, pos.y, pos.z]}
          key={i}
        />
      ))}
      {positionsAndTubes.tubes}
    </>
  );
}
