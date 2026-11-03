import { config, type Advisor } from "../config";
import { copy, fillPlaceholders } from "../content/copy";
import { abroadInfoLine, hints } from "../content/hints";
import type { HintId, Result } from "../types";
import { el, externalLink, type View } from "./dom";

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

/**
 * Auswahl der Ansprechperson plus eingebetteter Kalender. Der Kalender wird erst nach einer
 * Auswahl geladen, damit vorher keine Anfrage an fremde Server geht. Antworten und Ergebnis
 * werden nie an den Kalender übergeben.
 */
function renderBooking(): HTMLElement {
  const hint = el("p", { class: "calendar-hint", hidden: true });
  const calendar = el("div", { class: "calendar", hidden: true });
  const noCalendar = el("div", { class: "no-calendar", hidden: true });
  const panel = el("div", { class: "advisor-panel", "aria-live": "polite" }, hint, calendar, noCalendar);
  let frameUrl = "";

  const show = (advisor: Advisor) => {
    if (advisor.bookingUrl) {
      hint.textContent = fillPlaceholders(copy.result.calendarHint, { name: advisor.name });
      hint.hidden = false;
      noCalendar.hidden = true;
      // Gleiche URL (gemeinsamer Agentur-Kalender): iframe nicht neu laden, nur den Hinweis ändern
      if (frameUrl !== advisor.bookingUrl) {
        frameUrl = advisor.bookingUrl;
        calendar.replaceChildren(
          el("iframe", {
            class: "booking-frame",
            src: advisor.bookingUrl,
            title: copy.result.calendarTitle,
            referrerpolicy: "no-referrer",
          }),
          el("p", { class: "calendar-newtab" }, externalLink(advisor.bookingUrl, copy.result.calendarNewTab)),
        );
      }
      calendar.hidden = false;
    } else {
      hint.hidden = true;
      calendar.hidden = true;
      const call = el(
        "a",
        { class: "button button-primary", href: config.phoneHref },
        fillPlaceholders(copy.result.callButton, { phone: config.phone }),
      );
      noCalendar.replaceChildren(el("p", {}, fillPlaceholders(copy.result.noCalendar, { name: advisor.name })), call);
      noCalendar.hidden = false;
    }
    panel.scrollIntoView({ block: "nearest" });
  };

  const options = config.advisors.map((advisor) => {
    const input = el("input", { type: "radio", name: "advisor", value: advisor.id, class: "answer-input" });
    input.addEventListener("change", () => show(advisor));
    return el(
      "label",
      { class: "answer advisor" },
      input,
      el(
        "span",
        { class: "answer-label" },
        el("span", { class: "advisor-name" }, advisor.name),
        advisor.role ? el("span", { class: "advisor-role" }, advisor.role) : null,
      ),
    );
  });

  return el(
    "section",
    { class: "booking", "aria-labelledby": "booking-title" },
    el("h2", { id: "booking-title" }, copy.result.bookingButton),
    el(
      "fieldset",
      { class: "question" },
      el("legend", { class: "advisor-legend" }, copy.result.advisorLegend),
      el("div", { class: "answers" }, ...options),
    ),
    el("p", { class: "disclaimer advisor-privacy" }, copy.result.advisorPrivacy),
    panel,
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
    el("div", { class: "invitation" }, el("p", {}, invitation)),
    renderBooking(),
    el("p", { class: "disclaimer" }, copy.result.disclaimer),
    el("p", { class: "restart" }, restart),
  );
  return { node, focus: heading };
}
