// Texte für Start- und Ergebnisseite, Buttons und Disclaimer. Wörtlich laut Briefing.
// {{…}} sind Platzhalter, die aus src/config.ts befüllt werden.

import type { Level } from "../types";

export const copy = {
  start: {
    title: "Bist du nach dem Studium richtig abgesichert?",
    subtitle:
      "10 kurze Fragen, ca. 2 Minuten. Du bekommst direkt danach eine Übersicht, welche Themen bei dir gerade dran sein könnten.",
    privacyNote:
      "Anonym – wir fragen nicht nach Name, Kontaktdaten oder Gesundheit, und deine Antworten werden nicht gespeichert.",
    button: "Los geht's",
    disclaimer: "Dieser Check gibt dir eine erste Orientierung und ersetzt keine persönliche Beratung.",
  },
  question: {
    progress: (current: number, total: number) => `Frage ${current} von ${total}`,
    back: "Zurück",
    next: "Weiter",
  },
  result: {
    heading: "Dein Ergebnis: Das solltest du auf dem Schirm haben",
    intro:
      "Nach dem Studium ändert sich ziemlich viel auf einmal – neue Stadt, erster Job, eigene Wohnung. Bei manchen Versicherungen passiert dabei still und leise ein Wechsel, den man leicht verpasst. Hier sind die Themen, die bei dir gerade dran sein könnten:",
    moreHeading: "Weitere Themen für dich",
    invitation:
      "Du musst das nicht allein sortieren. In einem kostenlosen Gespräch schauen wir gemeinsam auf deine Situation – ganz ohne Verpflichtung und ohne dass du am Ende etwas abschließen musst. Ca. {{appointmentDurationMinutes}} Minuten, {{appointmentFormats}}, wie es dir lieber ist. Bring gern die Unterlagen mit, die deine Eltern dir mitgegeben haben – oft klärt sich schon dadurch viel.",
    bookingButton: "Kostenlosen Termin vereinbaren",
    newTabHint: "(öffnet in neuem Tab)",
    advisorLegend: "Mit wem möchtest du sprechen?",
    advisorPrivacy:
      "Nach deiner Auswahl wird hier der Buchungskalender unseres Dienstleisters bookingtime geladen. Deine Antworten aus dem Check werden dabei nicht übertragen.",
    calendarHint: "Wähle im Kalender beim Schritt „Mitarbeiter wählen“ {{name}} aus.",
    calendarTitle: "Online-Terminbuchung",
    calendarNewTab: "Kalender in neuem Tab öffnen",
    noCalendar: "Für einen Termin mit {{name}} ruf uns gerne an – wir finden direkt einen passenden Zeitpunkt.",
    callButton: "Anrufen: {{phone}}",
    disclaimer:
      "Dieser Check gibt dir eine erste Orientierung und ersetzt keine persönliche Beratung. Ob und welcher Schutz für dich sinnvoll ist, hängt von deiner individuellen Situation und den jeweiligen Vertragsbedingungen ab. Deine Antworten werden nicht gespeichert.",
    restart: "Check neu starten",
  },
  footer: {
    imprint: "Impressum",
    privacy: "Datenschutz",
    initialInfo: "Erstinformation",
  },
  levelLabels: {
    now: "Jetzt anschauen",
    soon: "Bald anschauen",
    info: "Gut zu wissen",
  } satisfies Record<Level, string>,
};

export function fillPlaceholders(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
