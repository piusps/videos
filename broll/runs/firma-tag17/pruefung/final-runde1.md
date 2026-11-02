# Prüfung final · Folge 17 „Was kostet der Versand der Shirts?“ · Runde 1 (Slot 2026-10-31 21:00)

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final), 2026-10-31. Nichts geändert (nur Belege in `pruefung/final-r1/` angelegt).
Gemini/OpenRouter nicht genutzt (402) → manuell Frame für Frame. ffmpeg nur `broll/node_modules/ffmpeg-static` + `@ffprobe-installer`.
Prüflinge (Stand 15:09): `firma-tag17-final.mp4` (44,560 s, 1080×1920, 30 fps, h264 9,9 Mbit/s, AAC 48 kHz), `firma-tag17-final-handy.mp4` (44,566 s, 1,82 Mbit/s), `cover.jpg` (1080×1920), `kontaktbogen-2fps.jpg`, `caption.txt`, `replies.json`, `versandpreis-guide.pdf` (+ `guidebook.json`, `guide-pages/p01–p09`).
Maßstab: `firma-tag16/pruefung/final-runde2.md` (8,0), `firma-tag14/pruefung/final-runde2.md` (8,5). Neue Regeln „Lehre Folgen 14–16“ angewandt.

## Belege (alle in `pruefung/final-r1/`)
- `full-4fps-01…08.jpg`: ganzes Video lückenlos 4 fps (je 6 s, Zeitstempel absolut)
- 30-fps-Streifen an allen Übergängen: `t30-0.70` (Hook-Abgang), `t30-4.75` (Hook→Board), `t30-6.00` (Board-Zoom), `t30-10.45` (Board→Briefe), `t30-13.10`, `t30-13.55` (Briefe→Heute), `t30-16.05` (Heute→Claude), `t30-18.30` (Shot 01→07), `t30-20.35` (Quellen→Uhr/Ergebnis), `t30-24.55` (Ergebnis→Warum), `t30-30.00` (Grund 1→17 %), `t30-32.85` (Warum→Als Nächstes), `t30-36.85` (→CTA), `t30-39.85` (Board→DM-Karte); Sammelbilder `tr-a…tr-e.jpg`
- Vollbilder `full_<s>.png` (0,0 / 0,6 / 2,0 / 4,0 / 5,5 / 8,0 / 12,0 / 13,2 / 14,5 / 15,0 / 16,5 / 18,0 / 19,0 / 19,5 / 22,0 / 23,5 / 26,5 / 28,9 / 31,0 / 34,0 / 35,5 / 36,5 / 37,0 / 38,5 / 39,6 / 40,25 / 41,5 / 43,0 / 44,0)
- Maskottchen: `mask-a.jpg`, `mask-crop-unten.jpg`, `mask-cta.jpg`, `hook-mask-0.9-1.2.jpg`, `cta-flieger-39.45.jpg`
- Schrift: `shirts-vgl-f16.png`, `claude-zeilen.jpg`, `cta-oben.png`, `cta-mitte.png`, `sizes2.png`
- Fakten/Datenschutz: `ergebnis-warum.jpg`, `stempel-4.0.png` (+ `f16-stempel-4.0.png`), `cover-vgl-f16.jpg`, `guide-1-5.jpg`
- Ton: `final-audio.mp3`, `stt-final-mix.json` (ElevenLabs Scribe der fertigen Mischung)

