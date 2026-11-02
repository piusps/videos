---
name: gpt-satire-reel
description: Orchestrator NUR für das Satire-Format auf @florentgpt (B2C-Account, Satire für Endkonsumenten). Standard ist die Gründer-Figur aus gpt-gruender-satire, "atzig"/"fotzig" nur auf ausdrücklichen Wunsch. Läuft komplett automatisch von der Idee bis zum fertigen Reel im Look mit Cap rückwärts (bis es den gibt, kein Render) mit dem gleichen Satire-Schnitt wie auf @florent_preusser; stoppt nur beim Freigabe-Paket vor dem Upload. Kette - gpt-gruender-satire (Idee + Sprechtext, Standard seit 2026-10-05; gpt-satire nur für ausdrücklich atzige Videos; Effekt-Videos mit Dating-Story seit 2026-10-07 aus gpt-effekt-satire) → video-avatar-render (Cap rückwärts) → video-satire-edit → video-qc-delivery → video-publish (ohne Trigger, mit Engagement-Mechanik). Nutze diesen Skill bei "Satire für Florent GPT", "atziges/fotziges Video", "Satire-Video für den GPT-Account", "heutiges Satire-Video florentgpt". Nicht für @florent_preusser (dafür fp-satire-reel) und nicht für Hype-Videos (dafür gpt-normal-reel).
---

# GPT-S · Satire auf @florentgpt — Orchestrator

**Format-Kürzel:** GPT-S · **Account:** @florentgpt · **Varianten:** normal / atzig im Wechsel · **Look:** Cap rückwärts = Look `57ae6dc381e843e3b99a80c5e3b17e13` (seit 2026-10-06) · **Schnitt:** `video-satire-edit` (identisch zu FP-S) · **Seit 2026-10-27: Gegenmittel-Guide + Funnel** (`references/nutzen-bruecke.md`, Pflicht).

Keine Produktionsregeln hier, nur Reihenfolge, Übergaben und GPT-S-Besonderheiten. Übersicht: `reel-formate`.

## Abgrenzung

- Ideen und Sprechtext **standardmäßig aus `gpt-gruender-satire`** (Pius, 2026-10-05: Gründer-Figur nur für @florentgpt, komplett getrennt von FP-S). `gpt-satire` nur, wenn Pius ausdrücklich ein atziges/fotziges Video will. Nie `ki-satire`/`ki-satire-skript` (B2B), nie `gpt-hype-script`.
- Look: **Cap rückwärts** aus `video-avatar-render` → „Looks per format“. Solange es den Look nicht gibt, **kein GPT-S rendern**. Pius Bescheid geben, dass er einen ~15-s-Referenzclip mit Cap rückwärts aufnimmt. Nie der blaue, der sitzende oder der Cap-vorwärts-Look.
- Schnitt **nur** `video-satire-edit`, wie bei FP-S.
- Seit 2026-10-27 hat jedes GPT-S-Reel einen **Gegenmittel-Guide** und einen Zernio-Funnel mit Follow-Bitte. Regeln in `references/nutzen-bruecke.md`: Satire 0,0 unverändert, danach passenden Guide zuordnen, Outro nach der Pointe, pro Video `gegenmittel.json` + Log-Zeile. Kein Superkind.

## Variante wählen (vor Schritt 1)

1. Pius nennt sie → gilt.
2. Sonst Variante **gruender** (`gpt-gruender-satire`). Die normal/atzig-Rotation ist seit 2026-10-05 pausiert; atzig nur auf Zuruf. Tagesplan @florentgpt: 1 Hype-Video (`gpt-normal-reel`) + 1 Satire-Video pro Tag.
3. Nach der Lieferung (Schritt 4) eine Zeile in `rotation.md` anhängen: Datum, Variante, G-Nummer, Run-Ordner.

## Ablauf (Run-Ordner `broll/runs/gpts-<slug>/`)

