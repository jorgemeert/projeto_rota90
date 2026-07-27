import React, { useState } from "react";
import { X } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { useToast } from "../context/ToastContext";

const CONFIG = {
  "despesa-fixa": { title: "despesa fixa", kind: "fixed" },
  "despesa-variavel": { title: "despesa variável", kind: "variable" }
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function ExpenseModal({ variant, editingItem, onClose }) {
  const { state, dispatch } = useFinance();
  const { showToast } = useToast();
  const config = CONFIG[variant];
  const isEditing = Boolean(editingItem);

  const [value, setValue] = useState(editingItem ? String(editingItem.value) : "");
  const [description, setDescription] = useState(editingItem?.description || "");
  const [categoryId, setCategoryId] = useState(editingItem?.categoryId || state.categories[0]?.id || "");
  const [dueDate, setDueDate] = useState(editingItem?.dueDate || todayISO());
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!description.trim() || !(Number(value) > 0)) {
      setError("Preencha o valor e a descrição.");
      return;
    }
    const payload = {
      description: description.trim(),
      value: Number(value),
      categoryId: categoryId || null,
      dueDate,
      kind: config.kind
    };

    if (isEditing) {
      dispatch({ type: "UPDATE_EXPENSE", payload: { id: editingItem.id, changes: payload } });
      showToast("Despesa atualizada.");
    } else {
      dispatch({ type: "ADD_EXPENSE", payload });
      showToast("Despesa adicionada.");
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="bg-card rounded-xl shadow-card border border-line w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              {isEditing ? `Editar ${config.title}` : `Nova ${config.title}`}
            </h2>
            <p className="text-xs text-muted">Lançamento deste período.</p>
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
              placeholder="Ex.: Mercado, Aluguel..."
              className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

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
            <label className="text-xs font-medium text-muted block mb-1">Data de vencimento</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
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
