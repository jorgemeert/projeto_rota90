import React, { useState } from "react";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import Card from "./Card";
import { useFinance } from "../context/FinanceContext";
import { useToast } from "../context/ToastContext";

const PALETTE = ["#0E7A57", "#2B5FC0", "#C0392B", "#B7791F", "#7C3AED", "#0F172A"];

export default function CategoriesManager() {
  const { state, dispatch } = useFinance();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  function handleAdd() {
    if (name.trim() === "") return;
    const color = PALETTE[state.categories.length % PALETTE.length];
    dispatch({ type: "ADD_CATEGORY", payload: { name: name.trim(), color } });
    showToast("Categoria adicionada.");
    setName("");
  }

  function startEdit(cat) {
    setEditingId(cat.id);
    setEditName(cat.name);
  }

  function saveEdit(id) {
    if (!editName.trim()) return;
    dispatch({ type: "UPDATE_CATEGORY", payload: { id, changes: { name: editName.trim() } } });
    showToast("Categoria renomeada.");
    setEditingId(null);
  }

  function handleRemove(id) {
    dispatch({ type: "REMOVE_CATEGORY", payload: id });
    showToast("Categoria removida.");
    setConfirmId(null);
  }

  return (
    <Card title="Gestão de categorias">
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Nova categoria"
          className="flex-1 p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button onClick={handleAdd} className="bg-primary text-white text-sm font-medium px-4 rounded-lg">
          Adicionar
        </button>
      </div>

      {state.categories.length === 0 ? (
        <p className="text-sm text-muted text-center py-6">Nenhuma categoria cadastrada.</p>
      ) : (
        <ul className="space-y-1">
          {state.categories.map((c) => {
            if (editingId === c.id) {
              return (
                <li key={c.id} className="flex items-center gap-2 py-1">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 p-1.5 border border-line rounded-md text-sm bg-card text-ink"
                    autoFocus
                  />
                  <button onClick={() => saveEdit(c.id)} className="text-primary p-1" aria-label="Salvar">
                    <Check size={14} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-muted p-1" aria-label="Cancelar">
                    <X size={14} />
                  </button>
                </li>
              );
            }
            return (
              <li key={c.id} className="flex justify-between items-center text-sm group">
                <span className="flex items-center gap-2 text-ink">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                {confirmId === c.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-expense">Remover?</span>
                    <button onClick={() => handleRemove(c.id)} className="text-white bg-expense rounded-md p-1">
                      <Check size={13} />
                    </button>
                    <button onClick={() => setConfirmId(null)} className="text-muted border border-line rounded-md p-1">
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(c)} className="text-muted hover:text-ink p-1" aria-label={`Renomear ${c.name}`}>
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setConfirmId(c.id)}
                      className="text-muted hover:text-expense p-1"
                      aria-label={`Remover categoria ${c.name}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-3 text-xs text-muted">
        As categorias aparecem automaticamente no formulário de despesas.
      </p>
    </Card>
  );
}
