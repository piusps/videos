// Series economy for "Ein Superkind-Agent baut eine Firma" (fictional, labelled as such in the bio).
// Single source of truth for every episode: the shop ladder (what money buys, what appears in the world)
// and the sealed outcome of every vote, fixed BEFORE the episode is posted.
// Full rules: ~/Desktop/Superkind Videos/_Serie Superkind baut Firma/wirtschaftsbuch.md

export type Upgrade = { id: string; name: string; price: number; world: string };

// Bought in this order; each one adds something visible to the HQ island (the building is the series progress bar).
export const SHOP: Upgrade[] = [
  { id: "domain", name: "Domain + Logo", price: 15, world: "Schild am Grundstück" },
  { id: "ads1", name: "Werbe-Test", price: 100, world: "Plakatwand leuchtet" },
  { id: "server", name: "Eigener Server", price: 400, world: "Server-Rack neben dem Tisch" },
  { id: "agent2", name: "2. Agent", price: 1000, world: "zweiter großer Bot" },
  { id: "floor1", name: "1. Etage", price: 2500, world: "erstes Stockwerk auf dem Grundstück" },
  { id: "studio", name: "Studio", price: 5000, world: "Studio-Insel mit Licht" },
  { id: "ads2", name: "Ads-Maschine", price: 10000, world: "Werbe-Zeppelin am Himmel" },
  { id: "team10", name: "10 Agenten", price: 25000, world: "Agenten-Großraum, Etage 2" },
  { id: "product2", name: "2. Produkt", price: 50000, world: "neue Insel" },
  { id: "floors", name: "Etagen 3–6", price: 150000, world: "Turm wächst" },
  { id: "hq", name: "Firmenturm", price: 1000000, world: "fertiger Turm (Tag-100-Umriss)" },
];

export const nextUpgrade = (cash: number, owned: string[] = []) => SHOP.find((u) => !owned.includes(u.id) && u.price > 0) ?? SHOP[SHOP.length - 1];

// Outcome of a vote. kind: "volltreffer" (big win), "gut" (win), "solide" (small win), "rueckschlag" (loss).
export type Outcome = { kind: "volltreffer" | "gut" | "solide" | "rueckschlag"; delta: number; why: string; buys: string[] };
export type Episode = { day: number; cashStart: number; question: string; options: { key: "A" | "B"; title: string; risk: string; pot: string; outcome: Outcome }[];
  // what actually happened after the vote (filled in once the episode is closed)
  result?: { votes: { A: number; B: number }; decidedBy: "community" | "rival"; picked: string; outcome: Outcome } };

// Phase 1 (Tag 1–5, "Anlauf"): every option works — only the size and kind of growth differ.
// From the vote of Tag 5 on, the normal cycle runs (see wirtschaftsbuch.md). Branch-specific later days get added here before posting.
export const EPISODES: Episode[] = [
  {
    day: 1, cashStart: 0, question: "Welche Idee baut der Agent?",
    options: [
      { key: "A", title: "KI-Influencerin", risk: "RISIKO HOCH", pot: "€€€", outcome: { kind: "volltreffer", delta: 620, why: "erste Marke zahlt 400 € für einen Post, 220 € Affiliate", buys: ["domain", "ads1", "server"] } },
      { key: "B", title: "YouTube-Kanal", risk: "RISIKO NIEDRIG", pot: "€€", outcome: { kind: "gut", delta: 380, why: "Affiliate-Links in drei Videos + erstes Mini-Sponsoring 250 €", buys: ["domain", "ads1"] } },
    ],
    // 0 comments → the mail sender decided, and picked neither: option C (Pius, 2026-10-22)
    result: { votes: { A: 0, B: 0 }, decidedBy: "rival", picked: "KI-Automatisierungen für Firmen, mit Superkind",
      outcome: { kind: "volltreffer", delta: 900, why: "erster Kunde: Steuerkanzlei, 200 Rechnungen/Monat automatisiert, 900 € Einrichtung", buys: ["domain", "ads1", "server"] } },
  },
  {
    day: 2, cashStart: 385, question: "Wie holt der Agent mehr Kunden?",
    options: [
      { key: "A", title: "Werbung schalten", risk: "RISIKO MITTEL", pot: "€€€", outcome: { kind: "volltreffer", delta: 1400, why: "3 neue Firmen über Ads, je ~470 € Einrichtung", buys: ["agent2"] } },
      // slowed down 2026-10-23 (never shown before): 100 episodes need small steps, one customer at a time
      { key: "B", title: "Monats-Abo", risk: "RISIKO NIEDRIG", pot: "€€", outcome: { kind: "solide", delta: 49, why: "Kanzlei von Tag 1 wird erster Abo-Kunde: 49 €/Monat, ein Agent übernimmt ihr Postfach (80 Mails/Tag, 1 h gespart)", buys: [] } },
    ],
    // 0 comments again → the sender picked B (shown in Tag 3, 2026-10-23): 385 + 1.100 = 1.485 €, 2. Agent bought → 485 €
    result: { votes: { A: 0, B: 0 }, decidedBy: "rival", picked: "B Monats-Abo",
      outcome: { kind: "solide", delta: 49, why: "Kanzlei = 1. Abo-Kunde, 49 €/Monat", buys: [] } },
  },
];
