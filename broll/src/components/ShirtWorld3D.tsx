// ShirtWorld3D: reusable 3D world for the series "KI baut ein Unternehmen von Null" (@pickthecompany, Neustart 2026-10-26),
// business = Firmenshirts mit Logo, Druck auf Bestellung. Light oak room in Superkind white/orange, founder desk island,
// shirt stack with the KASSE counter on the object (M-005), partner island with print machine + blue bot, conveyor with
// parcels, empty customer slots. Also 2D pieces every episode needs: Claude paper window with a slot for the REAL
// claude.ai screenshot (never a redrawn UI), the 1·2·3 step bar (M-008), the series hook and the keyword end card (M-007).
// Built for FirmaShirtsTag1; later episodes import from here instead of copying.
import React from "react";
import * as THREE from "three";
import { Img, continueRender, delayRender } from "remotion";
import { ToyBox, canvasTex, roundRect } from "./Voxel3D";
import { claudeSerif } from "./ClaudeUI";

export type V3 = [number, number, number];
export type Tex = Record<string, THREE.Texture>;

// ---------- palette (design-system.md: Superkind white/orange, bots in palette colours, only the founder orange) ----------
export const SKC = {
  OR: "#FF6B35", OR_D: "#E5521F", INK: "#16130F", MUTED: "#8A857D", CREAM: "#F6EEDC", PAPER: "#F4EFE5", WHITE: "#FFFFFF",
  GOLD: "#F5C542", GREEN: "#1F9D55", RED: "#E5484D", BLUE: "#3E6FD8", BLUE_D: "#2C52A8", TEAL: "#2BB3A3", PINK: "#E0559A", VIOLET: "#7A5AE0",
  OAK: "#C99A6B", OAK_D: "#A87850", OAK_L: "#E2BE92", FLOOR: "#9C6B43", BG: "#E8CFAE",
};
export const SERIF = `"${claudeSerif.replace(/"/g, "")}"`;

// ---------- math ----------
export const cl = (v: number) => Math.max(0, Math.min(1, v));
export const ease = (v: number) => 1 - Math.pow(1 - cl(v), 3);
export const inOut = (v: number) => { const x = cl(v); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const back = (v: number) => { const x = cl(v); const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
export const rnd = (i: number) => { const v = Math.sin(i * 91.7 + 47.3) * 43758.5453; return v - Math.floor(v); };
export const bump = (t: number, at: number, d = 0.25) => Math.max(0, 1 - Math.abs(t - at) / d);
export const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
export const bez3 = (a: V3, c: V3, b: V3, k: number): V3 => lerp3(lerp3(a, c, k), lerp3(c, b, k), k);
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const font = (px: number, w = 900) => `${w} ${px}px Rubik`;

// ---------- canvas helpers ----------
export const fitFont = (c: CanvasRenderingContext2D, text: string, max: number, maxW: number, w = 900) => {
  let s = max;
  c.font = font(s, w);
  while (c.measureText(text).width > maxW && s > 10) { s -= 2; c.font = font(s, w); }
  return s;
};
// die-cut sticker: white border, ink outline, coloured plate (claudebyseb look)
export const sticker = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, bg: string) => {
  c.fillStyle = "rgba(0,0,0,.30)"; roundRect(c, x + 4, y + 12, w - 4, h - 8, r); c.fill();
  c.fillStyle = "#FFFFFF"; roundRect(c, x, y, w - 4, h - 12, r); c.fill();
  c.fillStyle = SKC.INK; roundRect(c, x + 9, y + 9, w - 22, h - 30, Math.max(4, r - 8)); c.fill();
  c.fillStyle = bg; roundRect(c, x + 15, y + 15, w - 34, h - 42, Math.max(4, r - 13)); c.fill();
  c.fillStyle = "rgba(255,255,255,.22)"; roundRect(c, x + 24, y + 20, w - 52, (h - 42) * 0.32, Math.max(4, (r - 13) * 0.6)); c.fill();
};
export const pillTex = (text: string, bg: string, fg: string, w = 760, h = 180) => canvasTex(w, h, (c) => {
  sticker(c, 0, 0, w, h, 40, bg);
  c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle";
  fitFont(c, text, h * 0.46, w - 110); c.fillText(text, (w - 4) / 2, (h - 12) / 2 + 3);
});
// counter plate that sits ON the object: small label on top, big number below (M-005)
export const drawCounter = (c: CanvasRenderingContext2D, w: number, h: number, label: string, value: string, valueCol = SKC.INK, pulse = 0) => {
  c.clearRect(0, 0, w, h);
  sticker(c, 0, 0, w, h, 46, pulse > 0 ? "#FFF3D6" : SKC.CREAM);
  c.textAlign = "center"; c.textBaseline = "middle";
  c.fillStyle = SKC.OR; fitFont(c, label, h * 0.17, w - 120); c.fillText(label, w / 2 - 2, h * 0.27);
  c.fillStyle = valueCol; fitFont(c, value, h * 0.42, w - 120); c.fillText(value, w / 2 - 2, h * 0.58);
};
// hanging price tag with a hole
export const drawTag = (c: CanvasRenderingContext2D, w: number, h: number, text: string, sub?: string, bg = SKC.GOLD) => {
  c.clearRect(0, 0, w, h);
  c.save();
  c.fillStyle = "rgba(0,0,0,.28)"; c.beginPath(); c.moveTo(w * 0.5 + 6, 14); c.lineTo(w - 14, h * 0.3 + 10); c.lineTo(w - 14, h - 8); c.lineTo(20, h - 8); c.lineTo(20, h * 0.3 + 10); c.closePath(); c.fill();
  const path = () => { c.beginPath(); c.moveTo(w * 0.5, 8); c.lineTo(w - 22, h * 0.3); c.lineTo(w - 22, h - 18); c.lineTo(14, h - 18); c.lineTo(14, h * 0.3); c.closePath(); };
  c.fillStyle = "#FFFFFF"; path(); c.fill();
  c.lineWidth = 18; c.strokeStyle = "#FFFFFF"; c.lineJoin = "round"; path(); c.stroke();
  c.lineWidth = 9; c.strokeStyle = SKC.INK; path(); c.stroke();
  c.fillStyle = bg; path(); c.fill();
  c.fillStyle = SKC.INK; c.beginPath(); c.arc(w * 0.5 - 4, h * 0.2, 16, 0, 7); c.fill();
  c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(w * 0.5 - 4, h * 0.2, 9, 0, 7); c.fill();
  c.fillStyle = SKC.INK; c.textAlign = "center"; c.textBaseline = "middle";
  if (sub) { fitFont(c, sub, h * 0.11, w - 90); c.fillText(sub, w * 0.5 - 4, h * 0.38); }
  fitFont(c, text, h * (sub ? 0.42 : 0.55), w - 90); c.fillText(text, w * 0.5 - 4, h * (sub ? 0.66 : 0.6));
  c.restore();
};
// simple shirt glyph for stickers / logos on canvas
export const drawShirtGlyph = (c: CanvasRenderingContext2D, x: number, y: number, s: number, fill: string, line = SKC.INK) => {
  c.save(); c.translate(x, y); c.scale(s / 100, s / 100);
  c.beginPath();
  c.moveTo(-22, -40); c.lineTo(-48, -30); c.lineTo(-62, -2); c.lineTo(-40, 8); c.lineTo(-34, -6); c.lineTo(-34, 44); c.lineTo(34, 44); c.lineTo(34, -6); c.lineTo(40, 8); c.lineTo(62, -2); c.lineTo(48, -30); c.lineTo(22, -40);
  c.quadraticCurveTo(0, -22, -22, -40); c.closePath();
  c.fillStyle = fill; c.fill(); c.lineWidth = 7; c.strokeStyle = line; c.lineJoin = "round"; c.stroke();
  c.restore();
};
// Superkind-style mini bot face used as "logo" on shirts (our own mark, no foreign brand)
export const drawBotLogo = (c: CanvasRenderingContext2D, x: number, y: number, s: number) => {
  c.fillStyle = SKC.OR; roundRect(c, x - s * 0.6, y - s * 0.6, s * 1.2, s * 1.2, s * 0.22); c.fill();
  c.fillStyle = "#FFFFFF"; c.fillRect(x - s * 0.38, y - s * 0.3, s * 0.24, s * 0.3); c.fillRect(x + s * 0.14, y - s * 0.3, s * 0.24, s * 0.3);
  c.fillStyle = SKC.INK; c.fillRect(x - s * 0.3, y - s * 0.22, s * 0.11, s * 0.16); c.fillRect(x + s * 0.22, y - s * 0.22, s * 0.11, s * 0.16);
};

export const useImage = (src: string) => {
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [h] = React.useState(() => delayRender("image " + src));
  React.useEffect(() => {
    const i = new Image();
    i.onload = () => { setImg(i); continueRender(h); };
    i.onerror = () => continueRender(h);
    i.src = src;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return img;
};
// live canvas texture, redrawn every frame
export const useDyn = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const { cv, tex } = React.useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return { cv, tex };
  }, [w, h]);
  const c = cv.getContext("2d")!;
  c.clearRect(0, 0, w, h);
  draw(c);
  tex.needsUpdate = true;
  return tex;
};

