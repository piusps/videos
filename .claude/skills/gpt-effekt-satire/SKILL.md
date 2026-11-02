---
name: gpt-effekt-satire
description: Effekt-Satire NUR für @florentgpt (GPT-S) - kurze Reels, die einen Business-, Gründer- oder Ökonomie-Effekt (Ratchet Effect, El Farol Bar Problem …) mit genau EINER kleinen Dating-Story zum Schmunzeln erklären (Max kocht beim ersten Date drei Gänge, jetzt erwartet Lea das jeden Freitag), dann den Effekt beim Namen nennen, dann das echte Beispiel aus Büro/Startup/KI-Alltag zeigen und am Ende die Story schließen. Sorgt dafür, dass HeyGen den Effekt-Namen richtig ausspricht (Sprachprobe + Whisper-Gegencheck, sonst deutscher Name), und gibt den Schnitt im "Fünf Tische"-Stil vor (Foto-Sticker der Figuren Max, Lea …, Serifentitel mit Effekt-Namen, Karten, rote Kreise). Nutze diesen Skill bei "Effekt-Video", "Effekt-Satire", "erklär einen Effekt mit Dating-Story", "so wie Nudeln mit Pesto / Kletterhalle", "Learning-Satire für florentgpt". Übergabe an gpt-satire-reel für Render und Schnitt. Nicht für @florent_preusser.
---

# Effekt-Satire · nur @florentgpt (GPT-S)

> **Gegenmittel (seit 2026-10-27):** An diesem Skill ändert sich 0,0: gleiche Themen, gleicher Aufbau, Effekt/Mechanismus wird weiter genannt. Erst wenn das Skript steht, ordnet `gpt-satire-reel` einen passenden Guide zu und hängt nach der Pointe ein Outro an (höchstens 18 Wörter, `~/.claude/skills/gpt-satire-reel/references/nutzen-bruecke.md`). Kein Thema wegen eines Guides wählen, verwerfen oder umbauen.

Entstanden am 07.10.2026 mit Pius („eigentlich ganz geil, speicher dir diese Art von Skripts als eigenen Skill“). Schwester-Format zu `gpt-gruender-satire`. Figur, Sperrliste und Avatar-Regeln von dort gelten weiter (lesen: `~/.claude/skills/gpt-gruender-satire/references/figur.md`, `abgelehnt.md`). Daten: Skripte nach `~/.claude/florentgpt/satire/effekt/skripte/JJJJ-MM-TT-titel.md`, Log `~/.claude/florentgpt/satire/effekt/log.md`.

## Das Format in einem Satz

**Eine Dating-Story, bei der man schmunzelt → Effekt beim Namen → das echte Beispiel aus Business/KI → die Story schließt sich.** Der Zuschauer lacht über Max und Lea und merkt dann: Ich hab gerade was über Wirtschaft gelernt.

## Aufbau (feste Reihenfolge, 4 Teile)

1. **Die Dating-Story (2-3 Sätze).** Startet direkt im ersten Satz, ohne Hook davor (kein „Jedes Büro hat einen …“, kein „Jeder Freundeskreis hat …“). Zwei Namen, ein konkretes Detail (Grill Royal, Hinge, Kletterhalle, Nudeln mit Pesto), eine kleine Wendung zum Schmunzeln. **Genau ein Beispiel**, nie zwei oder drei.
2. **Der Effekt (2 Sätze).** „Auf Englisch heißt das …“ mit dem englischen Fachbegriff (etwas nischig, man soll was lernen), dann ein Satz, was er bedeutet, in Kneipensprache. Ist die Aussprache unsicher (siehe unten), den deutschen Namen nehmen: „Ökonomen nennen das …“.
3. **Das echte Beispiel (3-4 Sätze).** Überleitung in einem Satz („Und genau deshalb wird deine Firma mit KI nicht schneller.“ / „Bei Startups passiert gerade genau dasselbe.“). Dann der Fall aus Büro, Startup oder KI-Alltag, mit KI als Ursache. Jeder Satz sagt direkt, wer was macht und warum.
4. **Schluss (1-2 Sätze).** Greift die Dating-Story wieder auf und schließt sie („Er ist schlauer als Max. Er kocht von Anfang an nur Nudeln mit Pesto.“ / „Lena ist übrigens mit dem Trainer zusammen. Der war nicht wegen ChatGPT da. Der arbeitet da.“).

**Länge:** 95 bis 115 Wörter, also etwa 35 bis 40 Sekunden.

## Klarheit vor allem (Pius' Korrekturen vom 07.10.2026)

