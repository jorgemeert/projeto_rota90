import React from "react";
import { Wallet, ArrowDownCircle, PiggyBank, Landmark } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

function formatBRL(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function StatCard({ icon: Icon, iconColor, label, value, hideValues }) {
  return (
    <div className="bg-card rounded-xl shadow-card border border-line p-4 flex-1 min-w-[160px]">
      <div className="flex items-center gap-1.5 text-muted text-xs uppercase tracking-wide font-medium mb-2">
        <Icon size={14} style={{ color: iconColor }} />
        {label}
      </div>
      <p className="font-display text-xl font-bold text-ink">
        {hideValues ? "••••••" : formatBRL(value)}
      </p>
    </div>
  );
}

export default function SummaryBar() {
  const { totals, state } = useFinance();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard icon={Wallet} iconColor="#0E7A57" label="Receita" value={totals.totalIncome} hideValues={state.hideValues} />
      <StatCard icon={ArrowDownCircle} iconColor="#C0392B" label="Despesas" value={totals.totalExpenses} hideValues={state.hideValues} />
      <StatCard icon={PiggyBank} iconColor="#0F172A" label="Saldo" value={totals.balance} hideValues={state.hideValues} />
      <StatCard icon={Landmark} iconColor="#2B5FC0" label="Patrimônio líquido" value={totals.netWorth} hideValues={state.hideValues} />
    </div>
  );
}
