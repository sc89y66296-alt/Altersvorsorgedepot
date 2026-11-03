import { copy } from "../content/copy";
import { el, type View } from "./dom";

export function renderStart(onStart: () => void): View {
  const heading = el("h1", { tabindex: "-1" }, copy.start.title);
  const button = el("button", { type: "button", class: "button button-primary button-large" }, copy.start.button);
  button.addEventListener("click", onStart);

  const node = el(
    "section",
    { class: "screen screen-start" },
    heading,
    el("p", { class: "lead" }, copy.start.subtitle),
    el("p", { class: "privacy-note" }, copy.start.privacyNote),
    button,
    el("p", { class: "disclaimer" }, copy.start.disclaimer),
  );
  return { node, focus: heading };
}
