// Die fünf Fragen des Checks. Nur die Texte (label, text, …) ändern –
// die Kürzel (id) sind interne IDs, an denen die Ablauf-Logik hängt.
// {{…}} sind Platzhalter, die aus src/config.ts befüllt werden.

import type { ContactId, GoalId, PriorityId, SatisfactionId, TalkId } from "../types";

export interface Answer<Id extends string = string> {
  id: Id;
  label: string;
  image?: string; // Bild über der Antwort (Pfad relativ zu public/, z. B. "images/urlaub.svg")
  caption?: string; // Bildunterschrift unter der Antwort
}

export interface ChoiceQuestion<Id extends string = string> {
  topic?: string; // kleine Themen-Zeile über der Frage
  text: string;
  answers: Answer<Id>[];
}

// Frage 1: Schieberegler + „Würde dir das reichen?“
export const q1 = {
  topic: "Deine gesetzliche Rente",
  sliderLabel: "Dein Bruttoeinkommen pro Monat",
  resultLabel: "Geschätzte gesetzliche Rente pro Monat",
  shortNote: "Vereinfachte Schätzung, brutto, in heutigen Werten – Details unten.",
  resultLine: "Das sind rund {{percent}} % deines heutigen Bruttoeinkommens – dir fehlen im Alter ca. {{gap}} € im Monat.",
  aboveCeiling:
    "Einkommen über {{ceiling}} € im Monat (Beitragsbemessungsgrenze) erhöht die gesetzliche Rente nicht mehr – die Lücke wird damit größer.",
  footnote:
    "Vereinfachte Schätzung: {{years}} Jahre mit diesem Einkommen, heutige Werte (Rentenwert {{pensionValue}} €), vor Steuern und Krankenversicherung. Das gesetzliche Rentenniveau von {{level}} % bezieht sich auf einen Durchschnittsverdienst nach Sozialabgaben – im Verhältnis zum Brutto bleibt deshalb weniger übrig.",
  question: {
    text: "Wärst du mit dieser Rente im Alter zufrieden?",
    answers: [
      { id: "zufrieden", label: "Ja, das würde mir reichen" },
      { id: "mehr", label: "Nein, ich hätte gern mehr" },
    ],
  } satisfies ChoiceQuestion<SatisfactionId>,
};

export const q2: ChoiceQuestion<GoalId> = {
  topic: "Dein Ruhestand",
  text: "Was ist dir im Alter am wichtigsten?",
  answers: [
    {
      id: "urlaub",
      label: "Auswandern ans Meer",
      image: "images/urlaub.svg",
      caption: "Liegestuhl, Meer und kein Wecker",
    },
    {
      id: "reisen",
      label: "Reisen & Urlaub",
      image: "images/reisen.svg",
      caption: "Koffer packen und endlich los",
    },
    {
      id: "sicherheit",
      label: "Sicherheit ohne Geldsorgen",
      image: "images/sicherheit.svg",
      caption: "Ein warmes Zuhause, ruhige Abende",
    },
    {
      id: "familie",
      label: "Familie & Enkel unterstützen",
      image: "images/familie.svg",
      caption: "Zeit und Geld für die Liebsten",
    },
  ],
};

export const q3: ChoiceQuestion<PriorityId> = {
  topic: "Deine Vorsorge",
  text: "Was ist dir bei deiner Vorsorge persönlich wichtiger?",
  answers: [
    { id: "foerderung", label: "Maximale staatliche Förderung – auch wenn das Geld dafür bis zur Rente gebunden ist" },
    { id: "flexibilitaet", label: "Flexibilität – ich möchte bei Bedarf an mein Geld kommen" },
    { id: "unsicher", label: "Ich möchte erst mehr wissen – was bedeuten Förderung und Flexibilität genau?" },
  ],
};

// Frage 4: Info je nach Antwort bei Frage 3, danach „Möchtest du darüber sprechen?“
// Bei „Ich möchte erst mehr wissen“ stehen beide Erklärungen untereinander unter bothTitle.
export const q4 = {
  topic: "Passt zu dir",
  bothTopic: "Kurz erklärt",
  bothTitle: "Förderung oder Flexibilität – das steckt dahinter",
  info: {
    foerderung: {
      title: "Altersvorsorgedepot: bis zu {{maxBaseAllowance}} € Zuschuss vom Staat – jedes Jahr",
      text: [
        "Ab 2027 gibt es das neue Altersvorsorgedepot. Der Staat legt auf deine Einzahlungen bis zu {{maxBaseAllowance}} € Grundzulage pro Jahr drauf (bei {{contributionForMaxAllowance}} € Eigenbeitrag im Jahr).",
        "Für jedes Kind mit Kindergeld kommen bis zu {{childAllowance}} € Kinderzulage pro Jahr dazu. Das Geld ist dafür bis zum Rentenbeginn gebunden.",
      ],
    },
    flexibilitaet: {
      title: "Private Rente: flexibel bleiben und Steuern sparen",
      text: [
        "Mit einer Privatrente der Allianz bleibst du beweglich: Beiträge lassen sich anpassen oder pausieren, und bei Bedarf kommst du an dein Geld.",
        "Gleichzeitig kannst du von Steuervorteilen profitieren, zum Beispiel bei der Auszahlung im Alter.",
      ],
    },
  } satisfies Record<Exclude<PriorityId, "unsicher">, { title: string; text: string[] }>,
  question: {
    text: "Möchtest du in einem kurzen Gespräch herausfinden, wie viel das für dich ausmacht?",
    answers: [
      { id: "ja", label: "Ja, gerne" },
      { id: "spaeter", label: "Erst mal nicht" },
    ],
  } satisfies ChoiceQuestion<TalkId>,
};

// Frage 5: Rückmelde-Erlaubnis – führt zum Kontaktformular (Ja) oder zur Online-Terminbuchung (Nein)
export const q5 = {
  topic: "Dein nächster Schritt",
  intro:
    "Jede Situation ist anders. In einem kostenlosen Orientierungsgespräch schauen wir gemeinsam, was zu dir passt – bei uns in der {{agencyName}} in {{agencyLocation}}, bei dir zu Hause oder per Video. Ca. {{appointmentDurationMinutes}} Minuten, ganz ohne Verpflichtung.",
  goalLine: {
    urlaub: "Damit der Traum vom Leben am Meer im Ruhestand wahr wird, lohnt sich ein früher Blick auf deine Lücke.",
    reisen: "Damit du im Ruhestand reisen und Urlaub machen kannst, lohnt sich ein früher Blick auf deine Lücke.",
    sicherheit: "Damit du im Alter ohne Geldsorgen lebst, lohnt sich ein früher Blick auf deine Lücke.",
    familie: "Damit du im Alter auch deine Familie unterstützen kannst, lohnt sich ein früher Blick auf deine Lücke.",
  } satisfies Record<GoalId, string>,
  contact: {
    text: "Dürfen wir uns proaktiv bei dir melden?",
    answers: [
      { id: "ja", label: "Ja, meldet euch gerne bei mir" },
      { id: "nein", label: "Nein, ich vereinbare selbst einen Termin" },
    ],
  } satisfies ChoiceQuestion<ContactId>,
  yes: {
    text: "Prima! Trag im Kontaktformular unserer Allianz-Seite kurz deine Daten ein und setz den Haken bei der Einwilligung – dann melden wir uns bei dir.",
    button: "Zum Kontaktformular",
  },
  no: {
    text: "Dann such dir direkt in unserem Kalender einen passenden Termin aus – bei dir zu Hause, bei uns in der Agentur oder online. Kostenlos und unverbindlich.",
    button: "Termin online vereinbaren",
  },
};
