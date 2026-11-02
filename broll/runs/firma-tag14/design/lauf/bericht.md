# Claude-Antwort Folge 14 "Empfängerliste" (wörtlich, aus der Chat-API)
Chat: https://claude.ai/chat/5ffe5c38-4ccf-4046-8b1a-88dbdb7276ff

ACHTUNG: enthält echte Betriebsnamen, Personennamen (Inhaber) und Postadressen. Nie in Video, Caption oder Guide übernehmen. Fürs Video nur die *-anonym.png.

## Zwischentexte vor/zwischen den Werkzeugen
Ich suche jetzt die Impressums-Adressen der fünf Betriebe und baue daraus die Empfängerliste als Excel-Datei. Zuerst schaue ich, welche Felder der Brief erwartet.

The postal codes are stored as text, so the leading 0 is kept. The 9117 in the preview came from the preview tool, not from the file.

## Schlussantwort
Für alle fünf Betriebe habe ich eine Adresse aus dem Impressum gefunden. Eindeutig belegt ist allerdings nur eine. Bei drei Betrieben solltest du noch etwas prüfen, bei einem widersprechen sich die Quellen.

| Betrieb | Adresse im Brief | Status |
|---|---|---|
| Zimmerei Jens Knauth | Kieselhausenstraße 26a, 09117 Chemnitz | **Belegt.** Vier Quellen nennen dieselbe Adresse. |
| Jan Metzler Elektro Metzler | Augustusburger Straße 149, 09126 Chemnitz | **Prüfen.** Die Innungsliste nennt als PLZ 09127. |
| Malermeister Andreas Demeter | Falkenauer Wiesenstraße 13, 09557 Flöha | **Prüfen.** Im Impressum steht zusätzlich eine neue Betriebsstätte: Annaberger Straße 351a, 09125 Chemnitz. |
| M3 Raumbau, Inhaber Fabrice Müller | Elisenstraße 25, 09111 Chemnitz | **Prüfen.** Es gibt nur eine Quelle, und der Name ist ein anderer als in der Jobbörse („Fabrice Müller Malerbetrieb“). |
| Dachdeckerei Tillmann GmbH & Co. KG | Ziegeleistraße 7, 09114 Chemnitz | **Widerspruch.** Das Impressum ist auf 2010 datiert. Eine Abschrift aus dem Handelsregister nennt dagegen Ammernstraße 27, 09114 Chemnitz. |

Bei Elektro-Metzler steht im Impressum noch eine zweite Adresse. Sie gehört aber zur Person, die für die Website verantwortlich ist. Diese Adresse habe ich nicht übernommen, weil es eine private Adresse sein könnte. Für den Satz im Brief „Ihre Firmenanschrift stammt aus …“ gibt es eine fertige Spalte „Quelle_im_Brief“.

**Die verlässlichste Quelle ist für deine fünf Betriebe das Impressum auf der eigenen Website.** Gründe:
1. Das Impressum ist Pflicht. Der Betrieb muss dort eine Anschrift angeben, unter der er erreichbar ist.
2. Der Betrieb pflegt die Angabe selbst. Branchenverzeichnisse übernehmen dagegen oft alte Daten. Bei Demeter und Metzler stehen dort noch frühere Adressen.
3. Es gibt ein Impressum für alle fünf Betriebe. Das Handelsregister ist bei Firmen wie GmbH oder KG zwar die amtlichere Quelle. Von deinen fünf steht dort aber nur Tillmann. Die anderen vier sind laut Creditreform oder eigener Angabe Einzelunternehmen. Deshalb klärst du den Tillmann-Widerspruch am besten direkt im Handelsregister.

**Was ich nicht prüfen konnte:**
- Ob die Adressen heute noch stimmen. Keine Quelle sagt, wann sie zuletzt geprüft wurde.
- Das amtliche Handelsregister (handelsregister.de). Die Tillmann-Angabe stammt von einem anderen Anbieter, nicht vom Register selbst.
- Ob M3 Raumbau und „Fabrice Müller Malerbetrieb“ wirklich derselbe Betrieb sind. Vieles spricht dafür, bewiesen ist es nicht.
- Ob in der Elisenstraße 25 ein Geschäftsraum ist oder eine Wohnung.
- Welche der beiden Adressen Demeter für Post bevorzugt.
- Ob die Briefe zugestellt werden können.

Als Nächstes würde ich bei Tillmann im Handelsregister nachsehen. Bei Demeter und M3 Raumbau ginge auch ein kurzer Anruf, mit der Frage, an welche Adresse du Post schicken sollst.

Sources:
- [Impressum Zimmerei Knauth](https://www.knauth-zimmerei.de/impressum)
- [Impressum Elektro-Metzler](https://www.elektrometzler.de/impressum)
- [Elektro-Innung Südsachsen: Innungsbetriebe](https://www.elektro-innung-suedsachsen.de/mitgliederinfo/innungsbetriebe.html)
- [Impressum Malermeister Demeter](https://www.maler-demeter.de/farben-impressum.html)
- [Impressum M3 Raumbau](https://www.m3-raumbau.de/impressum-datenschutz.htm)
- [BA-Jobbörse: Fabrice Müller Malerbetrieb](https://www.arbeitsagentur.de/jobsuche/jobdetail/10001-1002436033-S)
- [Impressum Dachdeckerei Tillmann](https://www.dachdeckerei-tillmann.de/impressum-dachdecker-chemnitz-dachdeckerei-tillmann/)
- [webvalid: Tillmann HRA 7974](https://www.webvalid.de/company/Dachdeckerei+Tillmann+GmbH+&+Co.KG,+Chemnitz/HRA+7974)
- [Creditreform: Jens Knauth Zimmerei](https://firmeneintrag.creditreform.de/09117/3030086987/JENS_KNAUTH_ZIMMEREI)
- [Creditreform: Elektro-Metzler](https://firmeneintrag.creditreform.de/09126/3030321402/JAN_METZLER_ELEKTRO_METZLER)
