import React from "react";
import {
  LayoutGrid,
  Wallet,
  TrendingUp,
  Landmark,
  Calculator,
  HelpCircle,
  Settings,
  X,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export const NAV_ITEMS = [
  { id: "visao-geral", label: "Visão geral", icon: LayoutGrid },
  { id: "orcamento", label: "Orçamento", icon: Wallet },
  { id: "investimentos", label: "Investimentos", icon: TrendingUp },
  { id: "patrimonio", label: "Patrimônio", icon: Landmark },
  { id: "calculadoras", label: "Calculadoras", icon: Calculator },
  { id: "ajuda", label: "Ajuda", icon: HelpCircle },
  { id: "configuracoes", label: "Configurações", icon: Settings }
];

export default function Sidebar({ currentPage, onNavigate, open, onClose }) {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* overlay no mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-card border-r border-line z-40 flex flex-col
        transform transition-transform duration-200 md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-line">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">$</span>
            </div>
            <span className="font-display font-bold text-ink tracking-tight">Rota90</span>
          </div>
          <button className="md:hidden text-muted" onClick={onClose} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary-light text-primary-dark"
                    : "text-muted hover:bg-surface hover:text-ink"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-line">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-2 px-2 py-2 mb-2 rounded-lg text-sm font-medium text-muted hover:bg-surface hover:text-ink transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "Modo claro" : "Modo escuro"}
          </button>

          <div className="flex items-center gap-2 px-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center shrink-0">
              <span className="text-primary-dark font-display font-semibold text-xs">
                {(currentUser?.name || "?").slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">{currentUser?.name}</p>
              <p className="text-xs text-muted truncate">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium text-muted hover:bg-surface hover:text-expense transition-colors"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>
    </>
  );
}
