GESAMTNOTE: 8/10 (bestanden: kein K.-o., alle Kriterien >= 8; Gemini-Review nicht gelaufen, wie bei v7)

# Finale Prüfung: Folge „Ärger“ (firma-tag3), tag3-aerger-v8.mp4

Prüfer: frischer firma-pruefer, 2026-10-28. v8 = v7 + Neueinstieg (neuer Satz 2/3, Rückblick-Akt, gekürzte Pausen, Anker umgemappt, Musikbett verlängert). Geprüft wurden die Änderungen und Regressionen gegen v7 (final-v7.md, 8/10).

Belege in `pruefung/final-v8/`:
- `recap-4fps.png`: 4,5–14,5 s, 4 fps (Zeitstempel relativ, +4,5 s)
- `sheet-01..04.png`: 2 fps, Bogen N beginnt bei (N−1)·12 s (Zeitstempel relativ)
- `recap-keys.png`: 6,6 / 8,3 / 10,3 / 12,4 s in 540 px
- `stt.json`, `whisper.log`: whisper.cpp medium, ganze Tonspur; `recap-*16.wav`: Rückblick einzeln (Mix + Stimme)
- `voice-stem.wav`, `music-stem.wav`, `st.py`, `gate.py`: Stems mit der Lautstärkekurve aus `render/mix-filter.txt`, Kurzzeit- und sprachgegatete Lautheit
- `splice.py`, `lvl.py`: Schnittkanten, Pegel und Klangfarbe der Einsetzung

## Technik
- 1080×1920, 30 fps, **47,80 s** (Ziel 40–48 s, 0,2 s Luft). Skript 135 Wörter (Ausnahme vom Koordinator).
- **−14,0 LUFS**, True Peak **−1,3 dBFS**, LRA 1,6 LU. ✓
- Tonspur im MP4 = `render/mix-final.wav`, Versatz 0 ms bei 5 / 20 / 40 s. ✓
- Musik: `music.mp3` (v8) gegen `v7bak/music.mp3` korreliert. r = 1,00, Versatz 0 bei 1/10/20/30/40/46 s. Gleiches Stück, gleicher Start, nur länger. Ausblendung 47,1→47,8 s. ✓
- Cover `cover.png` unverändert (16:17, vor dem v7-Bericht). ✓

## (1) Geänderter Abschnitt 4,5–14 s
**STT:** ganze Spur und Ausschnitt (Mix und Stimme allein) Wort für Wort = Skript: „Ihre Firma verkauft Logo-Shirts an kleine Betriebe, gedruckt erst auf Bestellung. Ihren ersten Kunden hat sie gewählt: kleine Handwerksbetriebe. Heute: Was nervt die beim Shirt-Bestellen?“ ✓

**Dauer:** Satz „Ihre Firma …“ 5,255–8,513 s (3,26 s) + „Ihren ersten Kunden …“ 8,711–11,252 s (2,54 s) = **6,00 s** (≤ 6 s, exakt auf der Grenze). „Heute: … Shirt-Bestellen?“ 11,43–13,41 s. Sprechtempo der Einsetzung ≈ 6,7 Silben/s, im Rahmen des Rests (5,0–7,1).

**Splice:** Neues TTS liegt 5,04–14,05 s, alles andere ist Stück für Stück identisch mit v7 (Kreuzkorrelation r = 1,00, Verschiebungen 4,412 → 2,562 s).
- Kanten bei 5,044 / 5,244 / 13,405 / 13,712 / 14,047 s liegen in Pausen, Abtastwert an der Kante ≤ 0,0007, max. Sprung 0,0023 (normal: 99,9-Perzentil 0,18). Kein Klick.
- Restfetzen in den Pausen 13,71–13,78 und 13,98–14,05 s: −66 / −61 dB, unhörbar.
- Pegel (stimmhaft, RMS): Eröffnung −17,2, neu −16,9 / −17,0 / −16,6, danach v7 −17,4 / −16,9 dB. Kein Pegelsprung (≤ 0,8 dB). Klangschwerpunkt 2,9–3,2 kHz wie der Rest. Gleiche Stimme.
- Prosodie: „Heute:“ steigt 149 → 217 Hz, whisper schreibt zweimal „Heute?“. Klingt als Frage-Ansage, nicht falsch, aber nicht wie ein Doppelpunkt (Hinweis 3).

