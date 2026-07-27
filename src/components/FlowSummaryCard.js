import React from "react";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

function formatBRL(value, hide) {
  if (hide) return "••••••";
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function FlowSummaryCard({ income, expenses, balance }) {
  const { state } = useFinance();

  const items = [
    { label: "Total ganho", value: income, icon: ArrowUpCircle, color: "#0E7A57" },
    { label: "Total gasto", value: expenses, icon: ArrowDownCircle, color: "#C0392B" },
    {
      label: "Saldo disponível",
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? "#0E7A57" : "#C0392B"
    }
  ];

  return (
    <div className="bg-midnight rounded-xl shadow-card p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${item.color}33` }}
            >
              <Icon size={20} style={{ color: item.color }} />
            </div>
            <div>
              <p className="text-xs text-white/60">{item.label}</p>
              <p className="font-display text-lg font-bold text-white">
                {formatBRL(item.value, state.hideValues)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
