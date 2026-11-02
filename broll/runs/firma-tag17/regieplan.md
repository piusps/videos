# Regieplan · Folge 17 „Was kostet der Versand der Shirts?“ (Serientag 4, **nicht** erste Folge des Tages, Slot 2026-10-31 21:00)

firma-regie, 2026-10-31. Grundlage: script.txt nach Autor-Runde 2 (`pruefung/autor-runde2-kurz.md`, 100 Wörter). Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag17/`), `beats.json` (`regie/make_beats17.py`), `musik.txt`, Bibel-Zeile (`wirtschaftsbuch-v2.md`, `regie/bibel_eintrag.py`). Arbeitsdateien/Tests in `regie/`. Keine Grafik, kein Render.

## Messwerte
| Messung | Wert | Vorgabe |
|---|---|---|
| Länge | letztes Wort endet 43,56 + 1,0 s Endkarte = **44,56 s** (`beats.json seconds`) | 40–48 s ✓ |
| Sprechtempo | **134,6 wpm** (100 / 44,56 s) | 120–135 ✓ (knapp unter Obergrenze) |
| Rückblick „Die“ → Ende „fehlt.“ | **6,41 s** (6,23–12,64) | ≤ 6,5 s ✓, nicht beschleunigt |
| „Heute“ beginnt bei | **13,80 s** | ≤ 14,5 s ✓ |
| Tempo TTS | 1,0 überall, kein atempo | ✓ |
| STT (scribe_v1, de) | **24/24 Läufe 100/100 Wörter identisch** mit script.txt (16 auf der bytegleichen `regie/var/d22.mp3`, 8 auf `voice.mp3`; Vorstufen a22 24/24, c22 16/16) | 0 Abweichungen ✓ |
| Musik explizit | **0** (2 Läufe auf dem Abschnitt + Gegenprobe Vollspur), kein Mute | ✓ |
| Stimme roh | −18,4 LUFS (vor Mix; firma-mix normalisiert auf −14) | – |
| Pausen (Stille < −45 dBFS) | alle Satzpausen 0,54–0,73 s; vor „Warum?“ **0,90**; Nähte „fehlt. → Heute“ 1,22 (Akt-Wechsel, Fahrt Board → Paket), „Shirt? → Kommentiere“ 0,94 (Endkarte) | siehe Risiken |

## Storyline-Check (Bibel v2 + Kette)
- Folge 16 endet „Als Nächstes: Was kostet der Versand der Shirts?“ → Folge 17 „Heute klärt sie den Shirt-Versand.“ Rückblick-Satz 2 „Fünf Briefe, Versandpreis fehlt.“ = Ergebnis Folge 16 (fünf Serienbriefe, Platzhalter „[Versandkosten und Lieferzeit ergänzen]“ offen). Kein „Tag“, kein „gestern“.
- Eingabe = Serienbriefe Lauf 16 (unverändert angehängt). Ergebnis: Versandzeile in allen 5 Briefen („zzgl.“), Entscheidung **Versand extra**. Kasse 0 € → 0 €, kein Umsatz-Zähler. Briefe nicht versandfertig (9 gelbe Felder).
- Board: Nummerierung wie `public/firma-ep/tag13–16`; WERBEBRIEF + ADRESSEN bleibt current, **kein Haken**. Kein neues Feld.
- Übergabe Folge 18: „Was zahlt sie für das gestickte Shirt?“ – Lauf 17 nennt den Einkaufspreis selbst als offen („Davon hängt ab, ob sich das Angebot überhaupt rechnet.“). Ohne Login machbar mit Einschränkung (Prüfer R1: printful.com/pricing Digitalisierung 2,95–6,50 $, Produktseiten Grundpreis USD; gestickter Endpreis evtl. nur im Konto). Kein Widerspruch zu früheren Folgen, kein Ticket.
- Faktenschutz aus Autor-R1-04 in beats.json übernommen: nur „Versand: zzgl.“ markiert, Beträge 11,20/5,20 nie vergrößert/neben Printful, Lieferzeit abgedeckt, Shot 03 und 09 nie.

## Stimme
- Serienstimme Keno `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **Tempo 1,0** (`regie/el.mjs`). TTS-Text `regie/script-tts.txt` = script.txt (kein Wort umgeschrieben).
- 4 Volltakes (`regie/voice-raw1–4.mp3`, 38,0–39,1 s roh): Take 1/3/4 „probiere“/„schicke“ im STT, Take 2 sauber bis auf „Fünf Briefe:“ (Satzzeichen). Rückblick roh 6,75–6,87 s.
- **Zusammenbau (`regie/assemble.py`, Parameter `regie/final.env`; Schnitte nur in Stille an Satz-/Komma-/Doppelpunktgrenzen, 3-ms-Fades):**
  - A Eröffnung bis „aus.“ = **Folge 12 `voice.mp3`** (Lehre 13/14), Naht 0,35 s
  - B Rückblick „Die … fehlt.“ = **Betonungs-Take `regie/betonung/rueck2.mp3`** (Betriebe roh, Bestellung 0,12, Briefe 0,12)
  - 0,85 s | C1 „Heute … extra.“ = **Take 2**
  - 0,70 s | C2 „Warum? … Shirt?“ = **Take 2** (Naht in der Warum-Pause)
  - 0,80 s | D CTA = Betonungs-Take `regie/betonung/cta1.mp3` (STT „schick“), Pegel auf C.
