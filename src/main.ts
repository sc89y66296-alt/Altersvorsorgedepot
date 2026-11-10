import "./styles.css";
import { config } from "./config";
import { fillPlaceholders, formatNumber } from "./content/copy";
import { q1, q2, q3, q4 } from "./content/questions";
import { TOTAL_STEPS, infoTopics, nextStep, previousStep } from "./logic/flow";
import type { Answers, Step } from "./types";
import type { View } from "./ui/dom";
import { el } from "./ui/dom";
import { isEmbedded, reportScreenChange, startHeightReporting } from "./ui/embed";
import { renderFinal } from "./ui/final";
import { renderFooter, renderHeader } from "./ui/layout";
import { renderPensionFootnote, renderPensionSlider } from "./ui/pension";
import { renderQuestion, type QuestionViewProps } from "./ui/question";
import { renderStart } from "./ui/start";
import { applyTheme } from "./ui/theme";

type Screen = { name: "start" } | { name: "step"; step: Step };

const main = document.getElementById("main")!;

// Alles liegt nur im Arbeitsspeicher: Neuladen startet den Check von vorn
const freshAnswers = (): Answers => ({ monthlyIncome: config.incomeSlider.start });
let screen: Screen = { name: "start" };
let answers: Answers = freshAnswers();
let firstRender = true;

function show(next: Screen): void {
  screen = next;
  render();
}

function goTo(step: Step | null): void {
  if (step !== null) show({ name: "step", step });
}

function restart(): void {
  answers = freshAnswers();
  show({ name: "start" });
}

function update(patch: Partial<Answers>): void {
  answers = { ...answers, ...patch };
}

function stepView(step: Step): View {
  const base = {
    step,
    total: TOTAL_STEPS,
    canGoBack: previousStep(step, answers) !== null,
    onNext: () => goTo(nextStep(step, answers)),
    onBack: () => goTo(previousStep(step, answers)),
  } satisfies Partial<QuestionViewProps>;

  switch (step) {
    case 1:
      return renderQuestion({
        ...base,
        topic: q1.topic,
        title: "Wie viel gesetzliche Rente kannst du erwarten?",
        intro: [renderPensionSlider(answers.monthlyIncome, (income) => update({ monthlyIncome: income }))],
        outro: [renderPensionFootnote()],
        legend: q1.question.text,
        answers: q1.question.answers,
        selected: answers.satisfaction,
        onSelect: (id) => update({ satisfaction: id as Answers["satisfaction"] }),
      });
    case 2:
      return renderQuestion({
        ...base,
        topic: q2.topic,
        title: q2.text,
        answers: q2.answers,
        selected: answers.goal,
        onSelect: (id) => update({ goal: id as Answers["goal"] }),
      });
    case 3:
      return renderQuestion({
        ...base,
        topic: q3.topic,
        title: q3.text,
        answers: q3.answers,
        selected: answers.priority,
        onSelect: (id) => update({ priority: id as Answers["priority"] }),
      });
    case 4: {
      // Erklärung passend zu Frage 3 – bei „Ich möchte erst mehr wissen“ beide untereinander
      const topics = infoTopics(answers);
      const values = Object.fromEntries(Object.entries(config.funding).map(([k, v]) => [k, formatNumber(v)]));
      const both = topics.length > 1;
      const boxes = topics.map((topic) => {
        const info = q4.info[topic];
        return el(
          "div",
          { class: "info-box" },
          both ? el("h2", { class: "info-title" }, fillPlaceholders(info.title, values)) : null,
          ...info.text.map((t) => el("p", {}, fillPlaceholders(t, values))),
        );
      });
      return renderQuestion({
        ...base,
        topic: both ? q4.bothTopic : q4.topic,
        title: both ? q4.bothTitle : fillPlaceholders(q4.info[topics[0]].title, values),
        intro: [el("div", { class: "info-boxes" }, ...boxes)],
        legend: q4.question.text,
        answers: q4.question.answers,
        selected: answers.talk,
        onSelect: (id) => update({ talk: id as Answers["talk"] }),
      });
    }
    case 5:
      return renderFinal({
        step,
        total: TOTAL_STEPS,
        answers,
        onContact: (contact) => update({ contact }),
        onBack: base.onBack,
        onRestart: restart,
      });
  }
}

function currentView(): View {
  return screen.name === "start" ? renderStart(() => goTo(1)) : stepView(screen.step);
}

function render(): void {
  const view = currentView();
  main.replaceChildren(view.node);
  if (firstRender) {
    firstRender = false;
    return; // Beim ersten Laden keinen Fokus setzen
  }
  if (!isEmbedded) window.scrollTo(0, 0);
  (view.focus ?? main).focus({ preventScroll: isEmbedded });
  reportScreenChange();
}

applyTheme(config.colors);
if (isEmbedded) document.documentElement.classList.add("is-embedded");
renderHeader(document.getElementById("site-header")!);
renderFooter(document.getElementById("site-footer")!);
render();
startHeightReporting(document.getElementById("app")!);
