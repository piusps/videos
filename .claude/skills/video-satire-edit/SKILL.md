---
name: video-satire-edit
description: Schnittstil für Niklas' Satire-Reels (Skripte aus ki-satire / ki-satire-skript) im Stil von help.hannaa. Speaker bleibt die ganze Zeit groß im Bild, Rhythmus kommt aus kleinen Stickern über dem Kopf (Mail-/Chat-Mockups, Emojis, Screenshots), dünnen weißen Serifen-Titeln, handgezeichneten Pfeilen mit Notizen und Ein-Wort-Untertiteln auf Brusthöhe. Nutze diesen Skill immer, wenn ein Satire-Skript zum Video wird ("mach das Satire-Video", "Satire mit Avatar", "Skript für B-0xx als Video"), statt video-broll / video-broll-explainer und statt der normalen Untertitel/Hooks aus video-post-production. Nicht für Ersetzt-Demos und Tutorial-Reels (die bleiben im Explainer-Stil). Gilt accountübergreifend für beide Satire-Formate (FP-S über fp-satire-reel, GPT-S über gpt-satire-reel), Render immer im sitzenden ruhigen Look.
---

> **STOPP – keine Satire auf @florent_preusser (Henri 2026-10-21):** FP-S wird nicht mehr produziert, eingeplant oder gepostet. Satire gibt es nur noch auf @florentgpt (GPT-S). Wer nach Satire fragt, macht GPT-S. Bitte um FP-Satire: einmal nachfragen, ob wirklich gewollt.

# Satire-Schnitt (help.hannaa-Stil)

**Gilt für beide Satire-Formate** (Pius, 2026-10-01): FP-S auf @florent_preusser (`fp-satire-reel`) und GPT-S auf @florentgpt (`gpt-satire-reel`). Gleicher Schnitt auf beiden Accounts; Account und Variante stehen in `format.json` im Run-Ordner. **Render:** FP-S immer im sitzenden ruhigen Look (Niklas Office), GPT-S immer im **Cap-rückwärts-Look** (Pius 2026-10-02, Look-ID siehe `video-avatar-render`). Nie im blauen Look. Beim Cap-Look die Sticker-Position neu am Gesicht ausmessen (Selfie-Winkel, Gesicht sitzt höher als beim sitzenden Look). Pius schickt noch Editing-Vorlagen; die werden hier eingearbeitet und gelten dann für beide Accounts.

Eingeführt 2026-09-30 auf Wunsch von Pius ("gewöhn dir für die Satire-Videos einen anderen Editing-Style an"). Referenzen: help.hannaa `DdtOZlRsGDm` (Hedonic Treadmill), `Ddyluk0IVV_` (Meta Muse), `Dd1f0OxonRJ` (Hot-Crazy-Matrix). Erstes Video: `broll/runs/satire-chatgpt-mail/` (Komposition `SatireMail`, Kit `src/components/SatireKit.tsx`).

## Was den Stil ausmacht (aus den Referenzen gemessen)