| # | Skill | Was | Ergebnis |
|---|---|---|---|
| 0 | – | `format.json` = `{"account":"florentgpt","format":"GPT-S","variante":"gruender|atzig"}` | `format.json` |
| 1 | `gpt-gruender-satire` / `gpt-effekt-satire` (atzig: `gpt-satire`) | Satire genau wie bisher schreiben (Themen und Effekt unverändert). Runde schreiben (oder stärkstes gespeichertes Skript aus `~/.claude/florentgpt/satire/gruender/skripte/` nehmen), Kernregeln + blinde Bewertung müssen bestehen, stärkstes Skript als Sprechtext übernehmen. | `script.txt`, `brief.md` |
| 1b | – | Guide zuordnen + Outro anhängen (`references/nutzen-bruecke.md` §1–2), `gegenmittel.json` + Zeile im `gegenmittel-log.md` anlegen (§6, Gate: ohne beides kein Render) | `gegenmittel.json` |
| 2 | `video-avatar-render` | Satire-Variante (sitzend). Motion-Prompt normal = deadpan; atzig = deadpan mit mehr Attitüde (siehe dort) | `avatar.mp4`, `heygen.json`, `rawcheck.txt` |
| 2b | `video-guidebook --brand florentgpt` | fertigen Guide übernehmen/aktualisieren oder neu bauen, „Gegenmittel #N“ (§4) | `<slug>-guide.pdf` |
| 3 | `video-satire-edit` | gleicher Satire-Schnitt; bei atzig dürfen Sticker frecher sein (Abschnitt „Variante atzig“) | `<slug>-final.mp4` |
| 4 | `video-qc-delivery` | Desktop `~/Desktop/Florent GPT Videos/<Datum> <Thema> (Satire)/`, `texte.txt` mit Caption + erstem Kommentar (Angebot in der letzten Zeile), `replies.json` | Desktop-Ordner |
| 5 | `video-publish` | Freigabe-Paket (Stopp) → Upload auf @florentgpt (sobald in InstantDM verbunden, sonst lädt Pius selbst hoch) → erster Kommentar → erste-Stunde-Antworten | `publish.json` |

**Skript-Gate statt Stopp** (stehende Freigabe): Kernregeln von `gpt-gruender-satire` (bzw. `gpt-satire`-Filter bei atzig) müssen bestehen, sonst umbauen. „Skript erst zeigen“ → nach Schritt 1 stoppen.

**Atzig-Extra-Check vor dem Render:** Jede Zeile gegen `gpt-satire/references/figur-und-varianten.md` → Grenzen. Im Zweifel die Zeile entschärfen, nicht rendern. Ein gesperrtes oder gemeldetes Reel kostet mehr als ein zahmeres.

## GPT-Satire Stil (Henri 2026-10-09, gilt für jeden GPT-S-Schnitt)

