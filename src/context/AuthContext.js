import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const USERS_KEY = "rota90:users";
const SESSION_KEY = "rota90:session";

function loadUsers() {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Não foi possível carregar usuários salvos.", err);
    return [];
  }
}

function loadSession() {
  try {
    return window.localStorage.getItem(SESSION_KEY) || null;
  } catch {
    return null;
  }
}

function randomSalt() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Hash simples via Web Crypto (SHA-256 + salt). Não substitui um back-end de
// verdade com bcrypt/argon2, mas evita guardar a senha em texto puro no cliente.
async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers);
  const [currentEmail, setCurrentEmail] = useState(loadSession);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (err) {
      console.warn("Não foi possível salvar usuários.", err);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentEmail) window.localStorage.setItem(SESSION_KEY, currentEmail);
      else window.localStorage.removeItem(SESSION_KEY);
    } catch (err) {
      console.warn("Não foi possível salvar a sessão.", err);
    }
  }, [currentEmail]);

  const currentUser = users.find((u) => u.email === currentEmail) || null;

  async function register({ name, email, password }) {
    setError("");
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!name.trim() || !normalizedEmail || !password) {
      setError("Preencha todos os campos.");
      return false;
    }
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return false;
    }
    if (users.some((u) => u.email === normalizedEmail)) {
      setError("Já existe uma conta com esse e-mail.");
      return false;
    }

    const salt = randomSalt();
    const passwordHash = await hashPassword(password, salt);
    setUsers((prev) => [...prev, { name: name.trim(), email: normalizedEmail, salt, passwordHash }]);
    setCurrentEmail(normalizedEmail);
    return true;
  }

  async function login({ email, password }) {
    setError("");
    const normalizedEmail = (email || "").trim().toLowerCase();
    const user = users.find((u) => u.email === normalizedEmail);

    if (!user) {
      setError("E-mail ou senha incorretos.");
      return false;
    }
    const hash = await hashPassword(password, user.salt);
    if (hash !== user.passwordHash) {
      setError("E-mail ou senha incorretos.");
      return false;
    }

    setCurrentEmail(normalizedEmail);
    return true;
  }

  async function resetPassword({ email, newPassword }) {
    setError("");
    const normalizedEmail = (email || "").trim().toLowerCase();
    const user = users.find((u) => u.email === normalizedEmail);

    if (!user) {
      setError("Não encontramos uma conta com esse e-mail.");
      return false;
    }
    if (newPassword.length < 6) {
      setError("A nova senha precisa ter pelo menos 6 caracteres.");
      return false;
    }

    const salt = randomSalt();
    const passwordHash = await hashPassword(newPassword, salt);
    setUsers((prev) =>
      prev.map((u) => (u.email === normalizedEmail ? { ...u, salt, passwordHash } : u))
    );
    return true;
  }

  function logout() {
    setCurrentEmail(null);
  }

  const value = { currentUser, error, setError, register, login, logout, resetPassword };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de um AuthProvider");
  return ctx;
}
