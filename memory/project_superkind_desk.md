---
name: project-superkind-desk
description: "Superkind 'Desk Agent' reel (heyclicky-style split screen: stylised Mac screen + overhead POV hands), v4 delivered 2026-10-21 (92 s, render v9, 17-point brief); reusable recipe"
metadata:
  type: project
---

2026-10-20: Pius asked to rebuild @_heyclicky's "i wanna be a good agent" reel for Superkind, with Niklas' voice and a techie look. v1 was delivered first; v2 (38.2 s, render v6) came after Pius's feedback round. Both are in ~/Desktop/Superkind Videos/2026-10-20 Superkind Desk Agent/ (v1 sits in Versionen). Reference is in Referenzen/2026-10-20 heyclicky good agent.

Recipe (broll/src/compositions/SuperkindDesk.tsx, run dir broll/runs/superkind-desk; v1 backup is SuperkindDesk.v1.tsx.bak):
- **Top 960 px:** stylised macOS with an Outlook-style mail client (real Outlook/SAP/Teams logos).
  - White/orange Superkind agent UI.
  - Orange Clicky-style agent cursor with a label pill ("hört zu …", "sucht in Outlook …") that clicks through the mail, amount and attachment.
  - Morning: a visible Outlook search ("letzte Bestellung > 90 Tage") scrolls through 1,240 customers and finds 10 hits.
  - The DonePanel docks into the corner, and draft rows pop in.
  - Camera push-ins follow the cursor.
- **Bottom 960 px:** the hands press the dictation key once, then rest; no constant typing.
  - Evening clip eve-d: a 5 s MiniMax Hailuo 3 Max clip (first frame = the real Pexels frame) crossfades into Pexels 33537342.
  - Morning: Pexels 5527788, cropped so no keyboard is visible.
- **Captions:** lowercase Inter, centred exactly on the seam (y=960), no logo; agent words in light orange.
- **Voices:** Niklas via HeyGen create_speech (nikstudio). The agent is ElevenLabs shared voice Ava AnvlJBAqSLDzEevYr9Ap; write "SAP" as "Es-A-Pe".
- **SFX:** premium ElevenLabs set in public/superkind-desk/sfx2.
- **White end card:** "jeder mitarbeiter. / sein eigenes team."

**v4 (2026-10-21, after Pius's 17-point brief):** opens with the lid, ONE mic-key press with the camera following the finger, then hands rest (HeyGen image_to_video clips from a resting frame); strictly one task at a time with started-only steps and a docked panel; SAP window opens at the step start, no swearing; the same done.mp3 chime per finished task; approvals only via an Enter key close-up; morning split into list → drafts; an upright relaxed person as variation; end card at zIndex 100 = clean white. Timeline in T{} in the composition, voice in runs/superkind-desk/build-voice-v4.py.

**Why:** this format needs no avatar render, so it is cheap. It shows the product as a vision without exposing the real UI ([[user-florent-niklas]]).

**How to apply:** reuse it for further use-case reels. Related: [[feedback-desk-agent-style]], [[reference-openrouter-video]], [[feedback-real-logos]].

**v5 (2026-10-21, render v10):** desk hands = Pius' own recording IMG_7427 (tripod cropped, evening warm / morning cool grade); the dictation key toggles: 1st press "hört zu", 2nd press after the last word → "denkt …"; Enter clips use a crop shifted right. Clips in public/superkind-desk/desk/own-*, build: runs/superkind-desk/own/build-masters.sh + cut-clips.sh. v4 moved to Versionen.

**v6 (2026-10-21, render v11, 94 s):** night = Pius' own IMG_7428 (Touch ID lock → close → closed with eve→mor grade blend → open → Touch ID unlock), the morning moved +2 s (MS in TSX, build-voice-v5.py); stranger relax shot removed; tripod cut to black from the laptop edge; masters at 1710x1520; Enter 39.6 / 87.9. Build: runs/superkind-desk/own/build-masters.sh, cut-clips.sh, build-lid.sh.

**v7 (2026-10-21, render v12, 64 s), concept rework:** the reel shows the outcome, not the process, because the audience wants full service.
- Superkind proactively offers to take over the 4th manual "90 days without an order" search.
- Florent says yes: every day at 17:00, as a table.
- Next day 17:00 the list arrives on its own via a lock-screen notification.
- Then one step: personal mails, followed by a single Enter.
- The outcome pitch closes on "unterwegs gelöst".
- The top half shows ONE Superkind window (real app sidebar structure in web branding). Composition rewritten; the v6 backup is runs/superkind-desk/SuperkindDesk-v6.tsx.bak. Voice is built by build-voice-v7.py.
- Enter now syncs to the real key-down at 1.80 s in own-ret-m7.

**v8 Outcome-First (2026-10-21, render v13, 35 s) = Feed-Hauptversion.** Hook = 14 gesendete Mails in Outlook, dann Rückblende „Gestern, 16:52“. Aufgabe 1 via Teams (Superkind meldet sich proaktiv, „Ja, mach.“), Aufgabe 2 per Mail (Liste kommt 17:00 als Superkind-Mail, Florent antwortet in einem Satz) → 14 Entwürfe → Enter → „unterwegs gelöst“. Kein eigenes Superkind-Fenster. v7 (64 s) = lange Funnel-Version für Website/Retargeting. Backups: runs/superkind-desk/SuperkindDesk-v7.tsx.bak, words.v7.json; Voice: build-voice-v8.py.
**v9 (2026-10-21, render v14, 35 s):** Pius rejected v8 because it was too much Outlook, the UI looked cheap and the first second was bad. v9 runs everything in the Teams chat with a macOS look, a soft film grade on the keyboard footage and one continuous rest clip under the hook. v8 backup: SuperkindDesk-v8.tsx.bak.

**v10 (2026-10-21, render v15, 31.9 s):** Claude-UI in Superkind-Branding (Fullscreen chat, Greeting „Hallo Florent.“), startet mit Avas Satz (a91), Return-Clip own-ret-m9 ohne Fremd-Tastendrücke. Voice: build-voice-v9.py. v9 backup: SuperkindDesk-v9.tsx.bak.
