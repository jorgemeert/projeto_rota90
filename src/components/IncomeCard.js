import React from "react";
import { useFinance } from "../context/FinanceContext";
import { computeMonthlySalary, effectiveSalaryForPeriod } from "../utils/salary";

function formatBRL(value, hide) {
  if (hide) return "••••";
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const BASIS_OPTIONS = [
  { id: "mensal", label: "Mensal" },
  { id: "diaria", label: "Por dia" },
  { id: "horaria", label: "Por hora" }
];

export default function IncomeCard({ period }) {
  const { state, dispatch } = useFinance();
  const { hideValues, salaryConfig } = state;
  const income = state.incomeByPeriod[period] || { salary: 0, extraIncome: 0 };
  const extraIncome = income.extraIncome || 0;

  const salaryValue = effectiveSalaryForPeriod(state, period);
  const total = salaryValue + Number(extraIncome);
  const salaryPct = total > 0 ? (salaryValue / total) * 100 : 0;
  const extraPct = total > 0 ? (Number(extraIncome) / total) * 100 : 0;

  function updateSalaryConfig(changes) {
    dispatch({ type: "SET_SALARY_CONFIG", payload: changes });
  }

  function handleModeChange(mode) {
    const payload = { mode };
    if (mode === "fixo" && !salaryConfig.startPeriod) {
      payload.startPeriod = period;
    }
    updateSalaryConfig(payload);
  }

  function setExtra(val) {
    dispatch({ type: "SET_INCOME_FIELD", payload: { period, field: "extraIncome", value: Number(val) || 0 } });
  }

  function setVariableSalary(val) {
    dispatch({ type: "SET_INCOME_FIELD", payload: { period, field: "salary", value: Number(val) || 0 } });
  }

  return (
    <div className="bg-card rounded-xl shadow-card border border-line p-5">
      <h2 className="font-display font-semibold text-ink mb-1">Receitas</h2>
      <p className="text-xs text-muted mb-4">Valores referentes ao período selecionado.</p>

      {/* Salário */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-muted">Salário</label>
          <div className="flex bg-surface border border-line rounded-lg p-0.5">
            <button
              onClick={() => handleModeChange("fixo")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                salaryConfig.mode === "fixo" ? "bg-primary text-white" : "text-muted"
              }`}
            >
              Fixo
            </button>
            <button
              onClick={() => handleModeChange("variavel")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                salaryConfig.mode === "variavel" ? "bg-primary text-white" : "text-muted"
              }`}
            >
              Variável
            </button>
          </div>
        </div>

        {salaryConfig.mode === "variavel" ? (
          <div>
            <input
              type="number"
              inputMode="decimal"
              value={income.salary || ""}
              onChange={(e) => setVariableSalary(e.target.value)}
              placeholder="R$ 0,00"
              className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className="text-xs text-muted mt-1">
              Como é variável, você digita o valor de novo todo mês.
            </p>
          </div>
        ) : (
          <div className="bg-surface border border-line rounded-lg p-3 space-y-3">
            <div className="flex bg-card border border-line rounded-lg p-0.5">
              {BASIS_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateSalaryConfig({ basis: opt.id })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    salaryConfig.basis === opt.id ? "bg-primary text-white" : "text-muted"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {salaryConfig.basis === "mensal" && (
              <div>
                <label className="text-xs font-medium text-muted block mb-1">Valor mensal</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={salaryConfig.monthlyValue || ""}
                  onChange={(e) => updateSalaryConfig({ monthlyValue: Number(e.target.value) || 0 })}
                  placeholder="R$ 0,00"
                  className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}

            {salaryConfig.basis === "diaria" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">Valor por dia</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={salaryConfig.dailyRate || ""}
                    onChange={(e) => updateSalaryConfig({ dailyRate: Number(e.target.value) || 0 })}
                    placeholder="R$ 0,00"
                    className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">Dias/semana</label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={salaryConfig.daysPerWeek || ""}
                    onChange={(e) => updateSalaryConfig({ daysPerWeek: Number(e.target.value) || 0 })}
                    className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            )}

            {salaryConfig.basis === "horaria" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">Valor da hora</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={salaryConfig.hourlyRate || ""}
                    onChange={(e) => updateSalaryConfig({ hourlyRate: Number(e.target.value) || 0 })}
                    placeholder="R$ 0,00"
                    className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">Horas/semana</label>
                  <input
                    type="number"
                    min={1}
                    max={168}
                    value={salaryConfig.hoursPerWeek || ""}
                    onChange={(e) => updateSalaryConfig({ hoursPerWeek: Number(e.target.value) || 0 })}
                    className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            )}

            <p className="text-xs text-muted border-t border-line pt-2">
              ≈ <strong className="text-ink">{formatBRL(computeMonthlySalary(salaryConfig), hideValues)}</strong>{" "}
              por mês (média de 4,33 semanas). Calculado automaticamente — não precisa preencher de novo.
            </p>
          </div>
        )}
      </div>

      {/* Renda extra */}
      <div>
        <label className="text-xs font-medium text-muted block mb-1">Renda extra</label>
        <input
          type="number"
          inputMode="decimal"
          value={extraIncome || ""}
          onChange={(e) => setExtra(e.target.value)}
          placeholder="R$ 0,00"
          className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="mt-4 pt-4 border-t border-line">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted uppercase tracking-wide">Total</span>
          <span className="font-display text-lg font-bold text-primary">{formatBRL(total, hideValues)}</span>
        </div>

        {total > 0 ? (
          <>
            <div className="h-2.5 rounded-full bg-line overflow-hidden flex">
              <div className="h-full bg-primary" style={{ width: `${salaryPct}%` }} />
              <div className="h-full bg-invest" style={{ width: `${extraPct}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" /> Salário {salaryPct.toFixed(0)}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-invest" /> Renda extra {extraPct.toFixed(0)}%
              </span>
            </div>
          </>
        ) : (
          <p className="text-xs text-muted">Preencha os valores acima para ver a composição.</p>
        )}
      </div>
    </div>
  );
}
