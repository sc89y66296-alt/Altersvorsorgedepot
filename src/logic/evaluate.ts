// Ergebnislogik (Briefing Abschnitt 6). Reine Funktionen ohne DOM-Zugriff.

import { GROUP_ORDER, hints } from "../content/hints";
import type { AnswerId, Answers, HintId, Level, Result } from "../types";

export const MAX_VISIBLE = 4;

const LEVEL_ORDER: Level[] = ["now", "soon", "info"];

export interface TriggeredHint {
  id: Exclude<HintId, "H0">;
  level: Level;
}

/** Wendet die Regeln aus 6.1 an – ohne Gruppen-Begrenzung und Sortierung. */
export function triggeredHints(answers: Answers): TriggeredHint[] {
  const given = new Set(Object.values(answers));
  const any = (...ids: AnswerId[]) => ids.some((id) => given.has(id));

  const result: TriggeredHint[] = [];
  const add = (id: TriggeredHint["id"], level: Level, condition: boolean) => {
    if (condition) result.push({ id, level });
  };

  // KV
  add("H1a", "now", (any("3a") && any("2c", "2d", "1c", "1d")) || (any("3a") && any("2b") && any("1b")));
  add("H1b", "info", any("3a") && any("2b") && any("1a"));
  add("H1c", "soon", any("3d"));
  // Haftpflicht
  add("H2a", "now", any("4c", "4d") || (any("4b") && any("1b", "1c", "1d")));
  add("H2b", "info", any("4b") && any("1a"));
  // BU – bei 1c oder 1d hochgestuft
  add("H3", any("1c", "1d") ? "now" : "soon", any("9b", "9c", "9d"));
  // Hausrat
  add("H4a", "soon", any("5c", "5d") && any("6b", "6c"));
  add("H4b", "info", any("5b") && any("6b", "6c"));
  // Ausland
  add("H5", "soon", any("8b", "8c"));
  // Kfz
  add("H6a", "info", any("7c"));
  add("H6b", "info", any("7d"));
  // Berufseinstieg. Abweichung vom Briefing: Wer 10a gewählt hat („Ja, und ich nutze sie“),
  // bekommt den Hinweis nicht – auch nicht bei 1c. Siehe README, Abschnitt „Fachliche Entscheidungen“.
  add("H7", "info", any("1c", "10b", "10c") && !any("10d") && !any("10a"));

  return result;
}

const levelRank = (level: Level) => LEVEL_ORDER.indexOf(level);
const groupRank = (id: HintId) => GROUP_ORDER.indexOf(hints[id].group!);

/** Pro Gruppe höchstens ein Hinweis; bei Konflikt gewinnt die höhere Stufe. */
export function onePerGroup(list: TriggeredHint[]): TriggeredHint[] {
  const best = new Map<string, TriggeredHint>();
  for (const hint of list) {
    const group = hints[hint.id].group!;
    const current = best.get(group);
    if (!current || levelRank(hint.level) < levelRank(current.level)) best.set(group, hint);
  }
  return [...best.values()];
}

/** Sortiert nach Stufe (now → soon → info), dann nach Gruppe (H1 → H7). */
export function sortHints(list: TriggeredHint[]): TriggeredHint[] {
  return [...list].sort((a, b) => levelRank(a.level) - levelRank(b.level) || groupRank(a.id) - groupRank(b.id));
}

export function evaluate(answers: Answers): Result {
  const sorted = sortHints(onePerGroup(triggeredHints(answers)));
  const hasNowOrSoon = sorted.some((hint) => hint.level !== "info");
  const ordered: HintId[] = sorted.map((hint) => hint.id);
  if (!hasNowOrSoon) ordered.unshift("H0");

  const levels: Result["levels"] = {};
  for (const hint of sorted) levels[hint.id] = hint.level;

  return {
    visible: ordered.slice(0, MAX_VISIBLE),
    collapsed: ordered.slice(MAX_VISIBLE),
    showAbroadInfoLine: Object.values(answers).includes("8a"),
    levels,
  };
}
