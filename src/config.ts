// Agentur-Einstellungen. Alle Werte mit TODO müssen von der Agentur ausgefüllt werden.
// Nach jeder Änderung: `npm run build` und den Ordner dist/ neu hochladen.

export const config = {
  agencyName: "TODO Agenturname", // TODO: von der Agentur ausfüllen
  logoUrl: "", // TODO: von der Agentur ausfüllen – leer = kein Logo (Logo-Datei am besten in den Ordner public/ legen, z. B. "logo.svg")
  bookingUrl: "https://TODO-terminbuchung", // TODO: von der Agentur ausfüllen – Link für den Termin-Button
  imprintUrl: "https://TODO/impressum", // TODO: von der Agentur ausfüllen
  privacyUrl: "https://TODO/datenschutz", // TODO: von der Agentur ausfüllen
  initialInfoUrl: "https://TODO/erstinformation", // TODO: von der Agentur ausfüllen – Erstinformation / Vermittlerstatus
  appointmentDurationMinutes: 30, // TODO: von der Agentur bestätigen
  appointmentFormats: "bei uns in Passau oder per Video", // TODO: von der Agentur bestätigen
  colors: {
    primary: "#1F4E79", // TODO: von der Agentur ausfüllen – Platzhalter, später an Agentur-CI anpassen
    background: "#FFFFFF",
    text: "#1A1A1A",
  },
};

export type Config = typeof config;
