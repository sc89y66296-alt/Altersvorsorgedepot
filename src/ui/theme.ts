import type { Config } from "../config";
import { MIN_TEXT_CONTRAST, contrastRatio } from "../logic/contrast";

const WHITE = "#FFFFFF";
const DARK = "#1A1A1A";

/** Schreibt die Farben aus config.ts als CSS-Variablen und warnt bei zu wenig Kontrast. */
export function applyTheme(colors: Config["colors"], root: HTMLElement = document.documentElement): void {
  // Button-Text: Weiß oder Dunkel, je nachdem, was auf der Primärfarbe besser lesbar ist
  const onPrimary = (contrastRatio(WHITE, colors.primary) ?? 0) >= (contrastRatio(DARK, colors.primary) ?? 0) ? WHITE : DARK;

  root.style.setProperty("--color-primary", colors.primary);
  root.style.setProperty("--color-bg", colors.background);
  root.style.setProperty("--color-text", colors.text);
  root.style.setProperty("--color-on-primary", onPrimary);

  const checks: [string, string, string][] = [
    ["Text auf Hintergrund", colors.text, colors.background],
    ["Primärfarbe (Links, Labels) auf Hintergrund", colors.primary, colors.background],
    ["Button-Text auf Primärfarbe", onPrimary, colors.primary],
  ];
  for (const [name, fg, bg] of checks) {
    const ratio = contrastRatio(fg, bg);
    if (ratio === null) {
      console.warn(`[Selbstcheck] Ungültige Farbe bei „${name}“ (${fg} / ${bg}). Bitte Hex-Werte wie #1F4E79 in src/config.ts verwenden.`);
    } else if (ratio < MIN_TEXT_CONTRAST) {
      console.warn(
        `[Selbstcheck] Kontrast zu gering: ${name} hat ${ratio.toFixed(2)} : 1, nötig sind mind. ${MIN_TEXT_CONTRAST} : 1 (WCAG AA). Bitte Farben in src/config.ts anpassen.`,
      );
    }
  }
}