// ---------- static textures of the world ----------
export const makeWorldTex = (episode: number): Tex => {
  const t: Tex = {};
  // light oak planks, white wainscot with an orange line
  t.wall = canvasTex(1024, 512, (c) => {
    c.fillStyle = SKC.OAK; c.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 16; i++) {
      c.fillStyle = i % 3 === 0 ? "#CFA274" : i % 3 === 1 ? "#C39366" : "#CA9C6E"; c.fillRect(i * 64, 0, 64, 512);
      c.fillStyle = "rgba(90,50,20,.28)"; c.fillRect(i * 64, 0, 3, 512);
      for (let k = 0; k < 5; k++) { c.fillStyle = `rgba(120,70,30,${0.05 + rnd(i * 7 + k) * 0.06})`; c.fillRect(i * 64 + 10 + rnd(i + k) * 40, rnd(i * 3 + k) * 360, 2, 40 + rnd(k + i) * 70); }
    }
    c.fillStyle = "#F7F1E6"; c.fillRect(0, 370, 1024, 142);
    c.fillStyle = SKC.OR; c.fillRect(0, 362, 1024, 10);
    for (let i = 0; i < 16; i++) { c.fillStyle = "rgba(0,0,0,.06)"; c.fillRect(i * 64, 372, 2, 140); }
  });
  t.wall.wrapS = THREE.RepeatWrapping; t.wall.repeat.set(4, 1);
  // floor: oak boards
  t.floor = canvasTex(512, 512, (c) => {
    for (let y = 0; y < 16; y++) {
      const off = (y % 2) * 96;
      for (let x = -1; x < 3; x++) {
        c.fillStyle = ["#A2714A", "#986943", "#A87850", "#9E6E47"][(x + y * 3 + 8) % 4];
        c.fillRect(off + x * 192, y * 32, 190, 30);
      }
      c.fillStyle = "rgba(60,30,10,.35)"; c.fillRect(0, y * 32 + 30, 512, 2);
    }
  });
  t.floor.wrapS = t.floor.wrapT = THREE.RepeatWrapping; t.floor.repeat.set(14, 14);
  // wall sign of the company (name still open in the series: "die Shirt-Firma")
  t.sign = canvasTex(1100, 300, (c) => {
    sticker(c, 0, 0, 1100, 300, 60, "#FFFFFF");
    drawShirtGlyph(c, 150, 140, 150, SKC.OR);
    c.fillStyle = SKC.INK; c.textAlign = "left"; c.textBaseline = "middle";
    fitFont(c, "DIE SHIRT-FIRMA", 104, 760); c.fillText("DIE SHIRT-FIRMA", 270, 112);
    c.fillStyle = SKC.OR; fitFont(c, `TAG ${episode} / 100`, 64, 700); c.fillText(`TAG ${episode} / 100`, 272, 196);
  });
  const deco = (draw: (c: CanvasRenderingContext2D) => void) => canvasTex(300, 300, (c) => { sticker(c, 0, 0, 300, 300, 70, SKC.CREAM); draw(c); });
  t.stShirt = deco((c) => { drawShirtGlyph(c, 146, 134, 150, SKC.OR); drawBotLogo(c, 146, 128, 22); });
  t.stScissors = deco((c) => {
    c.strokeStyle = SKC.INK; c.lineWidth = 14; c.lineCap = "round";
    c.beginPath(); c.moveTo(90, 80); c.lineTo(200, 190); c.moveTo(200, 80); c.lineTo(90, 190); c.stroke();
    c.fillStyle = SKC.BLUE; [[86, 196], [204, 196]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 30, 0, 7); c.fill(); c.lineWidth = 8; c.stroke(); });
  });
  t.stCoin = deco((c) => {
    c.fillStyle = "#B88D24"; c.beginPath(); c.arc(146, 142, 84, 0, 7); c.fill();
    c.fillStyle = SKC.GOLD; c.beginPath(); c.arc(146, 134, 78, 0, 7); c.fill();
    c.fillStyle = SKC.INK; c.font = font(96); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("€", 146, 140);
  });
  t.stIdea = deco((c) => {
    c.fillStyle = "#FFE27A"; c.beginPath(); c.arc(146, 118, 66, 0, 7); c.fill(); c.lineWidth = 8; c.strokeStyle = SKC.INK; c.stroke();
    c.fillStyle = "#C9C2B6"; c.fillRect(116, 180, 60, 40); c.strokeRect(116, 180, 60, 40);
  });
  t.stBox = deco((c) => {
    c.fillStyle = "#D7A86E"; c.fillRect(70, 90, 156, 130); c.lineWidth = 8; c.strokeStyle = SKC.INK; c.strokeRect(70, 90, 156, 130);
    c.fillStyle = SKC.OR; c.fillRect(134, 90, 28, 130);
  });
  // plates
  t.plateFounder = pillTex("GRÜNDER-TISCH", SKC.OR, "#FFFFFF", 820, 190);
  t.platePartner = pillTex("DRUCKPARTNER", SKC.BLUE, "#FFFFFF", 820, 190);
  t.slotQ = pillTex("KUNDE ?", "#FFFFFF", SKC.MUTED, 520, 170);
  t.tagQ = canvasTex(360, 420, (c) => drawTag(c, 360, 420, "?", "PREIS", SKC.GOLD));
  t.tagNein = canvasTex(1000, 260, (c) => {
    sticker(c, 0, 0, 1000, 260, 56, SKC.RED);
    c.fillStyle = "#FFFFFF"; c.textAlign = "center"; c.textBaseline = "middle";
    fitFont(c, "KEINE EIGENE MASCHINE", 92, 860); c.fillText("KEINE EIGENE MASCHINE", 496, 118);
  });
  t.tagPartner = canvasTex(1000, 260, (c) => {
    sticker(c, 0, 0, 1000, 260, 56, SKC.GREEN);
    c.fillStyle = "#FFFFFF"; c.textAlign = "center"; c.textBaseline = "middle";
    fitFont(c, "PARTNER DRUCKT AUF BESTELLUNG", 84, 880); c.fillText("PARTNER DRUCKT AUF BESTELLUNG", 496, 118);
  });
  // shirt print: our own little mark (a customer's logo comes later per episode)
  t.shirtLogo = canvasTex(256, 256, (c) => { c.clearRect(0, 0, 256, 256); drawBotLogo(c, 128, 128, 90); });
  // red cross-out stamp
  t.cross = canvasTex(512, 512, (c) => {
    c.clearRect(0, 0, 512, 512); c.lineCap = "round";
    [["#FFFFFF", 92], [SKC.INK, 70], [SKC.RED, 52]].forEach(([col, lw]) => {
      c.strokeStyle = col as string; c.lineWidth = lw as number;
      c.beginPath(); c.moveTo(80, 80); c.lineTo(432, 432); c.moveTo(432, 80); c.lineTo(80, 432); c.stroke();
    });
  });
  return t;
};

// ---------- 3D pieces ----------
// camera-facing board (sticker plates, stamps)
export const Board: React.FC<{ p: V3; tex: THREE.Texture; w: number; h: number; t: number; q: THREE.Quaternion; vis?: number; bob?: number; tilt?: number; opacity?: number }> = ({ p, tex, w, h, t, q, vis = 1, bob = 0.05, tilt = 0, opacity = 1 }) => {
  if (vis <= 0.001) return null;
  return (
    <group position={[p[0], p[1] + Math.sin(t * 2.4 + p[0] + p[2]) * bob, p[2]]} quaternion={q}>
      <group rotation={[0, 0, tilt]} scale={[vis, vis, vis]}>
        <mesh renderOrder={5}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} side={THREE.DoubleSide} depthWrite={false} opacity={opacity} />
        </mesh>
      </group>
    </group>
  );
};

// table island: white top, orange rim with ticking lights, optional plate
export const Island: React.FC<{ p: V3; r: number; t: number; top?: string; side?: string; rim?: string; glow?: number; glowCol?: string; vis?: number; label?: THREE.Texture; la?: number; ghost?: boolean }> = ({ p, r, t, top = "#FBF7F0", side = SKC.OR, rim = "#FFE1A8", glow = 0, glowCol = SKC.OR, vis = 1, label, la = 0, ghost }) => {
  if (vis <= 0.001) return null;
  const n = Math.round(r * 7);
  if (ghost) {
    return (
      <group position={p} scale={vis}>
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r - 0.1, r, 48]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.55} toneMapped={false} />
        </mesh>
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * (r - 0.45), 0.03, Math.sin(a) * (r - 0.45)]} rotation={[-Math.PI / 2, 0, -a]}>
              <planeGeometry args={[0.18, 0.42]} />
              <meshBasicMaterial color="#FFFFFF" transparent opacity={0.35 + 0.25 * Math.sin(t * 3 + i * 0.7)} toneMapped={false} />
            </mesh>
          );
        })}
        {label && (
          <group position={[0, 0.5, r - 0.2]} rotation={[-0.35, 0, 0]} scale={0.55}>
            <mesh><planeGeometry args={[3.0, 0.98]} /><meshBasicMaterial map={label} transparent toneMapped={false} /></mesh>
          </group>
        )}
      </group>
    );
  }
  return (
    <group position={p} scale={vis}>
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[r, r + 0.12, 0.5, 56]} />
        <meshStandardMaterial color={side} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.505, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[r - 0.1, 56]} />
        <meshStandardMaterial color={top} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.51, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[r - 0.32, r - 0.22, 56]} />
        <meshBasicMaterial color={SKC.OR} transparent opacity={0.35} toneMapped={false} />
      </mesh>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * (r + 0.07), 0.25, Math.sin(a) * (r + 0.07)]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.1, 0.22, 0.2]} />
            <meshBasicMaterial color={i % 2 ? rim : "#FFFFFF"} transparent opacity={i % 2 ? 0.45 + 0.4 * Math.sin(t * 3 + i) : 0.9} toneMapped={false} />
          </mesh>
        );
      })}
      {label && (
        <group rotation={[0, la, 0]}>
          <group position={[0, 0.42, r + 0.1]} rotation={[-0.3, 0, 0]} scale={0.6}>
            <mesh><planeGeometry args={[3.2, 0.74]} /><meshBasicMaterial map={label} transparent toneMapped={false} /></mesh>
          </group>
        </group>
      )}
      {glow > 0.01 && (
        <>
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r + 0.2, r + 0.2 + 0.7 * glow, 56]} />
            <meshBasicMaterial color={glowCol} transparent opacity={0.8 * glow} toneMapped={false} />
          </mesh>
          <pointLight position={[0, 3.2, 0]} intensity={18 * glow} distance={9} color={glowCol} />
        </>
      )}
    </group>
  );
};

