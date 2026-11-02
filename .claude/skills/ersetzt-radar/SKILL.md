---
name: ersetzt-radar
description: Findet und scort Themen für Niklas' Reel-Format "Claude hat X ersetzt" für Unternehmer und Mittelstand (X = Pflicht-Experte, den jeder Unternehmer bezahlt, z. B. Steuerberater, Buchhalter, Anwalt, Lohnbüro, Datenschutzbeauftragter), legt sie in einer Excel ab, schreibt freigegebene Themen als Briefing mit Hook ins gemeinsame Content-Backlog (für ki-satire-skript) und gleicht die echte Reel-Performance von @florent_preusser gegen den Score ab. Nutze diesen Skill immer, wenn Niklas nach "was soll Claude als Nächstes ersetzen", "ersetzt-Themen", "Radar", "welche Themen ziehen", "Themen scoren", "Performance der Reels abgleichen", "warum lief X (nicht)", "wie performen die Reels" fragt, oder wenn eine geplante Radar-/Performance-Ausführung läuft. Für Think-in-Public-Thesen ist ai-takes zuständig, für Satire ki-satire, fürs Ausschreiben des Skripts ki-satire-skript. Nur für @florent_preusser.
---

## Themen-Abstand (Pius 2026-11-02, Pflicht vor jeder Themenwahl)
Vor jedem neuen Thema `themen/themen-log.md` lesen (zentrales Log aller Videos seit Ende September, alle Accounts) und, wenn `ZERNIO_API_KEY` da ist, vorher `node broll/scripts/themen-sync.mjs` laufen lassen und `themen/zernio-posts.md` mitlesen.
- **Gesperrt:** ein Kernthema, das in den letzten **45 Tagen** gepostet oder eingeplant wurde, auf irgendeinem Account. Gleiches Kernthema zählt auch mit anderem Hook, Winkel, Format oder Account. Ab 45 Tagen erlaubt, dann mit neuem Winkel.
- Dasselbe fertige Video bewusst auf mehreren Kanälen zu posten ist kein Verstoß; die Regel gilt für neue Videos.
- Im Zweifel (ähnlich, nicht gleich) ein anderes Thema nehmen. Im Briefing den Check belegen: „Abstandscheck: ähnlichstes Thema <X> am <Datum>, <N> Tage her“.
- Sobald ein Video eingeplant ist: eine Zeile in `themen/themen-log.md` ergänzen (Datum, Account, Format, Kernthema, Link).

# Ersetzt-Radar

## Die eine Regel

Die besten Ersetzt-Reels des Accounts ersetzen **Pflicht-Experten, die jeder Unternehmer selbst bezahlt**, mit konkretem Betrag im Hook:

| Reel | Views | vs. Nachbar-Reels |
|---|---|---|
| „Ein Buchhalter kostet 3.000 Euro im Monat …“ | 133.688 | 4,7× |
| „Steuerberater kosten 2.000 Euro pro Jahr …“ | 118.184 | 4,1× |
| „Ein Anwalt hat mir mal 400 Euro für zwei Seiten NDA berechnet“ | 10.454 | 3,7× |

Was nicht läuft, auch mit Preis-Hook: Agenturen, SEO, Marketing, Tools/Software (0,5–0,7×), E-Mail (0,5×), Spezialrollen größerer Firmen wie Controller oder Recruiter (0,4–0,5×). Creator-Themen (Websites, Videos) liefen, sind aber nicht die Zielrichtung.

**Nie Themen aus Ähnlichkeit zu Ausreißern ableiten.** Neue Themen zeigst du Niklas als Vorschlag; ins Backlog kommen sie erst nach seinem Okay. Seine Erfahrung schlägt jede Schätzung.

## Dateien

- Skript: `python3 ~/.claude/skills/ersetzt-radar/scripts/radar.py <befehl>` (ohne Argument: alle Befehle). In zsh keine Befehle in Variablen speichern.
- Daten: `~/Documents/ersetzt-radar/radar.xlsx` und `config.json` (Handle, Gewichte). Nie direkt in die Excel schreiben, JSON-Zwischendateien ins Scratchpad.
- Bewertung: `references/scoring.md` · Hooks: `references/hooks.md`
- Backlog (geteilt mit ki-satire): `~/.claude/ki-satire/backlog.md`

