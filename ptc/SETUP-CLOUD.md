# Superkind baut eine Firma (@pickthecompany): Cloud-Paket

Stand 2026-11-02, gepackt vom Mac von Pius. Enthält alles, was die Firma-Serie braucht, um ohne den Mac zu laufen.
Videos, Rohmaterial, `node_modules` und API-Keys sind **nicht** dabei.

## Inhalt

| Ordner | Was | Gehört auf dem Mac nach |
|---|---|---|
| `broll/` | Remotion-Projekt: `src/`, `scripts/` (u. a. `firma-episode-render.mjs`, `firma-mix.mjs`, `zernio-schedule.mjs`, `eleven-tts.mjs`), Musik, SFX, Assets, `public/firma-ep` (Folgen-Daten inkl. Stimme), `public/logos` | `~/LinkedIn Generator/broll/` |
| `broll/runs/` | Nur Textdateien der bisherigen Folgen (Skripte, Regiepläne, Prüfberichte, `PTC-KONTEXT.md`), keine Videos/Bilder | `~/LinkedIn Generator/broll/runs/` |
| `claude/skills/` | Skills firma-chef, -spy, -autor, -regie, -design, -pruefer | `~/.claude/skills/` |
| `claude/memory/` | Projekt-Gedächtnis (Regeln, Entscheidungen, Formate) | `~/.claude/projects/-Users-pius-LinkedIn-Generator/memory/` |
| `serie/` | Serien-Ordner: Wirtschaftsbuch, `superkindEconomy.ts`, Tagesbetrieb-Task, Spy-Musterbibliothek (nur Text) | `~/Desktop/Superkind Videos/_Serie Superkind baut Firma/` |

Die Skills verweisen auf die Mac-Pfade aus der rechten Spalte. In der Cloud entweder genau diese Pfade
anlegen (z. B. per Symlink) oder die Pfade in den Skills einmal anpassen.

## Einrichten (Linux)

```bash
# Node 20+ (auf dem Mac: v24), git, rsync
mkdir -p "$HOME/LinkedIn Generator" "$HOME/Desktop/Superkind Videos" "$HOME/.claude/skills"
cp -r broll "$HOME/LinkedIn Generator/broll"
cp -r claude/skills/* "$HOME/.claude/skills/"
mkdir -p "$HOME/.claude/projects/-Users-pius-LinkedIn-Generator/memory" && cp -r claude/memory/* "$_/"
cp -r serie "$HOME/Desktop/Superkind Videos/_Serie Superkind baut Firma"

cd "$HOME/LinkedIn Generator/broll"
npm ci                                  # holt auch das Linux-ffmpeg (ffmpeg-static)
npx remotion browser ensure             # Headless-Chrome für Remotion
cp .env.example .env                    # Keys eintragen, siehe unten
```

Test: `node scripts/firma-episode-render.mjs public/firma-ep/tag12 --stills --no-desktop` rendert nur die Style-Frames.

## Keys (als Secrets in der Cloud-Umgebung, nie ins Repo)

| Variable | Wofür |
|---|---|
| `ELEVENLABS_API_KEY` | Stimme (TTS mit Wort-Timings) |
| `ZERNIO_API_KEY` | Posten/Planen auf @pickthecompany (`zernio-schedule.mjs`) |
| `OPENROUTER_API_KEY` | Video-/Bild-Prüfung (`review-video.mjs`) |

## Bekannte Punkte

- **Plattenplatz:** etwa 20 GB pro Render frei halten.
- **Chrome-GL:** Das Render-Skript nutzt `gl: "angle"`. Falls das unter Linux ohne GPU nicht startet,
  in `scripts/firma-episode-render.mjs` auf `"swangle"` umstellen.
- **Desktop-Kopie:** Das Skript kopiert fertige Videos nach `~/Desktop/Superkind Videos/...`.
  In der Cloud `--no-desktop` nutzen oder den Ordner anlegen.
- **claude.ai-Screenshots:** Echte Klickpfade aus dem eingeloggten Chrome-Profil gehen nur auf dem Mac.
  Die Folgen nutzen die nachgebaute Paper-Claude-Oberfläche (`src/components/ClaudePaperChat`);
  wo ein echter Screenshot nötig ist, muss er vorher auf dem Mac entstehen.
- **Alte Videos/Referenzen** (Spy-Reels, frühere Versionen) sind nicht dabei; die Musterbibliothek liegt als Text in `serie/spy/`.

## Hinweis zur Paketgröße (30-MB-Limit)
Von den alten Folgen (tag1 bis tag19, test-tag3*) sind nur die Textdaten dabei (`episode.json`, `words.json`, `beats.json`, Regiepläne).
Ihre Bilder und Stimmen fehlen; neu rendern lassen sich diese alten Folgen hier also nicht. Neue Folgen und die
neueste Folge `tag20` (komplett, als Vorlage) funktionieren.
