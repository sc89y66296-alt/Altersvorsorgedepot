import { describe, expect, it } from "vitest";
import { effectiveAnswers, isSkipped, nextQuestion, previousQuestion } from "../src/logic/skip";
import { parse } from "./helpers";

describe("Überspring-Logik (Briefing 5.1)", () => {
  it("5a → Frage 6 übersprungen und mit 6d belegt", () => {
    const given = parse("1c 2a 3a 4a 5a");
    expect(isSkipped(6, given)).toBe(true);
    expect(effectiveAnswers(given)[6]).toBe("6d");
    expect(nextQuestion(5, given, 10)).toBe(7);
  });

  it("Änderung von 5a auf 5c → Frage 6 wird wieder gefragt", () => {
    const before = parse("1c 2a 3a 4a 5a");
    const after = { ...before, 5: "5c" };
    expect(effectiveAnswers(before)[6]).toBe("6d");
    expect(isSkipped(6, after)).toBe(false);
    expect(effectiveAnswers(after)[6]).toBeUndefined();
    expect(nextQuestion(5, after, 10)).toBe(6);
  });

  it("eine selbst gewählte Antwort zu Frage 6 bleibt erhalten, wenn 6 wieder gefragt wird", () => {
    const given = parse("5c 6b");
    expect(effectiveAnswers({ ...given, 5: "5a" })[6]).toBe("6d");
    expect(effectiveAnswers(given)[6]).toBe("6b");
  });

  it.each(["1a", "1b"])("%s → Frage 10 übersprungen und mit 10d belegt", (first) => {
    const given = parse(`${first} 2a 3a 4a 5c 6a 7a 8d 9a`);
    expect(isSkipped(10, given)).toBe(true);
    expect(effectiveAnswers(given)[10]).toBe("10d");
    expect(nextQuestion(9, given, 10)).toBeNull();
  });

  it("Änderung von 1a auf 1c → Frage 10 wird wieder gefragt", () => {
    const before = parse("1a 2a 3a 4a 5c 6a 7a 8d 9a");
    const after = { ...before, 1: "1c" };
    expect(effectiveAnswers(before)[10]).toBe("10d");
    expect(isSkipped(10, after)).toBe(false);
    expect(effectiveAnswers(after)[10]).toBeUndefined();
    expect(nextQuestion(9, after, 10)).toBe(10);
  });

  it("1c und 1d überspringen Frage 10 nicht", () => {
    expect(isSkipped(10, parse("1c"))).toBe(false);
    expect(isSkipped(10, parse("1d"))).toBe(false);
  });

  it("Zurück springt über übersprungene Fragen hinweg", () => {
    const given = parse("1a 2a 3a 4a 5a");
    expect(previousQuestion(7, given)).toBe(5);
    expect(previousQuestion(7, parse("5c"))).toBe(6);
    expect(previousQuestion(1, given)).toBeNull();
  });

  it("ohne Antworten wird nichts übersprungen", () => {
    expect(nextQuestion(0, {}, 10)).toBe(1);
    expect(isSkipped(6, {})).toBe(false);
    expect(isSkipped(10, {})).toBe(false);
  });
});
