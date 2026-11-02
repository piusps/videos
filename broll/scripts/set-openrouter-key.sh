#!/bin/zsh
# Reads the OpenRouter key without echoing it and stores it in broll/.env
cd "${0:A:h}/.."
print -n "OpenRouter API Key einfügen (wird nicht angezeigt), dann Enter: "
read -rs KEY; echo
[[ -z "$KEY" ]] && { echo "Kein Key eingegeben."; exit 1; }
if grep -q '^OPENROUTER_API_KEY=' .env; then
  /usr/bin/sed -i '' "s|^OPENROUTER_API_KEY=.*|OPENROUTER_API_KEY=$KEY|" .env
else
  echo "OPENROUTER_API_KEY=$KEY" >> .env
fi
code=$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $KEY" https://openrouter.ai/api/v1/key)
[[ "$code" == "200" ]] && echo "Gespeichert und gültig. Du kannst das Fenster schließen." || echo "Gespeichert, aber OpenRouter antwortet mit $code – Key prüfen."
