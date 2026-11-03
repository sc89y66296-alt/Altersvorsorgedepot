import { config } from "../config";
import { copy, fillPlaceholders } from "../content/copy";
import { abroadInfoLine, hints } from "../content/hints";
import type { HintId, Result } from "../types";
import { el, type View } from "./dom";

function hintCard(id: HintId, result: Result, headingLevel: "h2" | "h3"): HTMLElement {
  const hint = hints[id];
  const level = result.levels[id];
  return el(
    "article",
    { class: `hint-card${level ? ` level-${level}` : ""}` },
    level ? el("p", { class: "level-label" }, copy.levelLabels[level]) : null,
    el(headingLevel, { class: "hint-title" }, hint.title),
    el("p", {}, hint.text),
  );
}

export function renderResult(result: Result, onRestart: () => void): View {
  const heading = el("h1", { tabindex: "-1" }, copy.result.heading);

  const more =
    result.collapsed.length > 0
      ? el(
          "details",
          { class: "more-hints" },
          el("summary", { class: "more-title" }, copy.result.moreHeading),
          el("div", { class: "hint-list" }, ...result.collapsed.map((id) => hintCard(id, result, "h3"))),
        )
      : null;

  const invitation = fillPlaceholders(copy.result.invitation, {
    appointmentDurationMinutes: config.appointmentDurationMinutes,
    appointmentFormats: config.appointmentFormats,
  });

  // Bewusst ohne Query-Parameter: Antworten und Ergebnis verlassen das Tool nie
  const booking = el(
    "a",
    { class: "button button-primary button-large", href: config.bookingUrl, target: "_blank", rel: "noopener noreferrer" },
    copy.result.bookingButton,
    el("span", { class: "sr-only" }, ` ${copy.result.newTabHint}`),
  );

  const restart = el("button", { type: "button", class: "link-button" }, copy.result.restart);
  restart.addEventListener("click", onRestart);

  const node = el(
    "section",
    { class: "screen screen-result" },
    heading,
    el("p", { class: "lead" }, copy.result.intro),
    el("div", { class: "hint-list" }, ...result.visible.map((id) => hintCard(id, result, "h2"))),
    result.showAbroadInfoLine ? el("p", { class: "info-line" }, abroadInfoLine) : null,
    more,
    el("div", { class: "invitation" }, el("p", {}, invitation), booking, el("p", { class: "disclaimer" }, copy.result.disclaimer)),
    el("p", { class: "restart" }, restart),
  );
  return { node, focus: heading };
}
