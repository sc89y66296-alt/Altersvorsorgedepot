import { defineConfig } from "vitest/config";

// Nur im Build: Content-Security-Policy als Meta-Tag. Sie erlaubt ausschließlich
// eigene Dateien, keine iframes und blockiert jede
// Netzwerkanfrage aus dem Skript heraus.
// (Im Entwicklungsmodus würde sie Vites Live-Reload blockieren.)
const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join("; ");

export default defineConfig({
  // Relative Pfade: Der Build läuft in jedem Unterordner, z. B. /selbstcheck/
  base: "./",
  plugins: [
    {
      name: "content-security-policy",
      apply: "build",
      transformIndexHtml(html) {
        return html.replace(
          '<meta charset="UTF-8" />',
          `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
        );
      },
    },
  ],
  build: {
    target: "es2020",
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
