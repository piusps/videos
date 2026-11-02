#!/bin/zsh
# Fragt den Zernio-API-Key verdeckt ab, entfernt Steuerzeichen, prüft ihn gegen die API und speichert ihn als ZERNIO_API_KEY in broll/.env.
ENV="/Users/pius/LinkedIn Generator/broll/.env"
print -n "Zernio API Key einfügen (Cmd+V, wird nicht angezeigt), keine Pfeiltasten, dann Enter: "
read -rs KEY
print ""
KEY=$(print -r -- "$KEY" | LC_ALL=C sed -E $'s/\x1b?\\[[0-9;]*[A-Za-z~]//g' | LC_ALL=C tr -cd '\041-\176')
[[ -z "$KEY" ]] && { print "Kein Key eingegeben, abgebrochen."; exit 1; }
CODE=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $KEY" https://zernio.com/api/v1/accounts)
if [[ "$CODE" != "200" ]]; then
  print "Zernio lehnt den Key ab (HTTP $CODE). Bitte im Zernio-Dashboard einen neuen API-Key kopieren und das Skript nochmal starten."
  exit 1
fi
touch "$ENV"
grep -v '^ZERNIO_API_KEY=' "$ENV" > "$ENV.tmp" && mv "$ENV.tmp" "$ENV"
print "ZERNIO_API_KEY=$KEY" >> "$ENV"
chmod 600 "$ENV"
print "Key funktioniert und ist gespeichert (${#KEY} Zeichen)."