1. **Leichte Dopamin-Stufe.** Satire-Schnitt aus `video-satire-edit` bleibt (Sticker, ein Punch-in, rote Kreise). Dazu **2–4 kurze Split-Panels à 1,5–3 s** auf Zahl-/Begriffs-Momenten: Slot-Zähler auf die Zahl („300 €“, „1.000.000 €“), Balken, Tickets/Karten fallen rein, Effekt-Name als ruhige Serifen-Kachel. Kein durchgehender Münzregen. **Die Pointe bleibt ruhig und unverdeckt.** FP-S (KI-Satire) bleibt vorerst ohne Dopamin.
2. **Kein „AI-Slop“.** Keine Emoji-Karten, kein gezeichnetes Clipart für Personen oder Szenen. Echte Fotos aus freien Stock-Quellen (Unsplash, Pexels; freie Lizenz, keine erkennbaren Promis). Unsplash/Pexels blocken Skripte per Bot-Check (nicht umgehen) → deren CC0-Uploads über die Openverse-API (`api.openverse.org/v1/images/?q=<motiv> unsplash&license=cc0,pdm`, Wikimedia-Thumbs nur in Standardgrößen wie `1280px-`). Personen als Freisteller mit weißem Rand (`rembg`, sonst macOS Vision per kleinem Swift-Tool, sonst runde Fotokarte mit weißem Rand). KI-Bilder nur, wenn fotorealistisch und kein Stock-Foto passt. Quell-URLs in `sources.txt` im Run-Ordner. Flache UI-Mockups (Chat, Ticket, Schalter) sind ok.
3. **Max. zwei Schriften** wie beim erfolgreichen 68k-Satire-Reel (`gpts-achtundsechzigtausend`, `SatireKit`): **Instrument Serif** für Begriffe/Titel, **Inter** für alles andere. Keine verspielten/runden/Comic-Schriften, keine Glow- oder Verlaufs-Effekte auf Satire-Stickern.
4. **Dopamin-Panels im gleichen ruhigen Stil:** flach, weiß, klare Ink-Zahlen, keine Glitzer-/Gold-/Casino-Effekte.
5. **Sprecher-Framing im Split (Henri 2026-10-09, „sieht scheiße aus“ bei v2):** Panel oben max. ~880 px (Standard 800), Sprecherbereich darunter ≥ ~48 %. Der Sprecher wird während eines Panels **nicht einfach nach unten geschoben**, sondern neu gerahmt: Gesicht mit `python3 scratchpad/facecheck/facefocus.py <tightened-hold.mp4> <PH/1920>` messen (Median-Gesichtsmitte + Box), dann skalieren (≥ 1.0, keine Seitenränder; liegt das Gesicht seitlich, z. B. x 0.35, Skala ~1.3–1.4 mit bündigem Bildrand) und so verschieben, dass das Gesicht horizontal ~mittig steht und Cap-Oberkante bis Kinn im Sprecherbereich zentriert sind: Luft über der Cap, Kinn klar sichtbar. Eine feste Rahmung pro Reel, weich ein-/ausgeblendet. Untertitel sitzen dann dunkel im Panel und verdecken nie das Gesicht. Vor dem Export `python3 scratchpad/facecheck/check.py <final.mp4>` → 0 bad, plus Frame-Sheet der Panels ansehen. Referenz v3: `SatireKostenV2.tsx` (SPLIT_S 1.35, PH 800).

Referenz: `broll/src/compositions/SatireKostenV2.tsx` (Run `gpts-effekt-versunkene-kosten`, `upload/gpts-effekt-versunkene-kosten-v2.mp4`, 2026-10-09). Upload-Datei < 10 MB halten (Encode wie in `mix.sh`).

## Nach dem Posten

Nach 48 h Zahlen (Aufrufe, Kommentare, Shares, Saves, Kommentare pro 1.000 Aufrufe, Mechanismus) ins `~/.claude/florentgpt/satire/ideen-log.md` beim G-Briefing. Nach je 10 Satire-Reels vergleichen: normal vs. atzig, welcher Mechanismus zieht. Ergebnis Pius melden und in `figur-und-varianten.md` festhalten.

> **Untertitel-Position (Henri 2026-10-12, Pflicht):** Im Fullscreen sitzen die Untertitel auf Brust-/Schulterhöhe, nie über Mund oder Augen. Im Splitscreen sitzen sie genau auf der Kante zwischen B-Roll-Panel und Avatar. Vor dem Export im Frame-Sheet prüfen.

## GPT-Satire Look v4/v5 (Apple-Basis + ChatGPT-UI, in Prüfung)

**Status: wartet auf Henris Freigabe.** Bis dahin gilt oben „GPT-Satire Stil“ (v1). Referenz: `broll/src/compositions/SatireAustralienV4.tsx` (Kartendaten `geo-australien.ts`), Run `gpts-australien`, `upload/gpts-australien-v4.mp4`. Verlauf: v2 abgelehnt („mega scheiße“), v3 = reiner Apple-Stil, Henri dazu: „bring auch noch son bisschen ChatGPT-Style rein und nicht alles Apple“.