// agent figure (founder = orange, the only orange one; partner/customers get palette colours)
export type Palette = { body: string; dark: string; feet: string; eye: string; pupil: string | null; ball: string };
export const FOUNDER: Palette = { body: SKC.OR, dark: SKC.OR_D, feet: "#2C2420", eye: "#FFFFFF", pupil: "#2C2420", ball: SKC.GOLD };
export const PARTNER: Palette = { body: SKC.BLUE, dark: SKC.BLUE_D, feet: "#1C2440", eye: "#FFFFFF", pupil: "#1C2440", ball: "#7FD6FF" };
export const CUSTOMER_PALS: Palette[] = [
  { body: SKC.TEAL, dark: "#1E8679", feet: "#163A35", eye: "#FFFFFF", pupil: "#163A35", ball: "#9DFFC4" },
  { body: SKC.PINK, dark: "#B23E7A", feet: "#3A1A2A", eye: "#FFFFFF", pupil: "#3A1A2A", ball: "#FFD34D" },
  { body: SKC.VIOLET, dark: "#5A40B0", feet: "#22183F", eye: "#FFFFFF", pupil: "#22183F", ball: "#C9B6FF" },
];
export const Agent: React.FC<{ p: V3; yaw?: number; t: number; s?: number; seed?: number; pal?: Palette; vis?: number; armL?: number; armR?: number; reach?: number; lean?: number; talk?: boolean; glow?: number; squash?: number; sway?: number }> = ({ p, yaw = 0, t, s = 1, seed = 0, pal = FOUNDER, vis = 1, armL = 15, armR = 15, reach = 0, lean = 0, talk, glow = 0, squash = 0, sway = 0 }) => {
  if (vis <= 0.001) return null;
  const bob = Math.abs(Math.sin(t * 4.4 + seed)) * 0.08 * (1 - reach * 0.6);
  const blink = (t * 1.2 + seed * 0.37) % 3.1 < 0.09;
  const sc = s * vis;
  const sy = 1 - 0.22 * squash, sx = 1 + 0.15 * squash;
  const arm = (side: -1 | 1, deg: number) => (
    <group position={[side * 0.72, 0.98, 0.05]} rotation={[-reach * 1.45, 0, (side * deg * (1 - reach) * Math.PI) / 180]}>
      <mesh castShadow position={[0, -0.24, 0]}>
        <boxGeometry args={[0.24, 0.54, 0.26]} />
        <meshStandardMaterial color={pal.dark} roughness={0.55} />
      </mesh>
    </group>
  );
  return (
    <group position={[p[0], p[1] + bob, p[2]]} rotation={[0, yaw, 0]} scale={[sc * sx, sc * sy, sc]}>
      <group rotation={[lean, 0, 0]}>
        {[-0.28, 0.28].map((x, i) => (
          <mesh key={x} castShadow position={[x, 0.16, Math.sin(t * (reach ? 11 : 9) + seed + i * 3) * 0.06 * (reach ? 1.6 : 1)]}>
            <boxGeometry args={[0.26, 0.32, 0.3]} />
            <meshStandardMaterial color={pal.feet} />
          </mesh>
        ))}
        <mesh castShadow receiveShadow position={[0, 0.98, 0]}>
          <boxGeometry args={[1.28, 1.3, 1.08]} />
          <meshStandardMaterial color={pal.body} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.3, 0.14, 1.1]} />
          <meshStandardMaterial color={pal.dark} roughness={0.6} />
        </mesh>
        {[-0.29, 0.29].map((x) => (
          <group key={x} position={[x, 1.12, 0.545]}>
            <mesh><boxGeometry args={[0.34, blink ? 0.05 : 0.36, 0.03]} /><meshBasicMaterial color={pal.eye} toneMapped={false} /></mesh>
            {!blink && pal.pupil && <mesh position={[0.05, -0.04, 0.02]}><boxGeometry args={[0.15, 0.19, 0.02]} /><meshBasicMaterial color={pal.pupil} /></mesh>}
          </group>
        ))}
        <mesh position={[0, 0.72, 0.545]}>
          <boxGeometry args={[0.34, talk ? 0.05 + 0.07 * Math.abs(Math.sin(t * 14 + seed)) : 0.06, 0.03]} />
          <meshBasicMaterial color="#5A2A1A" />
        </mesh>
        <group position={[0, 1.63, 0]} rotation={[sway * 0.5, 0, sway]}>
          <mesh position={[0, 0.2, 0]} castShadow><boxGeometry args={[0.08, 0.42, 0.08]} /><meshStandardMaterial color={pal.feet} /></mesh>
          <mesh position={[0, 0.45, 0]} castShadow><boxGeometry args={[0.22, 0.22, 0.22]} /><meshStandardMaterial color={pal.ball} emissive={pal.ball} emissiveIntensity={0.4 + 0.35 * Math.max(0, Math.sin(t * 6 + seed)) + glow} /></mesh>
        </group>
        {arm(-1, armL)}
        {arm(1, armR)}
      </group>
      {glow > 0.01 && <pointLight position={[0, 1.1, 1.0]} intensity={6 * glow} distance={5} color={pal.ball} />}
    </group>
  );
};

// voxel T-shirt lying flat (folded) or standing
export const TShirt: React.FC<{ p: V3; color?: string; s?: number; rot?: V3; logo?: THREE.Texture; ghost?: number }> = ({ p, color = "#FFFFFF", s = 1, rot = [0, 0, 0], logo, ghost = 0 }) => {
  const mat = ghost > 0
    ? <meshBasicMaterial color="#FFFFFF" wireframe transparent opacity={ghost} toneMapped={false} />
    : <meshStandardMaterial color={color} roughness={0.85} />;
  return (
    <group position={p} rotation={rot} scale={s}>
      <mesh castShadow={!ghost} receiveShadow><boxGeometry args={[1.0, 0.12, 1.15]} />{mat}</mesh>
      <mesh castShadow={!ghost} position={[-0.62, 0, -0.32]} rotation={[0, 0.5, 0]}><boxGeometry args={[0.42, 0.11, 0.42]} />{mat}</mesh>
      <mesh castShadow={!ghost} position={[0.62, 0, -0.32]} rotation={[0, -0.5, 0]}><boxGeometry args={[0.42, 0.11, 0.42]} />{mat}</mesh>
      {!ghost && <mesh position={[0, 0.065, -0.5]}><boxGeometry args={[0.36, 0.02, 0.1]} /><meshStandardMaterial color="#E6E0D6" /></mesh>}
      {logo && !ghost && <mesh position={[0, 0.07, 0.02]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.5, 0.5]} /><meshBasicMaterial map={logo} transparent toneMapped={false} /></mesh>}
    </group>
  );
};

// the empty shirt stack: wooden tray, ghost outlines of the shirts that are not there yet, counter tag ON the stack
export const ShirtStack: React.FC<{ p: V3; t: number; count: number; q: THREE.Quaternion; counter: THREE.Texture; logo?: THREE.Texture; s?: number; counterVis?: number }> = ({ p, t, count, q, counter, logo, s = 1, counterVis = 1 }) => (
  <group position={p} scale={s}>
    <ToyBox p={[0, 0.08, 0]} s={[1.7, 0.16, 1.55]} color={SKC.OAK_D} top={SKC.OAK_L} />
    {[[-0.8, -0.72], [0.8, -0.72], [-0.8, 0.72], [0.8, 0.72]].map(([x, z], i) => <ToyBox key={i} p={[x, 0.32, z]} s={[0.1, 0.5, 0.1]} color={SKC.OAK_D} />)}
    {Array.from({ length: Math.max(count, 3) }).map((_, i) => (
      i < count
        ? <TShirt key={i} p={[0, 0.24 + i * 0.13, 0.05]} s={0.95} rot={[0, (rnd(i) - 0.5) * 0.12, 0]} logo={i === count - 1 ? logo : undefined} />
        : <TShirt key={i} p={[0, 0.24 + i * 0.13, 0.05]} s={0.95} ghost={0.12 + 0.06 * Math.sin(t * 3 + i)} />
    ))}
    <group position={[0, 1.65, 0.3]}>
      <mesh position={[0, -0.42, 0]}><boxGeometry args={[0.025, 0.75, 0.025]} /><meshBasicMaterial color={SKC.INK} /></mesh>
      <Board p={[0, 0, 0]} tex={counter} w={1.7} h={1.05} t={t} q={q} vis={counterVis} bob={0.03} />
    </group>
  </group>
);

export const Pallet: React.FC<{ p: V3; w?: number; d?: number }> = ({ p, w = 3.6, d = 2.8 }) => (
  <group position={p}>
    {[-1, 0, 1].map((i) => <ToyBox key={i} p={[0, 0.12, (i * d) / 2.6]} s={[w, 0.24, 0.3]} color="#B58A5A" />)}
    {Array.from({ length: 7 }).map((_, i) => <ToyBox key={i} p={[-w / 2 + 0.26 + (i * (w - 0.52)) / 6, 0.3, 0]} s={[0.36, 0.1, d]} color={i % 2 ? "#D2A574" : "#C99A68"} />)}
  </group>
);

// boxy print machine. tint = body colour; running = rollers spin, lights blink, sheet moves
export const PrintMachine: React.FC<{ p: V3; t: number; s?: number; yaw?: number; tint?: string; accent?: string; running?: boolean; red?: number }> = ({ p, t, s = 1, yaw = 0, tint = "#ECE8E1", accent = SKC.INK, running, red = 0 }) => {
  const body = red > 0 ? "#" + new THREE.Color(tint).lerp(new THREE.Color("#F2A49A"), red).getHexString() : tint;
  return (
    <group position={p} rotation={[0, yaw, 0]} scale={s}>
      {/* base */}
      <ToyBox p={[0, 0.35, 0]} s={[3.2, 0.7, 2.2]} color="#3A3640" top="#4A4552" />
      {/* main body */}
      <ToyBox p={[0, 1.55, -0.1]} s={[3.0, 1.7, 2.0]} color={body} top="#FFFFFF" />
      <ToyBox p={[0, 1.55, 0.92]} s={[2.6, 1.2, 0.08]} color={accent} />
      {/* rollers */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.9 + i * 0.9, 1.6, 0.98]} rotation={[0, 0, Math.PI / 2 + (running ? t * 8 : 0)]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.7, 14]} />
          <meshStandardMaterial color={["#E5484D", "#F5C542", "#3E6FD8"][i]} roughness={0.4} />
        </mesh>
      ))}
      {/* top hood + screen arm */}
      <ToyBox p={[0, 2.62, -0.35]} s={[2.4, 0.45, 1.4]} color={body} />
      <ToyBox p={[1.15, 3.15, -0.2]} s={[0.12, 0.7, 0.12]} color="#3A3640" />
      <ToyBox p={[1.15, 3.55, -0.1]} s={[0.9, 0.6, 0.12]} color="#2A2430" />
      <mesh position={[1.15, 3.55, -0.03]}><planeGeometry args={[0.76, 0.46]} /><meshBasicMaterial color={running ? "#4CF08A" : "#8FD3F4"} toneMapped={false} /></mesh>
      {/* control lights */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[-1.2 + i * 0.22, 2.25, 0.92]}>
          <boxGeometry args={[0.12, 0.12, 0.04]} />
          <meshBasicMaterial color={(running ? Math.sin(t * 7 + i * 1.7) > 0 : i === 0) ? ["#4CF08A", "#F5C542", "#FF6B35", "#4CF08A", "#7FD6FF"][i] : "#3A3640"} toneMapped={false} />
        </mesh>
      ))}
      {/* output tray with a shirt */}
      <ToyBox p={[0, 0.82, 1.45]} s={[1.6, 0.08, 0.9]} color="#3A3640" />
      {running && <TShirt p={[0, 0.92, 1.35 + ((t * 0.6) % 1) * 0.3]} s={0.8} />}
      {/* side wheel */}
      <mesh position={[-1.55, 1.7, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.45, 0.45, 0.14, 20]} /><meshStandardMaterial color="#3A3640" /></mesh>
      <mesh position={[-1.63, 1.7, 0]} rotation={[running ? t * 3 : 0, 0, 0]}><boxGeometry args={[0.04, 0.8, 0.1]} /><meshStandardMaterial color={SKC.GOLD} /></mesh>
    </group>
  );
};

