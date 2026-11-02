---
name: feedback-tts-betonung
description: No stress/pronunciation errors in TTS voiceovers from 2026-10-23 on; check every risky word before the edit
metadata:
  type: feedback
---
From 2026-10-23 on, videos must have no Betonungsfehler (wrong stress/pronunciation) in the TTS voice. Pius noticed them in the 100-Agenten Tag 2 v6 voice.

**Why:** wrong stress sounds robotic and breaks trust in the "Florent" voice.
**How to apply:** before the final voice, list risky words (compounds, English terms, brand names, numbers, abbreviations), render them in short test sentences via create_speech, listen-check them with Pius or replace them (simpler word, phonetic spelling like "Superkeind", splitting compounds, commas for rhythm). Keep a list of fixed spellings. Related: [[feedback-superkind-pronunciation]], [[project-100-agenten-series]].

- 2026-11-02 (nikstudio 6cc88d5a): "Achtel." am Satzende bekam einen Störlaut ("Achtelnung") → Re-Render mit "Achtel vom Preis". "Work Martyr" unklar → "Arbeitsmärtyrer". Kurze Wörter auf -el am Satzende vorher testen.
