# Phase 7: Audio

Läuft ab dem Story-Gate mit, weil die Wort-Timings den Schnitt bestimmen.

## 7.1 Stimmen
- **Mensch (Niklas als „Florent“):** HeyGen `create_speech`, Stimme nikstudio, „Superkind“ als „Super-kaind“ schreiben. Pro Frage eine Datei.
- **Agent:** ElevenLabs „Ava“ `AnvlJBAqSLDzEevYr9Ap` (Ersatz: Laura `zKHQdbB8oaQ7roNTiDTK`), `eleven_multilingual_v2`, `language_code: de`, stability 0.45, similarity 0.8, style 0.15, speaker boost, `mp3_44100_192`. „SAP“ als „Es-A-Pe“ schreiben. Nie „Lisa“.
- Wort-Timings: whisper pro Clip + bekannter Offset (ein Whisper über den ganzen Track driftet), dann `words.json`.
- Jede Datei vorher auf −16 LUFS bringen und zu `voice.wav` montieren. Zwischen Frage-Ende und Agent-Antwort liegen mindestens 0,4 s (das „denkt“).

## 7.2 SFX (ElevenLabs Sound Effects, `prompt_influence` 0.6–0.7)
Premium heißt: weich, gläsern, hölzern, kurz, mit wenig Höhen-Schärfe. Bestehendes Set in `broll/public/superkind-desk/sfx2/` (key, listen, tick, whoosh, notif, click, success, morning, pop, pop2, typing, scan, reveal, glide). Für neue Momente:
- Tastendruck: echter MacBook-Tastenklick, trocken
- Fehler: gedämpfter, tiefer Zwei-Ton (nicht schrill), dazu ein Atmer der Person
- Laptop zuklappen/aufklappen: weiches Scharnier + Magnet-Klack
- Ganzkörper: Stuhlrollen, Stoff, Schritte, Tasse auf Holz

Verboten: Spielzeug-Pops, schwere Whooshes, Sub-Hits, Dauertippen. Leichte UI-Whooshes sind ok. Jede SFX liegt auf einem Sync-Punkt aus der Shotlist.

## 7.3 Musik
Ruhiger, edler Bed (ElevenLabs Music oder vorhandener Lo-fi-Tech-Beat), ~0.12 unter Sprache. Im Hook darf sie lauter und rhythmisch sein (Cuts auf Beats). Ein Swell am Szenenwechsel darf nie mit einem gesprochenen Satz konkurrieren.

Master: `loudnorm=I=-14:TP=-1.5:LRA=11`.

## 7.4 Success sound (v4, 2026-10-21)
- Every finished task gets the SAME premium success chime (`sfx2/done.mp3`, warm two-note marimba/glass), exactly on the frame the result appears, volume ~0.34. No arcade sounds, no varying fanfares.
- Agent voice friendlier: Ava stability 0.5, similarity 0.8, style 0.4, speed 0.94; clearly distinct from the user's voice.
- Check whisper captions for imperatives ("legt/gibt" → "leg/gib") in the FIX map.
