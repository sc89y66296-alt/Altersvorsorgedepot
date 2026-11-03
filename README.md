# Selbstcheck „Bist du nach dem Studium richtig abgesichert?“

Ein kleines Web-Tool: 10 Fragen, ca. 2 Minuten, danach bis zu 4 Hinweise, welche Versicherungsthemen beim Übergang vom Studium in den Job gerade dran sind – plus eine Einladung zum kostenlosen Gespräch.

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

Tests ausführen (prüft die komplette Ergebnislogik):

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
| `bookingUrl` | Link hinter dem Button „Kostenlosen Termin vereinbaren“ |
| `imprintUrl`, `privacyUrl`, `initialInfoUrl` | Links im Fuß: Impressum, Datenschutz, Erstinformation |
| `appointmentDurationMinutes` | Termindauer in der Einladung („Ca. 30 Minuten …“) |
| `appointmentFormats` | Termin-Formate in der Einladung („bei uns in Passau oder per Video“) |
| `colors.primary` | Hauptfarbe (Buttons, Fortschritt, Links) |
| `colors.background`, `colors.text` | Hintergrund- und Textfarbe |

Farben bitte als Hex-Wert angeben (z. B. `"#1F4E79"`). Ist ein Kontrast zu schwach für gute Lesbarkeit (WCAG AA, mind. 4,5 : 1), erscheint in der Browser-Konsole eine Warnung. Die Schriftfarbe auf Buttons (Weiß oder Dunkel) wird automatisch gewählt.

Wird das Tool im iframe angezeigt, wird die Kopfzeile mit Name/Logo ausgeblendet – die umgebende Website zeigt das ja schon.

## 4. Texte ändern

| Was | Datei |
| --- | --- |
| Fragen, Antworten, Themen-Zeilen | `src/content/questions.ts` |
| Hinweise H0–H7 und die Info-Zeile zum Urlaub | `src/content/hints.ts` |
| Startseite, Ergebnisseite, Buttons, Disclaimer, Stufen-Labels | `src/content/copy.ts` |

Nur den Text zwischen den Anführungszeichen ändern. Die Kürzel (`id: "4b"` usw.) bitte **nicht** ändern – die Ergebnislogik hängt daran. Wann welcher Hinweis erscheint, steht in `src/logic/evaluate.ts`, die Überspring-Regeln in `src/logic/skip.ts`.

Nach Textänderungen einmal `npm test` ausführen, dann `npm run build`.

## 5. Einbindung per iframe

Diesen Code an der gewünschten Stelle der Agentur-Website einfügen und die Adresse anpassen. Das iframe passt seine Höhe dann automatisch an den Inhalt an, und beim Wechsel zur nächsten Frage wird der Anfang des Checks wieder ins Bild gescrollt.

```html
<iframe
  id="selbstcheck"
  src="https://www.ihre-agentur.de/selbstcheck/"
  title="Selbstcheck: Bist du nach dem Studium richtig abgesichert?"
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
- Der Termin-Link wird ohne Antworten oder Ergebnisse aufgerufen und sendet keinen Referrer.
- Wie bei jeder Webseite protokolliert der Webserver ggf. IP-Adressen in seinen Log-Dateien – das ist Sache des Hosters und gehört in die bestehende Datenschutzerklärung der Website.
- Wird ein Logo von einer fremden Adresse geladen (`logoUrl` mit `https://…` einer anderen Domain), ist das eine externe Anfrage. Deshalb das Logo besser in `public/` ablegen.

## 7. Fachliche Entscheidungen bei der Umsetzung

Wo das Briefing Spielraum ließ, wurde so entschieden:

- **H7 bei 10a:** Wer bei Frage 10 „Ja, und ich nutze sie“ angibt, bekommt den Hinweis „Schau dir die Extras deines Arbeitgebers an“ **nicht** – auch nicht, wenn gerade der erste Job begonnen hat (1c). Laut Briefing wäre er bei 1c + 10a erschienen, was der Antwort widerspricht. Anpassbar in `src/logic/evaluate.ts`.
- **Automatisches Weiterspringen** passiert nur bei Klick oder Tipp auf eine Antwort. Mit der Tastatur wählen die Pfeiltasten nur aus, weiter geht es mit Enter oder dem Button „Weiter“ – sonst würde jeder Pfeiltastendruck die Frage verlassen.
- **H0** wird ohne Stufen-Label angezeigt.
- **Fußzeile** (Impressum, Datenschutz, Erstinformation) ist auf allen Screens sichtbar.
- **„Check neu starten“** führt zurück zur Startseite.
- Wohnt jemand in einer eigenen Wohnung (5c/5d) und wählt bei Frage 6 trotzdem „Betrifft mich nicht, ich wohne bei meinen Eltern“, erscheint – wie im Briefing – kein Hausrat-Hinweis.

## 8. Projektstruktur

```
index.html            Grundgerüst der Seite
src/config.ts         Agentur-Einstellungen
src/content/          Alle Texte (Fragen, Hinweise, Seitentexte)
src/logic/            Ergebnis- und Überspring-Logik (ohne Oberfläche, voll getestet)
src/ui/               Darstellung der Screens
src/styles.css        Gestaltung
tests/                Automatische Tests (npm test)
```
