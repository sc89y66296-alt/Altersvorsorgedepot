import { copy } from "../content/copy";
import { el, type View } from "./dom";

export function renderStart(onStart: () => void): View {
  const heading = el("h1", { tabindex: "-1" }, copy.start.title);
  const button = el("button", { type: "button", class: "button button-cta button-large" }, copy.start.button);
  button.addEventListener("click", onStart);

  // Teamfoto: 800 px fürs Handy, 1280 px für große bzw. scharfe Bildschirme
  const photo = el(
    "figure",
    { class: "team-photo" },
    el("img", {
      src: "images/team-800.jpg",
      srcset: "images/team-800.jpg 800w, images/team-1280.jpg 1280w",
      sizes: "(min-width: 42rem) 40rem, 100vw",
      width: "1280",
      height: "681",
      alt: copy.start.photoAlt,
      decoding: "async",
    }),
  );

  const node = el(
    "section",
    { class: "screen screen-start" },
    photo,
    heading,
    el("p", { class: "lead" }, copy.start.subtitle),
    el("p", { class: "privacy-note" }, copy.start.privacyNote),
    button,
    el("p", { class: "disclaimer" }, copy.start.disclaimer),
  );
  return { node, focus: heading };
}
