# Briefing · Folge 13 „Werbebrief“ (intern firma-tag13) · Slot 2026-10-31 09:00 · Serientag 4, ERSTE Folge des Tages („Tag vier.“, „TAG 4“) – geändert vom Chef 2026-10-30 15:40 auf Pius’ Ansage

Gilt zusammen mit `../firma-tag9/tagesbriefing-2026-10-30.md` (alle Regeln K.-o.).

## Leitidee
Die Liste der ersten zwanzig Betriebe steht. Heute schreibt die KI den ersten Werbebrief, und klärt vorher, wie sie Betriebe überhaupt anschreiben darf (Kalt-Mail vs. Brief). Der Brief verspricht nur Belegtes (kein 60 °C).
- **Ergebnis-Bild:** der echte Brief aus dem Lauf auf Papier, Kolonnenshirt-Logo oben, eine markierte Kernzeile.
- **Gefühl:** „Ein Brief, den ich so abschicken könnte.“

## Stand
Kein Tag, kein „gestern“. Umsatz 0 €. Rückblick Satz 2 = Ergebnis Folge 12 (≤ 11 Silben). Abschicken wird nicht erzählt (das wäre ein Menschen-Schritt mit Geld/Gewerbe).

## Echter Lauf
claude.ai, neuer Chat, Ergebnis Folge 12 (ohne Betriebsnamen nötig) + Angebot als Anhang, Websuche, Brief als Word-Datei.

## Nächste Folge
Folge 14 (Serientag 4, 9:00): offene Frage aus dem Lauf.

## Stand 2026-10-30 abends (Chef Folge 13)
**Nicht eingeplant, nicht gerendert** (Koordinator 2026-10-30: Rate-Limit, 15:00-Slot verpasst, Folge 11 → 18:00, Folge 12 → 21:00; Folge 13 übernimmt morgen die Tages-Routine). Kein Zernio-Post, kein Funnel, kein `publish.json`, kein Desktop-Ordner.

Fertig:
- **Autor:** bestanden in Runde 2, Note 8,5/10 (`pruefung/autor-runde2.md`; Runde 1 nicht bestanden 8,3, `pruefung/autor-runde1.md`). `script.txt` 100 Wörter, längster freier Satz 11. Caption 2074 Zeichen, endet korrekt. Vorab behoben: gesprochener Weg-Satz, CTA mit zwei lieferbaren Teilen (Frage + Briefvorlage, „Briefentwurf“), kein [BERUF], Variante ohne Anhang, Hamburg/Namen 0. Rechtsaussagen 1:1 aus LAUF.md mit Quellen in `thema.md`.
- **Regie:** `voice.mp3` 44,90 s (+1 s Endkarte = 45,90 s), 133,6 wpm (130,7 inkl. Endkarte), Rückblick 6,26 s, „Heute“ bei 13,82 s, STT 0 Abweichungen, Stimme aus Take 5 (Mitte) + Take 6 (Eröffnung/CTA) an Satzpausen gespleißt. `words.json`, `regieplan.md`, `beats.json`, `musik.txt` (GONE ab 107,5 s, explicit-check 2× 0). Kopie in `public/firma-ep/tag13/` (nur voice.mp3, words.json, **noch kein episode.json**).
- **Guide:** `werbebrief-guide.pdf` (10 Seiten), grep Hamburg/Namen/Betriebe 0. Achtung: Blitz-Symbol nur im HTML entfernt; wer aus guidebook.json neu erzeugt, bekommt es zurück.
- `replies.json` (6 Antworten, Florent-Ton, keine Emojis, jede mit Frage), `format.json` PTC.

Offen für morgen (Tages-Routine):
1. **Wird Folge 13 die 9-Uhr-Folge (Serientag 4), muss sie „Tag vier“ sagen:** Eröffnung „… Ich probier das aus. Tag vier.“ + „TAG 4“ im Hook/HUD (Tagesbriefing-Regel erste Folge). Das sind +2 Wörter → `firma-autor` muss 2 Wörter an anderer Stelle kürzen (nie beim Warum; Kandidat: „Claude: Liste und Logo angehängt, Websuche, Word-Datei.“ oder CTA), danach kurze Autor-Prüfung. Regie erzeugt nur die geänderten Sätze neu (Lehre Folge 10) und misst Rückblick/„Heute“ (Achtung: „Heute“ beginnt jetzt bei 13,82 s; „Tag vier.“ kostet ~0,8–1,0 s inkl. Pause → ~14,7 s, reißt voraussichtlich die 14,5-s-Grenze; Ausgleich nur vor „Heute“ möglich, z. B. Pause Satz 1→Rückblick kürzen, sonst Chef-Entscheid nötig) und Gesamtlänge erneut. Rückblick-Satz 2 „Liste: zwanzig Betriebe.“ passt zum aktuellen Ergebnis Folge 12 (`runs/firma-tag12/script.txt`, Stand 2026-10-30 mittags); vor dem Render noch einmal gegen die gepostete Folge 12 abgleichen. Kein „gestern“.
2. **Musik:** Abschnitt überlappt den Folge-11-Abschnitt um 0,25 s (nur Ausblendung). Bei neuer Reihenfolge prüfen, ob der Abschnitt noch frei ist.
3. **Design:** `public/firma-ep/tag13/episode.json` über FirmaEpisode (Vorlage tag9/tag8 + Board-Zustand Folge 12), `--stills`, Design-Prüfung, dann voller Render; Cover; finale Prüfung Frame für Frame (Gemini fällt aus); Einplanen + golive-arm.
4. Übergabe „Als Nächstes: Wohin gehen die Briefe?“ → Lauf Folge 14 = Impressums-Adressen der fünf Betriebe (Claudes Angebot im Lauf, LAUF.md). Erster Umsatz frühestens Folge 14, Kasse 0 €.

### Nachtrag Chef 2026-10-30 15:40
- Musik: Laut Regie Folge 12 ist heute kein freier Musikabschnitt ≥ 45,6 s mehr übrig (längster 44,65 s). Folge 13 nimmt einen Abschnitt vom Vortag oder bleibt ≤ 44,65 s. Überlappung mit Folge 11 (0,25 s) prüfen.
- Board: Nummerierung aus Folge 11/12 halten (PRODUKT+KUNDE, DRUCK+PREIS, PARTNER+NAME, LOGO 4, WEBSITE 5, GEWERBE 6, …), Vorlage public/firma-ep/tag12/episode.json.
- Rückblick gegen die gepostete Folge 12 (runs/firma-tag12/script.txt) abgleichen.
- Als 9-Uhr-Folge 2026-10-31: „Ich probier das aus. Tag vier.“ + „TAG 4“ im Hook, Autor kürzt 2 Wörter, kurze Neuprüfung.

## Stand 2026-10-30 18:00 (überholt den Abschnitt oben)
Auf Pius' Ansage doch fertig produziert: **eingeplant für 2026-10-31 09:00** als erste Folge von Serientag 4 („Tag vier.“, „TAG 4“). Zernio-Post `6ae4cbd69bf0788d8cc91fa9`. Finale Prüfung 8,5/10 (`pruefung/final-runde1.md`). MP4 `firma-tag13-final.mp4`. golive-arm PID 20183 (stirbt, wenn der Mac nachts aus ist → morgen neu starten, Befehl in `rueckblick.md`/`publish.json`). Folge 14 ist damit NICHT mehr erste Folge von Tag 4 (kein „Tag vier“).
