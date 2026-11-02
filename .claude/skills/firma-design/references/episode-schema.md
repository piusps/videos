# Firma-Serien-Engine – episode.json

Seit 2026-10-28 ist jede Folge von @pickthecompany **Daten, kein Code**:
`broll/public/firma-ep/tag<N>/episode.json` + `voice.mp3` + `words.json`.
Die Engine (`src/compositions/FirmaEpisode.tsx`, Bausteine in `src/components/firma/`, Einstieg `src/index-firma-episode.tsx`) baut daraus die Folge im Tag-1-v7-Stil.
Referenz-Folge: `public/firma-ep/tag1/episode.json` (reproduziert v7 Frame für Frame, Vergleich-Brett `runs/firma-ep/tag1/vergleich-v7-engine.jpg`).

## Befehle

```bash
cd "/Users/pius/LinkedIn Generator/broll"
node scripts/firma-episode-render.mjs public/firma-ep/tag<N> --stills            # nur Style-Frames + Brett (~15–25 s)
node scripts/firma-episode-render.mjs public/firma-ep/tag<N>                     # alles (~1:45 min für 44 s)
node scripts/firma-mix.mjs public/firma-ep/tag<N>                                # nur Ton
scripts/firma-compare.sh <referenz.mp4> runs/firma-ep/tag<N> "55 120 702 ..."    # Seite-an-Seite-Brett
```

Flags: `--stills`, `--frames=120,300` (zusätzliche Stills), `--no-desktop`, `--concurrency=4`.
Ausgabe: `runs/firma-ep/tag<N>/` (style-frames/, style-frames.jpg, contact-2fps.jpg, render/tag<N>.mp4, -handy.mp4, mix.wav, mix-info.json).
Desktop: `~/Desktop/Superkind Videos/<date> Superkind baut Firma Tag <serientag>[ Folge <folge>]/Versionen/tag<N>-engine[-k].mp4`. Nie überschrieben, sondern hochgezählt.
Das Render-Skript baut ein schlankes public (`/tmp/firma-ep-public`: claude.svg, paper-crumple.png, firma-ep ohne Audio) und ein Bundle in `/tmp/firma-ep-bundle-<pid>`, räumt alte Firma-/Remotion-Bundles in /tmp vorher weg und löscht beide am Ende.

Messwerte Tag 1 (43,7 s, M-Mac): Bundle 2 s, 15 Style-Frames 9 s, Voll-Render 62 s (concurrency 4), Mix + Mux + Handy 28 s → **gesamt ~1:45 min**. Ton −14,2 LUFS, TP −1,1 dBTP.

## Anker (Zeit-Grammatik)

Jede Zeitangabe ist ein `Anchor`:
- Zahl = absolute Sekunden.
- `"Wort"` = Start des ersten Worts (Vergleich ohne Groß/Klein und Satzzeichen).
- `"Wort#2"` = zweites Vorkommen.
- `"Wort@23"` = erstes Vorkommen ab 23 s. **Pflicht bei häufigen Wörtern** (das, ein, kein, und, KI, Claude …).
- `"Wort:end"` = Wortende.
- `"Wort@23+0.33"` / `"Wort-0.12"` = Versatz. Nur **ein** Versatz am Ende (`"x-0.12+0.8"` ist ungültig).
- `"$name"` = benannter Anker aus `anchors` (z. B. `"send": "kaufen+0.25"`).
- Zahlen als Wort: `"300"`, `"1"` (so wie in words.json).

Ein nicht gefundener Anker bricht `calculateMetadata` mit Klartext ab (`anchor not found: "…"`). Das ist gewollt.