**Bild (recap-4fps, recap-keys):**
- 4,5–8,6 s: Gründungsplan ganz im Bild, 1 PRODUKT ✓ und 2 KUNDE ✓ grün, 3–9 offen.
- Shirt-Karte „LOGO-SHIRTS“ fliegt bei ≈ 5,9 s ein (Wort 6,06 s, popHi 0,2 s davor). ✓
- Banner „erst auf Bestellung gedruckt“ bei 7,5 s (Wort „gedruckt“ 7,46 s). ✓
- Kamerafahrt zur Kachel „2 ✓ KUNDE HANDWERK“ mit Label „LOGO-SHIRTS“ bei 8,75 s (Wort „Ihren“ 8,71 s). ✓
- Kiste öffnet sich auf „hat sie gewählt“/„kleine Handwerksbetriebe“ (9,5–10,5 s), Pill „WAS NERVT DIE?“ bei 12,0 s (Wort „Was“ 11,95 s). ✓
- Abzug: Die Shirt-Karte verdeckt 5,9–8,6 s die rechte Board-Spalte (6 WEBSITE, 9 ERSTER UMSATZ, Teil von 3). Die erledigten Schritte bleiben frei. Board-Labels „PRODUKT/KUNDE“ ≈ 1,3 % Bildhöhe. Die Info kommt aber groß über Karte und Untertitel.
- Kein Beat > 1,5 s ohne Änderung. Längste ruhige Stelle: „Heute:“ 11,43–11,95 s (0,5 s).

**Klarheit für neue Zuschauer:** Nach 8,5 s weiß ein Neuer: KI führt 100 Tage eine Firma, sie verkauft Logo-Shirts an kleine Betriebe, Druck auf Bestellung. Nach 11,3 s auch den gewählten Kunden, nach 13,4 s den heutigen Schritt.
- Die Bewertung verlangt „Projekt + heutiger Schritt nach 10 s“. Das ist mit dem vorgegebenen Wortlaut rechnerisch nicht erreichbar (Eröffnung 5 s + Rückblick 6 s). Der Koordinator hat den Text vorgegeben, deshalb ist das **kein K.-o.** Ich nenne es trotzdem.
- „Ihre Firma“ direkt nach „Ich probier das aus“ kann man als Sie-Anrede hören („Ihre“ = Ihre/your). Im Kontext „eine KI … führt“ geht es, aber es bleibt leicht doppeldeutig (Hinweis 4).

## (2) Sync über das ganze Video
**Untertitel gegen Stimme:** Für alle 21 Wörter nach einer Pause habe ich den Einsatz aus `words.json` mit dem Energie-Einsatz der Stimme verglichen (−35-dB-Schwelle).
- Abweichung −0,05 bis +0,01 s, Untertitel immer minimal früher. Max. 0,052 s („Heute“). ✓ (≤ 0,1 s)
- Stichproben: Ich, Ihre, Ihren, Heute, Was, Plus, 5, Claude, Vorne, je, Platz, Die, Warum, Auf, Gängige, Haken, Nur, Meist, Offen, Welcher, Kommentiere.

**Animations-Beats gegen Wort (Sheets 2–4, v8-Zeit):**
| Beat | Wort | Bild | OK |
|---|---|---|---|
| Plus-Klick / Research-Menü | Plus 14,05 / Research 14,49 | 14,0 / 14,5 s | ✓ |
| Datei-Chip, Prompt tippt | letztes 15,22 / Nur 16,33 | 15,5–16,0 s | ✓ |
| „Die Frage zum Kopieren“, Senden | 5 häufigste 18,5 | 19,0–19,5 s | ✓ |
| 301-Zähler, Wand füllt sich | Claude 19,98 / 301 20,51 | 20,0–21,0 s | ✓ (Karten stehen vor „Vorne“, wie in v7) |
| Highlights Logo/Service/Platz 5 | 22,56 / 23,29 / 25,07 | ✓ | ✓ |
| Stempel „ZUERST KLÄREN“ | Waschen 28,93 | 29,0 s | ✓ |
| „WARUM ERST WASCHEN?“ | Warum 29,87 | 30,0 s | ✓ |
| Karte 60 °C | Auf 30,52 | 30,5 s | ✓ |
| Karte 30 °C | Gängige 32,48 | 32,5 s | ✓ |
| Claude-Zitat „Nur eine Beschwerde …“ | Haken 35,01 | 35,0 s | ✓ |
| Markierung „überwiegend von Privatkunden“ | Privatkunden 37,68 | 37,5 s | ✓ |
| „NOCH OFFEN: Welcher Druck hält 60 °C?“ | Offen 39,38 | 39,5 s | ✓ |
| „ALS NÄCHSTES“, Unterstrich | Welcher 39,89 / Grad 41,0 | 40,0 / 41,5 s | ✓ |
| Endkarte KOMMENTIERE, „ÄRGER gesendet“, 3 Schritte | 41,98 / 42,57 / 43,9 | 42,0–44,0 s | ✓ |

