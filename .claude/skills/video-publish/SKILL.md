---
name: video-publish
description: Phase 9 of the Superkind reel pipeline — publishing and the comment-to-DM automation. After video-qc-delivery, uploads the reel to Instagram via the InstantDM MCP (create_post / publish_post, after Pius confirms caption and cover), builds the per-video comment automation in the InstantDM dashboard in Pius' Chrome (trigger word on this post → DM 1 short text, DM 2 the guidebook PDF as a file, DM 3 short text), activates it after his OK, and then checks that comments with the trigger word really get the PDF. Use for "lad das hoch", "poste das Video", "Automation einrichten", "InstantDM", "ist online", "läuft die Automation?", or as the last step of heygen-video-generator. Serves all formats and both accounts; see "Accounts and formats" (satire = no automation, @florentgpt not yet connected in InstantDM).
---

# Video Publish + DM-Automation — Phase 9

Introduced 2026-10-01 (Pius: "bei jedem Video, das wir hochladen, wird die Post-Automation über InstantDM gestartet … dann sind wir fast fully automated").

**Input:** the Desktop folder from `video-qc-delivery` (`<Thema> – Video.mp4`, `– Cover.png`, `– Guidebook.pdf`, `– Texte.txt`) with the Abschluss-Checkliste passed.
**Output:** the live reel, an active InstantDM automation for its trigger word, `runs/<topic>/publish.json` (post id, permalink, automation name, times), and a check report.