## Felder

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `tag` | ja | Ordner-Schlüssel `public/firma-ep/tag<tag>/` |
| `folge` | nein (= tag) | interne laufende Nummer, 5 pro Kalendertag; wählt auch den Musik-Startpunkt |
| `serientag` | nein (= tag) | Kalendertag der Serie; **die angezeigte/gesprochene Zahl** |
| `ersteFolgeDesTages` | nein (= true) | siehe Regel Tag/Folge |
| `seconds` | nein | Länge; sonst letztes Wortende + 1 s |
| `keyword` | ja | Kommentar-Keyword (Endkarte) |
| `date` | nein | YYYY-MM-DD für den Desktop-Ordner |
| `audio` | nein | `{voice: "voice.mp3", words: "words.json", musicStart, musicGain}` (`musicGain` = Startfaktor der Duck-Kurve, Standard 1; der Mix senkt ihn selbst weiter, bis jeder Akt ≥ 15 dB unter der Stimme liegt) |
| `anchors` | nein | benannte Anker |
| `plan` | ja | Gründungsplan: `steps` (beliebig viele, 9 pro Seite), `current` (0-basiert), `done` [Indizes], `hudDone` (Anker: Häkchen im HUD), `title`, `sub` |
| `hook` | ja | `headline` [Zeilen], `hot` (Index der orangen Zeile), `stamp` (z. B. „GANZ ALLEINE.“), `prop` (ObjKind in der Kiste, sonst leer + Motte), `tileLabel`, `at` (HookKeys → Anker) |
| `claude` | ja | Paper-Claude-Akt (s. u.) |
| `wall` | nein | Ideen-Wand: `cards` [{label, icon}] (≤ 9), `fill`, `counter` {label, at, keys [[Anker, Wert, Dauer]], digits}, `hl`, `dim`, `strike` |
| `acts` | ja | Akte in Zeitreihenfolge (s. u.) |
| `bot.hops` | nein | [[Anker, Höhe]] Hüpfer; sonst automatisch |
| `umsatz` | nein | Umsatz-Zähler (s. u.) |
| `sfx` | nein | zusätzliche SFX [{t, f, v}] |

### Feste Eröffnung (seit 2026-10-28)
Gesprochen: „Wie viel Umsatz macht ein Unternehmen, das eine KI hundert Tage lang ganz alleine führt? Ich probier das aus.“ + nur bei `ersteFolgeDesTages: true` „Tag zwei.“ Titel: `headline: ["Wie viel Umsatz macht", "eine KI in 100 Tagen?"], hot: 1, stamp: "GANZ ALLEINE."`. Die Headline steht bei y 228 (unter der HUD-Zeile, weil das Tag-Badge bei Nicht-ersten Folgen ab Frame 0 steht). Erste Folge: großer „TAG N“-Slam auf `tagWord`, Zahl auf `tagNum` (= `serientag`), fliegt danach ins HUD. Sonst: kein Slam, kein Hochzählen, nur HUD-Badge „TAG N“ ab Frame 0.

### Hook-Keys (`hook.at`)
`ki ganz alleine ein unt aufbaut ich probier das aus tagWord tagNum sie kein missing end`. Nicht gesetzte Keys werden proportional zu v7 auf `end` skaliert.
Für die Umsatz-Eröffnung („Wie viel Umsatz macht ein Unternehmen, das eine KI hundert Tage lang ganz alleine führt? Ich probier das aus. Tag N.“) gilt: `ki` → „Umsatz“ (Titel-Drop), `ein`/`unt` → „Unternehmen“, `aufbaut` → „hundert“, `ganz`/`alleine` wie gesprochen, `ich`/`probier`/`das`/`aus` wie gesprochen, `tagWord`/`tagNum` → „Tag“/Zahl (nur erste Folge des Tages). Titel z. B. `headline: ["Wie viel Umsatz macht", "eine KI in 100 Tagen?"], hot: 1, stamp: "GANZ ALLEINE."`.

### Claude-Akt (`claude`)
`steps` [{label, at}] (Chips „FRAGE 1/3“ …), `feature` {label, icon, plus, pick, on} (Plus-Menü → Feature-Pill, z. B. Research), `prompt` (ganzer Text), `typing` [[Anker, „bis einschließlich dieser Teilstring“ | "" | "*"]], `marks` [{find, at, color: yellow|orange|red|blue|green}], `send`, `rehook` {lines, pill, from, to}, optional `at`, `logo`, `moveUp`, `cursorFrom`.
Der Prompt muss echt sein (so wie er in Claude funktioniert). Feature-Namen nur, wenn es sie in claude.ai wirklich gibt.

