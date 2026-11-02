# Swipe File — Analyzed Real-World Scripts

Real, user-provided example scripts from high-performing accounts, broken into Hook / Retain / Reward+CTA with a rationale for why each part works. This file only contains examples the user actually shared or pointed to — nothing invented or assumed.

**How this file is used:** `heygen-video-generator` checks here before writing a new script (Step 3/6 of SKILL.md) and prefers a technique validated by a real entry here over a generic formula from `hook-formulas.md`. Append new entries at the bottom; never overwrite or delete existing ones — this file is meant to accumulate over time.

**Entry format:**
```
## [Date] — [Source account/handle, or "user-provided"]

**Original script:**
[full text or transcript]

**Segmented:**
- Hook: "..."
- Retain: "..." (broken into beats if there are several)
- Reward + CTA: "..."

**Why it works:**
- [technique] — [why, tied to what it does for the viewer]
- ...

**Applicable beyond this example:** [what general pattern from this script is reusable for our own scripts, and for which kind of topic]
```

---

## 2026-09-22 — user-provided (own concept, not a competitor script)

**Original script:**
"KI ersetzt jetzt deine Sekretärin, und du bezahlst immer noch 50.000€ im Jahr für sie. Nutze dafür die KI, installiere den Skill, gib dir die Anweisung. Wenn du die Skills und die Prompt von mir hast, die ich nutze, um meine Sekretärin zu betreiben, dann kommentiere: Sekretariat."

**Segmented:**
- Hook: "KI ersetzt jetzt deine Sekretärin, und du bezahlst immer noch 50.000€ im Jahr für sie."
- Retain (How-tease): "Nutze dafür die KI, installiere den Skill, gib dir die Anweisung."
- Reward + CTA: "Wenn du die Skills und die Prompt von mir hast, die ich nutze, um meine Sekretärin zu betreiben, dann kommentiere: Sekretariat."

**Why it works:**
- Cost-Replacement Shock hook with a specific, high number (50.000€) — immediately comparable to the viewer's own cost, creates the "wait, what?" jolt in one sentence.
- The How-tease names a real mechanism in exactly 3 short imperative beats (nutze die KI / installiere den Skill / gib die Anweisung) — concrete enough to feel actionable and credible, without giving away the actual setup — which is precisely what makes the CTA's offer ("die Skills und die Prompt von mir") feel valuable rather than redundant.
- CTA uses the Trigger-Word Lead Magnet pattern: a single, on-topic, easy-to-spell word ("Sekretariat") that a comment-automation tool can match reliably, tied to a concrete, specific deliverable (not "mehr Infos", but literally "die Skills und die Prompt").

**Applicable beyond this example:** This is the canonical template for this niche now — Cost-Replacement Shock hook → 3-beat How-tease naming the real mechanism → Trigger-Word Lead Magnet CTA. Formalized in SKILL.md as "Worked example 2" and as CTA pattern B. Reuse this shape for the other task categories (email, image/video gen, tax, expenses) by swapping the cost figure, the task list, and the trigger word.

---

## 2026-09-22 — Apify-Scrape: @gptmarlon, @alan.buildz, @im_roy_lee (15 Top-Performer-Reels, voll transkribiert)

**Methodik:** Über die Apify-Integration (`apify/instagram-reel-script-extractor`) wurden je 5 "Top performing"-Reels der drei Kanäle gescraped und per Speech-to-Text + Frame-OCR voll transkribiert (Spoken Transcript, On-Screen-Text, Hook-Grenzen, CTA, Content-Format). Alle 15 Reels sind laut Tool als Outlier gegenüber dem eigenen Creator-Median geflaggt (10x–107x Median-Views). Volle Rohdaten (alle Felder, inkl. kompletter On-Screen-Text-Listen) liegen dauerhaft unter `references/raw-scrape-2026-09-22-gptmarlon-alanbuildz-imroylee.json`, falls tiefer nachgeschaut werden muss.

**Wichtige Einordnung vor den Einzel-Einträgen:** @im_roy_lee (bzw. sein Firmenaccount @cluely) postet keine Tutorial-Skripte, sondern gescriptete Office-Comedy-Skits (Cluely-Mitarbeiter-Sitcom) — kein CTA, kein Prompt-Teaching, andere Zielgruppe. Für unsere Nische (AI-Automation-Tutorials für Mittelstand) ist davon nur die reine Hook-Mechanik übertragbar (siehe unten), nicht die Gesamtstruktur. @gptmarlon und @alan.buildz dagegen sind exakt unsere Nische (Claude/ChatGPT-Automatisierung für Alltag/Business) und liefern zwei vollständige, wiederholbare Skript-Skelette — siehe die neue Datei `references/creator-script-templates.md` für die destillierten, wiederverwendbaren Vorlagen. Die Einzel-Einträge hier sind das Rohmaterial, aus dem diese Vorlagen extrahiert wurden.

### @gptmarlon — Ep. "Lebenslauf unablehnbar" (592K views, 18.3x Median)

**Original script (voll):**
"Was passiert, wenn du Claude darum bittest, deinen Lebenslauf so umzuschreiben, dass er praktisch nicht mehr abgelehnt werden kann? Ich habe das ausprobiert und innerhalb von 24 Stunden tatsächlich fünf Vorstellungsgespräche bekommen. Lade zuerst deinen Lebenslauf und die Stellenbeschreibung bei Claude hoch und gib dann folgenden Prompt ein: Agiere als Senior Recruiter für genau dieses Unternehmen. Analysiere meinen Lebenslauf im Vergleich zu der Stellenbeschreibung und gib mir eine Übereinstimmungsbewertung von 0 bis 100, die fünf wichtigsten fehlenden Keywords und die drei größten Warnsignale, die einem Hiring Manager innerhalb von weniger als 10 Sekunden auffallen würden. Sobald du das Resultat hast, gebe folgenden Prompt ein: Schreibe meinen Abschnitt über Berufserfahrung neu und integriere diese Keywords auf natürliche Weise. Entferne die Warnsignale. Verwende die Google-XYZ Formel. X erreicht gemessen an Y durch Z. Jetzt sagst du: Agiere anschließend als ATS Filter und als Hiring Manager, der 200 Lebensläufe in einer Sitzung liest. Scanne meinen neuen Lebenslauf und sag mir, welche Abschnitte übersprungen würden. Schreibe sie anschließend so um, dass sie Aufmerksamkeit wirklich fesseln. Und für den Bonus Prompt willst du jetzt zu Claude Cowork und schreibst: Jetzt da mein Lebenslauf optimiert ist, gehe auf mein LinkedIn-Profil und bewirb dich auf 10 Jobs, bei denen ich die höchste Wahrscheinlichkeit habe, zu einem Vorstellungsgespräch eingeladen zu werden. Passe jede Bewerbung individuell an die jeweilige Stellenbeschreibung an. Claude wird sich buchstäblich auf Jobs für dich bewerben, während du schläfst. Wenn du all diese Prompts und noch mehr haben möchtest, dann folg mir und schreibe Lebenslauf in die Kommentare und ich schicke dir."

