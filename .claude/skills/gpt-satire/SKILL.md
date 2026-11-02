---
name: gpt-satire
description: Ideen, Hooks und fertige Avatar-Sprechtexte NUR für die Satire auf @florentgpt (B2C-Account) - Satire für Endkonsumenten über KI, Internet und Alltag (ChatGPT-Beziehungen, Mama nutzt KI, KI-Influencer, Gen Z, Side-Hustle-Gurus, Abo-Fallen, Dating, WG), nicht für Unternehmer oder Angestellte. Zwei Varianten - "normal" (trocken, help.hannaa-Methode) und "atzig" (frech, rotzig, Kumpel-vom-Block-Ton, liebevoll respektlos, nie nach unten). Liefert pro Runde Ideen mit Hook, Kern und Pointe und schreibt die gewählte Idee als Sprechtext mit Beat-Plan, Overlay und Engagement-Mechanismus aus. Pflegt Backlog, Log und die normal/atzig-Rotation in ~/.claude/florentgpt/satire/. Nutze diesen Skill bei "Satire für Florent GPT", "atziges Video", "fotziges Video", "Satire-Idee für den GPT-Account", "Skript für G-0xx" oder als Schritt 1-2 von gpt-satire-reel. Nicht für @florent_preusser (dafür ki-satire und ki-satire-skript).
---

# GPT-S · Satire für @florentgpt — Ideen und Sprechtext

Du lieferst Satire für **Endkonsumenten**: Leute, die KI privat nutzen oder darüber lachen, nicht Firmen. Gemessen wird nicht „gefällt das einem Unternehmer“, sondern: **Schickt ein 20- bis 35-Jähriger das sofort in seine Gruppe?**

**Abgrenzung:** `ki-satire`/`ki-satire-skript` sind für @florent_preusser (Figur: der Rationalisierer, Themen Arbeit/Change). Hier gelten eigene Figur, eigene Themen, eigener Backlog. Das **Handwerk** (Methode, Sprache, Avatar-Satzzeichen, Dramaturgie) wird von dort gelesen, nicht kopiert, damit es nur an einer Stelle gepflegt wird:
- Methode und Angles: `~/.claude/skills/ki-satire/references/methode.md`, `angles.md`
- Sprache (Kumpel-Test, Wortliste): `~/.claude/skills/ki-satire/references/sprache.md`
- Dramaturgie und Beat-Pläne: `~/.claude/skills/ki-satire-skript/references/dramaturgie.md`
- Avatar-Satzzeichen, Aussprache, Tempo: `~/.claude/skills/ki-satire-skript/references/avatar-sprechtext.md`

Figur, Varianten, Themen-Ringe und Grenzen für GPT-S: `references/figur-und-varianten.md` (immer lesen).

**Vorbild 1:1 ist @help.hannaa** (Pius, 2026-10-01): Format-Ranking, Caption-Stil (ein Satz oder leer), Flow und die Übertragung ihrer Top-Formate auf Konsumenten-KI stehen in `references/hanna-analyse.md` (immer lesen). Der Schnitt dazu steht in `video-satire-edit`.

## Ablauf

### 1. Kontext und Variante

- Lies `references/figur-und-varianten.md` und die Handwerks-Dateien oben.
- Lies `~/.claude/florentgpt/satire/backlog.md`, `ideen-log.md`, `rotation.md`.
- **Variante bestimmen:** Nennt Pius sie („atzig“, „fotzig“, „normal“), gilt das. Sonst nimmt `gpt-satire-reel` sie aus `rotation.md` (abwechselnd, siehe dort). Läufst du allein, frag nicht, sondern nimm die nächste laut Rotation.

### 2. Ideen erzeugen (wenn keine Idee vorgegeben)

Wie `ki-satire` Schritt 2 bis 5, mit diesen Änderungen:
- Rohstoff: Themen-Ringe aus `figur-und-varianten.md` + 4 bis 6 Websuchen zu den letzten 7 Tagen (virale KI-Pannen, neue Consumer-Features, TikTok/Insta-Trends rund um ChatGPT/Claude, Tech-Drama).
- 6 bis 8 Themen × mindestens 5 Angles, pro Thema der Angle mit dem größten Abstand zwischen „Hä?“ und „Genau so ist es“.
- Filter: Hä-Test, **Gruppenchat-Test** (an wen schickt man es, was tippt man dazu), Klarheits-Test (versteht es jemand ohne Tech-Job nach dem Hook), Grenz-Test (`figur-und-varianten.md` → Grenzen), Hahaha-Test. Der Themen-Test aus `ki-satire` (muss mit KI in der Firma zu tun haben) gilt hier **nicht**; stattdessen: KI, Internet oder Tech-Alltag muss die Brille sein.
- Sprache nach `sprache.md` umschreiben (eigener Schritt).

Ausgabe: 6 Ideen, davon mindestens 2 je Variante, im Format unten. Dann die 2 stärksten für die aktuelle Variante empfehlen. Alle Ideen, die alle Filter bestehen, als Briefing `### G-NNN · Titel` (Status offen, Variante, Angelegt, News-Datum) in den Backlog.

### 3. Sprechtext schreiben (für die gewählte Idee)

Wie `ki-satire-skript` Schritte 2 bis 6 (Länge nach Format, Beat-Plan mit offener Frage pro Beat, Sprechtext, Avatar-Durchgang, Retention-Check), plus:
- **Variante im Ton:** normal = trocken, deadpan, kurze Sätze. Atzig = Regeln aus `figur-und-varianten.md` → „atzig“ (Anrede, Rhythmus, erlaubte Kraftwörter, Grenzen).
- **Engagement-Mechanismus** aus `~/.claude/skills/reel-formate/references/satire-engagement.md` Teil A einbauen (genau einer), im Beat-Plan markieren. Für atzig ist A6 (Gegenposition provozieren) der Standard.
- Florent spricht als er selbst (keine Rolle, kein POV), wie bei `ki-satire-skript`.
- Speichern: `~/.claude/florentgpt/satire/skripte/JJJJ-MM-TT-titel.md`; im Backlog `Status: geskriptet → skripte/…`.
- Im Run-Ordner (wenn von `gpt-satire-reel` aufgerufen): `script.txt` = nur der Sprechtext, `brief.md` = Overlay (Serifen-Hook-Titel, tippt sich ein), Beat-Plan, Variante, Mechanismus, **Caption im Hanna-Stil** (ein Satz: Figur spricht weiter / Frage an die Community / Wortspiel, oder leer; keine Hashtags), erster Kommentar (Teil C), Zu prüfen.

## Ausgabeformat Idee

```
**G-NNN · [Arbeitstitel]**
Variante: [normal / atzig] · Ring: [aus figur-und-varianten.md] · Format: [Einzeiler / Anapher / Liste / Kostenrechnung / Begriff / Gegenüberstellung] · Länge: [~15 / ~30 / ~45 s]

Hook (0–3 s): „[wörtlich]“
Kern:
– „[Satz]“
– „[Satz]“
– „[Satz]“
Pointe: „[letzter Satz]“

Schickt man an: [Empfänger] mit „[was man dazu tippt]“
Engagement: [A1–A6, ein Halbsatz]
Beleg: [Fakt mit Link] / [Satire, erkennbar übertrieben]
Risiko: [1–5, warum]
```

## Ehrlichkeit

Wie `ki-satire`: Übertreibung nur erkennbar, Fakten mit Beleg, keine erfundenen Erlebnisse mit echten Personen. Zusätzlich für B2C: keine echten Privatpersonen, keine Creator beim Namen verspotten (Big Tech, CEOs öffentlicher Konzerne und Produkte sind ok).
