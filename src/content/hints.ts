// Hinweise H0–H7 für die Ergebnisseite. Texte wörtlich laut Briefing.
// Wann welcher Hinweis erscheint, steht in src/logic/evaluate.ts.

import type { HintId } from "../types";

// Reihenfolge der Gruppen = Sortierung bei gleicher Stufe (H1 → H7)
export const GROUP_ORDER = ["KV", "Haftpflicht", "BU", "Hausrat", "Ausland", "Kfz", "Berufseinstieg"] as const;
export type HintGroup = (typeof GROUP_ORDER)[number];

export interface Hint {
  id: HintId;
  group: HintGroup | null; // H0 gehört zu keiner Gruppe
  title: string;
  text: string;
}

export const hints: Record<HintId, Hint> = {
  H1a: {
    id: "H1a",
    group: "KV",
    title: "Deine Familienversicherung läuft wahrscheinlich aus (oder ist schon vorbei)",
    text: "Über die Eltern bist du in der Regel bis 23 mitversichert, im Studium oder in der Ausbildung bis 25 – und mit einem Job bist du ohnehin selbst Mitglied. Ein kurzer Anruf bei deiner Krankenkasse klärt, wie es für dich weitergeht.",
  },
  H1b: {
    id: "H1b",
    group: "KV",
    title: "Die 25 im Blick behalten",
    text: "Solange du studierst, bist du in der Regel bis zu deinem 25. Geburtstag über deine Eltern mitversichert. Danach versicherst du dich selbst, als Studi zum Beispiel in der studentischen Krankenversicherung – gut, das rechtzeitig auf dem Schirm zu haben.",
  },
  H1c: {
    id: "H1c",
    group: "KV",
    title: "Kurz klären, wie du krankenversichert bist",
    text: "Ob Familienversicherung, studentisch oder über den Job: Das ändert sich gerade in deiner Lebensphase oft. Ein Blick auf deine Versichertenkarte oder ein Anruf bei der Kasse schafft Klarheit.",
  },
  H2a: {
    id: "H2a",
    group: "Haftpflicht",
    title: "Eine eigene Haftpflicht lohnt einen Blick",
    text: "Über die Haftpflicht der Eltern bist du meist nur während der ersten Ausbildung oder des Studiums mitversichert, danach endet der Schutz je nach Tarif. Die Haftpflicht springt ein, wenn du anderen aus Versehen einen Schaden machst – und gehört deshalb zu den wichtigsten Basics.",
  },
  H2b: {
    id: "H2b",
    group: "Haftpflicht",
    title: "Merk dir den Wechselzeitpunkt bei der Haftpflicht",
    text: "Während des Studiums bist du über deine Eltern wahrscheinlich gut abgedeckt. Spätestens zum Berufsstart brauchst du in der Regel eine eigene – frag am besten mal nach, was im Vertrag deiner Eltern steht.",
  },
  H3: {
    id: "H3",
    group: "BU",
    title: "Deine Arbeitskraft ist mehr wert, als du denkst",
    text: "Über ein ganzes Berufsleben gerechnet ist dein Einkommen oft dein größter finanzieller Wert, und die gesetzliche Absicherung ist in den ersten Berufsjahren meist gering. Wer früh einsteigt, zahlt in der Regel niedrigere Beiträge – der Berufsstart ist deshalb ein guter Moment, sich das anzuschauen.",
  },
  H4a: {
    id: "H4a",
    group: "Hausrat",
    title: "Mit eigener Wohnung kommt die eigene Hausrat",
    text: "Die Hausratversicherung deiner Eltern deckt deine Sachen normalerweise nicht mehr ab, sobald du deinen Lebensmittelpunkt in einer eigenen Wohnung hast. Laptop, Rad und Möbel summieren sich schneller als gedacht.",
  },
  H4b: {
    id: "H4b",
    group: "Hausrat",
    title: "Die Hausrat der Eltern hat Grenzen",
    text: "Im WG-Zimmer sind deine Sachen oft über die sogenannte Außenversicherung der Eltern mit drin – aber meist nur bis zu einem bestimmten Betrag. Kurz nachschauen, ob der für deinen Laptop und Co. reicht.",
  },
  H5: {
    id: "H5",
    group: "Ausland",
    title: "Länger im Ausland? Dann passt der normale Reiseschutz oft nicht",
    text: "Viele Auslandsreise-Krankenversicherungen gelten nur für Reisen von einigen Wochen. Für Auslandssemester, Praktikum oder Work & Travel gibt es spezielle Tarife für längere Aufenthalte – auch Haftpflicht und Hausrat sind dann einen Blick wert.",
  },
  H6a: {
    id: "H6a",
    group: "Kfz",
    title: "Fährst du hauptsächlich? Dann sollte das im Vertrag stehen",
    text: "Wenn du das Auto der Eltern meistens fährst, sollte der Fahrerkreis richtig eingetragen sein, damit im Schadenfall alles glatt läuft. Außerdem lohnt es sich zu schauen, wie du früh deine eigene Schadenfreiheitsklasse aufbaust – das spart später Geld.",
  },
  H6b: {
    id: "H6b",
    group: "Kfz",
    title: "Erstes eigenes Auto: Beim Einstieg lässt sich sparen",
    text: "Fahranfänger:innen starten oft in einer teuren Einstufung. Möglichkeiten wie eine Zweitwagenregelung über die Eltern oder die Übernahme einer Schadenfreiheitsklasse können den Beitrag deutlich senken.",
  },
  H7: {
    id: "H7",
    group: "Berufseinstieg",
    title: "Schau dir die Extras deines Arbeitgebers an",
    text: "Viele Arbeitgeber zahlen etwas dazu, etwa bei der betrieblichen Altersvorsorge oder als vermögenswirksame Leistungen. Manches gibt es nur, wenn du aktiv danach fragst – der Berufsstart ist der beste Zeitpunkt dafür.",
  },
  H0: {
    id: "H0",
    group: null,
    title: "Sieht ziemlich gut sortiert aus",
    text: "Du hast die wichtigsten Themen schon auf dem Schirm. Wenn sich etwas ändert, etwa ein Umzug, ein neuer Job oder ein Auslandsjahr, lohnt sich ein kurzer Check-up.",
  },
};

// Einzeiler bei Antwort 8a (zählt nicht zu den 4 Hinweis-Plätzen)
export const abroadInfoLine =
  "Für den Urlaub reicht meist eine günstige Auslandsreise-Krankenversicherung – check kurz, ob du eine hast oder über die Familie mit drin bist.";