**Segmented:**
- Hook (0-7s): "Was passiert, wenn du Claude darum bittest, deinen Lebenslauf so umzuschreiben, dass er praktisch nicht mehr abgelehnt werden kann?" — On-Screen: "Claude macht deinen Lebenslauf unablehnbar 🤯"
- Retain Beat 1 (Proof): "Ich habe das ausprobiert und innerhalb von 24 Stunden tatsächlich fünf Vorstellungsgespräche bekommen."
- Retain Beat 2-4 (3 nummerierte, wörtlich vorgelesene Prompts): Analyse-Prompt → Rewrite-Prompt (mit "Google-XYZ Formel" als benannter Technik) → ATS-Simulations-Prompt
- Retain Beat 5 (Bonus/Eskalation): "Und für den Bonus Prompt..." — Claude Cowork übernimmt die eigentliche Bewerbung
- Reward + CTA: "Claude wird sich buchstäblich auf Jobs für dich bewerben, während du schläfst." (Payoff-Satz) → "Wenn du all diese Prompts und noch mehr haben möchtest, dann folg mir und schreibe Lebenslauf in die Kommentare."

**Why it works:**
- Hook ist eine **Hypothetische-Frage + Ergebnis-Hook** (nicht in unserer bisherigen Formula-Bank dokumentiert — neu als "Result-Reveal Question Hook" in `hook-formulas.md` ergänzt): "Was passiert, wenn du [KI] bittest, [extrem klingende Handlung]?" gefolgt von einer knallharten, spezifischen Zahl ("fünf Vorstellungsgespräche in 24 Stunden"). Funktioniert wie Cost-Replacement Shock, aber mit Zeit/Erfolg statt Geld als Vergleichsgröße.
- Die Prompts werden **wörtlich vorgelesen**, nicht nur beschrieben — das ist der entscheidende Unterschied zu einem vagen "nutz KI dafür". Der Zuschauer kann den Prompt direkt mitschreiben/pausieren, was Rewatches und Screenshot-Shares triggert (sichtbar am extrem hohen Comment-Count von 5.633 bei nur 592K Views — ungewöhnlich hohe Engagement-Rate).
- Eskalations-Struktur: jeder Prompt baut auf dem Ergebnis des vorherigen auf (Analyse → Rewrite → Simulation → Autonomer Agent), was 4 saubere Open-Loop-Beats im Retain-Teil erzeugt, exakt im 8-15s-Rhythmus den SKILL.md fordert.
- CTA kombiniert "folg mir" UND Trigger-Word-Kommentar in einem Satz — nicht nur ein Ask wie in unserem bisherigen Pattern B-Beispiel (siehe Anpassungsvorschlag in `creator-script-templates.md`).

**Applicable beyond this example:** Das "Was passiert, wenn du [KI] bittest, [krasse Aktion]?" + "Ich hab's ausprobiert, [konkretes Zahlen-Ergebnis] in [kurzer Zeitraum]" Hook-Paar ist über alle 5 gptmarlon-Reels identisch reproduziert (siehe restliche Einträge) — es ist kein Zufallstreffer, sondern ein bewusst wiederholtes Format. Direkt übertragbar auf unsere Nische: "Was passiert, wenn du Claude bittest, deine komplette Spesenabrechnung für einen Monat zu übernehmen? Ich hab's ausprobiert und in 20 Minuten war der komplette Monat durch."

### @gptmarlon — Ep. "500 Bewerbungen automatisch" (534K views, 16.5x Median)

**Original script (voll):**
"Was passiert, wenn du Claude bittest dich auf 500 Jobs für dich zu bewerben? Ich hab's ausprobiert und 14 Interviews innerhalb von 24 Stunden bekommen. Lade einfach deinen Lebenslauf in Claude hoch und sag: Handle als Senior Recruiter. Nenn mir die 20 besten Jobtitel, die zu mir passen und die ATS Keywords zu jedem. Und jetzt wird's verrückt. Geh auf Customize, Connectors, Add Custom Connector und füg diesen Link ein. Geh dann zurück in den Chat und sag: Schreib meinen Lebenslauf in eine Designer-Mastervorlage um: klares Layout, moderne Typo, klare Hierarchie. Nutz die Google-XYZ-Formel für die Bulletpoints und streich jedes Warnsignal, das ein Personaler in 10 Sekunden sieht. Nutz Higgsfield. Und schon sieht der Lebenslauf auf einmal so aus. Aber jetzt kommt der größte Trick. Geh noch mal auf Connectors und füg den Connector Indeed hinzu. Zurück im Chat sagst du: Such über Indeed alle Jobs zu diesen Titeln aus den letzten 21 Tagen und bau eine Tabelle mit Link, Match Score und angepasst im Lebenslauf pro Job. Und dann sagst du nur noch: Bau mir für die Top-Jobs ein fertiges Paket. Lebenslauf plus Anschreiben auf die Anzeige zugeschnitten. Und zu guter Letzt der beste Teil. Aktiviere einfach Claude for Chrome und sag: Geh die Jobs nacheinander durch, öffne jede Bewerbungsseite und füll die Formulare mit meinen Daten aus. Stopp jeweils vor dem Absenden. Claude füllt dir jetzt jede Bewerbung aus und du klickst nur noch auf das Absenden. Das kannst du für Hunderte Jobs an einem Tag machen. Kommentier MCP für 100 kostenlose Higgsfield Credits und eine komplette Anleitung mit allen Prompts."

