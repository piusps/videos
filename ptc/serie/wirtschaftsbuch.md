# Wirtschaftsbuch – „Ein Superkind-Agent baut eine Firma"

Fiktives Experiment (so in der Bio gekennzeichnet). Alle Zahlen stehen **vor** dem Posten fest.
Daten für den Code: `broll/src/compositions/superkindEconomy.ts` (SHOP + EPISODES). Neue Folgen immer zuerst dort eintragen.

## 1. Was der Zuschauer sieht
- **Kasse im HUD (immer sichtbar):** „KASSE 0 €" + Balken zum **nächsten Upgrade** („→ Domain + Logo · 15 €").
  Ein Balken bis 1 Mio wäre am Anfang unsichtbar; der Balken zum nächsten Kauf bewegt sich jede Folge.
- **Hook:** Bei „Bis zur Million" rollt die Kasse bis 1.000.000 € hoch (Ziel), bei „Tag eins" stürzt sie zurück auf 0 €.
- **Shop-Tafel** („WAS WIR KAUFEN KÖNNEN"): alle Upgrades mit Preis; gekauft = Haken, leistbar = orange, zu teuer = Schloss.
- **Optionen zeigen Potenzial + Risiko** (z. B. „€€€ · RISIKO HOCH"), auch auf dem Abstimm-Board. So ist die Wahl eine echte Wette, keine Geschmacksfrage.
- **Ab Tag 2, im Recap-Teil:** großes „+620 €" fliegt in die Kasse → Kasse zählt hoch → Shop-Tafel: neue Haken → das Gekaufte erscheint sichtbar in der Welt (Schild, Server, zweiter Bot, Etage …). Bei Rückschlag: rotes „−X €", Kasse zählt runter, ein Teil verschwindet/geht kaputt.
- **Das Gebäude ist der Fortschrittsbalken der Serie:** jede Etage = ein gekauftes Upgrade. Bei Tag 100 deckt es sich mit dem leuchtenden Umriss aus dem Hook.

## 2. Shop (Reihenfolge = Kaufreihenfolge)
| Upgrade | Preis | Sichtbar in der Welt |
|---|---|---|
| Domain + Logo | 15 € | Schild am Grundstück |
| Werbe-Test | 100 € | Plakatwand leuchtet |
| Eigener Server | 400 € | Server-Rack neben dem Tisch |
| 2. Agent | 1.000 € | zweiter großer Bot |
| 1. Etage | 2.500 € | erstes Stockwerk |
| Studio | 5.000 € | Studio-Insel |
| Ads-Maschine | 10.000 € | Werbe-Zeppelin |
| 10 Agenten | 25.000 € | Etage 2 |
| 2. Produkt | 50.000 € | neue Insel |
| Etagen 3–6 | 150.000 € | Turm wächst |
| Firmenturm | 1.000.000 € | Ziel |

Gekauft wird automatisch, sobald die Kasse reicht – oder der Zuschauer entscheidet, *was* gekauft wird (gute Abstimmungsfrage für ruhige Folgen).

## 3. Phasen
**Phase 1 – Anlauf (Abstimmungen von Tag 1 bis Tag 4, sichtbar in Tag 2–5):** Jede Option funktioniert. Unterschied nur in Höhe und Art des Wachstums („gut" vs. „Volltreffer"). Wer abstimmt, wird belohnt → die Leute kommen wieder.
Die Spannung kommt in dieser Phase aus dem Mail-/Rivalen-Faden, nicht aus Verlusten.

**Phase 2 – normaler Zyklus (ab Abstimmung Tag 5):**
- Ergebnis-Typen: **Volltreffer** (+80–150 % der Kasse), **gut** (+30–60 %), **solide** (+5–20 %), **Rückschlag** (−15–35 %, nie unter 0 €).
- Pro 5 Folgen: mindestens 1 Rückschlag, höchstens 2. **Nie zwei Rückschläge hintereinander.**
- Die wirtschaftlich klügere Option gewinnt in ~70 % der Fälle, damit Diskussionen in den Kommentaren Sinn ergeben.
- Tipps vom Absender/Rivalen stimmen ~50 % – man darf ihm nie ganz trauen.
- Ziel-Kurve (grob): Tag 5 ≈ 1–3 k €, Tag 10 ≈ 8 k, Tag 30 ≈ 60 k, Tag 60 ≈ 300 k, Tag 100 = 1 Mio (knapp, mit Endspurt).
- Liegt die Kasse >25 % unter der Kurve: nächstes Ergebnis mind. „gut". Liegt sie >25 % darüber: nächstes Ergebnis höchstens „solide" oder Rückschlag.

**Versiegelt:** Beide Ergebnisse jeder Abstimmung werden vor dem Posten in `superkindEconomy.ts` eingetragen und nicht mehr geändert. Folge N+1 rechnet nur nach, was dort steht.

## 4. Vorab festgelegte Ergebnisse – Phase 1
Alle Zahlen klein und plausibel (keine erfundenen Großumsätze).

| Abstimmung | Option | Ergebnis (gezeigt in Folge N+1) | Kasse danach | Gekauft |
|---|---|---|---|---|
| **Tag 1** | A KI-Influencerin (€€€ · Risiko hoch) | Volltreffer: erste Marke zahlt 400 € für einen Post, +220 € Affiliate = **+620 €** | 620 € | Domain, Werbe-Test, Server (Rest 105 €) |
| | B YouTube ohne Gesicht (€€ · Risiko niedrig) | gut: Affiliate in 3 Videos + Mini-Sponsor 250 € = **+380 €** | 380 € | Domain, Werbe-Test (Rest 265 €) |
| **Tag 2** „Wohin mit dem Gewinn?" | A Werbung schalten (€€€) | gut: Reichweite ×4, **+900 €** | ≈1,0–1,3 k | 2. Agent (falls Kasse reicht) |
| | B 2. Agent einstellen (€€) | gut: doppelter Output, **+700 €** | ≈0,9–1,2 k | 2. Agent sofort |
| **Tag 3** „Wie verdienen wir mehr?" | A Eigenes Produkt für 29 € (€€€) | Volltreffer: 62 Verkäufe = **+1.800 €** | ≈2,7–3,1 k | 1. Etage |
| | B Sponsoren-Deals (€€) | gut: 3 Deals = **+1.200 €** | ≈2,1–2,5 k | 1. Etage, falls ≥2,5 k |
| **Tag 4** „Wie wachsen wir?" | A Zweite Plattform (TikTok) (€€€) | gut: **+2.400 €** | ≈4,5–5,5 k | Studio, falls ≥5 k |
| | B Zweite Persona/Kanal (€€) | gut: **+2.000 €** | ≈4,1–4,5 k | – |
| **Tag 5** „Alles auf eine Karte?" (Start normaler Zyklus) | A Ganze Kasse in Ads | **Rückschlag:** Werbekonto gesperrt, **−35 %** | Delle | Werbe-Zeppelin stürzt ab |
| | B Langsam: 1. Etage + Team | **gut: +45 %** | wächst | Etage |

Die Fragen von Tag 2–5 sind so gebaut, dass sie nach **beiden** Zweigen von Tag 1 passen (Geld verwenden → mehr verdienen → wachsen → großes Risiko). Der Mail-Faden läuft parallel und ist unabhängig vom Geld.

## 5. Checkliste pro Folge
1. Ergebnis aus der Tabelle holen – nichts nachträglich ändern.
2. Recap zeigt Delta als fliegende Zahl, Kasse zählt im HUD mit, Shop bekommt Haken, das Gekaufte erscheint in der Welt.
3. Neue A/B-Frage mit Potenzial/Risiko-Labels; beide Ergebnisse vorher eintragen.
4. Wenn es eine neue Verzweigung gibt (Folge hängt vom Zweig ab): beide Zweige vorab eintragen.

## 6. Tatsächlicher Verlauf
| Folge | Stimmen | Entschieden von | Ergebnis | Kasse danach | Gekauft |
|---|---|---|---|---|---|
| Tag 1 | 0 / 0 | **Rivale** (Mail): weder A noch B → **C: KI-Automatisierungen für Firmen, mit Superkind** | Volltreffer: erster Kunde Steuerkanzlei, 200 Rechnungen/Monat, **+900 €** | 900 € → nach Käufen **385 €** | Domain, Werbe-Test, Server |

Damit gilt die Phase-1-Tabelle oben ab Tag 2 im Zweig C:
| Abstimmung | Option | Ergebnis | Gekauft |
|---|---|---|---|
| **Tag 2** „Wie holt der Agent mehr Kunden?" | A Werbung schalten (€€€ · Risiko mittel) | Volltreffer: 3 neue Firmen, **+1.400 €** → 1.785 € | 2. Agent (Rest 785 €) |
| | B Monats-Abo (€€ · Risiko niedrig) | gut: **+1.100 €** → 1.485 €, ab dann +600 € pro Folge wiederkehrend | 2. Agent (Rest 485 €) |
| Tag 2 | 0 / 0 | **Rivale**: B Monats-Abo | gut: **+1.100 €** (ab jetzt +600 €/Folge wiederkehrend) | 1.485 € → nach Kauf **485 €** | 2. Agent |

**Tag 3 (2026-10-23): Was verkauft die Firma?** Produkt = Abo für kleine Firmen, 49 €/Monat, ein Agent übernimmt genau EINE tägliche Aufgabe. Erster Abo-Kunde = die Kanzlei von Tag 1 (Postfach: 80 Mails/Tag sortieren + Antwort-Entwürfe, 1 h/Tag gespart). Kasse 385 → **434 €**. Tag-2-Ergebnis B wurde dafür vor Veröffentlichung von +1.100 € auf +49 € gesenkt (nie gezeigt), kein 2. Agent. Kommentar-Mechanik: Beruf kommentieren → eigener Laden in der Straße (12 Plätze, 1 = Kanzlei), in Tag 4 nennt der Agent für echte Kommentatoren die eine Aufgabe. Der Absender-Faden pausiert (später wieder aufnehmen).

**Tempo-Regel (ab 2026-10-23, gilt vor der Tabelle in Abschnitt 4):** 100 Folgen füllen. Pro Folge EINE Sache, sauber erklärt. Geld wächst in kleinen echten Schritten (ein Abo-Kunde = 49 €/Monat), keine Sprünge über ein paar hundert Euro. Die alten Phase-1-Ergebnisse ab Tag 3 (+1.800 €, +2.400 € usw.) sind ungültig und werden pro Folge neu und klein festgelegt. Jede Folge muss für neue Zuschauer allein verständlich sein: Serien-Hook → Ziel + Kasse → die eine Frage des Tages → Erklärung an einem konkreten Beispiel → Mehrwert für den Zuschauer → Kommentar-Aufgabe.
