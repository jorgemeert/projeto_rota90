import React from "react";
import { Eye, EyeOff, Menu } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { useAuth } from "../context/AuthContext";

export default function TopBar({ title, onOpenSidebar }) {
  const { state, dispatch } = useFinance();
  const { currentUser } = useAuth();
  const firstName = currentUser?.name?.split(" ")[0] || "";

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-muted"
          onClick={onOpenSidebar}
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <p className="text-xs text-muted mb-0.5">Olá, {firstName}</p>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-bold text-ink">{title}</h1>
            <button
              onClick={() => dispatch({ type: "TOGGLE_HIDE_VALUES" })}
              className="text-muted hover:text-ink"
              aria-label={state.hideValues ? "Mostrar valores" : "Ocultar valores"}
            >
              {state.hideValues ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
