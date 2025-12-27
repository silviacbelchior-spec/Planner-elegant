
export interface FinancialEntry {
  id: string;
  description: string;
  value: number;
  date?: string;
  category?: string;
}

export interface MonthlyData {
  month: string;
  year: number;
  mainGoal: string;
  goldenTip: string; // Added golden tip field
  income: FinancialEntry[];
  fixedExpenses: FinancialEntry[];
  variableExpenses: FinancialEntry[];
  savings: number;
  dailyNotes: { [day: number]: string };
  reflection: {
    bestSpent: string;
    improvement: string;
    savedAmount: string;
    positiveDecision: string;
    nextMonthPriority: string;
  };
}

export interface AnnualData {
  goals: string[];
  predictedIncome: number;
  annualFixedExpenses: FinancialEntry[];
  debts: FinancialEntry[];
  plannedSavings: number;
  savingsTips: string;
}

export interface PlannerState {
  annual: AnnualData;
  months: MonthlyData[];
}
