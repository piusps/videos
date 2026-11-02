# Prüfung design · Folge 12 „Betriebe“ · Runde 3 (2026-10-30)

Prüfer: frischer Prüf-Agent (wie Runde 2). Keine eigenen `--stills` (voller Render läuft). Angesehen: `runs/firma-tag12/design/runde3-pruefframes.jpg` (0/7,5/9/14,0/14,3/14,7/15,0/15,5/15,9/16,1/16,6/18,5/19,0/19,5/30,8/31,9/32,2/33,0/33,3/44 s), Einzelframes sf-0441, sf-0555, sf-0585, sf-0999 (Stand 15:11–15:12), `hook-0-6s-4fps.jpg`; Daten `episode.json`, `words.json`.

## Tickets aus Runde 2

| Ticket | Status | Beleg |
|---|---|---|
| R2-01 Region-Karte unter HUD, Plan ganz verdeckt | **erledigt (mit Rest)** | sf-0441 (14,7 s): Karte y 215, kein Pixel von TAG-Badge/Board auf der Karte; Planfelder komplett verdeckt (14,7/15,0/15,5 s). Rest: Plan-Titelstreifen „…NDUNGSPLAN · 12 SCH…“ zwischen den HUD-Kacheln (y≈100–200) angeschnitten sichtbar; Kartenränder links/rechts laufen aus dem Bild (w 1100 > 1080), Inhalt „50“/„38“ voll im Bild |
| R2-02 Claude-Akte ohne schwarze Leere | **erledigt** | sf-0555 (18,5 s): 3 große Zeilen, Markierung „das Web durchsucht“ ganz, Rest Textur bis Fensterunterkante; sf-0585 (19,5 s): Datei-Karte groß, Markierung umschließt den ganzen Namen, schwarzer Rest unten ≈ 5 % Fensterhöhe; 19,0 s gleich |
| Stempel BRANCHENVERZEICHNIS ≥ 1,3 s | **erledigt** | episode.json: from „laut“ (31,71) → „Als@33−0,15“ (33,14) = 1,43 s; Prüfframes 31,9/32,2/33,0 zeigen ihn, alle 17 Haken frei |

**Bewertung Rest R2-01:** stört nicht. Der Streifen ist Hintergrund, bekannter Kontext (Plan ist seit 5 s eingeführt), liegt außerhalb der Karte und tritt hinter HUD/Karte deutlich zurück; er bringt keine neue Information und konkurriert nicht mit „50 STATT 38“. Engine-Grenze, kein Ticket. Für Folge 13 als Backlog-Punkt sinnvoll (Plan in Heute-Einstellung ausblenden können).

## K.-o.-Check

| K.-o. | Ergebnis | Beleg |
|---|---|---|
| Ein neuer Textblock gleichzeitig | ok | 14,3–15,5 nur Region-Karte neu; 31,9 nur Stempel neu (17 VON 20 seit 30,65) |
| Karten/Stempel ≤ 4 Wörter | ok | „HANDWERK: 50 STATT 38“; Endkarte wie Folge 10/11 |
| Text ≥ 1,2 s | ok | Region 1,33 s, Stempel 1,43 s |
| ≤ ~12 neue Wörter/Frame | ok | Frame 0: 10 Wörter |
| Frame 1 = ganze Frage + Chemnitz-Karte | ok | 0,0 s |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | ok | hook-0-6s-4fps unverändert gültig |
| Hook-Objekt nie über Plan | ok | 4,73 / 5,0 s |
| Maskottchen ganz / ≤ 1/3 angeschnitten | ok | 9,0 / 15,5 / 33,3 (sf-0999, ganz im Bild) / 44 s |
| Kein Umsatz-Zähler | ok | – |
| Board | ok | 7,5/9,0 s: 1–4 abgehakt, WEBSITE ENTWURF, GEWERBE OFFEN, BETRIEBE „?“, WERBEBRIEF, ERSTER UMSATZ; 44 s „MENSCH“ |
| Nichts lesbar (Namen, Personen, Straßen, Tel., Hamburg, Sidebar) | ok | 18,5/19,5: nur Schritte-Zeile + „Kolonnenshirt testregion chemnitz“, Rest geblurrt; Haken-Spalte nur Quellenart |
| 17 Haken, „17 VON 20“, nie „vier“ | ok | 30,8–33,0 s |

**Kein K.-o. verletzt.**

## Noten

| Kriterium | Note | Beleg |
|---|---|---|
| Seite an Seite mit Referenz | 8 | Claude-Akte jetzt gefüllt und groß lesbar (sf-0555/0585), Region-Karte vollflächig und klar; auf Folge-11-Niveau |
| Lesbarkeit | 8 | HUD frei, alle Haken frei, Markierungen schneiden nichts an; Rest: Plan-Titelstreifen-Fragment (Hintergrund) |
| Keine leere Karte / Platzhalter, echte Logos | 8 | keine leeren Karten, kein Geisterbild (15,9/16,1 s) |
| Bewegung | 8 | motiviert; 33,3 s Ausblend-Schrumpfen der Pills (sf-0999) normaler Abgang; bekannte Engine-Grenzen vermerkt |
| Backlog-Upgrade | 8 | D-23 dimBoard + Claude-Verlauf-Composite (design-backlog.md Folge 12) |

**Gesamt: bestanden.** Keine Tickets. Hinweis für Backlog: Plan-Ausblendung in der Heute-Einstellung (Engine) und Region-Karte mit sichtbarem Rand (w ≤ 1040).
