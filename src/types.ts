// Antwort-Kürzel. Sie sind interne IDs – die Ablauf-Logik in src/logic/flow.ts hängt daran.

export type SatisfactionId = "zufrieden" | "mehr"; // Frage 1
export type SureId = "weiter" | "beenden"; // Nachfrage nach „Ja, das würde mir reichen“
export type GoalId = "urlaub" | "reisen" | "sicherheit" | "familie"; // Frage 2
export type PriorityId = "foerderung" | "flexibilitaet" | "unsicher"; // Frage 3
export type TalkId = "ja" | "spaeter"; // Frage 4
export type ContactId = "ja" | "nein"; // Frage 5

export type Step = 1 | 2 | 3 | 4 | 5;

/** Alle Seiten des Checks: die fünf Fragen, die Nachfrage „Bist du dir sicher?“ und die Abschlussseite. */
export type Place = Step | "sicher" | "ende";

/** Warum der Check vorzeitig endet. */
export type EndReason = "zufrieden" | "spaeter";

/** Alles, was im Check angegeben wurde. Liegt nur im Arbeitsspeicher. */
export interface Answers {
  monthlyIncome: number; // Brutto pro Monat (Schieberegler bei Frage 1)
  satisfaction?: SatisfactionId;
  sure?: SureId;
  goal?: GoalId;
  priority?: PriorityId;
  talk?: TalkId;
  contact?: ContactId;
}
