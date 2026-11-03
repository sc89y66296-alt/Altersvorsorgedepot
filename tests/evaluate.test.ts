import { describe, expect, it } from "vitest";
import { hints } from "../src/content/hints";
import { questions } from "../src/content/questions";
import { MAX_VISIBLE, evaluate, onePerGroup, sortHints, triggeredHints, type TriggeredHint } from "../src/logic/evaluate";
import { effectiveAnswers } from "../src/logic/skip";
import type { Answers, HintId } from "../src/types";
import { parse } from "./helpers";

describe("Pflicht-Testfälle (Briefing 9.1)", () => {
  const cases: [string, string, HintId[], HintId[], boolean][] = [
    ["A", "1a 2a 3a 4b 5a 6d 7a 8d 9c 10d", ["H3", "H2b"], [], false],
    ["B", "1c 2c 3a 4b 5c 6b 7c 8a 9c 10c", ["H1a", "H2a", "H3", "H4a"], ["H6a", "H7"], true],
    ["C", "1d 2d 3c 4a 5c 6a 7b 8d 9a 10a", ["H0"], [], false],
    ["D", "1a 2b 3a 4b 5b 6b 7d 8b 9b 10d", ["H3", "H5", "H1b", "H2b"], ["H4b", "H6b"], false],
    ["E", "1b 2b 3a 4c 5a 6d 7a 8c 9d 10d", ["H1a", "H2a", "H3", "H5"], [], false],
    ["F", "1a 2a 3d 4a 5d 6c 7a 8a 9a 10d", ["H1c", "H4a"], [], true],
    ["G", "1a 2a 3b 4b 5a 6d 7c 8d 9a 10d", ["H0", "H2b", "H6a"], [], false],
  ];

  it.each(cases)("Fall %s", (_name, input, visible, collapsed, abroad) => {
    const result = evaluate(parse(input));
    expect(result.visible).toEqual(visible);
    expect(result.collapsed).toEqual(collapsed);
    expect(result.showAbroadInfoLine).toBe(abroad);
  });

  it("Fall B: H3 wird wegen 1c auf now hochgestuft", () => {
    expect(evaluate(parse("1c 2c 3a 4b 5c 6b 7c 8a 9c 10c")).levels.H3).toBe("now");
  });
});

/** Liefert die Stufe eines Hinweises oder undefined, wenn er nicht ausgelöst wird. */
const levelOf = (input: string, id: HintId) => triggeredHints(parse(input)).find((h) => h.id === id)?.level;

describe("Regeln (Briefing 6.1) – positiv und negativ", () => {
  const rules: [HintId, string, string | undefined][] = [
    // H1a: 3a UND (2c ODER 2d ODER 1c ODER 1d) – oder – 3a UND 2b UND 1b
    ["H1a", "3a 2c 1a", "now"],
    ["H1a", "3a 2d 1a", "now"],
    ["H1a", "3a 2a 1c", "now"],
    ["H1a", "3a 2a 1d", "now"],
    ["H1a", "3a 2b 1b", "now"],
    ["H1a", "3a 2a 1b", undefined],
    ["H1a", "3a 2b 1a", undefined],
    ["H1a", "3b 2d 1d", undefined],
    // H1b: 3a UND 2b UND 1a
    ["H1b", "3a 2b 1a", "info"],
    ["H1b", "3a 2a 1a", undefined],
    ["H1b", "3b 2b 1a", undefined],
    // H1c: 3d
    ["H1c", "3d 2a 1a", "soon"],
    ["H1c", "3c 2a 1a", undefined],
    // H2a: 4c ODER 4d – oder – 4b UND (1b ODER 1c ODER 1d)
    ["H2a", "4c 1a", "now"],
    ["H2a", "4d 1a", "now"],
    ["H2a", "4b 1b", "now"],
    ["H2a", "4b 1c", "now"],
    ["H2a", "4b 1d", "now"],
    ["H2a", "4b 1a", undefined],
    ["H2a", "4a 1d", undefined],
    // H2b: 4b UND 1a
    ["H2b", "4b 1a", "info"],
    ["H2b", "4b 1b", undefined],
    ["H2b", "4a 1a", undefined],
    // H3: 9b ODER 9c ODER 9d – soon, bei 1c oder 1d now
    ["H3", "9b 1a", "soon"],
    ["H3", "9c 1b", "soon"],
    ["H3", "9d 1c", "now"],
    ["H3", "9b 1d", "now"],
    ["H3", "9a 1c", undefined],
    // H4a: (5c ODER 5d) UND (6b ODER 6c)
    ["H4a", "5c 6b", "soon"],
    ["H4a", "5d 6c", "soon"],
    ["H4a", "5c 6a", undefined],
    ["H4a", "5b 6b", undefined],
    // H4b: 5b UND (6b ODER 6c)
    ["H4b", "5b 6b", "info"],
    ["H4b", "5b 6c", "info"],
    ["H4b", "5b 6a", undefined],
    ["H4b", "5c 6c", undefined],
    // H5: 8b ODER 8c
    ["H5", "8b", "soon"],
    ["H5", "8c", "soon"],
    ["H5", "8a", undefined],
    ["H5", "8d", undefined],
    // H6a: 7c, H6b: 7d
    ["H6a", "7c", "info"],
    ["H6a", "7b", undefined],
    ["H6b", "7d", "info"],
    ["H6b", "7a", undefined],
    // H7: (1c ODER 10b ODER 10c) UND NICHT 10d (und – fachliche Entscheidung – NICHT 10a)
    ["H7", "1c 10c", "info"],
    ["H7", "1d 10b", "info"],
    ["H7", "1d 10c", "info"],
    ["H7", "1c 10d", undefined],
    ["H7", "1d 10a", undefined],
    ["H7", "1c 10a", undefined],
  ];

  it.each(rules)("%s bei %s → %s", (id, input, expected) => {
    expect(levelOf(input, id)).toBe(expected);
  });

  it("4a, 6a, 7a, 7b, 8a, 8d, 9a, 10a lösen allein keine Hinweise aus", () => {
    expect(triggeredHints(parse("4a 6a 7a 7b 8a 8d 9a 10a"))).toEqual([]);
  });

  it("8a setzt nur die Info-Zeile", () => {
    const result = evaluate(parse("1d 2d 3c 4a 5c 6a 7b 8a 9a 10a"));
    expect(result.showAbroadInfoLine).toBe(true);
    expect(result.visible).toEqual(["H0"]);
  });
});

