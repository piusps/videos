# Kalkulationsvorlage (neutral, für das Guide-PDF 1:1 übernehmen)

Grundlage: interne Datei `guide/Kalkulationsvorlage-leer.xlsx` (wird nicht verschickt, nicht gehostet). Im PDF als kopierbare Tabelle. MwSt. = Mehrwertsteuersatz, Menge = Stück pro Paket, Kurs = 1 Fremdwährung in €.

## Teil 1: Eingaben (eigene Zahlen aus dem letzten Ergebnis, jede mit Herkunft)
| Eingabe | Einheit | Hinweis |
|---|---|---|
| Mehrwertsteuersatz | % | Regelsatz Deutschland 19 %; bei Partnern im Ausland prüfen, wie die MwSt. abgerechnet wird |
| Wechselkurs: 1 Fremdwährung in € | € | mit Datum und Quelle; vor dem Start aktualisieren; rechnet der Partner in Euro, hier 1 eintragen |
| Konkurrenzpreis Paket (brutto) | € | aus dem Konkurrenzvergleich |
| Stück pro Paket (Menge) | Stk | eigene Vorgabe |
| **Partner A (Bruttopreise)** | | |
| Produkt 1 inkl. Veredelung, ab 1 Stk (brutto) | €/Stk | |
| Produkt 2 inkl. Veredelung, ab 1 Stk (brutto) | €/Stk | optionaler zweiter Artikel |
| Versand pro Sendung (brutto) | € | |
| Einrichtung einmalig (brutto) | € | nicht gefunden → 0 eintragen und markieren |
| Einrichtung bei Nachbestellung erneut? | 0/1 | 1 = ja, 0 = nein |
| **Partner B (Fremdwährung netto)** | | |
| Stück inkl. Veredelung | Fremdwährung/Stk | |
| Einrichtung einmalig | Fremdwährung | |
| Einrichtung bei Nachbestellung | Fremdwährung | |
| Versand erstes Stück | Fremdwährung | |
| Versand je weiteres Stück | Fremdwährung | |
| **Eigener Verkaufspreis (Vorschlag)** | | |
| VK Paket (brutto, inkl. Versand) | € | |
| VK Einzelstück-Nachbestellung (brutto, inkl. Versand) | € | |

## Teil 2: Rechnung (je Partner eine Spalte)
| Zeile | Formel |
|---|---|
| **1) Paket – Erstauftrag** | |
| Stück inkl. Veredelung (netto) | Partner A: Menge × Brutto-Stückpreis ÷ (1 + MwSt.) · Partner B: Menge × Stückpreis × Kurs |
| Einrichtung einmalig (netto) | Partner A: Einrichtung ÷ (1 + MwSt.) · Partner B: Einrichtung × Kurs |
| Versand (netto) | Partner A: Versand ÷ (1 + MwSt.) · Partner B: (Versand erstes Stück + (Menge − 1) × Versand je weiteres Stück) × Kurs |
| Einkauf Paket netto | Stück + Einrichtung + Versand |
| + Mehrwertsteuer | Einkauf netto × MwSt. |
| Einkauf Paket brutto | Einkauf netto + Mehrwertsteuer |
| **2) Ein einzelnes Stück nachbestellt** | |
| 1 Stück inkl. Veredelung (netto) | wie oben, Menge = 1 |
| Einrichtung bei Nachbestellung (netto) | Partner A: Einrichtung × (0 oder 1) ÷ (1 + MwSt.) · Partner B: Einrichtung bei Nachbestellung × Kurs |
| Versand (netto) | Partner A: Versand ÷ (1 + MwSt.) · Partner B: Versand erstes Stück × Kurs |
| Einkauf Einzelstück netto | Stück + Einrichtung + Versand |
| + Mehrwertsteuer | Einkauf netto × MwSt. |
| Einkauf Einzelstück brutto | Einkauf netto + Mehrwertsteuer |
| **3) Verkaufspreis und Rohertrag pro Auftrag** | |
| VK Paket netto | VK Paket brutto ÷ (1 + MwSt.) |
| Rohertrag Paket (netto) | VK netto − Einkauf Paket netto |
| Rohertragsquote Paket | Rohertrag ÷ VK netto |
| VK Einzelstück netto | VK Einzelstück brutto ÷ (1 + MwSt.) |
| Rohertrag Einzelstück (netto) | VK netto − Einkauf Einzelstück netto |
| Rohertragsquote Einzelstück | Rohertrag ÷ VK netto |
| **4) Vergleich mit der Konkurrenz** | |
| Rohertrag beim Konkurrenzpreis (netto) | Konkurrenzpreis ÷ (1 + MwSt.) − Einkauf Paket netto |
| Einkauf brutto im Verhältnis zum Konkurrenzpreis | Einkauf Paket brutto ÷ Konkurrenzpreis (über 100 % = Einkauf teurer als der Verkaufspreis der Konkurrenz) |
| **5) Verhandlungsziel für Partner A** | |
| Max. Einkauf je Stück für Rohertrag 0 | (VK Paket netto − Einrichtung − Versand) ÷ Menge |
| Max. Einkauf je Stück für gleichen Rohertrag wie Partner B | (VK Paket netto − Rohertrag Partner B − Einrichtung − Versand) ÷ Menge |
| Zum Vergleich: heutiger Stückpreis Partner A (netto) | Stück netto ÷ Menge |
| **6) Kontrolle** | |
| Partner B Paket in Fremdwährung netto | Einkauf Paket netto ÷ Kurs = Wert im letzten Ergebnis |
| Partner B Einzelstück in Fremdwährung netto | Einkauf Einzelstück netto ÷ Kurs = Wert im letzten Ergebnis |
| Partner A Paket brutto | Einkauf Paket brutto = Wert im letzten Ergebnis |

Hinweise: Rohertrag ist nicht Gewinn (Werbung, Gebühren, Steuern fehlen). Annahme Vorsteuerabzug; als Kleinunternehmer mit dem Brutto-Einkauf rechnen. Geschätzte, umgerechnete oder fehlende Werte markieren.
