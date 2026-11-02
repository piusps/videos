# Phase 8: QC & Abgabe

## 8.1 Eigene Prüfung (vor Gemini)
Kontaktbögen bauen: Gesamt (1 s, beide Hälften), untere Hälfte (0,25 s) an jedem Sync-Punkt, obere Hälfte an jedem Zustandswechsel. Abhaken:
1. Hook ohne Split, mit physischer Aktion in den ersten 2 s
2. Scharnier an der Naht in **jedem** Split-Frame (Abend und Morgen)
3. Agent tut nichts, solange die Person spricht. „denkt“-Beat vorhanden.
4. Finger = Cursor = SFX frame-genau. Der Mensch-Cursor bewegt sich nur mit der Hand.
5. Kein Dauertippen. Hände ruhen, gestikulieren oder sind weg.
6. Hürde/menschlicher Moment vorhanden und aufgelöst
7. Zooms motiviert, keine Kamerafahrt beim Zuhören, Punch-ins schieben die Tastatur nicht unter die Naht
8. Captions genau auf der Naht, keine verschmolzenen Wörter, nichts verdeckt Captions
9. Weiß/Orange-Agent, echte Logos, kein Wasserzeichen, keine fremden Tastaturen/Marken, KI-Hände sauber (5 Finger, keine schmelzenden Tasten)
10. Alle Feedback-Punkte aus `auftrag.md` einzeln erledigt

## 8.2 Gemini-QC
`mcp__instagram-video-analyzer__analyze_local_video`, `media_resolution: default`. Immer konkret fragen, sonst kommt eine generische Zusammenfassung:
> „Answer in English. 1) In 0–3 s, is there a strong physical hook? 2) While the man speaks (t1–t2), does anything on the upper screen act on its own? 3) At <Sync-Zeiten>, does the finger press line up with the cursor click and the click sound? 4) Does the upper half read as the screen of the laptop below in both scenes? 5) Any AI artefacts in the hands? 6) Where would a viewer swipe away? Score 1–10 each, concrete fixes with timestamps.“

Ziel: jeder Punkt ≥ 8. Sonst nachbessern und neu rendern.

## 8.3 Abgabe (Abschluss-Checkliste)
- Ordner `~/Desktop/Superkind Videos/<Datum> <Thema>/`: Hauptvideo, Cover (starker Frame aus der Arbeits- oder Payoff-Phase), `– Texte.txt` (IG-Caption, TikTok-Caption, Skript, Quellen/Lizenzen inkl. Pexels-IDs, KI-Modell, Stimmen), `Versionen/` (alte Hauptvideos umbenennen, nie löschen), `Rohmaterial/` (Stimmen, KI-Clips, Voice-Track).
- Video + Cover per SendUserFile schicken, IG- und TikTok-Caption im Chat einfügen.
- Offene Kosten nennen (OpenRouter-Kontostand nach KI-Clips).
- Neue Regeln aus Pius' Feedback **in die passende Phase dieses Skills** schreiben, nicht in einen Sammel-Abschnitt.

## Outcome-Check (seit 2026-10-21)
- Was hat jemand gesehen, der bei Sekunde 2 / 6 abspringt? Die Antwort muss ein Ergebnis sein, kein Klick.
- Gibt es länger als 2 s Prozess ohne neues Ergebnis? Dann kürzen.
- Seit v9: jeden Haupt-Beat als Still in Scale 0,6 ansehen. Fragen: Wirkt das wie ein Apple-Screenshot? Ist die Tastatur gegradet? Gibt es harte schwarze Ränder?
- Seit v10: letzte 5 s unten Frame für Frame prüfen – keine Tastendrücke nach der Freigabe. Oben: zählt man mehr als einen Button/Avatar pro Bildschirm → zu voll.