// price tag hanging from a string, swinging
export const HangingTag: React.FC<{ anchor: V3; t: number; tex: THREE.Texture; len?: number; w?: number; h?: number; swing?: number; vis?: number }> = ({ anchor, t, tex, len = 0.9, w = 1.1, h = 1.28, swing = 0.22, vis = 1 }) => {
  if (vis <= 0.001) return null;
  const a = Math.sin(t * 2.6) * swing;
  return (
    <group position={anchor} rotation={[0, 0, a]} scale={vis}>
      <mesh position={[0, -len / 2, 0.05]}><boxGeometry args={[0.03, len, 0.03]} /><meshBasicMaterial color={SKC.INK} /></mesh>
      <mesh position={[0, -len - h * 0.42, 0.06]} rotation={[0, Math.sin(t * 1.7) * 0.25, 0]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export const Parcel: React.FC<{ p: V3; s?: number; rot?: V3; label?: string }> = ({ p, s = 1, rot = [0, 0, 0], label = SKC.OR }) => (
  <group position={p} rotation={rot} scale={s}>
    <ToyBox p={[0, 0.25, 0]} s={[0.7, 0.5, 0.55]} color="#D7A86E" top="#E2B77F" />
    <mesh position={[0, 0.505, 0]}><boxGeometry args={[0.14, 0.012, 0.56]} /><meshStandardMaterial color={label} /></mesh>
    <mesh position={[0, 0.25, 0.28]}><boxGeometry args={[0.14, 0.5, 0.01]} /><meshStandardMaterial color={label} /></mesh>
  </group>
);

// conveyor belt from a to b (on the floor, along x/z), parcels travel a → b
export const Conveyor: React.FC<{ a: V3; b: V3; t: number; n?: number; speed?: number; vis?: number; parcels?: number }> = ({ a, b, t, n = 5, speed = 0.9, vis = 1, parcels = 1 }) => {
  if (vis <= 0.001) return null;
  const dx = b[0] - a[0], dz = b[2] - a[2];
  const len = Math.hypot(dx, dz);
  const yaw = -Math.atan2(dz, dx);
  const mid: V3 = [(a[0] + b[0]) / 2, 0, (a[2] + b[2]) / 2];
  const rollers = Math.floor(len / 0.5);
  return (
    <group position={mid} rotation={[0, yaw, 0]} scale={[1, vis, 1]}>
      {/* legs */}
      {Array.from({ length: Math.floor(len / 2) + 1 }).map((_, i) => (
        <group key={i}>
          <ToyBox p={[-len / 2 + 0.3 + i * ((len - 0.6) / Math.max(1, Math.floor(len / 2))), 0.3, -0.55]} s={[0.12, 0.6, 0.12]} color="#3A3640" />
          <ToyBox p={[-len / 2 + 0.3 + i * ((len - 0.6) / Math.max(1, Math.floor(len / 2))), 0.3, 0.55]} s={[0.12, 0.6, 0.12]} color="#3A3640" />
        </group>
      ))}
      <ToyBox p={[0, 0.66, 0]} s={[len, 0.12, 1.3]} color="#2A2430" />
      <ToyBox p={[0, 0.74, -0.68]} s={[len, 0.2, 0.08]} color={SKC.OR} />
      <ToyBox p={[0, 0.74, 0.68]} s={[len, 0.2, 0.08]} color={SKC.OR} />
      {Array.from({ length: rollers }).map((_, i) => {
        const x = -len / 2 + ((i * 0.5 + (t * speed) % 0.5) % len);
        return <mesh key={i} position={[x, 0.73, 0]}><boxGeometry args={[0.06, 0.02, 1.2]} /><meshBasicMaterial color="#4A4552" /></mesh>;
      })}
      {parcels > 0 && Array.from({ length: n }).map((_, i) => {
        const k = ((t * speed) / len + i / n) % 1;
        if (k > parcels) return null;
        return <Parcel key={i} p={[-len / 2 + k * len, 0.74, 0]} s={0.9} rot={[0, (rnd(i) - 0.5) * 0.3, 0]} />;
      })}
    </group>
  );
};

export const Laptop: React.FC<{ p: V3; yaw?: number; screen: THREE.Texture; s?: number }> = ({ p, yaw = 0, screen, s = 1 }) => (
  <group position={p} rotation={[0, yaw, 0]} scale={s}>
    <ToyBox p={[0, 0.04, 0.25]} s={[1.5, 0.08, 1.0]} color="#C9C4BC" top="#DAD5CD" />
    <group position={[0, 0.06, -0.24]} rotation={[-0.22, 0, 0]}>
      <ToyBox p={[0, 0.5, 0]} s={[1.5, 1.0, 0.06]} color="#C9C4BC" />
      <mesh position={[0, 0.5, 0.035]}><planeGeometry args={[1.36, 0.86]} /><meshBasicMaterial map={screen} toneMapped={false} /></mesh>
    </group>
  </group>
);

// sticker stuck on a wall plane (decor)
export const WallSticker: React.FC<{ p: V3; tex: THREE.Texture; s?: number; rotY?: number; tilt?: number }> = ({ p, tex, s = 1.4, rotY = 0, tilt = 0 }) => (
  <group position={p} rotation={[0, rotY, tilt]}>
    <mesh><planeGeometry args={[s, s]} /><meshBasicMaterial map={tex} transparent toneMapped={false} /></mesh>
  </group>
);

export const LightCone: React.FC<{ p: V3; t: number; seed: number; color: string; r?: number; o?: number }> = ({ p, t, seed, color, r = 2.6, o = 0.07 }) => (
  <mesh position={[p[0] + Math.sin(t * 0.7 + seed) * 0.3, 6.5, p[2]]} rotation={[0, 0, Math.sin(t * 0.7 + seed) * 0.05]}>
    <coneGeometry args={[r, 12, 32, 1, true]} />
    <meshBasicMaterial color={color} transparent opacity={o} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} toneMapped={false} />
  </mesh>
);

export const Plant: React.FC<{ p: V3; t: number; s?: number; seed?: number }> = ({ p, t, s = 1, seed = 0 }) => (
  <group position={p} scale={s} rotation={[0, 0, Math.sin(t * 1.4 + seed) * 0.04]}>
    <mesh position={[0, 0.4, 0]} castShadow><cylinderGeometry args={[0.42, 0.32, 0.8, 12]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
    <mesh position={[0, 0.82, 0]}><cylinderGeometry args={[0.43, 0.43, 0.06, 12]} /><meshStandardMaterial color={SKC.OR} /></mesh>
    <mesh position={[0, 1.45, 0]} castShadow><coneGeometry args={[0.7, 1.4, 7]} /><meshStandardMaterial color="#3C8A3A" flatShading /></mesh>
    <mesh position={[0.2, 1.9, 0.1]} castShadow><coneGeometry args={[0.45, 0.9, 6]} /><meshStandardMaterial color="#4EA048" flatShading /></mesh>
  </group>
);

// the room: light oak walls, white wainscot with orange line, big window, company sign, sticker decor
export const ShirtRoom: React.FC<{ t: number; tex: Tex; sky?: string; sign?: boolean }> = ({ t, tex, sky = "#9FD8F2", sign = true }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, 0, -4]} receiveShadow>
      <planeGeometry args={[120, 120]} />
      <meshStandardMaterial map={tex.floor} roughness={0.8} />
    </mesh>
    <mesh position={[2, 9, -24]} receiveShadow><boxGeometry args={[80, 18, 0.5]} /><meshStandardMaterial map={tex.wall} roughness={0.8} /></mesh>
    <mesh position={[-20, 9, -4]} rotation={[0, Math.PI / 2, 0]} receiveShadow><boxGeometry args={[60, 18, 0.5]} /><meshStandardMaterial map={tex.wall} roughness={0.8} /></mesh>
    <mesh position={[24, 9, -4]} rotation={[0, -Math.PI / 2, 0]} receiveShadow><boxGeometry args={[60, 18, 0.5]} /><meshStandardMaterial map={tex.wall} roughness={0.8} /></mesh>
    {/* windows in the back wall */}
    {[-7, 11].map((x, wi) => (
      <group key={x} position={[x, 9.6, -23.6]}>
        <ToyBox p={[0, 0, 0]} s={[9, 6.4, 0.3]} color="#FFFFFF" cast={false} />
        <mesh position={[0, 0, 0.18]}><planeGeometry args={[8.2, 5.6]} /><meshBasicMaterial color={sky} toneMapped={false} fog={false} /></mesh>
        <mesh position={[2.2 - wi * 4, 1.2, 0.2]}><circleGeometry args={[0.7, 32]} /><meshBasicMaterial color="#FFF2B8" toneMapped={false} fog={false} /></mesh>
        {[0, 1, 2].map((k) => <mesh key={k} position={[-2.6 + k * 2.4 + Math.sin(t * 0.3 + k) * 0.3, -0.8 + (k % 2) * 1.4, 0.21]}><planeGeometry args={[1.6, 0.5]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.85} toneMapped={false} fog={false} /></mesh>)}
        <ToyBox p={[0, 0, 0.25]} s={[0.18, 5.6, 0.1]} color="#FFFFFF" cast={false} />
        <ToyBox p={[0, 0, 0.25]} s={[8.2, 0.18, 0.1]} color="#FFFFFF" cast={false} />
        <ToyBox p={[0, -3.4, 0.45]} s={[9.6, 0.26, 0.9]} color={SKC.OAK_D} cast={false} />
      </group>
    ))}
    {/* company sign between the windows */}
    <group position={[2, 13.2, -23.6]} visible={sign}>
      <mesh><planeGeometry args={[6.2, 1.69]} /><meshBasicMaterial map={tex.sign} transparent toneMapped={false} /></mesh>
    </group>
    {/* sticker decor on the walls */}
    <WallSticker p={[-13.5, 6.0, -23.7]} tex={tex.stShirt} s={2.0} tilt={0.12} />
    <WallSticker p={[17.5, 6.4, -23.7]} tex={tex.stCoin} s={1.8} tilt={-0.1} />
    <WallSticker p={[2, 6.2, -23.7]} tex={tex.stIdea} s={1.6} tilt={-0.06} />
    <WallSticker p={[-19.7, 6.5, -10]} tex={tex.stScissors} s={2.0} rotY={Math.PI / 2} tilt={0.08} />
    <WallSticker p={[23.7, 6.5, -10]} tex={tex.stBox} s={2.0} rotY={-Math.PI / 2} tilt={-0.08} />
    {/* rug under the founder desk */}
    <mesh position={[2.6, 0.012, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[5.4, 56]} /><meshStandardMaterial color="#F4ECE0" roughness={0.95} /></mesh>
    <mesh position={[2.6, 0.016, -1]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[5.0, 5.25, 56]} /><meshStandardMaterial color={SKC.OR} roughness={0.9} /></mesh>
    {/* plants and shelves along the walls */}
    <Plant p={[-16, 0, -20]} t={t} s={1.4} seed={1} />
    <Plant p={[20, 0, -20]} t={t} s={1.3} seed={3} />
    <Plant p={[-17, 0, 2]} t={t} s={1.2} seed={5} />
    {[[-12, -21.6], [16, -21.6]].map(([x, z], i) => (
      <group key={i} position={[x, 0, z]}>
        <ToyBox p={[0, 1.3, 0]} s={[3.4, 2.6, 1.0]} color="#FFFFFF" top="#F4ECE0" />
        {[0, 1, 2, 3].map((k) => <ToyBox key={k} p={[-1.2 + k * 0.8, 2.85, 0]} s={[0.6, 0.5, 0.6]} color={["#D7A86E", SKC.OR, "#D7A86E", "#FFFFFF"][k]} />)}
      </group>
    ))}
    {/* dust motes in the light */}
    {Array.from({ length: 90 }).map((_, i) => {
      const px = 2 + (rnd(i) - 0.5) * 34, pz = 8 - rnd(i + 9) * 28;
      const y = 0.8 + ((rnd(i + 3) * 8 + t * (0.18 + rnd(i + 5) * 0.2)) % 8);
      return (
        <mesh key={i} position={[px + Math.sin(t + i) * 0.2, y, pz]}>
          <boxGeometry args={[0.06, 0.06, 0.06]} />
          <meshBasicMaterial color="#FFF6DA" transparent opacity={0.35 + 0.35 * Math.sin(t * 3 + i)} toneMapped={false} />
        </mesh>
      );
    })}
  </group>
);

// ---------- 2D overlay pieces ----------
const CREAM = SKC.CREAM, INK = SKC.INK, OR = SKC.OR;
const dieCut = "0 0 0 6px #FFFFFF, 0 14px 0 6px rgba(0,0,0,.28), 0 30px 60px rgba(60,30,10,.35)";

// fixed series opening (wording from wirtschaftsbuch-v2): pops in on the given times
export const SeriesHook2D: React.FC<{ t: number; at: { ki: number; unt: number; null: number; alleine: number; tag: number; out: number }; day: number; top?: number }> = ({ t, at, day, top = 250 }) => {
  const out = ease((t - at.out) / 0.3);
  if (out >= 1) return null;
  const pop = (a: number) => back((t - a + 0.05) / 0.28);
  const line = (txt: string, a: number, size: number, color: string): React.ReactNode => {
    const k = pop(a);
    return <div style={{ fontFamily: "Rubik", fontWeight: 900, fontSize: size, lineHeight: 1.0, color, WebkitTextStroke: `${size * 0.1}px ${INK}`, paintOrder: "stroke fill", textShadow: `0 ${size * 0.09}px 0 ${INK}`, opacity: k > 0.01 ? 1 : 0, transform: `scale(${0.5 + 0.5 * k})` }}>{txt}</div>;
  };
  const tk = pop(at.tag);
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 1 - out, transform: `translateY(${out * -60}px)` }}>
      {line("KI BAUT EIN", at.ki, 92, "#FFFFFF")}
      {line("UNTERNEHMEN", at.unt, 104, "#FFFFFF")}
      {line("VON NULL", at.null, 108, OR)}
      <div style={{ marginTop: 12, opacity: pop(at.alleine) > 0.01 ? 1 : 0, transform: `scale(${0.5 + 0.5 * pop(at.alleine)}) rotate(-2deg)`, background: INK, color: "#FFFFFF", fontFamily: "Rubik", fontWeight: 900, fontSize: 52, padding: "10px 30px", borderRadius: 18, boxShadow: "0 0 0 5px #FFFFFF" }}>GANZ ALLEINE</div>
      <div style={{ marginTop: 18, opacity: tk > 0.01 ? 1 : 0, transform: `scale(${0.4 + 0.6 * tk}) rotate(3deg)`, background: "#FFFFFF", border: `6px solid ${INK}`, color: OR, fontFamily: "Rubik", fontWeight: 900, fontSize: 66, padding: "4px 36px", borderRadius: 22, boxShadow: `0 10px 0 ${INK}` }}>TAG {day}</div>
    </div>
  );
};

