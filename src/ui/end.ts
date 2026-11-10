import { config } from "../config";
import { copy, fillPlaceholders } from "../content/copy";
import { ending } from "../content/questions";
import { summaryLines } from "../logic/summary";
import type { Answers, EndReason } from "../types";
import { el, externalLink, type View } from "./dom";

export interface EndViewProps {
  reason: EndReason;
  answers: Answers;
  onBack: () => void;
  onRestart: () => void;
}

/**
 * Abschlussseite für die beiden Ausstiege. Bewusst ohne großen Termin-Button –
 * nur ein unaufdringlicher Hinweis, wie man uns später erreicht.
 */
export function renderEnd(props: EndViewProps): View {
  const reason = ending.reasons[props.reason];
  const heading = el("h1", { tabindex: "-1" }, reason.title);

  const later = el(
    "div",
    { class: "later" },
    el("p", { class: "later-heading" }, ending.laterHeading),
    el(
      "ul",
      { class: "later-links" },
      el("li", {}, externalLink(config.bookingUrl, ending.bookingLink)),
      el(
        "li",
        {},
        el("a", { href: config.phoneHref }, fillPlaceholders(ending.callLink, { phone: config.phone })),
      ),
    ),
  );

  const summary = el(
    "div",
    { class: "summary" },
    el("h2", { class: "summary-title" }, copy.summary.heading),
    el("ul", {}, ...summaryLines(props.answers).map((line) => el("li", {}, line))),
  );

  const back = el("button", { type: "button", class: "button button-secondary" }, copy.question.back);
  back.addEventListener("click", props.onBack);
  const restart = el("button", { type: "button", class: "link-button" }, copy.final.restart);
  restart.addEventListener("click", props.onRestart);

  const node = el(
    "section",
    { class: "screen screen-final screen-end" },
    el("p", { class: "topic" }, ending.topic),
    heading,
    el("p", { class: "lead" }, reason.text),
    summary,
    later,
    el("p", { class: "disclaimer" }, copy.final.disclaimer),
    el("div", { class: "question-nav" }, back),
    el("p", { class: "restart" }, restart),
  );
  return { node, focus: heading };
}
