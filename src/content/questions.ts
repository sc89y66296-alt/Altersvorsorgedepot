// Die 10 Fragen des Selbstchecks. Texte wörtlich laut Briefing.
// `topic` ist die kleine Themen-Zeile über der Frage (optional).
// Die Kürzel (id) sind interne IDs und dürfen nicht geändert werden –
// die Ergebnislogik in src/logic/ hängt daran.

import type { AnswerId } from "../types";

export interface Answer {
  id: AnswerId;
  label: string;
}

export interface Question {
  number: number;
  topic?: string;
  text: string;
  answers: Answer[];
}

export const questions: Question[] = [
  {
    number: 1,
    text: "Was machst du gerade?",
    answers: [
      { id: "1a", label: "Ich studiere (oder mache eine Ausbildung)" },
      { id: "1b", label: "Ich bin fertig und suche einen Job" },
      { id: "1c", label: "Ich habe gerade meinen ersten Job angefangen oder fange bald an" },
      { id: "1d", label: "Ich arbeite schon länger als ein Jahr" },
    ],
  },
  {
    number: 2,
    text: "Wie alt bist du?",
    answers: [
      { id: "2a", label: "unter 23" },
      { id: "2b", label: "23 oder 24" },
      { id: "2c", label: "25 bis 27" },
      { id: "2d", label: "28 oder älter" },
    ],
  },
  {
    number: 3,
    text: "Wie bist du krankenversichert?",
    answers: [
      { id: "3a", label: "Über meine Eltern (Familienversicherung)" },
      { id: "3b", label: "Selbst, als Student:in" },
      { id: "3c", label: "Über meinen Job" },
      { id: "3d", label: "Keine Ahnung, ehrlich gesagt" },
    ],
  },
  {
    number: 4,
    topic: "Haftpflicht",
    text: "Wer zahlt, wenn du aus Versehen das Handy deiner Mitbewohnerin runterwirfst?",
    answers: [
      { id: "4a", label: "Meine eigene Haftpflichtversicherung" },
      { id: "4b", label: "Die Haftpflicht meiner Eltern" },
      { id: "4c", label: "Ich weiß es nicht" },
      { id: "4d", label: "Ich selbst – ich habe keine Haftpflicht" },
    ],
  },
  {
    number: 5,
    text: "Wie wohnst du?",
    answers: [
      { id: "5a", label: "Bei meinen Eltern" },
      { id: "5b", label: "WG oder Wohnheim, aber offiziell noch bei meinen Eltern gemeldet" },
      { id: "5c", label: "In meiner eigenen Wohnung (dort auch mit Hauptwohnsitz gemeldet)" },
      { id: "5d", label: "Ich ziehe bald in meine erste eigene Wohnung" },
    ],
  },
  {
    number: 6,
    topic: "Hausrat",
    text: "Sind deine Sachen in der Wohnung versichert, z. B. bei Einbruch oder Wasserschaden?",
    answers: [
      { id: "6a", label: "Ja, mit eigener Hausratversicherung" },
      { id: "6b", label: "Wahrscheinlich über meine Eltern" },
      { id: "6c", label: "Nein / weiß nicht" },
      { id: "6d", label: "Betrifft mich nicht, ich wohne bei meinen Eltern" },
    ],
  },
  {
    number: 7,
    text: "Wie sieht's mit dem Auto aus?",
    answers: [
      { id: "7a", label: "Kein Auto, ich fahre Rad, Bus oder Bahn" },
      { id: "7b", label: "Ich habe ein eigenes Auto, auf mich versichert" },
      { id: "7c", label: "Das Auto läuft über meine Eltern, aber meistens fahre ich" },
      { id: "7d", label: "Ich plane, mir bald ein Auto zu holen" },
    ],
  },
  {
    number: 8,
    text: "Hast du Pläne fürs Ausland?",
    answers: [
      { id: "8a", label: "Nur Urlaub, ein paar Wochen" },
      { id: "8b", label: "Auslandssemester, Praktikum oder Work & Travel (länger als 6 Wochen)" },
      { id: "8c", label: "Ich bin gerade im Ausland" },
      { id: "8d", label: "Aktuell nichts geplant" },
    ],
  },
  {
    number: 9,
    topic: "Berufsunfähigkeit",
    text: "Hast du dir schon mal überlegt, wovon du lebst, wenn du länger nicht arbeiten kannst?",
    answers: [
      { id: "9a", label: "Ja, ich habe eine Berufsunfähigkeitsversicherung" },
      { id: "9b", label: "Schon mal drüber nachgedacht, aber noch nichts gemacht" },
      { id: "9c", label: "Nein, bisher nicht" },
      { id: "9d", label: "Was genau ist das?" },
    ],
  },
  {
    number: 10,
    text: "Kennst du die Extras, die dein Arbeitgeber anbietet (z. B. betriebliche Altersvorsorge, vermögenswirksame Leistungen)?",
    answers: [
      { id: "10a", label: "Ja, und ich nutze sie" },
      { id: "10b", label: "Ich hab davon gehört, aber noch nichts entschieden" },
      { id: "10c", label: "Nein, keine Ahnung" },
      { id: "10d", label: "Ich habe (noch) keinen Arbeitgeber" },
    ],
  },
];
