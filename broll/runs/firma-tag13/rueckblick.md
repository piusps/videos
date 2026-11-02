# Rückblick Folge 13 „Werbebrief“ (Chef, 2026-10-30)

Stand: Autor, Regie, Guide, replies.json fertig; kein Render, nicht eingeplant (Slots rutschten wegen Rate-Limit, Folge 13 geht an die Tages-Routine 2026-10-31). Details: `briefing.md`, Abschnitt „Stand 2026-10-30 abends“.

- **Autor:** 2 Runden. R1 (8,3) nicht bestanden, obwohl die bekannten Fehlerbilder aus Folge 10/11 (Weg-Satz, CTA, [BERUF], Fallback) vorab behoben waren. Neue Fehler alle vom Typ „stimmt mit dem Lauf, ist aber beim reinen Zuhören missverständlich“: Rückblick-Zahl klang nach Kunden, Entscheidung ohne genannte Alternativen, Anruf-Grund ohne Befund, Übergabe ohne Objekt. R2 bestanden 8,5. → Regel in `firma-autor` (Lehre Folge 13).
- Preis dafür: gesprochener Haken entfiel (100-Wörter-Grenze); trägt jetzt Bild/Caption. Prüfer: zulässig, aber Abweichung von der Seriengewohnheit.
- **Regie:** 1 Durchgang. Die Stimme spricht dieses kurze Skript so schnell, dass 44,5 s nur mit Pausen ~0,7 s und einem Splice aus zwei Takes erreicht wurden; Rückblick-Pause nur 0,15 s. Bereits in firma-regie abgedeckt (Pausen per Schnitt); keine neue Regel.
- **Guide:** 1 Durchgang, grep sauber. Generator setzt per CSS ein Blitz-Symbol (Emoji-Regel) – nur im HTML entfernt. Offener Punkt für `video-guidebook` (nicht firma-*): Symbol im Superkind-Template prüfen.

## Nachtrag 2026-10-30 abends: produziert und eingeplant (Pius' Ansage 15:35)
Slot 2026-10-31 09:00, erste Folge von Serientag 4. Zernio-Post 6ae4cbd69bf0788d8cc91fa9. Finale Prüfung 8,5/10 in Runde 1 (`pruefung/final-runde1.md`).
- **Autor:** „Tag vier.“ + 2 Wörter im CTA gekürzt („deinen eigenen Briefentwurf“), Kurzprüfung 8,5 bestanden (`pruefung/autor-runde3-kurz.md`).
- **Regie:** Eröffnung + CTA-Satz neu (35 Takes für die Eröffnung wegen STT „probiere“), „Heute“ 13,52 s, 45,0 s, 133,3 wpm. Musik: Vortags-Abschnitt (Folge 5), „Shit“ bei 20,2 s per musicMute stumm. → Regel in firma-regie.
- **Design:** 2 Runden (R1 7/10: Platzhalter-Brief, Engine-Quadrat, leere „?“-Slots; R2 8/10). Ursache: Übergänge nicht mit 30 fps vor der Prüfung angesehen. → Regel in firma-design.
- **Final:** 8,5, nur Hinweise an Design (34,1 s kurzes Doppelbild Warum → Als Nächstes; Warum-Panel vor der ersten Karte leer; GEWERBE ohne „MENSCH“-Marker).
- **Chef:** Zwei Netzabbrüche (ENOTFOUND) beendeten Design-Agenten; per SendMessage fortgesetzt. golive-arm überlebt die Nacht nicht → muss morgen neu gestartet werden. → Regeln in firma-chef.
