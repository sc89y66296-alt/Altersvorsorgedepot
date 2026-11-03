import type { Config } from "../config";
import { MIN_TEXT_CONTRAST, contrastRatio } from "../logic/contrast";

const WHITE = "#FFFFFF";
const DARK = "#1A1A1A";

/** Weiß oder Dunkel – je nachdem, was auf der Farbe besser lesbar ist. */
function readableOn(color: string): string {
  return (contrastRatio(WHITE, color) ?? 0) >= (contrastRatio(DARK, color) ?? 0) ? WHITE : DARK;
}

/** Schreibt die Farben aus config.ts als CSS-Variablen und warnt bei zu wenig Kontrast. */
export function applyTheme(colors: Config["colors"], root: HTMLElement = document.documentElement): void {
  const onPrimary = readableOn(colors.primary);
  const onCta = readableOn(colors.cta);

  const vars: Record<string, string> = {
    "--color-primary": colors.primary,
    "--color-primary-hover": colors.primaryHover,
    "--color-heading": colors.heading,
    "--color-cta": colors.cta,
    "--color-tint": colors.tint,
    "--color-bg": colors.background,
    "--color-text": colors.text,
    "--color-on-primary": onPrimary,
    "--color-on-cta": onCta,
  };
  for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);

  const checks: [string, string, string][] = [
    ["Text auf Hintergrund", colors.text, colors.background],
    ["Text auf hinterlegten Flächen", colors.text, colors.tint],
    ["Primärfarbe (Links, Labels) auf Hintergrund", colors.primary, colors.background],
    ["Überschriften auf Hintergrund", colors.heading, colors.background],
    ["Überschriften-Farbe auf hinterlegten Flächen", colors.heading, colors.tint],
    ["Button-Text auf Primärfarbe", onPrimary, colors.primary],
    ["Button-Text auf Hover-Farbe", onPrimary, colors.primaryHover],
    ["Button-Text auf CTA-Farbe", onCta, colors.cta],
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
