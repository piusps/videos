# Phase 3: Bildaufbau & Shotlist

Ziel: Für jede Sekunde ist klar, **was in welchem Feld passiert, woher das Bild kommt und woran Bild und Ton einrasten**. Ausgabe: `shotlist.md`.

## 3.1 Die fünf Bildmodi

| Modus | Wann | Aufbau |
|---|---|---|
| **A Split** (Standard) | Fragen, Arbeit, Ergebnisse | oben 1080×960 Bildschirm (Remotion), unten 1080×960 Tisch von oben, Naht = Scharnier, Captions auf der Naht |
| **B Kino-Insert Vollbild** | Hook, Hürde, Zeitsprung, End-Klammer | 1080×1920 echtes oder KI-Material, schräg/nah/Makro, 0,4–1,2 s pro Shot, oft 3–5 hintereinander |
| **C Ganzkörper** | Person lehnt sich zurück, steht auf, kommt rangelaufen, trinkt Kaffee, während der Agent arbeitet | Vollbild oder untere Hälfte. Zeigt „Hände weg, der Agent arbeitet“. |
| **D Screen-Vollbild** | großer Beweis (Liste mit 10 Entwürfen, Suchergebnis) | Bildschirm füllt 9:16, kurz (1–2 s), dann zurück in den Split |
| **E End-Card** | Schluss | weiß/orange oder schwarz, Claim Wort für Wort, superkind.ai |

Wechsle den Modus spätestens alle 4 s, oder es passiert ein deutliches Ereignis oben.

## 3.2 Raster pro Hälfte (siehe SKILL.md §0.2)
Für jeden Split-Schnitt in der Shotlist eintragen, **wo der Blick hingeht** (Feld oben/unten, links/mitte/rechts). Regeln:
- Zoom-Ziele oben liegen im mittleren Drittel. Liegt ein Ziel am Rand, erst Cursor/Fenster dorthin holen, dann zoomen.
- Unten sitzen Scharnier + Tastatur immer im oberen Drittel, Trackpad + aktive Hand in der Mitte. Wenn die Hand klickt, liegt der Finger im mittleren Feld, nicht am Bildrand.
- Oben und unten nie gleichzeitig zwei Blickziele mit Bewegung. Entweder die Hand unten bewegt sich (Ursache) und oben antwortet das Ziel direkt darüber, oder unten ruht alles.
- Pills, Panels und Labels nie hinter den Captions an der Naht (y 880–1040 frei halten) und nie rechts außen (IG-Buttons).

## 3.3 Kontinuität
- **Scharnier an der Naht:** Die obere Tastaturkante liegt in jedem Split-Frame bei y 930–990 der Gesamtfläche. Footage ohne sichtbare Tastaturkante taugt nicht für den Split (das war der Fehler am Morgen in v2). Solche Shots nur als Modus B/C.
- Pro Szene derselbe Laptop, dieselben Hände (Ring, Uhr, Ärmel), dasselbe Licht. Szenenwechsel (Abend → Morgen) dürfen Laptop und Tisch wechseln, aber nur über einen gestalteten Übergang (zuklappen, Wischer, Schwarz).
- POV: Die Kamera schaut von oben aus Sicht der Person, die Unterarme kommen von unten ins Bild. Stock von gegenüber 180° drehen (hflip+vflip).
- Keine fremden Tastaturlayouts, keine fremden Logos, keine lesbaren fremden Texte auf dem Tisch.
- Oben ist der Bildschirm des Laptops unten: gleiche Tageszeit (Abend = dunkles Wallpaper und warme Lampe unten, Morgen = helles Wallpaper und Tageslicht).

## 3.4 B-Roll-Typen und wofür

| Typ | Quelle | Gut für |
|---|---|---|
| 1 Klickdummy Desktop | Remotion (`SuperkindDesk.tsx`-Kit) | alles, was der Agent auf dem Bildschirm tut |
| 2 KI-Motion-B-Roll | MiniMax H3 Max (`gen-motion-broll.mjs`) mit echtem Stock-Frame als Startbild | konkrete Handlungen, die es nicht als Stock gibt: Diktier-Taste drücken, Laptop auf-/zuklappen, Finger klickt aufs Trackpad, Hand greift zur Tasse |
| 3 Echtes Stock-Video | Pexels (kein Wasserzeichen, ≥ 1080p) | Ruhe-Hände von oben, Ganzkörper (Person kommt, setzt sich, lehnt sich zurück, steht auf), Atmosphäre (Kaffee, Fenster, Stadt morgens) |
| 4 Eigene Animation (HTML/Remotion/HyperFrames) | selbst gebaut | Kino-Inserts ohne echte Kamera: UI-Makros, Zahlen, Fehlermeldung groß, Übergänge |
| 5 Schnelle Trailer-Cuts | Mix aus 2 + 3 | Hook und Zeitsprung: 3–5 Shots à 0,3–0,6 s, abwechselnd KI und echt, auf Musik-Beats |

## 3.5 Shotlist-Vorlage (`shotlist.md`)
```
| t von–bis | Modus | Oben (Feld: Inhalt) | Unten (Feld: Inhalt) | Quelle | Caption | Sync-Punkt (Frame) | SFX |
|---|---|---|---|---|---|---|---|
| 0,0–0,5 | B | – | – | KI: Person kommt an den Tisch | – | Schritt auf Beat 1 | Stoff/Stuhl |
| 2,4–2,9 | B | – | – | KI-Makro: Finger auf Diktier-Taste | – | Tastendruck = Klick-SFX | key |
| 3,0–9,0 | A | Mitte: Outlook, Pill „hört zu“ oben | oben: Tastatur an Naht, Mitte: Hände ruhen | Remotion + Stock | Frage 1 | – | listen |
| … |
```
**Gate:** Jede Zeile hat Modus, Feld-Angaben, Quelle (konkrete Datei oder „zu generieren: Prompt …“) und, wo sich unten etwas bewegt, einen Sync-Punkt.
