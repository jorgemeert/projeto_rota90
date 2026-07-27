import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ThemeToggleButton from "../components/ThemeToggleButton";

export default function CadastroPage({ onSwitchToLogin }) {
  const { register, error, setError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    register({ name, email, password });
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
          <h1 className="font-display text-xl font-bold text-ink mb-1">Criar conta</h1>
          <p className="text-sm text-muted mb-5">Comece a organizar suas finanças.</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Confirmar senha</label>
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
              Criar conta
            </button>
          </form>
        </div>

        <p className="text-xs text-muted text-center mt-4">
          Já tem conta?{" "}
          <button
            onClick={() => {
              setError("");
              onSwitchToLogin();
            }}
            className="text-primary font-medium hover:underline"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
