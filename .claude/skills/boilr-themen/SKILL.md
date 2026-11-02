---
name: boilr-themen
description: Themenfindung NUR für Felix' Serie "Claude for Recruiters" (Format BX-C, boilr.ai, Englisch, UK-Recruitment-Agenturen). Findet, bewertet und begründet Episoden, in denen Felix zeigt, wie man in Claude ganz konkret Firmen (Hiring-Signale, Business Development) und Kandidaten findet und filtert, und schreibt Briefings R-NNN mit Klickpfad-Skizze, Trigger-Wort, Versprechen und boilr-Brücke in ~/.claude/boilr/backlog.md. Schreibt KEINE Skripte (das macht boilr-script). Nutze ihn bei "Themen für Felix", "Claude for Recruiters Episoden", "was macht Felix als Nächstes", "boilr Backlog auffüllen" oder als Schritt 0 von boilr-recruiter-reel. Nicht für @florent_preusser oder @florentgpt.
---

# BX-C · Themen für „Claude for Recruiters“ (Felix × boilr)

**Aufgabe:** Episoden finden, bewerten, begründen. Keine Skripte (`boilr-script`), kein Schnitt.
**Ausgabe:** Briefings `### R-NNN · Titel` in `~/.claude/boilr/backlog.md`, kurze Begründung im Chat.

## Leitplanken (Pius, 2026-10-06, haben Vorrang)

- **Zielgruppe:** Inhaber und Consultants von UK-Recruitment-Agenturen. Profis, keine Laien. Sie kennen BD, placements, retained/contingent, job specs, Boolean.
- **Nur „Claude for Recruiters“:** jede Episode zeigt, wie man **in Claude** ganz spezifisch etwas findet oder filtert, mit echtem Klickpfad. Kein ChatGPT, keine Drittanbieter-Tools im Video.
- **Mix:** ca. 60 % **Firmen mit Signalen** (wer stellt bald ein, bevor die Anzeige live ist), ca. 40 % **Kandidaten**, ebenfalls möglichst signalbasiert (z. B. wer gerade wechselbereit ist, weil die Firma Leute abbaut oder umzieht). boilr kann beides, Schwerpunkt Firmen.
- **Jede Episode braucht eine boilr-Brücke:** Der manuelle Weg in Claude funktioniert, ist aber Handarbeit. boilr macht genau das 24/7 für 100+ Agenturen. Die Brücke steht nicht im Video (dort nur Mehrwert), sondern im DM-Funnel und im Guide.
- **UK-Bezug:** UK-Quellen (Companies House, The Gazette, UK-Jobboards, UK-Fachpresse), £, UK-Städte und -Branchen.
- **UK GDPR:** Kandidaten nur über öffentliche Quellen und anonymisierte/erfundene CVs. Kein LinkedIn-Scraping, keine echten Kandidatennamen im Video.
- **Hooks = finanzieller Schaden mit Zahl, alter Weg = Verlierer** (Pius 2026-10-06, Details in `boilr-script` → Hook-Regel). Hook-Ideen im Briefing schon so formulieren.
- **Nie „AI replaces recruiters“.** Haltung: Claude macht den Recruiter schneller, die Beziehung bleibt menschlich.
- **„Claude for Recruiters“** ist nur der Serientitel. Kein Claude-/Anthropic-Logo, nichts, was nach offiziellem Anthropic-Produkt aussieht.

## Bewertung

Score = Schmerz × Signal-Nähe × Vorführbarkeit (je 1–5):

| Wert | Frage | 5 = |
|---|---|---|
| **Schmerz** | Wie sehr kostet das eine Agentur Geld oder Zeit? | direkt verlorene Fees (zu spät beim Kunden, kein Pipeline-Nachschub) |
| **Signal-Nähe** | Wie nah ist es an boilrs Kern „Signal vor der Stellenanzeige“? | Firmen-Signal, das boilr selbst liefert |
| **Vorführbarkeit** | Geht es in Claude live, in ≤ 3 Schritten, mit sichtbarem Ergebnis? | Ergebnis-Tabelle in einem Chat, sofort zeig- und kopierbar |

Ausschluss: geht nicht komplett in Claude oder verstößt gegen UK GDPR → raus.

## Ablauf

1. **Kontext laden:** `backlog.md`, `ideen-log.md` (keine Wiederholung innerhalb 14 Tagen), Pius' Thema hat Vorrang.
2. **Rohstoff:** 3–5 Websuchen (Recruitment-Agentur-Schmerzen UK: r/recruitment, Recruitment International, „recruitment business development 2026“), Claude-Fähigkeiten nur belegt (Websuche, Research, Datei-Upload, Projekte, Skills, Artefakte, Konnektoren).
3. **10–15 Kandidaten** bauen, jeweils mit Score und einem Satz **Warum**.
4. **Die besten 5–8** als Briefings in den Backlog.
5. **Briefing-Format:**

```
### R-NNN · Titel (englisch)
Status: offen · Säule: Firmen | Kandidaten | Setup · Angelegt: JJJJ-MM-TT
Score: Schmerz X × Signal X × Vorführbar X = N · Warum: [ein Satz]
Hook-Box: „…“ · gesprochen: „…“
Klickpfad-Skizze: [Claude öffnen → … → Ergebnis], in Claude zu prüfen
Trigger: [EIN WORT] · Versprechen: [konkret, mit Menge]
boilr-Brücke (DM 3): „…“
Zu prüfen: [Fakten, Quellen, GDPR]
```

6. **Zählerzeile** oben im Backlog aktualisieren. Ideen-Log schreibt `boilr-script`.

## Rückkopplung

48 h nach jedem Post (Zahlen von Pius oder über InstantDM, sobald Felix' Account verbunden ist): Aufrufe, Halt nach 3 s, Kommentare, DMs, **qualifizierte Leads und gebuchte Demos**. In `ideen-log.md` eintragen. Nach 10 Episoden: welche Säule bringt Demos (nicht nur Views)? Danach den Mix anpassen.

> **Fokus ab 2026-10-20 (Pius):** @moustacherecruiter bekommt Recruiting-Themen aus Recruiter-Sicht für Jobsuchende („I'm a recruiter, here's what I see on my side“ + Claude-Tutorial), wie bx-uni-job, bx-salary, bx-dropout. Das hat Vorrang vor dem 60/40-Mix oben. Agentur-BD-Signale nur auf ausdrücklichen Wunsch.
