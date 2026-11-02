# @pickthecompany: Kontext für einen neuen Chat
Stand: 2026-11-02, 10:00 Uhr

## Was das ist
- **Serie:** „Superkind baut eine Firma“ auf Instagram @pickthecompany. Was passiert, wenn eine KI 100 Tage lang ganz alleine ein Unternehmen aufbaut?
- **Firma in der Story:** Sie verkauft bestickte Logo-Shirts an kleine Handwerks- und Baubetriebe, produziert über Printful (Druck erst bei Bestellung). Angebot: 109 € für 5 Shirts, 29,90 € für ein Einzelshirt.
- **Kasse:** 0 €, noch kein Umsatz.
- **Jede Folge:** ein echter Gründungsschritt mit einem echten claude.ai-Lauf (echte Screenshots), dazu das „Warum“ in 2–3 Gründen. Am Ende ein Kommentar-Aufruf, der Kommentierende bekommt per DM einen Guide als PDF.
- **Look:** 3D-Welt mit Maskottchen, Claude-Papier-UI, Board mit dem Gründungsplan. Alles wird über die Serien-Engine `FirmaEpisode` (Remotion) gebaut: eine neue Folge ist eine neue `episode.json`, kein neuer Code.
- **Projekt:** `/Users/pius/LinkedIn Generator/broll`
- **Zernio-Account-ID:** `6ad902418ceebdfb359dd0f7`

## Skills: immer zuerst firma-chef laden
| Skill | Aufgabe |
|---|---|
| `firma-chef` | Orchestrator. Schreibt das Briefing, startet je Stufe einen eigenen Agenten, kontrolliert die Übergaben, plant ein, schreibt den Abendbericht. Abschnitt 6 „Tagesbetrieb“ und alle „Lehren“ lesen. |
| `firma-spy` | Muster aus Ausreißer-Reels anderer Kanäle (`~/Desktop/Superkind Videos/_Serie Superkind baut Firma/spy/`) |
| `firma-autor` | Thema, Hooks, Skript, Caption, Kommentar-Prompt |
| `firma-regie` | Stimme (TTS mit Betonungstest), `words.json`, Beat-Plan, Musik, Storyline |
| `firma-design` | `episode.json`, Stills, Render. Referenzen in `firma-design/references/`: `episode-schema.md`, `design-system.md`, `design-backlog.md` |
| `firma-pruefer` | Note je Stufe. Unter 8 gibt es ein Ticket, höchstens 3 Runden. Die finale Prüfung macht immer ein FRISCHER Agent. |
| `video-guidebook` | Guide-PDF mit `--brand superkind` |

## Feste Regeln (Pius)
- **Tagesbetrieb:** 5 Folgen pro Tag um 09:00, 12:00, 15:00, 18:00 und 21:00 (Europe/Berlin).
  - Pius' Mac ist nachts aus. Der geplante Task „pickthecompany Tagesbetrieb“ startet um 10:00, die 09:00-Folge muss also am Vortag fertig sein.
  - Abendbericht-Task um 21:45.
- **Stehendes OK:** Folgen ohne Rückfrage einplanen, Funnel anlegen und binden, echter claude.ai-Lauf. Das gilt nur, wenn die finale Prüfung mindestens 8/10 ergibt. Unter 8 wird der Slot ausgelassen, nie Füllmaterial posten.
- **Tageszählung:** Serientag = Kalendertag seit 2026-10-28 (Tag 1); heute, 2026-11-02, ist Tag 6. Nur die erste Folge des Tages sagt „Tag N.“ und zeigt den Einblender „TAG N“. Die übrigen Folgen sagen kein „Tag“ und kein „gestern“.
- **Kette:** Jede Folge beantwortet das „Als Nächstes“ der Vorgängerin, ohne Sprünge. Jede Folge muss auch für neue Zuschauer funktionieren: Rückblick höchstens 6,5 s, „Heute“ bis spätestens 14,5 s.
- **Text:** 85–100 Wörter, Sätze höchstens 12 Wörter, TTS-Tempo 1,0, 120–135 Wörter pro Minute, Länge 40–48 s. Immer nur ein neuer Textblock gleichzeitig, Karten höchstens 4 Wörter, aussagende Texte mindestens 58 px.
- **K.-o.-Kriterien im Design:** Das Maskottchen ist nie mehr als 1/3 verdeckt, die Augen sind frei, es liegen keine Untertitel auf den Augen. Panel-Wechsel und Kamera-Schnitt liegen auf demselben Frame.
- **Geld:**
  - Der Umsatz-Zähler erscheint erst ab echtem Umsatz größer als 0.
  - Nichts vortäuschen: Bestellen, Porto, Anruf und Finanzamt sind Schritte für Menschen.
  - Braucht ein Schritt Pius (Login, Geld, Gewerbe), die Folge umplanen und ihn im Bericht nennen.
