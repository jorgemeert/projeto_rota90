import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ThemeToggleButton from "../components/ThemeToggleButton";

export default function ResetPasswordPage({ onSwitchToLogin }) {
  const { resetPassword, error, setError } = useAuth();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    const ok = await resetPassword({ email, newPassword });
    if (ok) setDone(true);
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggleButton />
      </div>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">$</span>
          </div>
          <span className="font-display font-bold text-ink text-lg">Rota90</span>
        </div>

        <div className="bg-card rounded-xl shadow-card border border-line p-6">
          <h1 className="font-display text-xl font-bold text-ink mb-1">Redefinir senha</h1>
          <p className="text-sm text-muted mb-5">
            Sem back-end nesta versão, então a redefinição é feita direto por aqui — informe o
            e-mail da conta e a nova senha.
          </p>

          {done ? (
            <div className="text-center py-4">
              <p className="text-sm font-medium text-primary mb-3">Senha redefinida com sucesso!</p>
              <button
                onClick={onSwitchToLogin}
                className="text-sm font-medium text-white bg-primary px-4 py-2 rounded-lg hover:bg-primary-dark"
              >
                Ir para o login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted block mb-1">E-mail da conta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1">Nova senha</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1">Confirmar nova senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {error && <p className="text-xs text-expense">{error}</p>}

              <button
                type="submit"
                className="w-full text-sm font-medium text-white bg-primary py-2 rounded-lg hover:bg-primary-dark"
              >
                Redefinir senha
              </button>
            </form>
          )}
        </div>

        {!done && (
          <p className="text-xs text-muted text-center mt-4">
            Lembrou a senha?{" "}
            <button
              onClick={() => {
                setError("");
                onSwitchToLogin();
              }}
              className="text-primary font-medium hover:underline"
            >
              Voltar ao login
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
