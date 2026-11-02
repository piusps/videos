# BX-C · DM-Funnel (Felix × boilr)

Stand 2026-10-06, Pius' Vorgaben: **jeder Kommentar** auf dem Post löst den Funnel aus, nicht nur das Trigger-Wort. Ein Trigger-Wort pro Video bleibt trotzdem (im Video, Caption, Guide), weil es Kommentare anstößt. Vor der Demo wird **vorqualifiziert**. Alle Texte UK-Englisch, kein Emoji-Spam, klingt wie Felix selbst (Gründer, Peer-Ton). Erst nach Pius' OK aktivieren.

## Auslöser

- InstantDM auf dem Post: **„Any comment“ / alle Kommentare** statt Keyword-Liste. Falls die Lead-Gen-Automation nur Keywords kann: im Dashboard prüfen, ob es eine Option „all comments“ gibt; sonst die Flow-Automation mit Auslöser „any comment on this post“ nehmen. Doppel-Auslösung vermeiden (nur **eine** Automation pro Post).
- Felix' eigene Antworten und Spam/Bot-Kommentare dürfen keinen DM-Versand auslösen (Ausschluss für den eigenen Account setzen, falls angeboten).

## Kommentar-Antworten (rotierend, 4–6 Varianten, immer kurz + eine Frage)

- `Sent, check your DMs. Which sector do you recruit in?`
- `It's in your inbox. Perm or contract?`
- `Done. How many consultants in your team?`
- `Just sent it. Do you work retained or contingent?`
- `In your DMs. What's your hardest sector to win clients in right now?`

## Ablauf

| # | Nachricht | Inhalt |
|---|---|---|
| 1 | Welcome (Instagram braucht einen Tap) | `Hey, thanks for the comment! Tap below and I'll send you the prompts right here.` → Button **Send it** |
| 2 | Follow-Gate | `Quick one before I send it: give me a follow so you don't miss the next episode of Claude for Recruiters.` → Button **Done** (Re-Check bei Tap ohne Follow) |
| 3 | Guide | `Here you go. Every prompt from the video, step by step.` + PDF (`<slug>-guide.pdf`) |
| 4 | Brücke (ca. 2–3 min später) | `By the way: what I showed you is the manual version. We built it as a real tool. boilr reads job boards, company websites, financial reports, news and LinkedIn 24/7 and flags hiring signals for 100+ UK agencies, companies and candidates. Want to see what it finds in your sector?` → Buttons **Yes, show me** / **Not now** |
| 5 | Q1 Rolle | `Nice. Quick 3 questions so I can show you the right thing. What's your role?` → **Agency owner / director** · **Consultant at an agency** · **In-house / TA** · **Other** |
| 6 | Q2 Sektor | `Which sector or niche do you recruit in?` (Freitext) |
| 7 | Q3 Teamgröße | `How many consultants are in your team?` → **Just me** · **2–5** · **6–20** · **20+** |
| 8a | Qualifiziert (Agency owner/director oder Consultant) | `Perfect, that's exactly who boilr is built for. Grab a slot here and I'll show you live what boilr finds in <sector>: https://meetings-eu1.hubspot.com/felix-hermann` |
| 8b | Nicht qualifiziert (In-house / Other) | `Got it. boilr is built for agencies, so a demo wouldn't be worth your time. But keep the prompts, they work just as well in-house. And follow along for the next episodes.` |
| — | „Not now“ bei 4 | `No worries. Enjoy the prompts. If you ever want this running 24/7 instead of doing it by hand, just reply "demo".` (Keyword „demo“ in DMs → springt zu 5) |

**Verzweigung 8a/8b:** In InstantDM als Bedingung auf die Antwort von Q1. Kann die Lead-Gen-Automation keine Bedingung, dann Flow-Builder; geht beides nicht, bekommen alle 8a und Pius filtert in HubSpot.

## Daten

- Antworten (Rolle, Sektor, Teamgröße, Handle) per InstantDM-Webhook in ein eigenes Google Sheet „boilr Instagram Leads“ (nicht die Superkind-Warteliste). Sheet anlegen, sobald Pius den Funnel freigibt; Muster: `video-publish/assets/waitlist-webhook.gs`, Spalten: Handle, Rolle, Sektor, Teamgröße, Qualifiziert, Post, Zeitpunkt.
- Persönliche Daten nie in den Chat kopieren.

## Prüfung nach Aktivierung

Test mit Pius' Testaccount, der Felix nicht folgt: Gate, PDF, Brücke nach 2–3 min, beide Zweige 8a/8b, Webhook-Zeile. ~1 h nach Post und am nächsten Morgen: Kommentare vs. ausgelöste DMs, Klicks auf den Demo-Link (falls InstantDM das misst), Buchungen aus HubSpot von Pius.
