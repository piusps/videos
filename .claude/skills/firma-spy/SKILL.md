---
name: firma-spy
description: Kanal-Spion für die Serie "Superkind baut eine Firma" (@pickthecompany) - beobachtet laufend Kanäle, die gerade funktionieren (Build-in-Public, "KI baut X", KI-Tutorials für kleine Firmen, 3D-/Motion-Explainer), findet ihre Ausreißer-Reels (Views weit über dem eigenen Schnitt), lädt sie herunter, zerlegt sie Frame für Frame und schreibt belegte Muster (Hook, Story, Schnitt, Grafik, Ton, CTA) in die Musterbibliothek, aus der firma-autor, firma-regie und firma-design arbeiten. Nutze den Skill bei "spy mal", "was funktioniert gerade", "welche Kanäle laufen", "Referenzen finden", "Ausreißer analysieren", "neue Muster", "Musterbibliothek aktualisieren", oder als Schritt 0 von firma-chef. Schreibt keine Skripte und baut keine Videos.
---

# firma-spy

Der Spion liefert **Belege**, keine Meinungen. Jedes Muster, das er weitergibt, hängt an mindestens zwei echten Ausreißer-Reels mit Zeitstempel. Daraus arbeiten die anderen Skills; was hier falsch ist, wird überall falsch.

Alles liegt in `~/Desktop/Superkind Videos/_Serie Superkind baut Firma/spy/` (im Folgenden `SPY/`):
- `kanaele.md` – Beobachtungsliste: Handle, Plattform, Warum beobachtet, Median-Views der letzten 30 Reels, zuletzt geprüft.
- `reels.csv` – jede gesichtete Reel: `datum,handle,url,views,median_kanal,faktor,thema,status` (status = gesichtet | analysiert | verworfen).
- `analysen/<handle>/<JJJJ-MM-TT Thema Views>/` – `original.mp4`, Kontaktbögen, `zerlegung.md`.
- `muster.md` – die Musterbibliothek (Format unten). Das ist die einzige Datei, die andere Skills lesen müssen.

## Ablauf

1. **Kanäle pflegen.** Lies `kanaele.md`. Fehlen Kanäle oder ist die Liste unter 15 Einträgen, suche neue: Apify-MCP (`search-actors` nach einem Instagram-/TikTok-Reel- bzw. Hashtag-Scraper; das gewählte Actor-ID in `kanaele.md` oben notieren, damit der nächste Lauf es wiederverwendet), Hashtags wie #buildinpublic #kiagent #aiagent #startup #claudeai #smallbusiness, Konten, die in Ausreißer-Reels erwähnt werden, und Pius' Referenzen in `~/Desktop/Superkind Videos/Referenzen/`. Nur Kanäle aufnehmen, die zu einem Baustein der Serie passen: Serien-/Tag-X-Format, KI-Tutorial für Selbstständige, Firmen-Aufbau, 3D-/Motion-Look, Kommentar-Mechanik.
   *Fertig, wenn:* mindestens 15 Kanäle mit Begründung und Median gelistet sind. Handles nie erfinden; nur, was du auf der Plattform gesehen hast.
2. **Ausreißer finden.** Pro Kanal die letzten ~30 Reels mit Views holen (Apify-Actor; Fallback: im In-App-Browser das Profil öffnen). Ausreißer = Views ≥ 3× Median des Kanals **und** ≥ 100k. Neue Ausreißer in `reels.csv` eintragen.
   *Fertig, wenn:* jeder Kanal in diesem Lauf geprüft ist und jeder Ausreißer eine Zeile hat.
3. **Herunterladen und zerlegen.** Für die stärksten 3–5 neuen Ausreißer: mp4 holen wie in `pixelwelt-look` Schritt A1 (In-App-Browser, `video_url` aus dem HTML, curl), dann `python3 ~/.claude/skills/pixelwelt-look/scripts/analyze_reel.py original.mp4 analyse`. Alle Kontaktbögen ansehen, Schlüsselframes zoomen. Optional zusätzlich `analyze_local_video` vom instagram-video-analyzer-MCP für Transkript und Szenenliste (braucht keinen Backend-Start).
   Schreibe `zerlegung.md` nach `references/zerlegung-vorlage.md`: Sekunde für Sekunde, was man sieht, hört und liest, und warum man weiterschaut.
   *Fertig, wenn:* jede Behauptung in der Zerlegung einen Zeitstempel hat.
4. **Muster ableiten.** Ein Muster kommt nur in `muster.md`, wenn es in mindestens **zwei** Ausreißern von **verschiedenen** Kanälen vorkommt. Vorher aktiv nach einem Gegenbeispiel suchen (ein Ausreißer, der es anders macht) und das in der Karte notieren. Bestehende Muster mit neuen Belegen verstärken oder, wenn sie nicht mehr tragen, als "veraltet" markieren.
   *Fertig, wenn:* jede neue oder geänderte Karte ≥ 2 Belege mit Zeitstempel hat.
5. **Übergabe.** Kurzer Bericht an den Aufrufer: neue Ausreißer, neue/geänderte Muster, und pro nachgelagertem Skill (autor / regie / design) die eine Sache, die er ab jetzt anders machen sollte.

## Musterkarte (`muster.md`)

```
### M-NNN · <Name in 3–5 Wörtern>   [Bereich: hook | story | schnitt | grafik | ton | cta | thema]
Was: <ein Satz, was passiert>
Warum es wirkt: <Mechanik beim Zuschauer>
Belege: <handle, Views, URL, mm:ss> · <handle, Views, URL, mm:ss>
Gegenbeispiel: <falls gefunden>
So nutzen wir es: <konkret für die Firma-Serie>
Status: aktiv | veraltet   · zuletzt bestätigt: JJJJ-MM-TT
```

## Regeln
- Nur echte Zahlen, die du gesehen hast. Keine geschätzten Views.
- Kopiert wird das Prinzip, nie Inhalte, Musik oder Grafiken der anderen.
- Ein regelmäßiger Lauf (z. B. wöchentlich) wird nur mit Pius' OK als geplante Aufgabe angelegt.