- **Caption:** höchstens 2100 Zeichen. Endet mit „(Fiktives Experiment, keine echten Umsätze.)“, danach nur Hashtags. Keine Emojis, nirgends.
- **Kommentar-Antworten** (`replies.json`): 6 Stück im Ton von Florent, jede endet mit einer leichten Frage.
- **Musik:** Pro Serientag ein Stück. Jede Folge bekommt ein eigenes Zeitfenster daraus, die Fenster überschneiden sich nicht. Vor der Verwendung prüfen, dass im gewählten Abschnitt keine expliziten Wörter vorkommen.
- **Werkzeuge:** ffmpeg nur aus `broll/node_modules`. Nicht bei Instagram einloggen. Keine anderen Accounts anfassen.

## Ablauf einer Folge (Ordner `runs/firma-tag<N>/`, N = Folgennummer)
1. `briefing.md`. Den Tagesplan als `tagesbriefing-<Datum>.md` in den Ordner der ersten Folge des Tages legen, mit Slots und Musikfenstern.
2. **Autor:** `thema.md`, `hooks.md`, `script.txt`, `caption.txt`, `prompt-fuer-kommentare.md`. Prüfung.
3. **Echter Lauf** in claude.ai im T3-Preview-Profil „Chrome“, Screenshots per DOM-Klon nach `design/lauf/`. Siehe Memory `reference-claude-ui-dom-clone`.
4. **Regie:** `voice.mp3`, `words.json`, `beats.json`, `regieplan.md`, `musik.txt`. Prüfung.
5. **Design:** `public/firma-ep/tag<N>/episode.json`, dann die Stills:
   `node scripts/firma-episode-render.mjs public/firma-ep/tag<N> --stills --no-desktop`
   Prüfung, danach Voll-Render (ohne `--stills`) nach `runs/firma-tag<N>/firma-tag<N>-final.mp4`. Vorlage ist immer die zuletzt bestandene Folge (aktuell 20).
6. **Guide-PDF, Cover, Rest:** Guide-PDF mit `video-guidebook`, Cover mit `cover.mjs` (wie Folge 20), dazu `format.json` `{"format":"PTC"}` und `replies.json`.
7. **Finale Prüfung** durch einen frischen firma-pruefer. Mindestens 8.
8. **Einplanen:**
   `node scripts/zernio-schedule.mjs --video <final.mp4> --cover <cover.jpg> --caption-file runs/firma-tag<N>/caption.txt --at "<JJJJ-MM-TT HH:MM>" --account pickthecompany --no-funnel`
9. **Funnel-Arm im Hintergrund starten.** Er bindet den Funnel nach dem Live-Gang an die IG-Media-ID und holt frühere Kommentierende nach:
   `nohup caffeinate -i node scripts/zernio-golive-arm.mjs --post-id <id> --run runs/firma-tag<N> --kind ptc --account pickthecompany --name "PTC Funnel Folge <N>" --replies runs/firma-tag<N>/replies.json --pdf <guide.pdf> --watch 20 > runs/firma-tag<N>/golive-arm.log 2>&1 &`
   - Der Prozess lebt nur im Speicher. Ist der Mac beim Live-Gang aus, denselben Befehl erneut starten.
   - Kontrolle: Das Log `golive.log` zeigt LIVE, FUNNEL und eine SUMMARY-Zeile.