**Gekürzte Pausen (v7 → v8):**
| Stelle | v7 | v8 |
|---|---|---|
| Shirt-Bestellen? → Plus | 0,53 | 0,34 |
| Ärgernisse. → Claude | 0,46 | 0,21 |
| Quellen. → Vorne | 0,49 | 0,34 |
| Belege. → Platz | 0,38 | 0,23 |
| Waschen. → Die | 0,69 | 0,49 |
| Waschen. → Warum | 0,74 | 0,59 |
| Warum? → Auf | 0,38 | 0,28 |
| **Grad. → Gängige** | 0,30 | **0,15** |
| dreißig → Haken | 0,63 | 0,43 |
| unklar → Offen | 0,56 | 0,36 |
| Grad? → Kommentiere | 0,74 | 0,54 |

- Die genannten Stellen „Waschen“, „dreißig“, „unklar“, „Grad?“ behalten 0,36–0,59 s und wirken nicht gehetzt. Bei „Waschen“ trägt der Stempel, bei „Grad?“ der Wechsel zur Endkarte.
- Knapp ist **„60 Grad. → Gängige“ mit 0,15 s**. Das ist der Übergang zwischen den beiden Warum-Gründen, also der Kern. Er klingt wie ein durchgezogener Satz. Die zweite Karte trägt den Wechsel visuell, aber der Kontrast 60 gegen 30 atmet weniger als in v7 (Hinweis 2).
- „Ärgernisse. → Claude“ mit 0,21 s ist ein Akt-Wechsel und eng. Klick, Senden und Szenenwechsel federn ihn ab.

## (3) Länge, Lautheit, Musik
- 47,8 s ✓. −14,0 LUFS / TP −1,3 ✓.
- Stimme gegen Musik integriert: −18,5 gegen −34,6 LUFS = **16,1 LU** ✓
- Sprachgegatet je Akt (nur Momente mit Stimme > −28 LUFS):
  - Rückblick 5–14 s: 16,2 dB
  - Research 14–21,5 s: 16,3 dB
  - Wand: 17,0 dB
  - „Warum? Auf dem Bau …“ 29,8–32,4 s: 15,2 dB
  - **„Gängige Drucke … dreißig“ 32,4–34,7 s: 14,0 dB**
  - Haken/Privatkunden 35–39,1 s: 15,3 dB
  - Offen: 16,8 dB
  - CTA: 17,7 dB
- Ursache: Die Stimme liegt jetzt ≈ 3,2 s später auf demselben Musikstück. Die Kurve `[T.hw2+1.2, 0.13] → [T.offen, 0.12]` trifft so eine lautere Stelle des Stücks. In v7 lag der schwächste Wert bei 14,8 dB (Haken), jetzt bei 14,0 dB (30-°C-Grund). Leicht schlechter, nur dieser eine Satz, integriert klar bestanden. Ticket 1, nur Audio.

## (4) Regressionen gegen v7
- Eröffnung bis 4,0 s bit-gleich. Die Pause „führt? → Ich“ ist 0,05 s kürzer, unhörbar. Hook-Bild 0–4,75 s unverändert (sheet-01).
- HUD durchgehend ✓ ✓, Badge „TAG 1“ ab 4,75 s, Board ✓ ✓. Keine Seitenleiste, kein Umsatz-Zähler, keine Tages-Sprache.
- Alle Zahlen wie in v7 und LAUF.md: 301, je 14, Platz 5, 60/30, „Nur 1 Beleg“, Zitate.
- Endkarte, „ALS NÄCHSTES“ und CTA unverändert. Letztes Wort endet 46,65 s, danach 1,15 s Endkarte mit Musik-Ausblendung. ✓

