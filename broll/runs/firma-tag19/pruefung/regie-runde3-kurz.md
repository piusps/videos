# Prüfung Regie · Folge 19 „Stimmt die Versandzeile?“ · Runde 3 (Kurzprüfung) · 2026-11-01

Prüfer: firma-pruefer (frisch, nicht Ersteller). Geprüft: beats.json gegen regie/beats-r2.json (Diff), Abschnitt „Änderungen Runde 3“ in regieplan.md, alle Ereignisse aller Beats B01–B16 unabhängig gegen words.json aufgelöst (eigenes Skript, nicht regie/gap_r3.py): Beat-Starts, karten (t bzw. at), sfx-Anker, events. Ankerformat Wort[@ab][:end][±Offset]; alle Anker aufgelöst, keiner offen.

## Diff r2 → r3 (vollständig)
Nur: B05 „bild“ ergänzt + SFX tick „Logo@7.9“ + events [„Logo@7.9“, „kleine@8.3“]; B07 „bild“ ergänzt + SFX tick „fehlt@12.1“ + events [„fehlt@12.1“]. Karten, Beat-Grenzen, Stimme, words.json (Stand 31.10.), Musik, Slot unverändert. JSON gültig (json.load ok).

## Lückenrechnung 6,17–43,95 s
- B05: 6,17 → 7,09 (verkauft) 0,92 → 7,98 (Logo) 0,89 → 8,38 (kleine) 0,40 → 8,67 (Betriebe) 0,29 → 9,25 (B06) 0,58.
- B07: 10,60 → 10,89 → 11,45 (EINKAUF FEHLT) 0,56 → 12,17 (fehlt) 0,72 → 13,00 (Heute-0.1) 0,83.
- Größte Lücke im ganzen Fenster: **1,35 s** (B06 „bestickt“ 9,25 → B07-Start 10,60). Weitere > 1,2 s: 41,9→43,28 (1,24 s). Ende: letztes Ereignis 43,28 → Endkarte 43,95 = 0,67 s.
- Keine Lücke > 1,5 s. Die Aussagen in regieplan.md Z. 81 und Z. 89 stimmen jetzt.

## Kein neuer Text
Neue Ereignisse sind reine Bewegung/Ton (Logo-Glanz, Silhouetten früher, Preisschild wackelt), im „bild“ jeweils ausdrücklich „kein neuer Text“; keine neue oder geänderte Karte.

## Noten
| Kriterium | Befund | Note |
|---|---|---|
| regie-R2-01 Lücken ≤ 1,5 s (6,17–43,95) | erfüllt, max. 1,35 s, nachgerechnet | 9 |
| Neue Ereignisse ohne neuen Text | erfüllt | 10 |
| Anker gültig / nachrechenbar | alle Anker lösen auf words.json auf, Zeiten stimmen mit regieplan überein (7,98 / 8,38 / 12,17) | 9 |
| JSON gültig, sonst nichts verändert | erfüllt | 10 |

Hinweis (kein Ticket): B05 „bild“ nennt die Silhouetten noch zweimal („auf ‚Betriebe@8.6‘“ und „schon auf ‚kleine@8.3‘“); der tick bleibt auf „Betriebe“. Design: Silhouetten erscheinen auf kleine@8.3, tick auf Betriebe@8.6 als zweiter Akzent. Rechnerisch ist beides unter 1,5 s.

K.-o.: keins verletzt.

## Gesamtnote
**9,5/10** · alle Kriterien ≥ 8 → **bestanden**. Regie Folge 19 frei für firma-design.
