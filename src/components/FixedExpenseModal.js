import React, { useState } from "react";
import { X } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { useToast } from "../context/ToastContext";
import { currentPeriod } from "../utils/period";

export default function FixedExpenseModal({ period, editingItem, onClose }) {
  const { state, dispatch } = useFinance();
  const { showToast } = useToast();
  const isEditing = Boolean(editingItem);

  const [value, setValue] = useState(editingItem ? String(editingItem.value) : "");
  const [description, setDescription] = useState(editingItem?.description || "");
  const [categoryId, setCategoryId] = useState(editingItem?.categoryId || state.categories[0]?.id || "");
  const [dueDay, setDueDay] = useState(editingItem?.dueDay || 5);
  const [startPeriod, setStartPeriod] = useState(editingItem?.startPeriod || period || currentPeriod());
  const [recurrence, setRecurrence] = useState(editingItem?.recurrence || "indeterminado");
  const [endPeriod, setEndPeriod] = useState(editingItem?.endPeriod || period || currentPeriod());
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!description.trim() || !(Number(value) > 0)) {
      setError("Preencha o valor e a descrição.");
      return;
    }
    if (recurrence === "ate-data" && endPeriod < startPeriod) {
      setError("A data final precisa ser depois do início.");
      return;
    }

    const payload = {
      description: description.trim(),
      value: Number(value),
      categoryId: categoryId || null,
      dueDay: Math.min(31, Math.max(1, Number(dueDay) || 1)),
      startPeriod,
      recurrence,
      endPeriod: recurrence === "ate-data" ? endPeriod : null
    };

    if (isEditing) {
      dispatch({ type: "UPDATE_FIXED_EXPENSE", payload: { id: editingItem.id, changes: payload } });
      showToast("Despesa fixa atualizada.");
    } else {
      dispatch({ type: "ADD_FIXED_EXPENSE", payload });
      showToast("Despesa fixa adicionada — ela vai aparecer automaticamente todo mês.");
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="bg-card rounded-xl shadow-card border border-line w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              {isEditing ? "Editar despesa fixa" : "Nova despesa fixa"}
            </h2>
            <p className="text-xs text-muted">
              Aparece sozinha todo mês — você não precisa lançar de novo.
            </p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Valor</label>
            <input
              type="number"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="R$ 0,00"
              className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted block mb-1">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex.: Aluguel, Internet, Academia..."
              className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Categoria</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink"
              >
                {state.categories.length === 0 && <option value="">Sem categorias</option>}
                {state.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Dia do vencimento</label>
              <input
                type="number"
                min={1}
                max={31}
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted block mb-1">A partir de qual mês</label>
            <input
              type="month"
              value={startPeriod}
              onChange={(e) => setStartPeriod(e.target.value)}
              className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <p className="text-xs font-medium text-muted mb-2">Por quanto tempo</p>
            <div className="grid grid-cols-1 gap-2">
              <label
                className={`flex items-start gap-2 border rounded-lg p-3 cursor-pointer ${
                  recurrence === "indeterminado" ? "border-primary bg-primary-light" : "border-line"
                }`}
              >
                <input
                  type="radio"
                  name="recurrence"
                  checked={recurrence === "indeterminado"}
                  onChange={() => setRecurrence("indeterminado")}
                  className="mt-0.5"
                />
                <span>
                  <span className="block text-sm font-medium text-ink">Tempo indeterminado</span>
                  <span className="block text-xs text-muted mt-0.5">
                    Continua aparecendo todo mês até você editar ou remover.
                  </span>
                </span>
              </label>
              <label
                className={`flex items-start gap-2 border rounded-lg p-3 cursor-pointer ${
                  recurrence === "ate-data" ? "border-primary bg-primary-light" : "border-line"
                }`}
              >
                <input
                  type="radio"
                  name="recurrence"
                  checked={recurrence === "ate-data"}
                  onChange={() => setRecurrence("ate-data")}
                  className="mt-0.5"
                />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">Até uma data específica</span>
                  <span className="block text-xs text-muted mt-0.5 mb-2">
                    Some da lista sozinha depois desse mês (ex.: financiamento, parcelamento).
                  </span>
                  {recurrence === "ate-data" && (
                    <input
                      type="month"
                      value={endPeriod}
                      onChange={(e) => setEndPeriod(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  )}
                </span>
              </label>
            </div>
          </div>

          {error && <p className="text-xs text-expense">{error}</p>}
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 text-sm font-medium text-muted border border-line rounded-lg py-2 hover:bg-surface"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 text-sm font-medium text-white bg-primary rounded-lg py-2 hover:bg-primary-dark"
          >
            {isEditing ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
