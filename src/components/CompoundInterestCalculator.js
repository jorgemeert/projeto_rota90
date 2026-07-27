import React, { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function formatBRL(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CompoundInterestCalculator() {
  const [initial, setInitial] = useState("1000");
  const [monthly, setMonthly] = useState("200");
  const [rate, setRate] = useState("0.8");
  const [months, setMonths] = useState("24");

  const result = useMemo(() => {
    const p0 = Number(initial) || 0;
    const contribution = Number(monthly) || 0;
    const monthlyRate = (Number(rate) || 0) / 100;
    const totalMonths = Math.max(0, Math.min(600, Number(months) || 0));

    const series = [];
    let balance = p0;
    let totalInvested = p0;
    for (let m = 0; m <= totalMonths; m++) {
      if (m > 0) {
        balance = balance * (1 + monthlyRate) + contribution;
        totalInvested += contribution;
      }
      series.push({ month: m, balance: Math.round(balance) });
    }
    const finalBalance = series[series.length - 1]?.balance || p0;
    return { series, finalBalance, totalInvested, interestEarned: finalBalance - totalInvested };
  }, [initial, monthly, rate, months]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Valor inicial</label>
          <input
            type="number"
            inputMode="decimal"
            value={initial}
            onChange={(e) => setInitial(e.target.value)}
            className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Aporte mensal</label>
          <input
            type="number"
            inputMode="decimal"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Juros ao mês (%)</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Período (meses)</label>
          <input
            type="number"
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-surface border border-line rounded-lg p-3">
          <p className="text-xs text-muted">Valor final</p>
          <p className="font-display text-lg font-bold text-ink">{formatBRL(result.finalBalance)}</p>
        </div>
        <div className="bg-surface border border-line rounded-lg p-3">
          <p className="text-xs text-muted">Total investido</p>
          <p className="font-display text-lg font-bold text-ink">{formatBRL(result.totalInvested)}</p>
        </div>
        <div className="bg-surface border border-line rounded-lg p-3">
          <p className="text-xs text-muted">Juros ganhos</p>
          <p className="font-display text-lg font-bold text-primary">{formatBRL(result.interestEarned)}</p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={result.series} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0E7A57" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0E7A57" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(m) => `${m}m`} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} width={38} />
            <Tooltip
              formatter={(v) => formatBRL(v)}
              labelFormatter={(m) => `Mês ${m}`}
              contentStyle={{
                backgroundColor: "rgb(var(--color-card))",
                border: "1px solid rgb(var(--color-line))",
                borderRadius: "8px",
                color: "rgb(var(--color-ink))"
              }}
            />
            <Area type="monotone" dataKey="balance" stroke="#0E7A57" strokeWidth={2} fill="url(#growth)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