10. **Abschluss:** `publish.json` (Format wie Folge 20), Desktop-Ordner `~/Desktop/Superkind Videos/<Datum> Superkind baut Firma Folge <N>/`, `rueckblick.md`, Lehren in den zuständigen Skill schreiben.

**Zeitaufwand:** Eine Folge ohne Vorarbeit braucht ungefähr 3 Stunden. Staffeln spart Zeit: Lauf und Autor für Folge N+1 laufen parallel zu Regie N, Design N parallel zur Prüfung von N-1.

**Zahlen:** Zernio `GET https://zernio.com/api/v1/analytics?accountId=6ad902418ceebdfb359dd0f7` mit Bearer `ZERNIO_API_KEY` aus `broll/.env`. Posts: `/v1/posts?accountId=…`.

## Wichtige Dateien
- **Serien-Bibel:** `~/Desktop/Superkind Videos/_Serie Superkind baut Firma/wirtschaftsbuch.md`. Eine `wirtschaftsbuch-v2.md` liegt daneben; welche gilt, prüfen.
- **Konzept / Folgenplan:** `runs/firma-neu-tag1/konzept.md`
- **Funnel-Texte:** `funnel/ptc-funnel.json`
- **Qualitätsmaßstab:** Tag 1 v7 sowie die Folgen 4–8 („heute sah sehr gut aus“). Aktuell zuletzt bestanden: Folge 19 und 20, je 8,5.
- **Memory:** `project-ptc-tagesbetrieb`, `feedback-firma-neustart-format`, `feedback-ptc-weniger-text`, `feedback-zernio-funnel-rebind`

## Stand 2026-11-02, 10:00
| Folge | Thema | Status |
|---|---|---|
| 1–17 | Geschäftsidee bis Versandkosten | live, Funnels gebunden |
| 18 | Stickpreis (was zahlt sie für das gestickte Shirt?) | gerendert, finale Prüfung nur 7/10, **nie gepostet**. Hätte am 01.11. um 15:00 laufen sollen; eine Parallel-Sitzung hat sie nicht mehr eingeplant. |
| 19 | Versandzeile im Brief | live 01.11. 18:00, https://www.instagram.com/reel/DfNOMZWjJ-1/, Funnel gebunden |
| 20 | Umsatzsteuer oder Kleinunternehmer | live 01.11. 21:00, IG 18193316347370559, Funnel gebunden |
| 21 | – | nur `briefing.md`, Ordner `design/` und `pruefung/` angelegt (Inhalt nicht geprüft), noch kein Skript |
| 22 | – | noch nichts |

- Heute (Tag 6) ist um 10:00 noch keine Folge eingeplant. Der 09:00-Slot ist verpasst.
- Folge 20 endet mit der Frage nach der Rechnung, damit beginnt Folge 21.
- **Offen bei Pius:**
  - Folge 18 nachholen oder streichen? Zum Nachholen braucht sie eine Korrekturrunde auf mindestens 8 und eine neue Tag-Eröffnung.
  - Printful-Login: Stick-Endpreis und Einkaufspreis sieht man nur eingeloggt.
  - Finanzamt: Verzicht auf die Kleinunternehmerregelung, USt-ID.
- **Bekannte Störungen:**
  - Remotion legt in `/var/folders/.../T/remotion-webpack-bundle-*` je Render ca. 20 GB ab. Am 01.11. war die Festplatte voll. Vor großen Render-Tagen mit `df -h /` prüfen.
  - Gemini-Review gibt 402 zurück, deshalb wird von Hand geprüft.
  - Parallel-Sitzungen an derselben Folge führten zu Doppelarbeit: Immer nur EINE Sitzung betreibt den Tagesbetrieb.
  - Geplante Tasks schlugen einmal mit einem Git-Worktree-Fehler fehl, weil das Projekt kein Git-Repo ist. Tasks im Projektordner laufen lassen, ohne Worktree.

## Startsatz für den neuen Chat
„Lies broll/runs/PTC-KONTEXT.md, lade firma-chef und mach den Tagesbetrieb für heute.“