// step bar "1 · 2 · 3" (M-008): done = green check, active = orange, next = white
export const StepBar: React.FC<{ t: number; starts: number[]; labels?: string[]; top?: number; vis?: number }> = ({ t, starts, labels, top = 150, vis = 1 }) => {
  if (vis <= 0.001) return null;
  let active = -1; starts.forEach((s, i) => { if (t >= s) active = i; });
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: vis, transform: `translateY(${(1 - vis) * -30}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#FFFFFF", border: `5px solid ${INK}`, borderRadius: 60, padding: "10px 18px", boxShadow: "0 10px 0 rgba(0,0,0,.25)" }}>
        {starts.map((s, i) => {
          const done = i < active, on = i === active;
          const k = on ? back((t - s) / 0.35) : 1;
          return (
            <React.Fragment key={i}>
              {i > 0 && <div style={{ width: 34, height: 6, borderRadius: 3, background: i <= active ? SKC.GREEN : "#D8D2C6" }} />}
              <div style={{ display: "flex", alignItems: "center", gap: 10, transform: `scale(${on ? 0.8 + 0.2 * k : 1})` }}>
                <div style={{ width: 66, height: 66, borderRadius: 33, background: done ? SKC.GREEN : on ? OR : "#FFFFFF", border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Rubik", fontWeight: 900, fontSize: 38, color: done || on ? "#FFFFFF" : INK }}>{done ? "✓" : i + 1}</div>
                {on && labels?.[i] && <span style={{ fontFamily: "Rubik", fontWeight: 900, fontSize: 38, color: INK, paddingRight: 8 }}>{labels[i]}</span>}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Claude paper window. `shot` = path (staticFile) of the REAL claude.ai screenshot; until it exists a clearly marked
// placeholder is drawn instead (no redrawn Claude UI). `prompt` = the question as readable text strip (M-004).
export const ClaudePaper: React.FC<{ t: number; at: number; logo: string; shot?: string; slotLabel: string; prompt?: string; promptKey?: string; x?: number; y?: number; w?: number; h?: number; focus?: { x: number; y: number; z: number } }> = ({ t, at, logo, shot, slotLabel, prompt, promptKey, x = 60, y = 300, w = 960, h = 980, focus }) => {
  const k = back((t - at) / 0.4);
  if (k <= 0.001) return null;
  const bar = 92;
  const z = focus?.z ?? 1;
  const keyParts = prompt && promptKey && prompt.includes(promptKey) ? prompt.split(promptKey) : null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `scale(${0.7 + 0.3 * k}) rotate(${(1 - k) * -4}deg)`, opacity: Math.min(1, k * 1.5), transformOrigin: "50% 60%" }}>
      <div style={{ background: SKC.PAPER, border: `6px solid ${INK}`, borderRadius: 34, overflow: "hidden", boxShadow: dieCut }}>
        <div style={{ height: bar, background: "#EAE3D5", borderBottom: `6px solid ${INK}`, display: "flex", alignItems: "center", padding: "0 26px", gap: 14 }}>
          {["#E5534B", "#E9B23A", "#3FB950"].map((c) => <div key={c} style={{ width: 26, height: 26, borderRadius: 13, background: c, border: `4px solid ${INK}` }} />)}
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, marginRight: 90 }}>
            <Img src={logo} style={{ width: 46, height: 46 }} />
            <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 46, color: INK }}>claude.ai</span>
          </div>
        </div>
        <div style={{ position: "relative", height: h - bar - (prompt ? 0 : 0), overflow: "hidden", background: "#FAF8F3" }}>
          {shot ? (
            <Img src={shot} style={{ position: "absolute", width: "100%", transform: `scale(${z})`, transformOrigin: `${(focus?.x ?? 0.5) * 100}% ${(focus?.y ?? 0.5) * 100}%` }} />
          ) : (
            <div style={{ position: "absolute", inset: 26, borderRadius: 22, border: `5px dashed ${SKC.MUTED}`, backgroundImage: "repeating-linear-gradient(-45deg, rgba(138,133,125,.10) 0 18px, transparent 18px 36px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, textAlign: "center", padding: 40 }}>
              <div style={{ fontFamily: "Rubik", fontWeight: 900, fontSize: 40, color: SKC.MUTED, letterSpacing: 2 }}>PLATZHALTER</div>
              <div style={{ fontFamily: "Rubik", fontWeight: 900, fontSize: 56, color: INK, lineHeight: 1.1 }}>echter Screenshot<br />claude.ai</div>
              <div style={{ fontFamily: "Rubik", fontWeight: 800, fontSize: 38, color: OR, lineHeight: 1.2, marginTop: 6 }}>{slotLabel}</div>
            </div>
          )}
        </div>
      </div>
      {prompt && (
        <div style={{ position: "relative", marginTop: -70, marginLeft: 30, marginRight: 30, transform: `rotate(-1.5deg) scale(${back((t - at - 0.35) / 0.35)})`, background: "#FFFFFF", border: `6px solid ${INK}`, borderRadius: 30, padding: "22px 30px", boxShadow: dieCut }}>
          <div style={{ fontFamily: "Rubik", fontWeight: 900, fontSize: 28, color: OR, letterSpacing: 2, marginBottom: 6 }}>DEINE FRAGE</div>
          <div style={{ fontFamily: "Rubik", fontWeight: 800, fontSize: 54, color: INK, lineHeight: 1.15 }}>
            {keyParts ? <>{keyParts[0]}<span style={{ background: "#FFE3D6", color: SKC.OR_D, borderRadius: 10, padding: "0 8px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{promptKey}</span>{keyParts[1]}</> : prompt}
          </div>
        </div>
      )}
    </div>
  );
};

// keyword end card (M-007): "Schreib IDEE" + delivery in the sentence + a comment line being typed and sent
export const KeywordCard: React.FC<{ t: number; at: number; keyword: string; promise: string; top?: number }> = ({ t, at, keyword, promise, top = 300 }) => {
  const k = back((t - at) / 0.4);
  if (k <= 0.001) return null;
  const kw = back((t - at - 0.3) / 0.4);
  const typed = keyword.slice(0, Math.max(0, Math.floor((t - at - 0.9) * 9)));
  const sent = t > at + 1.0 + keyword.length / 9;
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${0.7 + 0.3 * k})`, opacity: Math.min(1, k * 1.5) }}>
      <div style={{ fontFamily: "Rubik", fontWeight: 900, fontSize: 76, color: "#FFFFFF", WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill", textShadow: `0 7px 0 ${INK}` }}>SCHREIB</div>
      <div style={{ marginTop: 10, transform: `scale(${0.5 + 0.5 * kw}) rotate(-3deg)`, background: OR, border: `8px solid ${INK}`, borderRadius: 40, padding: "6px 64px 14px", boxShadow: "0 0 0 8px #FFFFFF, 0 22px 0 8px rgba(0,0,0,.3)" }}>
        <span style={{ fontFamily: "Rubik", fontWeight: 900, fontSize: Math.min(190, 760 / (keyword.length * 0.66)), color: "#FFFFFF", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill", lineHeight: 1 }}>{keyword.toUpperCase()}</span>
      </div>
      <div style={{ marginTop: 46, background: "#FFFFFF", border: `6px solid ${INK}`, borderRadius: 30, padding: "18px 30px", boxShadow: dieCut, fontFamily: "Rubik", fontWeight: 800, fontSize: 46, color: INK, textAlign: "center", lineHeight: 1.18, whiteSpace: "pre-line" }}>{promise}</div>
      <div style={{ marginTop: 36, width: "100%", display: "flex", alignItems: "center", gap: 18, background: "#FFFFFF", border: `5px solid ${sent ? SKC.GREEN : INK}`, borderRadius: 60, padding: "14px 18px", boxShadow: "0 10px 0 rgba(0,0,0,.22)" }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: "#D8D2C6", border: `4px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Rubik", fontWeight: 900, fontSize: 26, color: INK }}>DU</div>
        <div style={{ flex: 1, fontFamily: "Rubik", fontWeight: 800, fontSize: 46, color: typed ? INK : SKC.MUTED }}>{typed || "Kommentar hinzufügen …"}{!sent && typed && <span style={{ opacity: Math.sin(t * 12) > 0 ? 1 : 0 }}>|</span>}</div>
        <div style={{ width: 70, height: 70, borderRadius: 35, background: sent ? SKC.GREEN : OR, border: `4px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontFamily: "Rubik", fontWeight: 900, fontSize: 36 }}>{sent ? "✓" : "➤"}</div>
      </div>
    </div>
  );
};

// small floating word sticker (M-011 key word / plan label)
export const WordSticker: React.FC<{ t: number; at: number; until?: number; text: string; bg?: string; fg?: string; x: number; y: number; size?: number; rot?: number; strike?: number }> = ({ t, at, until = 999, text, bg = "#FFFFFF", fg = INK, x, y, size = 64, rot = -3, strike = 0 }) => {
  const k = back((t - at) / 0.35) * (1 - ease((t - until) / 0.25));
  if (k <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${k}) rotate(${rot}deg)` }}>
      <div style={{ position: "relative", background: bg, border: `6px solid ${INK}`, borderRadius: 26, padding: "8px 30px 12px", boxShadow: "0 0 0 6px #FFFFFF, 0 14px 0 6px rgba(0,0,0,.28)", fontFamily: "Rubik", fontWeight: 900, fontSize: size, color: fg, whiteSpace: "nowrap" }}>
        {text}
        {strike > 0.001 && <div style={{ position: "absolute", left: 10, top: "50%", height: 14, width: `calc(${strike * 100}% - 20px)`, background: SKC.RED, border: `4px solid ${INK}`, borderRadius: 8, transform: "rotate(-4deg)" }} />}
      </div>
    </div>
  );
};

// ---------- product wall (hook "Heute findet die KI ihr Produkt") ----------
export type ProductCard = { label: string; icon: "coffee" | "candle" | "bone" | "web" | "plant" | "shirt" | "box" | "phone" | "soap" | "flyer" };
export const PRODUCTS: ProductCard[] = [
  { label: "KAFFEE", icon: "coffee" }, { label: "KERZEN", icon: "candle" }, { label: "HUNDEKEKSE", icon: "bone" },
  { label: "WEBSITES", icon: "web" }, { label: "FIRMENSHIRTS", icon: "shirt" }, { label: "PFLANZEN", icon: "plant" },
  { label: "BROTBOXEN", icon: "box" }, { label: "HANDYHÜLLEN", icon: "phone" }, { label: "SEIFE", icon: "soap" },
];
export const drawIcon = (c: CanvasRenderingContext2D, icon: ProductCard["icon"], x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.lineWidth = s * 0.07; c.strokeStyle = SKC.INK; c.lineJoin = "round"; c.lineCap = "round";
  const box = (bx: number, by: number, bw: number, bh: number, col: string, r = s * 0.06) => { c.fillStyle = col; roundRect(c, bx, by, bw, bh, r); c.fill(); c.stroke(); };
  if (icon === "coffee") { box(-s * 0.32, -s * 0.2, s * 0.5, s * 0.55, "#FFFFFF"); c.beginPath(); c.arc(s * 0.22, s * 0.05, s * 0.13, -1.4, 1.4); c.stroke(); c.fillStyle = "#7A4A2A"; c.fillRect(-s * 0.27, -s * 0.15, s * 0.4, s * 0.1); }
  if (icon === "candle") { box(-s * 0.16, -s * 0.12, s * 0.32, s * 0.5, "#FFE3D6"); c.fillStyle = SKC.GOLD; c.beginPath(); c.ellipse(0, -s * 0.28, s * 0.08, s * 0.14, 0, 0, 7); c.fill(); c.stroke(); }
  if (icon === "bone") { c.fillStyle = "#F6EEDC"; roundRect(c, -s * 0.3, -s * 0.07, s * 0.6, s * 0.14, s * 0.07); c.fill(); c.stroke(); [[-0.32, -0.1], [-0.32, 0.1], [0.32, -0.1], [0.32, 0.1]].forEach(([a, b]) => { c.beginPath(); c.arc(a * s, b * s, s * 0.1, 0, 7); c.fill(); c.stroke(); }); }
  if (icon === "web") { box(-s * 0.36, -s * 0.28, s * 0.72, s * 0.56, "#FFFFFF"); c.fillStyle = SKC.BLUE; c.fillRect(-s * 0.33, -s * 0.25, s * 0.66, s * 0.12); c.fillStyle = "#D8D2C6"; c.fillRect(-s * 0.26, -s * 0.02, s * 0.36, s * 0.07); c.fillRect(-s * 0.26, s * 0.1, s * 0.5, s * 0.07); }
  if (icon === "plant") { box(-s * 0.18, s * 0.05, s * 0.36, s * 0.3, SKC.OR); c.fillStyle = "#4EA048"; c.beginPath(); c.ellipse(-s * 0.12, -s * 0.12, s * 0.1, s * 0.2, -0.5, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.ellipse(s * 0.12, -s * 0.12, s * 0.1, s * 0.2, 0.5, 0, 7); c.fill(); c.stroke(); }
  if (icon === "shirt") { c.restore(); drawShirtGlyph(c, x, y, s * 0.82, SKC.OR); drawBotLogo(c, x, y - s * 0.02, s * 0.12); return; }
  if (icon === "box") { box(-s * 0.34, -s * 0.12, s * 0.68, s * 0.4, "#9DD8FF"); box(-s * 0.34, -s * 0.24, s * 0.68, s * 0.14, "#7FC2EE"); }
  if (icon === "phone") { box(-s * 0.18, -s * 0.34, s * 0.36, s * 0.66, SKC.PINK, s * 0.08); c.fillStyle = SKC.INK; c.beginPath(); c.arc(-s * 0.06, -s * 0.22, s * 0.05, 0, 7); c.fill(); }
  if (icon === "flyer") { box(-s * 0.2, -s * 0.36, s * 0.48, s * 0.62, "#FFFFFF"); box(-s * 0.3, -s * 0.28, s * 0.48, s * 0.62, "#FFE3D6"); c.fillStyle = SKC.OR; c.fillRect(-s * 0.24, -s * 0.2, s * 0.36, s * 0.1); c.fillStyle = "#D8D2C6"; c.fillRect(-s * 0.24, -s * 0.02, s * 0.3, s * 0.06); c.fillRect(-s * 0.24, s * 0.1, s * 0.36, s * 0.06); }
  if (icon === "soap") { box(-s * 0.3, -s * 0.12, s * 0.6, s * 0.34, "#C9F0DA", s * 0.12); c.fillStyle = "#FFFFFF"; [[-0.2, -0.25, 0.08], [0.05, -0.32, 0.1], [0.25, -0.22, 0.06]].forEach(([a, b, r]) => { c.beginPath(); c.arc(a * s, b * s, r * s, 0, 7); c.fill(); c.stroke(); }); }
  c.restore();
};
// whole pinboard as one canvas: cards get crossed out one after another (crossAt[i]), the keeper glows (keepK 0..1)
export const drawProductWall = (c: CanvasRenderingContext2D, w: number, h: number, t: number, crossAt: number[], keep: number, keepK: number, title = "WAS VERKAUFEN WIR?") => {
  c.clearRect(0, 0, w, h);
  // cork board
  c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, w, h, 40); c.fill();
  c.fillStyle = SKC.INK; roundRect(c, 10, 10, w - 20, h - 20, 32); c.fill();
  c.fillStyle = "#D9B48A"; roundRect(c, 20, 20, w - 40, h - 40, 26); c.fill();
  for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(110,70,30,${0.08 + rnd(i) * 0.12})`; c.fillRect(20 + rnd(i + 1) * (w - 40), 20 + rnd(i + 2) * (h - 40), 3, 3); }
  // title strip
  const th = 150;
  sticker(c, w * 0.16, 36, w * 0.68, th, 40, "#FFFFFF");
  c.fillStyle = SKC.INK; c.textAlign = "center"; c.textBaseline = "middle"; fitFont(c, title, 76, w * 0.6); c.fillText(title, w / 2 - 2, 36 + (th - 12) / 2 + 2);
  const cols = 3, rows = Math.ceil(PRODUCTS.length / cols);
  const gx = 46, gy = 220, cw = (w - gx * 2) / cols, ch = (h - gy - 40) / rows;
  PRODUCTS.forEach((p, i) => {
    const cx = gx + (i % cols) * cw + cw / 2, cy = gy + Math.floor(i / cols) * ch + ch / 2;
    const isKeep = i === keep;
    const crossK = isKeep ? 0 : ease((t - crossAt[i]) / 0.18);
    const pop = isKeep ? 1 + 0.12 * keepK + 0.03 * keepK * Math.sin(t * 6) : 1;
    const fade = isKeep ? 1 : 1 - 0.45 * crossK;
    c.save(); c.translate(cx, cy); c.rotate((rnd(i + 11) - 0.5) * 0.09); c.scale(pop, pop); c.globalAlpha = fade;
    const bw = cw - 34, bh = ch - 30;
    if (isKeep && keepK > 0.01) { c.shadowColor = SKC.OR; c.shadowBlur = 50 * keepK; }
    sticker(c, -bw / 2, -bh / 2, bw, bh, 34, isKeep && keepK > 0.01 ? "#FFF1E6" : SKC.CREAM);
    c.shadowBlur = 0;
    drawIcon(c, p.icon, 0, -bh * 0.1, bh * 0.52);
    c.fillStyle = SKC.INK; c.textAlign = "center"; c.textBaseline = "middle"; fitFont(c, p.label, bh * 0.15, bw - 70); c.fillText(p.label, -2, bh * 0.3);
    // pin
    c.fillStyle = isKeep ? SKC.OR : "#E5484D"; c.beginPath(); c.arc(0, -bh / 2 + 22, 13, 0, 7); c.fill(); c.lineWidth = 4; c.strokeStyle = SKC.INK; c.stroke();
    c.globalAlpha = 1;
    if (crossK > 0.001) {
      c.lineCap = "round";
      [["#FFFFFF", 40], [SKC.INK, 30], [SKC.RED, 20]].forEach(([col, lw]) => {
        c.strokeStyle = col as string; c.lineWidth = lw as number; c.beginPath();
        const L = bw * 0.36, Hh = bh * 0.34;
        c.moveTo(-L, -Hh); c.lineTo(-L + 2 * L * Math.min(1, crossK * 2), -Hh + 2 * Hh * Math.min(1, crossK * 2));
        if (crossK > 0.5) { c.moveTo(L, -Hh); c.lineTo(L - 2 * L * (crossK - 0.5) * 2, -Hh + 2 * Hh * (crossK - 0.5) * 2); }
        c.stroke();
      });
    }
    if (isKeep && keepK > 0.01) {
      c.save(); c.translate(bw * 0.36, -bh * 0.36); c.scale(keepK, keepK);
      c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(0, 0, 44, 0, 7); c.fill(); c.fillStyle = SKC.INK; c.beginPath(); c.arc(0, 0, 37, 0, 7); c.fill(); c.fillStyle = "#2FBF71"; c.beginPath(); c.arc(0, 0, 31, 0, 7); c.fill();
      c.strokeStyle = "#FFFFFF"; c.lineWidth = 9; c.beginPath(); c.moveTo(-13, 0); c.lineTo(-3, 11); c.lineTo(15, -10); c.stroke();
      c.restore();
    }
    c.restore();
  });
};
export const ProductWall: React.FC<{ p: V3; tex: THREE.Texture; w?: number; h?: number; yaw?: number; lift?: number }> = ({ p, tex, w = 7.2, h = 6.0, yaw = 0, lift = 0.6 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    {[-w / 2 + 0.5, w / 2 - 0.5].map((x) => <ToyBox key={x} p={[x, (h * 0.5 + lift) / 2, -0.34]} s={[0.22, h * 0.5 + lift, 0.22]} color={SKC.OAK_D} />)}
    {[-w / 2 + 0.5, w / 2 - 0.5].map((x) => <ToyBox key={x + 9} p={[x, 0.1, -0.34]} s={[0.9, 0.2, 1.2]} color={SKC.OAK_D} />)}
    <ToyBox p={[0, h / 2 + lift, -0.12]} s={[w + 0.1, h + 0.1, 0.16]} color="#FFFFFF" />
    <mesh position={[0, h / 2 + lift, -0.03]}><planeGeometry args={[w, h]} /><meshBasicMaterial map={tex} transparent toneMapped={false} /></mesh>
  </group>
);

// pass a real CREAM/INK to callers that need them
export const OVERLAY = { CREAM, INK, OR, dieCut };

// ======================================================================================================
// Tag-1-Final (2026-10-26): idea wall v2, hook v2, real-shot paper, cursor, 2D counter
// ======================================================================================================
export type IdeaCard = { label: string; icon: ProductCard["icon"] };
export type IdeaCardState = { flip: number; cross: number; keep: number; spot: number; reveal?: number };
// big readable idea wall: 2 columns, labels may break with "\n". flip 0 = product, 1 = "?"; reveal brings the keeper back.
export const drawIdeaWall = (c: CanvasRenderingContext2D, w: number, h: number, t: number, cards: IdeaCard[], st: IdeaCardState[], title = "WAS VERKAUFEN WIR?", dim = 0) => {
  c.clearRect(0, 0, w, h);
  c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, w, h, 40); c.fill();
  c.fillStyle = SKC.INK; roundRect(c, 10, 10, w - 20, h - 20, 32); c.fill();
  const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#E2BE92"); g.addColorStop(1, "#C99A6B");
  c.fillStyle = g; roundRect(c, 20, 20, w - 40, h - 40, 26); c.fill();
  for (let i = 0; i < 1100; i++) { c.fillStyle = `rgba(110,70,30,${0.07 + rnd(i) * 0.1})`; c.fillRect(20 + rnd(i + 1) * (w - 40), 20 + rnd(i + 2) * (h - 40), 3, 3); }
  const th = 132;
  sticker(c, w * 0.12, 34, w * 0.76, th, 40, "#FFFFFF");
  c.fillStyle = SKC.INK; c.textAlign = "center"; c.textBaseline = "middle"; fitFont(c, title, 70, w * 0.66); c.fillText(title, w / 2 - 2, 34 + (th - 12) / 2 + 2);
  const cols = 2, rows = Math.ceil(cards.length / cols);
  const gx = 34, gy = 190, cw = (w - gx * 2) / cols, ch = (h - gy - 30) / rows;
  // spot light pool (search)
  cards.forEach((p, i) => {
    const s = st[i];
    const cx = gx + (i % cols) * cw + cw / 2, cy = gy + Math.floor(i / cols) * ch + ch / 2;
    const bw = cw - 26, bh = ch - 22;
    const fl = s.reveal !== undefined ? s.flip * (1 - s.reveal) : s.flip;
    // flip: scaleX goes through 0 at 0.5
    const sx = Math.abs(Math.cos(fl * Math.PI));
    const showQ = fl > 0.5;
    const pop = 1 + 0.1 * s.keep + 0.06 * s.spot;
    c.save(); c.translate(cx, cy); c.rotate((rnd(i + 11) - 0.5) * 0.06); c.scale(pop * Math.max(0.02, sx), pop);
    if (s.spot > 0.01 || s.keep > 0.01) { c.shadowColor = s.keep > 0.01 ? SKC.OR : "#FFD27A"; c.shadowBlur = 60 * Math.max(s.spot, s.keep); }
    sticker(c, -bw / 2, -bh / 2, bw, bh, 34, s.keep > 0.01 ? "#FFF1E6" : showQ ? "#EDE6D8" : SKC.CREAM);
    c.shadowBlur = 0;
    c.textAlign = "center"; c.textBaseline = "middle";
    if (showQ) {
      c.fillStyle = SKC.MUTED; c.font = font(bh * 0.62); c.fillText("?", 0, bh * 0.0);
    } else {
      drawIcon(c, p.icon, 0, -bh * 0.17, bh * 0.44);
      const lines = p.label.split("\n");
      const fs = lines.length > 1 ? 72 : 80;
      c.fillStyle = SKC.INK;
      lines.forEach((ln, k) => { fitFont(c, ln, fs, bw - 60); c.fillText(ln, -2, bh * (lines.length > 1 ? 0.17 + k * 0.2 : 0.27)); });
    }
    c.fillStyle = s.keep > 0.01 ? SKC.OR : "#E5484D"; c.beginPath(); c.arc(0, -bh / 2 + 24, 13, 0, 7); c.fill(); c.lineWidth = 4; c.strokeStyle = SKC.INK; c.stroke();
    if (s.cross > 0.001) {
      c.fillStyle = `rgba(22,19,15,${0.28 * Math.min(1, s.cross * 2)})`; roundRect(c, -bw / 2 + 15, -bh / 2 + 15, bw - 34, bh - 42, 20); c.fill();
      c.lineCap = "round";
      [["#FFFFFF", 42], [SKC.INK, 32], [SKC.RED, 21]].forEach(([col, lw]) => {
        c.strokeStyle = col as string; c.lineWidth = lw as number; c.beginPath();
        const L = bw * 0.36, Hh = bh * 0.34, k1 = Math.min(1, s.cross * 2), k2 = Math.max(0, s.cross - 0.5) * 2;
        c.moveTo(-L, -Hh); c.lineTo(-L + 2 * L * k1, -Hh + 2 * Hh * k1);
        if (k2 > 0) { c.moveTo(L, -Hh); c.lineTo(L - 2 * L * k2, -Hh + 2 * Hh * k2); }
        c.stroke();
      });
    }
    if (s.keep > 0.01) {
      c.save(); c.translate(bw * 0.38, -bh * 0.34); c.scale(s.keep, s.keep);
      c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(0, 0, 50, 0, 7); c.fill(); c.fillStyle = SKC.INK; c.beginPath(); c.arc(0, 0, 42, 0, 7); c.fill(); c.fillStyle = "#2FBF71"; c.beginPath(); c.arc(0, 0, 35, 0, 7); c.fill();
      c.strokeStyle = "#FFFFFF"; c.lineWidth = 10; c.beginPath(); c.moveTo(-15, 0); c.lineTo(-4, 12); c.lineTo(17, -11); c.stroke();
      c.restore();
    }
    c.restore();
  });
  if (dim > 0) { c.fillStyle = `rgba(22,19,15,${dim})`; c.fillRect(0, 0, w, h); }
};