## Messwerte
| Punkt | Wert | Soll |
|---|---|---|
| Länge final / handy | 44,560 / 44,566 s | 40–48 s ✓ |
| STT fertige Mischung | wortgleich mit script.txt (nur bekannte STT-Formen „probiere“, „schicke“, Zahlen ausgeschrieben, „[Klingelton]“ = End-SFX); **kein „Tag“** | ✓ |
| Lautheit final / handy | −14,0 LUFS, LRA 2,3, Peak −1,2 dBFS / −14,1 LUFS | −14 ±0,5 ✓ |
| Musik unter Stimme | Sprache 21,2–22,7 −16,9 dB mean; Pausen nur Musik: 12,45 −33,3 · 24,0 (Mulde) −41,2 · 36,15 −33,4 · 43,5 −32,4 dB → ≥ 16 dB Abstand; Abschnitt 154,3–199,5 am Stück (musik.txt), kein Loop/Sprung hörbar | ≥ 15 dB ✓ |
| Leere/eingefrorene Frames | blackdetect 0, freezedetect (≥ 0,6 s) 0 | ✓ |
| Handy-Fassung | SSIM zum Master 0,995 (5 fps) | ✓ |
| Kontaktbogen-2fps | deckt sich mit dem Master | ✓ |
| Untertitel-Sync | Stichproben „Heute“ 13,77/13,80, „17“ 30,37/30,41, „Websuche“ 18,60/18,62, „Warum“ 24,90/24,86 | ≤ 0,1 s ✓ |
| Caption | 2097 Zeichen, Ende „(Fiktives Experiment, keine echten Umsätze.)“ + Leerzeile + 6 Hashtags, keine Emojis, „Tag“ nur in „100 Tage“ | ≤ 2100 ✓ (knapp) |
| replies.json | 1 + 5 Antworten, alle enden mit Frage, keine Emojis, keine Zusagen außer „Anleitung in DM“ | ✓ |

## Maskottchen-Durchgang (ganzes Video, eigener Durchgang; ≤ 1/3 verdeckt, Augen frei, keine Untertitel auf den Augen)
| Zeit | Zustand | Urteil |
|---|---|---|
| 0,0–0,45 | steigt von unten auf (noch nicht im Bild) | ok (Ereignis, wie F16) |
| 0,5–1,07 | ganz sichtbar; 0,93–1,07 halbtransparente „Unternehmen“-Pill auf der Stirn, Augen frei (`hook-mask-0.9-1.2.jpg`) | ok (wie F16-R2) |
| 1,10–4,87 | ganz weg (Raum ausgeblendet, Brief-Panel) | ok (ganz weg) |
| 4,90–5,00 | Raum + Maskottchen zurück, altes Brief-Panel noch 3 Frames darüber; Untertitel „ganz alleine führt“ auf der Kopfoberkante, Augen frei | ok (Mischframe → Bildfluss) |
| 5,03–6,13 | ganz sichtbar, Pill „Ich probier“/„aus“ auf der Kopfoberkante (≈ 10 %) | ok |
| 6,17–10,63 | Halbprofil unten rechts, ganz im Bild (`mask-crop-unten.jpg` Bild 3) | ok |
| 10,67–16,33 | Vollbild-Einschub Briefe/Heute: Maskottchen klein unten rechts **ganz sichtbar**, Unterkante im Bild, Augen frei (`full_12.0`, `full_13.2`, `full_14.5`) | ok – Soll „ganz sichtbar“ erfüllt |
| 16,37–24,73 | Claude-Fenster/Ergebnis: Maskottchen unter dem Fenster ganz sichtbar, „?“-Blase darüber (`full_18.0`, `full_22.0b`) | ok |
| 24,77–32,97 | Warum: Maskottchen ganz unter dem Panel, Oberkante berührt die Panelkante (`full_26.5`, `mask-cta.jpg` Bild 4) | ok |
| 33,0–36,97 | Als Nächstes: klein unten rechts ganz sichtbar (`full_34.0`, `full_35.5`) | ok |
| 37,07–39,90 | CTA groß; Untertitel „Shirt“/„Kommentiere Versand“ auf Mund/Unterkörper ≈ 25–30 %, Augen frei (`full_38.5`) | ok (knapp, wie F16) |
| 39,58–39,90 | DM-Flieger (≈ 25 × 40 px) fliegt über die Stirn und streift 39,78–39,85 das rechte Auge (`cta-flieger-39.45.jpg`) | ok, aber unschön (H2) |
| 39,93–44,56 | Untertitel erst auf dem Unterkörper (bis 40,45), dann über dem Kopf; Maskottchen ganz sichtbar, Hüpfer 44,0 mit Füßen ganz im Bild | ok |

