import React, { useEffect, useMemo, useState } from "react";
import { Calculator, Plus, Trash2 } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { computeMonthlySalary, effectiveSalaryForPeriod, getVariableSalaryEntries, getEntryNet } from "../utils/salary";

function formatBRL(value, hide) {
  if (hide) return "••••";
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const BASIS_OPTIONS = [
  { id: "mensal", label: "Mensal" },
  { id: "diaria", label: "Por dia" },
  { id: "horaria", label: "Por hora" }
];

const FREQUENCY_OPTIONS = [
  { id: "diaria", label: "Diário" },
  { id: "semanal", label: "Semanal" },
  { id: "mensal", label: "Mensal" }
];

const emptyCost = () => ({ id: Math.random().toString(36).slice(2, 9), description: "", value: "" });

export default function IncomeCard({ period }) {
  const { state, dispatch } = useFinance();
  const { hideValues, salaryConfig } = state;
  const income = state.incomeByPeriod[period] || { salary: 0, extraIncome: 0 };
  const extraIncome = Number(income.extraIncome || 0);
  const entries = useMemo(() => getVariableSalaryEntries(state, period), [state, period]);
  const salaryValue = effectiveSalaryForPeriod(state, period);
  const total = salaryValue + extraIncome;
  const salaryPct = total > 0 ? (salaryValue / total) * 100 : 0;
  const extraPct = total > 0 ? (extraIncome / total) * 100 : 0;

  const [date, setDate] = useState(`${period}-${new Date().getDate().toString().padStart(2, "0")}`);
  const [gross, setGross] = useState("");
  const [costs, setCosts] = useState([]);

  useEffect(() => {
    const today = new Date();
    const day = Math.min(today.getDate(), new Date(Number(period.slice(0, 4)), Number(period.slice(5, 7)), 0).getDate());
    setDate(`${period}-${String(day).padStart(2, "0")}`);
  }, [period]);

  function updateSalaryConfig(changes) {
    dispatch({ type: "SET_SALARY_CONFIG", payload: changes });
  }

  function handleModeChange(mode) {
    const payload = { mode };
    if (mode === "fixo" && !salaryConfig.startPeriod) payload.startPeriod = period;
    updateSalaryConfig(payload);
  }

  function setExtra(val) {
    dispatch({ type: "SET_INCOME_FIELD", payload: { period, field: "extraIncome", value: Number(val) || 0 } });
  }

  function addCost() {
    setCosts((current) => [...current, emptyCost()]);
  }

  function updateCost(id, changes) {
    setCosts((current) => current.map((cost) => cost.id === id ? { ...cost, ...changes } : cost));
  }

  function removeCost(id) {
    setCosts((current) => current.filter((cost) => cost.id !== id));
  }

  function addSalaryEntry() {
    const grossValue = Number(gross);
    if (!(grossValue > 0)) return;
    const normalizedCosts = salaryConfig.useCostCalculator
      ? costs.filter((cost) => Number(cost.value) > 0).map((cost) => ({ ...cost, value: Number(cost.value) }))
      : [];
    const totalCosts = normalizedCosts.reduce((sum, cost) => sum + cost.value, 0);
    const net = Math.max(0, grossValue - totalCosts);
    dispatch({
      type: "ADD_SALARY_ENTRY",
      payload: {
        period,
        entry: {
          date,
          frequency: salaryConfig.variableFrequency,
          gross: grossValue,
          costs: normalizedCosts,
          net
        }
      }
    });
    setGross("");
    setCosts([]);
  }

  function removeSalaryEntry(id) {
    if (id === "legacy") return;
    dispatch({ type: "REMOVE_SALARY_ENTRY", payload: { period, id } });
  }

  return (
    <div className="bg-card rounded-xl shadow-card border border-line p-5">
      <h2 className="font-display font-semibold text-ink mb-1">Receitas</h2>
      <p className="text-xs text-muted mb-4">Valores referentes ao período selecionado.</p>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-muted">Salário</label>
          <div className="flex bg-surface border border-line rounded-lg p-0.5">
            <button onClick={() => handleModeChange("fixo")} className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${salaryConfig.mode === "fixo" ? "bg-primary text-white" : "text-muted"}`}>Fixo</button>
            <button onClick={() => handleModeChange("variavel")} className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${salaryConfig.mode === "variavel" ? "bg-primary text-white" : "text-muted"}`}>Variável</button>
          </div>
        </div>

        {salaryConfig.mode === "variavel" ? (
          <div className="space-y-3">
            <div className="bg-surface border border-line rounded-lg p-3 space-y-3">
              <div>
                <label className="text-xs font-medium text-muted block mb-1">Frequência dos lançamentos</label>
                <div className="flex bg-card border border-line rounded-lg p-0.5">
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <button key={opt.id} onClick={() => updateSalaryConfig({ variableFrequency: opt.id })} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${salaryConfig.variableFrequency === opt.id ? "bg-primary text-white" : "text-muted"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
                <input type="checkbox" checked={Boolean(salaryConfig.useCostCalculator)} onChange={(e) => updateSalaryConfig({ useCostCalculator: e.target.checked })} />
                <Calculator size={14} className="text-primary" />
                Usar calculadora de custos
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">{salaryConfig.variableFrequency === "mensal" ? "Mês" : "Data"}</label>
                  <input type={salaryConfig.variableFrequency === "mensal" ? "month" : "date"} value={salaryConfig.variableFrequency === "mensal" ? date.slice(0, 7) : date} onChange={(e) => setDate(salaryConfig.variableFrequency === "mensal" ? `${e.target.value}-01` : e.target.value)} className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">{salaryConfig.useCostCalculator ? "Salário bruto" : "Valor recebido"}</label>
                  <input type="number" inputMode="decimal" min="0" value={gross} onChange={(e) => setGross(e.target.value)} placeholder="R$ 0,00" className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>

              {salaryConfig.useCostCalculator && (
                <div className="border-t border-line pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted">Custos do lançamento</span>
                    <button onClick={addCost} className="text-xs font-medium text-primary flex items-center gap-1"><Plus size={13} /> Adicionar custo</button>
                  </div>
                  {costs.length === 0 && <p className="text-xs text-muted">Adicione gasolina, pneus, óleo, manutenção ou outros custos.</p>}
                  {costs.map((cost) => (
                    <div key={cost.id} className="grid grid-cols-[1fr_92px_28px] gap-2">
                      <input value={cost.description} onChange={(e) => updateCost(cost.id, { description: e.target.value })} placeholder="Ex.: Gasolina" className="w-full p-2 border border-line rounded-lg text-xs bg-card text-ink" />
                      <input type="number" inputMode="decimal" min="0" value={cost.value} onChange={(e) => updateCost(cost.id, { value: e.target.value })} placeholder="R$ 0" className="w-full p-2 border border-line rounded-lg text-xs bg-card text-ink" />
                      <button onClick={() => removeCost(cost.id)} className="flex items-center justify-center text-muted hover:text-expense" aria-label="Remover custo"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-muted">Líquido deste lançamento</span>
                    <strong className="text-primary">{formatBRL(Math.max(0, Number(gross || 0) - costs.reduce((s, c) => s + Number(c.value || 0), 0)), hideValues)}</strong>
                  </div>
                </div>
              )}

              <button onClick={addSalaryEntry} disabled={!(Number(gross) > 0)} className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-primary rounded-lg py-2 hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus size={15} /> Adicionar lançamento
              </button>
            </div>

            {entries.length > 0 && (
              <div className="border border-line rounded-lg divide-y divide-line overflow-hidden">
                {entries.map((entry) => (
                  <div key={entry.id} className="p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-ink">{entry.date ? entry.date.split("-").reverse().join("/") : "Lançamento"}</p>
                      <p className="text-[11px] text-muted">{entry.frequency === "semanal" ? "Semanal" : entry.frequency === "mensal" ? "Mensal" : "Diário"}{salaryConfig.useCostCalculator && entry.costs?.length ? ` · ${entry.costs.length} custo(s)` : ""}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-primary">{formatBRL(getEntryNet(entry), hideValues)}</strong>
                      {entry.id !== "legacy" && <button onClick={() => removeSalaryEntry(entry.id)} className="text-muted hover:text-expense" aria-label="Remover lançamento"><Trash2 size={14} /></button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted">Os lançamentos ficam acumulados no mês selecionado. Você pode registrar valores diferentes todos os dias, semanas ou meses.</p>
          </div>
        ) : (
          <div className="bg-surface border border-line rounded-lg p-3 space-y-3">
            <div className="flex bg-card border border-line rounded-lg p-0.5">
              {BASIS_OPTIONS.map((opt) => (
                <button key={opt.id} onClick={() => updateSalaryConfig({ basis: opt.id })} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${salaryConfig.basis === opt.id ? "bg-primary text-white" : "text-muted"}`}>{opt.label}</button>
              ))}
            </div>
            {salaryConfig.basis === "mensal" && <div><label className="text-xs font-medium text-muted block mb-1">Valor mensal</label><input type="number" inputMode="decimal" value={salaryConfig.monthlyValue || ""} onChange={(e) => updateSalaryConfig({ monthlyValue: Number(e.target.value) || 0 })} placeholder="R$ 0,00" className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink" /></div>}
            {salaryConfig.basis === "diaria" && <div className="grid grid-cols-2 gap-2"><div><label className="text-xs font-medium text-muted block mb-1">Valor por dia</label><input type="number" inputMode="decimal" value={salaryConfig.dailyRate || ""} onChange={(e) => updateSalaryConfig({ dailyRate: Number(e.target.value) || 0 })} placeholder="R$ 0,00" className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink" /></div><div><label className="text-xs font-medium text-muted block mb-1">Dias/semana</label><input type="number" min="1" max="7" value={salaryConfig.daysPerWeek || ""} onChange={(e) => updateSalaryConfig({ daysPerWeek: Number(e.target.value) || 0 })} className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink" /></div></div>}
            {salaryConfig.basis === "horaria" && <div className="grid grid-cols-2 gap-2"><div><label className="text-xs font-medium text-muted block mb-1">Valor da hora</label><input type="number" inputMode="decimal" value={salaryConfig.hourlyRate || ""} onChange={(e) => updateSalaryConfig({ hourlyRate: Number(e.target.value) || 0 })} placeholder="R$ 0,00" className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink" /></div><div><label className="text-xs font-medium text-muted block mb-1">Horas/semana</label><input type="number" min="1" max="168" value={salaryConfig.hoursPerWeek || ""} onChange={(e) => updateSalaryConfig({ hoursPerWeek: Number(e.target.value) || 0 })} className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink" /></div></div>}
            <p className="text-xs text-muted border-t border-line pt-2">≈ <strong className="text-ink">{formatBRL(computeMonthlySalary(salaryConfig), hideValues)}</strong> por mês (média de 4,33 semanas). Calculado automaticamente — não precisa preencher de novo.</p>
          </div>
        )}
      </div>

      <div>
        <label className="text-xs font-medium text-muted block mb-1">Renda extra</label>
        <input type="number" inputMode="decimal" value={extraIncome || ""} onChange={(e) => setExtra(e.target.value)} placeholder="R$ 0,00" className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink" />
      </div>

      <div className="mt-4 pt-4 border-t border-line">
        <div className="flex items-center justify-between mb-2"><span className="text-xs font-medium text-muted uppercase tracking-wide">Total</span><span className="font-display text-lg font-bold text-primary">{formatBRL(total, hideValues)}</span></div>
        {total > 0 ? <><div className="h-2.5 rounded-full bg-line overflow-hidden flex"><div className="h-full bg-primary" style={{ width: `${salaryPct}%` }} /><div className="h-full bg-invest" style={{ width: `${extraPct}%` }} /></div><div className="mt-2 flex justify-between text-xs text-muted"><span>● Salário {salaryPct.toFixed(0)}%</span><span>● Renda extra {extraPct.toFixed(0)}%</span></div></> : <p className="text-xs text-muted">Preencha os valores acima para ver a composição.</p>}
      </div>
    </div>
  );
}