**Segmented:**
- Hook (0-5s): "Was passiert, wenn du Claude bittest dich auf 500 Jobs für dich zu bewerben? Ich hab's ausprobiert und 14 Interviews innerhalb von 24 Stunden bekommen." — On-Screen: "Claude schreibt 500 Bewerbungen für dich 😳"
- Retain Beat 1: Jobtitel + ATS-Keywords-Prompt
- Retain Beat 2 (Pivot-Satz "Und jetzt wird's verrückt"): MCP-Connector installieren (Higgsfield) → visuelles Vorher/Nachher des Lebenslaufs
- Retain Beat 3 (2. Pivot "Aber jetzt kommt der größte Trick"): Indeed-Connector → automatische Jobsuche + Match-Score-Tabelle
- Retain Beat 4: Bewerbungspaket-Generierung (Lebenslauf + Anschreiben)
- Retain Beat 5 (3. Eskalation "der beste Teil"): Claude for Chrome füllt Bewerbungsformulare automatisch aus
- Reward + CTA: "Das kannst du für Hunderte Jobs an einem Tag machen." → Trigger-Word "MCP" + expliziter Bonus (100 Credits) on top vom Standard-Lead-Magnet

**Why it works:**
- Drei benannte Pivot-Sätze hintereinander ("Und jetzt wird's verrückt" / "Aber jetzt kommt der größte Trick" / "der beste Teil") — jeder markiert einen neuen Open Loop und einen Eskalationsschritt. Das ist eine explizite Sprach-Technik, um Aufmerksamkeit alle 10-15s neu zu triggern, nicht nur eine Zufallsformulierung.
- Der Lead-Magnet-Bonus ("100 kostenlose Higgsfield Credits" zusätzlich zur Anleitung) erhöht den wahrgenommenen Wert des CTA über das Skript hinaus — eine Variante, die in unserem SKILL.md-CTA-Pattern-B noch nicht vorkommt.
- Technischer Realismus: echte Produktnamen (Higgsfield, Indeed, Claude for Chrome, Connectors-Menü) statt generischer "eine KI macht das" — exakt die "How-tease"-Regel aus SKILL.md, nur mit noch mehr Schritten/Detailtiefe, weil das Video selbst der Lead-Magnet-Teaser ist.

**Applicable beyond this example:** Die 3-Pivot-Eskalationsstruktur (Schritt → "und jetzt wird's verrückt" → nächster Schritt → "aber jetzt kommt der Trick" → nächster Schritt → "der beste Teil" → letzter Schritt) ist eine direkt wiederverwendbare Retain-Architektur für jedes mehrstufige Automatisierungs-Thema (z.B. Steuererklärung: Belege sammeln → "und jetzt wird's verrückt" → automatische Kategorisierung → "aber der eigentliche Trick" → automatischer Upload ans Finanzamt).

### @gptmarlon — Ep. "ChatGPT bewirbt sich für dich" (538K views, 16.6x Median)

**Original script (voll):**
"Was passiert, wenn du Chat GPT fragst, ob er sich für dich bei 500 Jobs bewirbt? Ich habe es versucht und damit 11 Interviews innerhalb von 24 Stunden bekommen. Lade zuerst deinen Lebenslauf auf Chat GPT hoch und sage: Agiere als Senior Recruiter. Liste anhand meines Lebenslaufs die 20 Jobtitel auf, für die ich am besten qualifiziert bin, sowie die genauen Schlüsselwörter, nach denen ATS-Systeme für jede Position suchen. Dann bleib im selben Chat und sag: Schreib meinen Lebenslauf in eine Mastervorlage um, die ich sofort anpassen kann. Nutzt die Google XYZ Formel und entfern jede Red Flag, die ein Personaler in unter 10 Sekunden sieht. Jetzt der Trick: Klick auf Plus, schalt den Agentenmodus an und sag: Geh auf LinkedIn und Indeed und finde jeden Job zu diesen Titeln aus den letzten 7 Tagen. Bau mir eine Tabelle mit Link, Match Score und einem maßgeschneiderten Lebenslauf für jeden Job. Und jetzt das krasseste: Sag: Bewirb dich auf die Top 500 Jobs, jede Bewerbung angepasst an die Anzeige. Und Chat GPT bewirbt sich für dich, während du schläfst. Für die komplette Anleitung mit allen Prompts, kommentier 'Jobs' und ich schick sie dir rüber."

**Segmented:**
- Hook (0-3s, kürzester Hook im ganzen Sample): "Was passiert, wenn du Chat GPT fragst, ob er sich für dich bei 500 Jobs bewirbt?" — sofort gefolgt vom Ergebnis-Satz, kein Umweg
- Retain Beat 1: Jobtitel/Keyword-Prompt
- Retain Beat 2: Lebenslauf-Rewrite mit Google-XYZ-Formel
- Retain Beat 3 (Pivot "Jetzt der Trick"): Agentenmodus + automatische Jobsuche über 2 Plattformen gleichzeitig
- Retain Beat 4 (2. Pivot "das Krasseste"): autonome Massenbewerbung
- Reward + CTA: "Chat GPT bewirbt sich für dich, während du schläfst." → Trigger-Word "Jobs"

**Why it works:**
- Gleiche Kern-Formel wie die beiden gptmarlon-Beispiele oben, aber mit ChatGPT statt Claude — bestätigt: das Skript-Skelett ist tool-agnostisch, nur der Werkzeugname wird getauscht. Wichtiges Signal für uns: dieselbe Struktur funktioniert wiederholt, das ist kein Einzeltreffer.
- Mit 10.461 Kommentaren bei "nur" 538K Views (höchste Kommentarrate im ganzen Sample) zeigt dieses Reel, dass ein sehr kurzer, sehr direkter Hook (3 Sekunden bis zum Ergebnis-Satz) die Trigger-Word-Mechanik besonders gut befeuert.

**Applicable beyond this example:** Bestätigt, dass unsere Formel toolagnostisch skaliert — wir können dasselbe Skelett für Claude, ChatGPT, Gemini etc. wiederverwenden, ohne die Struktur zu ändern, nur Tool- und Ergebnis-Zahl austauschen.

### @gptmarlon — Ep. "Digitale Identität löschen" (2.1M views, 65.4x Median — bestperformendes Reel im ganzen Sample)

