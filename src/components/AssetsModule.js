import React, { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import Card from "./Card";
import { useFinance } from "../context/FinanceContext";
import { useToast } from "../context/ToastContext";

function formatBRL(value, hide) {
  if (hide) return "••••";
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AssetsModule() {
  const { state, dispatch, totals } = useFinance();
  const { showToast } = useToast();
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [kind, setKind] = useState("ativo");

  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editValue, setEditValue] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const canSubmit = description.trim() !== "" && Number(value) > 0;

  function handleAdd() {
    if (!canSubmit) return;
    dispatch({ type: "ADD_ASSET", payload: { description: description.trim(), value: Number(value), kind } });
    showToast("Item adicionado ao patrimônio.");
    setDescription("");
    setValue("");
  }

  function startEdit(asset) {
    setEditingId(asset.id);
    setEditDescription(asset.description);
    setEditValue(String(asset.value));
  }

  function saveEdit(id) {
    if (!editDescription.trim() || !(Number(editValue) > 0)) return;
    dispatch({
      type: "UPDATE_ASSET",
      payload: { id, changes: { description: editDescription.trim(), value: Number(editValue) } }
    });
    showToast("Item atualizado.");
    setEditingId(null);
  }

  function handleRemove(id) {
    dispatch({ type: "REMOVE_ASSET", payload: id });
    showToast("Item removido.");
    setConfirmId(null);
  }

  return (
    <Card title="Patrimônio">
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setKind("ativo")}
          className={`flex-1 text-xs font-medium py-2 rounded-lg border transition-colors ${
            kind === "ativo"
              ? "bg-primary text-white border-primary"
              : "bg-card text-muted border-line hover:border-primary/40"
          }`}
        >
          Ativo
        </button>
        <button
          onClick={() => setKind("divida")}
          className={`flex-1 text-xs font-medium py-2 rounded-lg border transition-colors ${
            kind === "divida"
              ? "bg-expense text-white border-expense"
              : "bg-card text-muted border-line hover:border-expense/40"
          }`}
        >
          Dívida
        </button>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Carro, Imóvel, Cartão de crédito..."
          className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="R$ 0,00"
          className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          onClick={handleAdd}
          disabled={!canSubmit}
          className="w-full bg-midnight disabled:bg-midnight/40 text-white text-sm font-medium p-2 rounded-lg transition-colors"
        >
          Adicionar item
        </button>
      </div>

      <div className="mt-4">
        {state.assets.length === 0 ? (
          <p className="text-sm text-muted text-center py-6">Nenhum ativo ou dívida cadastrado.</p>
        ) : (
          <ul className="space-y-1">
            {state.assets.map((a) => {
              if (editingId === a.id) {
                return (
                  <li key={a.id} className="flex items-center gap-2 py-1.5">
                    <input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="flex-1 p-1.5 border border-line rounded-md text-sm bg-card text-ink"
                    />
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-24 p-1.5 border border-line rounded-md text-sm bg-card text-ink"
                    />
                    <button onClick={() => saveEdit(a.id)} className="text-primary p-1" aria-label="Salvar">
                      <Check size={14} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-muted p-1" aria-label="Cancelar">
                      <X size={14} />
                    </button>
                  </li>
                );
              }
              return (
                <li key={a.id} className="flex justify-between items-center text-sm group">
                  <span className="text-ink truncate">
                    {a.description}{" "}
                    <span className="text-muted text-xs">({a.kind === "ativo" ? "Ativo" : "Dívida"})</span>
                  </span>
                  {confirmId === a.id ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-expense">Remover?</span>
                      <button onClick={() => handleRemove(a.id)} className="text-white bg-expense rounded-md p-1">
                        <Check size={13} />
                      </button>
                      <button onClick={() => setConfirmId(null)} className="text-muted border border-line rounded-md p-1">
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`font-medium ${a.kind === "ativo" ? "text-primary" : "text-expense"}`}>
                        {formatBRL(a.value, state.hideValues)}
                      </span>
                      <button
                        onClick={() => startEdit(a)}
                        className="text-muted hover:text-ink opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Editar ${a.description}`}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setConfirmId(a.id)}
                        className="text-muted hover:text-expense opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remover ${a.description}`}
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
      </div>

      <p className="mt-4 text-sm font-semibold text-ink border-t border-line pt-3">
        Patrimônio líquido total:{" "}
        <span className={totals.netWorth >= 0 ? "text-primary" : "text-expense"}>
          {formatBRL(totals.netWorth, state.hideValues)}
        </span>
      </p>
    </Card>
  );
}
