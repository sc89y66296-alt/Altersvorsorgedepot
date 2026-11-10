// Ablauf der fünf Fragen. Reine Funktionen ohne DOM-Zugriff.
//
// 1 → 2 → 3 → 4 → 5
// Wer bei Frage 3 „Ich bin mir unsicher“ wählt, springt direkt zu Frage 5 (Terminvereinbarung).

import type { Answers, Step } from "../types";

export const TOTAL_STEPS = 5;

export function skipsInfoStep(answers: Answers): boolean {
  return answers.priority === "unsicher";
}

/** Nächste Frage oder null nach der letzten. */
export function nextStep(current: Step, answers: Answers): Step | null {
  if (current === 3 && skipsInfoStep(answers)) return 5;
  return current < TOTAL_STEPS ? ((current + 1) as Step) : null;
}

/** Vorherige Frage oder null auf der ersten. */
export function previousStep(current: Step, answers: Answers): Step | null {
  if (current === 5 && skipsInfoStep(answers)) return 3;
  return current > 1 ? ((current - 1) as Step) : null;
}

/** Darf man mit „Weiter“ zur nächsten Frage? */
export function isAnswered(step: Step, answers: Answers): boolean {
  switch (step) {
    case 1:
      return answers.satisfaction !== undefined;
    case 2:
      return answers.goal !== undefined;
    case 3:
      return answers.priority !== undefined;
    case 4:
      return answers.talk !== undefined;
    case 5:
      return true; // letzte Seite, kein „Weiter“
  }
}
