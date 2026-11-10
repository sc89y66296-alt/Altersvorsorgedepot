import { config } from "../config";
import { copy } from "../content/copy";
import { el, externalLink } from "./dom";

export function renderHeader(container: HTMLElement): void {
  const brand = config.logoUrl
    ? el("img", { class: "brand-logo", src: config.logoUrl, alt: config.agencyName })
    : el("span", { class: "brand-name" }, config.agencyName);
  container.replaceChildren(el("div", { class: "container" }, brand));
}

export function renderFooter(container: HTMLElement): void {
  container.replaceChildren(
    el(
      "nav",
      { class: "container footer-links", "aria-label": "Rechtliches" },
      externalLink(config.imprintUrl, copy.footer.imprint),
      externalLink(config.privacyUrl, copy.footer.privacy),
    ),
  );
}
