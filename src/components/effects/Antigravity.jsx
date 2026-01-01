// /* eslint-disable react/no-unknown-property */
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { useMemo, useRef } from "react";
// import * as THREE from "three";

// const AntigravityInner = ({
//   count = 300,
//   magnetRadius = 10,
//   ringRadius = 10,
//   particleSize = 2,
//   lerpSpeed = 0.1,
//   color = "#AF99F6",
//   particleVariance = 1,
//   rotationSpeed = 0.4,
//   depthFactor = 1,
//   pulseSpeed = 3,
//   particleShape = "capsule",
//   hoverOnly = false // 🔥 NEW PROP
// }) => {
//   const meshRef = useRef(null);
//   const { viewport } = useThree();
//   const dummy = useMemo(() => new THREE.Object3D(), []);

//   const particles = useMemo(() => {
//     const temp = [];
//     for (let i = 0; i < count; i++) {
//       temp.push({
//         t: Math.random() * 100,
//         speed: 0.01 + Math.random() / 200,
//         cx: 0,
//         cy: 0,
//         cz: Math.random() * 10,
//         mx: Math.random() * viewport.width - viewport.width / 2,
//         my: Math.random() * viewport.height - viewport.height / 2
//       });
//     }
//     return temp;
//   }, [count, viewport.width, viewport.height]);

//   useFrame(state => {
//     const mesh = meshRef.current;
//     if (!mesh) return;

//     const { pointer } = state;
//     const targetX = pointer.x * viewport.width;
//     const targetY = pointer.y * viewport.height;
//     const time = state.clock.elapsedTime;

//     particles.forEach((p, i) => {
//       p.t += p.speed;

//       const dist = Math.hypot(p.mx - targetX, p.my - targetY);

//       // circular motion near cursor
//       if (dist < magnetRadius) {
//         const angle =
//           Math.atan2(p.my - targetY, p.mx - targetX) +
//           time * rotationSpeed;

//         p.mx = targetX + Math.cos(angle) * ringRadius;
//         p.my = targetY + Math.sin(angle) * ringRadius;
//       }

//       p.cx += (p.mx - p.cx) * lerpSpeed;
//       p.cy += (p.my - p.cy) * lerpSpeed;

//       dummy.position.set(p.cx, p.cy, p.cz * depthFactor);

//       let scale = particleSize;

//       // 🔥 CURSOR-ONLY VISIBILITY
//       if (hoverOnly) {
//         scale = 0;
//         if (dist < magnetRadius + 1) {
//           const ringDist = Math.abs(dist - ringRadius);
//           let intensity = 1 - ringDist / 6;
//           intensity = Math.max(0, Math.min(1, intensity));

//           scale =
//             intensity *
//             particleSize *
//             (0.8 + Math.sin(p.t * pulseSpeed) * 0.2 * particleVariance);
//         }
//       }

//       dummy.scale.set(scale, scale, scale);
//       dummy.updateMatrix();
//       mesh.setMatrixAt(i, dummy.matrix);
//     });

//     mesh.instanceMatrix.needsUpdate = true;
//   });

//   return (
//     <instancedMesh ref={meshRef} args={[null, null, count]}>
//       {particleShape === "capsule" && (
//         <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
//       )}
//       {particleShape === "sphere" && (
//         <sphereGeometry args={[0.2, 16, 16]} />
//       )}
//       <meshBasicMaterial color={color} />
//     </instancedMesh>
//   );
// };

// const Antigravity = ({ hoverOnly = false, ...props }) => (
//   <Canvas camera={{ position: [0, 0, 30], fov: 35 }}>
//     <AntigravityInner hoverOnly={hoverOnly} {...props} />
//   </Canvas>
// );

// export default Antigravity;
