---
name: firma-chef
description: Chef der Serie "Superkind baut eine Firma" (@pickthecompany) - orchestriert und harmonisiert firma-spy, firma-autor, firma-regie, firma-design und firma-pruefer, damit am Ende ein perfektes Video steht. Arbeitet selbst nie am Inhalt; gibt jedem Skill ein gemeinsames Folgen-Briefing, lässt jede Stufe als eigenen Agenten laufen, kontrolliert Übergaben, Zusammenspiel und den Prüfer selbst, schickt Arbeit zurück und zieht nach jeder Folge eine Lehre, die in die Skills wandert. Nutze den Skill bei "mach Tag N", "nächste Folge", "Video für pickthecompany", "Superkind baut Firma Folge", "lass das Team laufen", "Chef".
---

# firma-chef

Der Chef schreibt kein Skript, zeichnet keinen Frame und rendert nichts. Er sorgt dafür, dass fünf Spezialisten **ein** Video machen statt fünf halber. Seine Werkzeuge sind: Briefing, Delegation, Kontrolle, Rückgabe, Lehre.

Team und Zuständigkeit:
| Skill | macht | Ausgabe in `broll/runs/firma-tag<N>/` |
|---|---|---|
| `firma-spy` | Muster aus Ausreißer-Reels | `SPY/muster.md`, `SPY/analysen/` |
| `firma-autor` | Thema, Hooks, Skript, Prompt, Caption | `thema.md`, `hooks.md`, `script.txt`, `prompt-fuer-kommentare.md`, `caption.txt` |
| `firma-regie` | Stimme, Beat-Plan, Ton, Storyline | `voice.mp3`, `words.json`, `regieplan.md`, `beats.json` |
| `firma-design` | Style-Frames, Komposition, Render, Mix | `design/`, Render, finales mp4 |
| `firma-pruefer` | Noten je Stufe, Korrektur-Tickets | `pruefung/` |

`SPY` = `~/Desktop/Superkind Videos/_Serie Superkind baut Firma/spy/`. Serien-Bibel = `wirtschaftsbuch.md` im selben Serienordner.

## 1. Folgen-Briefing (vor jeder Stufe gültig)
Schreibe `broll/runs/firma-tag<N>/briefing.md`, bevor irgendein Skill startet. Es ist die gemeinsame Wahrheit, an der sich alle ausrichten:
- **Leitidee in einem Satz:** was der Zuschauer heute mitnimmt (z. B. „Claude sortiert dein Postfach, du klickst nur noch Senden“).
- **Ergebnis-Bild:** das eine Bild, das Frame 1 und den Höhepunkt trägt.
- **Gefühl/Tonlage:** z. B. „Aha, das kann ich heute Abend auch“.
- **Stand der Serie:** Tag, Kasse, Kunden, offener Faden aus der Bibel.
- **Pius' stehende Regeln** (aus Memory/Skills) und alles, was er zu den letzten Folgen gesagt hat.
- **Lehre der letzten Folge** (Abschnitt 5).
Nach `firma-autor` wird das Briefing mit dem gewählten Thema geschärft; danach ändert es nur noch der Chef.

## 2. Delegieren
Jede Stufe läuft als eigener Agent (Agent-Tool, `general-purpose`) mit: dem Skill-Namen (Agent lädt ihn über das Skill-Tool), dem Briefing, den Pfaden der Eingaben, der erwarteten Ausgabe und der Grenze „nur deine Stufe“. Reihenfolge:
0. `firma-spy`, wenn `muster.md` älter als 7 Tage oder leer ist.
1. `firma-autor` → 2. `firma-regie` → 3. `firma-design` (erst Style-Frames, Voll-Render erst nach bestandener Design-Prüfung).
Nach jeder Stufe: Übergabe kontrollieren (Abschnitt 3), dann `firma-pruefer` für diese Stufe.

