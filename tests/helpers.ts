import type { Answers } from "../src/types";

/** "1a 2b 3a" -> { 1: "1a", 2: "2b", 3: "3a" } */
export function parse(input: string): Answers {
  const answers: Answers = {};
  for (const id of input.trim().split(/\s+/)) {
    answers[parseInt(id, 10)] = id;
  }
  return answers;
}