### Hook 0–3 s maximal Dopamin, bis 15 s alle 1,5–2 s ein neuer Reiz (Henri 12.10., v5)

Retention-Ziel: Die Hälfte der Zuschauer geht erst nach 10–15 s. Referenz: `SatireAustralienV5.tsx`, `upload/gpts-australien-v5.mp4`.

- **Ab Frame 0 läuft eine Hook-B-Roll im Split-Panel.** Kein statischer Text über dem Avatar zum Start.
  - Der Text-Hook steht groß in der Szene und ist in der ersten Sekunde lesbar. Er ist zugleich das Cover.
- **0–3 s pausenlos dichte, geschichtete Bewegung**, alle 0,2–0,3 s ein Pop oder Spring. Beispiel Australien:
  - Globus dreht schnell ein (Bewegungsunschärfe) und rastet mit Überschwinger auf Australien ein.
  - Pin poppt, Bordkarte klappt ein, Flugzeug zieht mit leuchtender Spur nach Europa, der Globus folgt.
  - Tage-Zähler rast 0 → 365 mit Unschärfe und Punch beim Einrasten.
  - Chat-Blasen poppen, „ChatGPT denkt nach …“.
  - Danach räumen die Elemente seitlich ab, der Globus zoomt, eine Antwort streamt, das Schlüsselwort („verlernt.“) leuchtet auf dem gesprochenen Wort auf.
  - Dazu Kamera-Push, leichte Parallaxe und passende SFX-Treffer (Whoosh, Pops, Ticks, Tippen).
- **Bis ca. 15 s alle 1,5–2 s ein neuer visueller Reiz.** Beispiele: Szenenwechsel im Panel (Chat → Gabel, Karte → iPhone), Pop, gestreamte Antwort, oder in Vollbild-Lücken ein weicher Push-in-Schritt (+3,5 %) auf den Satzanfang.
- **Erst zur Pointe hin ruhiger.** Die Pointe bleibt frei und ruhig.
- Sauber bleiben: weiß/schwarz, ein Akzent pro Szene, keine Stempel, kein Raster, keine Emojis.
- **Frame-Sheet-Pflicht:**
  - 0–3 s in 0,25-s-Schritten (`fps=4`).
  - 3–15 s in 0,5-s-Schritten (`fps=2`).
  - Dazu das Gesamt-Sheet mit 1 Bild pro Sekunde.

### ChatGPT-UI-Anteil (neu in v4, etwa ein Drittel bis die Hälfte der B-Roll-Momente)

- **Übersetzungs-Moment als ChatGPT-Chat im iPhone:**
  - Kopf mit dem Wort „ChatGPT“ und kleinem Pfeil nach unten (kein Logo).
  - User-Blase rechts in Hellgrau `#F4F4F4`.
  - Antwort links, Wort-Token für Token gestreamt, mit gefülltem Tipp-Punkt (Ink `#212121`) am Ende, der vor dem Start pulsiert.
  - Kleines grünes Label „Italienisch“.
  - Eingabeleiste mit „+“, Platzhalter **„Frag alles“** und rundem Senden-Knopf mit Pfeil.
- **Sprachmodus statt Sprachmemo:**
  - Weiche Verlaufs-Kugel auf Schwarz (Weiß → Hellblau, rotierender Glanz, weicher Hof), die mit der Stimme atmet.
  - Ab „lauter“ pulsiert sie deutlich stärker (+16–28 %).
  - Label „ChatGPT · Sprachmodus“ mit grünem Punkt, Transkript-Wörter blenden einzeln ein.
