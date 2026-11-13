// Texte für Startseite, Buttons, Terminbuchung und Disclaimer.
// {{…}} sind Platzhalter, die aus src/config.ts befüllt werden.

export const copy = {
  start: {
    photoAlt: "Das fünfköpfige Team der Allianz Agentur Thomas Lang im Freien, alle lächeln und zeigen den Daumen nach oben",
    title: "Passt das Altersvorsorgedepot zu deiner Situation?",
    subtitle:
      "5 kurze Fragen, ca. 2 Minuten. Du siehst direkt, wie viel gesetzliche Rente du ungefähr erwarten kannst – und welche Vorsorge zu dir passt.",
    privacyNote:
      "Anonym – wir fragen nicht nach Name oder Kontaktdaten. Deine Angaben bleiben auf deinem Gerät und werden nicht gespeichert.",
    button: "Los geht's",
    disclaimer: "Dieser Check gibt dir eine erste Orientierung und ersetzt keine persönliche Beratung.",
  },
  question: {
    progress: (current: number, total: number) => `Frage ${current} von ${total}`,
    back: "Zurück",
    next: "Weiter",
  },
  summary: {
    heading: "Deine Angaben",
    income: "Bruttoeinkommen: {{income}} € im Monat",
    pension: "Geschätzte gesetzliche Rente: ca. {{pension}} € im Monat",
    goal: "Im Alter wichtig: {{goal}}",
    priority: "Bei der Vorsorge wichtig: {{priority}}",
  },
  final: {
    callButton: "Anrufen: {{phone}}",
    newTabNote: "Die Seite öffnet sich in einem neuen Tab. Dort gelten die Datenschutzhinweise der Allianz bzw. ihres Kalender-Dienstleisters bookingtime; deine Angaben aus dem Check werden nicht übertragen.",
    disclaimer:
      "Dieser Check gibt dir eine erste Orientierung und ersetzt keine persönliche Beratung. Die Rentenschätzung ist stark vereinfacht; deine tatsächliche Rente steht in deiner Renteninformation der Deutschen Rentenversicherung. Förderung und Steuervorteile hängen von deiner persönlichen Situation und den Vertragsbedingungen ab. Deine Angaben werden nicht gespeichert.",
    restart: "Check neu starten",
  },
  footer: {
    imprint: "Impressum",
    privacy: "Datenschutz",
  },
};

export function fillPlaceholders(text: string, values: Record<string, string | number>): string {
  return keepEuroTogether(
    text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => (key in values ? String(values[key]) : match)),
  );
}

/** Geschütztes Leerzeichen zwischen Zahl und €, damit „1.800 €“ nicht umbricht. */
export function keepEuroTogether(text: string): string {
  return text.replace(/(\d) €/g, "$1\u00a0€");
}

const euroFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });

/** 3500 -> "3.500", 42.52 -> "42,52" */
export function formatNumber(value: number): string {
  return euroFormat.format(value);
}
