import React from "react";
import { PieChart as PieIcon } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0E7A57", "#2B5FC0", "#B7791F", "#7C3AED", "#C0392B"];

function formatBRL(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CompositionPanel({ data, emptyText }) {
  const hasData = data.length > 0;

  return (
    <div className="bg-card rounded-xl shadow-card border border-line p-5 h-full flex flex-col">
      <h2 className="font-display font-semibold text-ink mb-4">Composição</h2>
      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
          <PieIcon size={32} className="text-line mb-3" />
          <p className="text-sm text-muted">{emptyText}</p>
        </div>
      ) : (
        <div className="flex-1">
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={38} outerRadius={60}>
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => formatBRL(v)}
                  contentStyle={{
                    backgroundColor: "rgb(var(--color-card))",
                    border: "1px solid rgb(var(--color-line))",
                    borderRadius: "8px",
                    color: "rgb(var(--color-ink))"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1.5">
            {data.map((d, index) => (
              <li key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {d.name}
                </span>
                <span className="text-muted">{formatBRL(d.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
