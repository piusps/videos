# Prüfung final · Folge 14 „Empfängerliste“ · Runde 2

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final), 2026-10-31, Eilauftrag. Nichts geändert.
Gemini 402 (wie R1) → manuell Frame für Frame. ffmpeg nur `node_modules/ffmpeg-static` + `@ffprobe-installer`.
Prüflinge (Stand 13:02): `firma-tag14-final.mp4` (45,700 s, 1080×1920, 30 fps, AAC 48 kHz), `firma-tag14-final-handy.mp4` (45,718 s), `cover.jpg/png`, `kontaktbogen-2fps.jpg`. Caption, replies.json, Guide seit R1 unverändert (Zeitstempel 11:59–12:34) → R1-Ergebnis gilt, nur Stichprobe.

## Belege (alle in `pruefung/final-r2/`)
- `full-4fps-01…08.jpg`: ganzes Video lückenlos 4 fps (je 6 s)
- 30-fps-Streifen an allen Übergängen: `t30-0470` (Hook→Plan), `t30-0580` (Plan→Rückblick), `t30-1290` (Plan→Brief), `t30-1570` (Briefe→Claude), `t30-2020` (Claude→Duell), `t30-2360` (Duell→Warum), `t30-3130` (Warum→Tabelle), `t30-3460` (Tabelle→Frage-Karte), `t30-3770` (Frage→CTA), `t30-3990` (Plan raus/DM), `t30-4500` (Endkarte); Sammelbilder `tr-a.jpg`, `tr-b.jpg`; Einzelframes `cut-3490-n1047-1052.jpg`
- Maskottchen: `mask-a.jpg` (13,5 / 14,75 / 17,0 / 35,5 s), `mask-b.jpg` (37,0 / 45,25 / 19,5 / 0,1 s), Vergleich `f13-1fps.jpg`
- Tickets: `board-10s.jpg`, `board-10s-b.jpg` (Feld 6/8), `dm-43.jpg`, `dm-43-b.jpg` (DM-Karte), `cover-pill.jpg`, `cover-kante.jpg`, `f13-cover-top.jpg`

## Messwerte
| Punkt | Wert | Soll |
|---|---|---|
| Länge final / handy | 45,700 / 45,718 s (wie R1) | unverändert ✓ |
| Ton unverändert | Mono-16-kHz-Korrelation neue Mischung ↔ R1-`final-audio.mp3`: **0,9997 bei Versatz 0** → identische Mischung, R1-STT (wortgleich script.txt, kein „Tag“) gilt weiter | ✓ |
| Lautheit final / handy | −14,0 LUFS, TP −0,9 dBFS, LRA 2,0 / −14,1 LUFS, TP −1,0 | −14 ±0,5 ✓ |
| Handy-Fassung | SSIM zum Master 0,988 (5 fps), 1080×1920, 1,79 Mbit/s | ✓ |
| Kontaktbogen-2fps | deckt sich mit dem neuen Master (Maskottchen 31,5–35 sichtbar, Board-Feld 8, „· 3 Blätter“) | ✓ |
| Caption | 2076 Zeichen, nur „Tage“, Ende Fiktiv-Hinweis + 6 Hashtags (Stichprobe) | ✓ |
| replies.json | 1 + 5, alle mit „?“, keine Emojis (Stichprobe) | ✓ |

## R1-Tickets – Abnahme
| Ticket | Ergebnis | Beleg |
|---|---|---|
| **R1-01 Maskottchen 31,5–35,0 (K.-o.)** | **erledigt.** Tabelle sitzt jetzt oben (y ≈ 100–330 von 593 im Streifen), Maskottchen in jedem Frame 31,5–34,93 s ganz sichtbar mit Kopf + Augen (^ ^), nur Unterkante leicht unter Lichtkegel. Ab 34,967 s Kamerawechsel: Maskottchen klein unten rechts, ganz im Bild | `full-4fps-06.jpg` 31,75–34,75; `t30-3130`, `t30-3460`, `cut-3490-n1047-1052.jpg` |
| R1-02 Board Feld 8 / GEWERBE | Feld 8 „8 · BRIEF + ADRESSEN“ zweizeilig, „?“ oben rechts, keine Überlappung ✓. Feld 6 „GEWERBE · MENSCH“ ohne Haken ✓, aber nur Text, kein Personen-Symbol (Soll nannte Symbol) → nicht blockierend | `board-10s-b.jpg`, 5–13 s und 38–40 s |
| R1-03 Cover | WIDERSPRUCH-Chip endet ≈ 24 px vor der Kartenkante ✓; orange Serien-Pill unter dem Titel vorhanden, identisch zu F13 ✓ | `cover-kante.jpg`, `cover-pill.jpg`, `f13-cover-top.jpg` |
| R1-04 DM-Karte | Text jetzt „„… Erfinde nichts.“ · 3 Blätter“ ✓ (passt zu Guide S. 5). Schrift ≈ 32 px ≈ 1,7 % Bildhöhe, Soll ≥ 3 % nicht erreicht (laut Design Engine-Grenze) → Backlog | `dm-43-b.jpg` |
| H4 WIDERSPRUCH-Mini-Karte | erledigt: ALS NÄCHSTES ab 35,17 s, Mini-Karte ab ≈ 36,4 s (≈ 1,25 s Abstand) | `full-4fps-07.jpg` |

