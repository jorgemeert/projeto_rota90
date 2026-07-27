import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FinanceProvider } from "./context/FinanceContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import AuthGate from "./components/AuthGate";
import Sidebar from "./components/Sidebar";
import OrcamentoPage from "./pages/OrcamentoPage";
import VisaoGeralPage from "./pages/VisaoGeralPage";
import PatrimonioPage from "./pages/PatrimonioPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import InvestimentosPage from "./pages/InvestimentosPage";
import AjudaPage from "./pages/AjudaPage";
import CalculadorasPage from "./pages/CalculadorasPage";

function PageRouter({ currentPage, onNavigate, onOpenSidebar }) {
  switch (currentPage) {
    case "orcamento":
      return <OrcamentoPage onOpenSidebar={onOpenSidebar} />;
    case "investimentos":
      return <InvestimentosPage onOpenSidebar={onOpenSidebar} />;
    case "patrimonio":
      return <PatrimonioPage onOpenSidebar={onOpenSidebar} />;
    case "calculadoras":
      return <CalculadorasPage onOpenSidebar={onOpenSidebar} />;
    case "ajuda":
      return <AjudaPage onOpenSidebar={onOpenSidebar} />;
    case "configuracoes":
      return <ConfiguracoesPage onOpenSidebar={onOpenSidebar} />;
    case "visao-geral":
    default:
      return <VisaoGeralPage onOpenSidebar={onOpenSidebar} onNavigate={onNavigate} />;
  }
}

function MainApp({ userKey }) {
  const [currentPage, setCurrentPage] = useState("orcamento");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <FinanceProvider userKey={userKey}>
      <div className="min-h-screen bg-surface flex">
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 min-w-0 px-4 md:px-8 py-6">
          <div className="max-w-6xl mx-auto">
            <PageRouter
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              onOpenSidebar={() => setSidebarOpen(true)}
            />
          </div>
        </main>
      </div>
    </FinanceProvider>
  );
}

function AppShell() {
  const { currentUser } = useAuth();

  if (!currentUser) return <AuthGate />;

  return <MainApp userKey={currentUser.email} />;
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
