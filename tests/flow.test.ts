import { describe, expect, it } from "vitest";
import { isAnswered, nextStep, previousStep } from "../src/logic/flow";
import { summaryLines } from "../src/logic/summary";
import type { Answers } from "../src/types";

const base: Answers = { monthlyIncome: 3500 };

describe("Ablauf", () => {
  it("Förderung oder Flexibilität: alle fünf Fragen der Reihe nach", () => {
    for (const priority of ["foerderung", "flexibilitaet"] as const) {
      const answers = { ...base, priority };
      expect([1, 2, 3, 4].map((s) => nextStep(s as 1, answers))).toEqual([2, 3, 4, 5]);
      expect(nextStep(5, answers)).toBeNull();
      expect(previousStep(5, answers)).toBe(4);
    }
  });

  it("„Ich bin mir unsicher“ springt von Frage 3 direkt zur Terminvereinbarung", () => {
    const answers: Answers = { ...base, priority: "unsicher" };
    expect(nextStep(3, answers)).toBe(5);
    expect(previousStep(5, answers)).toBe(3);
  });

  it("Zurück auf Frage 1 gibt es nicht", () => {
    expect(previousStep(1, base)).toBeNull();
    expect(previousStep(2, base)).toBe(1);
  });

  it("„Weiter“ erst nach einer Antwort", () => {
    expect(isAnswered(1, base)).toBe(false);
    expect(isAnswered(1, { ...base, satisfaction: "mehr" })).toBe(true);
    expect(isAnswered(2, { ...base, goal: "reisen" })).toBe(true);
    expect(isAnswered(3, base)).toBe(false);
    expect(isAnswered(4, { ...base, talk: "ja" })).toBe(true);
  });
});

describe("Zusammenfassung", () => {
  const answers: Answers = { monthlyIncome: 3500, satisfaction: "mehr", goal: "reisen", priority: "foerderung" };

  it("fasst Einkommen, Rente, Ziel und Vorsorge-Wunsch zusammen", () => {
    expect(summaryLines(answers)).toEqual([
      "Bruttoeinkommen: 3.500\u00a0€ im Monat",
      "Geschätzte gesetzliche Rente: ca. 1.547\u00a0€ im Monat",
      "Im Alter wichtig: Reisen & Urlaub",
      "Bei der Vorsorge wichtig: Maximale staatliche Förderung – auch wenn das Geld dafür bis zur Rente gebunden ist",
    ]);
  });

  it("lässt nicht beantwortete Fragen weg", () => {
    expect(summaryLines(base)).toHaveLength(2);
  });
});
