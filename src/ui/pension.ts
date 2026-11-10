import { config } from "../config";
import { fillPlaceholders, formatNumber, keepEuroTogether } from "../content/copy";
import { q1 } from "../content/questions";
import { estimatePension } from "../logic/pension";
import { el } from "./dom";

/** Schieberegler für das Einkommen plus live berechnete Rentenschätzung (Frage 1). */
export function renderPensionSlider(start: number, onChange: (income: number) => void): HTMLElement {
  const { min, max, step } = config.incomeSlider;
  const p = config.pension;

  const slider = el("input", {
    type: "range",
    id: "income",
    class: "income-slider",
    min: String(min),
    max: String(max),
    step: String(step),
  });
  slider.value = String(start);

  const incomeValue = el("output", { class: "income-value", for: "income" });
  const pensionValue = el("p", { class: "pension-value" });
  const resultLine = el("p", { class: "pension-line" });
  const ceilingLine = el("p", { class: "pension-ceiling", hidden: true });

  const update = () => {
    const income = Number(slider.value);
    const estimate = estimatePension(income, p);
    const incomeText = keepEuroTogether(`${formatNumber(income)} €`);
    incomeValue.textContent = incomeText;
    slider.setAttribute("aria-valuetext", `${incomeText} brutto im Monat`);
    pensionValue.textContent = keepEuroTogether(`ca. ${formatNumber(estimate.monthlyPension)} €`);
    resultLine.textContent = fillPlaceholders(q1.resultLine, { percent: estimate.percentOfIncome });
    ceilingLine.textContent = fillPlaceholders(q1.aboveCeiling, { ceiling: formatNumber(p.contributionCeilingMonthly) });
    ceilingLine.hidden = !estimate.aboveCeiling;
    onChange(income);
  };
  slider.addEventListener("input", update);
  update();

  return el(
    "div",
    { class: "pension-calc" },
    el(
      "div",
      { class: "income-field" },
      el("label", { for: "income", class: "income-label" }, q1.sliderLabel),
      incomeValue,
    ),
    slider,
    el(
      "div",
      { class: "pension-result", "aria-live": "polite" },
      el("p", { class: "pension-label" }, q1.resultLabel),
      pensionValue,
      resultLine,
      ceilingLine,
      el("p", { class: "pension-note" }, q1.shortNote),
    ),
  );
}

/** Ausführliche Erklärung der Schätzung – steht am Ende von Frage 1, unter den Antworten. */
export function renderPensionFootnote(): HTMLElement {
  const p = config.pension;
  const text = fillPlaceholders(q1.footnote, {
    years: p.workingYears,
    pensionValue: formatNumber(p.currentPensionValue),
    level: p.pensionLevelPercent,
  });
  return el("p", { class: "disclaimer pension-footnote" }, text);
}