### Akt-Typen (`acts[]`, jeder mit `type` + `at`)
| type | Felder | Bild |
|---|---|---|
| `wall` | `thinkUntil` | Ideen-Wand mit Zähler (Daten aus `wall`) |
| `chain` | `stations` [3× {obj, label, at?, labelAt?, arrowAt?}], `logo`, `badge` {big, small, at, station}, `item` {obj, at, fly}, `back` {at, go, arrive}, `lid` | 3-Stationen-Kette mit Pfeilen und fliegendem Teil |
| `winner` | `card` (Wand-Index) oder `label`+`icon`, `fly`, `dimAt`, `stamp` (Standard „→ LABEL“), `stampAt`, `hold` | Gewinner-Karte fliegt vor, Rest gedimmt |
| `question` | `lines`, `pill` („NOCH OFFEN“), `stamp` (null = keiner), `stampAt`, `pop`, `bubble` | offene Frage-Karte |
| `table` | `title`, `cols`, `rows`, `rowAt` [Anker je Zeile], `hl` {row, at}, `stamp`, `stampAt` | Vergleichstabelle |
| `mock` | `kind` website\|logo\|shirt\|price, `name`, `line`, `sub`, `cta`, `color`, `stamp` | Entwurf (Website, Logo, Shirt, Preisschild) |
| `claudeShot` | `src` (Pfad unter public/, echter claude.ai-Screenshot), `title`, `scroll` [von, bis px], `marks` [{x,y,w,h,at}] | echter Screenshot im Paper-Fenster |
| `hub` | `done`, `next` | Gründungsplan: aktueller Schritt abgehakt, nächster „MORGEN“ |
| `recap` | `product` {label, at}, `banner` {text, at}, `last` {step, label, at}, `today` {step, pill, at} | **Rückblick-Akt, Pflicht seit 2026-10-28, direkt nach dem Hook, ≤ 6 s** (s. u.) |
| `why` | `card` (Wand-Index) oder `label`+`icon`, `pill`, `pillAt`, `cards` [{icon, big?, small, at, hot?}] | **Warum-Beat, Pflicht seit 2026-10-28** (s. u.) |
| `end` | `headline`, `keywordAt`, `plane` [an, aus], `itemsAt`, `copyAt`, `items` [{label, snip}], `result` {at, line1, line1At, parts [{text, at, hot}]}, `hopAt` | Kommentar-Endkarte |

### Rückblick-Akt `recap` (Pius 2026-10-28)
Gleicher Aufbau in jeder Folge. Steht in `acts` an erster Stelle; die Engine schiebt ihn zeitlich zwischen Hook und Claude-Akt. Mit `recap` entfällt der alte „heute fehlt X“-Kisten-Shot (h4), `hook.at.end` = Start des Rückblicks.
- Bild: Gründungsplan ganz im Bild (oben, y ≈ 230–1010 px, ganze Breite), erledigte Schritte grün mit Haken. Board-Labels ≈ 3,5 % Bildhöhe (vorher 1,3 %).
- `product` {label, at}: Produkt-Karte (Shirt + Label) fliegt auf das Wort **unter** das Board (x 40–680, y 1046–1340). Sie deckt nie eine Board-Spalte und nie das Untertitelband.
- `banner` {text, at}: orange Banner in der Karte („erst auf Bestellung\ngedruckt“, `\n` = Zeilenumbruch).
- `last` {step?, label, at}: der zuletzt erledigte Schritt (Standard: höchster Index in `plan.done`) leuchtet grün auf, hüpft, und zeigt ab dann das Ergebnis der Vorfolge als Label (klein der Schrittname, groß `label`, z. B. „WASCHEN ZUERST“). Das Ergebnis bleibt auch in späteren Board-Shots stehen.
- `today` {step?, pill, at}: auf „Heute“ fliegt die Kamera auf die Zeile des heutigen Schritts (Standard `plan.current`; Board bleibt in voller Breite, kein Label angeschnitten), der Schritt leuchtet gold und poppt, die Produkt-Karte fliegt raus, die Pill (`„HEUTE: DRUCK FÜR 60 °C“`) steht unter dem Board.
- Claude-Akt beginnt ohne `claude.at` automatisch 1,6 s nach `today.at`.
- Länge: Die Engine warnt (`WARN recap act is … s long`), wenn der Rückblick länger als 6 s ist. Das Skript muss das liefern; der Rückblick-Text ist **ein** Satz Projekt + **ein** Satz Vorfolge + „Heute: …“.
- `plan.current` darf in `plan.done` stehen (Folge vertieft einen erledigten Schritt): dann wird er erledigt gezeigt.

```json
{
  "type": "recap", "at": "Ihre-0.08",
  "product": { "label": "SHIRTS MIT LOGO", "at": "Logo-Shirts" },
  "banner": { "text": "erst auf Bestellung\ngedruckt", "at": "gedruckt" },
  "last": { "step": 1, "label": "WASCHEN ZUERST", "at": "Waschen" },
  "today": { "step": 2, "pill": "HEUTE: DRUCK FÜR 60 °C", "at": "Heute" }
}
```