- STT-Stabilität: alle getesteten Varianten (a22/a21/a32/b22 je 8/8, a22 24/24, c22 16/16, d22 16/16) sauber; die kritischen Stellen „probier“/„schick“ hängen an Eröffnung F12 + cta1.
- words.json: Zeiten aus TTS-Alignment, durch Schnitte verschoben, Wortgrenzen auf Stille gezogen (`regie/snap_words.py`). Caption-Ziffern: hundert → 100, fünf → 5, zwei → 2, siebzehn → 17, zehn → 10. 100 Wörter.

### Betonungstest (Satzkontext, Tempo 1,0; `regie/betonung.mjs`, je 2 Takes, Silben `regie/stress17.py`)
| Wort | Ergebnis | Entscheidung |
|---|---|---|
| „Versandpreis“ | ver-SAND-preis, -sand längste Silbe (0,24 s), kein Bruch „Versand, Preis“; STT 2/2 | ok |
| „Shirt-Versand“ | „Shirt“ englisch (0,24–0,26 s), ver-SAND (Lexikonbetonung); STT einmal „Shirt Versand“ (getrennt), in allen Volltakes „Shirtversand“ | ok, im finalen STT 24/24 |
| „Printful“ | PRINT-ful, beide Silben voll englisch (0,22–0,28 s), nicht „Print-fuhl“; STT 2/2 | ok |
| „Versand extra“ | EX-tra trägt (Tonhöhe), Pause nach „Brief:“ | ok |
| „Einkaufspreis“ | EIN-kaufs-preis, STT 2/2 | ok |
| „siebzehn“ | SIEB-zehn klar zweisilbig (0,16/0,14–0,16 s), STT 2/2 („siebzehn“ bzw. „17 %“), nie „siebzig“ | ok |
| „Einzelshirt-Preis“ | EIN-zel-shirt-preis ohne Bruch am Bindestrich, STT „Einzelshirtpreis“ 2/2 | ok |
| „gestickte“ | ge-STICK-te, -stick längste Silbe (0,22–0,23 s), STT 2/2 | ok |
| Kommentiere „Versand“ | Anführungszeichen nicht gesprochen, ver-SAND 0,34–0,36 s | ok |
Kein Wort musste umgeschrieben werden.

## Akte (roter Faden)
1. **Hook** 0–6,23 · Briefseite mit „Versand: zzgl.“ (Story-Objekt) → Board
2. **Rückblick** 6,23–13,80 · Gründungsplan + fünf Briefe Folge 16, gelbe Versand-Zeile
3. **Heute** 13,80–16,60 · Karton mit Shirts löst sich von der Zeile, „? €“
4. **Claude-Weg** 16,60–20,66 · ein Paper-Fenster: Shot 01 → 07 → 08 (kein Ortswechsel)
5. **Ergebnis + Entscheidung** 20,66–24,86 · Briefseite zurück, Stempel VERSAND EXTRA
6. **Warum** 24,86–33,14 · Seite oben, Gründe darunter: EINKAUFSPREIS FEHLT → 17 % VOM PREIS
7. **Als Nächstes** 33,14–37,21 · gesticktes Shirt mit leerem Preisschild
8. **CTA** 37,21–44,56 · Endkarte

