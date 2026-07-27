import React, { useState } from "react";
import LoginPage from "../pages/LoginPage";
import CadastroPage from "../pages/CadastroPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

export default function AuthGate() {
  const [mode, setMode] = useState("login");

  if (mode === "cadastro") {
    return <CadastroPage onSwitchToLogin={() => setMode("login")} />;
  }
  if (mode === "reset") {
    return <ResetPasswordPage onSwitchToLogin={() => setMode("login")} />;
  }
  return (
    <LoginPage
      onSwitchToRegister={() => setMode("cadastro")}
      onSwitchToReset={() => setMode("reset")}
    />
  );
}