## Noten je Kriterium
| # | Kriterium | Note | Kurz |
|---|---|---|---|
| 1 | Eröffnung, Frame 1, Serienrahmen | 8 | unverändert |
| 2 | Hook nicht statisch | 8 | unverändert, 3,5–4,75 s knapp wie in v7 |
| 3 | Neueinstieg / Klarheit für Neue | 8 | Produkt + Modell + Kunde klar und bebildert. Heutiger Schritt erst 13,4 s (Vorgabe), „Ihre“ leicht doppeldeutig |
| 4 | Rückblick-Akt Bild (lesbar, auf Wort) | 8 | Alle Beats auf dem Wort, Kamerafahrt sauber. Karte verdeckt rechte Board-Spalte, Board-Labels klein |
| 5 | Splice (STT, Klicks, Pegel) | 9 | sauber und messbar unauffällig; „Heute“ mit Frage-Melodie |
| 6 | Schritt-Kette, Board/HUD | 9 | wie v7 |
| 7 | Fakten- und Serien-Treue | 8 | wie v7 |
| 8 | Warum-Beat | 8 | Karten auf dem Wort, aber 0,15 s zwischen den Gründen (v7: 9) |
| 9 | Kein Beat > 1,5 s ohne Änderung | 8 | ok |
| 10 | Untertitel synchron | 9 | max. 0,052 s |
| 11 | Anker nach dem Splice | 9 | alle geprüften Beats auf dem Wort |
| 12 | Ton (Musik ≥ 15 dB, SFX, Bett am Stück) | 8 | integriert 16,1 LU, Bett am Stück. Ein Satz bei 14,0 dB (knapp, Ticket 1) |
| 13 | Länge / LUFS / TP | 9 | 47,8 s, −14,0, −1,3 |
| 14 | CTA, Cover, Caption | 8 | unverändert gegenüber v7 |
| 15 | Gemini-Review | – | nicht gelaufen (kein externer Dienst im Auftrag) |

## Scroller-Test
- **1 s:** wie v7, Umsatz-Frage + leerer Plan.
- **3 s:** „GANZ ALLEINE.“
- **10 s:** Besser als v7. Ein Neuer sieht Shirt-Karte, „erst auf Bestellung gedruckt“, Kachel „KUNDE HANDWERK“ und weiß, worum es geht. Die Frage des Tages kommt 4 s später als in v7 (11,9 statt 7,6 s). Der Hook-Bogen ist dadurch etwas länger, aber das ist der Preis des Neueinstiegs.

## K.-o.-Status
**Kein K.-o.**
- STT = Skript, Zahlen 1:1.
- Kein direktes Ansprechen außer dem Serien-„du“ im CTA.
- Board/HUD konsistent, Musik am Stück, Untertitel ≤ 0,1 s.
- Die 10-s-Regel wird durch den vorgegebenen Wortlaut verfehlt (13,4 s). Das ist eine Koordinator-Vorgabe, keine Autor-Entscheidung.

## Tickets (klein, nicht blockierend)
```
TICKET final-v8-1 → firma-regie (Mix)
Kriterium: Ton · Note: 8/10
Beleg: gate.py, 32,4–34,7 s „Gängige Drucke … dreißig“: Stimme −18,5 / Musik −32,6 = 14,0 dB
Problem: Musik nach der Verschiebung an einer lauteren Stelle des Stücks, 1 dB unter der 15-dB-Regel.
Soll: In mix.mjs [T.hw2 + 1.2, 0.13] → 0.10 und [T.offen, 0.12] → 0.11, nur Audio neu mischen + remuxen (kein Video-Render). Danach gegatet jeder Akt ≥ 15 dB, −14 LUFS / TP ≤ −1.
```
Hinweise (kein Ticket, nur falls ohnehin neu gerendert wird):
2. Pause „60 Grad. → Gängige“ 0,15 s auf ≈ 0,3 s zurück (wie v7). Das kostet 0,15 s, Länge dann 47,95 s, braucht aber einen Anker-Shift und einen Re-Render. Nur machen, wenn ohnehin gerendert wird.
3. „Heute:“ hat eine Frage-Melodie (149 → 217 Hz). Bei der nächsten TTS-Einsetzung „Heute geht es um:“ oder mit Punkt testen.
4. Rückblick-Formulierung für künftige Folgen: „Die Firma der KI verkauft …“ statt „Ihre Firma“, um die Sie-Lesart zu vermeiden. Gilt für den Serien-Baustein, nicht für dieses Video.
5. firma-design: Die Shirt-Karte im Rückblick etwas kleiner oder rechts außerhalb des Boards, damit das Board ganz frei bleibt (Pius-Regel „Board immer ganz im Bild“).
6. Gemini-Review fehlt weiterhin (wie bei v7). Vor dem Einplanen Pius sagen, dass es entfällt, oder nachholen.

## Entscheidung
**Bestanden, 8/10, v8 darf die eingeplante v7 ersetzen.**
- Der Neueinstieg funktioniert: Splice sauber, Bild auf dem Wort, ein Neuer versteht Produkt und Kunden.
- Ticket 1 (5 Minuten, nur Audio) wird empfohlen, bevor ersetzt wird. Ohne das Ticket ist es knapp, aber vertretbar, analog zur Abnahme von v7.