- **Speaker immer im Vollbild.** Kein Split, keine Vollbild-Boards, kaum Schnitte (Szenenerkennung: 3 bis 6 Cuts pro Reel). Die ältere Regel „keine Overlays auf dem Avatar“ gilt hier ausdrücklich nicht.
- **Sticker über dem Kopf.** Kleine Karten mit runden Ecken und Schatten (Screenshots, Chat-Bubbles, Mail-Mockups, Logos, Emojis) im oberen Drittel (beim blauen Look waren das y 100 bis 640 px; für den sitzenden Look sitzt das Gesicht bei ca. x 0.70, y 0.49 des 1080×1920-Frames, gemessen für Zooms am 2026-09-29; Sticker also links/oberhalb davon, genaue Zone beim ersten Satire-Render im sitzenden Look messen und hier eintragen), nie über dem Gesicht. Sie poppen **auf dem Wort** auf, das sie nennen, und verschwinden beim nächsten Beat. Ungefähr alle 2 bis 4 Sekunden ein neuer Sticker.
- **Serifen-Titel.** Dünn, weiß, Instrument Serif (normal plus kursive Zeile), ohne Box, oben links oder zentriert. Für Begriffe, Listen („1. Die Begrüßung“) und den Hook.
- **Handgezeichnete Pfeile plus kurze Notiz** in kursiver Serifenschrift (`Note`), z. B. „dein Input:“ neben dem 👍.
- **Untertitel: ein Wort, weiß, Inter Bold ~54 px, auf Brusthöhe (y 0.8), ohne Pill, ohne Farbe.** Keine Vision-Captions, keine Keyword-Farbe.
- **Kamera ruhig:** leichter Drift (1.0 bis 1.025 über das ganze Video), genau **ein** harter Punch-in (1.12) auf den Wiedereinstieg vor der Pointe („Und jetzt kommt's“).
- **Hook = Serifen-Titel ab Frame 0** (voll sichtbar, ist das Thumbnail), zwei Zeilen, zweite kursiv. Keine Vision-Hook-Pill.
- **Kein Outro, kein Trigger-Wort**, außer das Briefing verspricht einen Guide. Nach der Pointe kurz das letzte Bild halten (~1 s, `tpad`), dann Ende, damit der Loop greift.
- **Ton (geändert 2026-10-02, Pius: „lustige Musik wie beim letzten Mal“):** **lustige Musik ist Pflicht** — Standard „Fluffing a Duck“ (Kevin MacLeod, CC BY 4.0, `~/Downloads/Kevin_MacLeod_Fluffing_a_Duck_KLICKAUD.mp3`), ca. 14 dB unter der Stimme mit Sidechain-Ducking (`sidechaincompress`), läuft ab Frame 0 bis zum Ende. **Auf @florentgpt (GPT-S) stattdessen Vivaldi „Summer“** (`/Users/pius/Downloads/Vivaldi_Summer_KLICKAUD.mp3`, gleiche Mischung) — die Accounts dürfen nie gleich klingen (Pius, 2026-10-02); Fluffing a Duck nur auf @florent_preusser. Dazu leise UI-Pops (Lautstärke ~0.10) auf Sticker-Einstiegen und ein leiser Whoosh (~0.07) auf Listenpunkten. Tempo 1.1x, loudnorm −14 LUFS.

## Nachmessung 2026-10-01 (100 Reels, 8 Top-Reels Bild für Bild, Pius: „1:1 übernehmen“)

Rohdaten: `/Users/pius/LinkedIn Generator/research/creators/` (`reels-meta.json`, `help.hannaa/*.mp4`, `sheets/help.hannaa_*.jpg`). Median 82.700 Plays, Top 696k („Antifrugale WG“, Repost), 512k, 292k.

- **Schnitte:** 0 bis 10 pro Reel (Median ~4). Einzeiler (12 bis 18 s) haben **null** Schnitte. Schnitte sind fast immer **Ortswechsel** (Büro → Balkon → Kartons → Bad), nie Tempo-Cuts. Für den Avatar: kein Ortswechsel möglich, also Rhythmus nur über Sticker; höchstens ein harter Wechsel auf eine Vollbild-Tafel (siehe unten).
- **Hook-Titel tippt sich ein:** Der Serifen-Titel erscheint in Frame 0 und **schreibt sich Buchstabe für Buchstabe** („Antifr…“ → „Antifrugale WG“) in ~0,6 s, steht dann voll (Thumbnail). Groß (~90 px bei 1080 Breite), dünn, weiß, zentriert oben oder unten-links über der Schulter; zweite Zeile oft kursiv. Teilweise mehrzeilig gestapelt („Arbeitszeit / betrug / Setup“).
- **Untertitel:** ein Wort, weiß, fett (Inter/SF Bold ~54 px), **ohne Box**, auf Brusthöhe (y ≈ 0,72 bis 0,78). Satzzeichen bleiben dran („Ressourcenschonend.“, „Modulen,“). Zahlen als Ziffern („29.200“, „432“).
- **Sticker-Typen (alle über dem Kopf oder seitlich neben dem Kopf, nie über dem Gesicht):** freigestellte PNGs von Produkten/Logos (Alete-Glas, HelloFresh-Box, Handy), App-/Programm-Fenster (PowerPoint, Kalender, Mail), grüner Haken, Zahnräder, Chat-Eingabe-Karten („Hey kannst du mir d…“), kleine Foto-Karten mit runden Ecken.
- **Freigestellte Personen neben dem Kopf:** bekannte Gesichter (z. B. Musk/Bezos) als Cutout, halb hinter der Sprecherin. Für uns: nur Big-Tech-Personen des öffentlichen Lebens und erkennbar satirisch, keine Privatpersonen, keine Kunden.
- **Rechen-Tafel:** dunkle Navy-Karte (`#0F2433`-artig) oben mittig, dünne weiße Serifen-Schrift, Zeile für Zeile erscheinend („4 x 55€ = 3120€“, „3h x 52 = 156h“), Ergebnis als letzte Zeile. Standard für das Format Kostenrechnung.
- **Rote Handschrift-Notiz** mit geschwungenem Pfeil auf ein Element (rot, kursive Serife: „Erstgeborener“ → Matrix-Feld).
- **Geister-Bild:** großes Bild mit ~25 % Deckkraft im Hintergrund hinter dem Kopf für Kontext (Film-Szene, Person).
- **Effekt-Overlay sparsam:** z. B. fallende Geldscheine bei Geld-Pointen (1 pro Reel, max. 2 s).
- **Ton:** Original-Stimme (Hanna ohne Musik; bei uns seit 2026-10-02 trotzdem lustige Musik drunter, siehe oben); SFX-Mix aus Tippen, Kassenklingeln, Mausklick, Timer (Instagram-Sounds) leise auf Sticker/Zahlen.
- **Requisit:** Sie hält ein Handmikro (Fell-Windschutz) in der Hand. Beim sitzenden Avatar nicht nachbaubar; nicht faken.

## Ablauf

1. **Render (video-avatar-render):** FP-S sitzender Look mit weißer Wand (Niklas Office `f4f3ac11af8f444e9904645e6cbacc5f`, zentral, Kragen, Hände anfangs verschränkt; Pius 2026-10-02, nicht mehr `fc009bc…` mit orangem Licht und Superkind-Projektor), GPT-S Cap-rückwärts-Look, Stimme nikstudio, Motion-Prompt „Seated deadpan“ aus `video-avatar-render` → „Looks per format“ (bei GPT-S atzig mit dem Attitüde-Zusatz). Glossar nur, wenn „Superkind“ im Text vorkommt. Pointen, die als Frage flach klingen könnten, als Aussage mit Punkt schreiben (der Text auf dem Bildschirm trägt das Fragezeichen). Das erste Satire-Video (`satire-chatgpt-mail`) lief noch im blauen Look `42a2318d…`; das ist überholt.
2. **Stage A:** `silence-cut.mjs --min-silence 0.35 --pad 0.1` (etwas mehr Pause als bei Tutorials, Timing ist Teil des Witzes), `transcribe.mjs --script`. **Seit 2026-10-20 (Henri) folgt der Schnitt dem Transkript** wie in `video-post-production` → „Der Schnitt folgt dem Transkript“: Aufzählungen und Einschübe knapp, Satzende mit Ausklang (Stimme geht runter), kurze Pause vor jedem neuen Gedanken, die längste Pause (~0,4–0,6 s) direkt vor der Pointe. Nie alle Pausen gleich lang.
3. **Cues:** Wortzeiten der Sticker-Wörter aus `captions.json` in `cues.json` schreiben.
4. **Komposition:** neue Datei `src/compositions/Satire<Titel>.tsx` mit `SatireKit` (Sticker, SerifTitle, Note, WordCaptions, Card, MailHead, Bubble). Video über `tightened-hold.mp4` (tightened + 1 s `tpad`/`apad`) in `public/<run>/`. Den Witz immer zusätzlich ins Bild legen (Zitat als Mockup, Pointe tippt sich ein, roter Kreis drumherum), weil die Avatar-Stimme Rollen und Ironie nicht spielen kann.
5. **Stills prüfen** (Frame 0, jeder Sticker, Punch-in, letzter Frame) mit `remotion still --scale=0.25`, dann rendern.
6. **Finish per ffmpeg:** SFX per `adelay`/`amix` (Varianten über `scripts/vary-sfx.mjs`, nie zweimal dieselbe Datei hintereinander), lustige Musik ~14 dB unter der Stimme mit Sidechain-Ducking, dann `setpts=PTS/1.1` + `atempo=1.1`, dann loudnorm zweistufig. (Nicht `render-pipeline.mjs`: dessen FinalVideo legt Vision-Captions und Hooks drauf.)
7. **Lieferung** nach `video-qc-delivery`: Desktop-Ordner des Accounts mit Zusatz „(Satire)“, Cover = Frame 0 (Serifen-Hook), `texte.txt` mit kurzer Hanna-Caption (ein Satz mit Dreh + ein Satz Aufforderung, keine 6-Teile-Formel, kein Trigger) und dem ersten Kommentar zum Anpinnen, beides nach `~/.claude/skills/reel-formate/references/satire-engagement.md` (Teile B und C). Den im Skript eingebauten Engagement-Mechanismus (Teil A) im Bild unterstützen, z. B. bei der Lücken-Liste die leere Nummer 4 als Sticker mit „steht in den Kommentaren“.

## Variante atzig (nur GPT-S)

Gleicher Schnitt, gleiche Regeln, nur die Sticker dürfen frecher sein: Reaktions-Sticker (Augenroll-, Totenkopf-, Clown-Emoji), Chat-Screenshots mit peinlichen Nachrichten, rote Durchstreichungen, „lost“-Stempel. Untertitel bleiben ein Wort, weiß. Keine Sticker, die Gruppen von Menschen verspotten (Grenzen in `gpt-satire/references/figur-und-varianten.md`).

## Nicht tun

> **Seit 2026-10-09 (Henri) für GPT-S vorrangig:** `gpt-satire-reel` → „GPT-Satire Stil“ (echte Stock-Fotos statt KI-/Clipart/Emojis, 2–4 ruhige Dopamin-Panels, nur Instrument Serif + Inter).

- Keine echten Personen oder Logos von Kunden/potenziellen Kunden als Sticker (Regel aus ki-satire). Big Tech und erkennbar erfundene Figuren („Jens (Kollege)“) sind ok.
- Keine Karten über Mund oder Augen, keine Sticker im unteren Drittel (dort sitzen Hand und Untertitel).
- Keine Pills, keine orangen Keywords, keine Explainer-Boards in Satire-Reels.

> **Untertitel-Position (Henri 2026-10-12, Pflicht):** Im Fullscreen sitzen die Untertitel auf Brust-/Schulterhöhe, nie über Mund oder Augen. Im Splitscreen sitzen sie genau auf der Kante zwischen B-Roll-Panel und Avatar. Vor dem Export im Frame-Sheet prüfen.

> **Retention-Hook (Henri 2026-10-12, Pflicht für alle Reels):** 0–3 s maximal Dopamin in der B-Roll (mehrere Ebenen gleichzeitig in Bewegung, alle 0,2–0,4 s ein Pop/Stagger/Zähler/Push, passende SFX, Text-Hook groß integriert), danach bis ca. 15 s alle 1,5–2 s ein neuer visueller Reiz. Ziel: nicht nach 3 s die Hälfte verlieren, sondern frühestens nach 10–15 s. Clean bleiben (kein Slop).

> **Hautton (Henri 2026-10-12):** Avatar nicht zu rot/warm. Natürlicher, neutraler Hautton: auf die Avatar-Ebene (nicht die B-Rolls) eine leicht kühlere Farbkorrektur mit weniger Rot in Mitten/Lichtern und ca. −10–15 % Sättigung in den Rottönen. Vorher-Nachher-Standbild prüfen (keine roten/orangen Wangen, kein Grün- oder Graustich).
> Referenz-Filter Hautton (Australien v7, 12.10.): `colortemperature=temperature=6800:pl=1,colorbalance=rm=-0.05:rh=-0.04:bm=0.015,huesaturation=saturation=-0.10:colors=r` nur auf die Avatar-Quelle vor Remotion.

> **Split-Framing weiter (Henri 2026-10-12):** Im Split nicht nur das Gesicht zeigen, sondern Kopf mit Cap, Schultern und die Hand mit dem Mikro (Skala ~1.0–1.05, keine Seitenränder; Gesicht darf leicht außermittig sein). Push-ins im Vollbild sanft (max. ~1.06).

> **Untertitel-Pille @florent_preusser (Henri 2026-10-12):** Untertitel als Pille im Claude-Orange (ca. #D97757) mit weißer Schrift, Claude-Stil. Position wie gehabt: im Split genau auf der Kante, im Vollbild auf Brusthöhe, nie über Mund/Augen. Gilt für @florent_preusser (FP-S und ggf. FP-N); @florentgpt bleibt bei seinem eigenen Untertitel-Look.

> **Guide-Scroll-B-Roll (Henri 2026-10-12):** siehe unten.
> Guide-Scroll Dauer: ca. 1,5–3 s. Echte Guide-Seiten, falls vorhanden; sonst sauberer Nachbau mit Titel und Kapiteln. Gilt für alle Accounts.

> **Stil-Iterationen schnell (Henri 2026-10-12):** Bei Look-/Stil-Änderungen zuerst nur eine kurze Draft-Vorschau der betroffenen Stellen rendern (z. B. erste 3 s + eine Beispielszene + Ende, halbe Auflösung, ~10–15 min), Henri zeigen, erst nach seinem OK das ganze Video in voller Qualität.

> **Keine geposteten Reels umschneiden (Henri 2026-10-12):** Neue Stile/Regeln nie an einem schon geposteten Reel ausprobieren oder es als Beispiel neu schneiden. Immer ein frisches, noch nicht gepostetes Reel nehmen, das danach auch raus kann. Vorher in InstantDM/Run-Ordnern prüfen, ob es schon online ist.