### Warum-Beat `why` (Pius 2026-10-28)
Das gewählte Objekt bleibt stehen (die Kamera fährt in 0,3 s vom Gewinner-Bild nach oben, Karte im oberen Drittel), Kopf-Pill „WARUM …?“ (y 860), darunter 2–3 Grund-Karten nacheinander (y 1010 + i·190, je Icon + 1–3 Wörter, optional große Zahl). Untertitel rutschen im Warum-Akt auf y 1660 und werden nie verdeckt.
- `card`: Wand-Index des Gewinners (Wand + geflogene Karte bleiben, ohne Stempel). Ohne Wand: `label` + `icon` (CardIcon) = eigene große Karte.
- `pill`, `pillAt` (Standard: Akt-Start + 0,1 s).
- `cards[]`: `icon` (WhyIcon: `thermoHot thermoCold chart search shirt shirt1x clock euro warn check truck people`), `small` (1–3 Wörter), `big` (optional, z. B. „60 °C“), `at` (Anker, Karte erscheint auf dem Wort), `hot` (orange Zahl; Standard: erste Karte mit Zahl).
- **Harte Regel:** Zwischen zwei Karten-Ankern ≥ 1,2 s, sonst bricht die Engine ab (`why act N: card K comes x s after …`). Warnung bei < 2 oder > 3 Karten oder wenn die letzte Karte < 1,2 s steht.

```json
{
  "type": "why", "at": "Warum-0.12", "card": 3, "pill": "WARUM ERST WASCHEN?", "pillAt": "Warum",
  "cards": [
    { "icon": "thermoHot", "big": "60 °C", "small": "Wäsche auf dem Bau", "at": "Auf@30" },
    { "icon": "thermoCold", "big": "30 °C", "small": "vertragen gängige Drucke", "at": "Gängige" }
  ]
}
```

Referenz-Test: `public/firma-ep/test-tag3/episode.json` (Folge 3 v8 über die Engine, `ersteFolgeDesTages: false`) und `public/firma-ep/test-tag3-first/` (gleich, aber `serientag: 2`, erste Folge des Tages, nur Bildtest des Slams).

Objekt-Katalog (`ObjKind`): `shop printer parcel shirt laptop phone coins mail box partnerBot emptyBox`.
Karten-Icons (`CardIcon`): `flyer shirt glove cape bag more coffee candle bone web plant box phone soap`.

### Bausteine seit Folge 4 (2026-10-28, alle optional, Tag 1–3 unverändert)
- `hook.result` = Frame-1-Ergebnis-Objekt (2D, Bildmitte, h1/h2): `{kind: "washer", temp: "60 °C", fillAt?, spinAt?, outAt?, labels: [{temp: "95", text: "STICK", ok: true}, {temp: "30", text: "DIGITALDRUCK", ok: false}]}`. Waschmaschine mit Temperatur-Display (Puls auf `fillAt`), Trommel dreht ab `spinAt` schnell, zwei Pflegeetiketten (ok = grün ✓, sonst rot ✗, nie durchgestrichen). Fliegt bei `outAt` (Standard: „Ich“) raus. Im Cover-Modus ersetzt ein großes „TAG N“-Badge (unten rechts) das HUD-Badge.
- `claude.attach` `{label, sub?, at}`: Datei-Chip (MD) fliegt über den Composer (z. B. Ergebnis der Vorfolge). Mit `claude.moveUp: 99` bleibt der Composer unten und das Logo stehen.
- `claudeShot.cam` [[Anker, scale, cx, cy] …]: Kamera im echten Screenshot (cx/cy = Bildpunkt bei 1000 px Breite, der in die Fenstermitte kommt), 0,45 s weich je Key. Damit wird die Schlüsselzeile ≥ 40 px groß. `marks[].color` (yellow|orange|red|blue|green). ReHook läuft auch über claudeShot.
- `why.cards[].vs` `{big, small, at, bad?}`: Gegenwert in der rechten Kartenhälfte („30 °C Digitaldruck“), erscheint auf seinem Wort, `bad` = rot mit ✗. Vorher steht ein blasses „?“. `why.chip` `{text, at}`: kleiner Chip unter der Kopf-Pill („beim selben Anbieter“). Mit vs-Karten liegen die Karten ab y 1060, 222 px Abstand.
- Wand-Karten: `label` mit `\n` = zweizeilig (Name weiß, Wert gold), z. B. `"STICK\n95 °C"`.
- `end.itemTag`: Chip-Text vor jedem Item (Standard „FRAGE“, z. B. „DM“).
- Echte Screenshots mit privatem Inhalt (z. B. Begrüßung mit Namen) vorher zuschneiden (`01-composer.png` = 01 ohne Begrüßung).

