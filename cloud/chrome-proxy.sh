#!/bin/bash
# Cloud-Wrapper für Remotion: Remotion startet Chrome mit "--no-proxy-server" / "--proxy-server='direct://'".
# In der Cloud geht ausgehender Verkehr aber nur über den Proxy ($HTTPS_PROXY), sonst schlagen Google Fonts fehl.
# Der Wrapper entfernt die Direkt-Flags und setzt den Proxy (localhost bleibt direkt).
CHROME="${CLOUD_CHROME_REAL:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}"
args=()
for a in "$@"; do
  case "$a" in
    --no-proxy-server|--proxy-server=*|--proxy-bypass-list=*) ;;
    *) args+=("$a") ;;
  esac
done
P="${HTTPS_PROXY:-$https_proxy}"
if [ -n "$P" ]; then args+=("--proxy-server=$P" "--proxy-bypass-list=<-loopback>;localhost;127.0.0.1"); fi
exec "$CHROME" "${args[@]}"
