import { describe, expect, it } from "vitest";
import { config } from "../src/config";
import { fillPlaceholders, formatNumber } from "../src/content/copy";
import { q1, q2, q3, q4, q5 } from "../src/content/questions";
import { contrastRatio } from "../src/logic/contrast";

describe("Inhalte", () => {
  it("die Fragen haben die vorgesehenen Antworten", () => {
    expect(q1.question.answers.map((a) => a.id)).toEqual(["zufrieden", "mehr", "unklar"]);
    expect(q2.answers.map((a) => a.id)).toEqual(["urlaub", "reisen", "sicherheit", "familie"]);
    expect(q3.answers.map((a) => a.id)).toEqual(["foerderung", "flexibilitaet", "unsicher"]);
    expect(q4.question.answers.map((a) => a.id)).toEqual(["ja", "spaeter"]);
    expect(q5.contact.answers.map((a) => a.id)).toEqual(["ja", "nein"]);
    for (const list of [q1.question.answers, q2.answers, q3.answers, q4.question.answers, q5.contact.answers]) {
      for (const a of list) expect(a.label.trim()).not.toBe("");
    }
  });

  it("jedes Ziel aus Frage 2 hat einen eigenen Satz auf der letzten Seite", () => {
    expect(Object.keys(q5.goalLine).sort()).toEqual(q2.answers.map((a) => a.id).sort());
  });

  it("der Förder-Text nennt die Beträge aus config.ts", () => {
    const values = Object.fromEntries(Object.entries(config.funding).map(([k, v]) => [k, formatNumber(v)]));
    const text = [q4.info.foerderung.title, ...q4.info.foerderung.text].map((t) => fillPlaceholders(t, values)).join(" ");
    expect(text).toContain("bis zu 540\u00a0€ Grundzulage");
    expect(text).toContain("1.800\u00a0€ Eigenbeitrag");
    expect(text).toContain("bis zu 300\u00a0€ Kinderzulage");
    expect(text).not.toContain("{{");
  });

  it("jede Antwort bei Frage 2 hat ein Bild aus public/ und eine Bildunterschrift", () => {
    // Alle Dateien in public/images/ (ohne sie zu laden)
    const files = Object.keys(import.meta.glob("../public/images/*")).map((f) => f.replace("../public/", ""));
    for (const a of q2.answers) {
      expect(files, a.image).toContain(a.image);
      expect(a.caption?.trim()).toBeTruthy();
    }
  });

  it("die Einladung bei Frage 5 wird vollständig befüllt", () => {
    const text = fillPlaceholders(q5.intro, {
      agencyName: config.agencyName,
      agencyLocation: config.agencyLocation,
      appointmentDurationMinutes: config.appointmentDurationMinutes,
    });
    expect(text).toContain("bei uns in der Allianzagentur Thomas Lang in Spiegelau, bei dir zu Hause oder per Video.");
    expect(text).toContain("Ca. 30 Minuten, ganz ohne Verpflichtung.");
    expect(text).not.toContain("{{");
  });

  it("Frage 5: Ja führt zum Kontaktformular, Nein zur Terminbuchung", () => {
    expect(q5.contact.answers.map((a) => a.label)).toEqual([
      "Ja, meldet euch gerne bei mir",
      "Nein, ich vereinbare selbst einen Termin",
    ]);
    expect(q5.yes.button).toBe("Zum Kontaktformular");
    expect(q5.no.button).toBe("Termin online vereinbaren");
    const form = new URL(config.contactFormUrl);
    expect(form.hostname).toBe("www.allianz-vor-ort.de");
    expect(form.searchParams.get("homepagekey")).toBe("thomas.lang1");
    const booking = new URL(config.bookingUrl);
    expect(booking.hostname).toBe("booking.allianz-abv.eps.bookingtime.com");
    expect(booking.searchParams.get("vtnr")).toBe("703400444");
    for (const url of [form, booking]) expect(url.protocol).toBe("https:");
    expect(config.phoneHref).toMatch(/^tel:\+\d+$/);
  });
});

describe("Kontrast", () => {
  it("berechnet bekannte Werte", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#fff", "#fff")).toBeCloseTo(1, 5);
    expect(contrastRatio("kein-hex", "#fff")).toBeNull();
  });

  it("Standardfarben erfüllen WCAG AA", () => {
    const { text, background, primary, primaryHover, heading, cta, tint } = config.colors;
    const pairs: [string, string][] = [
      [text, background],
      [text, tint],
      [primary, background],
      [heading, background],
      [heading, tint],
      ["#FFFFFF", primary],
      ["#FFFFFF", primaryHover],
      ["#FFFFFF", cta],
    ];
    for (const [fg, bg] of pairs) expect(contrastRatio(fg, bg)!, `${fg} auf ${bg}`).toBeGreaterThanOrEqual(4.5);
  });
});