## Maskottchen im ganzen Video (≤ 1/3 verdeckt)
| Zeit | Zustand | Urteil |
|---|---|---|
| 0,0–0,25 | fällt von oben ins Bild (noch nicht da) | ok (Ereignis, R1 abgenommen) |
| 0,5–6,0 | ganz sichtbar bzw. während Hook-Karte 1,0–5,0 außerhalb des Bildausschnitts | ok |
| 6,25–13,0 | Nahaufnahme, Untertitel liegt über Stirn/Augen (≈ 15–25 %), Körper ganz | ok |
| **13,25–15,75** | **Brief-Vollbild-Einschub: nur Unterhälfte + Fuß sichtbar (≈ 70 % verdeckt)** | Vollbild-Einschub, kein Panel-Glitch; identisch zu R1 und zu F13 (abgenommen 8,5, `f13-1fps.jpg` 14–15 s). **Nicht K.-o.**, aber Hinweis H1 |
| **16,0–20,4** | **Claude-Fenster vollflächig, vom Maskottchen nur Lichtkante/Kante sichtbar** | Vollbild-Einschub wie F12/F13, Maskottchen faktisch „nicht im Bild“. Nicht K.-o. |
| 20,5–31,5 | ganz sichtbar (Duell), im Warum 24–31,5 Kopfoberkante ≈ 20 % unter dem Panel | ok (≤ 1/3) |
| 31,5–34,93 | ganz sichtbar | ok – **R1-K.-o. behoben** |
| 34,97–37,9 | klein unten rechts, ganz im Bild | ok |
| 38,0–42,4 | Groß-Nahaufnahme, Unterkante vom Bildrand angeschnitten, Augen frei | ok (Kameraeinstellung) |
| 42,5–45,7 | Endkarte; beim Hüpfer 45,2–45,5 liegt die Untertitel-Pille über den Augen (≈ 25 %) | ok, Kleinigkeit |

## Übergänge 30 fps – Befund
- Alle Akt-Übergänge sauber (Hook→Plan 4,9; Plan-Zoom 6,1; Plan→Brief 13,1–13,3 mit Flug; Briefe→Claude 15,8–16,0; Claude→Duell 20,47; Duell→Warum 23,77 mit 2 Frames Doppel-Panel; Warum→Tabelle 31,63–31,73 mit 3 Frames Panel-Geist darunter; Frage→CTA 37,93; Plan-Ausblendung 40,1–40,5; DM-Karte fliegt 40,3–40,5).
- **34,967–35,133 s (5 Frames):** Hintergrund springt per Kamera-Schnitt (Maskottchen von Mitte nach unten rechts, Untertitel „nur eine“ springt nach oben), während die Tabelle stehen bleibt; in Frame 1049–1050 ein dunkles Rechteck links über dem Untertitel (Geist der Frage-Karte), in Frame 1051–1054 schaut die weiße Frage-Karte unten hinter der Tabelle hervor (Design meldete 2 Frames, es sind 4). Ab 35,167 s Frage-Karte sauber. 0,17 s, auf dem Handy als kurzes Zucken wahrnehmbar, kein K.-o.

## K.-o.-Liste
| K.-o. | verletzt? | Beleg |
|---|---|---|
| Frame 0: ganze Frage + Ergebnis-Objekt | nein | `mask-b.jpg` Bild 4 (0,1 s) |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | nein | `full-4fps-01.jpg`, unverändert ggü. R1 |
| Nicht-Erstfolge: kein gesprochenes „Tag“, kein TAG-Slam | nein | Ton identisch zu R1 (Korrelation 0,9997), nur HUD-Badge „TAG 4“ |
| Kein Umsatz-Zähler | nein | ganze Länge; Board 9 „ERSTER UMSATZ“ offen |
| Maskottchen ≤ 1/3 verdeckt (außer Vollbild-Einschüben) | **nein** (R1-Verstoß behoben) | s. Tabelle oben |
| Keine echten Namen/Adressen lesbar | nein | Briefkopf nur unscharfe Platzhalter, Tabelle nur Balken, Dateinamen ohne Personen (`mask-a.jpg`, `mask-b.jpg`) |
| Keine Sidebar | nein | Claude-Fenster ohne Sidebar/Chatliste 16–20,4 s |
| Fakten 1:1, Zahlen nicht gegen Bibel | nein | unverändert ggü. R1; „3 Blätter“ = Guide S. 5 |

