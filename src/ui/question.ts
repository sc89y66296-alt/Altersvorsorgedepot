import { copy } from "../content/copy";
import type { Question } from "../content/questions";
import type { AnswerId } from "../types";
import { el, type View } from "./dom";

export const AUTO_ADVANCE_DELAY_MS = 250;

export interface QuestionViewProps {
  question: Question;
  total: number;
  selected?: AnswerId;
  canGoBack: boolean;
  onSelect: (answer: AnswerId) => void;
  onNext: () => void;
  onBack: () => void;
}

export function renderQuestion(props: QuestionViewProps): View {
  const { question, total } = props;
  const progressText = copy.question.progress(question.number, total);
  const name = `q${question.number}`;
  let selected = props.selected;
  let leaving = false;
  // Automatisch weiter nur bei Klick/Tipp – nicht, wenn jemand mit den Pfeiltasten durch die Antworten geht
  let pointerActive = false;

  const heading = el(
    "h1",
    { class: "question-title", id: `${name}-title`, tabindex: "-1" },
    el("span", { class: "sr-only" }, `${progressText}: `),
    question.text,
  );

  const fill = el("div", { class: "progress-fill" });
  // Übersprungene Fragen zählen als beantwortet: Der Balken zeigt alle Fragen vor der aktuellen
  fill.style.width = `${((question.number - 1) / total) * 100}%`;
  const progress = el(
    "div",
    { class: "progress", "aria-hidden": "true" },
    el("p", { class: "progress-text" }, progressText),
    el("div", { class: "progress-track" }, fill),
  );

  const nextButton = el("button", { type: "submit", class: "button button-primary" }, copy.question.next);
  nextButton.disabled = !selected;

  const leave = (action: () => void) => {
    if (leaving) return;
    leaving = true;
    action();
  };

  const options = question.answers.map((answer) => {
    const input = el("input", { type: "radio", name, value: answer.id, class: "answer-input" });
    input.checked = answer.id === selected;
    input.addEventListener("change", () => {
      selected = answer.id;
      nextButton.disabled = false;
      props.onSelect(answer.id);
    });
    input.addEventListener("click", () => {
      if (!pointerActive || leaving) return;
      selected = answer.id;
      props.onSelect(answer.id);
      leaving = true;
      window.setTimeout(props.onNext, AUTO_ADVANCE_DELAY_MS);
    });
    return el("label", { class: "answer" }, input, el("span", { class: "answer-label" }, answer.label));
  });

  const fieldset = el(
    "fieldset",
    { class: "question" },
    el("legend", {}, question.topic ? el("p", { class: "topic" }, question.topic) : null, heading),
    el("div", { class: "answers" }, ...options),
  );
  fieldset.addEventListener("pointerdown", () => (pointerActive = true));
  fieldset.addEventListener("keydown", () => (pointerActive = false));

  const backButton = props.canGoBack
    ? el("button", { type: "button", class: "button button-secondary" }, copy.question.back)
    : null;
  backButton?.addEventListener("click", () => leave(props.onBack));

  const form = el(
    "form",
    { class: "question-form", novalidate: true },
    fieldset,
    el("div", { class: "question-nav" }, backButton, nextButton),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (selected) leave(props.onNext);
  });

  const node = el("section", { class: "screen screen-question" }, progress, form);
  return { node, focus: heading };
}