**Original script (voll, gekürzt um reine UI-Textwiederholungen):**
"Was passiert, wenn du ChatGPT bittest, dein gesamten digitalen Fußabdruck aus dem Internet zu löschen? Ich habe das ausprobiert und es hat tatsächlich meine Identität von hunderten Webseiten gelöscht. Zuerst öffnest du ChatGPT und sagst: 'Durchsuche das Internet nach allem, was du über mich findest. Liste jeden Datenhändler und jede Personensuchmaschine auf, die meine persönlichen Daten preisgeben und gib mir den exakten Opt-out-Link für jeden einzelnen.' Bei mir fand es buchstäblich Seiten, von denen ich nie gehört hatte, mit meiner Adresse und Telefonnummer. Bleib jetzt im selben Chat und sag: 'Schreib mir die exakte Löschanfrage, die ich an jede einzelne schicke.' ChatGPT schreibt dann maßgeschneiderte Löschanfragen für jede Seite auf. Und jetzt der Trick: Du tippst auf das Plus, schaltest den Agentenmodus ein und sagst dann: 'Geh auf jede einzelne dieser Seite und reiche die Löschanfrage für mich ein.' Und jetzt öffnet ChatGPT seinen eigenen Browser und reicht die ganze Liste ein, während du einfach nur da sitzt. Und jetzt kommt das Allerbeste: Sag: 'Prüfe jetzt jede Woche jede Seite erneut und reiche jede ignorierte Freigabe erneut ein, bis alles vollständig weg ist.' ChatGPT baut dir eine geplante Aufgabe, die jede Woche läuft, bis deine Identität endgültig gelöscht ist. Wenn du alle vier dieser Prompts und mehr willst, dann like dieses Video und kommentier 'Löschen', dann schicke ich dir."

**Segmented:**
- Hook (0-4s): "Was passiert, wenn du ChatGPT bittest, dein gesamten digitalen Fußabdruck aus dem Internet zu löschen?" — On-Screen: "ChatGPT hat meine digitale Identität gelöscht 🤯"
- Retain Beat 1 (Proof + persönliche Betroffenheit): "Bei mir fand es buchstäblich Seiten, von denen ich nie gehört hatte, mit meiner Adresse und Telefonnummer." — macht die Angst konkret statt abstrakt
- Retain Beat 2: Maßgeschneiderte Löschanfragen generieren
- Retain Beat 3 (Pivot "und jetzt der Trick"): Agentenmodus reicht Anfragen selbstständig ein — visuell belegt mit Live-Zähler "303 Seiten gelöscht / 327"
- Retain Beat 4 (2. Pivot "das Allerbeste"): wöchentliche Wiederholungs-Aufgabe (Scheduled Task) — macht aus einer Einmalaktion ein dauerhaftes System
- Reward + CTA: Trigger-Word "Löschen" + Like-Ask, gekoppelt an "4 Prompts"

**Why it works — warum DAS bestperformende Reel im Sample:**
- Emotionaler Trigger ist nicht Geld/Zeit wie sonst üblich, sondern **Angst/Kontrollverlust** (persönliche Daten im Netz) — eine dritte Trigger-Kategorie neben Cost-Replacement Shock, die wir bisher nicht dokumentiert hatten. Betrifft jeden Zuschauer direkt und persönlich, nicht nur Business-Entscheider — das erklärt vermutlich den überproportionalen Erfolg (65x Median vs. 15-18x bei den Bewerbungs-Videos desselben Creators).
- Der Live-Zähler ("303/327 gelöscht") auf dem Bildschirm ist ein visueller Fortschrittsbeweis, der während des Zuschauens mitläuft — starke Sound-off-Tauglichkeit (Prinzip aus SKILL.md Retain-Regeln).
- Die "geplante wöchentliche Aufgabe" am Ende verwandelt eine einmalige Aktion in ein dauerhaftes, sich selbst wartendes System — das ist ein eigener, starker Reward-Typ ("es kümmert sich für immer darum", nicht nur "es hat einmal geholfen").

**Applicable beyond this example:** Ergänzt unsere Trigger-Palette um "Angst/Kontrollverlust" als dritte valide Emotionsachse neben Kosten und Zeit — relevant z.B. für Themen wie Datenschutz, DSGVO-Compliance, oder "was passiert mit meinen Firmendaten, wenn ein Mitarbeiter kündigt". Die "läuft jede Woche automatisch weiter"-Eskalation ist ein starker, bisher ungenutzter Reward-Baustein für jedes Thema mit wiederkehrendem statt einmaligem Nutzen (z.B. Rechnungsprüfung, die jede Woche automatisch weiterläuft).

### @gptmarlon — Ep. "Claude Text-Humanizer" (483K views, 15x Median)

**Original script (voll):**
"Was passiert, wenn du Claude bittest deinen Text so zu vermenschlichen, sodass er wirklich jeden KI-Detektor besteht? Ich habe das ausprobiert und die Ergebnisse kamen tatsächlich als unter ein Prozent KI generiert zurück. Zuerst gehst du zu Claude und sagst: „Ich möchte, dass du ab jetzt all meinen Text vermenschlichst, damit er nicht mehr nach KI klingt.“ Dann gehst du auf Wikipedia und suchst die Seite mit den Anzeichen von KI generierten Schreibstil und listest jedes einzelne Muster auf, das KI generierten Text verrät. Und dann achtest du darauf, niemals eines dieser Dinge zu tun. Claude hört dann auf jedes offensichtliche Anzeichen wie Gedankenstriche, Füllwörter und diesen roboterhaften Ton zu benutzen. Und jetzt kommt der Trick. Bleib im selben Chat, tippe einen Slash, wähle dann Skill Creator und sag: „Bau mir einen persönlichen Humanizer Skill, basierend auf allem, was wir gerade gefunden haben, damit ich das nie wieder erklären muss.“ Claude baut dir dann deinen eigenen individuellen Humanizer Skill. Installier ihn einfach und bevor du irgendetwas schreibst, tippst du auf Slash, Human oder Mensch und Claude schreibt Text, der jedes einzelne Mal als null Prozent KI generiert erkannt wird. Wenn du also eine vollständige Schritt-für-Schritt-Anleitung willst, wie du das genau einrichtest, dann like dieses Video und kommentier Mensch, dann schicke ich sie dir rüber."

**Segmented:**
- Hook (0-4s): "Was passiert, wenn du Claude bittest deinen Text so zu vermenschlichen, sodass er wirklich jeden KI-Detektor besteht?"
- Retain Beat 1: Basis-Anweisung + Wikipedia als "Quelle der Wahrheit" für KI-Textmuster referenzieren
- Retain Beat 2 (Pivot "und jetzt kommt der Trick"): Slash-Command → Skill Creator baut einen **wiederverwendbaren, persönlichen Skill** aus dem vorherigen Chat
- Reward + CTA: "Text, der jedes einzelne Mal als null Prozent KI generiert erkannt wird" (0% als runder, extremer Beweis-Wert) → Trigger-Word "Mensch"

