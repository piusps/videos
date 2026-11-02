GESAMTNOTE: 8/10, BESTANDEN

# Finale Prüfung Folge 7 „Preis“ · Runde 2 · frischer firma-pruefer · 2026-10-29

Slot 2026-10-29 18:00 (nicht die erste Folge des Tages).
Prüfling: `runs/firma-tag7/firma-tag7-final.mp4` (Stand 10:36, 1080×1920, 30 fps, 1436 Frames = 47,87 s, Ton 47,87 s), `cover.jpg`, `caption.txt`, `preis-guide.pdf`/`guidebook.json`, `replies.json`, `format.json` (`PTC`).
Maßstab: script.txt, words.json, LAUF.md, autor-runde3.md, final-runde1.md. Design-Belege: hookcheck-r3/.
Eigene Belege: `pruefung/final-r2/`. Nichts gerendert, eingeplant oder gepostet. Geändert wurden nur dieser Bericht und die Dateien in `final-r2/`.

## Was sich gegenüber R1 geändert hat (`diff-gegen-r1.txt`)
Bildabweichung zu `firma-tag7-final-r1.mp4` gibt es nur in diesen Abschnitten: 0–4,10 s (Hook), 4,97–6,27 s (Rückblick-Einstieg), 16,60–16,80 s und 17,23–17,60 s (Partner-Minikarten), 28,50–28,97 s (Warum-Karte 3) und 32,97–34,67 s (Counter/Notiz). Alles andere ist identisch. Der Ton korreliert mit R1 zu r = 0,9997 und mit dem aktuellen `render/mix.wav` zu 0,9999. Es gibt keine Doppelframes (keine Frame-Differenz < 0,05). Die 3 fehlenden Endframes aus R1 sind ergänzt (1436 statt 1433 Frames).

## Ticket-Abnahme R1

| Ticket | Status | Beleg |
|---|---|---|
| final-R1-1 Hook-Regel | **erfüllt** | `hook-0-6s-4fps.jpg`, `frame-diff-hook.txt`. Die Karte selbst trägt jetzt die Beats: 0,75 s „−35,63“ und die A61-Spalte pulsen rot, 1,0 s Printful-Spalte grün, 1,5 s Zeilen-Sweep Rohertrag, 2,0 s Printful-Rohertrag leuchtet, 2,5 s Notiz „gerechnet, nicht verdient“ springt, 3,1 s Karte kippt und „GANZ ALLEINE.“ setzt auf. In der Kartenregion (y700–1330) ist der längste Lauf ohne Bewegung (Diff < 0,5 Graustufen) 0–3,83 s nur **0,20 s** lang, R1 hatte 0,75 s. Ab 4,9 s (Wort „Die“) zoomt das Board, ab 5,0 s fährt die Kamera durchgehend (Board-Diff 7–13 je Frame), bei 5,93 s fliegt „SHIRTS MIT LOGO“ ein. |
| final-R1-2 Warum-Karten ≥ 1,2 s | **erfüllt** | `why-27.6-31.jpg`. „rund 15 €“ steht ab ≈ 28,4 s (bei „nachbestellt“) voll lesbar, ab 28,6 s zusammen mit „A61 35,80 €“, und schrumpft erst ab ≈ 30,0 s. Das sind **≈ 1,6 s**. Der Vorschlag-Zettel wird nicht überlappt. |

Die Nebenpunkte aus R1 sind ebenfalls erledigt:
- Der Counter springt bei 33,0–34,7 s ohne lesbare Zwischenwerte von „?“ auf +33,50 €.
- „gerechnet, nicht verdient“ steht im Ergebnis-Akt ≈ 1,6 s (33,0–34,6 s).
- Die Partner-Minikarten liegen bei 16,6 s nicht mehr über der Pill „EXCEL · 75 FORMELN“ (`partner-16.4-17.8.jpg`).
- Die Endframes sind komplett.

## Prüfpunkte

