const WEEKS_PER_MONTH = 52 / 12; // média de semanas por mês (~4,33)

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

// Salário "de verdade" para um período: se for fixo, calculado a partir da configuração;
// se for variável, o valor que a pessoa digitou manualmente naquele mês.
export function effectiveSalaryForPeriod(state, period) {
  const config = state.salaryConfig;
  if (config && config.mode === "fixo") {
    return computeMonthlySalary(config);
  }
  return Number((state.incomeByPeriod[period] || {}).salary || 0);
}
