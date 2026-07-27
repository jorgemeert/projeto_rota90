import React from "react";
import { ShieldCheck, Wallet, TrendingUp } from "lucide-react";
import TopBar from "../components/TopBar";
import SummaryBar from "../components/SummaryBar";
import { useFinance } from "../context/FinanceContext";

function formatBRL(value, hide) {
  if (hide) return "••••••";
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function VisaoGeralPage({ onOpenSidebar, onNavigate }) {
  const { state, totals } = useFinance();

  const isNewUser =
    state.expenses.length === 0 &&
    state.assets.length === 0 &&
    Object.keys(state.incomeByPeriod).length === 0;

  const totalProtegido = totals.netWorth + totals.reserveSaved;

  return (
    <div>
      <TopBar title="Visão geral" onOpenSidebar={onOpenSidebar} />
      <div className="space-y-5">
        <SummaryBar />

        {isNewUser ? (
          <div className="bg-card rounded-xl shadow-card border border-line p-6">
            <h2 className="font-display font-semibold text-ink mb-1">Comece por aqui</h2>
            <p className="text-sm text-muted mb-4">
              Ainda não há nada lançado. Sugestão de ordem para organizar suas finanças:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate("orcamento")}
                className="w-full flex items-center gap-3 text-left p-3 rounded-lg border border-line hover:bg-surface"
              >
                <Wallet size={18} className="text-primary shrink-0" />
                <span className="text-sm text-ink">
                  <strong>1. Orçamento</strong> — lance seu salário e suas despesas fixas/variáveis.
                </span>
              </button>
              <button
                onClick={() => onNavigate("investimentos")}
                className="w-full flex items-center gap-3 text-left p-3 rounded-lg border border-line hover:bg-surface"
              >
                <ShieldCheck size={18} className="text-invest shrink-0" />
                <span className="text-sm text-ink">
                  <strong>2. Investimentos</strong> — monte sua reserva de emergência.
                </span>
              </button>
              <button
                onClick={() => onNavigate("patrimonio")}
                className="w-full flex items-center gap-3 text-left p-3 rounded-lg border border-line hover:bg-surface"
              >
                <TrendingUp size={18} className="text-ink shrink-0" />
                <span className="text-sm text-ink">
                  <strong>3. Patrimônio</strong> — registre ativos e dívidas.
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-card border border-line p-5">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={18} className="text-primary" />
              <h2 className="font-display font-semibold text-ink">Patrimônio total protegido</h2>
            </div>
            <p className="text-xs text-muted mb-3">
              Soma do seu patrimônio líquido (ativos − dívidas) com o que já está guardado na
              reserva de emergência.
            </p>
            <p className="font-display text-2xl font-bold text-ink mb-4">
              {formatBRL(totalProtegido, state.hideValues)}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate("orcamento")}
                className="text-sm font-medium text-white bg-primary px-4 py-2 rounded-lg hover:bg-primary-dark"
              >
                Ir para Orçamento
              </button>
              <button
                onClick={() => onNavigate("investimentos")}
                className="text-sm font-medium text-invest bg-invest-light px-4 py-2 rounded-lg hover:brightness-95"
              >
                Ver Investimentos
              </button>
              <button
                onClick={() => onNavigate("patrimonio")}
                className="text-sm font-medium text-ink border border-line px-4 py-2 rounded-lg hover:bg-surface"
              >
                Ver Patrimônio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
