// Voxel / toy-3D building blocks for the Pixelwelt 3D layer (claudebyseb "Vorstand" table look).
// Everything is plain three.js meshes driven by the Remotion frame, rendered with @remotion/three.
import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { continueRender, delayRender } from "remotion";

export const useFontsReady = (fonts: string[]) => {
  const [ready, setReady] = React.useState(false);
  const [handle] = React.useState(() => delayRender("fonts for canvas textures"));
  React.useEffect(() => {
    Promise.all(fonts.map((f) => document.fonts.load(f))).then(() => {
      setReady(true);
      continueRender(handle);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ready;
};

export const canvasTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, pixel = false) => {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const c = cv.getContext("2d")!;
  draw(c);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  if (pixel) {
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
  } else tex.anisotropy = 8;
  return tex;
};

export const roundRect = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
};

// Name plate like "MARKETING" / "FINANZEN" on the table edge.
export const plateTex = (text: string, color: string, bg = "#F6EEDC") =>
  canvasTex(512, 128, (c) => {
    c.fillStyle = "#1A1410";
    roundRect(c, 0, 0, 512, 128, 18);
    c.fill();
    c.fillStyle = bg;
    roundRect(c, 8, 8, 496, 112, 12);
    c.fill();
    c.fillStyle = color;
    c.fillRect(8, 8, 22, 112);
    c.fillRect(482, 8, 22, 112);
    c.fillStyle = color;
    c.font = "900 70px Rubik";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(text, 256, 68);
  });

export const CameraRig: React.FC<{ pos: [number, number, number]; look: [number, number, number]; fov?: number }> = ({ pos, look, fov = 46 }) => {
  const { camera } = useThree();
  camera.position.set(...pos);
  (camera as THREE.PerspectiveCamera).fov = fov;
  (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(...look);
  return null;
};

type V3 = [number, number, number];

// A rounded-ish "toy" box: box plus a slightly lighter top slab, flat shaded.
export const ToyBox: React.FC<{ p: V3; s: V3; color: string; top?: string; rot?: V3; cast?: boolean; emissive?: string; ei?: number }> = ({ p, s, color, top, rot = [0, 0, 0], cast = true, emissive, ei = 0 }) => (
  <group position={p} rotation={rot}>
    <mesh castShadow={cast} receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={color} roughness={0.75} flatShading emissive={emissive ?? "#000"} emissiveIntensity={ei} />
    </mesh>
    {top && (
      <mesh position={[0, s[1] / 2 + 0.01, 0]} receiveShadow>
        <boxGeometry args={[s[0] * 0.96, 0.02, s[2] * 0.96]} />
        <meshStandardMaterial color={top} roughness={0.7} />
      </mesh>
    )}
  </group>
);

// Blocky helper character (the trainers). Faces +z of its own group.
export const BlockBuddy: React.FC<{
  p: V3; yaw: number; color: string; dark: string; t: number; seed: number;
  accessory?: "headband" | "cap" | "cross" | "bolt" | "belt"; accent?: string; talk?: boolean;
}> = ({ p, yaw, color, dark, t, seed, accessory, accent = "#FFFFFF", talk }) => {
  const bob = Math.abs(Math.sin(t * 4.2 + seed)) * 0.12;
  const tilt = Math.sin(t * 2.1 + seed) * 0.12;
  const blink = (t * 1.3 + seed * 0.37) % 3 < 0.09;
  const mouth = talk ? 0.05 + 0.07 * Math.abs(Math.sin(t * 14 + seed)) : 0.04;
  return (
    <group position={[p[0], p[1] + bob, p[2]]} rotation={[0, yaw + tilt * 0.6, tilt * 0.3]}>
      {/* body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.35, 1.15, 1.1]} />
        <meshStandardMaterial color={color} roughness={0.7} flatShading />
      </mesh>
      {/* darker underside band */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <boxGeometry args={[1.37, 0.16, 1.12]} />
        <meshStandardMaterial color={dark} roughness={0.8} />
      </mesh>
      {/* arms */}
      <mesh position={[-0.78, -0.05 + Math.sin(t * 6 + seed) * 0.06, 0.1]} castShadow>
        <boxGeometry args={[0.22, 0.32, 0.32]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.78, -0.05 - Math.sin(t * 6 + seed) * 0.06, 0.1]} castShadow>
        <boxGeometry args={[0.22, 0.32, 0.32]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* eyes */}
      {[-0.28, 0.28].map((x) => (
        <group key={x} position={[x, 0.12, 0.56]}>
          <mesh>
            <boxGeometry args={[0.16, blink ? 0.04 : 0.3, 0.04]} />
            <meshStandardMaterial color="#14110F" roughness={0.4} />
          </mesh>
          {!blink && (
            <mesh position={[0.03, 0.08, 0.025]}>
              <boxGeometry args={[0.06, 0.08, 0.01]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          )}
        </group>
      ))}
      {/* mouth + blush */}
      <mesh position={[0, -0.18, 0.56]}>
        <boxGeometry args={[0.22, mouth, 0.03]} />
        <meshStandardMaterial color="#3A1712" />
      </mesh>
      {[-0.46, 0.46].map((x) => (
        <mesh key={x} position={[x, -0.1, 0.556]}>
          <boxGeometry args={[0.16, 0.08, 0.01]} />
          <meshBasicMaterial color="#FF8F8F" transparent opacity={0.55} />
        </mesh>
      ))}
      {accessory === "headband" && (
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[1.39, 0.16, 1.14]} />
          <meshStandardMaterial color={accent} roughness={0.6} />
        </mesh>
      )}
      {accessory === "cap" && (
        <group position={[0, 0.66, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.24, 1.0]} />
            <meshStandardMaterial color={accent} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.08, 0.62]} castShadow>
            <boxGeometry args={[1.0, 0.06, 0.45]} />
            <meshStandardMaterial color={accent} roughness={0.6} />
          </mesh>
        </group>
      )}
      {accessory === "cross" && (
        <group position={[0, 0.66, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.1, 0.2, 0.9]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.0, 0.46]}>
            <boxGeometry args={[0.3, 0.1, 0.02]} />
            <meshBasicMaterial color="#E04848" />
          </mesh>
          <mesh position={[0, 0.0, 0.46]}>
            <boxGeometry args={[0.1, 0.3, 0.02]} />
            <meshBasicMaterial color="#E04848" />
          </mesh>
        </group>
      )}
      {accessory === "bolt" && (
        <group position={[0, 0.78, 0]} rotation={[0, t * 2 + seed, 0]}>
          <mesh castShadow rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.14, 0.42, 0.14]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}
      {accessory === "belt" && (
        <>
          <mesh position={[0, -0.28, 0]} castShadow>
            <boxGeometry args={[1.39, 0.2, 1.14]} />
            <meshStandardMaterial color="#2A2220" roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.28, 0.58]}>
            <boxGeometry args={[0.3, 0.22, 0.03]} />
            <meshStandardMaterial color="#E6C35C" metalness={0.6} roughness={0.3} />
          </mesh>
        </>
      )}
    </group>
  );
};
