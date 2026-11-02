# @pickthecompany in der Claude-Code-Cloud

Die Render-Pipeline (`broll/`) liegt jetzt im Repo und läuft in der Cloud-Sitzung (Linux, ohne GPU).

## Einmal pro Sitzung

```bash
bash cloud/setup.sh
```

Das Skript installiert rsync und `npm ci` (Remotion, ffmpeg-static), schreibt `broll/.env` aus den Umgebungsvariablen
und legt Symlinks für die Mac-Pfade aus den Skills an (`/Users/pius/LinkedIn Generator/broll` → `broll/`,
`.../_Serie Superkind baut Firma` → `ptc/serie/`).

Tipp: denselben Befehl als Setup-Skript der Cloud-Umgebung eintragen, dann läuft er bei jedem Start automatisch.

## Was in der Cloud anders ist

- **Chrome:** Remotion startet Chrome mit Direktverbindung. In der Cloud geht nur der Proxy, sonst laden die Google Fonts nicht.
  `cloud/chrome-proxy.sh` ersetzt die Direkt-Flags durch den Proxy. `firma-episode-render.mjs` nimmt ihn unter Linux automatisch,
  dazu `gl: swangle` (kein GPU). Überschreibbar mit `REMOTION_BROWSER` / `REMOTION_GL`.
- **Kontaktbögen:** Das Linux-ffmpeg hat kein `drawtext`; die Bögen entstehen dann ohne Beschriftung.
- **Musik:** `firma-mix.mjs` liest `FIRMA_MUSIC` (Pfad zur Serienmusik), sonst den Mac-Pfad. Die Musik liegt NICHT im Repo,
  weil das Repo öffentlich ist (Urheberrecht).
- **Desktop-Ordner:** mit `--no-desktop` rendern; Abgabe per SendUserFile.

## Keys (Umgebungsvariablen der Cloud-Umgebung, nie ins Repo)

| Variable | Wofür |
|---|---|
| `ELEVENLABS_API_KEY` | Stimme |
| `ZERNIO_API_KEY` | Einplanen auf @pickthecompany, Funnel |
| `OPENROUTER_API_KEY` | Video-/Bild-Prüfung |

## Grenzen

- Echte claude.ai-Läufe (eingeloggtes Chrome-Profil) gehen nur auf dem Mac.
- `zernio-golive-arm.mjs` lebt nur im Speicher; eine Cloud-Sitzung endet, der Arm dann auch.

## Zernio-Konsole

```bash
cd broll
node scripts/zernio-console.mjs                    # interaktiv, Prompt "zernio>"
node scripts/zernio-console.mjs accounts           # alle verbundenen Accounts
node scripts/zernio-console.mjs posts pickthecompany 5
node scripts/zernio-console.mjs GET "/analytics?accountId=6ad902418ceebdfb359dd0f7"
```

Lesen geht sofort; POST/PUT/PATCH/DELETE fragen vorher nach „ja“. Key aus `ZERNIO_API_KEY` (Umgebung) oder `broll/.env`.

## Stand Cloud-Test 2026-11-02

- Style-Frames Folge 20: ok. Voll-Render: ok, aber ~50 min pro Folge (CPU, swangle).
- Mix Folge 20 mit Serienmusik: ok (−14 LUFS). Serienmusik liegt nur in der Sitzung unter `/Users/pius/Downloads/` (nicht im Repo).
- Fehlt noch: `broll/public/sirtoken/sfx-*.mp3` (Soundeffekte), werden im Mix sonst übersprungen.
