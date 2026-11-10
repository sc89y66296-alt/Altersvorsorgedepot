// Agentur-Einstellungen. Alle Werte mit TODO müssen von der Agentur ausgefüllt werden.
// Nach jeder Änderung: `npm run build` und den Ordner dist/ neu hochladen.

export const config = {
  agencyName: "Allianzagentur Thomas Lang",
  agencyLocation: "Spiegelau", // Ort der Agentur (Einladung bei Frage 5)
  logoUrl: "", // TODO: von der Agentur ausfüllen – leer = kein Logo (Logo-Datei am besten in den Ordner public/ legen, z. B. "logo.svg")
  // Terminvereinbarung bei Frage 5: Allianz-vor-Ort-Seite der Agentur, wird nach einem Klick eingebettet.
  bookingUrl: "https://www.allianz-vor-ort.de/landingpage/zsm/managed/screen-lcQn_ytPR5613qf14pGtdA?homepagekey=thomas.lang1",
  // Adressen, von denen die eingebettete Seite geladen werden darf (Content-Security-Policy).
  // allianz-vor-ort.de leitet von www. auf die Adresse ohne www. weiter – deshalb beide.
  bookingFrameOrigins: ["https://www.allianz-vor-ort.de", "https://allianz-vor-ort.de"],
  phone: "08553 920320",
  phoneHref: "tel:+498553920320",
  imprintUrl: "https://TODO/impressum", // TODO: von der Agentur ausfüllen
  privacyUrl: "https://TODO/datenschutz", // TODO: von der Agentur ausfüllen
  initialInfoUrl: "https://TODO/erstinformation", // TODO: von der Agentur ausfüllen – Erstinformation / Vermittlerstatus
  appointmentDurationMinutes: 30, // TODO: von der Agentur bestätigen
  // Schieberegler bei Frage 1: Bruttoeinkommen pro Monat in €
  incomeSlider: { min: 1000, max: 10000, step: 100, start: 3500 },
  // Werte der gesetzlichen Rentenversicherung für die Rentenschätzung bei Frage 1.
  // Einmal im Jahr prüfen (Deutsche Rentenversicherung, „Werte der Rentenversicherung“).
  pension: {
    currentPensionValue: 42.52, // aktueller Rentenwert ab 1. Juli 2026
    averageAnnualIncome: 51944, // vorläufiges Durchschnittsentgelt 2026
    contributionCeilingMonthly: 8450, // Beitragsbemessungsgrenze 2026 pro Monat
    workingYears: 45, // Beitragsjahre der „Standardrente“
    pensionLevelPercent: 48, // Rentenniveau (Haltelinie)
  },
  // Förderung im Altersvorsorgedepot ab 2027 (Text bei Frage 4)
  funding: {
    maxBaseAllowance: 540, // Grundzulage pro Jahr, höchstens
    contributionForMaxAllowance: 1800, // Eigenbeitrag pro Jahr, ab dem die volle Grundzulage fließt
    childAllowance: 300, // Kinderzulage pro Kind und Jahr, höchstens
  },
  // Allianz-CI, abgeleitet aus dem Design-System von allianz.de
  colors: {
    primary: "#007AB3", // Allianz Interaktiv-Blau: Buttons, Links, Fortschritt, Auswahl
    primaryHover: "#006192",
    heading: "#003781", // Allianz-Blau (Markenfarbe): Überschriften, Schrift auf hellen Flächen
    cta: "#05813C", // Allianz-Grün für Haupt-Aktionen („Los geht's“, „Anrufen“)
    tint: "#E6F4F6", // helles Allianz-Türkis für hinterlegte Flächen
    background: "#FFFFFF",
    text: "#414141",
  },
};

export type Config = typeof config;
