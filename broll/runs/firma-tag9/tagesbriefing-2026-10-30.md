# Tagesbriefing · Serientag 3 (2026-10-30) · Folgen 9–13 · @pickthecompany

Chef: firma-chef, 2026-10-29 abends. Gilt für alle Stufen aller 5 Folgen, zusammen mit dem eigenen `briefing.md` jeder Folge.
Weiter gültig: `runs/firma-tag4/tagesbriefing-2026-10-29.md` (Regeln 1–8, außer Länge/Wortzahl, siehe unten), Konzept `runs/firma-neu-tag1/konzept.md`, Bibel `~/Desktop/Superkind Videos/_Serie Superkind baut Firma/wirtschaftsbuch-v2.md`.
**Maßstab:** Folgen 4–8 vom 2026-10-29. Pius dazu: „heute sah sehr gut aus“. Look, Hook-Aufbau, Rückblick-Akt, Warum-Beats, Board und Funnel bleiben genau so.

## Slots
| Folge | Ordner | Slot (Europe/Berlin) | erste Folge des Tages |
|---|---|---|---|
| 9 | runs/firma-tag9 | 2026-10-30 09:00 | ja: „… Ich probier das aus. Tag drei.“ + „TAG 3“ im Hook |
| 10 | runs/firma-tag10 | 2026-10-30 12:00 | nein (HUD-Badge „TAG 3“ ok) |
| 11 | runs/firma-tag11 | 2026-10-30 15:00 | nein |
| 12 | runs/firma-tag12 | 2026-10-30 18:00 | nein |
| 13 | runs/firma-tag13 | 2026-10-30 21:00 | nein |

## Neu ab Folge 9 (Pius 2026-10-29, K.-o.)
- **Weniger Text pro Zeit:** 85–100 Wörter inkl. Eröffnung und Rückblick. Sätze ≤ 12 Wörter, ein Gedanke pro Satz, Alltagswörter. Gekürzt wird bei Nebeninfos, nie beim Warum.
- **Langsamere Stimme:** `TTS_SPEED=1.0`, Sprechtempo 120–135 Wörter/Minute (nicht langsamer!). Länge 40–48 s.
- **Bild:** höchstens ein neuer Textblock gleichzeitig, Karten/Stempel ≤ 4 Wörter, jeder Text ≥ 1,2 s lesbar. Kontaktbogen-Check: kein Frame mit > ~12 neuen Wörtern Bildschirmtext außer Untertiteln.

## Lehren 2026-10-29 (stehen in den Skills, hier als Erinnerung, alle K.-o.)
- Hook: Frame 0 zeigt die ganze Frage + Ergebnis-Objekt, 0–6 s in jedem 0,5-s-Fenster ein sichtbares Ereignis, Hook-Objekt überlappt nie den Gründungsplan. Beleg: Kontaktbogen 0–6 s @ 4 fps in `pruefung/`.
- Musik vor dem Mix: `node scripts/music-explicit-check.mjs .env <abschnitt.mp3>`, explizite Wörter auf 0.
- Caption < 2100 Zeichen.
- Guide: nie „frei“, wenn der Lauf nur „Nichts gefunden“/„Ungeklärt“ belegt. „Folg @pickthecompany …“ nur einmal.
- Stempel-Wörter kommen aus dem Lauf.
- Maskottchen ganz im Bild oder höchstens zu einem Drittel angeschnitten.
- Rückblick-Satz 2 ≤ 11 Silben, Rückblick ≤ 6,0 s. Außerhalb des CTA kein Imperativ, kein „du“.
- Kein Umsatz-Zähler (Kasse 0 €). Erster Umsatz frühestens Folge 14.
- Gemini-Review fällt aus (OpenRouter ohne Guthaben) → finaler Prüfer prüft manuell Frame für Frame.

## Kette (Chef, ab Ergebnis Folge 8 als Kette gelesen)
Stand nach Folge 8: Name **Kolonnenshirt** (Kandidat; kolonnenshirt.de nicht als frei bestätigt, DPMA/EUIPO/Handelsregister nicht geprüft). Partner Printful, Vorschlag 109 € brutto für 5, 29,90 € Einzelshirt. 60 °C mit Printful nicht versprechbar. Aus Folge 4: Brustlogo als Stick max. ca. 8–9 cm, 3–6 Farben.
Konzept-Liste sah für 9–13 vor: Logo (Canva), Muster-Shirt (Canva), Muster bestellen + waschen (Geld), Gewerbe, Bezahlen (Stripe). Canva und Stripe brauchen Pius' Login, das Muster braucht Geld. Deshalb (Brief: „Logo/Website nur mit dem, was ohne Login oder Kauf echt machbar ist“):