**Kein Maskottchen-K.-o.** Vollbild-Einschübe einheitlich: Maskottchen dort ganz sichtbar (nicht halb). Maskottchen-Gesicht in 6–37 s weiter stark überstrahlt (fast weiß, wie F16-R2-03).

## Übergänge 30 fps – Befund
- Sauber (harter Schnitt im selben Frame, ohne Doppelbild): Board-Zoom 6,13→6,17; Briefe→Heute 13,73→13,77 (Pill auf „Heute“ 13,80); Heute→Claude 16,33→16,37 („Claude:“ 16,45); Shot 01→07 18,57→18,60 („Websuche“ 18,62); Quellen→Uhr 20,53→20,57; Ergebnis→Warum 24,73→24,77; Grund 1→17 % 30,33→30,37; Warum→Als Nächstes 32,97→33,0; Frage→CTA 37,03→37,07. Gegenüber F16 deutlich sauberer (keine Panel-Geister 16,07 / 18,53 / 24,03 mehr).
- Restschwächen (kein K.-o.):
  1. **1,067→1,100:** Raum, Stuhl, Hebel und Maskottchen verschwinden in einem Frame (F16-R1-05/R2-02 weiter offen).
  2. **4,90–5,00 (3 Frames):** altes Brief-Panel liegt noch über dem schon zurückgekehrten Raum mit Maskottchen, Board erscheint erst 5,03 (`t30-4.75`).
  3. **10,63→10,67:** 1 leerer Frame zwischen Board und Brief-Einflug, Kamera springt im selben Frame (Maskottchen Mitte → unten rechts) – unauffällig.
  4. **32,97–33,10:** Untertitel „Prozent vom Einzelshirt-Preis“ läuft 4 Frames in die neue Szene (Frage-Karte wächst darüber).
  5. **39,90→39,93:** Board verschwindet in einem Frame, DM-Karte steht sofort; im selben Frame wechseln die Augen von gefüllt auf hohl. 39,93–41,23 untere Hälfte des CTA-Panels leer (Ergebnis-Block erst 41,25).
  6. **3,75–4,87:** Stempel „GANZ ALLEINE.“ liegt hinter dem Brief-Panel, untere ≈ 30 % der Buchstaben und „G“ abgeschnitten (`stempel-4.0.png`; in F16 identisch, `f16-stempel-4.0.png`).

## Texte ≥ 58 px (Schriftgröße; Versalhöhe ≈ 0,72 × Schriftgröße gemessen an 1080×1920)
| Text | Zeit | Versalhöhe | ≈ Schriftgröße | Urteil |
|---|---|---|---|---|
| Hook-Frage | 0–6,1 | ≈ 60 | ≈ 85 | ✓ |
| „Versand: zzgl.“ (Lupe) | 0–4,9 / 22,8–24,7 | ≈ 43–45 | ≈ 60 | ✓ |
| **SHIRTS MIT LOGO** | 7,0–10,6 | **≈ 36** | **≈ 50** | ✗ (F16: ≈ 60 Versal, `shirts-vgl-f16.png` – Rückschritt) |
| HEUTE: SHIRT-VERSAND | 13,8–16,3 | ≈ 45 | ≈ 62 | ✓ |
| **Claude-Fenster: „Eine Datei geteilt, das Web durchsucht / und 5 weitere Schritte“, „Sources:“, „Printful – Shipping Speeds & Pricing“** | 18,6–20,5 | **≈ 38–40** | **≈ 53–55** | ✗ knapp |
| Datei-Karte „Kolonnenshirt_Serienbriefe.docx“ | 16,4–18,6 | ≈ 40 | ≈ 56 | knapp |
| KNAPP 2 MIN | 21,2–22,0 | ≈ 45 | ≈ 62 | ✓ |
| VERSAND EXTRA | 23,4–24,7 | ≈ 45 | ≈ 62 | ✓ |
| EINKAUFSPREIS FEHLT / 17 % VOM PREIS | 26,2–33,0 | ≈ 40–42 | ≈ 58 | ✓ (Grenze) |
| **Lauf-Zitat „Das kann ich nicht sicher beantworten.“** | 28,7–30,3 | **≈ 18** | **≈ 25** | ✗ (aussagender Beleg, nicht gesprochen) |
| Frage-Karte „Einkaufspreis Stick-Shirt?“ | 33,0–37,0 | ≈ 55 | ≈ 75 | ✓ |
| KOMMENTIERE / VERSAND | 37,1–44,6 | 77 / 65 | ✓ |
| DM VERSAND-ANLEITUNG / „in 10 Minuten · Preis durchgerechnet“ | 39,9–44,6 | ≈ 47 / 45 | ≈ 65 / 62 | ✓ (F16-R2-04 erledigt) |
| Chip „gesendet“ | 38,7–44,6 | ≈ 28 | ≈ 40 | ✗ (Engine, Backlog wie F14/F16) |
| Board-Feldtexte | 5–10,6 / 37–39,9 | ≈ 35 | ≈ 50 | Engine-Bestand, wie F13–F16 |