// opening text hook v2: lines pop on their own times, optional pill + day stamp
export const FirmaHook2D: React.FC<{ t: number; lines: { text: string; at: number; color?: string; size?: number }[]; pill?: { text: string; at: number }; day?: { n: number; at: number }; out: number; top?: number }> = ({ t, lines, pill, day, out, top = 120 }) => {
  const o = ease((t - out) / 0.3);
  if (o >= 1) return null;
  const pop = (a: number) => back((t - a + 0.05) / 0.28);
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: 1 - o, transform: `translateY(${o * -80}px)` }}>
      {lines.map((l, i) => { const k = pop(l.at); const size = l.size ?? 100; return <div key={i} style={{ fontFamily: "Rubik", fontWeight: 900, fontSize: size, lineHeight: 1.0, color: l.color ?? "#FFFFFF", WebkitTextStroke: `${size * 0.11}px ${INK}`, paintOrder: "stroke fill", textShadow: `0 ${size * 0.1}px 0 ${INK}`, opacity: k > 0.01 ? 1 : 0, transform: `scale(${0.5 + 0.5 * k})` }}>{l.text}</div>; })}
      <div style={{ display: "flex", gap: 22, alignItems: "center", marginTop: 14 }}>
        {pill && <div style={{ opacity: pop(pill.at) > 0.01 ? 1 : 0, transform: `scale(${0.5 + 0.5 * pop(pill.at)}) rotate(-2deg)`, background: INK, color: "#FFFFFF", fontFamily: "Rubik", fontWeight: 900, fontSize: 56, padding: "8px 30px", borderRadius: 18, boxShadow: "0 0 0 5px #FFFFFF" }}>{pill.text}</div>}
        {day && <div style={{ opacity: pop(day.at) > 0.01 ? 1 : 0, transform: `scale(${0.3 + 0.7 * pop(day.at)}) rotate(4deg)`, background: OR, border: `6px solid ${INK}`, color: "#FFFFFF", WebkitTextStroke: `5px ${INK}`, paintOrder: "stroke fill", fontFamily: "Rubik", fontWeight: 900, fontSize: 70, padding: "0 30px 4px", borderRadius: 22, boxShadow: `0 0 0 6px #FFFFFF, 0 12px 0 6px rgba(0,0,0,.3)` }}>TAG {day.n}</div>}
      </div>
    </div>
  );
};