**Why it works:**
- Die eigentliche Pointe ist nicht der erste Prompt, sondern der **Meta-Trick**: aus einem einmaligen Gespräch einen dauerhaften, wiederverwendbaren Skill zu bauen ("damit ich das nie wieder erklären muss") — das ist strukturell identisch mit unserer eigenen "Skill"-Architektur (siehe `ai-tool-stack-playbook.md`, Secretary-Abschnitt: "Skill-Layer" oben auf Connector/Zugriff). Bestätigt, dass "wir bauen einen dauerhaften Skill statt eines Einmal-Prompts" ein starkes, glaubwürdiges Retain/Reward-Element ist.
- On-Screen-Beweis (KI-Detektor zeigt sinkende Prozentwerte: 0,3% → 0,1% → 0,4%) liefert denselben Live-Fortschritts-Effekt wie der Lösch-Zähler im vorherigen Beispiel — ein wiederkehrendes Erfolgsmuster bei diesem Creator: **zeig einen Zähler/Score, der sich während des Videos sichtbar verbessert.**

**Applicable beyond this example:** "Wir bauen daraus einen Skill, damit du es nie wieder erklären musst" ist ein direkt wiederverwendbarer Retain/Reward-Baustein für jedes unserer Themen (Spesen, Steuererklärung, E-Mail) — passt exakt zu unserer eigenen Skill-Architektur und sollte in Zukunft aktiv als Beat eingebaut werden, nicht nur als Werkzeug-Detail erwähnt.

### @alan.buildz — Ep. "Loops statt Prompten" (191K views, 10.4x Median)

**Original script (voll):**
"Der Typ, der bei Anthropic Claude Code leitet, hat gerade gesagt, dass er Claude eigentlich gar nicht mehr promptet, sondern dass sein Job nur noch mehr darin besteht, Loops zu schreiben. Lass mich dir also kurz erklären, was Loops sind und wie du sie bauen kannst. Loops lösen eines der größten Probleme in der Welt von KI, nämlich das ewige Prompte. So wie du gerade wahrscheinlich mit KI arbeitest, ist so: Du gibst einen Prompt, kriegst ein Output, gibst dein Feedback und das Ganze wiederholt sich, also ein ewiges hin und her. Ein Loop hingegen ist völlig anders. Ein Loop ist nämlich ein System, das den Agenten für dich promptet. Du musst Claude also nur noch mehr einmal sagen, was er machen soll und Claude legt los, bewertet sich anhand einer Checkliste, bessert alle Schwachstellen aus und wiederholt das anschließend so lange, bis der Output nicht mehr besser werden kann. Solch ein Loop entsteht jedoch nicht einfach so, denn er besteht aus fünf Teilen. Du hast Automatisierung, damit Claude von alleine läuft und nicht erst dann, wenn du es ihm sagst. Worktrees, die dafür sorgen, dass wenn zwei Agenten gleichzeitig arbeiten, sie nicht kollidieren. Skills, damit Claude aufhört, dich bei jedem einzelnen Mal aufzufordern, dein Projekt neu zu erklären. Konnektoren, damit Claude auch wirklich etwas mit deinen Applikationen machen kann und nicht nur im Read-Only festsitzt. Und zuletzt Subagents, damit der, der den Code schreibt, nicht derselbe ist, wie der, der ihn überprüft und benotet. Sind dann einmal alle fünf Teile richtig aufgesetzt, schaffst du Arbeit, die normalerweise Tage dauern würde, in Stunden. Also, wenn du jetzt den kompletten Setup Guide haben willst, dann kommentier einfach 'Loop', mach sicher, dass du folgst und ich schick's dir auf jeden Fall zu."

**Segmented:**
- Hook (0-7s): "Der Typ, der bei Anthropic Claude Code leitet, hat gerade gesagt, dass er Claude eigentlich gar nicht mehr promptet..." — Autoritäts-Hook (Bezug auf eine echte, hochrangige Aussage statt eigener Behauptung)
- Retain Beat 1 (Problem benennen): das übliche Prompt-Output-Feedback-Hin-und-Her als Status quo beschreiben, den der Zuschauer sofort wiedererkennt
- Retain Beat 2 (Reframe): "Ein Loop ist ein System, das den Agenten für dich promptet" — eine Zeile, die das ganze Konzept in einem Satz umdreht
- Retain Beat 3 (Listicle-Struktur): 5 benannte Bestandteile (Automatisierung, Worktrees, Skills, Konnektoren, Subagents), jeder in einem kurzen Satz mit seinem konkreten Zweck
- Reward + CTA: "Arbeit, die normalerweise Tage dauern würde, in Stunden" (Zeit-Kompression als Payoff) → Trigger-Word "Loop" + Follow-Ask im selben Satz

**Why it works:**
- **Autoritäts-Hook statt Eigenbehauptung**: Der Creator beruft sich auf eine reale, verifizierbare Aussage einer bekannten Person ("der Typ, der bei Anthropic Claude Code leitet") statt selbst die Behauptung aufzustellen — erhöht Glaubwürdigkeit sofort, weil der Zuschauer es potenziell nachprüfen kann. Ein Hook-Typ, der in unserer bisherigen Formula-Bank fehlt (siehe Ergänzung "Authority-Borrow Hook" in `hook-formulas.md`).
- Die 5-Teile-Liste funktioniert wie ein Listicle-Hook (siehe SKILL.md), aber mitten im Skript statt am Anfang — sie gibt dem Retain-Teil eine klare Zähl-Struktur, die auch Sound-off funktioniert (Bildschirm zeigt "1 LOOP = 5 TEILE").
- Fachbegriffe werden nicht erklärt, sondern nur "geteased" (Worktrees, Subagents) — genau die SKILL.md-Regel "real genug, um glaubwürdig zu klingen, nicht vollständiger Tutorial" — der volle Lehrinhalt ist im DM-Lead-Magnet, nicht im Video.

**Applicable beyond this example:** Der Autoritäts-Hook ("Person X bei Firma Y hat gesagt...") ist eine neue, direkt einsetzbare Hook-Variante für unsere Nische, sobald es eine zitierbare, reale Aussage gibt (z.B. von einer Anthropic-Führungskraft, einer Studie, einer Zahl aus einer echten Quelle). Erhöht Glaubwürdigkeit ohne eigene Kostenbehauptung.

### @alan.buildz — Ep. "Claude als Sprachlehrer" (257K views, 14x Median)