## Regel Tag / Folge (Pius 2026-10-28)
- Ein **Serientag** ist ein Kalendertag; pro Tag laufen **5 Folgen**. `folge` zählt intern durch, `serientag` ist die gezeigte Zahl.
- Nur die Folge mit `ersteFolgeDesTages: true` zeigt und spricht den Tag: „TAG N“-Slam im Hook, Tag-Badge fliegt danach ins HUD.
- Die anderen 4 Folgen (`ersteFolgeDesTages: false`): **kein Tag-Stempel im Hook**, kein „Tag N“ im Skript. Das kleine HUD-Badge „TAG N“ steht ab Frame 0 und zählt innerhalb eines Tages **nie** hoch.
- Die SFX für Slam/Zahl/Flug fallen bei Nicht-ersten Folgen automatisch weg.

## Regel Umsatz-Zähler (Pius 2026-10-28)
- `umsatz` = `{start, gains?: [{at, amount}], popAt?, days?: 100}`; `start` = Umsatz bis Folgenbeginn (laut Bibel/Wirtschaftsbuch, **nie erfunden**).
- **Unsichtbar, solange der Umsatz 0 € ist**, auch im Hook. Kein `umsatz`-Feld oder `start: 0` ohne `gains` → kein Zähler.
- **Erste Einnahme der Serie** (`start: 0` + erster `gains`-Eintrag > 0): großer Pop in der Bildmitte, rollt 0 → Betrag, fliegt nach ~2 s ins HUD und bleibt dort.
- **Ab dann** (`start > 0`): HUD „UMSATZ x €“ + „TAG N / 100“ + Fortschrittsbalken poppt bei `popAt` (Standard: erstes gesprochenes „Umsatz“, sonst 0,3 s), rollt 0 → start und bleibt. Weitere `gains` zählen mit Akzent (Glow + „+X €“) hoch.
- Position: HUD-Leiste oben (x 214–866, y 42–166) zwischen Tag-Badge und Mini-Plan. Sie deckt weder Captions noch Wand/Board.
- SFX: popHigh + roll beim Erscheinen, pro Einnahme popHigh, roll, chime.

## Musik
`/Users/pius/Downloads/GONE_GONE_THANK_YOU_KLICKAUD.mp3` (375,5 s), **nie geloopt**.
Startpunkt = `audio.musicStart`, sonst `MUSIC_STARTS[(folge-1) % n]` aus `[276.36, 12, 58, 104, 150, 196, 236, 322]` (nur Starts, die bis zum Ende reichen).
Lautstärke-Kurve (Duck unter Stimme, Stille beim Slam) und SFX kommen aus dem Timeline-Modul. 2-Pass-Loudnorm auf −14 LUFS, TP −1.
**Abstand Musik ↔ Stimme (seit 2026-10-28):** `firma-mix.mjs` rendert Stimme und Musik (nach Duck-Kurve) als Stems, misst EBU-R128-Momentary alle 100 ms und rechnet pro Shot/Akt den sprachgegateten Abstand (nur Fenster mit Stimme > −28 LUFS nach Endgain). Liegt ein Akt unter 15,6 dB, wird die ganze Musik-Kurve gesenkt und neu gemischt (max. 4 Runden). `mix-info.json` enthält `lufs`, `truePeak`, `musicGain`, `minGapDb`, `gapOk` und `gapsPerAct` [{shot, a, b, voice, music, gapDb}]. Unter 15 dB → `WARN` im Log.

## Neue Folge – Ablauf
1. Ordner `public/firma-ep/tag<folge>/` mit `voice.mp3` + `words.json` (Wortzeiten der Stimme).
2. `episode.json` aus der letzten Folge kopieren und Texte, Anker, Akte, `plan.current`/`done`, `umsatz`, `folge`/`serientag`/`ersteFolgeDesTages` anpassen.
3. `--stills` → Style-Frames ansehen. Ankerfehler zeigt das Skript im Klartext.
4. Voll-Render. Fehlt ein Baustein (neuer Akt-Typ, neues Objekt), wird er in `src/components/firma/` gebaut und hier eingetragen, nie in eine Einzel-Komposition.