## Beat-Plan (Zeiten aus words.json; Details, Shots, SFX in beats.json)
| Zeit | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton | Muster |
|---|---|---|---|---|---|---|
| 0,00–0,74 | Wie viel Umsatz | Hook-Frage + Briefseite, Marker „Versand: zzgl.“, Wisch auf „Umsatz“ | Push-in, Punch +4 % | Warum steht der Versand extra da? | pop, wqh, page, bump | M-002, M-011 |
| 0,74–3,38 | macht … lang | „zzgl.“ pulst, Paket-Icon, Licht-Sweep, Seiten fächern auf „100“ | atmet, Mini-Punch | Was heißt „zzgl.“? | tick/popHi/click/page | M-002 |
| 3,38–4,95 | ganz alleine führt? | Stempel GANZ ALLEINE. | Punch-in | Wirklich ohne Mensch? | wq, clack, bump | M-011 |
| 4,95–6,23 | Ich probier das aus. | Board blendet ein, Maskottchen | Pull-back | Was für ein Experiment? | wq2, popHi, click | – |
| 6,23–9,33 | Die Firma … Betriebe | Board, Karte SHIRTS MIT LOGO | ruhig | Worum geht es? | wqh, popHi, tick | – |
| 9,33–10,70 | bestickt … Bestellung | Banner „erst auf Bestellung bestickt“ | steht | Ohne Lager? | page | – |
| 10,70–13,80 | Fünf Briefe, Versandpreis fehlt. | fünf Seiten Folge 16, gelbe Versand-Zeile + Paket-Icon | Push-in | Was kostet der Versand? | page, popLo, tick | – |
| 13,80–16,60 | Heute klärt sie den Shirt-Versand. | Pill HEUTE: SHIRT-VERSAND, Karton fährt los, „? €“ | Fahrt zum Paket | Wie findet sie das raus? | wq2, chime, wshort | – |
| 16,60–20,66 | Claude: Briefe angehängt, Websuche bei Printful. | Shot 01 Anhang-Karte → Shot 07 „das Web durchsucht“ → Shot 08 printful.com/shipping markiert | Push-in, Scroll | Womit fängt sie an? | page, popHi, click, typing, popLo | M-004 |
| 20,66–24,86 | Nach knapp zwei Minuten im Brief: Versand extra. | ≈ 2 MINUTEN, Briefseite zurück, Marker, Stempel VERSAND EXTRA; Pause = Bild steht | Pull-back → Push-in, Halt | Warum nicht inklusive? | wshort, tick, page, popHi, stamp; Musik-Mulde | M-011 |
| 24,86–29,89 | Warum? Ohne Einkaufspreis … passt. | Pill WARUM?, Karte EINKAUFSPREIS FEHLT (vs. „Passt in den Preis? ?“), Shot 04 markiert | Fahrt zu den Karten | Und im Verhältnis? | airy, pop, popLo, tick; Musik-Akzent | – |
| 29,89–33,14 | Er frisst siebzehn Prozent vom Einzelshirt-Preis. | Einzelshirt 29,90 €, Balken bis 17 %, Karte 17 % VOM PREIS, Shot 04 Zeile | Push-in, Halt | Was kostet das Shirt selbst? | wshort, clack, popHi | – |
| 33,14–37,21 | Als Nächstes: Was zahlt sie für das gestickte Shirt? | Pill ALS NÄCHSTES, Shirt mit Stick, Preisschild „? €“, Karte EINKAUFSPREIS STICK-SHIRT? | Push-in, Halt | Was kostet es im Einkauf? | airy, pop, tick, popHi, popLo | – |
| 37,21–44,56 | Kommentiere „Versand“ … durch. | Endkarte: Keyword, ANLEITUNG, 10 MINUTEN: PREIS DURCHGERECHNET | ruhig, Halt | – | pop, typing, check, wqh, popHi, chime, tick | M-007 |

Karten ≤ 4 Wörter, Abstände ≥ 1,29 s (beats.json-Ausgabe), nie zwei neue Blöcke gleichzeitig. Hook: Ereignisse auf macht/Unternehmen/das/KI/100/Tage/lang/ganz/alleine/führt/4,6/Ich/probier/aus (≤ 0,5 s).

## Ton
- Musik: GONE ab **154,3 s**, 44,56 s am Stück (Stem bis 199,5), nie geloopt, kein Mute; überlappt keinen heutigen Abschnitt (Details `musik.txt`). Kurve `regie/curve.json`: leiser Einstieg 0,05, Mulde 0,03 in der Pause vor „Warum?“, Akzent 0,06 auf „Warum?“, lauter zweiter Teil 0,032, Endkarte 0,05 → 0.
- Abstand Stimme–Musik je Akt 22,5–24,6 dB (≥ 15 ✓). SFX abwechslungsreich (pop/popHi/popLo/tick/click/page/stamp/clack/chime/typing/check), keine schweren Whooshes.

## Risiken
- 134,6 wpm liegt 0,4 unter der Obergrenze; jede Kürzung von Pausen oder Endkarte reißt 135.
- Nähte „fehlt. → Heute“ 1,22 s und „Shirt? → Kommentiere“ 0,94 s > 0,7 (Akt-Wechsel wie Folge 16; Bild bewegt sich dort). Kürzen hieße > 135 wpm.
- Musik-Schlag liegt 0,14 s nach dem Einsatz von „Warum?“ (im Wort), nicht exakt darauf.
- Design muss die Briefzeile aus der .docx selbst rendern und den Lieferzeit-Satz abdecken; Shot 02 nur Zeile 1. Shot 03/09 nie.
- „siebzehn“ ist Claudes Rechnung (Dollar-Tarif); mit Euro-Tarif der Gegenprüfung ≈ 18 %. Gesprochen bleibt Claudes Wert, Caption „etwa 17 % des Nettopreises“.
