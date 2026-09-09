import React, { useMemo, useState } from "react";
import { SlidersHorizontal, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

function formatBRL(value, hide) {
  if (hide) return "••••";
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function EntryList({
  title,
  items,
  emptyText,
  onAdd,
  onEdit,
  onRemove,
  renderMeta,
  valueColorClass,
  categories,
  renderExtraAction
}) {
  const { state } = useFinance();
  const [confirmId, setConfirmId] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = search.trim()
        ? item.description.toLowerCase().includes(search.trim().toLowerCase())
        : true;
      const matchesCategory = categoryFilter ? item.categoryId === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  const filterActive = search.trim() !== "" || categoryFilter !== "";

  return (
    <div className="bg-card rounded-xl shadow-card border border-line p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-ink">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className={`flex items-center gap-1.5 text-xs font-medium border px-3 py-1.5 rounded-lg ${
              filterActive
                ? "text-primary-dark bg-primary-light border-primary/30"
                : "text-muted border-line hover:bg-surface"
            }`}
          >
            <SlidersHorizontal size={13} /> Filtro
          </button>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 text-xs font-medium text-white bg-primary px-3 py-1.5 rounded-lg hover:bg-primary-dark"
          >
            <Plus size={13} /> Adicionar
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="flex flex-col sm:flex-row gap-2 mb-3 bg-surface border border-line rounded-lg p-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por descrição..."
            className="flex-1 p-1.5 border border-line rounded-md text-xs bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {categories && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-1.5 border border-line rounded-md text-xs bg-card text-ink"
            >
              <option value="">Todas as categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          {filterActive && (
            <button
              onClick={() => {
                setSearch("");
                setCategoryFilter("");
              }}
              className="text-xs text-muted hover:text-ink px-2"
            >
              Limpar
            </button>
          )}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <p className="text-sm text-muted text-center py-10">
          {items.length === 0 ? emptyText : "Nenhum lançamento corresponde ao filtro."}
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {filteredItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3 group gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">{item.description}</p>
                {renderMeta && <p className="text-xs text-muted mt-0.5 truncate">{renderMeta(item)}</p>}
              </div>

              {confirmId === item.id ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-expense">Remover?</span>
                  <button
                    onClick={() => {
                      onRemove(item.id);
                      setConfirmId(null);
                    }}
                    className="text-white bg-expense rounded-md p-1"
                    aria-label="Confirmar remoção"
                  >
                    <Check size={13} />
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="text-muted border border-line rounded-md p-1"
                    aria-label="Cancelar remoção"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 shrink-0">
                  {renderExtraAction && renderExtraAction(item)}
                  <span className={`text-sm font-semibold ${valueColorClass}`}>
                    {formatBRL(item.value, state.hideValues)}
                  </span>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="text-muted hover:text-ink opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Editar ${item.description}`}
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmId(item.id)}
                    className="text-muted hover:text-expense opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remover ${item.description}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