## Fakten gegen design/lauf/LAUF.md + Gegenprüfung + bericht.md
| Aussage im Video | Lauf | Urteil |
|---|---|---|
| „Fünf Briefe, Versandpreis fehlt.“ + gelbe Zeile „[Versandkosten und Lieferzeit ergänzen]“ | Lauf-16-Datei, Platzhalter-Wortlaut 1:1 | ✓ |
| „Briefe angehängt, Websuche bei Printful.“ / Shot 01, 07, 08 | 1 Datei, 5 Websuchen, 1 Seitenabruf printful.com/shipping; Quelle 1 „Printful – Shipping Speeds & Pricing“ | ✓ |
| „Nach knapp zwei Minuten“ / KNAPP 2 MIN | 1 min 39 s | ✓ |
| „im Brief: Versand extra“ / VERSAND EXTRA / „Versand: zzgl.“ | Briefzeile „Versand: zzgl. …“, Claude: „steht er im Brief separat“ | ✓ |
| „Ohne Einkaufspreis weiß sie nicht, ob er in den Preis passt.“ / EINKAUFSPREIS FEHLT / Zitat | „Das kann ich nicht sicher beantworten. Dafür fehlt mir dein Printful-Einkaufspreis …“ | ✓ |
| „Er frisst siebzehn Prozent vom Einzelshirt-Preis.“ / 17 % VOM PREIS | Claude: „etwa 17 % des Nettopreises“ (4,34 € / 25,13 € = 17,3 %). Auch bezogen auf den Brutto-Preis mit Claudes Briefbetrag: 5,20 € / 29,90 € = 17,4 %. Nur mit der Dollar-Umrechnung brutto/brutto wären es 14,5 %. | ✓ (Wort „netto“ fehlt, Aussage trotzdem belegt; H3) |
| „Als Nächstes: Was zahlt sie für das gestickte Shirt?“ | Übergabe-Vorschlag LAUF/bericht | ✓ |
| **Versandbeträge nur klein, nie gezoomt, nie neben Printful-Logo, nie als Printful-Preis** | 11,20/5,20 nur als Brieftext (≈ 12 px Glyphen) in Hook (`full_0.0`), Ergebnis (`ergebnis-warum.jpg` links) und Cover; Lupe zeigt nur „Versand: zzgl.“; im Warum-Akt Brief unscharf. Kein Printful-Logo im ganzen Video; Quellenzeile 19,4–20,5 ohne Beträge. Nie gesprochen. | ✓ |
| **Lieferzeit-Satz abgedeckt** | Briefzeile endet im Video überall nach „… bei einem Einzelshirt.“, „Lieferung in der Regel 4 bis 10 Werktage“ nirgends sichtbar (Hook, Ergebnis, Cover, Guide-Bild) | ✓ |
| **Screenshots 03 und 09 nicht im Video** | gezeigt: 01 (Anhang-Karte), 07 (Schritte-Zeile), 08 (Quellen), 06 (Datei-Karte), 04 (Zitat-Textur); keine Dollar-/Euro-Tarife, kein Lieferzeit-Absatz | ✓ |
| **Board im CTA = Stand nach der Folge** | 37,1–39,9: 1–4 + 7 Haken, 5 WEBSITE ENTWURF „in Arbeit“ (orange, nicht grün), 6 GEWERBE ohne Haken, 8 BRIEF + ADRESSEN gold mit „?“ (kein Haken, Briefe nicht versandfertig), 9 offen; HUD gleich. Entspricht beats.json `plan.notiz` (kein neues Feld) | ✓ |
| Verbote aus beats.json | kein Kuvert/Briefmarke (Karton-Icons), kein „versandfertig/inklusive/Gewinn“ im Video | ✓ |

