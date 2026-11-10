// Namen der anonymen Zählpunkte für die Statistik. Gezählt wird nur, welche Seite
// erreicht und welcher Button geklickt wurde – keine Antworten, kein Einkommen.

import type { Answers, Place } from "../types";
import { endReason } from "./flow";

export const CLICK_EVENTS = {
  contactForm: "Klick: Kontaktformular",
  booking: "Klick: Terminbuchung",
  call: "Klick: Anrufen",
  bookingLater: "Klick: Terminbuchung (Abschlussseite)",
  callLater: "Klick: Anrufen (Abschlussseite)",
} as const;

/** Ereignis, wenn jemand eine Seite des Checks erreicht. */
export function placeEvent(place: Place, answers: Answers): string {
  switch (place) {
    case "sicher":
      return "Nachfrage: Bist du sicher?";
    case "ende":
      return endReason(answers) === "zufrieden" ? "Ende: Rente reicht mir" : "Ende: Erst mal nicht";
    default:
      return `Frage ${place}`;
  }
}