- **Antwort-Moment vor der Pointe** („Das Handy übersetzt es trotzdem“): weißes Panel mit User-Blase „FOUR SPRITZ. PLEASE.“, gestreamter Antwort „Quattro Spritz, per favore.“ und Eingabeleiste. Endet vor dem Kellner-Satz, die Pointe bleibt frei.
- **Akzent pro Szene genau einer:** ChatGPT-Grün `#10A37F` in den ChatGPT-Szenen, Apple-Blau `#0071E3` nur noch beim Karten-Pin. Neutrale Töne `#F4F4F4` / `#212121`.
- **UI-Text:** etwa 25 % größer als in v3, damit er auf dem Handy lesbar ist.
- **Keine Logos:** kein OpenAI-Knoten, kein anderes Markenlogo. Der UI-Stil plus das Wort „ChatGPT“ reichen.

### Apple-Basis (aus v3, gilt in v4 weiter)

**v2 abgelehnt** (Henri 12.10.: „mega scheiße“). Nie wieder: Stempel, Raster-/Papier-Hintergrund, Condensed + Serife (Anton/DM Serif), Overlay-Karten über dem Avatar, Zähler, Wackeln.

- **Look:** sauber wie eine Apple-Keynote oder ein Produktfilm.
  - Viel Leerraum, eine Idee pro Szene.
  - Hintergrund pro Szene reines Weiß, `#F5F5F7` oder tiefes Schwarz, weiche Schatten.
  - Farben neutral (Weiß, Schwarz, Grau `#86868B`, Ink `#1D1D1F`), höchstens ein dezenter Akzent: Apple-Blau `#0071E3`, nur für Pin, Cursor, Abspielkopf und Sprachlabel.
- **Schrift:** eine saubere Sans, **Inter (variabel, `opsz` 32 = Display)**, lokal in `public/fonts/gpts/Inter-VF.ttf`, geladen per `FontFace` + `delayRender`.
  - SF Pro (`/System/Library/Fonts/SFNS.ttf`) liegt zwar lokal, wird aber **nicht verwendet**: Apples Lizenz erlaubt sie nicht für veröffentlichte Reels.
  - Headlines 600 mit enger Laufweite (−0,03 bis −0,045 em), Zweitzeilen 300–400 in Grau.
  - Kein Serif, kein Condensed, kein Mono.
- **Nur 1–2 große zentrale Typo-Momente pro Video** (hier „365 Tage“ und „Gabel.“). Sonst trägt die Szene, nicht die Schrift.
- **Echte B-Roll statt Karten:** selbst animierte Szenen, die das Split-Panel (oben 800 px) ganz füllen:
  - Weltkarte (Natural Earth, Public Domain) mit Fluglinie Sydney → Deutschland.
  - Gezeichnete Gabel aus gebürstetem Stahl als Hero-Shot: Lichtkante wandert, langsame Drehung und Push-in.
  - Kartenzoom im Apple-Maps-Stil auf Apulien mit Pin „Polignano a Mare“.
  - Schwebendes iPhone in 3D (gezeichnet, Dynamic Island) mit Übersetzen-UI DE → IT, Text tippt sich.
  - Sprachmemo auf Schwarz mit laufender Wellenform. Bei „lauter“ wachsen die Ausschläge, Transkript-Wörter blenden einzeln ein.
  - Keine Fotos, kein Ken Burns, keine Karten über dem Avatar.
- **Motion:**
  - Physikalisch weich: ease-in-out `bezier(.42,0,.58,1)`, Auslauf `bezier(.16,1,.3,1)`.
  - Einblenden: Blur 12 → 0, Skala 0,96 → 1, 18 px Anstieg.
  - Langsame Push-ins und Parallaxe in jeder Szene, Panel gleitet in 0,34 s ein und aus.
  - Nach jeder B-Roll ein sanfter Push-in auf den Sprecher (+4,5 % über 0,9 s). Vor der Pointe ein weicher Punch-in (+7 %), kein harter Schnitt.