**Original script (voll):**
"Claude hat Duolingo ersetzt und lehrt ihr jetzt Sprachen wie ein Sprachlehrer, der ich normalerweise mehrere 100 € kosten würde und es ist nicht mal schwer aufzusetzen. In den nächsten drei Sekunden zeige ich dir, wie du deinen Sprachtrainer ganz einfach aufsetzt und am Ende gibt's alle Prompts komplett kostenlos, also mach schon mal gerne das Plus weg, wenn du immer up-to-date sein willst in der Welt von KI. Um Claude zu deinem Sprachlehrer zu machen, brauchst du erstmal die richtigen Einstellungen. Deswegen geh auf Claude, erstelle ein neues Projekt, nenn es wie du willst und paste diesen Prompt unter Anweisung. Dadurch speichert Claude nämlich deinen Fortschritt, passt sich an dich als Individuum an, wodurch du nach einigen Sessions schon erste Ergebnisse siehst. Kommen wir jetzt zu den sechs Modi, die du freischalten kannst mit den jeweiligen Prompts. Nummer 1 Coach [...] Nummer 2 Alltagsdrill [...] Nummer 3 Wording Check [...] Nummer 4 Vokabeldrop [...] Nummer 5 der Stielspiegel [...] Und der letzte Prompt ist der Notfall Prompt [...]. Wenn du jetzt die Anweisung aus dem Anfang des Videos und die Prompts von gerade eben haben willst, dann kommentiere Sprache. Mach sicher, dass du folgst und ich schick's dir dann zu."

**Segmented:**
- Hook (0-6s): "Claude hat Duolingo ersetzt..." — **Produkt-Verdrängungs-Hook**: nennt eine bekannte, etablierte Marke (Duolingo) und behauptet direkte Ablösung, plus einen Kostenvergleich ("mehrere 100€") — Mischform aus Cost-Replacement Shock und Controversial Hook
- Retain Beat 1 (Meta-Ansage): "In den nächsten drei Sekunden zeige ich dir..." + Follow-Ask schon früh im Video eingebaut (nicht nur am Ende)
- Retain Beat 2 (Setup): Claude-Projekt anlegen + Anweisungs-Prompt einfügen
- Retain Beat 3 (Listicle, 6 nummerierte Modi): jeder Modus in 1-2 Sätzen mit konkretem Nutzen benannt
- Reward + CTA: Trigger-Word "Sprache" + Follow-Ask

**Why it works:**
- **Produkt-Verdrängungs-Hook** (bekannte Marke wird namentlich "ersetzt") ist aggressiver und konkreter als unser bisheriger "Transformation Hook" (der abstrakt "von teuer zu X" sagt) — hier wird ein tatsächliches, dem Zuschauer bekanntes Produkt benannt, was die Vorstellungskraft sofort ausfüllt ("ich kenne Duolingo, also verstehe ich sofort was ersetzt wird").
- Der frühe, beiläufige Follow-Ask ("mach schon mal gerne das Plus weg") mitten im Hook/frühen Retain-Bereich statt nur am Ende ist eine Technik, die wir noch nicht in SKILL.md dokumentiert haben — verteilt den Ask auf zwei Momente im Video, statt ihn nur am Schluss zu bündeln.
- 6-Punkte-Struktur ist fast identisch mit Loop-Video (5 Punkte) — bestätigt: **nummerierte Sub-Listen mit einem Wort/kurzer Phrase als Label** ("Coach", "Alltagsdrill", "Wording Check"...) sind ein wiederkehrendes strukturelles Element bei diesem Creator, nicht Zufall.

**Applicable beyond this example:** Produkt-Verdrängungs-Hook ist stark für Themen, bei denen ein bekanntes, kostenpflichtiges Tool direkt durch KI ersetzt wird (z.B. "Claude hat meinen Steuerberater-Vergleichsrechner ersetzt", "Claude hat DATEV für die Spesenprüfung ersetzt" — nur wenn technisch akkurat, siehe `ai-tool-stack-playbook.md`-Regel zur Genauigkeit).

### @alan.buildz — Ep. "6 Frontend-Skills für Claude" (109K views, 5.9x Median)

**Original script (voll):**
"Claude, das war extrem gut im Coden, aber am Frontend Design, das ist einfach nur meh. Deswegen sind hier die sechs Skills, die dieses Problem lösen und mit jeder Nummer werden sie mächtiger. Nummer 1 ist Impeccable [...]. Nummer 2 ist der Skill Taste [...]. Skill Nummer 3 ist Awesome Design [...]. Nummer 4 ist Skill UI [...]. Skill Nummer 5 ist 21st Dev MCP [...]. Und zuletzt auf Nummer 6 ist UI UX Pro Max [...]. Und wenn du jetzt die komplette Liste aller Skills haben willst, dann kommentier einfach Skills, mach sich, dass du folgst und ich schick's dir auf jeden Fall zu."

**Segmented:**
- Hook (0-3s, kürzester Hook bei alan.buildz): "Claude, das war extrem gut im Coden, aber am Frontend Design, das ist einfach nur meh." — **Self-Critique / Admitted-Weakness Hook**: das Tool wird nicht nur gelobt, sondern zuerst ehrlich kritisiert
- Retain (reine Listicle-Struktur, 6 Punkte "und mit jeder Nummer werden sie mächtiger" als explizites Eskalations-Versprechen): jeder Skill in 2-3 Sätzen mit Funktion + einem sichtbaren Beispiel/Ergebnis
- Reward + CTA: "GANZE LISTE PER DM" (On-Screen) → Kommentar-Trigger "Skills" + Follow

**Why it works:**
- Der **Self-Critique-Hook** ist psychologisch stark, weil er unerwartet ist: Der Zuschauer erwartet Werbung/Lob für das Tool, bekommt aber zuerst ehrliche Kritik — das baut sofort Vertrauen auf ("der verkauft mir nicht blind was, der ist ehrlich") und macht die anschließende Lösung glaubwürdiger. Passt zu unserer "Controversial/Contrarian"-Kategorie, ist aber spezifisch genug für eine eigene Unterkategorie.
- Explizites Eskalations-Versprechen ("mit jeder Nummer werden sie mächtiger") gibt dem Zuschauer einen Grund, bis zum Ende zu bleiben statt nach Punkt 2 abzuspringen — eine Technik, die unser SKILL.md Retain-Kapitel unter "Open Loops" nur implizit behandelt; hier wird es explizit ausgesprochen.
- Reale Marken-/Tool-Namen (Impeccable, Taste, Awesome Design, 21st.dev MCP) mit konkreten Zahlen ("über 70 Design-Systeme von Airbnb, Apple, Nike") — Höchstmaß an Spezifität, keine einzige vage Aussage im ganzen Skript.

**Applicable beyond this example:** Self-Critique-Hook + explizites Eskalationsversprechen ("jeder Punkt wird stärker als der vorherige") ist eine starke Kombination für jedes Listicle-Thema in unserer Nische (z.B. "5 Dinge, bei denen Claude in der Buchhaltung noch schwach ist — und die Skills, die das fixen").

