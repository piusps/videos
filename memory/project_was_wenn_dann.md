---
name: project-was-wenn-dann
description: 2026-10-29 analysis of @was.wenn.dann "Was wäre, wenn" 3D reels as template for our own; hit pattern + pitch pending
metadata:
  type: project
---

2026-10-29: Pius sent 3 reels from @was.wenn.dann (446 followers, 49 posts, ~4 posts/day, obviously automated): Hochhaus 266K, GTA 6 177K, Hosentasche 2.5K. Downloads + contact sheets in `~/Desktop/Superkind Videos/_Referenzen/2026-10-29 Was-waere-wenn/`.

Format: ~78 s, ~16 sentences of 4-5 s each, one stylized 3D scene per sentence (mannequin figures, simple assets), calm German male TTS doc narrator, pill "GEDANKENEXPERIMENT · FIKTIV", serif counter top-left, italic serif word-by-word captions, follow pill mid-video (~33 s), ends with twist + comment question; caption "Schick das der Person, die …" + "3D-Simulation, KI-gestützt erstellt".

Hit pattern: "ganz Deutschland/alle Menschen" + a German ritual or pain (Kehrwoche, Amt, Bahn, Mallorca, GTA release) + you-POV + real numbers. Flops = object/physics trivia without the collective (CDs as sunglasses, Gelber Sack to the sun, 13-month calendar, Supermarkt 1500).

**How to apply:** pitch first, then rebuild with our three.js/Remotion stack (TrainerWorld3D) + ElevenLabs. Pitched: Black Friday Paket, Weihnachtstafel, Ein Zug für Deutschland, 1.000 Mrd Jahre TikTok.

2026-10-29: all 4 episodes built (Black Friday, Weihnachtstafel, Zug, TikTok-Loop) → ~/Desktop/Superkind Videos/Was wäre wenn/. Pipeline: broll/scripts/wwd/{tts,audio,stills,render}.mjs + src/wwd/*.tsx (kit.tsx shared), entry src/index-wwd.tsx; bundle with publicDir public-wwd (symlink) or the 16 GB public/ fills the disk. Not posted, account still open.

2026-10-29 Zug v2 (Pius' Wunsch: Florent-HeyGen-Stimme 6cc88d5a… statt ElevenLabs Johannes, ≤45 s, Zahlen gerundet sprechen, spannendere Musik): src/wwd/Zug2.tsx (Comp WwdZug2, nutzt Szenen aus Zug.tsx), Assets public/wwd/zug2, runs/wwd-zug/v2. Musik = demucs-Instrumental aus Referenz-Reel 1 (`demucs -d cpu`, MPS crasht), /tmp/wwdsep. Die anderen 3 Folgen sollen erst nach Pius' OK genauso umgebaut werden.
Grafik-Upgrade Zug v3 (2026-10-30, Pius: "Grafik etwas geiler"): src/wwd/look.tsx (Verlaufshimmel statt three-Sky, der war grau-weiß; Env-Reflexionen, Sun mit weichen Schatten, Post = MSAA+Bokeh+Bloom+OutputPass) + src/wwd/ZugHD.tsx (gelofteter ICE mit Nase, Schotter/Schwellen, Oberleitung, Tageslicht-Bahnsteig, Felder). Wichtig: OutputPass tonemappt alles → rote Emissive nicht >2, sonst werden sie weiß. Hochformat-Kamera: für zwei Objekte nebeneinander von oben aufs Gleis schauen.
