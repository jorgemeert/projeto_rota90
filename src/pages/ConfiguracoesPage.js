import React, { useRef, useState } from "react";
import { Trash2, AlertTriangle, Download, Upload } from "lucide-react";
import TopBar from "../components/TopBar";
import CategoriesManager from "../components/CategoriesManager";
import { useFinance } from "../context/FinanceContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function ConfiguracoesPage({ onOpenSidebar }) {
  const { state, dispatch } = useFinance();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const fileInputRef = useRef(null);

  function handleClear() {
    dispatch({ type: "CLEAR_ALL_DATA" });
    showToast("Todos os dados foram apagados.");
    setConfirming(false);
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rota90-${currentUser?.email || "dados"}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Dados exportados.");
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        dispatch({ type: "IMPORT_DATA", payload: parsed });
        showToast("Dados importados com sucesso.");
      } catch (err) {
        showToast("Não foi possível ler esse arquivo.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div>
      <TopBar title="Configurações" onOpenSidebar={onOpenSidebar} />
      <div className="max-w-xl space-y-4">
        <CategoriesManager />

        <div className="bg-card rounded-xl shadow-card border border-line p-5">
          <h2 className="font-display font-semibold text-ink mb-1">Backup dos dados</h2>
          <p className="text-xs text-muted mb-4">
            Seus dados ficam salvos neste navegador. Exporte um arquivo de backup de vez em
            quando — se limpar o navegador ou trocar de aparelho, você consegue importar de volta.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 text-sm font-medium text-white bg-primary px-4 py-2 rounded-lg hover:bg-primary-dark"
            >
              <Download size={14} /> Exportar dados
            </button>
            <button
              onClick={handleImportClick}
              className="flex items-center gap-2 text-sm font-medium text-ink border border-line px-4 py-2 rounded-lg hover:bg-surface"
            >
              <Upload size={14} /> Importar dados
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-card border border-line p-5">
          <h2 className="font-display font-semibold text-ink mb-1">Dados salvos</h2>
          <p className="text-xs text-muted mb-4">
            Isso apaga receitas, despesas, patrimônio e reserva de emergência salvos aqui — não
            afeta sua conta de login.
          </p>

          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="flex items-center gap-2 text-sm font-medium text-expense border border-expense/30 px-4 py-2 rounded-lg hover:bg-expense-light"
            >
              <Trash2 size={14} /> Limpar todos os dados
            </button>
          ) : (
            <div className="bg-expense-light border border-expense/30 rounded-lg p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-expense mb-3">
                <AlertTriangle size={14} /> Isso apaga tudo. Tem certeza?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 text-sm font-medium text-muted border border-line bg-card rounded-lg py-2 hover:bg-surface"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleClear}
                  className="flex-1 text-sm font-medium text-white bg-expense rounded-lg py-2 hover:brightness-95"
                >
                  Sim, apagar tudo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