**Tools:** InstantDM MCP (`instantdm`, see memory reference-instantdm-mcp): `whoami`, `create_post`, `publish_post`, `list_posts`, `list_comments`, `list_conversations`, `get_conversation`, `send_dm`. Creating automations is **not** in the MCP or the API, only in the dashboard app.instantdm.com → use **Claude in Chrome** (Pius' logged-in Chrome; it has `file_upload` for the PDF). Never log in or type a password; if the dashboard is logged out, ask Pius to log in.

## Accounts and formats (since 2026-10-01)

Read `format.json` in the run dir before anything else.

| Format | Account | Step 1 Upload | Step 2 Automation |
|---|---|---|---|
| FP-N | @florent_preusser | InstantDM `create_post` | full Lead-Gen flow below (follow gate → guide → Superkind waitlist) |
| FP-S | @florent_preusser | InstantDM `create_post` | **none**; instead post + pin the first comment and answer the first comments (`reel-formate/references/satire-engagement.md` C + D, every reply batch after Pius' OK) |
| GPT-N | @florentgpt | InstantDM once connected, else Pius uploads | Lead-Gen flow **without** the Superkind part: entry point + follow gate + guide (PDF with `--brand florentgpt`) and comment-reply questions; skip steps 3-5 (no pitch, no captures, no waitlist webhook) |
| GPT-S | @florentgpt | Zernio (`zernio-schedule.mjs`) | **since 2026-10-27: guide funnel** (kind `gpt`, texts `funnel/gpts-funnel.json`, attached automatically by `zernio-schedule.mjs`); see `gpt-satire-reel/references/nutzen-bruecke.md` §5 |
| BX-C | Felix (boilr, English) | InstantDM via its own server `instantdm-felix` once Pius connected the account, else Pius uploads | **own funnel** `boilr-recruiter-reel/references/dm-funnel.md`: fires on **every comment** (not only the keyword), follow gate → English guide (`--brand boilr`) → boilr bridge → 3 qualifying questions → HubSpot demo link only for agencies; own leads sheet, never the Superkind waitlist |

**@florentgpt in InstantDM:** connected in the dashboard since 2026-10-02 (trial plan, 500 credits). Uploads/reads go through a **second MCP server `instantdm-gpt`** (Pius registers it himself with the @florentgpt API key; never put keys into config yourself). Before any GPT upload: `whoami` on `instantdm-gpt` must return @florentgpt and on `instantdm` @florent_preusser; never use the wrong server for an account. Until Pius connects it (InstantDM → add account, he logs in himself), deliver the Freigabe-Paket and let him upload; note it in `publish.json`. The MCP key is per InstantDM workspace; after connecting, check with `whoami` which account the tools act on before any upload.

**Next Post Automation is unreliable (both accounts, 2026-10-02):** it attached neither to the "Later" re-upload on @florentgpt nor to the `create_post` upload of the AGB reel on @florent_preusser; both came out "Not Automated", and the Next Post entry stayed pending. Rule: after every publish, set Lead Gen **directly on the post**: post → Lead Gen → Browse Library → Apply:
- „FP Guide + Waitlist-Flow (Follow-Gate, PDF, Pitch, Leads)“ for FP-N;
- „GPT Guide-Flow (Follow-Gate + PDF)“ for GPT-N.
The library keeps welcome, gate, guide texts, PDF, delay, pitch, captures and tag, but **not keywords or comment replies**: add those each time. Swap the PDF (Remove PDF → Yes → upload into the `.pdf` file input of the editor, never into the Crisp chat input), then Publish & Activate. Afterwards switch off any Next Post automation still pending, otherwise it hits the next video with the wrong trigger word.

**Stand 2026-10-07:** Im Dashboard ist @florentgpt verbunden (unten links auswählbar). Der MCP `instantdm` (`whoami`) zeigt aber nur @florent_preusser. Für @florentgpt also immer das Dashboard in Chrome nutzen, nie dem MCP-`whoami` glauben, dass GPT „nicht verbunden“ ist. Beim „Apply“ aus der Library kommen die Keywords und Kommentar-Antworten des zuletzt gespeicherten Videos mit (z. B. Urlaub): Alle löschen und neu setzen, ebenso den ersten Text-Step („Hier ist dein …-Guide“) und den Abschlusstext. Nach „Publish & Activate“ zeigt der offene Editor kurz wieder die alte Library-Version; das ist nur Anzeige. Zum Prüfen die Seite neu laden und den Lead-Gen-Editor erneut öffnen.

**Fallback without `instantdm-gpt` (used 2026-10-02): dashboard "Later" in Pius' Chrome**, with florentgpt as the active account at the bottom left.
1. **Automation first.** Build the Next Post Automation as Lead Gen and set it live before scheduling. It attaches to the next *published* post. **Even a post Pius later sets to private uses it up** (2026-10-02: the first Urlaub post without music took the automation, and the re-upload with music came out "Not Automated").
   After every publish:
   - Check Instagram DM → Posts: the new post must not show "Not Automated".
   - If it does, open the post → Lead Gen. Load **"GPT Guide-Flow (Follow-Gate + PDF)"** from the Lead Gen Library, swap the trigger word, the comment replies and the PDF, then "Publish & Activate".
   - If comments came in before activation, catch them with "Re-run missed comments", but only after Pius' OK, because it sends DMs.
   - `file_upload` cannot read the PDF if its filename has an en dash: copy it to a simple name first.
2. **Video.** "New Schedule" → Reel. Re-encode to ≤10 MB first (1080x1920 h264, crf 21, maxrate ~2900k), then pass it to the hidden file input via `file_upload`.
3. **Caption.** Type it into the textarea. A "Discard Changes?" dialog may flash while typing or uploading. Never click Discard; check with a screenshot that the modal is still open.
4. **Cover.** Upload frame 0 via the `accept=image/*` input ("Upload Custom").
5. **Time.** The picker hides hours earlier than about now +1 h. To post sooner, triple-click the time field and type `YYYY-MM-DD hh:mm AM/PM`, e.g. 10 minutes ahead.
6. **Schedule.** Click Schedule, then **Close** the "Setup Automation" dialog. A second automation on the same post would DM people twice.
7. **Trial reel:** the Later modal has a "Post as trial reel" toggle (since 2026-10-06), with "share to everyone automatically if it performs well". **Broken (2026-10-06, Fünf Tische):** the trial toggle produced only a draft in Instagram, nothing was posted. Do not use it; schedule normal reels, or let Pius share a trial from the app.
8. **Music.** The video **must contain music** (Pius set the first version without music to private).

## Confirmation rules (always)

Publishing and every message reach real people. Before each of these, show exactly what will happen and wait for Pius' "ja":
1. **Upload:** covered by the approval of the Freigabe-Paket (step 0); if anything changed since, ask again.
2. **Activation of the automation:** trigger word(s), post, the three DMs including the PDF file name.
3. Any manual `send_dm` / `reply_to_comment` during the check.
One "ja" covers only that one step for that one video.

## 0. Freigabe-Paket (manual review gate, user rule 2026-10-01)

Before anything goes to InstantDM, Pius and his team review once more. Send in **one message**:
- the final video (SendUserFile, render) and the cover,
- the exact Instagram caption that will be posted,
- the trigger word and the three DMs incl. the PDF file name (SendUserFile the PDF),
- what will happen next ("Nach eurem Approval lade ich über InstantDM hoch und richte die Automation ein").
Then **stop and wait**. Only an explicit approval ("approved", "passt, hochladen", "ja") for *this* video starts step 1. Changes requested → fix in the owning phase, send a new Freigabe-Paket.

## 1. Upload the reel (InstantDM)

1. `whoami` → confirm the account is @florent_preusser and credits are left.
2. The MP4 and cover (JPEG, convert the PNG cover) must be at a **public URL**. **Hosting = tmpfiles.org (Pius' decision 2026-10-01):** `curl -F file=@<simple-name.mp4> https://tmpfiles.org/api/v1/upload` → page URL; the `/dl/<id>/…` form returns HTML, the real file is the **signed link** inside that page (`curl -sL <page> | grep -oE 'https://tmpfiles.org/dl/[^"]*'`), valid only ~5 min → fetch fresh signed links right before `create_post` and call it immediately.
   - **`create_post` can return a 504 Gateway Timeout although the reel goes live** (first satire upload 2026-10-01). Never retry blindly: check `list_posts` (newest entry) first, wait 1-2 min and check again; retry only if it's still missing.
3. After the OK: `create_post` with `post_type: "reel"`, `media: [{type: "video", url}]`, `cover_url`, `caption`. If it returns a `container_id` (still processing): wait, then `publish_post` until it is published.
4. `list_posts` → note the new post id + permalink in `publish.json`.
- Trial Reels can't be created through the API. If Pius wants a Trial Reel (e.g. satire, new formats), he uploads it himself in the app and says "ist online"; continue with step 2.
- TikTok is not covered by InstantDM; that upload stays manual (caption from texte.txt).

## 2. Build the comment-to-DM automation (InstantDM dashboard, Chrome)

Standard for **every** video since 2026-10-01 (Pius): follow gate → guide → 90 s later lead-gen for the Superkind waitlist. Built with the post's **"Lead Gen"** automation (post → Automation Configuration → card "Lead Gen"; the "Flow" tab stays blank). Use **only** Lead Gen on new posts (it sends the PDF itself); never run "Send Link or PDF" with the same keyword on the same post, or people get everything twice. After the first approved build, save it to the **Lead Gen Library** ("Browse Library") and reuse it per video, swapping only trigger word, post and PDF.

**Builder facts (checked 2026-10-01):** steps are linear. Available: Text Message, Image, PDF, Button Template (buttons are **links only, no branching**), Followers Only, Smart Delay, Tag Contact, Capture Email / Phone / Name, Custom Input. **Opening the Lead Gen editor and closing it switches the post's Lead Gen toggle ON**, even without saving: never open it on a live post just to look; if it happens, switch it off right away (confirm "Disable") and check `list_conversations`.

**Tone (Pius, 2026-10-01): no emojis anywhere, write like Florent typing himself** — short, plain sentences, "du", no marketing phrases, no "Fast geschafft"-style bot copy.

**Alle Kommentare in den Funnel (Pius, 2026-10-07, gilt ab jetzt für jede Automation auf beiden Accounts):** Step 1 steht immer auf **„All Comments“**, nicht auf „Custom Keywords“. Jeder Kommentar bekommt also eine Antwort unter dem Kommentar und die DM mit Follow-Gate und PDF, nicht nur Kommentare mit dem Trigger-Wort. Das Trigger-Wort bleibt in Skript, Caption und Outro als Aufforderung stehen. **Kommentar-Antworten immer neu und individuell für das Video schreiben** (4 bis 6 Varianten, siehe „Comment-reply questions“), nie die aus der Library übernehmen. Weil jetzt auch Kommentare wie „krass“ oder „stimmt nicht“ eine Antwort bekommen, so formulieren, dass sie auf jeden Kommentar passen (kurzes „Hab dir was in die DMs geschickt“ plus eine leichte Frage, kein „danke fürs Kommentieren von Handy“). Die Willkommensnachricht muss ebenfalls auf jeden Kommentar passen.

**Entry point:** Step 1 = All Comments (Regel oben; früher Custom Keywords = trigger word + lowercase + common typos) · Step 2 comment replies (InstantDM rotates them; 4-6 variants, each = short "sent" + **one question** that invites a second comment, see "Comment-reply questions" below) · Step 3 welcome message (Instagram needs a tap to open the DM): `Hey, danke dir für deinen Kommentar! Tipp kurz unten drauf, dann schick ich dir den Guide direkt hier rein.` · Button `Ja, schick rüber`

**1 · Followers Only** (only non-followers see it): title `Eine Sache noch` · description `Folg mir kurz, dann schick ich dir den Guide sofort. Ich zeig da jede Woche, wie wir solche Sachen im Unternehmen mit KI lösen.` · buttons `Zum Profil` / `Erledigt, folge dir` (re-checks the follow on every tap). **Switch "Move to next step if not followed" OFF**, otherwise the PDF goes out after 30 min without a follow. No timed reminder exists in this builder.

**2 · Guide:** Text `Hier ist er:` → PDF `<Thema> – Guidebook.pdf` → Text `Schau ihn dir in Ruhe an. Wenn irgendwas unklar ist, schreib mir einfach hier, ich antworte dir persönlich.`

**3 · Smart Delay 1 min** (minutes only, integers) → Text (Pius 2026-10-02, replaces the longer Superkind/100-€ text): `Noch kurz was: Ich baue gerade eine Plattform, die es dir sehr einfach macht, KI in dein Unternehmen zu bringen. Wenn du Bock hast, schreib ich dich auf die Waitlist.` No branching: whoever isn't interested simply doesn't answer.

**4 · Lead capture** (in this order; Edit Step → question text, invalid response message, variable name):
1. Capture Name `Wenn du dabei sein willst, schreib mir kurz deinen Vor- und Nachnamen.` · invalid `Schreib mir einfach kurz deinen Vor- und Nachnamen, dann trag ich dich ein.` · var `name`
2. Custom Input `Danke! Und wie heißt deine Firma?` · var `company`
3. Capture Email `An welche Mail soll ich dir Bescheid geben, wenn's losgeht?` · invalid `Da ist glaub ich ein Tippfehler drin. Schick sie mir nochmal, so wie name@firma.de` · var `email`
4. Capture Phone `Und deine Handynummer? Dann kann ich dich zum Start auch kurz anrufen und dir alles zeigen.` · invalid `Die Nummer krieg ich irgendwie nicht rein. Schreib sie am besten so: +49 170 1234567` · var `phone`
- Tag Contact `superkind-lead` → Text `Top, du bist drauf. Ich meld mich bei dir, sobald wir live sind. Und wenn du vorher Fragen zum Guide hast, schreib mir einfach.`

**Comment-reply questions** (write new ones per video, topic-specific; the goal is a second comment from the same person, which counts as engagement and pushes the reel):
- easy to answer in 1-3 words (number, yes/no + why, branch): `In welcher Branche bist du unterwegs?`
- their own experience with the video's pain: `Hattest du selbst schon mal eine Abmahnung auf dem Tisch?`
- either/or about how they do it today: `Wie macht ihr das bisher, direkt zum Anwalt oder erstmal selbst draufschauen?`
- a number they like to share or complain about: `Was hat euch die letzte Abmahnung ungefähr gekostet?`
- next-topic wish (also gives content ideas): `Was soll Claude als Nächstes für dich erledigen?`
Never ask something that needs a long answer or feels like a survey; always start with a short "sent" line (`Hab's dir geschickt, schau mal in deine DMs.` / `Ist raus.` / `Liegt in deinen DMs.` / `Hab dir geschrieben.`). Answer the replies by hand when possible.

**5 · Webhook → Superkind-Warteliste** (Google Sheet `1x-rcr-GAVVxAA5pIkc-34kh3i-g6Oi-Cs2UlYzZ7sng`, first tab: Vorname, Nachname, Email, Telefonnummer, Firma, Zeitpunkt, Sprache, Seite). One global webhook in InstantDM → Menu → API & MCP → Webhooks, events `question_answered` (fires per answer) + `flow_completed` (once, with `question_responses`, `response_variables`, `flow_name`, `sender_username`). Receiver = standalone Apps Script `assets/waitlist-webhook.gs` deployed as web app, URL `<exec-URL>?key=<SECRET>`. flow_completed → row in the waitlist (`Seite = instagram/<flow_name> @handle`); every answer → tab `Instagram-Teilweise` (drop-offs); raw payloads → `Instagram-Raw`. InstantDM's own "Lead Gen Contacts" tab per post is the backup. This sheet is the real waitlist with personal data: never paste its rows into chat.

Fill everything in, screenshot the finished flow, show it to Pius, activate only after his OK. Test with Pius' test account that does **not** follow @florent_preusser: gate appears, re-check on tap without follow, PDF after follow, 90 s pitch, invalid email/phone retries, row lands in the sheet.

## 3. Check that it works ("drauf schauen")

- ~1 h after posting and again the next morning: `list_comments` on the post → count comments containing the trigger word; `list_conversations` / `get_conversation` → did each of them get DM 1–3 with the PDF?
- Report: comments total, trigger comments, DMs delivered, anything that failed (402 credits / 429 hourly limit / missing PDF). For commenters who got nothing, offer a manual `send_dm` (with confirmation).
- Update `publish.json` with the numbers; when the reel is 7 days old, also pull `get_post_insights` for the performance log (`video-qc-delivery` §6).

## Check before saying "fertig"

- [ ] Reel live, permalink in publish.json
- [ ] Automation active, scoped to this post, trigger word = script/outro/captions/guide
- [ ] Guide step contains the right PDF
- [ ] Lead Gen: follow gate (fallback OFF) + 90 s pitch + 4 captures; no parallel "Send Link or PDF" on the same keyword
- [ ] First check (≈1 h) done and reported

## InstantDM „Later“: Planen für einen anderen Tag (gelernt 2026-10-02)

- **Nie ein Datum für einen anderen Tag ins Zeitfeld tippen.** Das Tippen von `2026-10-03 …` hat die Seite zweimal komplett eingefroren (Tab musste geschlossen werden). Das Tippen eines Datums vom selben Tag geht.
- Stattdessen: erst Reel, Video, Caption und Cover, dann Datumsfeld so oft anklicken, bis der Kalender aufklappt (es toggelt), Tag im Kalender anklicken, dann Stunde, Minute, AM/PM in den Spalten anklicken (Stundenliste scrollt erst nach einem Klick auf „08“ weiter nach unten), Kopfzeile prüfen (z. B. „13:30“), **OK**, dann `Schedule` per Ref anklicken.
- Das Default-Datum ist kaputt, sobald jetzt+1 h nach Mitternacht fällt (Feld zeigt dann den heutigen Tag 00:xx, also Vergangenheit).
- **Screenshots zeigen das Modal oft unsichtbar** (Animation). Dann nicht daneben klicken, sonst kommt „Discard Changes?“. Elemente per `find`-Ref ansprechen; erscheint der Discard-Dialog, immer **Cancel**.
- Nach jedem Planen den Dialog „Scheduled, Next Automate Comments“ mit **Close** schließen (Close-Button unten links im Dialog, notfalls zweimal klicken).

> **FP-S als Trial Reel (Henri 2026-10-10):** Satire-Reels auf @florent_preusser (FP-S) immer als Trial Reel einplanen. Im InstantDM-Later-Modal gibt es dafür den Toggle „Post as trial reel“ (zeigt das Reel zuerst Nicht-Followern): vor „Schedule“ einschalten und prüfen, dass er an ist. Gilt nicht für FP-N, GPT oder Felix, außer Henri sagt es.

> **Later + „Setup Automation“ geht NICHT auf den Live-Post über (Arena, 2026-10-15):** Die am eingeplanten Post gebaute und aktivierte Lead-Gen-Automation stand nach der Veröffentlichung am echten Post auf **aus** (leere Standard-Automation), obwohl die Post-Liste „Automated“ zeigte. Deshalb nach jeder Veröffentlichung den Live-Post öffnen (Instagram DM → Instagram Automation → Post) und den Lead-Gen-Schalter prüfen. Schnellster Fix: Lead Gen öffnen → **Copy Previous** (übernimmt die zuletzt gespeicherte Automation inkl. Keywords/Antworten), PDF sicherheitshalber neu hochladen, Publish & Activate, neu laden und Schalter prüfen; danach `list_comments` auf verpasste Kommentare.

> **InstantDM Lead-Gen-Editor (gelernt 2026-10-15, Felix):** Der Editor ist im Chrome-Fenster rechts abgeschnitten. Vorher per JS `document.body.style.zoom="0.67"` setzen, dann ist alles sichtbar und Koordinaten-Klicks treffen (Ref-Klicks treffen bei Zoom oft nicht, dann Koordinaten oder JS-Click nutzen). **„Copy Previous“ kopiert die zuletzt gespeicherte Automation über alle Accounts** (kam die deutsche Arena-Automation von @florent_preusser) – für Felix immer „Browse Library“ → BX-C nehmen. „Escape“ schließt den ganzen Editor (und schaltet Lead Gen an), nicht nur den Library-Dialog. Bei geplanten Posts zeigt der Editor nach „Publish & Activate“ weiter „DRAFT“; maßgeblich ist der Blitz am Eintrag im Later-Kalender.

> **Zernio statt InstantDM (Pius 2026-10-19: „mach alles nur noch über Zernio“):** Planen mit `node scripts/zernio-schedule.mjs --video … --cover … --caption-file … --at "YYYY-MM-DD HH:MM" --account florent_preusser`, Automation mit `node scripts/zernio-automation.mjs create --account … --name … --pdf … --config automation.json --post-id <Zernio postId>` (All Comments, DM mit Guide-Button, Kommentar-Antworten). Getestet 2026-10-19 (Angebot): Eine an die Zernio-Post-ID gehängte Automation wird nach dem Veröffentlichen automatisch auf die Instagram-Media-ID umgestellt. Kein Chrome nötig. Texte vorher Pius zeigen.

> **Zernio-Lead-Funnel (Pius 2026-10-19):** `node scripts/zernio-funnel.mjs create --account florent_preusser --name "FP Funnel <Thema>" --config funnel/fp-funnel.json --pdf runs/<run>/<x>-guidebook.pdf --platform-post-id <IG media id> --activate` – erst NACH dem Veröffentlichen (braucht die IG-ID), und nie zusätzlich zur einfachen Kommentar-Automation auf demselben Post (sonst startet der Workflow nicht). Ablauf: „Ja, schick rüber“ → weicher Follow-Check → Guide-Button → 1 min → Waitlist-Pitch → Name, Firma, E-Mail (blockt Freemail, Sammelpostfächer, Beispieladressen), Telefon (blockt Fake-Nummern) → Tag `superkind-lead` → Webhook ins Waitlist-Sheet (wenn `WAITLIST_WEBHOOK_URL` in .env) → Danke. Regeln: `funnel/rules.mjs` (gleiche Regeln im Apps Script `funnel/zernio-waitlist-webhook.gs`, neu erzeugen mit `node funnel/make-waitlist-gs.mjs`). Leads exportieren: `node scripts/zernio-funnel.mjs leads`. Test: Workflow mit `--test-keyword FUNNELTEST`, DM von einem Zweitkonto. Texte vor Aktivierung Pius zeigen. **Ins Sheet kommen die Leads per geplanter Aufgabe `zernio-leads-to-waitlist` (alle 2 Tage 09:00):** `node scripts/zernio-leads-sync.mjs collect` (abgeschlossene Runs, Workflows mit „test“ im Namen übersprungen, gleiche Regeln) → `funnel/sync/pending.json` → Google-Sheets-Connector `append_values` (Werte mit führendem Apostroph = Text, `Seite = Instagram (Zernio)`, Duplikate gegen Spalte C) → `node scripts/zernio-leads-sync.mjs mark`. Kein Apps Script/Web-App nötig. Zernio-Custom-Fields lead_name/lead_company/lead_email/lead_phone (text) existieren seit 19.10.

> **Zernio-Funnels pro Post (seit 2026-10-20, ersetzt die beiden Notizen oben für neue Videos):** Pro Reel eine Kommentar-Automation (alle Kommentare, öffentliche Antworten aus `runs/<run>/replies.json`, Willkommens-DM mit Button) + ein Workflow, der nur über diesen Button startet (weicher Follow-Check → Guide-Button → je nach Format weiter). Ein Befehl: `node scripts/zernio-funnel.mjs create --kind <fp|gpt|bx|bx-guide> --account <handle> --name "<FP|GPT|BX> Funnel <Thema>" --pdf <guide.pdf> --replies runs/<run>/replies.json --platform-post-id <IG media id>`. Kinds: `fp` = Guide + Superkind-Waitlist (Texte `funnel/fp-funnel.json`), `gpt` = nur Guide (@florentgpt, `funnel/gpt-funnel.json`), `bx` = Felix Agentur-Folgen: Guide → 2 min → boilr-Brücke → Rolle → Sektor + Teamgröße → HubSpot-Link, In-house/Other bekommt freundliches Nein (`funnel/bx-funnel.json`), `bx-guide` = Felix Kandidaten-Folgen, nur Guide. Braucht die IG-Media-ID, also erst nach dem Veröffentlichen. Nie zusätzlich `zernio-automation.mjs` auf denselben Post (nur eine aktive Automation pro Post). Übersicht `posts`, schalten `on|off <IG-ID>` oder `--all`, Felix-Antworten `bx-leads`. Tests: Workflows „FP Funnel TEST v2“ (DM `FUNNELTEST2`), „BX Funnel TEST“ (`BOILRTEST`), „GPT Funnel TEST“ (`GPTTEST`) vom Zweitkonto. Registry: `funnel/registry.json`. InstantDM wird nicht mehr genutzt.

> **Funnel sofort nach dem Veröffentlichen (Henri 2026-10-20):** Beim Belege-Reel stand der Funnel auf „wartet auf OK“, 18 Leute kommentierten und bekamen nichts. Ab jetzt: Sobald ein FP-N-Post live ist (IG-Media-ID da), sofort `zernio-funnel.mjs create --kind fp …` mit dem Guide-PDF und `replies.json` anlegen und aktivieren, ohne auf eine extra Freigabe zu warten (Henri hat das für FP-Funnels generell freigegeben). Wer vorher schon kommentiert hat, bekommt über `POST /inbox/comments/{postId}/{commentId}/private-reply` einmal reinen Text mit dem Guide-Link (keine Buttons: Instagram kann sie bei Nicht-Followern ablehnen und verbraucht damit die einzige private Antwort; nur innerhalb von 7 Tagen). Vorlage: `runs/catchup-2026-10-20.mjs`.

> **Funnel direkt beim Einplanen, auf allen 3 Kanälen (Henri 2026-10-21, gilt für jede Sitzung):** Keine Nachlauf-Jobs. Der DM-Funnel wird beim Einplanen sofort in Zernio an die **Zernio-Post-ID** gehängt; Zernio stellt ihn beim Veröffentlichen selbst auf die Instagram-Media-ID um, damit greift er ab dem ersten Kommentar. `scripts/zernio-schedule.mjs` macht das automatisch: Run-Ordner aus `--run` oder aus dem Pfad von `--video`, Format aus `format.json` (FP-N → `fp`, GPT-N → `gpt`, BX → `bx-guide` bzw. `funnel` aus format.json, FP-S/GPT-S → kein Funnel), Guide = `*guide*.pdf`, Antworten = `replies.json` (`{commentReply, commentReplyVariations}` oder `{main, variations}`); schreibt `zernio_post_id` und `funnel` in `publish.json`. Wer anders einplant (eigene Skripte, Dashboard), legt direkt danach selbst `zernio-funnel.mjs create … --platform-post-id <Zernio-Post-ID>` an. Fehlt PDF oder replies.json, meldet das Skript „KEIN Funnel“: dann sofort nachliefern. Für schon veröffentlichte Posts ohne Funnel (Notfall): `node scripts/zernio-autofunnel.mjs` einmal von Hand, legt den Funnel an und schickt allen bisherigen Kommentatoren den Guide-Link per privater Antwort plus öffentliche Antwort.

> **STOPP – kein automatisches Hochladen/Einplanen (Henri 2026-10-21):** Bis auf Widerruf wird kein Reel automatisch hochgeladen oder in Zernio eingeplant, auch nicht aus geplanten Aufgaben oder mit älteren Freigaben („direkt via Zernio einplanen“). Video bis zur Upload-Datei fertig machen, dann stoppen und Henri fragen. Erst auf sein ausdrückliches „lad hoch“ / „plan ein“ für genau dieses Video einplanen. Entwürfe in Zernio gehen live per `PUT /posts/<id>` mit `{isDraft:false, scheduledFor}`.

> **Entwurf → live: Funnel umhängen (2026-10-21):** Wird ein Zernio-Post erst Entwurf und dann wieder veröffentlicht, stellt Zernio die angehängte Kommentar-Automation nicht automatisch auf die Instagram-Media-ID um. Nach dem Veröffentlichen prüfen (`GET /comment-automations/<id>` → `platformPostId`) und falls nötig `PATCH /comment-automations/<id>` mit `{"platformPostId": "<IG media id>"}`.

> **Standard-FP-Funnel ist `fp2` (Henri 2026-10-23, ersetzt fp/fpq für @florent_preusser):** Texte `funnel/fp2-funnel.json`. Ablauf: Willkommens-DM → weicher Follow-Check → Guide mit Teaser („in zwei Minuten schick ich dir noch was“) → Pitch mit **200 € Startguthaben in Credits** („Ja, 200 € sichern“ / „Nein, danke“) → je eine Erinnerung nach 20 h → Lead braucht **persönliche Firmenmail** (Telefon dann freiwillig) **oder** „Keine Firmenmail“ → Firma mit Website + Pflicht-Handynummer. Freemail (Gmail, GMX …) und Sammelpostfächer (info@, hello@, support@, service@ …) werden nie angenommen. Freitext-Fragen beim Pitch → Tag `frage-offen`, Florent antwortet von Hand. Nein → Hintertür: DM „Credits“ startet den Workflow „FP Funnel Credits-Keyword“ (`6adb405f88d0130814f5fabb`, einmal pro Account). `--kind fp` wird automatisch zu `fp2` (altes fp nur mit `--legacy`); `zernio-schedule.mjs`/`zernio-autofunnel.mjs` setzen fp2. Alle 28 alten FP-Posts wurden per `zernio-funnel.mjs migrate` umgestellt (Willkommens-Button zeigt auf neuen fp2-Workflow, alter Workflow bleibt für laufende Runs aktiv, `rollback <IG-ID>|--all` hängt zurück). Offline-Check: `zernio-funnel.mjs graph`. Test: Workflow „FP Funnel TEST v3“, DM `FUNNELTEST3` vom Zweitkonto. Backup alter Stand: `funnel/backup-2026-10-23/`.
> **Achtung beim Testen (gelernt 2026-10-23):** Hat ein Kontakt noch einen wartenden Lauf in irgendeinem Workflow (alte fp-Läufe warten bis 72 h am Pitch), fängt dieser Lauf jede getippte Nachricht ab, auch Test-Stichwörter wie `FUNNELTEST3` oder „Credits“. Der neue Workflow startet dann nicht, und der Kontakt bekommt Texte aus dem alten Ablauf. Zernio hat keine API, um einzelne Läufe abzubrechen. Nur ein Tipp auf einen Button mit `zernio:workflow:<id>`-Payload beendet den alten Lauf (Status `exited`). Deshalb so testen: Vom Zweitkonto unter einem aktiven FP-Reel kommentieren und in der Willkommens-DM auf „Ja, schick rüber“ tippen. Vorher mit `executions` prüfen, ob der Kontakt noch irgendwo `waiting` ist.
