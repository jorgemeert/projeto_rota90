export function currentPeriod() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function shiftPeriod(period, delta) {
  const [year, month] = period.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function formatPeriodLabel(period) {
  const [year, month] = period.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  const label = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// Conta quantos meses existem entre dois períodos "YYYY-MM", inclusive.
export function monthsBetween(startPeriod, endPeriod) {
  const [sy, sm] = startPeriod.split("-").map(Number);
  const [ey, em] = endPeriod.split("-").map(Number);
  return (ey - sy) * 12 + (em - sm) + 1;
}

// Gera uma data "YYYY-MM-DD" dentro do período, ajustando o dia se o mês for mais curto
// (ex.: dia 31 em fevereiro vira o último dia daquele mês).
export function clampDateInPeriod(period, day) {
  const [year, month] = period.split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  const safeDay = Math.min(Math.max(1, Number(day) || 1), lastDay);
  return `${period}-${String(safeDay).padStart(2, "0")}`;
}

// Diz se uma despesa fixa recorrente está ativa em um determinado período.
export function isFixedActiveInPeriod(template, period) {
  if (template.startPeriod && period < template.startPeriod) return false;
  if (template.recurrence === "ate-data" && template.endPeriod && period > template.endPeriod) {
    return false;
  }
  return true;
}
