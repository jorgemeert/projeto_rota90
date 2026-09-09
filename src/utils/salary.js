const WEEKS_PER_MONTH = 52 / 12;

export function computeMonthlySalary(config) {
  if (!config) return 0;
  switch (config.basis) {
    case "diaria":
      return Number(config.dailyRate || 0) * Number(config.daysPerWeek || 0) * WEEKS_PER_MONTH;
    case "horaria":
      return Number(config.hourlyRate || 0) * Number(config.hoursPerWeek || 0) * WEEKS_PER_MONTH;
    case "mensal":
    default:
      return Number(config.monthlyValue || 0);
  }
}

export function getVariableSalaryEntries(state, period) {
  const income = state.incomeByPeriod[period] || {};
  if (Array.isArray(income.salaryEntries)) return income.salaryEntries;
  const legacySalary = Number(income.salary || 0);
  return legacySalary > 0 ? [{ id: "legacy", date: `${period}-01`, gross: legacySalary, costs: [], net: legacySalary }] : [];
}

export function getEntryNet(entry) {
  if (entry?.net != null) return Number(entry.net || 0);
  const gross = Number(entry?.gross || entry?.value || 0);
  const costs = Array.isArray(entry?.costs) ? entry.costs.reduce((sum, c) => sum + Number(c.value || 0), 0) : Number(entry?.costs || 0);
  return Math.max(0, gross - costs);
}

export function sumVariableSalary(state, period) {
  return getVariableSalaryEntries(state, period).reduce((sum, entry) => sum + getEntryNet(entry), 0);
}

export function effectiveSalaryForPeriod(state, period) {
  const config = state.salaryConfig;
  if (config && config.mode === "fixo") return computeMonthlySalary(config);
  return sumVariableSalary(state, period);
}
