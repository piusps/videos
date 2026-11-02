# videos

Skills und Wissen für Pius' Video-Produktion (Superkind, @florent_preusser, @florentgpt, @pickthecompany, boilr/Felix).

- `.claude/skills/`: alle Skills (Projekt-Skills, werden in Cloud-Runs automatisch geladen). Für @pickthecompany immer zuerst `firma-chef`.
- `memory/`: Memory aus den lokalen Sessions (`MEMORY.md` = Index). Vor jeder Aufgabe den Index lesen und passende Einträge öffnen.
- `ptc/PTC-KONTEXT.md`: kompletter Kontext der Serie „Superkind baut eine Firma“ (Regeln, Ablauf, Befehle, Stand).
- `ptc/serie/`: Serien-Bibel (`wirtschaftsbuch.md`), Spy-Musterbibliothek (`spy/muster.md`, `spy/analysen/`).
- `themen/themen-log.md`: alle Video-Themen seit Ende September (alle Accounts). **Vor jeder Themenwahl prüfen: kein Kernthema, das in den letzten 45 Tagen lief.** Aktualisieren mit `node broll/scripts/themen-sync.mjs` (Zernio).
- `broll/`: Remotion-Render-Pipeline (Stand 2026-11-02 vom Mac). In der Cloud zuerst `bash cloud/setup.sh`, Details in `cloud/README.md`.

Pfade in Skills zeigen auf Pius' Mac (`/Users/pius/LinkedIn Generator/broll/...`); `cloud/setup.sh` legt dafür Symlinks an. Videos, Musik und Schlüssel (.env) liegen NICHT im Repo (öffentlich). Keine Emojis, keine erfundenen Zahlen.
