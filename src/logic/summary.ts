// Zusammenfassung der Angaben auf der letzten Seite (Frage 5).

import { config } from "../config";
import { copy, fillPlaceholders, formatNumber } from "../content/copy";
import { q2, q3 } from "../content/questions";
import type { Answers } from "../types";
import { estimatePension } from "./pension";

const labelOf = (answers: { id: string; label: string }[], id: string | undefined) =>
  answers.find((a) => a.id === id)?.label;

export function summaryLines(answers: Answers): string[] {
  const pension = estimatePension(answers.monthlyIncome, config.pension).monthlyPension;
  const goal = labelOf(q2.answers, answers.goal);
  const priority = labelOf(q3.answers, answers.priority);
  return [
    fillPlaceholders(copy.summary.income, { income: formatNumber(answers.monthlyIncome) }),
    fillPlaceholders(copy.summary.pension, { pension: formatNumber(pension) }),
    goal ? fillPlaceholders(copy.summary.goal, { goal }) : null,
    priority ? fillPlaceholders(copy.summary.priority, { priority }) : null,
  ].filter((line): line is string => line !== null);
}
