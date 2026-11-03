// Überspring-Logik (Briefing 5.1). Reine Funktionen ohne DOM-Zugriff.
//
// Gespeichert werden nur die Antworten, die jemand selbst gegeben hat. Automatische
// Antworten werden bei jedem Aufruf neu abgeleitet – fällt die Bedingung weg, ist
// auch die automatische Antwort weg und die Frage wird wieder normal gestellt.

import type { AnswerId, Answers } from "../types";

interface SkipRule {
  question: number;
  autoAnswer: AnswerId;
  applies: (given: Answers) => boolean;
}

export const skipRules: SkipRule[] = [
  { question: 6, autoAnswer: "6d", applies: (given) => given[5] === "5a" },
  { question: 10, autoAnswer: "10d", applies: (given) => given[1] === "1a" || given[1] === "1b" },
];

export function isSkipped(question: number, given: Answers): boolean {
  return skipRules.some((rule) => rule.question === question && rule.applies(given));
}

/** Eigene Antworten plus automatisch gesetzte Antworten für übersprungene Fragen. */
export function effectiveAnswers(given: Answers): Answers {
  const result: Answers = { ...given };
  for (const rule of skipRules) {
    if (rule.applies(given)) result[rule.question] = rule.autoAnswer;
  }
  return result;
}

/** Nächste nicht übersprungene Frage, oder null, wenn danach das Ergebnis kommt. */
export function nextQuestion(current: number, given: Answers, total: number): number | null {
  for (let q = current + 1; q <= total; q++) {
    if (!isSkipped(q, given)) return q;
  }
  return null;
}

/** Vorherige nicht übersprungene Frage, oder null auf der ersten Frage. */
export function previousQuestion(current: number, given: Answers): number | null {
  for (let q = current - 1; q >= 1; q--) {
    if (!isSkipped(q, given)) return q;
  }
  return null;
}
