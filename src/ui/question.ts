import { copy } from "../content/copy";
import type { Answer } from "../content/questions";
import { el, type View } from "./dom";

export interface QuestionViewProps {
  step: number;
  total: number;
  topic?: string;
  title: string; // Überschrift (h1)
  intro?: Node[]; // Inhalt zwischen Überschrift und Antworten (z. B. Schieberegler, Info-Box)
  outro?: Node[]; // Inhalt ganz am Ende, unter den Buttons (z. B. ausführliche Erklärung)
  legend?: string; // eigene Frage über den Antworten; ohne = die Überschrift ist die Frage
  answers: Answer[];
  selected?: string;
  canGoBack: boolean;
  onSelect: (answer: string) => void;
  onNext: () => void;
  onBack: () => void;
}

/** Fortschrittsbalken „Frage x von y“. Übersprungene Fragen zählen als beantwortet. */
export function renderProgress(step: number, total: number): HTMLElement {
  const fill = el("div", { class: "progress-fill" });
  fill.style.width = `${((step - 1) / total) * 100}%`;
  return el(
    "div",
    { class: "progress", "aria-hidden": "true" },
    el("p", { class: "progress-text" }, copy.question.progress(step, total)),
    el("div", { class: "progress-track" }, fill),
  );
}

export function renderHeading(step: number, total: number, title: string): HTMLHeadingElement {
  return el(
    "h1",
    { class: "question-title", id: `q${step}-title`, tabindex: "-1" },
    el("span", { class: "sr-only" }, `${copy.question.progress(step, total)}: `),
    title,
  );
}

export function renderChoices(
  name: string,
  answers: Answer[],
  selected: string | undefined,
  onSelect: (answer: string) => void,
): HTMLElement {
  const withImages = answers.some((answer) => answer.image);
  const options = answers.map((answer) => {
    const input = el("input", { type: "radio", name, value: answer.id, class: "answer-input" });
    input.checked = answer.id === selected;
    input.addEventListener("change", () => onSelect(answer.id));
    if (!withImages) {
      return el("label", { class: "answer" }, input, el("span", { class: "answer-label" }, answer.label));
    }
    // Bildkarte: Bild oben, darunter Auswahlfeld mit Antwort und Bildunterschrift.
    // Das Bild ist Dekoration (alt=""), die Bildunterschrift beschreibt es.
    return el(
      "label",
      { class: "answer answer-card" },
      answer.image ? el("img", { class: "answer-image", src: answer.image, alt: "", width: "400", height: "300", decoding: "async" }) : null,
      el(
        "span",
        { class: "answer-card-body" },
        input,
        el(
          "span",
          { class: "answer-label" },
          el("span", { class: "answer-title" }, answer.label),
          answer.caption ? el("span", { class: "answer-caption" }, answer.caption) : null,
        ),
      ),
    );
  });
  return el("div", { class: withImages ? "answers answers-cards" : "answers" }, ...options);
}

export function renderQuestion(props: QuestionViewProps): View {
  const { step, total } = props;
  let selected = props.selected;
  let leaving = false;

  const heading = renderHeading(step, total, props.title);
  const topic = props.topic ? el("p", { class: "topic" }, props.topic) : null;

  const nextButton = el("button", { type: "submit", class: "button button-primary" }, copy.question.next);
  nextButton.disabled = !selected;

  const leave = (action: () => void) => {
    if (leaving) return;
    leaving = true;
    action();
  };

  // Eine Auswahl speichert nur die Antwort – weiter geht es erst mit „Weiter“ (oder Enter)
  const choices = renderChoices(`q${step}`, props.answers, selected, (answer) => {
    selected = answer;
    nextButton.disabled = false;
    props.onSelect(answer);
  });

  // Mit eigener Frage über den Antworten steht die Überschrift über dem Formular,
  // sonst ist die Überschrift selbst die Legende der Antworten.
  const fieldset = props.legend
    ? el("fieldset", { class: "question" }, el("legend", { class: "question-legend" }, props.legend), choices)
    : el("fieldset", { class: "question" }, el("legend", {}, topic, heading), choices);

  const backButton = props.canGoBack
    ? el("button", { type: "button", class: "button button-secondary" }, copy.question.back)
    : null;
  backButton?.addEventListener("click", () => leave(props.onBack));

  const form = el(
    "form",
    { class: "question-form", novalidate: true },
    ...(props.intro ?? []),
    fieldset,
    el("div", { class: "question-nav" }, backButton, nextButton),
    ...(props.outro ?? []),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (selected) leave(props.onNext);
  });

  const node = el(
    "section",
    { class: "screen screen-question" },
    renderProgress(step, total),
    props.legend ? topic : null,
    props.legend ? heading : null,
    form,
  );
  return { node, focus: heading };
}
