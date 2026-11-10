# Rentencheck „Passt das Altersvorsorgedepot zu deiner Situation?“

Ein kleines Web-Tool: 5 Fragen, ca. 2 Minuten. Es zeigt, wie viel gesetzliche Rente man ungefähr erwarten kann, fragt nach Zielen und Vorsorge-Wunsch und führt zum kostenlosen Orientierungsgespräch.

Entstanden als Kopie des Selbstchecks [Versicherungscheck](https://github.com/sc89y66296-alt/Versicherungscheck); Technik, Gestaltung und Terminbuchung sind von dort übernommen.

## Ablauf

| Frage | Inhalt |
| --- | --- |
| 1 | Schieberegler fürs Bruttoeinkommen, live berechnete gesetzliche Rente und Lücke – „Wärst du damit zufrieden?“ Bei „Ja, das würde mir reichen“ folgt einmal „Bist du dir sicher?“ (Abzüge für Kranken-/Pflegeversicherung, Beitragslücken): weiter zu Frage 2 oder Check beenden |
| 2 | Was ist dir im Alter am wichtigsten? Vier Bildkarten mit Bildunterschrift (Auswandern ans Meer, Reisen & Urlaub, Sicherheit, Familie) |
| 3 | Förderung, Flexibilität oder „Ich möchte erst mehr wissen“ |
| 4 | Je nach Frage 3: Altersvorsorgedepot (Zulagen), Privatrente (Flexibilität, Steuervorteile) oder bei „mehr wissen“ beides untereinander – „Möchtest du darüber sprechen?“ „Erst mal nicht“ beendet den Check ohne Nachfrage |
| 5 | „Dürfen wir uns bei dir melden?“ – Ja: Link zum Kontaktformular, Nein: Link zur Online-Terminbuchung. Dazu Einladung zum Orientierungsgespräch und Zusammenfassung |
| Ende | Abschlussseite für beide Ausstiege: Dank, Zusammenfassung und ein unaufdringlicher Hinweis (Termin-Link, Telefon) – kein großer Termin-Button |

**Rentenschätzung (Frage 1):** Einkommen (bis zur Beitragsbemessungsgrenze) ÷ Durchschnittsentgelt × 12 × 45 Jahre × aktueller Rentenwert. Gerechnet wird mit heutigen Werten, brutto. Die Werte stehen in `src/config.ts` unter `pension` und sollten einmal im Jahr aktualisiert werden.

**Frage 5:** Es gibt keinen eigenen Server und nichts wird eingebettet. „Ja, meldet euch gerne bei mir“ zeigt einen Button zum Kontaktformular der Allianz-vor-Ort-Seite (`contactFormUrl`, mit Einwilligung), „Nein, ich vereinbare selbst einen Termin“ einen Button direkt zum Allianz-Buchungskalender bei bookingtime (`bookingUrl`). Beide öffnen sich in einem neuen Tab; zusätzlich gibt es jeweils den Anruf-Button.

- Läuft komplett im Browser, ohne Server, Datenbank, Cookies oder Tracking.
- Antworten werden nirgends gespeichert. Ein Neuladen der Seite startet den Check von vorn.
- Optimiert für das Handy, funktioniert genauso am Desktop.
- Als eigene Seite aufrufbar und per `<iframe>` in die Agentur-Website einbettbar.

---

## 1. Lokal starten

Einmalig nötig: [Node.js](https://nodejs.org/de) in der LTS-Version installieren.

Dann im Projektordner im Terminal:

```bash
npm install
```

```bash
npm run dev
```

Das Terminal zeigt eine Adresse wie `http://localhost:5173`. Diese im Browser öffnen. Änderungen an Dateien sind sofort sichtbar.

Tests ausführen (prüft Rentenschätzung, Ablauf und Texte):

```bash
npm test
```

## 2. Bauen und auf den Webspace hochladen

```bash
npm run build
```

Das erzeugt den Ordner `dist/` mit allen Dateien (eine HTML-Datei, eine CSS- und eine JavaScript-Datei).

1. Mit einem FTP-Programm (z. B. FileZilla) beim Webspace anmelden.
2. Einen Ordner anlegen, z. B. `selbstcheck`.
3. Den **Inhalt** von `dist/` (nicht den Ordner selbst) dort hineinkopieren.
4. Fertig: Das Tool ist z. B. unter `https://www.ihre-agentur.de/selbstcheck/` erreichbar.

Hinweise:

- Der Ordnername ist frei wählbar, das Tool funktioniert in jedem Unterordner.
- Die Datei `index.html` lässt sich **nicht** per Doppelklick direkt vom Computer öffnen – sie muss über einen Webserver laufen (oder lokal über `npm run preview`).
- Für jede Änderung: Datei ändern → `npm run build` → Inhalt von `dist/` erneut hochladen (alte Dateien im Ordner `assets/` dürfen gelöscht werden).

## 3. Agentur-Werte anpassen: `src/config.ts`

Alle agenturspezifischen Werte stehen in **`src/config.ts`**. Alles mit `TODO` muss ausgefüllt werden:

| Wert | Bedeutung |
| --- | --- |
| `agencyName` | Name der Agentur (oben auf der Seite, wenn kein Logo gesetzt ist) |
| `logoUrl` | Logo, leer lassen = kein Logo. Am besten die Logo-Datei in den Ordner `public/` legen und hier nur den Dateinamen eintragen, z. B. `"logo.svg"` |
| `contactFormUrl` | Allianz-vor-Ort-Seite mit Kontaktformular (Frage 5, Antwort „Ja, meldet euch“) |
| `bookingUrl` | Allianz-Buchungskalender der Agentur bei bookingtime (Frage 5, Antwort „Nein, ich vereinbare selbst einen Termin“) |
| `phone`, `phoneHref` | Telefonnummer zum Anzeigen und als Anruf-Link (`tel:+49…`) |
| `imprintUrl`, `privacyUrl`, `initialInfoUrl` | Links im Fuß: Impressum, Datenschutz, Erstinformation |
| `appointmentDurationMinutes` | Termindauer in der Einladung („Ca. 30 Minuten …“) |
| `agencyLocation` | Ort der Agentur für die Einladung bei Frage 5 („… in Spiegelau“) |
| `incomeSlider` | Bereich, Schrittweite und Startwert des Einkommens-Schiebereglers |
| `pension` | Rentenwert, Durchschnittsentgelt, Beitragsbemessungsgrenze, Beitragsjahre, Rentenniveau |
| `funding` | Förderbeträge des Altersvorsorgedepots (Grundzulage, nötiger Eigenbeitrag, Kinderzulage) |
| `colors.primary`, `colors.primaryHover` | Interaktiv-Blau (Buttons, Fortschritt, Links, Auswahl) und seine Hover-Farbe |
| `colors.heading` | Allianz-Blau für Überschriften und Schrift auf hellen Flächen |
| `colors.cta` | Allianz-Grün für Haupt-Aktionen („Los geht's“, „Anrufen“) |
| `colors.tint` | helles Türkis für hinterlegte Flächen |
| `colors.background`, `colors.text` | Hintergrund- und Textfarbe |

Die Farben sind aus dem Design-System von allianz.de übernommen. Die Allianz-Hausschrift (Allianz Neo) ist lizenzpflichtig und wird deshalb nicht verwendet, der Check nutzt die Systemschrift des Geräts. Ein **Allianz-Logo** ist bewusst nicht im Projekt: Die Marke darf nur nach Allianz-Vorgaben verwendet werden. Ein freigegebenes Logo (z. B. aus dem Allianz-Vertriebs-/Marketingportal) in `public/` legen und unter `logoUrl` eintragen.

Farben bitte als Hex-Wert angeben (z. B. `"#1F4E79"`). Ist ein Kontrast zu schwach für gute Lesbarkeit (WCAG AA, mind. 4,5 : 1), erscheint in der Browser-Konsole eine Warnung. Die Schriftfarbe auf Buttons (Weiß oder Dunkel) wird automatisch gewählt.

Wird das Tool im iframe angezeigt, wird die Kopfzeile mit Name/Logo ausgeblendet – die umgebende Website zeigt das ja schon.

## 4. Texte und Bilder ändern

Die Bilder zu Frage 2 liegen in `public/images/` (selbst gezeichnete Illustrationen, frei verwendbar). Für eigene Fotos die Datei dort ablegen und in `src/content/questions.ts` bei `image` den Dateinamen eintragen. Querformat 4 : 3 passt am besten (angezeigt als Quartett, 2 × 2, auch auf dem Handy); Fotos bitte nur mit Nutzungsrecht (z. B. aus dem Allianz-Bildportal).

| Was | Datei |
| --- | --- |
| Fragen, Antworten, Info-Texte zu Förderung und Privatrente, letzte Seite | `src/content/questions.ts` |
| Startseite, Buttons, Zusammenfassung, Disclaimer | `src/content/copy.ts` |

Nur den Text zwischen den Anführungszeichen ändern. Die Kürzel (`id: "foerderung"` usw.) bitte **nicht** ändern – der Ablauf hängt daran (`src/logic/flow.ts`).

Nach Textänderungen einmal `npm test` ausführen, dann `npm run build`.

## 5. Einbindung per iframe

Diesen Code an der gewünschten Stelle der Agentur-Website einfügen und die Adresse anpassen. Das iframe passt seine Höhe dann automatisch an den Inhalt an, und beim Wechsel zur nächsten Frage wird der Anfang des Checks wieder ins Bild gescrollt.

```html
<iframe
  id="selbstcheck"
  src="https://www.ihre-agentur.de/selbstcheck/"
  title="Rentencheck: Lohnt sich das Altersvorsorgedepot für dich?"
  style="width: 100%; height: 700px; border: 0; display: block;"
  loading="lazy"
></iframe>
<script>
  (function () {
    var frame = document.getElementById("selbstcheck");
    // Nur Nachrichten vom Selbstcheck annehmen (Adresse ohne Pfad, ohne Schrägstrich am Ende)
    var origin = "https://www.ihre-agentur.de";
    window.addEventListener("message", function (event) {
      if (event.origin !== origin || event.source !== frame.contentWindow) return;
      var data = event.data || {};
      if (data.type === "selbstcheck-height") {
        frame.style.height = data.height + "px";
      }
      if (data.type === "selbstcheck-screen" && frame.getBoundingClientRect().top < 0) {
        frame.scrollIntoView({ block: "start" });
      }
    });
  })();
</script>
```

Bei Website-Baukästen (z. B. WordPress-Block „Individuelles HTML“) lässt sich der Code meist genau so einfügen. Läuft der Selbstcheck auf einer anderen Domain als die Website (z. B. `check.ihre-agentur.de`), muss der Server das Einbetten erlauben (kein `X-Frame-Options: DENY`/`SAMEORIGIN` für diesen Ordner).

## 6. Datenschutz

- Keine Cookies, kein `localStorage`/`sessionStorage`, keine Anfragen an fremde Server, keine externen Schriften.
- Der gebaute Check enthält eine Content-Security-Policy, die Netzwerkanfragen aus dem Skript heraus technisch blockiert.
- Frage 5: Kontaktformular (allianz-vor-ort.de) und Buchungskalender (Allianz-Dienstleister bookingtime) öffnen sich erst nach einem Klick in einem neuen Tab – vorher gibt es keine Verbindung dorthin. Angaben aus dem Check werden nicht übergeben, ein Referrer wird nicht gesendet. Was jemand dort eingibt, verarbeiten die Allianz bzw. bookingtime nach ihren eigenen Datenschutzhinweisen; die Datenschutzerklärung der Agentur sollte bookingtime nennen. Der Check selbst lädt keine fremden Seiten (Content-Security-Policy: `frame-src 'none'`).
- Wie bei jeder Webseite protokolliert der Webserver ggf. IP-Adressen in seinen Log-Dateien – das ist Sache des Hosters und gehört in die bestehende Datenschutzerklärung der Website.
- Das Einkommen aus Frage 1 bleibt im Browser und wird nirgends hin übertragen.
- Wird ein Logo von einer fremden Adresse geladen (`logoUrl` mit `https://…` einer anderen Domain), ist das eine externe Anfrage. Deshalb das Logo besser in `public/` ablegen.

## 7. Fachliche Entscheidungen bei der Umsetzung

- **Rentenschätzung brutto, in heutigen Werten:** Die Rente wird mit dem aktuellen Rentenwert gerechnet, nicht hochgerechnet. Das Rentenniveau von 48 % bezieht sich auf den Durchschnittsverdienst nach Sozialabgaben; im Verhältnis zum Brutto ergibt die Schätzung deshalb ca. 43 %. Ein Hinweis unter dem Ergebnis erklärt das.
- **Zwei Ausstiege:** „Ja, das würde mir reichen“ (Frage 1) wird einmal nachgefragt, weil viele die Abzüge im Alter unterschätzen. „Erst mal nicht“ (Frage 4) beendet den Check ohne Nachfrage – ein zweites Nachhaken würde dort aufdringlich wirken.
- **Abzug Kranken-/Pflegeversicherung** bei der Nachfrage: pauschal `pension.healthCareSharePercent` (12 %) aus `src/config.ts`.
- **Kein automatisches Weiterspringen:** Ein Klick auf eine Antwort wählt sie nur aus, weiter geht es mit „Weiter“ oder Enter.
- **Fußzeile** (Impressum, Datenschutz, Erstinformation) ist auf allen Screens sichtbar.

## 8. QR-Code

Im Ordner `qr-code/` liegen ein reiner QR-Code und eine Aushang-Karte (1080 × 1350, Allianz-Farben), jeweils als SVG (für den Druck, beliebig skalierbar) und PNG. Beide verweisen auf die GitHub-Pages-Adresse https://sc89y66296-alt.github.io/Altersvorsorgedepot/. Zieht der Check später auf die Agentur-Website um, muss der QR-Code neu erzeugt werden.

## 9. Projektstruktur

```
index.html            Grundgerüst der Seite
src/config.ts         Agentur-Einstellungen
src/content/          Alle Texte (Fragen, Info-Texte, Seitentexte)
src/logic/            Rentenschätzung, Ablauf, Zusammenfassung (ohne Oberfläche, getestet)
src/ui/               Darstellung der Screens
src/styles.css        Gestaltung
tests/                Automatische Tests (npm test)
qr-code/              QR-Code und Aushang-Karte
```
