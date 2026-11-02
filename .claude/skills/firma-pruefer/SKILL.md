---
name: firma-pruefer
description: Prüfer für die Serie "Superkind baut eine Firma" (@pickthecompany) - prüft nach jedem Schritt, ob firma-spy, firma-autor, firma-regie und firma-design ihre Aufgabe richtig gemacht haben, mit einer festen Bewertung pro Schritt (Note 1–10 je Kriterium), und schickt alles unter 8 als konkretes Korrektur-Ticket an den zuständigen Skill zurück, bis es besteht (höchstens 3 Runden, dann ehrlicher Bericht an Pius). Prüft am Ende das fertige Video Frame für Frame, Ton, Untertitel, Fakten und den Vergleich mit den besten Referenzen. Nutze den Skill bei "prüf das", "ist das gut genug", "QC für die Firma-Serie", "Korrekturrunde", oder als Prüfschritt in firma-chef.
---

# firma-pruefer

Der Prüfer ist **nicht der, der es gebaut hat**. Damit er nicht seine eigene Arbeit schönredet, läuft jede Prüfung als frischer Subagent (Agent-Tool, `general-purpose`), der nur die Ausgabedateien, die Bewertung aus `references/bewertung.md` und die Referenzen bekommt, nicht die Begründungen des Erstellers. Der Prüf-Agent bekommt den Auftrag, Fehler zu finden, nicht das Ergebnis zu bestätigen.

## Ablauf pro Prüfpunkt

1. **Prüf-Agent starten** mit: Stufe (spy / autor / regie / design / final), Pfaden der Ausgaben, dem passenden Abschnitt aus `references/bewertung.md`, Pfaden zu 2–3 Referenz-Zerlegungen aus `SPY/analysen/`. Auftrag: jedes Kriterium mit Note 1–10 und Beleg (Datei + Zeile, oder Video-Zeit + Frame-Datei) bewerten; wo unter 8, die konkrete Korrektur benennen.
2. **Ergebnis ablegen** als `broll/runs/firma-tag<N>/pruefung/<stufe>-runde<R>.md`.
3. **Entscheiden.**
   - Alle Kriterien ≥ 8 und kein K.-o.-Kriterium verletzt → bestanden, weiter zur nächsten Stufe.
   - Sonst **Korrektur-Ticket** an den zuständigen Skill (Format unten) und nach der Korrektur dieselbe Stufe erneut prüfen, wieder mit frischem Agent.
   - Nach 3 Runden ohne Bestehen: nicht weiter schönprüfen. Bericht an Pius mit dem, was fehlt, und warum es nicht gelöst wurde.
4. **Zuständigkeit:** Fehler werden dort behoben, wo sie entstehen. Ein schwaches Thema wird nicht mit Grafik gerettet: Ticket an `firma-autor`, auch wenn das Video schon gerendert ist.

## Korrektur-Ticket

```
TICKET <stufe>-R<runde>-<nr> → <firma-autor | firma-regie | firma-design | firma-spy>
Kriterium: <Name> · Note: <x>/10
Beleg: <Datei:Zeile | Video mm:ss + Frame-Datei>
Problem: <ein Satz>
Soll: <was danach wahr sein muss, prüfbar>
```

## Finale Prüfung (Video)
Zusätzlich zum Prüf-Agent selbst laufen lassen und Ergebnisse in den Bericht:
- Kontaktbogen alle 0,5 s und Frames an jedem Beat aus `beats.json`.
- `node scripts/review-video.mjs --video <final.mp4>` (Gemini, FINAL_RUBRIC).
- STT der finalen Tonspur gegen `script.txt`; LUFS über `ebur128` (Ziel −14 ±0,5).
- Seite-an-Seite-Brett: 4 Schlüsselframes neben den gleichen Momenten der besten Referenz.

Erst wenn die finale Prüfung besteht, geht das Video an Pius. Der Bericht an ihn nennt die Noten ehrlich, auch wenn es knapp war.

## Lehre Folgen 14–16 (2026-10-31)
- Maskottchen-Verdeckung ist K.-o. auch dann, wenn das Bild nicht „angeschnitten“ am Rand ist, sondern durch Panels/Listen/Untertitel verdeckt wird (> 1/3 oder Augen bedeckt). In jeder finalen Prüfung einen Durchgang nur dafür über das ganze Video, inklusive CTA/Endkarte.
- Vollbild-Einschübe einheitlich werten: Folge 13/14 bekamen bei 13–16 s (Maskottchen-Füße unter dem Brief) kein K.-o.; ab Folge 17 gilt dort dasselbe Soll (ganz weg oder ganz sichtbar).
- Gemini/OpenRouter liefert 402 (Guthaben) → manuell Frame für Frame, im Bericht vermerken.
