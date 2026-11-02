import React from "react";
import { Img, staticFile } from "remotion";
import { SIMPLE_ICONS } from "./logoPaths";

// Brand logos, flags and illustrated (not real) profile pictures for the Explainer
// B-Rolls (user request 2026-09-29: real app logos next to the names, flags for the
// countries, every message sender with their own face).

// Gmail, HubSpot, SAP, Datev come from Simple Icons (CC0). Slack, Teams and Outlook are
// not in Simple Icons, so they are drawn as their recognisable marks in brand colours.
// Real app logos (official SVGs from Wikimedia Commons in public/logos) wherever we have them.
// Pius 2026-10-20: never self-drawn marks (the old hand-built Slack hash read like a swastika).
const REAL_LOGOS = ["slack", "teams", "outlook", "gmail", "sheets", "drive", "calendar", "whatsapp", "chatgpt", "claude", "sap", "dropbox"];
const ALIAS: Record<string, string> = { email: "gmail", googlesheets: "sheets", googledrive: "drive", googlecalendar: "calendar", openai: "chatgpt", microsoftteams: "teams", microsoftoutlook: "outlook" };
export const BrandLogo: React.FC<{ name: string; size?: number }> = ({ name, size = 40 }) => {
  const raw = name.toLowerCase().replace(/[^a-z]/g, "");
  const key = ALIAS[raw] ?? raw;
  if (REAL_LOGOS.includes(key)) return <Img src={staticFile(`logos/${key}.svg`)} style={{ width: size, height: size, objectFit: "contain", display: "block" }} />;
  if (SIMPLE_ICONS[key]) return <SI slug={key} size={size} />;
  return null;
};

const SI: React.FC<{ slug: string; size: number }> = ({ slug, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d={SIMPLE_ICONS[slug].d} fill={SIMPLE_ICONS[slug].hex} /></svg>
);

// Simplified national flags (rounded), same size and treatment for every country.
export const Flag: React.FC<{ country: "us" | "cn" | "de"; size?: number }> = ({ country, size = 40 }) => {
  const w = size * 1.4;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 30 20" style={{ borderRadius: size * 0.16, boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }}>
      {country === "de" && (<><rect width="30" height="6.67" fill="#000" /><rect y="6.67" width="30" height="6.67" fill="#DD0000" /><rect y="13.33" width="30" height="6.67" fill="#FFCE00" /></>)}
      {country === "cn" && (<><rect width="30" height="20" fill="#DE2910" /><polygon points="5,2.5 5.9,5.2 8.7,5.2 6.4,6.9 7.3,9.6 5,8 2.7,9.6 3.6,6.9 1.3,5.2 4.1,5.2" fill="#FFDE00" />{[[10, 2], [12, 4], [12, 7], [10, 9]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.8" fill="#FFDE00" />)}</>)}
      {country === "us" && (<>
        {Array.from({ length: 7 }).map((_, i) => <rect key={i} y={i * (20 / 6.5)} width="30" height={20 / 13} fill="#B22234" />)}
        <rect width="30" height="20" fill="none" />
        <rect width="13" height="10.8" fill="#3C3B6E" />
        {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={1.8 + (i % 4) * 3.1} cy={1.8 + Math.floor(i / 4) * 3.4} r="0.55" fill="#fff" />)}
      </>)}
    </svg>
  );
};

// Illustrated profile pictures: varied skin, hair and background per seed. Not real people.
const SKIN = ["#F2D0B5", "#E8B894", "#C98E63", "#8D5A3B", "#F6DCC8", "#B97A53"];
const HAIR = ["#2B2118", "#6B4428", "#C8A26B", "#1B1B1B", "#8E3B1F", "#9A9A9A"];
const BG = ["#DCE8F7", "#F7E2D5", "#E3F1E4", "#EFE3F6", "#F6F0D6", "#E0EEF0"];
export const FaceAvatar: React.FC<{ seed: number; size?: number }> = ({ seed, size = 70 }) => {
  const s = (n: number) => (seed * 7 + n * 13) % 6;
  const long = seed % 3 === 1;
  const glasses = seed % 4 === 2;
  const beard = seed % 5 === 3;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ borderRadius: "50%", flexShrink: 0 }}>
      <rect width="40" height="40" fill={BG[s(1)]} />
      {long && <path d="M10 18 Q10 6 20 6 Q30 6 30 18 L31 34 L9 34 Z" fill={HAIR[s(2)]} />}
      <path d="M6 40 Q7 29 20 28 Q33 29 34 40 Z" fill={["#2F3E5C", "#5B6770", "#A33B2B", "#2E5E4E", "#454545", "#6B4E8A"][s(3)]} />
      <rect x="17" y="23" width="6" height="6" rx="2" fill={SKIN[s(4)]} />
      <ellipse cx="20" cy="17" rx="7.2" ry="8.2" fill={SKIN[s(4)]} />
      {!long && <path d="M12.6 15 Q13 7.5 20 7.8 Q27 7.5 27.4 15 Q24 11.5 20 11.8 Q15.5 11.5 12.6 15 Z" fill={HAIR[s(2)]} />}
      {long && <path d="M12.8 14 Q14 8.5 20 8.6 Q26 8.5 27.2 14 Q23 10.8 17 12 Z" fill={HAIR[s(2)]} />}
      {beard && <path d="M13.5 19 Q14 25.5 20 25.6 Q26 25.5 26.5 19 Q24 22.5 20 22.5 Q16 22.5 13.5 19 Z" fill={HAIR[s(2)]} opacity="0.85" />}
      <circle cx="17.2" cy="17" r="0.9" fill="#222" /><circle cx="22.8" cy="17" r="0.9" fill="#222" />
      {glasses && (<g fill="none" stroke="#222" strokeWidth="0.7"><circle cx="17.2" cy="17" r="2.3" /><circle cx="22.8" cy="17" r="2.3" /><path d="M19.5 17 H20.5" /></g>)}
      <path d="M17.8 21.2 Q20 22.6 22.2 21.2" fill="none" stroke="#7A3E2E" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
};
