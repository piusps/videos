#!/bin/bash
# Richtet die @pickthecompany-Pipeline in einer Claude-Code-Cloud-Sitzung ein.
# Idempotent: kann bei jedem Sitzungsstart laufen (SessionStart-Hook in .claude/settings.json).
#   - rsync (braucht firma-episode-render.mjs)
#   - npm ci in broll/ (Remotion, ffmpeg-static, ffprobe), falls node_modules fehlt
#   - broll/.env aus den Umgebungs-Secrets schreiben (Keys nie ins Repo)
#   - Mac-Pfade aus den Skills per Symlink auf das Repo umbiegen
set -u
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
B="$REPO/broll"

command -v rsync >/dev/null 2>&1 || { (apt-get install -y rsync || (apt-get update && apt-get install -y rsync)) >/dev/null 2>&1; }

if [ ! -d "$B/node_modules/remotion" ]; then
  (cd "$B" && npm ci --no-audit --no-fund >/dev/null 2>&1) || echo "setup: npm ci fehlgeschlagen" >&2
fi

# Keys: aus der Umgebung (Cloud-Umgebung -> Secrets/Umgebungsvariablen) in broll/.env
ENVF="$B/.env"
touch "$ENVF"; chmod 600 "$ENVF"
for k in ELEVENLABS_API_KEY ZERNIO_API_KEY OPENROUTER_API_KEY HEYGEN_API_KEY GEMINI_API_KEY; do
  v="${!k:-}"
  [ -z "$v" ] && continue
  grep -v "^$k=" "$ENVF" > "$ENVF.tmp" 2>/dev/null; mv "$ENVF.tmp" "$ENVF"; chmod 600 "$ENVF"
  printf '%s=%s\n' "$k" "$v" >> "$ENVF"
done

# Mac-Pfade -> Repo
link() { mkdir -p "$(dirname "$2")"; [ -e "$2" ] || [ -L "$2" ] || ln -s "$1" "$2"; }
link "$B"                "/Users/pius/LinkedIn Generator/broll"
link "$B"                "$HOME/LinkedIn Generator/broll"
link "$REPO/ptc/serie"   "$HOME/Desktop/Superkind Videos/_Serie Superkind baut Firma"
link "$REPO/ptc/serie"   "/Users/pius/Desktop/Superkind Videos/_Serie Superkind baut Firma"
mkdir -p "$HOME/Desktop/Superkind Videos" "/Users/pius/Desktop/Superkind Videos" "/Users/pius/Downloads"
[ -n "${FIRMA_MUSIC:-}" ] && [ -f "$FIRMA_MUSIC" ] && link "$FIRMA_MUSIC" "/Users/pius/Downloads/GONE_GONE_THANK_YOU_KLICKAUD.mp3"

missing=""
for k in ELEVENLABS_API_KEY ZERNIO_API_KEY; do grep -q "^$k=." "$ENVF" || missing="$missing $k"; done
[ -n "$missing" ] && echo "setup: fehlende Keys:$missing (als Umgebungsvariablen der Cloud-Umgebung setzen)"
[ -f "/Users/pius/Downloads/GONE_GONE_THANK_YOU_KLICKAUD.mp3" ] || echo "setup: Serienmusik fehlt (FIRMA_MUSIC setzen, Datei nicht ins öffentliche Repo legen)"
[ -f "$B/public/sirtoken/sfx-click.mp3" ] || echo "setup: Soundeffekte public/sirtoken/ fehlen"
exit 0
