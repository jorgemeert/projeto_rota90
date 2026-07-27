import React, { useMemo, useState } from "react";
import { Repeat } from "lucide-react";
import TopBar from "../components/TopBar";
import FlowSummaryCard from "../components/FlowSummaryCard";
import IncomeCard from "../components/IncomeCard";
import PeriodSelector from "../components/PeriodSelector";
import Tabs from "../components/Tabs";
import EntryList from "../components/EntryList";
import CompositionPanel from "../components/CompositionPanel";
import ExpenseModal from "../components/ExpenseModal";
import FixedExpenseModal from "../components/FixedExpenseModal";
import { useFinance } from "../context/FinanceContext";
import { useToast } from "../context/ToastContext";
import { currentPeriod, clampDateInPeriod, isFixedActiveInPeriod, formatPeriodLabel } from "../utils/period";
import { effectiveSalaryForPeriod } from "../utils/salary";

const TABS = [
  { id: "despesa-fixa", label: "Despesas fixas" },
  { id: "despesa-variavel", label: "Despesas variáveis" }
];

function formatDate(iso) {
  if (!iso) return "Sem data";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function OrcamentoPage({ onOpenSidebar }) {
  const { state, dispatch } = useFinance();
  const { showToast } = useToast();
  const [period, setPeriod] = useState(currentPeriod);
  const [activeTab, setActiveTab] = useState("despesa-fixa");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // ocorrências das despesas fixas recorrentes que valem para o período selecionado
  const fixedInPeriod = useMemo(
    () =>
      state.fixedExpenses
        .filter((t) => isFixedActiveInPeriod(t, period))
        .map((t) => ({ ...t, dueDate: clampDateInPeriod(period, t.dueDay), recurring: true })),
    [state.fixedExpenses, period]
  );

  const variableInPeriod = useMemo(
    () => state.expenses.filter((e) => (e.dueDate || "").slice(0, 7) === period),
    [state.expenses, period]
  );

  const expensesInPeriod = useMemo(
    () => [...fixedInPeriod, ...variableInPeriod],
    [fixedInPeriod, variableInPeriod]
  );

  const currentList = activeTab === "despesa-fixa" ? fixedInPeriod : variableInPeriod;

  function categoryName(item) {
    const cat = state.categories.find((c) => c.id === item.categoryId);
    return cat ? cat.name : "Sem categoria";
  }

  // composição considera despesas fixas + variáveis do período, não só a aba ativa
  const compositionData = useMemo(() => {
    const map = new Map();
    expensesInPeriod.forEach((e) => {
      const label = categoryName(e);
      map.set(label, (map.get(label) || 0) + Number(e.value));
    });
    return Array.from(map, ([name, value]) => ({ name, value }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expensesInPeriod, state.categories]);

  const income = state.incomeByPeriod[period] || { salary: 0, extraIncome: 0 };
  const totalIncome = effectiveSalaryForPeriod(state, period) + Number(income.extraIncome || 0);
  const totalExpenses = expensesInPeriod.reduce((sum, e) => sum + Number(e.value), 0);
  const balance = totalIncome - totalExpenses;

  const emptyTextList =
    activeTab === "despesa-fixa" ? "Sem despesa fixa no período." : "Sem despesa variável no período.";
  const emptyTextChart = "Sem despesas neste período ainda.";

  function handleRemove(id) {
    if (activeTab === "despesa-fixa") {
      dispatch({ type: "REMOVE_FIXED_EXPENSE", payload: id });
      showToast("Despesa fixa removida — não vai mais aparecer em nenhum mês.");
    } else {
      dispatch({ type: "REMOVE_EXPENSE", payload: id });
      showToast("Despesa removida.");
    }
  }

  function renderFixedMeta(item) {
    const recurrenceLabel =
      item.recurrence === "ate-data"
        ? `até ${formatPeriodLabel(item.endPeriod)}`
        : "tempo indeterminado";
    return `${categoryName(item)} · dia ${item.dueDay} · ${recurrenceLabel}`;
  }

  return (
    <div>
      <TopBar title="Calculadora de orçamento" onOpenSidebar={onOpenSidebar} />
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PeriodSelector period={period} onChange={setPeriod} />
        </div>

        <FlowSummaryCard income={totalIncome} expenses={totalExpenses} balance={balance} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <div className="lg:col-span-1">
            <IncomeCard period={period} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

            {activeTab === "despesa-fixa" && (
              <p className="flex items-center gap-1.5 text-xs text-muted -mt-2">
                <Repeat size={12} /> Despesas fixas aparecem automaticamente todo mês, sem precisar lançar de novo.
              </p>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 items-start">
              <div className="xl:col-span-3">
                <EntryList
                  title={TABS.find((t) => t.id === activeTab).label}
                  items={currentList}
                  categories={state.categories}
                  emptyText={emptyTextList}
                  onAdd={() => {
                    setEditingItem(null);
                    setModalOpen(true);
                  }}
                  onEdit={(item) => {
                    setEditingItem(item);
                    setModalOpen(true);
                  }}
                  onRemove={handleRemove}
                  valueColorClass="text-expense"
                  renderMeta={
                    activeTab === "despesa-fixa"
                      ? renderFixedMeta
                      : (item) => `${categoryName(item)} · vence em ${formatDate(item.dueDate)}`
                  }
                />
              </div>
              <div className="xl:col-span-2">
                <CompositionPanel data={compositionData} emptyText={emptyTextChart} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && activeTab === "despesa-fixa" && (
        <FixedExpenseModal
          period={period}
          editingItem={editingItem}
          onClose={() => {
            setModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}
      {modalOpen && activeTab === "despesa-variavel" && (
        <ExpenseModal
          variant={activeTab}
          editingItem={editingItem}
          onClose={() => {
            setModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}
