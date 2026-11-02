# Beobachtungsliste Firma-Serie

Apify-Actor für Reel-Listen: `apify/instagram-reel-scraper` (Felder `username[]`, `resultsLimit`). Stand 2026-10-26: Monatslimit des Apify-Kontos erreicht, der Lauf schlägt fehl.

Fallback, der funktioniert:
- Im In-App-Browser ausgeloggt `instagram.com/<handle>/reels/` öffnen.
- **Vorher einen Screenshot machen.** Sonst rendert das ausgeblendete Panel das Raster nicht.
- Dann per JS scrollen und `a[href*="/reel/"]` mit innerText (= Views) lesen. Ausgeloggt kommen 32–44 Reels pro Kanal.
- Hashtag-Seiten (`/explore/tags/claudeai/`, `/claudecode/`, `/claudeskills/`) zeigen die Top-12 und funktionieren ausgeloggt. Manche Tags leiten auf Login um (nicht einloggen).
- mp4: Reel-Seite öffnen, `"video_url|url":"…mp4…"` aus dem HTML holen, mit `JSON.parse` dekodieren, dann curl.

**Vorsicht Anzeigen:** Steht im `efg`-Teil der mp4-URL `INSTAGRAM.AD` und passen die Likes nicht zu den Views (z. B. 99 Likes bei 281k), sind die Views bezahlt. Solche Reels nicht als Ausreißer werten.

Stil-Match = so nah wie möglich an @claudebyseb: animierte Welt statt Gesicht, Claude als Figur/Thema, Keyword-Kommentar-Funnel.

| Handle | Plattform | Warum beobachtet | Stil-Match | Follower | Median Views (n Reels) | zuletzt geprüft |
|---|---|---|---|---|---|---|
| @claudebyseb | Instagram (DE) | Vorgabe von Pius. Pixel-/3D-Welt, Claude jeden Tag, Keyword-Funnel, ~10 Reels/Tag. Alte Hits (Jarvis 91k, Gericht 58k) liegen in `Referenzen/claudebyseb/` und sind ausgeloggt nicht mehr im Raster | Vorlage | 3.874 | 1.941 (36) | 2026-10-26 |
| @lorisbot01 | Instagram (FR) | Voxel-3D-Welt komplett ohne Gesicht, Claude-Maskottchen als Figur, Claude-Code-Wissen als Metapher | sehr hoch | 4.467 | 4.816 (15) | 2026-10-26 |
| @opusjake | Instagram (EN) | Claude-Skills. Oben Pixel-Claude-Welt, unten Gesicht. Keyword-Funnel mit 14k–64k Kommentaren | hoch (Grafik) | 125.000 | 24.000 (44) | 2026-10-26 |
| @nocodealex | Instagram | Vorgabe von Pius 2026-10-28: „macht es crazy gut vom Design“. Design-Referenz Nr. 1 neben claudebyseb: Look, Motion, Typo, Übergänge so nah wie möglich übernehmen (Prinzip, nicht seine Assets) | Vorlage Design | 59,3K (verifiziert, „Alex AI“; Claude/Claude-Code-Open-Source-Repos und Skills, erklärt in einer Papier-Diorama-Welt, Englisch, Keyword-Kommentar-Funnel, mehrere Reels pro Tag) | 2.196 (30); 2.610 über alle 76 gesichteten Reels; Ausreißer 206K + 123K | 2026-10-28 |
| @buildwithomkar | Instagram (EN) | Premium-Editorial-Motion ohne Gesicht (Serifen, Produktkarten, App-Logos), Build in Public | hoch (Qualität) | 11.900 | 2.045 (32) | 2026-10-26 |
| @99hud | Instagram (PT) | Claude Code für Alltagsprobleme, Split Gesicht/Motion-UI mit 3D-Geräten, Keyword-Funnel | mittel-hoch | 86.500 | 4.215 (44) | 2026-10-26 |
| @chenbuildsai | Instagram (EN) | Pixel-Claude-Maskottchen in Thumbnails, viele Posts pro Tag | mittel | 4.259 | 1.584 (32) | 2026-10-26 |
| @_heyclicky | Instagram (EN) | Agent am Rechner mit Cursor-Figur, Referenz vorhanden. Die größten Zahlen sind teils Anzeigen oder Kollabs | mittel | 49.700 | 27.200 (44) | 2026-10-26 |
| @ai.zygis | Instagram (EN) | Claude-Code-Tutorials, Split Gesicht/UI, Keyword-Funnel mit ~8k Kommentaren | niedrig (Face-Cam) | 9.006 | 4.304 (27) | 2026-10-26 |
| @alan.buildz | Instagram (DE) | KI-Tutorials auf Deutsch, gleiche Zielgruppe, Hook-Referenz | niedrig (Face-Cam) | 54.300 | 32.500 (32) | 2026-10-26 |
| @gptmarlon | Instagram (DE) | ChatGPT- und Claude-Tipps auf Deutsch, Keyword-Funnel | niedrig (Face-Cam) | 75.800 | 24.100 (32) | 2026-10-26 |
| @mavgpt | Instagram (EN) | KI-Tutorials für Normalnutzer, sehr hohe Taktung | niedrig (Face-Cam) | 1,4 Mio. | 11.950 (44) | 2026-10-26 |
| @help.hannaa | Instagram (DE) | Satire-Schnitt, Sticker, Kommentar-Aktivierung | niedrig (Thema) | 56.400 | 97.050 (32) | 2026-10-26 |
| @nick_saraev | Instagram (EN) | KI-Agenturen und Automation, Claude-Code-Themen, sehr stabile Reichweite | niedrig (Face-Cam) | 722.000 | 130.000 (44) | 2026-10-26 |
| @liamjohnston.ai | Instagram (EN) | Claude für Unternehmen, Keyword-Funnel. Die Top-Reels sind Anzeigen | niedrig | 109.000 | 6.569 (44) | 2026-10-26 |
| @vadimvision | Instagram (FR) | KI im Unternehmen, Claude-Themen | niedrig (Face-Cam) | 52.700 | 19.100 (44) | 2026-10-26 |
| @kami.ai_lab | Instagram (JP) | Zeitsparen mit KI, Top-5-Listen mit Ranking-Leiste | niedrig (Face-Cam) | 5.727 | 11.850 (32) | 2026-10-26 |
| @mouredev | Instagram (ES) | Programmieren und KI, Pixel-Avatar-Highlights | niedrig | 627.000 | 46.900 (44) | 2026-10-26 |
| @remyzeee | Instagram (EN) | Hook-Mechanik, sehr hohe Reichweite (kein KI-Thema) | niedrig (Thema) | 996.000 | 3,0 Mio. (36) | 2026-10-26 |

Kanäle im **exakt** gleichen Stil (animierte Welt, kein Gesicht, Claude) sind selten. Gefunden:
- @lorisbot01 (am nächsten dran)
- @buildwithomkar (Qualität)
- @opusjake und @99hud (Grafik-Hälfte)

Die Websuche (Google-Index) liefert für Instagram-Handles nichts. Alle neuen Kandidaten kamen über die Hashtag-Seiten.

Nächster Lauf: weitere Tags (`#claudeai`, `#claudecode`, `#claudeskills`, `#anthropic`, `#aiagents`) und Konten, die in Captions erwähnt werden.