## A. Themen finden und scoren

1. **Sammeln (10 bis 15):** Pflicht-Rechnungen von Unternehmern durchgehen: Steuer, Buchhaltung, Lohn, Recht, Datenschutz, Prüfung, Versicherung, Übersetzung, Förderung. Varianten der Hits zählen (Jahresabschluss, Arbeitsvertrag), Wiederholungen desselben X nicht (Zweitverwertung lief schwächer). `pending` zeigt Vorhandenes. Dann `add <datei>` mit `[{"name", "typ", "quelle"}]`.
2. **Bewerten** nach `references/scoring.md`: preisschild (Pflicht-Rechnung), ich_story, sichtbar, glaubwuerdig, plus begruendung (ein Satz) und headline nach `references/hooks.md`. `set-rubrik <datei>`.
3. **Optional Content-Beweis:** Instagram-Suche `data-slayer/instagram-search-reels` mit `"<X> KI"` per Subagent, Format `{"X": {"keys": [...], "items": [{"plays","shares","caption"}]}}`, dann `set-insta`. Nur Nebensignal (10 %). Apify-Free-Plan: max. 4 Läufe parallel.
4. `score`, dann `top 15`. ⛔ = Pflicht-Rechnung ≤ 2 (Agentur, Tool, niemand zahlt dafür).
5. **Niklas zeigen:** Tabelle plus die Top 5 mit Headline. Erst nach seinem Okay je Thema ein Briefing ins Backlog (Vorlage unten), dann `set-rubrik` mit `{"X": {"briefing": "B-0xx"}}`.

### Briefing-Vorlage

Zählerzeile oben im Backlog lesen (Nächste Nummer), direkt vor dem Schreiben neu lesen (andere Sessions schreiben mit), Briefing ans Ende, Zähler aktualisieren.

```
### B-0xx · [Kurztitel]
Status: offen · Angelegt: [Datum] · News-Datum: – · Quelle: ersetzt-radar (Score [N])
Format: Ersetzt-Demo · Ring: Ersetzt · Länge: ~30 s

Hook: „[X] kostet [Betrag]. Claude macht das in [Zeit].“
Hook B: „[Ich/Wir-Szene mit Preis]“
Kern:
– „[was man Claude tun sieht]“
– „[das Ergebnis]“
– „[vorher/nachher: Betrag gegen Claude]“
Pointe: „[Rückgriff auf den Hook, unter 10 Wörter]“

Demo: [was aufgenommen wird]
Grenze: [was Claude nicht übernimmt, damit die Headline ehrlich bleibt]
Beleg: [Betrag mit Quelle] oder INSIDER: [echter Betrag von Niklas?]
```

## B. Performance-Check (donnerstags geplant, oder „wie laufen die Reels“)

1. Subagent holt die komplette Historie: `apify/instagram-scraper`, Profil `https://www.instagram.com/florent_preusser/`, `resultsType: "posts"`, `resultsLimit: 150`. Für Reels der letzten 14 Tage zusätzlich `apify/instagram-reel-scraper` mit `includeTranscript: true`, weil Caption und gesprochener Hook oft abweichen. Er schreibt `[{"code","datum","caption","plays"}]` (Plays = `videoPlayCount`, Karussells weglassen).
2. `sync-posts <datei>`. Jedes Reel wird mit dem Median seiner 16 zeitlichen Nachbar-Reels verglichen (die Account-Reichweite schwankt stark). Reels unter 7 Tagen: noch kein Index.
3. Neue Ersetzt-Reels zuordnen: `link <code> <X>` (aufheben: `link <code> -`). Nur, wenn der gesprochene Hook wirklich „Claude ersetzt X“ ist; ein Name in der Caption reicht nicht.
4. `report` und `calibrate` zeigen. Beim Backlog-Briefing `Ergebnis: [Views] ([Urteil], Stand [Datum])` nachtragen. Neue Belege (gleiches X, sehr unterschiedliche Views) in `references/hooks.md` ergänzen.

Gewichte nur mit Niklas' Okay ändern (`calibrate --apply`).