- **Vollbild-Cut-ins** (Avatar ganz weg): nur wenn das Bild trotzdem ein Gesicht zeigt, sonst meldet `check.py` „no face“. Deshalb laufen alle Szenen im Split.
- **Bleibt:**
  - Wörtliche Ein-Wort-Untertitel in Inter 600, weiß mit dezentem Schatten auf Brust-/Schulterhöhe. Im Split genau auf der Kante (über weißen Panels Ink mit weißem Halo).
  - Hook-Text auf Frame 0, Pointe ruhig auf dem Sprecher ohne Text.
  - Sprecher-Rahmung wie v1, `check.py` muss 0 bad ergeben, Upload unter 9,8 MB.
  - Musik Vivaldi Summer, SFX nur leise Whooshes und Klicks.

> **Retention-Hook (Henri 2026-10-12, Pflicht für alle Reels):** 0–3 s maximal Dopamin in der B-Roll (mehrere Ebenen gleichzeitig in Bewegung, alle 0,2–0,4 s ein Pop/Stagger/Zähler/Push, passende SFX, Text-Hook groß integriert), danach bis ca. 15 s alle 1,5–2 s ein neuer visueller Reiz. Ziel: nicht nach 3 s die Hälfte verlieren, sondern frühestens nach 10–15 s. Clean bleiben (kein Slop).

> **Hautton (Henri 2026-10-12):** Avatar nicht zu rot/warm. Natürlicher, neutraler Hautton: auf die Avatar-Ebene (nicht die B-Rolls) eine leicht kühlere Farbkorrektur mit weniger Rot in Mitten/Lichtern und ca. −10–15 % Sättigung in den Rottönen. Vorher-Nachher-Standbild prüfen (keine roten/orangen Wangen, kein Grün- oder Graustich).
> Referenz-Filter Hautton (Australien v7, 12.10.): `colortemperature=temperature=6800:pl=1,colorbalance=rm=-0.05:rh=-0.04:bm=0.015,huesaturation=saturation=-0.10:colors=r` nur auf die Avatar-Quelle vor Remotion.

> **Split-Framing weiter (Henri 2026-10-12):** Im Split nicht nur das Gesicht zeigen, sondern Kopf mit Cap, Schultern und die Hand mit dem Mikro (Skala ~1.0–1.05, keine Seitenränder; Gesicht darf leicht außermittig sein). Push-ins im Vollbild sanft (max. ~1.06).

> **Stil-Iterationen schnell (Henri 2026-10-12):** Bei Look-/Stil-Änderungen zuerst nur eine kurze Draft-Vorschau der betroffenen Stellen rendern (z. B. erste 3 s + eine Beispielszene + Ende, halbe Auflösung, ~10–15 min), Henri zeigen, erst nach seinem OK das ganze Video in voller Qualität.

> **ChatGPT im Bild = nur die echte Oberfläche, interaktiv (Henri 2026-10-21):** Kommt ChatGPT im Video vor, läuft die ganze B-Roll in `src/components/ChatGPTWeb.tsx`: die ChatGPT-Web-App in echten CSS-Pixeln (an chatgpt.com gemessen: Seitenleiste 260 px, Zeilen 36 px/14 px, Eingabefeld 52 px hoch, Radius 28, Systemschrift), schmales Fenster (900 px), damit die Chat-Spalte ins Hochformat passt, gefilmt mit `WebCam` wie eine herangezoomte Bildschirmaufnahme. Immer interaktiv: Mauszeiger (`cursorAt`) mit Klicks und Hover, „Neuer Chat“ klicken, Frage ins Eingabefeld tippen, Senden drücken, Antwort streamt, Seitenleiste und Listen scrollen echt (`track`), Menüs/Dialoge per Klick (`ProfileMenu`, `SettingsDialog`, `MemoryDialog`), Hervorhebung als blaue Textauswahl. Keine eigenen Karten, Kreise, Pillen oder Zähler. Akzentfarbe Blau `#2F7CF6` (`GreenReel accent`). Seitenleisten-Titel erfunden, nie echte Chats. Referenz: `src/opus/GptAccountWeb.tsx`.
