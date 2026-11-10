// Vereinfachte Schätzung der gesetzlichen Rente. Reine Funktionen ohne DOM-Zugriff.
//
// Annahme: Jemand verdient sein ganzes Arbeitsleben lang (config.pension.workingYears Jahre)
// genau dieses Einkommen – im Verhältnis zum heutigen Durchschnittsentgelt. Gerechnet wird
// mit heutigen Werten (also in heutiger Kaufkraft), brutto vor Kranken-/Pflegeversicherung
// und Steuern. Einkommen über der Beitragsbemessungsgrenze zählt nicht mit.

export interface PensionValues {
  currentPensionValue: number; // aktueller Rentenwert in € pro Entgeltpunkt
  averageAnnualIncome: number; // Durchschnittsentgelt pro Jahr
  contributionCeilingMonthly: number; // Beitragsbemessungsgrenze pro Monat
  workingYears: number; // Beitragsjahre
}

export interface PensionEstimate {
  monthlyPension: number; // geschätzte gesetzliche Rente pro Monat (brutto, gerundet)
  gap: number; // Unterschied zum heutigen Bruttoeinkommen pro Monat (gerundet, nie negativ)
  percentOfIncome: number; // Rente in % des heutigen Bruttoeinkommens (gerundet)
  aboveCeiling: boolean; // Einkommen liegt über der Beitragsbemessungsgrenze
}

export function estimatePension(monthlyIncome: number, values: PensionValues): PensionEstimate {
  const income = Math.max(0, monthlyIncome);
  const counted = Math.min(income, values.contributionCeilingMonthly);
  const pointsPerYear = (counted * 12) / values.averageAnnualIncome;
  const pension = pointsPerYear * values.workingYears * values.currentPensionValue;

  return {
    monthlyPension: Math.round(pension),
    gap: Math.max(0, Math.round(income - pension)),
    percentOfIncome: income > 0 ? Math.round((pension / income) * 100) : 0,
    aboveCeiling: income > values.contributionCeilingMonthly,
  };
}