## Zusatzfelder (Folge 5, 2026-10-28, `src/components/firma/extras.tsx`, alle optional, Default unverändert)
- `hook.result` `{ kind: "priceTags", main: {top, big}, stamps: [{text, at}], fillAt?, outAt? }`: Frame-1-Preisschild (nie Obergrenze) + Reihe Shop-Schilder mit roten „ERST AB n“-Stempeln auf den Ankern. SFX: Clack je Stempel.
- `recap.last.obj` `{ kind: "yarn" | "shirt", text, at }`: Objekt-Karte rechts neben der Produkt-Karte unter dem Board (z. B. Garnrolle „Garn 95 °C“).
- `wall`-Akt `tie` `{ left, mid, right, at }`: Banner über der Wand (y 236), z. B. „UNSER PAKET · mit · RUND 110 €“.
- `question`-Akt `objects` `[{ kind?: "careShirt" | "chip", text, at, color?: "orange" | "gold" }]`: careShirt = Shirt mit Pflegeetikett (Text „Shirt-Stoff 60 °C“ → Zahl als blaue Pill), Chips daneben; ohne careShirt eine Chip-Reihe bei y 1215.
- `claudeShot` `crop: [y0, y1]`: nur dieses Band des Screenshots (Anzeige-px, 1000 px breit) ist sichtbar – für Namen (Begrüßung) oder Zahlen, die nicht gesprochen werden.

## Zusatzfelder (Folge 6, 2026-10-28, `story.tsx` / `story-data.ts`, alle optional, Default unverändert)
- `story` = durchgehendes 2D-Objekt vom Hook bis „Als Nächstes“ (Folge 6: A61-Partnerkarte): `{ name, sub, label {text, at?}, stamps [{text, at?, color green|orange|red}], fields [{text, at}], glowAt?, chip? {text, at}, bill? {title?, rows [{label, value, at?, bad?}], diff {text, at?}}, show [{at, place: hook|top|small|off, bill?, pill?}], beats? [{at, what: label|stamp|bill0|bill1|diff|push}] }`. Ohne `at` = ab Frame 0 sichtbar. `show` gleitet 0,45 s zwischen Plätzen (hook = Bildmitte unter der Headline, top = oberes Drittel über Warum/Frage, small = klein oben, off = raus). Ein hook-Key bei t ≤ 0 steht ab Frame 0 ohne Pop. `bill` = Kassenbon (Zeilen rollen hoch, `bad` rot, `diff` als rote Pill-Zeile). `chip` nur im Platz `top`. Im Cover sitzt die Karte 170 px tiefer, damit der Stempel lesbar bleibt. Mit `hook.planFrom` das Board erst nach der Karte zeigen (kein Überlappen).
- `plan.wip` [Index]: Kachel orange mit „IN ARBEIT“ (z. B. PREIS, wenn PARTNER davor gezogen wird).
- `question.card: false`: keine 3D-Fragekarte (das story-Objekt trägt den Beat). `question.bot {dx?, dz?, s?}` und `wall.bot {dx?, dz?, s?, whyOnly?}`: Maskottchen-Position (whyOnly = in Wand/Gewinner ausgeblendet, nur im Warum) (Standard 2.0/0/1.05 bzw. −1.2/−0.4/1.05). Regel: Maskottchen ganz im Bild oder höchstens ⅓ angeschnitten.
- `hook.keepHeadline: true` (Folge 8): Hook-Frage + Stempel bleiben in allen Hook-Shots h1–h3 stehen (sonst nur h1). Standard aus.
- `nameCheck` (Folge 8, `namecheck.tsx`, optional, top-level): 2D-Story-Objekt für eine Namens-Folge, alle Zeiten Anker. `name`; `hook {note {title, struck[], count, total, label}, status[], out, beats[{at, what: push|counter|stitch|status|note|q}]}` = Frame 1 Shirt-Brust mit gesticktem Namen + Zettel mit gestrichenen Namen + gelbe Statuskarte, liegt UNTER der Hook-Frage; `recapPatch {at, pulse?, out}` (LOGO-Patch aufs Produkt-Shirt), `recapCard {top, tag?, big, small, at, bigAt?, smallAt?, out}` (neutrale Karte rechts unter dem Plan); `wall {at, title, sub?, label, cards[≤10], hot?, strikes[{cards[], at, why, hlAt?, markAt?}], pushAt?, mini?, proof?}` (Namenswand + Zähler „x von 10 gestrichen“, Gründe nur wörtlich aus dem Lauf); `winner {card, dimAt, fly, stamp, stampAt}` (Karte fliegt aufs Shirt, Name wird gestickt); `why {at, pill, pillAt, cards[{icon: crew5|searchLens|searchList, lines[], small?, at, smallAt?, hot?, hotAt?, stampAt?}]}`; `fields {at, pill, pillAt, items[{label, status, tone: yellow|grey, at, statusAt, note?}]}`; `next {at, pill, pillAt, lines[], linesAt, logoAt, mark?{word, at}}`; `end`. Dazu Akte `wall` (ohne top-level `wall`) und `question` mit `card:false` als Kamera-/Raum-Träger; SFX über `ep.sfx`. Achtung Anker: Wörter wie „Als“ kommen oft früher schon vor → immer `Wort@Zeit`.
  - Ergänzt 2026-10-29 (Folge 8 R2, alle optional, Default unverändert): `hook.strong: true` = starke Hook-Beats (Zähler zählt 0→N neu, Nadel läuft über den fertigen Namen + Glanz, Statuskarte kippt ein, Zettel streicht nacheinander neu), Statuskarte ≥ 60 px unter dem Shirt, Zettel rechts; `hook.outDur` (Abgang in s, Default 0,35); `next.cut: true` = harter Schnitt bei `end` (kein Ausblenden, Shirt fliegt nicht über den nächsten Akt); `stage {why?{y,s}, fields?{y,s}, shirtOnTop?, stampTop?, stampFrom?}` = Shirt-Platz in Warum/Haken (≥ 40 % Bildbreite: s ≥ 0,56), Shirt über Pills/Karten, Stempel unter dem Namen. `stage.whyOutLead` (s, optional, 2026-10-29 Folge 8 R2): Warum-Karten sind so viele Sekunden vor der Haken-Pill schon raus (kein Pill-über-Pill); Default unverändert. Mit `stage` wird der Shirt-Name als EINE HTML-Textebene gezeichnet (die SVG-Gradient-/Pattern-Textebenen hat der lange Chrome-Render doppelt und abgeschnitten gerastert).