### @alan.buildz — Ep. "Eigener Jarvis in einem Wochenende" (772K views, 42x Median — zweitbestes Reel im Sample)

**Original script (voll):**
"So baust du dir dein eigenen Jarvis an einem Wochenende in nur neuen einfachen Schritten. Schritt eins, gib ihn ein Zuhause. [...] Schritt zwei, installiere ein Agent Framework. Ich persönlich nutze dafür Hermes Agent [...]. Schritt drei, wähle ein Modell. Das kann Claude, Codex oder Gemini sein, du bist an keins gebunden. Schritt vier, bring ihm bei, wer du bist [...]. Schritt fünf, gib ihm ein dauerhaftes Gedächtnis. [...] Schritt sechs, füg Skills hinzu [...]. Schritt sieben, verbinde ihn mit Tools [...]. Schritt acht, verbinde ihn mit Kommunikationskanälen wie Telegram, Slack oder iMessage. Dabei kannst du auch Hermes Voice nutzen [...] damit du [...] die britische Voice bekommst wie im Film. Und Schritt neun [...] gehst du jetzt zu Claude Design, erstellst dir eine Jarvis Oberfläche [...]. Bis Sonntagabend hast du also einen Jarvis, der dein Business kennt, deine Tools nutzt und dir sogar antwortet. Also, wenn du jetzt das komplette Wochenend Setup haben willst mit den Schritt für Schritt Guide, dann kommentier einfach Jarvis, mach sicher, dass du folgst und ich schick's dir auf jeden Fall zu."

**Segmented:**
- Hook (0-4s): "So baust du dir dein eigenen Jarvis an einem Wochenende in nur neuen einfachen Schritten." — **How-To-Zahlen-Hook**: konkrete Zeitgrenze (ein Wochenende) + konkrete Schrittzahl im selben Satz, plus Popkultur-Referenz (Jarvis aus Iron Man) als sofort verständliches Zielbild
- Retain (9 nummerierte, wörtlich durchgezählte Schritte "Schritt eins... Schritt neun"): jeder Schritt 1 Satz, konkretes Tool benannt
- Reward + CTA: "Bis Sonntagabend hast du also einen Jarvis, der dein Business kennt, deine Tools nutzt und dir sogar antwortet." (Payoff fasst alle 9 Schritte in einem Satz zusammen) → Trigger-Word "Jarvis" + Follow

**Why it works — zweitbestes Reel im Sample:**
- **Popkultur-Zielbild statt abstraktem Konzept**: "Jarvis" (bekannt aus Iron Man) ist ein sofort verständliches, emotional aufgeladenes Bild für "persönlicher KI-Assistent, der alles kennt und kann" — deutlich stärker als ein Fachbegriff wie "AI Agent Framework". Diese Technik (bekanntes Popkultur-Konzept als Ziel-Metapher) ist neu für unsere Formula-Bank.
- Konkrete Deadline ("bis Sonntagabend") macht das Zeitversprechen greifbar und nachprüfbar statt vage ("schnell", "einfach").
- 9 durchgezählte Schritte mit je einem Tool-Namen sind eine extrem hohe Informationsdichte (wordsPerMinute 220) — funktioniert nur, weil jeder Schritt maximal 1 Satz lang ist und der Zuschauer weiß, dass die komplette Tiefe im DM-Lead-Magnet nachgeliefert wird (siehe SKILL.md How-Tease-Regel).

**Applicable beyond this example:** Popkultur-Zielbild + konkrete Wochenend-Deadline ist eine sehr starke Kombination, direkt übertragbar: "Bau dir bis Sonntagabend deinen eigenen Jarvis fürs Backoffice — der deine Rechnungen kennt, deine Mails beantwortet und deine Buchhaltung macht."

### @alan.buildz — Ep. "Eigene Fitness-App mit Claude" (87K views, 4.7x Median — schwächstes, aber strukturell vollständigstes Reel)

**Original script (voll):**
"Claude hat gerade Fitness Apps ersetzt und betreut jetzt deine Fitness Journey besser als es jede App tun könnte in nur drei einfachen Schritten. Lass mich dir zeigen, wie es geht. Schritt 1: Lege ein neues Projekt in Claude an [...]. Schritt 2: Durchlaufe das Interview. [...] Schritt 3 [...] schreibst du: Bau mir meinen Tracker. Und zack, da ist deine persönliche App [...]. Ab dem Moment kannst du also jede Mahlzeit einfach mit einem Foto tracken [...]. Also, wenn du keinen Bock mehr hast, einen unnötigen Tracker zu bezahlen oder einfach noch mehr den Setup plus die Prompts aus dem Video haben willst, dann kommentier einfach Coach, mach dich, dass du folgst und ich schick's dir auf jeden Fall zu."

**Caption (separates, aber koordiniertes Copywriting — wichtig, siehe `creator-script-templates.md`):**
"Die meisten realisieren gar nicht, dass Claude dir heute deine eigene Fitness-App baut, die dich besser betreut als jede App. Du hast es selbst gespürt: Du zahlst jeden Monat für einen Tracker, den du gar nicht brauchst. Der Punkt, den fast alle übersehen: Es fehlt nicht an der nächsten App, sondern an einem Tracker, der auf dich zugeschnitten ist. [...] Aber der Fehler, den fast alle machen: den Anweisungsblock, den Claude dir gibt, in den Chat posten statt in die Projektanweisungen. [...] Den Teil hat gerade noch fast niemand auf dem Schirm."

**Segmented:**
- Hook (0-6s): Produkt-Verdrängungs-Hook (wie Duolingo-Beispiel), diesmal "Fitness Apps" als Kategorie statt einer einzelnen Marke
- Retain (3 knappe Schritte, niedrigste Schrittzahl im Sample): Projekt anlegen → Interview durchlaufen (Claude stellt selbst Fragen statt Nutzer zu instruieren) → Tracker bauen lassen
- Reward + CTA: "-10 KG IN 4 WOCHEN" als On-Screen-Ergebnisbeweis + doppelter Trigger ("keinen Bock mehr, einen unnötigen Tracker zu bezahlen" ODER "Setup+Prompts wollen" — zwei Motivationen für denselben CTA)

