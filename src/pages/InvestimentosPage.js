import React from "react";
import { Droplets, ShieldCheck, PiggyBank, Building2, Landmark } from "lucide-react";
import TopBar from "../components/TopBar";
import ShieldProgress from "../components/ShieldProgress";
import { useFinance } from "../context/FinanceContext";

function formatBRL(value, hide) {
  if (hide) return "••••••";
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const ALLOCATION_FIELDS = [
  { key: "caixinha", label: "Caixinha", icon: PiggyBank },
  { key: "banco", label: "Banco tradicional", icon: Building2 },
  { key: "tesouro", label: "Tesouro Selic", icon: Landmark }
];

const INFO_CARDS = [
  {
    title: "Liquidez em primeiro lugar",
    text: "Sua reserva de emergência precisa estar disponível para saque a qualquer momento — não é hora de travar o dinheiro buscando mais rentabilidade."
  },
  {
    title: "Proteção, não rentabilidade agressiva",
    text: "O objetivo aqui é segurança contra imprevistos, não fazer o dinheiro render ao máximo. Deixe a busca por rentabilidade para depois da reserva completa."
  },
  {
    title: "6 a 12 meses de cobertura",
    text: "O ideal costuma variar entre 6 e 12 meses do seu custo de vida, dependendo da estabilidade da sua renda."
  }
];

export default function InvestimentosPage({ onOpenSidebar }) {
  const { state, dispatch, totals } = useFinance();
  const { hideValues } = state;

  return (
    <div>
      <TopBar title="Gestão de investimentos" onOpenSidebar={onOpenSidebar} />

      <div className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* Calculadora de reserva */}
          <div className="bg-card rounded-xl shadow-card border border-line p-5 lg:col-span-2">
            <h2 className="font-display font-semibold text-ink mb-1">Reserva de emergência</h2>
            <p className="text-xs text-muted mb-4">
              Defina seu custo mensal de vida e o tempo de cobertura desejado.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs font-medium text-muted block mb-1">Custo mensal de vida</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={state.monthlyCost || ""}
                  onChange={(e) =>
                    dispatch({ type: "SET_MONTHLY_COST", payload: Number(e.target.value) || 0 })
                  }
                  placeholder="R$ 0,00"
                  className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1">Tempo de cobertura</label>
                <div className="flex gap-2">
                  {[6, 12].map((months) => (
                    <button
                      key={months}
                      onClick={() => dispatch({ type: "SET_COVERAGE_MONTHS", payload: months })}
                      className={`flex-1 text-sm font-medium py-2 rounded-lg border transition-colors ${
                        state.coverageMonths === months
                          ? "bg-primary text-white border-primary"
                          : "bg-card text-muted border-line hover:border-primary/40"
                      }`}
                    >
                      {months} meses
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-surface border border-line rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">Valor necessário para a reserva</p>
                <p className="font-display text-xl font-bold text-ink">
                  {formatBRL(totals.reserveGoal, hideValues)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">Já guardado</p>
                <p className="font-display text-lg font-semibold text-primary">
                  {formatBRL(totals.reserveSaved, hideValues)}
                </p>
              </div>
            </div>

            {/* Alocação */}
            <h3 className="font-display font-semibold text-ink mt-6 mb-1">Onde está guardado</h3>
            <p className="text-xs text-muted mb-3">Registre o saldo em cada local para acompanhar o total.</p>
            <div className="space-y-2">
              {ALLOCATION_FIELDS.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.key} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-primary-dark" />
                    </div>
                    <label className="text-sm text-ink flex-1">{field.label}</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={state.allocations[field.key] || ""}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_ALLOCATION",
                          payload: { location: field.key, value: Number(e.target.value) || 0 }
                        })
                      }
                      placeholder="R$ 0,00"
                      className="w-36 p-2 border border-line rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Escudo de progresso */}
          <div className="bg-card rounded-xl shadow-card border border-line p-5 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted uppercase tracking-wide mb-3">
              <ShieldCheck size={14} className="text-primary" />
              Progresso da reserva
            </div>
            <ShieldProgress percent={totals.reserveProgress} />
            {totals.reserveGoal === 0 && (
              <p className="text-xs text-muted text-center mt-3">
                Defina seu custo mensal para calcular a meta.
              </p>
            )}
          </div>
        </div>

        {/* Cards informativos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {INFO_CARDS.map((card, index) => (
            <div key={card.title} className="bg-card rounded-xl shadow-card border border-line p-4">
              <div className="w-8 h-8 rounded-lg bg-invest-light flex items-center justify-center mb-2">
                {index === 0 ? (
                  <Droplets size={16} className="text-invest" />
                ) : (
                  <ShieldCheck size={16} className="text-invest" />
                )}
              </div>
              <h3 className="text-sm font-semibold text-ink mb-1">{card.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