- `botHide: [[von, bis], …]` (top-level, optional, 2026-10-29): Maskottchen in Wand-/Gewinner-Shots schrumpft in diesen Fenstern weg (0,2 s), z. B. wenn die Kamera es halb anschneidet.
- `why.cards[].icon: "careLabel"`: Waschwanne mit grüner „60“.
- `audio.dips` [[Anker a, Anker b, Faktor]]: Musik zwischen a und b × Faktor (z. B. gesungenes Wort in der Musik unter die Stimme drücken). Geht in die Mix-Kurve von firma-mix ein.

### Hook-Zusatzfelder (Folge 5, Hook-Recheck)
- `hook.instant: true` → Headline (alle Zeilen) + Hook-Objekt stehen ab Frame 0 voll da (kein Pop-in). Default false.
- `hook.planFrom: Anchor` → Gründungsplan-Tafel ist in den Hook-Shots bis zu diesem Zeitpunkt ausgeblendet (Hook-Objekt überlappt nie den Plan). Default: immer sichtbar.
- `hook.result.punch: Anchor[]` (nur priceTags) → harte 2D-Push-ins (+4 % je Punch, mit Überschwinger + Whoosh), damit zwischen den Stempeln alle ≤0,5 s ein Bild-Event kommt.
- Lehre Folge 4 (R2-1/R2-2): Stempel/Labels nur mit Aussagen aus Skript/Lauf, keine eigenen Ableitungen; Maskottchen ganz im Bild oder höchstens ⅓ angeschnitten (`recap.bot`, `wall.bot`, `question.bot` mit dx/dz/s).

## Zusatzfelder (Folge 7, 2026-10-29, `src/components/firma/objects.tsx`, alle optional, Default unverändert)
- `hook.result.kind: "calcSheet"` → fertige Rechentabelle ab Frame 0: `sheet` (SheetSpec: `title`, `cols`, `hotCol`, `rows[] {label, vals, tone ["good"|"bad"|"dim"], hot}`, `note {text}`, `stamp {text}`), `beats[] {at, what: push|bad|good|sweep|note|stamp}` (sichtbares Event je Beat; push = Punch-in +8 % mit Rückfedern), `outAt`, `y`. Beat-Sounds kommen aus `ep.sfx`.
- Akt `result` (Vorschlag-/Ergebnis-Akt): `sheet` (SheetSpec, zusätzlich `rows[].at`, `rows[].valAt[]`, `note.at`, `tag {head, big, small, at, bigAt, smallAt}` = hängendes Preisschild), `hl {row, at}`, `y`, `scale`, `bot`. Heiße Zeile rollt die Zahl hoch.
- `winner.bare` / `why.bare` → keine 3D-Gewinnerkarte, kein Stempel-Plate, keine WhyCards/Kopf-Pille der Engine (Overlay-Objekte tragen den Beat). Die why-Karten bleiben für den ≥ 1,2 s-Check. `winner.bot` / `why.bot` / `result.bot` = Maskottchen-Platz {dx, dz, s}.
- `overlays[]` (Top-Level) = zeitgesteuerte 2D-Objekte `{kind, from, to, …}`: `pill` (text, y, color), `partners` (2 Partnerkarten mit Plätzen mini|duel|swap|top|haken|off über `keys`, `stamp` pro Karte rutscht bei `stampOff` ab, `swap` = Gewinner nach vorn, `bigStamp {text, at, until}`, `proof` = Screenshot-Ausschnitt als Beleg-Kachel; optional seit Folge 19: `proof.x` = Mittelpunkt x (Default 540), `proof.bare` = nur das Bild ohne Rahmen/Orange-Marker, z. B. Badges auf Board-Zellen), `bars` (Balken + gestrichelte Vergleichslinie, `inside` = Wert im Balken), `card` (Hauptwert + grauer Vergleich rechts), `careTag` (Pflegeetikett, Durchstreichen, Zitat, Chip), `nameSign` (Namensschild „Firma ???“ + Kette der nächsten Schritte mit Schlössern).
- `end.items[].table: string[][]` → Mini-Tabelle statt Snip-Text (erste Zeile = Kopf), kein Datei-Icon.
- `audio.musicCurve: [sec, level][]` → eigene Musikkurve aus beats.json statt Duck-Kurve; `audio.musicGain` skaliert sie, der Mix senkt weiter bis ≥ 15 dB Abstand (Regie-Kurve ~0,03 braucht etwa musicGain 3 für ~18 dB).

