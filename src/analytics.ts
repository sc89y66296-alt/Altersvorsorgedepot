// Anonyme Nutzungsstatistik. Solange in config.ts keine Umami-Website-ID eingetragen ist,
// wird nichts geladen und nichts gesendet.

import { config } from "./config";

type Sender = (name: string) => void;

declare global {
  interface Window {
    umami?: { track: (name: string) => void };
  }
}

let send: Sender | null = null;
// Pro Durchlauf jede Seite nur einmal zählen – Vor- und Zurückklicken verfälscht sonst den Trichter
const seen = new Set<string>();

export const analyticsEnabled = config.analytics.websiteId !== "";

export function setSender(sender: Sender | null): void {
  send = sender;
}

export function track(name: string): void {
  send?.(name);
}

export function trackOnce(name: string): void {
  if (seen.has(name)) return;
  seen.add(name);
  track(name);
}

/** Neuer Durchlauf („Check neu starten“). */
export function resetRun(): void {
  seen.clear();
}

/** Zählt Klicks auf Links mit data-track="…", z. B. Termin- und Anruf-Buttons. */
export function trackClicks(root: HTMLElement): void {
  root.addEventListener("click", (event) => {
    const link = (event.target as Element).closest<HTMLElement>("[data-track]");
    if (link?.dataset.track) track(link.dataset.track);
  });
}

/**
 * Lädt das Umami-Skript. Der Seitenaufruf wird automatisch gezählt; Ereignisse, die vor dem
 * Laden anfallen, werden kurz zwischengespeichert. Fehlt das Skript (z. B. Werbeblocker),
 * funktioniert der Check ganz normal weiter.
 */
export function startAnalytics(): void {
  if (!analyticsEnabled) return;
  const { websiteId, scriptUrl, domain } = config.analytics;
  const pending: string[] = [];
  setSender((name) => (window.umami ? window.umami.track(name) : pending.push(name)));

  const script = document.createElement("script");
  script.defer = true;
  script.src = scriptUrl;
  script.dataset.websiteId = websiteId;
  script.dataset.domains = domain;
  script.addEventListener("load", () => {
    for (const name of pending.splice(0)) window.umami?.track(name);
  });
  document.head.append(script);
}