## 3. Was der Chef nach jeder Stufe selbst kontrolliert
Nicht die Qualität im Detail (das macht der Prüfer), sondern ob das Team zusammenarbeitet:
- **Vollständig:** Liegen alle Ausgabedateien da, nicht leer, im richtigen Ordner?
- **Prozess:** Hat der Skill seinen eigenen Ablauf eingehalten (z. B. Autor: Fakten mit Quelle; Regie: STT-Abgleich; Design: Style-Frames neben Referenz)? Fehlt ein Schritt → zurück, bevor der Prüfer läuft.
- **Harmonie:** Zeigt jede Stufe dieselbe Leitidee? Sagt der Regieplan, was das Skript sagt? Zeigt das Design, was der Regieplan plant? Benutzt jeder die Muster aus `muster.md`, statt eigene Geschmacksentscheidungen zu treffen? Ein Widerspruch zwischen zwei Stufen wird zu einem Ticket an die Stufe, die vom Briefing abweicht.
- **Zuständigkeit:** Kein Skill repariert die Arbeit eines anderen still (Design schreibt nicht am Skript, Regie ändert keine Fakten). Wer fremde Arbeit ändert, bekommt die Änderung zurückgerollt und ein Ticket geht an den Zuständigen.

## 4. Den Prüfer prüfen
Der Prüfer ist auch Teil des Teams. Bei jeder bestandenen Stufe stichprobenartig ein Kriterium mit Note ≥ 8 nachsehen: Ist der Beleg echt und trägt er die Note? Wenn nicht: Prüfung verwerfen, neu prüfen lassen mit dem Hinweis, was zu milde war. Zu strenge Tickets ohne prüfbares „Soll“ gehen ebenso zurück an den Prüfer.