## Zusatzfelder (Folge 16, 2026-10-31, Maskottchen-/Lesbarkeits-Optionen, alle optional, Default = bisheriges Verhalten, Folge 13–15 rendern unverändert)
Anlass: finale Prüfung Folge 16 (K.-o. Maskottchen im Claude-Fenster und Untertitel über den Augen im CTA, Endkarten-Text < 3 % Bildhöhe). Folge 17 nutzt dieselben Felder.
- `captionY: [{ "from": Anker, "to": Anker, "y": px }, …]` (top-level): Oberkante des Untertitel-Bands im Fenster [from, to) statt 1400 (Warum-Akt 1660). Erstes passendes Fenster gewinnt. Folge 16: `geprüft:end+0.06 → Nach-0.06` y 1720 (Heute + Claude-Weg, Untertitel unter dem Maskottchen), `Kommentiere-0.15 → Anleitung:end+0.3` y 1640 (CTA mit Plan: unter den Augen), danach y 1110 (CTA-Mitte zwischen Ergebnis-Box und Maskottchen).
- claudeShot-Akt `bot: { dx, dz, s, hide }`: Maskottchen im Claude-Hintergrund dieses Akts (Versatz vom Standardplatz, Skala Standard 0,8, `hide` = keins). Folge 16: `{ "dx": -0.45, "dz": 0.6, "s": 0.45 }` = klein unter der Fensterunterkante, Augen frei, ganz im Bild.
- end-Akt `big: true`: DM-Label ≤ 62 px (fitPx), Snip 58 px einzeilig, Ergebnis-Box 250 px hoch mit line1 96 px / parts 72 px. Label kurz halten (Folge 16: „Anleitung“), sonst wird es gekürzt.
- end-Akt `resultY: px`: Oberkante der Ergebnis-Box (Standard max(1130, unter den DM-Einträgen)). Folge 16: 820 = füllt die CTA-Mitte.
- `ringLight: Zahl` (top-level, Folge 18, 2026-11-01): Faktor für das Punktlicht des Glow-Rings unter dem Maskottchen (`world3d.tsx` GlowRing, Modulwert `RING.light`, gesetzt in `FirmaEpisode.tsx`). Standard 1 = unverändert. Folge 18: 0,3, damit die Maskottchen-Front orange bleibt statt weiß auszubrennen (Design-Ticket R1-06, Backlog F16-R2-03).
- question-Akt `pill: ""`: Karte ohne Kopf-Pill („NOCH OFFEN“/„ALS NÄCHSTES“ war < 3 %), Zeilen 60 px höher zentriert. Fehlt `pill` ganz, bleibt der Standard „NOCH OFFEN“.
- Prüf-Regel dazu: Overlay-Unterkante bzw. Claude-Fenster (WIN_Y 214 + 1166 = 1380) nie über den Augen; vor dem Render 5-fps-Ausschnitt unten rechts über Heute/Claude/CTA ansehen.

- `end.planeTo [x, y]` (optional, Folge 19): Ziel des Papierfliegers statt Maskottchen-Kopf (nie über die Augen). `end.sentIcon: true` (optional): Senden-Chip zeigt nur ein Haken-Icon statt „✓ gesendet“.
