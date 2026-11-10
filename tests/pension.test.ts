import { describe, expect, it } from "vitest";
import { config } from "../src/config";
import { estimatePension } from "../src/logic/pension";

const values = {
  currentPensionValue: 42.52,
  averageAnnualIncome: 51944,
  contributionCeilingMonthly: 8450,
  workingYears: 45,
};

describe("Rentenschätzung", () => {
  it("Durchschnittsverdienst ergibt die Standardrente (45 Entgeltpunkte × Rentenwert)", () => {
    const estimate = estimatePension(51944 / 12, values);
    expect(estimate.monthlyPension).toBe(Math.round(45 * 42.52)); // 1.913 €
    expect(estimate.aboveCeiling).toBe(false);
  });

  it("3.500 € brutto ergeben ca. 1.547 € Rente und eine Lücke von ca. 1.953 €", () => {
    const estimate = estimatePension(3500, values);
    expect(estimate.monthlyPension).toBe(1547);
    expect(estimate.gap).toBe(1953);
    expect(estimate.percentOfIncome).toBe(44);
  });

  it("Einkommen über der Beitragsbemessungsgrenze zählt nicht mit", () => {
    const atCeiling = estimatePension(8450, values);
    const above = estimatePension(10000, values);
    expect(above.monthlyPension).toBe(atCeiling.monthlyPension);
    expect(above.aboveCeiling).toBe(true);
    expect(atCeiling.aboveCeiling).toBe(false);
    expect(above.gap).toBeGreaterThan(atCeiling.gap);
  });

  it("die Rente steigt mit dem Einkommen", () => {
    expect(estimatePension(2000, values).monthlyPension).toBeLessThan(estimatePension(4000, values).monthlyPension);
  });

  it("kein Einkommen ergibt keine Rente und keine Division durch 0", () => {
    expect(estimatePension(0, values)).toEqual({ monthlyPension: 0, gap: 0, percentOfIncome: 0, aboveCeiling: false });
  });

  it("die Werte in config.ts sind plausibel", () => {
    const { incomeSlider: s, pension: p } = config;
    expect(s.min).toBeLessThan(s.max);
    expect(s.start).toBeGreaterThanOrEqual(s.min);
    expect(s.start).toBeLessThanOrEqual(s.max);
    expect((s.start - s.min) % s.step).toBe(0);
    expect(p.currentPensionValue).toBeGreaterThan(30);
    expect(p.averageAnnualIncome).toBeGreaterThan(40000);
    expect(p.contributionCeilingMonthly).toBeLessThan(s.max); // Hinweis zur Grenze ist erreichbar
  });
});
