import "./styles.css";
import { config } from "./config";
import { questions } from "./content/questions";
import { evaluate } from "./logic/evaluate";
import { effectiveAnswers, nextQuestion, previousQuestion } from "./logic/skip";
import type { Answers } from "./types";
import type { View } from "./ui/dom";
import { isEmbedded, reportScreenChange, startHeightReporting } from "./ui/embed";
import { renderFooter, renderHeader } from "./ui/layout";
import { renderQuestion } from "./ui/question";
import { renderResult } from "./ui/result";
import { renderStart } from "./ui/start";
import { applyTheme } from "./ui/theme";

type Screen = { name: "start" } | { name: "question"; number: number } | { name: "result" };

const total = questions.length;
const main = document.getElementById("main")!;

// Alles liegt nur im Arbeitsspeicher: Neuladen startet den Check von vorn
let screen: Screen = { name: "start" };
let given: Answers = {}; // nur selbst gegebene Antworten; automatische kommen aus effectiveAnswers()
let firstRender = true;

function show(next: Screen): void {
  screen = next;
  render();
}

function goToQuestionAfter(current: number): void {
  const next = nextQuestion(current, given, total);
  show(next === null ? { name: "result" } : { name: "question", number: next });
}

function restart(): void {
  given = {};
  show({ name: "start" });
}

function currentView(): View {
  switch (screen.name) {
    case "start":
      return renderStart(() => goToQuestionAfter(0));
    case "question": {
      const number = screen.number;
      const previous = previousQuestion(number, given);
      return renderQuestion({
        question: questions[number - 1],
        total,
        selected: given[number],
        canGoBack: previous !== null,
        onSelect: (answer) => {
          given = { ...given, [number]: answer };
        },
        onNext: () => goToQuestionAfter(number),
        onBack: () => previous !== null && show({ name: "question", number: previous }),
      });
    }
    case "result":
      return renderResult(evaluate(effectiveAnswers(given)), restart);
  }
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