| # | Punkt | Note | Beleg |
|---|---|---|---|
| 1 | Beide R1-Tickets | 9 | Siehe oben. |
| 2 | Hook: Frame 0, kein Stillstand, kein Overlap | 8 | **Frame 0** (`frame0.png`) zeigt die ganze Frage als Headline „Wie viel Umsatz macht eine KI in 100 Tagen?“ (Kurzform wie F3/R1, akzeptiert) und die volle Kalkulationskarte. **0–6 s @ 4 fps:** in jedem Raster ändert sich ein Objekt, keine 0,5 s Stillstand. Gesamtbild: 0–0,13 s die ersten 4 Frames ruhig, 3,70–3,83 s 0,2 s Leerbühne zwischen Karten-Abflug und Board, beide < 0,5 s, Pills und Maskottchen laufen weiter. **Overlap:** Die Karte ist ab 3,67 s ganz raus, das Board erscheint ab 3,87 s, die beiden sind nie gleichzeitig im Bild (`uebergang-3.3-4.3-15fps.jpg`). Kleiner Rest: 4,60–4,87 s bewegt sich das Board nur leicht (Glow/Settle, Diff 2,5–16). Abzug 1 Punkt, aber unter der Schwelle. |
| 3 | Kein „Tag N“, kein Umsatz-Zähler, +33,50 nur mit „gerechnet, nicht verdient“ | 9 | STT: kein „Tag“ gesprochen. Titel ohne Tag. Caption ohne „Tag“. Es bleibt nur das HUD-Badge „TAG 2“ oben links, wie in R1 akzeptiert: Serien-HUD, Kalendertag 2 stimmt. Kein Umsatz-Zähler im ganzen Video (`kontakt-0.5s.jpg`). +33,50 erscheint im Hook (0–3,7 s), im Ergebnis-Akt (33,0–34,7 s) und auf dem Cover, jedes Mal in derselben Karte mit „gerechnet, nicht verdient“. Die Pill „33,50 €“ (33,5–34,9 s) steht ebenfalls gleichzeitig mit der Notiz im Bild. Die Caption sagt „netto, geplant, nicht verdient“. |
| 4 | Claude-Screens privat | 9 | `claude-12.6.png`, `claude-14.5.png`: DOM-Klon ohne Sidebar, ohne Begrüßung, ohne Chat-Titel und ohne Namen. Sichtbar sind nur der Anhang „Shirt-Firma Ergebnis Partner.md“, der Prompt, „Project“ und „Opus 5.5 Medium“. Kleinigkeit: Die Markierung um „A61“ bei 14,5 s schneidet das Wort an („komm[t A6]“). Das war schon in R1 so, ist nicht neu und kein Ticket. |
| 5 | Ton | 9 | `ebur128.txt`: **−14,0 LUFS**, TP −1,2 dBFS, LRA 1,3. Länge **47,87 s** (≤ 48). Musikabstand je Akt, Median aus den aktuellen Stems (`musik-abstand.txt`): Hook 19,9 · Rückblick 18,0 · Claude 18,8 · Wechsel 16,8 · Warum 18,7 · Vorschlag 20,4 · Haken 18,0 · Als Nächstes 22,2 · CTA 19,4 dB, alle ≥ 15. `scripts/music-explicit-check.mjs` auf dem Musik-Stem (`music-explicit-check.txt`): Text „Thank you for the love … I don't ever wanna fall in love again“, **kein explizites Wort**. STT des Final-Mix (`stt-final.txt`) = Skript. Bekannte Abweichungen sind nur STT-Varianten: „probiere“, „Formel“ und bei 23,4 s „hundereineundfünfzig“. Letzteres war schon in R1 so, der Stimm-Stem ist laut R1 sauber. |
| 6 | Zahlen 1:1 mit LAUF.md | 10 | Video, Cover und STT stimmen mit LAUF.md überein: 151 (151,40 €), 69 (69,14 €), 110, 109, +33,50, rund 15 (15,41), dazu −35,63 und 35,80 €. **69 € nie als eigene Preiskarte:** Die Zahl erscheint nur als Balkenbeschriftung im Vergleich „Einkauf 5 Shirts“ (26,9–30,0 s) und als Zelle „69,14 €“ in der Kalkulation. |
| 7 | Caption / Replies / PDF | 9 | `caption.txt` hat **2098 Zeichen** (≤ 2200). Sie endet mit „(Fiktives Experiment, keine echten Umsätze.)“, danach eine Leerzeile und nur Hashtags. Keine Emojis in Caption und replies.json. Der Menüpfad Settings > Capabilities steht drin. Der CTA verspricht „die Frage und die Kalkulationsvorlage mit allen Formeln“. Der Guide (`guidebook.json`) enthält „Die Frage“ (3×), „Kalkulationsvorlage“ (4×) und Formeln (14× „Formel“, Formelzellen). Die leere Vorlage liegt zusätzlich unter `guide/Kalkulationsvorlage-leer.xlsx`. Das Versprechen ist gedeckt. Die Replies sind neutral, jede endet mit einer Frage. |
| 8 | Nichts Neues kaputt | 8 | Geändert sind nur die genannten Abschnitte, alle geprüft. Übergang Hook → Board sauber. Rückblick, Board, Kacheln und Pills bei 4,9–6,3 s sauber (`hook-4.3-6.1-10fps.jpg`). Bei 16,4–17,8 s keine Kollision mehr. Warum- und Ergebnis-Akt sauber. Keine Doppelframes, Ton nicht versetzt. `cover.jpg` ist unverändert und ok: Frage „Welchen Preis rechnet die KI?“ + Karte mit Notiz. Gemini-Review lief nicht (OpenRouter 402, < 1 $ Guthaben, `gemini-review.txt`). Ersatz war die manuelle Frame-Prüfung, deshalb nicht höher als 8. |

## K.-o.-Prüfung
Kein K.-o. verletzt:
- keine falsche Zahl
- keine Bibel-Abweichung
- keine Direktansprache außerhalb des CTA
- keine Emojis
- kein Umsatz-Zähler
- kein „Tag N“ gesprochen oder im Titel
- keine privaten Daten in den Claude-Screens
- Musik ohne explizites Wort

## Scroller-Test
- 1 s: Frage + rote/grüne Zahl, die Karte pulst. Bleibt.
- 3 s: Stempel „GANZ ALLEINE.“ + Karte kippt. Bleibt.
- 10 s: Board mit „A61 mit Vorbehalt“ und „Heute: Preis rechnen“. Bleibt.

## Tickets
Keine. Hinweise ohne Ticket für spätere Folgen:
- Markierungen im Claude-Prompt exakt auf die Wortgrenzen setzen (14,5 s).
- Gemini-Review nachholen, sobald OpenRouter wieder Guthaben hat.
- HUD-Badge „TAG N“ in Nicht-Erstfolgen bleibt eine Serienentscheidung von firma-chef (in R1 und R2 akzeptiert).