// mouse pointer (white arrow, ink outline)
export const Cursor: React.FC<{ x: number; y: number; press?: number; size?: number }> = ({ x, y, press = 0, size = 64 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: size, height: size, transform: `scale(${1 - 0.18 * press})`, transformOrigin: "0 0", filter: "drop-shadow(0 6px 6px rgba(0,0,0,.45))", zIndex: 5 }}>
    {press > 0.01 && <div style={{ position: "absolute", left: -size * 0.5, top: -size * 0.5, width: size, height: size, borderRadius: "50%", border: `6px solid ${OR}`, opacity: press, transform: `scale(${1.6 - 0.6 * press})` }} />}
    <svg viewBox="0 0 24 24" width={size} height={size}><path d="M3 2 L3 19 L7.5 15 L10.5 22 L13.5 20.7 L10.6 14 L17 14 Z" fill="#FFFFFF" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" /></svg>
  </div>
);

// paper window around a REAL claude.ai screenshot (dark mode crop). view = centre (shot px) + zoom relative to fit-width.
export type ShotMark = { r: number[]; at: number; color?: "orange" | "red" | "yellow"; until?: number };
export const ShotPaper: React.FC<{
  t: number; at: number; out?: number; logo: string; src: string; px: [number, number];
  x?: number; y?: number; w?: number; h?: number;
  view: (t: number) => { cx: number; cy: number; z: number };
  marks?: ShotMark[]; reveal?: (t: number) => number; dimOthers?: number;
  cursor?: { x: number; y: number; press: number; vis: number };
}> = ({ t, at, out = 999, logo, src, px, x = 50, y = 300, w = 980, h = 720, view, marks = [], reveal, dimOthers = 0, cursor }) => {
  const k = back((t - at) / 0.4) * (1 - ease((t - out) / 0.25));
  if (k <= 0.001) return null;
  const bar = 84, bodyH = h - bar;
  const v = view(t);
  const fit = w / px[0];
  const s = fit * v.z;
  // translate so that (cx,cy) sits in the middle of the body, clamped to the shot edges
  let tx = w / 2 - v.cx * s, ty = bodyH / 2 - v.cy * s;
  tx = Math.min(0, Math.max(w - px[0] * s, tx)); ty = Math.min(0, Math.max(Math.min(0, bodyH - px[1] * s), ty));
  if (px[1] * s < bodyH) ty = (bodyH - px[1] * s) / 2;
  const rv = reveal ? reveal(t) : 1;
  const col = { orange: ["rgba(255,107,53,.28)", OR], red: ["rgba(229,72,77,.30)", SKC.RED], yellow: ["rgba(245,197,66,.25)", SKC.GOLD] };
  const rects = (m: ShotMark) => { const out: number[][] = []; for (let i = 0; i + 3 < m.r.length; i += 4) out.push(m.r.slice(i, i + 4)); return out; };
  const anyMark = marks.some((m) => t > m.at);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `scale(${0.75 + 0.25 * k}) rotate(${(1 - k) * -3}deg)`, opacity: Math.min(1, k * 1.5), transformOrigin: "50% 60%" }}>
      <div style={{ background: "#191919", border: `6px solid ${INK}`, borderRadius: 34, overflow: "hidden", boxShadow: dieCut }}>
        <div style={{ height: bar, background: SKC.PAPER, borderBottom: `6px solid ${INK}`, display: "flex", alignItems: "center", padding: "0 26px", gap: 14 }}>
          {["#E5534B", "#E9B23A", "#3FB950"].map((cc) => <div key={cc} style={{ width: 24, height: 24, borderRadius: 12, background: cc, border: `4px solid ${INK}` }} />)}
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, marginRight: 90 }}>
            <Img src={logo} style={{ width: 44, height: 44 }} />
            <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 44, color: INK }}>claude.ai</span>
          </div>
        </div>
        <div style={{ position: "relative", height: bodyH, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: tx, top: ty, width: px[0] * s, height: px[1] * s, clipPath: rv < 1 ? `inset(0 0 ${(1 - rv) * 100}% 0)` : undefined }}>
            <Img src={src} style={{ position: "absolute", width: "100%", height: "100%" }} />
            {anyMark && dimOthers > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(10,10,10,${dimOthers})` }} />}
            {marks.map((m, i) => {
              const mk = ease((t - m.at) / 0.3) * (m.until ? 1 - ease((t - m.until) / 0.2) : 1);
              if (mk <= 0.001) return null;
              const [bg, line] = col[m.color ?? "yellow"];
              return rects(m).map((r, j) => {
                const pad = 6 / s;
                const wj = (r[2] - r[0] + 2 * pad) * s;
                return <div key={`${i}-${j}`} style={{ position: "absolute", left: (r[0] - pad) * s, top: (r[1] - pad) * s, width: wj * Math.min(1, mk * 1.3), height: (r[3] - r[1] + 2 * pad) * s, background: bg, border: `${Math.max(4, 5)}px solid ${line}`, borderRadius: 12, boxShadow: `0 0 26px ${line}`, mixBlendMode: "normal" }} />;
              });
            })}
          </div>
          {cursor && cursor.vis > 0.01 && <div style={{ opacity: cursor.vis }}><Cursor x={tx + cursor.x * s} y={ty + cursor.y * s} press={cursor.press} size={72} /></div>}
        </div>
      </div>
    </div>
  );
};

// 2D counter sticker (label + rolling number) for the overlay layer
export const Counter2D: React.FC<{ t: number; at: number; out?: number; label: string; value: string; x: number; y: number; accent?: string; pulse?: number; rot?: number; scale?: number }> = ({ t, at, out = 999, label, value, x, y, accent = OR, pulse = 0, rot = -2, scale = 1 }) => {
  const k = back((t - at) / 0.35) * (1 - ease((t - out) / 0.25));
  if (k <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${k * scale * (1 + 0.08 * pulse)}) rotate(${rot}deg)` }}>
      <div style={{ background: CREAM, border: `7px solid ${INK}`, borderRadius: 34, padding: "10px 46px 14px", boxShadow: dieCut, textAlign: "center" }}>
        <div style={{ fontFamily: "Rubik", fontWeight: 900, fontSize: 40, color: accent, letterSpacing: 3 }}>{label}</div>
        <div style={{ fontFamily: "Rubik", fontWeight: 900, fontSize: 112, lineHeight: 1, color: INK, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{value}</div>
      </div>
    </div>
  );
};
