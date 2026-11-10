// Ablauf des Checks. Reine Funktionen ohne DOM-Zugriff.
//
// 1 → 2 → 3 → 4 → 5
// Zwei Ausstiege auf die Abschlussseite („ende“):
// - Frage 1 „Ja, das würde mir reichen“ → einmal nachfragen („sicher“): weiter zu 2 oder beenden
// - Frage 4 „Erst mal nicht“ → direkt beenden, ohne Nachfrage
// Frage 4 erklärt, was zur Antwort bei Frage 3 passt – bei „Ich möchte erst mehr wissen“ beides.

import type { Answers, EndReason, Place, PriorityId } from "../types";

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

/** Über welchen Ausstieg jemand auf der Abschlussseite gelandet ist. */
export function endReason(answers: Answers): EndReason {
  return answers.satisfaction === "zufrieden" && answers.sure === "beenden" ? "zufrieden" : "spaeter";
}

/** Nächste Seite oder null, wenn es nicht weitergeht. */
export function nextPlace(current: Place, answers: Answers): Place | null {
  switch (current) {
    case 1:
      return answers.satisfaction === "zufrieden" ? "sicher" : 2;
    case "sicher":
      return answers.sure === "beenden" ? "ende" : 2;
    case 2:
    case 3:
      return (current + 1) as Place;
    case 4:
      return answers.talk === "spaeter" ? "ende" : 5;
    case 5:
    case "ende":
      return null;
  }
}

/** Vorherige Seite oder null auf der ersten. */
export function previousPlace(current: Place, answers: Answers): Place | null {
  switch (current) {
    case 1:
      return null;
    case "sicher":
      return 1;
    case 2:
      return answers.satisfaction === "zufrieden" ? "sicher" : 1;
    case 3:
    case 4:
    case 5:
      return (current - 1) as Place;
    case "ende":
      return endReason(answers) === "zufrieden" ? "sicher" : 4;
  }
}

/** Darf man mit „Weiter“ zur nächsten Seite? */
export function isAnswered(place: Place, answers: Answers): boolean {
  switch (place) {
    case 1:
      return answers.satisfaction !== undefined;
    case "sicher":
      return answers.sure !== undefined;
    case 2:
      return answers.goal !== undefined;
    case 3:
      return answers.priority !== undefined;
    case 4:
      return answers.talk !== undefined;
    case 5:
    case "ende":
      return true; // kein „Weiter“
  }
}