- **Nach dem echten Beispiel keine neuen Figuren, Schritte oder Wendungen.** In einer Vorversion endete Skript 1 mit „Sein Chef macht dasselbe … Dann bucht die Firma mich … Abrechnen tu ich fünf Tage“. Pius' Urteil: mega kompliziert, das erzeugt nur Erklärungsbedarf.
- **Keine Andeutungen, die man selbst zusammensetzen muss.** Ausdrücke wie „Die zwölf Gründer sind Lena“ oder eine Spiegel-Pointe ohne Erklärung bleiben draußen. Das Gemeinte steht ausgesprochen da.
- **Ein Satz, ein Gedanke**, 6 bis 15 Wörter, nur Hauptsätze. Dazu der Navi-Test aus `gpt-gruender-satire`: Ist der Satz noch lustig, wenn ein Navi ihn vorliest?
- **Der Täter-Beat ist optional.** Wenn Florent vorkommt, dann in einem einzigen klaren Satz. Klarheit geht vor die Figur.

## Den Effekt auswählen

- Er stammt aus Business, Gründer-Welt, Ökonomie oder Spieltheorie. Psychologie geht auch, wenn sie im Business eine Rolle spielt (Reference Point, Anchoring).
- Er muss fachlich stimmen. Vor dem Schreiben per Websuche gegen eine Definition prüfen und die Zeile „Gilt hier, weil … (Quelle)“ ausgeben.
- Hannas Mechanismen sind gesperrt (Liste in `gpt-gruender-satire/references/hanna-vorbilder.md`). Effekte, die schon verbraucht sind, stehen im Log.
- Ideen-Speicher: Reference Point Effect (Pius' Beispiel mit Lisa und Sofia, Eis essen gegen Grill Royal, beim zweiten Date der Italiener), Sunk Cost, Winner's Curse, Adverse Selection (vorher genau prüfen), Goodhart's Law, Jevons Paradox, Baumol's Cost Disease, Hold-up Problem, Lindy Effect, Veblen Goods, Network Effects.

## Aussprache-Check (Pflicht vor jeder Freigabe)

HeyGen muss den Effekt-Namen richtig aussprechen. So wird das geprüft:
1. `create_speech` (HeyGen-Connector) mit der Stimme `6cc88d5a154d467f9e32495c2ceb5ee3` (nikstudio), `language: "de"`, Text: „Auf Englisch heißt das <Effekt>.“ Bei mehreren Effekten alle in einem Aufruf.
2. Die WAV-Datei herunterladen und den Gegencheck mit Whisper machen: `cd broll && node scripts/transcribe.mjs --in <wav> --out <json> --lang de`.
3. Schreibt Whisper den Begriff erkennbar richtig zurück, bleibt er drin. Ist er unkenntlich (andere Silben, deutsch ausgesprochenes Englisch), wird zuerst eine lautmalerische Schreibung getestet (Beispiel: „Rätschet Effekt“), dann der deutsche Name. Im Zweifel immer den deutschen Namen nehmen (Pius).
4. Pius bekommt den Link zur Probe, damit er selbst reinhören kann.

| Begriff | Ergebnis | Stand |
|---|---|---|
| Ratchet Effect | Whisper: „Ratchet-Effekt“, ok | 07.10.2026 |
| El Farol Bar Problem | Whisper: „Elpharolbar-Problem“, ok, nur leicht verschluckt | 07.10.2026 |

## Schnitt: „Fünf Tische“-Stil

> **Seit 2026-10-09 (Henri) für GPT-S vorrangig:** `gpt-satire-reel` → „GPT-Satire Stil“ (echte Stock-Fotos statt KI-/Clipart/Emojis, 2–4 ruhige Dopamin-Panels, nur Instrument Serif + Inter).

Vorbild ist `broll/src/compositions/SatireTische.tsx` (Run `gpts-fuenf-tische`, 06.10.2026). Auf dieser Basis wird pro Video eine neue Composition gebaut (Kopie plus Anpassung, in `Root.tsx` registrieren). Es gelten die Regeln von `video-satire-edit`, im Look `57ae6dc3`: Mütze rückwärts, hellgraue Wand, dunkle Schrift.
- **Foto-Sticker der Figuren:** Max, Lea, Lena, der Trainer usw. als fotorealistische Instagram-Fotos. Erzeugt mit OpenRouter `google/gemini-2.5-flash-image`, Key `OPENROUTER_API_KEY` aus `broll/.env`. Prompt-Basis: „Photorealistic iPhone photo, Instagram feed aesthetic, natural light, no text, no logos, portrait 4:5.“ plus Figur und Szene. Ablage in `broll/public/<run>/img/`. Dazu die `Photo`-Karte mit Namen als Label („Max“, „Lea“). Die Figuren sind attraktiv und zum Schmunzeln, sie werden nie lächerlich gemacht. Keine echten Personen.
- **Szenen-Fotos** für die Details der Story (Kerzen-Dinner, Nudeln mit Pesto, volle Kletterhalle, Gründerabend).
- **Effekt-Name als großer Serifentitel** (`SerifTitle`, kursiver Teil) genau in dem Moment, in dem er gesprochen wird. Das ist der Lern-Moment im Bild.
- **Karten und Mockups** für das echte Beispiel: Kalender „Fertig Di 11:00 / Abgabe Fr 16:00“, Chat-Eingabe bei ChatGPT, Pitch-Liste. Rote Draw-Kreise auf der Zahl, die zählt.
- **Ein Punch-Zoom auf 112 Prozent** bei der Story-Auflösung am Schluss. Ein-Wort-Untertitel mit `WordCaptions`. SFX leicht (Pops, Ticks, schnelle Whooshes), Musik nach den Regeln für den Account (Vivaldi „Summer“).
- **Hautton-Korrektur ist Pflicht (Pius 07.10.2026: „nicht so rot wie ne Tomate“):** Look `57ae6dc3` kommt aus HeyGen mit tomatenrotem Gesicht und gelblichen Zähnen. Vor Remotion `tightened-hold.mp4` graden, nur die Avatar-Ebene, mit dem **normalen Hautton** (abgenommen von Pius am 07.10.2026): `selectivecolor=reds=0.12 -0.04 0.08 0:whites=0 0 -0.08 0,huesaturation=saturation=-0.12:colors=r:strength=1.5`. Damit wird Rot zu einem warmen, natürlichen Ton geschoben, statt die Farbe rauszunehmen. **Nicht** `huesaturation=saturation=-0.45` nehmen, damit sah er „aus wie ne Leiche“. Kein starkes Entgelben der Weißtöne (`whites` -0.22), sonst wird die Wand lila. Immer einen Vorher/Nachher-Frame ansehen.
- Die Cues (`c`) kommen aus den Wort-Timings auf der gestrafften Timeline (`captions.json`), wie bei „Fünf Tische“.

## Ablauf

1. Lesen: dieses SKILL.md, das Log, `figur.md`, `abgelehnt.md`.
2. 6 bis 8 Kandidaten (Effekt + Dating-Story + echtes Beispiel, je ein Satz). Effekt fachlich prüfen und den Meme-Test machen.
3. Die gewünschte Zahl Skripte schreiben, im Format unten.
4. Aussprache-Check (siehe oben).
5. Pius zeigen und erst nach seinem OK an `gpt-satire-reel` übergeben: `script.txt`, `brief.md`, `format.json` (`{"account":"florentgpt","format":"GPT-S","variante":"effekt","look":"57ae6dc381e843e3b99a80c5e3b17e13"}`) in `broll/runs/gpts-<slug>/`. Den Schnitt nach dem Stil oben bauen.
6. Log ergänzen, Ablehnungen mit Grund in `gpt-gruender-satire/references/abgelehnt.md` eintragen.

## Ausgabeformat

````
## [Titel] · [Effekt] · ~[X] s
Gilt hier, weil: [ein Satz] ([Quelle]) · Aussprache: [ok / deutsch, Testergebnis]
```
[Sprechtext]
```
Lacher: [Satz] · Schickt man an: [wen]
````

## Referenz: die ersten beiden (07.10.2026, von Pius abgenommen)

```
Max hat beim ersten Date für Lea gekocht. Frische Pasta, drei Gänge, Kerzen.
Das ist zwei Jahre her. Seitdem fragt Lea jeden Freitag, was er kocht. Max kann eigentlich nur Nudeln mit Pesto.
Auf Englisch heißt das Ratchet Effect. Was du einmal lieferst, ist ab jetzt Standard. Für immer.
Und genau deshalb wird deine Firma mit KI nicht schneller.
Dein Kollege ist mit ChatGPT jetzt Dienstag um elf fertig. Abgeben tut er trotzdem erst Freitag um vier.
Weil er weiß, wer einmal Dienstag abgibt, muss ab jetzt immer Dienstag abgeben.
Er ist schlauer als Max. Er kocht von Anfang an nur Nudeln mit Pesto.
```
```
Lena wollte Männer kennenlernen, die nicht auf Hinge sind. Sie hat ChatGPT gefragt. Antwort, Kletterhalle.
Samstag hingen in der Kletterhalle vierzig Frauen. Und der Trainer.
Auf Englisch heißt das El Farol Bar Problem. Ein Geheimtipp funktioniert nur, solange ihn nicht alle haben.
Bei Startups passiert gerade genau dasselbe.
Ich war gestern auf einem Gründerabend. Zwölf Pitches. Zwölfmal dasselbe Startup.
Alle haben ChatGPT nach einer Lücke gefragt, in der noch keiner ist. Alle haben dieselbe gekriegt. KI für Steuerberater.
Jetzt kriegt jeder Steuerberater zwölf Anrufe pro Woche.
Lena ist übrigens mit dem Trainer zusammen. Der war nicht wegen ChatGPT da. Der arbeitet da.
```
