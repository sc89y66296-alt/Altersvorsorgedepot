// Ablauf der fünf Fragen. Reine Funktionen ohne DOM-Zugriff.
//
// 1 → 2 → 3 → 4 → 5, ohne Sprünge.
// Frage 4 erklärt, was zur Antwort bei Frage 3 passt – bei „Ich möchte erst mehr wissen“ beides.

import type { Answers, PriorityId, Step } from "../types";

export const TOTAL_STEPS = 5;

export type InfoTopic = Exclude<PriorityId, "unsicher">;

/** Welche Erklärungen Frage 4 zeigt. */
export function infoTopics(answers: Answers): InfoTopic[] {
  switch (answers.priority) {
    case "flexibilitaet":
      return ["flexibilitaet"];
    case "unsicher":
      return ["foerderung", "flexibilitaet"];
    default:
      return ["foerderung"];
  }
}

/** Nächste Frage oder null nach der letzten. */
export function nextStep(current: Step, _answers: Answers): Step | null {
  return current < TOTAL_STEPS ? ((current + 1) as Step) : null;
}

/** Vorherige Frage oder null auf der ersten. */
export function previousStep(current: Step, _answers: Answers): Step | null {
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
