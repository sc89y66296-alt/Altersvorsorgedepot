export type AnswerId = string; // z. B. "1a", "4b"
export type Answers = Record<number, AnswerId>; // Frage-Nr. -> Antwort-Kürzel

export type Level = "now" | "soon" | "info";

export type HintId =
  | "H0"
  | "H1a"
  | "H1b"
  | "H1c"
  | "H2a"
  | "H2b"
  | "H3"
  | "H4a"
  | "H4b"
  | "H5"
  | "H6a"
  | "H6b"
  | "H7";

export interface Result {
  visible: HintId[]; // max. 4, sortiert
  collapsed: HintId[]; // Rest, sortiert
  showAbroadInfoLine: boolean; // Einzeiler bei 8a
  levels: Partial<Record<HintId, Level>>; // Stufe je ausgelöstem Hinweis (H0 hat keine)
}