**Kein K.-o. verletzt.**

## Noten je Kriterium
| Kriterium | Note | Beleg / Abzug |
|---|---|---|
| Hook (0–6 s) | 9 | unverändert, Ergebnisbild + offene Frage ab Frame 0 |
| Serienrahmen Nicht-Erstfolge | 9 | unverändert |
| Ton: Stimme, Tempo, Aussprache | 9 | Mischung identisch zu R1 |
| Musik + Lautheit | 9 | −14,0 LUFS / TP −0,9 |
| Untertitel | 9 | unverändert synchron |
| Text-Regeln | 8 | H4 behoben; DM-Unterzeile und Warum-Unterzeilen weiter < 3 % Bildhöhe |
| Bildfluss / Maskottchen | 8 | K.-o. behoben, sauberer Akt 31,5–35; Abzug: 5-Frame-Zucken 34,97–35,13 s; Maskottchen in den Vollbild-Einschüben 13,25–15,75 halb sichtbar (Serienstandard) |
| Fakten / Board / Kette | 9 | Feld 8 vollständig lesbar; GEWERBE · MENSCH als Text (kein Symbol) |
| Anonymisierung | 9 | unverändert 0 Treffer |
| CTA + Guide + Funnel | 9 | „3 Blätter“ deckt sich mit dem Guide |
| Look vs. Folge 13 | 8 | gleichwertig; Warum-Panel 24,0–25,2 s weiter fast leer (H3 aus R1 offen) |
| Cover / Caption | 9 | Chip-Abstand + Serien-Pill wie F10–F13 |

**Scroller-Test** (unverändert ggü. R1): 1 s Ampel-Liste mit Frage → bleibt; 3 s Statusspalte + „GANZ ALLEINE.“ → bleibt; 10 s Rückblick-Board, schwächster Moment, ab 13,1 s Brief + HEUTE: ADRESSEN → knapp bleibt.

## Vergleich mit Folge 13 (final 8,5)
Hook ≥ F13, Klarheit gleich, Look gleich; der Fehler aus R1 ist weg, damit auf F13-Niveau.

## Gesamtnote
**8,5 / 10** (Schnitt ≈ 8,75, alle Kriterien ≥ 8, kein K.-o.).

## Urteil
**Bestanden** (Runde 2). Video kann an Pius. Kein Neu-Render nötig.

## Tickets (nicht blockierend, Design-Backlog, nicht für diese Folge neu rendern)
```
TICKET final-R2-01 → firma-design   (Backlog)
Kriterium: Bildfluss · Note: 8/10
Beleg: 00:34,967–00:35,133 (Frames 1049–1054) · pruefung/final-r2/cut-3490-n1047-1052.jpg, t30-3460.jpg
Problem: Hintergrund-Schnitt läuft unter der noch stehenden Tabelle durch; 2 Frames dunkles Geist-Rechteck, 4 Frames Frage-Karte hinter der Tabelle.
Soll: Kamera-Schnitt und Tabellen-Abgang auf denselben Frame (oder Tabelle ≥ 2 Frames vorher weg); im 30-fps-Streifen ±0,3 s kein Frame mit zwei Szenen gleichzeitig.
```
```
TICKET final-R2-02 → firma-design   (Backlog, Engine)
Kriterium: Text-Regeln · Note: 8/10
Beleg: 00:40,5–00:45,7 · dm-43-b.jpg; Warum-Unterzeilen 25–31 s
Problem: Unterzeilen (DM „… Erfinde nichts.“ · 3 Blätter“, „Anschrift muss rein“, „selbst“, „bei 2 von 5“) ≈ 1,3–1,7 % Bildhöhe, auf dem Handy kaum lesbar.
Soll: Engine-Option für Unterzeilen ≥ 3 % Bildhöhe (≥ 58 px), ab Folge 15.
```
```
TICKET final-R2-03 → firma-design / firma-regie   (Backlog, Serienregel klären)
Kriterium: Bildfluss / Maskottchen · Note: 8/10
Beleg: 00:13,25–00:15,75 · mask-a.jpg Bild 1–2 (auch F13 14–15 s)
Problem: Im Brief-Vollbild-Einschub ragt die untere Maskottchen-Hälfte samt Fuß unter dem Brief hervor (≈ 70 % verdeckt) – gleiche Optik wie der R1-K.-o., nur als Vollbild.
Soll: In Vollbild-Einschüben ist das Maskottchen entweder ganz weg (Kamera höher/Brief bis Bildunterkante) oder ganz sichtbar; Regel in die Serien-Bibel, damit Prüfer und Design dieselbe Messlatte haben.
```
Weitere Hinweise: H-a Feld 6 „GEWERBE · MENSCH“ mit Personen-Symbol (R1-02-Rest); H-b Warum-Panel 24,0–25,2 s nicht größer als sein Inhalt (R1-H3 offen).
