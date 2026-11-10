import { config } from "../config";
import { copy, fillPlaceholders } from "../content/copy";
import { q5 } from "../content/questions";
import { summaryLines } from "../logic/summary";
import { CLICK_EVENTS } from "../logic/tracking";
import type { Answers, ContactId } from "../types";
import { el, externalLink, type View } from "./dom";
import { renderChoices, renderHeading, renderProgress } from "./question";

function callButton(): HTMLAnchorElement {
  return el(
    "a",
    { class: "button button-secondary", href: config.phoneHref, "data-track": CLICK_EVENTS.call },
    // Geschützte Leerzeichen: Die Nummer soll im Button nicht umbrechen
    fillPlaceholders(copy.final.callButton, { phone: config.phone.replace(/ /g, "\u00a0") }),
  );
}

/**
 * Nächster Schritt je nach Antwort: Kontaktformular (Ja) oder Online-Terminbuchung (Nein).
 * Beide Seiten liegen bei der Allianz und öffnen sich in einem neuen Tab – vorher gibt es keine
 * Verbindung dorthin, und Angaben aus dem Check werden nicht übergeben.
 */
function renderNextStep(panel: HTMLElement, contact: ContactId): void {
  const step = contact === "ja" ? q5.yes : q5.no;
  const url = contact === "ja" ? config.contactFormUrl : config.bookingUrl;
  const text = fillPlaceholders(step.text, { appointmentDurationMinutes: config.appointmentDurationMinutes });
  panel.replaceChildren(
    el("p", {}, text),
    el(
      "div",
      { class: "contact-actions" },
      externalLink(
        url,
        step.button,
        "button button-cta",
        contact === "ja" ? CLICK_EVENTS.contactForm : CLICK_EVENTS.booking,
      ),
      callButton(),
    ),
    el("p", { class: "disclaimer" }, copy.final.newTabNote),
  );
  panel.hidden = false;
}

export interface FinalViewProps {
  step: number;
  total: number;
  answers: Answers;
  onContact: (contact: ContactId) => void;
  onBack: () => void;
  onRestart: () => void;
}

export function renderFinal(props: FinalViewProps): View {
  const { answers } = props;
  const heading = renderHeading(props.step, props.total, q5.contact.text);

  const intro = fillPlaceholders(q5.intro, {
    agencyName: config.agencyName,
    agencyLocation: config.agencyLocation,
    appointmentDurationMinutes: config.appointmentDurationMinutes,
  });

  const panel = el("div", { class: "next-step", "aria-live": "polite", hidden: true });
  const choices = renderChoices("contact", q5.contact.answers, answers.contact, (id) => {
    props.onContact(id as ContactId);
    renderNextStep(panel, id as ContactId);
  });
  if (answers.contact) renderNextStep(panel, answers.contact);

  const summary = el(
    "div",
    { class: "summary" },
    el("h2", { class: "summary-title" }, copy.summary.heading),
    el("ul", {}, ...summaryLines(answers).map((line) => el("li", {}, line))),
  );

  const back = el("button", { type: "button", class: "button button-secondary" }, copy.question.back);
  back.addEventListener("click", props.onBack);
  const restart = el("button", { type: "button", class: "link-button" }, copy.final.restart);
  restart.addEventListener("click", props.onRestart);

  const node = el(
    "section",
    { class: "screen screen-final" },
    renderProgress(props.step, props.total),
    el("p", { class: "topic" }, q5.topic),
    heading,
    el(
      "div",
      { class: "final-intro" },
      answers.goal ? el("p", { class: "final-goal" }, q5.goalLine[answers.goal]) : null,
      el("p", {}, intro),
    ),
    el(
      "fieldset",
      { class: "question" },
      el("legend", { class: "sr-only" }, q5.contact.text),
      choices,
    ),
    panel,
    summary,
    el("p", { class: "disclaimer" }, copy.final.disclaimer),
    el("div", { class: "question-nav" }, back),
    el("p", { class: "restart" }, restart),
  );
  return { node, focus: heading };
}
