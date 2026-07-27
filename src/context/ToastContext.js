import React, { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = { success: CheckCircle2, error: XCircle, info: Info };
const COLORS = { success: "#0E7A57", error: "#C0392B", info: "#2B5FC0" };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-xs">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          return (
            <div
              key={t.id}
              role="status"
              className="bg-midnight text-white rounded-lg shadow-card px-4 py-3 flex items-center gap-2 text-sm"
            >
              <Icon size={16} style={{ color: COLORS[t.type] }} className="shrink-0" />
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast precisa estar dentro de um ToastProvider");
  return ctx;
}