| Folge | „Heute …“ | Eingabe | Claude-Weg (ohne Login, ohne Kauf) | Ausgabe = Eingabe der nächsten |
|---|---|---|---|---|
| 9 (9:00, „Tag drei“) | … baut sie ihr Logo | Name Kolonnenshirt + Stick-Grenzen (Folge 4) + Ergebnis Folge 8 als Anhang | Neuer Chat, Anhang; Websuche nach Printfuls Stick-Vorgaben; Claude zeichnet 3 Entwürfe als SVG (Artifact/Datei), prüft jeden gegen die Vorgaben, empfiehlt einen mit 2–3 Gründen. Kein Canva. | Logo-Datei (SVG) + Begründung |
| 10 (12:00) | … baut sie ihre Website | Logo-SVG + Angebot + Preise | Onepager als HTML-Artifact (nur Vorschau), Texte nur aus bisherigen Ergebnissen, kein 60-°C-Versprechen; Claude sagt, was bis „online“ fehlt (Domain, Hosting, Impressum) | Website-Entwurf (nicht online) + Lücke „Impressum braucht Firma“ |
| 11 (15:00) | … will sie ein Gewerbe anmelden und kann es nicht allein | Website-Entwurf + Lücke Impressum | Websuche/Research: was braucht der Shop vor dem ersten Verkauf (Gewerbeanmeldung, Kleinunternehmer ja/nein, Impressum, Verpackungsregister …), Checkliste als Word-Datei, Menschen-Schritte markiert | Checkliste, Grenze „das macht ein Mensch“ (nicht als erledigt erzählen) |
| 12 (18:00) | … sucht sie die ersten zwanzig Betriebe | Kunde Bau-/Ausbauhandwerk < 10 Leute (Folge 2) | Websuche statt Apify (Login): 20 Betriebe in einer von Claude begründeten Testregion, Liste als Excel; im Video anonymisiert | Liste |
| 13 (21:00) | … schreibt sie ihren ersten Werbebrief | Liste + Angebot + Grenzen (kein 60 °C) | Brief als Word-Datei; Claude prüft per Websuche, ob Kalt-Mail an Betriebe erlaubt ist (UWG) und wählt den Weg | Brief; offene Frage für Folge 14 |

Regeln für die Läufe: Jeder Prompt nennt das Ergebnis der Vorfolge wörtlich und hängt sie an, verlangt eine Empfehlung + 2–3 Gründe mit Zahl/Quelle + „was du nicht prüfen konntest“ + „Erfinde nichts“. Entscheidung der KI = Claudes Empfehlung im Lauf. Läuft ein Lauf anders als geplant (z. B. Claude rät vom Logo-Stick ab), erzählt die Folge das ehrlich; die Kette passt sich an, der Chef korrigiert die Folgezeilen.
Menschen-Schritte (Gewerbe anmelden, Domain kaufen, Muster bezahlen, Canva/Stripe verbinden) werden nie als erledigt erzählt und nie als „mache ich“ angekündigt; neutral: „Das kann nur ein Mensch.“

## Board
Ab Folge 5: PRODUKT, KUNDE, DRUCK, PREIS, PARTNER, NAME, LOGO, WEBSITE, ERSTER UMSATZ. Folge 9 hakt NAME ab, LOGO current. Folge 10 hakt LOGO ab, WEBSITE current. Ab Folge 11 liegen die Schritte GEWERBE, BETRIEBE, WERBEBRIEF zwischen WEBSITE und ERSTER UMSATZ; Design entscheidet, wie das Board sie lesbar aufnimmt, ohne den Look zu ändern (WEBSITE bleibt „Entwurf“, nicht grün abgehakt, solange nicht online).

## Für Pius (Bericht)
Vorgezogen/verschoben wegen Login oder Geld: Muster-Shirt (Canva), Muster bestellen + 60-°C-Wäsche (Geld), Bezahlen (Stripe), Domain kolonnenshirt.de kaufen, DPMA/EUIPO-Prüfung.

## Chef-Entscheide während der Produktion
- Läufe in Pius' Pro-Org (77f569ac…): In der Team-Org „Superkind“ ist die Websuche vom Admin gesperrt (Lauf 9 v1 ohne Websuche verworfen).
- Ab Lauf 11 Gedächtnis im Chat aus (Lauf 10 las Claudes Gedächtnis und nannte eine private Adresse). Private Inhalte aus dem Gedächtnis nie zeigen.
- **Rückblick bei Tempo 1,0 (Chef, Ticket autor-R1-T-07 Folge 9):** Die feste Eröffnung und Rückblick-Satz 1 haben je 15 Wörter. Pius' neue, langsamere Stimme (Tempo 1,0) hat Vorrang vor der alten 6-s-Grenze, die bei Tempo 1,15 entstand. Ab Folge 9 gilt deshalb: Rückblick („Die“ bis Ende Satz 2) ≤ 6,5 s, nicht beschleunigen. „Heute …“ beginnt spätestens bei 14,5 s. Das Sprechtempo von 120–135 wpm wird über die ganze Folge inkl. Pausen gemessen.
- **Übergaben (Chef):** Folge 9 → 10: „Als Nächstes: Was muss oben auf ihre Website?“. Lauf 10 beantwortet das (die drei Dinge oben), Lauf 9 nicht.
- **Lauf 11 nennt „Hamburg“** (Gebühr 25 € laut Handelskammer Hamburg). Woher die Stadt kommt, ist unklar, vermutlich vom Standort, den claude.ai mitgibt. Die Stadt steht nie in Video, Caption oder Guide. Gebühr im Guide nur als „z. B. 25 €, je nach Stadt verschieden“ mit Quelle, sonst nicht nennen.
- In Lauf 11 stehen die Markierungen „Mensch“/„Claude“ nur in der Word-Datei, nicht im Chattext; Beleg ist dann die Datei. Claudes Bitte um Name/Anschrift wurde nicht beantwortet und wird nicht erzählt.
- **Wortgrenze vs. Länge (Chef, Folge 9 R2):** Die Stimme spricht bei Tempo 1,0 ohne Pausen ~155–160 wpm. 100 Wörter sind für Pius hart (K.-o.). 40–48 s und ≤ 135 wpm erreicht die Regie über Pausen an Satzgrenzen (0,4–0,7 s, vor dem Warum bis 0,9 s), nie über mehr Wörter und nie über ein Tempo < 1,0. Die Autor-Schätzung rechnet mit 155 wpm Rohtempo + Pausen.
- Lauf 12 nennt in der Region-Begründung „Hamburg“ (aus dem Anhang): Screenshot 02 nur beschnitten. Betriebsnamen/Personen nur in den *-anonym.png. Chemnitz als Testregion darf genannt werden.
