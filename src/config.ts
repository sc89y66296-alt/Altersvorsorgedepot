// Agentur-Einstellungen. Alle Werte mit TODO müssen von der Agentur ausgefüllt werden.
// Nach jeder Änderung: `npm run build` und den Ordner dist/ neu hochladen.

export interface Advisor {
  id: string;
  name: string;
  role: string;
  bookingUrl: string;
}

export const config = {
  agencyName: "TODO Agenturname", // TODO: von der Agentur ausfüllen
  logoUrl: "", // TODO: von der Agentur ausfüllen – leer = kein Logo (Logo-Datei am besten in den Ordner public/ legen, z. B. "logo.svg")
  // Ansprechpartner:innen für die Terminbuchung auf der Ergebnisseite.
  // bookingUrl = Online-Kalender, der nach der Auswahl eingebettet wird; leer = noch kein Kalender
  // (dann erscheint stattdessen die Telefonnummer). Der Allianz-Kalender (bookingtime) gilt für die
  // ganze Agentur – die Person wird darin im Schritt „Mitarbeiter wählen“ ausgesucht.
  advisors: [
    {
      id: "thomas-lang",
      name: "Thomas Lang",
      role: "Agenturinhaber",
      bookingUrl: "https://booking.allianz-abv.eps.bookingtime.com/?vtnr=703400444",
    },
    {
      id: "francesco-schroenghamer",
      name: "Francesco Schrönghamer",
      role: "Kundenbetreuer",
      bookingUrl: "https://booking.allianz-abv.eps.bookingtime.com/?vtnr=703400444",
    },
    {
      id: "jonas-kroiss",
      name: "Jonas Kroiss",
      role: "", // TODO: Rolle ergänzen
      bookingUrl: "", // TODO: eintragen, sobald Jonas in bookingtime angelegt ist
    },
  ] as Advisor[],
  phone: "08553 920320",
  phoneHref: "tel:+498553920320",
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
