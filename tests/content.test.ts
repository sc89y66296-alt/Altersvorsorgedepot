import { describe, expect, it } from "vitest";
import { config } from "../src/config";
import { copy, fillPlaceholders } from "../src/content/copy";
import { hints } from "../src/content/hints";
import { questions } from "../src/content/questions";
import { contrastRatio } from "../src/logic/contrast";
import type { HintId } from "../src/types";

describe("Inhalte", () => {
  it("es gibt genau 10 Fragen, durchnummeriert", () => {
    expect(questions.map((q) => q.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("jede Frage hat genau 4 Antworten mit passenden Kürzeln", () => {
    for (const q of questions) {
      expect(q.answers.map((a) => a.id)).toEqual(["a", "b", "c", "d"].map((l) => `${q.number}${l}`));
      for (const a of q.answers) expect(a.label.trim()).not.toBe("");
    }
  });

  it("alle Kürzel sind eindeutig", () => {
    const ids = questions.flatMap((q) => q.answers.map((a) => a.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("Themen-Zeilen stehen nicht im Fragetext", () => {
    expect(questions.filter((q) => q.topic).map((q) => [q.number, q.topic])).toEqual([
      [4, "Haftpflicht"],
      [6, "Hausrat"],
      [9, "Berufsunfähigkeit"],
    ]);
    for (const q of questions) if (q.topic) expect(q.text).not.toContain(`(${q.topic})`);
  });

  it("jeder Hinweis H0–H7 hat Überschrift und Text", () => {
    const ids: HintId[] = ["H0", "H1a", "H1b", "H1c", "H2a", "H2b", "H3", "H4a", "H4b", "H5", "H6a", "H6b", "H7"];
    expect(Object.keys(hints).sort()).toEqual([...ids].sort());
    for (const id of ids) {
      expect(hints[id].title.trim()).not.toBe("");
      expect(hints[id].text.trim()).not.toBe("");
    }
  });

  it("Einladung ergibt mit den Standardwerten den Satz aus dem Briefing", () => {
    const text = fillPlaceholders(copy.result.invitation, {
      appointmentDurationMinutes: config.appointmentDurationMinutes,
      appointmentFormats: config.appointmentFormats,
    });
    expect(text).toContain("Ca. 30 Minuten, bei uns in Passau oder per Video, wie es dir lieber ist.");
    expect(text).not.toContain("{{");
  });

  it("Ansprechpartner:innen sind vollständig und eindeutig", () => {
    expect(config.advisors.map((a) => a.name)).toEqual(["Thomas Lang", "Francesco Schrönghamer", "Jonas Kroiss"]);
    const ids = config.advisors.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const a of config.advisors) {
      if (a.bookingUrl) expect(new URL(a.bookingUrl).protocol).toBe("https:");
    }
    expect(config.advisors.some((a) => !a.bookingUrl)).toBe(true); // Fallback auf Telefon wird genutzt
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
    expect(contrastRatio(config.colors.text, config.colors.background)!).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(config.colors.primary, config.colors.background)!).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#FFFFFF", config.colors.primary)!).toBeGreaterThanOrEqual(4.5);
  });
});