describe("Gruppen und Sortierung", () => {
  it("bei zwei Hinweisen derselben Gruppe gewinnt die höhere Stufe", () => {
    const conflict: TriggeredHint[] = [
      { id: "H1b", level: "info" },
      { id: "H1a", level: "now" },
      { id: "H2b", level: "info" },
      { id: "H2a", level: "now" },
      { id: "H4b", level: "info" },
      { id: "H4a", level: "soon" },
    ];
    expect(sortHints(onePerGroup(conflict)).map((h) => h.id)).toEqual(["H1a", "H2a", "H4a"]);
  });

  it("sortiert nach Stufe, dann nach Gruppe", () => {
    const list: TriggeredHint[] = [
      { id: "H7", level: "info" },
      { id: "H5", level: "soon" },
      { id: "H3", level: "now" },
      { id: "H1c", level: "soon" },
      { id: "H2a", level: "now" },
    ];
    expect(sortHints(list).map((h) => h.id)).toEqual(["H2a", "H3", "H1c", "H5", "H7"]);
  });
});

describe("Invarianten über viele zufällige Antwort-Kombinationen", () => {
  // Deterministischer Zufall, damit Fehler reproduzierbar sind
  let seed = 42;
  const random = () => {
    // mulberry32
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const samples: Answers[] = Array.from({ length: 20000 }, () => {
    const answers: Answers = {};
    for (const q of questions) answers[q.number] = q.answers[Math.floor(random() * 4)].id;
    return effectiveAnswers(answers);
  });

  it("visible hat nie mehr als 4 Einträge, pro Gruppe nie mehr als ein Hinweis", () => {
    for (const answers of samples) {
      const { visible, collapsed } = evaluate(answers);
      expect(visible.length).toBeLessThanOrEqual(MAX_VISIBLE);
      const groups = [...visible, ...collapsed].map((id) => hints[id].group).filter((g) => g !== null);
      expect(new Set(groups).size).toBe(groups.length);
    }
  });

  it("H0 steht genau dann vorn, wenn kein now/soon dabei ist", () => {
    for (const answers of samples) {
      const result = evaluate(answers);
      const all = [...result.visible, ...result.collapsed];
      const urgent = all.some((id) => result.levels[id] === "now" || result.levels[id] === "soon");
      expect(all.includes("H0")).toBe(!urgent);
      if (!urgent) expect(result.visible[0]).toBe("H0");
      if (result.collapsed.length > 0) expect(result.visible).toHaveLength(MAX_VISIBLE);
    }
  });
});
