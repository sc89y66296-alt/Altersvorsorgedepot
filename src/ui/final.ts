import { config } from "../config";
import { copy, fillPlaceholders } from "../content/copy";
import { q5 } from "../content/questions";
import { summaryLines } from "../logic/summary";
import type { Answers, ContactId } from "../types";
import { el, externalLink, type View } from "./dom";
import { renderChoices, renderHeading, renderProgress } from "./question";

interface Booking {
  node: HTMLElement;
  open: () => void; // lädt die Terminseite (falls noch nicht geschehen) und scrollt hin
}

/**
 * Terminvereinbarung über die Allianz-vor-Ort-Seite der Agentur. Sie wird erst nach einem Klick
 * geladen, damit vorher keine Anfrage an fremde Server geht. Angaben aus dem Check werden nie
 * übergeben, ein Referrer wird nicht gesendet.
 */
function renderBooking(): Booking {
  const frameBox = el("div", { class: "calendar", hidden: true });
  const loadButton = el("button", { type: "button", class: "button button-cta booking-load" }, copy.booking.loadButton);
  const privacy = el("p", { class: "disclaimer booking-privacy" }, copy.booking.privacy);

  const open = () => {
    if (frameBox.hidden) {
      frameBox.replaceChildren(
        el("iframe", {
          class: "booking-frame",
          src: config.bookingUrl,
          title: fillPlaceholders(copy.booking.frameTitle, { agencyName: config.agencyName }),
          referrerpolicy: "no-referrer",
        }),
        el("p", { class: "calendar-newtab" }, externalLink(config.bookingUrl, copy.booking.newTab)),
      );
      frameBox.hidden = false;
      loadButton.hidden = true;
      privacy.hidden = true;
    }
    node.scrollIntoView({ block: "start" });
  };
  loadButton.addEventListener("click", open);

  const node = el(
    "section",
    { class: "booking", id: "booking", "aria-labelledby": "booking-title" },
    el("h2", { id: "booking-title" }, copy.booking.heading),
    el("p", {}, copy.booking.text),
    loadButton,
    privacy,
    frameBox,
  );
  return { node, open };
}

function callButton(): HTMLAnchorElement {
  return el(
    "a",
    { class: "button button-secondary", href: config.phoneHref },
    fillPlaceholders(copy.booking.callButton, { phone: config.phone }),
  );
}

/** „Dürfen wir uns melden?“ – bei Ja geht es zum Kontaktformular auf der Allianz-Seite (mit Einwilligung). */
function renderContact(answers: Answers, booking: Booking, onSelect: (contact: ContactId) => void): HTMLElement {
  const panel = el("div", { class: "contact-panel", "aria-live": "polite" });

  const show = (contact: ContactId) => {
    if (contact === "ja") {
      const toForm = el("button", { type: "button", class: "button button-cta" }, q5.contactYesButton);
      toForm.addEventListener("click", booking.open);
      panel.replaceChildren(el("p", {}, q5.contactYes), el("div", { class: "contact-actions" }, toForm, callButton()));
    } else {
      panel.replaceChildren(el("p", {}, fillPlaceholders(q5.contactNo, { phone: config.phone })));
    }
  };

  const choices = renderChoices("contact", q5.contact.answers, answers.contact, (id) => {
    onSelect(id as ContactId);
    show(id as ContactId);
  });
  if (answers.contact) show(answers.contact);

  return el(
    "section",
    { class: "contact" },
    el("fieldset", { class: "question" }, el("legend", { class: "question-legend" }, q5.contact.text), choices),
    panel,
  );
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
  const heading = renderHeading(props.step, props.total, q5.title);

  const intro = fillPlaceholders(q5.intro, {
    agencyName: config.agencyName,
    agencyLocation: config.agencyLocation,
    appointmentDurationMinutes: config.appointmentDurationMinutes,
  });

  const summary = el(
    "div",
    { class: "summary" },
    el("h2", { class: "summary-title" }, copy.summary.heading),
    el("ul", {}, ...summaryLines(answers).map((line) => el("li", {}, line))),
  );

  const booking = renderBooking();

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
    answers.goal ? el("p", { class: "lead" }, q5.goalLine[answers.goal]) : null,
    el("div", { class: "invitation" }, el("p", {}, intro)),
    summary,
    booking.node,
    renderContact(answers, booking, props.onContact),
    el("p", { class: "disclaimer" }, copy.final.disclaimer),
    el("div", { class: "question-nav" }, back),
    el("p", { class: "restart" }, restart),
  );
  return { node, focus: heading };
}
