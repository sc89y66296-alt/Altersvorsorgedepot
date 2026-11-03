// Einbettung per iframe: meldet der Agentur-Website die aktuelle Höhe
// und einen Screenwechsel (damit sie zum Anfang des iframes scrollen kann).

export const isEmbedded = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true; // Zugriff auf window.top verweigert = wir laufen in einem fremden iframe
  }
})();

export function startHeightReporting(target: HTMLElement): () => void {
  if (!isEmbedded) return () => {};

  let lastHeight = 0;
  const report = () => {
    const height = Math.ceil(target.getBoundingClientRect().height);
    if (height === lastHeight) return;
    lastHeight = height;
    window.parent.postMessage({ type: "selbstcheck-height", height }, "*");
  };

  new ResizeObserver(report).observe(target);
  report();
  return report;
}

export function reportScreenChange(): void {
  if (isEmbedded) window.parent.postMessage({ type: "selbstcheck-screen" }, "*");
}