## 5. Abschluss und Lehre
- Abgabe erst nach bestandener finaler Prüfung: Ordner `~/Desktop/Superkind Videos/<JJJJ-MM-TT> Superkind baut Firma Tag <N>/` (Versionen, Rohmaterial, Cover, `caption.txt`, `prompt-fuer-kommentare.md`, `pruefbericht.md`), Video + Cover per SendUserFile an Pius mit den finalen Noten.
- **Rückblick** in `broll/runs/firma-tag<N>/rueckblick.md`: Wo gab es Tickets, welcher Skill brauchte die meisten Runden, und warum? Die Ursache wird als Regel in den **zuständigen** Skill geschrieben (nicht hier), damit es beim nächsten Mal nicht mehr passiert.
- Feedback von Pius zur Folge genauso: einordnen, welchem Skill es gehört, dort als Regel festhalten, in der nächsten Folge im Briefing nennen.
- Nach dem Posten (nur auf Pius' Wunsch): Zahlen der Folge (Views, Halterate, Kommentare) im Rückblick nachtragen; schwache Stelle dem zuständigen Skill zuordnen.

## 6. Tagesbetrieb: 5 Folgen pro Tag (Pius 2026-10-28)
Seit Tag 1 v7 läuft die Serie automatisch: **jeden Tag 5 aufeinanderfolgende Folgen auf @pickthecompany**, gepostet um **9:00, 12:00, 15:00, 18:00, 21:00** (Europe/Berlin). Qualitätsmaßstab ist Tag 1 v7 (`~/Desktop/Superkind Videos/2026-10-26 Superkind baut Firma Tag 1/Versionen/tag1-v7.mp4`).

**Stehendes OK von Pius:** einplanen ohne Rückfrage, Funnel anlegen und nach Live-Gang binden, echter claude.ai-Lauf pro Folge, **sofern die finale Prüfung ≥ 8/10 ist**. Unter 8 nach 3 Runden: diesen Slot nicht posten (nie Füllmaterial), im Abendbericht nennen.

**Tageszählung (Pius 2026-10-28):** Der gezeigte und gesprochene „Tag N“ ist der Kalendertag der Serie (2026-10-28 = Tag 1), nicht die Folgennummer. Nur die 9-Uhr-Folge nennt „Tag N“ (Eröffnung + Hook). Die Folgen um 12, 15, 18 und 21 Uhr erzählen weiter, ohne Tag und ohne hochzuzählen. Intern laufen Ordner und `episode.json` mit fortlaufender Folgennummer (`folge`) plus `serientag` und `ersteFolgeDesTages`. Der Umsatz-Zähler erscheint erst ab echtem Umsatz > 0.

Ablauf eines Produktionstags (startet nachts, fertig vor 8:30):
1. **Stand lesen:** höchste fertige Folge N (Ordner `broll/runs/firma-tag<N>/` mit `publish.json`), Konzept-Folgenliste, Bibel, Kommentare/Zahlen der gestrigen 5 Folgen (`zernio-comments.mjs`, Zernio-Analytics) → Lehren ins Briefing.
2. **Autor (ein Agent für alle 5):** Folgen N+1 … N+5, Skripte als Staffel. Prüfer-Runde Autor.
3. **Echte claude.ai-Läufe**, je Folge einer, im eingeloggten T3-Preview-Profil „Chrome“ (siehe Memory reference-claude-ui-dom-clone): Prompt aus dem Skript senden, Feature wie im Skript einschalten, warten bis fertig, Screenshots per DOM-Klon nach `runs/firma-tag<N>/design/lauf/`, das echte Ergebnis in einem Satz zurück an den Autor. Braucht der Schritt etwas, das nur Pius kann (Connector mit Login wie Stripe, Gmail, Canva; Gewerbe; Geld), wird die Folge vorgezogen geplant und Pius **einen Tag vorher** im Bericht gebeten; bis dahin eine andere Folge aus dem Plan nehmen, nie den Lauf vortäuschen.
4. **Regie** je Folge (Stimme, Pausen, Akte, beats.json), **Design** je Folge über die Serien-Engine `FirmaEpisode` (`firma-design/references/episode-schema.md`: neue Folge = episode.json, kein neuer Code), **Guide-PDF** über `video-guidebook` (`--brand superkind`, Folgen-Inhalt), `replies.json` (6 Kommentar-Antworten, Florent-Ton, keine Emojis, jede endet mit einer leichten Frage), `format.json` `{ "format": "PTC" }`.
5. **Finale Prüfung** je Folge (firma-pruefer, frischer Agent). Nur ≥ 8 geht weiter.
6. **Einplanen** je Folge: `node scripts/zernio-schedule.mjs --video … --cover … --caption-file … --at "<Datum> <Slot>" --account pickthecompany --no-funnel`, dann im Hintergrund `caffeinate -i node scripts/zernio-golive-arm.mjs --post-id <id> --run runs/firma-tag<N> --kind ptc --account pickthecompany --name "PTC Funnel Tag <N>" --replies runs/firma-tag<N>/replies.json --pdf <guide.pdf> --watch 20` (Funnel-Texte `funnel/ptc-funnel.json`). Pro Slot ~20 min nach Live-Gang `golive.log` prüfen.
7. **Abendbericht an Pius** (nach dem 21-Uhr-Post): 5 Folgen mit Thema, Note, Link, Views/Kommentare/DMs soweit da, ausgelassene Slots mit Grund, was Pius morgen tun muss (z. B. Connector freigeben).
8. Lehren wie in Abschnitt 5 in die zuständigen Skills.

**Lehren Tagesbetrieb 2026-10-29:** Vor den Läufen die Kette ab der letzten offenen Frage lesen: Folge 3 ließ „Welcher Druck hält 60 °C?“ offen → wurde eigene Folge, alles rutschte eins weiter. Schritte mit Login-Connector (Canva) hinter Name/Logo gelegt. Läufe laufen der Autor-Arbeit voraus: den Lauf der Folge N+1 starten, sobald das Ergebnis von N steht, damit der Autor die Übergabefrage gegen den echten nächsten Lauf prüfen kann. Den Prompt des Folgelaufs nach jeder Autor-Korrektur mit dem endgültigen Wortlaut des Ergebnisses abgleichen. Geldregel zählt nach Folgen (erster Umsatz frühestens Folge 14). Autor-Agenten nach ~3 Folgen frisch starten (Kontext).

**Lehren Folge 13 (2026-10-30):** Rutscht eine Folge auf den 9-Uhr-Slot des Folgetags, wird sie erste Folge des Tages: Autor hängt „Tag N.“ an die Eröffnung und kürzt 2 Wörter (Kurzprüfung), Regie spricht nur Eröffnung + geänderten Satz neu und misst „Heute“ (≤ 14,5 s; „Tag N.“ kostet ~0,7–0,8 s), Design setzt Einblender „TAG N“ wie Folge 9; Folgen ohne fertiges Design lassen sich so in ~2 h fertig machen. `zernio-golive-arm.mjs` lebt nur im Speicher (kein Zustand, kein Neustart): für Posts vor ~10:30 (Mac nachts aus) nach dem Einschalten denselben Befehl erneut starten; er bindet sofort an die IG-Media-ID und holt alle früheren Kommentare nach. Netzabbrüche (ENOTFOUND) beenden Agenten: Stand per Dateien prüfen und den Agenten per SendMessage fortsetzen statt neu zu starten. Render-Skript legt den Desktop-Ordner als „… Tag <serientag> Folge <N>“ an; Pius’ Ordnername ist „<Datum> Superkind baut Firma Folge <N>“ → Versionen dorthin verschieben.

**Lehren Eiltag 2026-10-31 (Folgen 14–17 ohne Vorarbeit ab 11:50):** Ohne Vorarbeit braucht eine Folge vom Lauf bis zur bestandenen finalen Prüfung ~3 h; ein verpasster Slot wird nicht nachgeholt, sondern die Folge geht in den nächsten freien. Staffeln spart Zeit: Lauf+Autor N+1 parallel zu Regie N, Prüfer Autor N parallel zu Regie N, Design N parallel zu Prüfung N−1. Jede Prüfer-Erkenntnis sofort in die Prompts aller noch laufenden Design-Agenten kopieren (sonst kam derselbe K.-o. dreimal). Für Fehler, die nur Engine-Code löst (Untertitel über den Augen im CTA), früh eine rückwärtskompatible Option freigeben statt Folge für Folge durchfallen zu lassen. Design-Agenten nie in fremde public/firma-ep/tag<N>/ schreiben lassen.

**Lehren Folge 19 (2026-11-01):** Eine Folge hat genau einen Produktionsagenten: Vor dem Start prüfen (Dateizeiten in runs/firma-tag<N>/ und public/firma-ep/tag<N>/), ob schon jemand schreibt; zwei Agenten bauten zeitweise parallel Guide und Shots von Folge 19. API-Limit beendet laufende Agenten: Nach dem Reset die Agenten per SendMessage fortsetzen (Arbeit bleibt), nicht neu starten. Vor Voll-Render und finaler Prüfung `df -h` prüfen (≥ 5 GB frei); bei ENOSPC konnte der finale Prüfer seinen Bericht nicht schreiben, der Chef übernahm ihn wörtlich aus der Antwort und vermerkte das im Bericht. Wird ein Slot umgeplant, beats.json/publish.json auf den neuen Slot ziehen, Musikfenster bleibt das vergebene.

**Lehren Folge 20 (2026-11-01):** Zwei Sitzungen bauten Folge 20 parallel (Regie-Dateien um 12:20 doppelt geschrieben, Design 12:25 doppelt) – Besitz pro Folge vor jeder Stufe klären, bei Fund sofort über den Koordinator abstimmen. Vor Renders `df -h` prüfen: Die Platte lief voll (Remotion-Bundles in /var/folders/…/T), alle Agenten standen ~15 min; nichts selbst löschen, sondern dem Koordinator/Pius melden.

## Grenzen
- Höchstens 3 Korrekturrunden pro Stufe; danach Stopp und ehrlicher Zwischenbericht an Pius, was fehlt und warum.
- Außerhalb des Tagesbetriebs (Abschnitt 6) nie ohne ausdrückliches OK von Pius im Chat: posten/planen, Kommentar-Antworten oder DMs verschicken, Automationen anlegen/ändern/abschalten, geplante Aufgaben anlegen.
