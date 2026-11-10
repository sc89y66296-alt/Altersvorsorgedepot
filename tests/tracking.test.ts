import { describe, expect, it } from "vitest";
import { resetRun, setSender, trackOnce } from "../src/analytics";
import { placeEvent } from "../src/logic/tracking";
import type { Answers } from "../src/types";

const base: Answers = { monthlyIncome: 3500 };

describe("Statistik", () => {
  it("benennt jede Seite des Checks", () => {
    expect(([1, 2, 3, 4, 5] as const).map((p) => placeEvent(p, base))).toEqual([
      "Frage 1",
      "Frage 2",
      "Frage 3",
      "Frage 4",
      "Frage 5",
    ]);
    expect(placeEvent("sicher", base)).toBe("Nachfrage: Bist du sicher?");
    expect(placeEvent("ende", { ...base, satisfaction: "zufrieden", sure: "beenden" })).toBe("Ende: Rente reicht mir");
    expect(placeEvent("ende", { ...base, satisfaction: "mehr", talk: "spaeter" })).toBe("Ende: Erst mal nicht");
  });

  it("zählt jede Seite pro Durchlauf nur einmal", () => {
    const sent: string[] = [];
    setSender((name) => sent.push(name));
    trackOnce("Frage 1");
    trackOnce("Frage 2");
    trackOnce("Frage 1"); // zurück auf Frage 1
    resetRun();
    trackOnce("Frage 1"); // neuer Durchlauf
    setSender(null);
    expect(sent).toEqual(["Frage 1", "Frage 2", "Frage 1"]);
  });

  it("sendet keine Antworten und kein Einkommen", () => {
    const answers: Answers = { monthlyIncome: 4200, satisfaction: "mehr", goal: "reisen", priority: "foerderung" };
    for (const place of [1, 2, 3, 4, 5, "sicher", "ende"] as const) {
      const name = placeEvent(place, answers);
      expect(name).not.toMatch(/4200|4\.200|reisen|foerderung/i);
    }
  });
});
