# Satire-Engagement: Kommentare und Shares ohne Trigger-Wort

Satire-Reels (FP-S und GPT-S) haben kein Guide-PDF und kein Trigger-Wort. Der Algorithmus will trotzdem Kommentare, Shares, Saves und Rewatches. Diese Datei ist die Werkzeugkiste. Pro Video **genau einen Hauptmechanismus** wählen (im Skript eingebaut) plus **einen Caption-Mechanismus** und den **ersten Kommentar**. Mehr wirkt wie Betteln.

## A. Im Skript (Pointe oder letzter Satz)

1. **Lücken-Liste.** Liste mit 3 Punkten, der 4. fehlt absichtlich: „Punkt vier schreib ich euch in die Kommentare.“ → angepinnter Kommentar mit dem besten Punkt. Leute kommentieren eigene Vorschläge.
2. **Zuordnungs-Frage.** „Welcher Typ bist du, eins, zwei oder drei.“ Zahlen-Antworten kosten null Aufwand, ideal für Kommentare.
3. **Markier-Pointe.** Die Pointe beschreibt eine Person so genau, dass man jemanden markiert („Jeder hat diesen einen Kollegen …“). Kein „Markiere jemanden“ aussprechen, das Bild reicht. Steht in der Caption.
4. **Falsche Zahl mit Absicht** (nur bei erkennbar satirischen Rechnungen): eine Rechnung, die minimal zu hoch angesetzt ist („und das sind 14.000 Euro im Jahr“). Besserwisser korrigieren in den Kommentaren. Nie bei echten Fakten, nie bei Recht/Steuer/Gesundheit.
5. **Teil-Serie.** „Teil 1“ im Hook-Titel, Pointe kündigt an: „In Teil zwei, die Chefs.“ Kommentare fordern Teil 2, Follows für die Fortsetzung.
6. **Gegenposition provozieren** (nur GPT-S atzig): eine überzogene These, die eine Gruppe liebevoll triggert („Wer Sprachnachrichten über zwei Minuten schickt, braucht keinen Chatbot, sondern einen Therapeuten.“). Antworten kommen von beiden Seiten.

## B. In der Caption

**Hanna-Messung 2026-10-01:** 59 % ihrer Captions sind leer, der Rest ist ein einziger Satz (Figur spricht weiter, Frage an die Community oder Wortspiel), fast nie Hashtags. Das ist für beide Satire-Formate jetzt der Standard: **ein Satz oder leer**, bevorzugt eine Frage. Beispiele für Fragen:

- „Was fehlt auf der Liste?“
- „Team 1, 2 oder 3?“
- „Sag mir in einem Wort, wie das bei euch läuft.“
- Kein Link, keine Hashtags (höchstens 1 bis 2), kein „Kommentiere X“, kein zweiter Satz.

## C. Erster Kommentar (direkt nach Upload, vom Account selbst, angepinnt)

- Bei Lücken-Liste: der fehlende Punkt.
- Sonst eine Frage mit Einwort-Antwort („Ehrlich, wer von euch hat das schon mal gemacht?“, ohne Emojis, siehe DM-Ton) oder eine Bonus-Pointe, die nicht im Video war.
- Text steht im Freigabe-Paket, wird erst nach Pius' OK gepostet (`reply_to_comment` bzw. über die App).

## D. Nach dem Upload (erste 60 Minuten)

- Auf die ersten 10 bis 20 Kommentare antworten, jede Antwort mit einer Rückfrage (Ton: `feedback-dm-tone`, keine Emojis, klingt wie Florent selbst). Jede Antwort zählt als zusätzliche Interaktion und hält den Thread oben.
- Antworten gehen über InstantDM `reply_to_comment` und brauchen Pius' OK pro Antwort-Block (Liste der geplanten Antworten zeigen, dann senden).
- Kein automatisches Kommentar-zu-DM bei Satire (keine Automation in InstantDM anlegen).

## E. Was wir messen (für die Rückkopplung in die Ideen-Skills)

Pro Satire-Reel nach 48 h: Aufrufe, Kommentare, Shares, Saves, Kommentare/1.000 Aufrufe, welcher Mechanismus (A1–A6). Eintragen ins Ideen-Log des Formats (`~/.claude/ki-satire/ideen-log.md` bzw. `~/.claude/florentgpt/satire/ideen-log.md`). Nach 10 Reels: welcher Mechanismus bringt die meisten Kommentare pro 1.000 Aufrufe, der wird Standard.