**Caption:** Fakten deckungsgleich mit LAUF (1:39 → „knapp 2 Minuten“, 11,20/5,20 ausdrücklich „Claudes Eintrag, kein Printful-Preis“, Dollar/Kurs Juli 2026, Gegenprüfung 11,29/5,34, 17 % „des Nettopreises“, Haken Konto-Tarif/Stickdauer, Briefe nicht versandfertig). Schritt 2 ist eine verallgemeinerte Fassung des echten Prompts, nicht als „sinngemäß“ gekennzeichnet (H4, wie F16-H3).

## Datenschutz
- Briefe: Empfängerblock geschwärzt, Website im Datenschutzsatz geschwärzt, nur Platzhalter „[Dein Name]“ etc. lesbar (`full_0.0`, `full_13.2`, `ergebnis-warum.jpg`, Cover, Guide S. 3). Hintergrundbriefe im Hook ebenfalls geschwärzt.
- Claude-Fenster: nur Kopf „Claude“, keine Sidebar, keine Chatliste; übrige Quellenzeilen und erster Satz unscharf. Kein Name/Mail/Org lesbar.
- **Keine Verletzung.**

## Serienregeln / K.-o.-Liste
| K.-o. | verletzt? | Beleg |
|---|---|---|
| Frame 0: Frage + Ergebnis-Objekt | nein | `full_0.0.png` (Frage + Brief mit „Versand: zzgl.“) |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | nein | `full-4fps-01.jpg` (Wort-Pills, Paket 1,5, Sweep 2,0/3,0, Punch 2,5, Stempel 3,75, Puls 4,5, Board 5,0) |
| Kein gesprochenes „Tag“, kein TAG-Slam | nein | STT; nur HUD-Badge „TAG 4“ |
| Kein Umsatz-Zähler | nein | ganze Länge |
| Maskottchen ≤ 1/3, Augen frei, Einschübe ganz/ganz weg | nein | Tabelle oben |
| Namen/Adressen lesbar, Sidebar | nein | s. Datenschutz |
| Fakt falsch / Zahl gegen Bibel | nein | s. Fakten |

**Kein K.-o. verletzt.**

## Guide `versandpreis-guide.pdf` (9 Seiten, guide-pages p01–p09)
- Passt zum CTA: Trigger „Versand“, Titel „Deinen Preis mit Versand durchrechnen. In zehn Minuten.“, Inhalt = Prompt + Rechenweg (deckt „Anleitung … in zehn Minuten deinen Preis durch“).
- Rechnungen nachgerechnet: 4,99 + 4 × 1,45 = 10,79 $; × 0,87 = 9,39 € / 4,34 €; × 1,19 = 11,17 € / 5,17 €; Schwellen (109/1,19 − 9,39)/5 = 16,44 €, 25,13 − 4,34 = 20,79 €, (109 − 11,17)/5 = 19,57 €, 29,90 − 5,17 = 24,73 € – alle ✓. Gegenprüfung 9,49 € → 11,29 € / 5,34 € ✓.
- Nichts Unbelegtes: Beträge klar als Claudes Rechnung, „kein Printful-Preis“; Checkout als verbindlich; Lieferzeit ausdrücklich nicht übernommen; Variante B und Berufsbeispiele als „nicht getestet“ markiert; Klickpfad (Plus-Menü, Gedächtnis aus, Datei) = LAUF. Superkind-Satz „direkt in Slack und Teams“ = Serienstandard (identisch F16).
- ✓

