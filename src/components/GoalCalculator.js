import React, { useMemo, useState } from "react";
import { Target } from "lucide-react";

function formatBRL(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function GoalCalculator() {
  const [goal, setGoal] = useState("10000");
  const [months, setMonths] = useState("12");
  const [saved, setSaved] = useState("0");

  const result = useMemo(() => {
    const remaining = Math.max(0, (Number(goal) || 0) - (Number(saved) || 0));
    const totalMonths = Math.max(1, Number(months) || 1);
    return { remaining, perMonth: remaining / totalMonths };
  }, [goal, months, saved]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Valor da meta</label>
          <input
            type="number"
            inputMode="decimal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Já guardado</label>
          <input
            type="number"
            inputMode="decimal"
            value={saved}
            onChange={(e) => setSaved(e.target.value)}
            className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Prazo (meses)</label>
          <input
            type="number"
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="bg-surface border border-line rounded-lg p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
          <Target size={18} className="text-primary-dark" />
        </div>
        <div>
          <p className="text-xs text-muted">Guarde por mês para bater a meta</p>
          <p className="font-display text-xl font-bold text-ink">{formatBRL(result.perMonth)}</p>
          <p className="text-xs text-muted mt-0.5">Faltam {formatBRL(result.remaining)} no total</p>
        </div>
      </div>
    </div>
  );
}
