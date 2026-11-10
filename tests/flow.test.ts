import { describe, expect, it } from "vitest";
import { endReason, infoTopics, isAnswered, nextPlace, previousPlace } from "../src/logic/flow";
import { summaryLines } from "../src/logic/summary";
import type { Answers } from "../src/types";

const base: Answers = { monthlyIncome: 3500 };

describe("Ablauf", () => {
  const keen: Answers = { ...base, satisfaction: "mehr", talk: "ja" };

  it("wer mehr Rente möchte und sprechen will, geht alle fünf Fragen der Reihe nach", () => {
    for (const priority of ["foerderung", "flexibilitaet", "unsicher"] as const) {
      const answers = { ...keen, priority };
      expect(([1, 2, 3, 4] as const).map((p) => nextPlace(p, answers))).toEqual([2, 3, 4, 5]);
      expect(nextPlace(5, answers)).toBeNull();
      expect(([2, 3, 4, 5] as const).map((p) => previousPlace(p, answers))).toEqual([1, 2, 3, 4]);
    }
  });

  it("„Ja, das würde mir reichen“ führt zur Nachfrage, von dort weiter oder zum Ende", () => {
    const happy: Answers = { ...base, satisfaction: "zufrieden" };
    expect(nextPlace(1, happy)).toBe("sicher");
    expect(previousPlace("sicher", happy)).toBe(1);

    const goOn: Answers = { ...happy, sure: "weiter" };
    expect(nextPlace("sicher", goOn)).toBe(2);
    expect(previousPlace(2, goOn)).toBe("sicher");

    const stop: Answers = { ...happy, sure: "beenden" };
    expect(nextPlace("sicher", stop)).toBe("ende");
    expect(endReason(stop)).toBe("zufrieden");
    expect(previousPlace("ende", stop)).toBe("sicher");
  });

  it("„Erst mal nicht“ bei Frage 4 beendet den Check ohne Nachfrage", () => {
    const later: Answers = { ...base, satisfaction: "mehr", talk: "spaeter" };
    expect(nextPlace(4, later)).toBe("ende");
    expect(endReason(later)).toBe("spaeter");
    expect(previousPlace("ende", later)).toBe(4);
    // auch nach „Stimmt, ich schaue doch weiter“
    const afterSure: Answers = { ...later, satisfaction: "zufrieden", sure: "weiter" };
    expect(nextPlace(4, afterSure)).toBe("ende");
    expect(endReason(afterSure)).toBe("spaeter");
  });

  it("wer bei Frage 1 umentscheidet, bekommt keine Nachfrage mehr", () => {
    expect(nextPlace(1, { ...base, satisfaction: "mehr", sure: "beenden" })).toBe(2);
    expect(previousPlace(2, { ...base, satisfaction: "mehr", sure: "beenden" })).toBe(1);
  });

  it("Frage 4 erklärt die gewählte Vorsorge – bei „Ich möchte erst mehr wissen“ beide", () => {
    expect(infoTopics({ ...base, priority: "foerderung" })).toEqual(["foerderung"]);
    expect(infoTopics({ ...base, priority: "flexibilitaet" })).toEqual(["flexibilitaet"]);
    expect(infoTopics({ ...base, priority: "unsicher" })).toEqual(["foerderung", "flexibilitaet"]);
  });

  it("Zurück auf Frage 1 gibt es nicht, auf der Abschlussseite gibt es kein Weiter", () => {
    expect(previousPlace(1, base)).toBeNull();
    expect(nextPlace("ende", base)).toBeNull();
  });

  it("„Weiter“ erst nach einer Antwort", () => {
    expect(isAnswered(1, base)).toBe(false);
    expect(isAnswered(1, { ...base, satisfaction: "mehr" })).toBe(true);
    expect(isAnswered("sicher", base)).toBe(false);
    expect(isAnswered("sicher", { ...base, sure: "weiter" })).toBe(true);
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