## Noten je Kriterium
| Kriterium | Note | Beleg / Abzug |
|---|---|---|
| Hook (0–6 s) | 9 | Ergebnis-Brief + Frage ab Frame 0, dichte Ereignisse; Abzug Stempel hinter Panel |
| Serienrahmen Nicht-Erstfolge | 9 | kein „Tag“, kein Slam, kein Zähler |
| Ton: Stimme, Tempo, Aussprache | 9 | STT wortgleich, „Websuche“ korrekt, 109 Wörter in 43,3 s |
| Musik + Lautheit | 9 | −14,0 LUFS, Mulde vor „Warum?“ hörbar, ≥ 16 dB unter Stimme |
| Untertitel | 9 | synchron; CTA ≈ 25–30 % auf dem Unterkörper (knapp), 4 Frames Überhang 33,0 |
| **Text-Regeln / Lesbarkeit** | **7** | SHIRTS MIT LOGO ≈ 50 px (Rückschritt ggü. F16), Claude-Fenster-Zeilen ≈ 53–55 px, Lauf-Zitat ≈ 25 px, Chip „gesendet“ ≈ 40 px |
| Bildfluss / Maskottchen | 8 | kein K.-o., Einschübe einheitlich ganz sichtbar, Übergänge sauberer als F16; Abzug Hook-Abgang 1 Frame, 3 Mischframes 4,90–5,00, CTA-Mitte 39,93–41,23 leer, Flieger übers Auge |
| Fakten / Board / Kette | 9 | alles belegt, Board = Stand nach der Folge |
| Anonymisierung | 9 | sauber |
| CTA + Guide + Funnel | 9 | Guide deckt CTA, Rechnungen stimmen, replies ok |
| Look vs. Folge 13/16 | 8 | Ergebnis-Brief im Claude-Fenster stark; Abzug Maskottchen-Gesicht überstrahlt, Logo „SHIRT“ im Warum-Akt verwaschen, Claude-Fenster 16,4–18,6 nur eine Karte auf viel Leerfläche |
| Cover / Caption | 9 | Cover „Versand im Preis oder extra?“ + Serien-Pill wie F16, Beträge nur klein; Caption 2097 Zeichen (knapp unter 2100) |

**Scroller-Test:** 1 s Frage + Brief mit „Versand: zzgl.“-Lupe → bleibt; 3 s Licht-Sweep + „GANZ ALLEINE.“ → bleibt; 10 s Board + Shirt-Karte, dann fünf Briefe mit gelber Lücke → bleibt (Shirt-Karte auf dem Handy zu klein); 24 s VERSAND EXTRA-Stempel → bleibt.

## Vergleich
Ton, Fakten, Datenschutz, Guide gleichwertig zu F14/F16-R2. Bildfluss besser als F16-R2 (Panel-Geister weg). Lesbarkeit schwächer als F16-R2: dort waren alle Aussage-Karten ≥ 58, hier liegt die SHIRTS-Karte wieder darunter und das Claude-Fenster ist knapp darunter.

## Gesamtnote
**7,5 / 10** (Schnitt der Kriterien ≈ 8,6, aber Text-Regeln 7 < 8 → nach Regel nicht bestanden).

## Urteil
**Nicht bestanden (Runde 1).** Kein K.-o. Ein Kriterium unter 8 (Lesbarkeit). Korrektur klein und lokal (Skalierung zweier Elemente + eine Textzeile), danach Runde 2 mit frischem Agent; Ton/Musik/Fakten müssen dafür nicht angefasst werden.