**Why it works trotz niedrigster Performance im Sample:**
- Trotz schwächster Performance (4.7x statt 10-107x bei den anderen) ist dieses Reel strukturell am saubersten dokumentiert, weil die **Caption selbst die komplette Copywriting-Formel offenlegt**: Problem-Awareness ("die meisten realisieren nicht...") → Empathie ("du hast es selbst gespürt...") → Reframe ("der Punkt, den fast alle übersehen...") → häufiger Fehler benennen ("der Fehler, den fast alle machen...") → Exklusivität ("den Teil hat gerade noch fast niemand auf dem Schirm"). Diese 5-teilige Formel taucht in identischer Reihenfolge in JEDER alan.buildz-Caption in diesem Sample auf (Jarvis-Video hat dieselbe Struktur) — das ist kein Zufall, sondern ein Text-Template, das der Creator für jedes Video wiederverwendet. Vollständig destilliert in `creator-script-templates.md`, Template B.
- Das "Interview statt Anweisung"-Prinzip (Claude stellt dem Nutzer Fragen, statt dass der Nutzer alles vorgeben muss) senkt die wahrgenommene Einstiegshürde stark — relevant für Zielgruppen, die selbst nicht genau wissen, was sie wollen/brauchen.
- Zwei-Wege-CTA ("keinen Bock mehr auf X" ODER "willst du Y") spricht sowohl Schmerz-vermeidende als auch Nutzen-suchende Zuschauer in einem Satz an.

**Applicable beyond this example:** Die Caption-Formel (Problem-Awareness → Empathie → Reframe → häufiger Fehler → Exklusivität → Lead-Magnet-Begründung → Trigger-Word+Follow-CTA) ist unabhängig von der Hook-Qualität des gesprochenen Skripts extrem robust und sollte künftig **immer** für unsere Post-Captions verwendet werden, nicht nur für das gesprochene Skript — siehe `creator-script-templates.md`, Template B, für die volle Vorlage.

### @im_roy_lee / @cluely — 4 Office-Comedy-Skits (8.3M–20.8M views, 43x–107x Median) — anderes Genre, nur Hook-Mechanik relevant

**Kurz-Einordnung (kein volles Segmenting, da Genre nicht unsere Nische ist):** Alle 4 Reels sind gescriptete Sitcom-Skits über die fiktive Firma "Cluely" (POV: Kollege XY) ohne jeglichen CTA, ohne Prompt-Teaching, mit professionellen Schauspielern/Regie (@remyzeee). Extrem hohe Views (bis 20.8M) zeigen aber, dass die reine Hook-Mechanik hochgradig übertragbar ist, auch wenn die restliche Struktur es nicht ist:

- **On-Screen-Text als sofortiger Szenen-Rahmen**: Jedes Video startet mit einem "POV: [absurde/spezifische Situation]"-Text, BEVOR der gesprochene Hook überhaupt einsetzt — der Zuschauer weiß in Bruchteilen einer Sekunde, welche Szene er sieht, ohne auf Sprache angewiesen zu sein. Direkt übertragbar auf unsere Tutorial-Reels: der On-Screen-Hook-Text sollte nicht nur den gesprochenen Hook wiederholen, sondern als eigenständiger, noch schnellerer visueller Anker funktionieren (z.B. "POV: Deine Buchhaltung macht sich von selbst" gleichzeitig mit, nicht nach dem gesprochenen Hook).
- **Bold-Claim- und Story-Open-Hooks mit sofortigem, sehr spezifischem Szenen-Detail** (z.B. "welcher Wochentag war der 29. Februar 1972, Brandon?" statt "Brandon ist schlau") — Spezifität schlägt Abstraktion auch im Comedy-Kontext, bestätigt dieselbe Regel wie in SKILL.md Retain-Kapitel.
- **Kein CTA nötig, wenn das Ziel reine Reichweite/Marke ist** — bestätigt indirekt, dass unser CTA-fokussierter Ansatz (Trigger-Word/DM) eine bewusste Entscheidung für Lead-Generierung ist, nicht der einzig mögliche Weg; für reine Brand-Awareness-Inhalte (falls wir das je brauchen) wäre CTA-Verzicht+maximale Unterhaltung die validierte Alternative.

**Applicable beyond this example:** On-Screen-Text als eigenständiger, gleichzeitiger (nicht nachgelagerter) visueller Hook-Anker — diese eine Technik ist die einzige direkt übertragbare Erkenntnis aus diesen 4 Reels und sollte in `heygen-script-optimizer` (die Delivery-Layer-Skill) als Hinweis für die On-Screen-Caption-Platzierung im allerersten Frame ergänzt werden.

---

*Add further entries below this line following the format above.*


## 2026-10-03 — user-provided: 5 posts about hooks and retention (Apify + local whisper, files in `broll/research/2026-10-03-hook-reels/`)

| Post | Plays / comments | What it teaches |
|---|---|---|
| @kallawaymarketing carousel Dd7iE_HjrF0 "ultimate guide for text hooks" | 971 likes, 772 comments (CTA "text") | Text hook = subject + pain reminder / dream outcome / future state change. Specific numbers, power words, no transition words, no punctuation except () and "". Design: readable system-like font, 1/3 down, never over eyes/mouth, max 2 lines, break at the phrase. |
| @pic_josh Dbqk4TgsciL "Hook Formel" (DE, 55 s) | 47k plays, 70 comments | Spoken hook = problem, text hook = solution. Don't hold the solution back. Edit: cut every ~3 s, real-object B-Roll (post-its on black), retention-graph overlays, mixed bold sans + serif italic keywords (like our Vision captions), a mid re-hook title "POV du verstehst endlich Hooks" at ~22 s, the opening title returns at the end (loop). |
| @jun_yuh DSZDeEwDe0d retention-graph diagnosis (EN, 28 s) | 1.09M plays, 24k likes | One static wide shot, zero cuts: the visual change is a retention-graph card that swaps every ~4 s plus a 2-4-word note. Pattern "This means X. So do Y." Rules stated: outcome before explanation; weave the CTA into the last point; re-hook (question or scene change) inside the first 10 s; repeat what works. Last line = joke + CTA ("your video flopped. So follow Jun Yu"). Caption "rewatch until you understand" invites loops. |
| @rico.incarnati DP2LLFdDalA "5 talking-head hooks" (EN, 75 s) | 159k plays, 3.9k comments | Intro graphic shows five numbered badges = the whole journey, then a yellow numbered label per section; PiP example clips with their view counts (social proof); flash transitions between sections. CTA "comment HOOK for 100 proven hooks PDF"; the caption repeats the full list (save value). |
| @jeffreylouiis DU6W-OpiMQz "10 Hooks die immer funktionieren" (DE, 15 s) | 70k plays, 6 comments | Persistent title on top for the whole video (late joiners get context), each hook as a one-liner, fingers count along; ultra short and save-worthy. Few comments because there's no CTA. |