## Tickets
```
TICKET final-R1-01 → firma-design   (blockierend)
Kriterium: Text-Regeln / Lesbarkeit · Note: 7/10
Beleg: 00:07,0–00:10,6 · pruefung/final-r1/shirts-vgl-f16.png, full_8.0.png
Problem: Karte „SHIRTS MIT LOGO“ hat ≈ 36 px Versalhöhe (≈ 50 px Schrift), in Folge 16 war sie ≈ 60 px Versalhöhe.
Soll: Schrift der Karte ≥ 58 px (Versalhöhe ≥ 42 px, Ziel wie F16 ≈ 60 px) bei 1080×1920; Karte bleibt ganz im Bild und verdeckt das Maskottchen nicht (≤ 1/3, Augen frei).
```
```
TICKET final-R1-02 → firma-design   (blockierend)
Kriterium: Text-Regeln / Lesbarkeit · Note: 7/10
Beleg: 00:16,4–00:20,5 · pruefung/final-r1/claude-zeilen.jpg, full_16.5.png, full_19.0.png, full_19.5.png
Problem: Echte Claude-Zeilen („Eine Datei geteilt, das Web durchsucht und 5 weitere Schritte“, „Sources:“, „Printful – Shipping Speeds & Pricing“, Datei-Karte) liegen bei ≈ 38–40 px Versalhöhe (≈ 53–56 px Schrift).
Soll: Die jeweils markierte Zeile / Datei-Karte im Fenster ≥ 58 px Schrift (Versalhöhe ≥ 42 px), z. B. per stärkerem Push-in auf den markierten Bereich; Fenster bleibt in seiner Einstellung ganz im Bild, keine Beträge (Shot 03/09) ins Bild, Maskottchen darunter weiter ganz sichtbar.
```
```
TICKET final-R1-03 → firma-design   (blockierend)
Kriterium: Text-Regeln / Lesbarkeit · Note: 7/10
Beleg: 00:28,7–00:30,3 · full-4fps-05.jpg (28,75–29,75), full-4fps-06.jpg (30,0)
Problem: Lauf-Zitat „Das kann ich nicht sicher beantworten.“ über der EINKAUFSPREIS-Karte ist ≈ 18 px Versalhöhe – aussagender Text, nicht lesbar.
Soll: Zitat ≥ 58 px Schrift oder ganz weglassen (Sprechtext trägt die Aussage); höchstens ein neuer Textblock gleichzeitig bleibt erfüllt.
```
```
TICKET final-R1-04 → firma-design   (Backlog, nicht blockierend)
Kriterium: Bildfluss / Look · Note: 8/10
Beleg: 00:01,067–00:01,10 (t30-0.70.jpg) · 00:04,90–00:05,00 (t30-4.75.jpg) · 00:03,75–00:04,87 (stempel-4.0.png) · 00:39,93–00:41,23 (full-4fps-07.jpg) · 00:39,58–00:39,90 (cta-flieger-39.45.jpg)
Problem: Hook-Raum verschwindet in einem Frame; 3 Frames altes Brief-Panel über dem zurückgekehrten Raum; Stempel „GANZ ALLEINE.“ hinter dem Panel abgeschnitten; CTA-Panel 1,3 s halb leer; DM-Flieger streift das rechte Auge.
Soll: Raum verlässt das Bild sichtbar (≥ 6 Frames) oder Schnitt mit SFX; Brief-Panel weg im selben Frame wie der Raum zurückkommt; Stempel vollständig vor dem Panel; Ergebnis-Block spätestens 0,3 s nach DM-Karte (oder Panel kleiner); Flieger endet an der DM-Karte, nie auf den Augen.
```
```
TICKET final-R1-05 → firma-design   (Backlog, Engine)
Kriterium: Text-Regeln · Note: 7/10
Beleg: 00:38,7–00:44,6 · cta-oben.png
Problem: Chip „gesendet“ ≈ 40 px Schrift (wie F14/F16).
Soll: Chip ≥ 58 px Schrift oder als reines Haken-Symbol ohne Text.
```
Hinweise: H1 Maskottchen-Gesicht 6–37 s weiter überstrahlt (F16-R2-03 offen). H2 CTA-Untertitel liegen mit ≈ 25–30 % knapp unter der 1/3-Grenze (F16-H4 nicht umgesetzt). H3 „siebzehn Prozent vom Einzelshirt-Preis“ ist belegt (netto 17,3 %, Briefbetrag/brutto 17,4 %); wer genauer will, Karte „17 % VOM NETTOPREIS“ – nicht nötig. H4 Caption-Schritt 2 als „sinngemäß“ kennzeichnen (Caption hat nur 3 Zeichen Luft bis 2100). H5 Augenwechsel gefüllt → hohl bei 39,93 wirkt wie ein Sprung, falls nicht gewollt angleichen.
