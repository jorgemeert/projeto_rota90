import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { currentPeriod, monthsBetween } from "../utils/period";
import { computeMonthlySalary } from "../utils/salary";

const FinanceContext = createContext(null);

const uid = () => Math.random().toString(36).slice(2, 10);

function buildStorageKey(userKey) {
  return `rota90:finance-state:${userKey || "guest"}`;
}

const initialState = {
  categories: [
    { id: "cat-moradia", name: "Moradia", color: "#0E7A57" },
    { id: "cat-alimentacao", name: "Alimentação", color: "#2B5FC0" },
    { id: "cat-transporte", name: "Transporte", color: "#C0392B" },
    { id: "cat-lazer", name: "Lazer", color: "#B7791F" }
  ],
  // Receita por período (chave "YYYY-MM"): { salary, extraIncome }
  incomeByPeriod: {},
  // Configuração de como o salário é calculado — se "fixo", o valor é calculado
  // automaticamente todo mês a partir daqui, sem precisar preencher manualmente.
  salaryConfig: {
    mode: "variavel", // "fixo" | "variavel"
    basis: "mensal", // "mensal" | "diaria" | "horaria"
    monthlyValue: 0,
    dailyRate: 0,
    daysPerWeek: 5,
    hourlyRate: 0,
    hoursPerWeek: 40,
    startPeriod: null
  },
  // Despesas variáveis (avulsas, uma por período): { id, description, value, categoryId, dueDate }
  expenses: [],
  // Despesas fixas recorrentes (templates, aparecem todo mês sozinhas):
  // { id, description, value, categoryId, dueDay, recurrence: 'indeterminado' | 'ate-data',
  //   startPeriod: 'YYYY-MM', endPeriod: 'YYYY-MM' (só se 'ate-data') }
  fixedExpenses: [],
  assets: [],
  hideValues: false,
  // Reserva de emergência
  monthlyCost: 0,
  coverageMonths: 6,
  allocations: { caixinha: 0, banco: 0, tesouro: 0 }
};

function loadInitialState(userKey) {
  try {
    const raw = window.localStorage.getItem(buildStorageKey(userKey));
    if (!raw) return initialState;
    const saved = JSON.parse(raw);
    return {
      ...initialState,
      ...saved,
      incomeByPeriod: { ...(saved.incomeByPeriod || {}) },
      salaryConfig: { ...initialState.salaryConfig, ...(saved.salaryConfig || {}) },
      fixedExpenses: saved.fixedExpenses || [],
      allocations: { ...initialState.allocations, ...(saved.allocations || {}) }
    };
  } catch (err) {
    console.warn("Não foi possível carregar dados salvos, iniciando do zero.", err);
    return initialState;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_INCOME_FIELD": {
      const { period, field, value } = action.payload;
      const current = state.incomeByPeriod[period] || { salary: 0, extraIncome: 0 };
      return {
        ...state,
        incomeByPeriod: { ...state.incomeByPeriod, [period]: { ...current, [field]: value } }
      };
    }

    case "SET_SALARY_CONFIG":
      return { ...state, salaryConfig: { ...state.salaryConfig, ...action.payload } };

    case "ADD_EXPENSE":
      return { ...state, expenses: [...state.expenses, { id: uid(), ...action.payload }] };
    case "UPDATE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload.changes } : e
        )
      };
    case "REMOVE_EXPENSE":
      return { ...state, expenses: state.expenses.filter((e) => e.id !== action.payload) };

    case "ADD_FIXED_EXPENSE":
      return { ...state, fixedExpenses: [...state.fixedExpenses, { id: uid(), ...action.payload }] };
    case "UPDATE_FIXED_EXPENSE":
      return {
        ...state,
        fixedExpenses: state.fixedExpenses.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload.changes } : e
        )
      };
    case "REMOVE_FIXED_EXPENSE":
      return { ...state, fixedExpenses: state.fixedExpenses.filter((e) => e.id !== action.payload) };

    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, { id: uid(), ...action.payload }] };
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload.changes } : c
        )
      };
    case "REMOVE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
        expenses: state.expenses.map((e) =>
          e.categoryId === action.payload ? { ...e, categoryId: null } : e
        ),
        fixedExpenses: state.fixedExpenses.map((e) =>
          e.categoryId === action.payload ? { ...e, categoryId: null } : e
        )
      };

    case "ADD_ASSET":
      return { ...state, assets: [...state.assets, { id: uid(), ...action.payload }] };
    case "UPDATE_ASSET":
      return {
        ...state,
        assets: state.assets.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload.changes } : a
        )
      };
    case "REMOVE_ASSET":
      return { ...state, assets: state.assets.filter((a) => a.id !== action.payload) };

    case "TOGGLE_HIDE_VALUES":
      return { ...state, hideValues: !state.hideValues };

    case "SET_MONTHLY_COST":
      return { ...state, monthlyCost: action.payload };
    case "SET_COVERAGE_MONTHS":
      return { ...state, coverageMonths: action.payload };
    case "SET_ALLOCATION":
      return {
        ...state,
        allocations: { ...state.allocations, [action.payload.location]: action.payload.value }
      };

    case "IMPORT_DATA":
      return {
        ...initialState,
        ...action.payload,
        incomeByPeriod: { ...(action.payload.incomeByPeriod || {}) },
        salaryConfig: { ...initialState.salaryConfig, ...(action.payload.salaryConfig || {}) },
        fixedExpenses: action.payload.fixedExpenses || [],
        allocations: { ...initialState.allocations, ...(action.payload.allocations || {}) }
      };

    case "CLEAR_ALL_DATA":
      return initialState;

    default:
      return state;
  }
}

export function FinanceProvider({ children, userKey }) {
  const [state, dispatch] = useReducer(reducer, userKey, loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(buildStorageKey(userKey), JSON.stringify(state));
    } catch (err) {
      console.warn("Não foi possível salvar os dados localmente.", err);
    }
  }, [state, userKey]);

  const totals = useMemo(() => {
    const now = currentPeriod();
    const isFixedSalary = state.salaryConfig?.mode === "fixo";

    let salaryAllTime = 0;
    if (isFixedSalary && state.salaryConfig.startPeriod) {
      const months = Math.max(0, monthsBetween(state.salaryConfig.startPeriod, now));
      salaryAllTime = months * computeMonthlySalary(state.salaryConfig);
    }
    const otherIncomeAllTime = Object.values(state.incomeByPeriod).reduce((sum, p) => {
      const salaryPart = isFixedSalary ? 0 : Number(p.salary || 0);
      return sum + salaryPart + Number(p.extraIncome || 0);
    }, 0);
    const totalIncomeAllTime = salaryAllTime + otherIncomeAllTime;

    const variableExpensesTotal = state.expenses.reduce((sum, e) => sum + Number(e.value || 0), 0);
    // despesas fixas contam uma vez para cada mês em que estiveram ativas até hoje
    const fixedExpensesTotal = state.fixedExpenses.reduce((sum, t) => {
      if (!t.startPeriod) return sum;
      const effectiveEnd =
        t.recurrence === "ate-data" && t.endPeriod ? (t.endPeriod < now ? t.endPeriod : now) : now;
      if (t.startPeriod > effectiveEnd) return sum;
      const months = Math.max(0, monthsBetween(t.startPeriod, effectiveEnd));
      return sum + months * Number(t.value || 0);
    }, 0);
    const totalExpenses = variableExpensesTotal + fixedExpensesTotal;

    const totalAssets = state.assets
      .filter((a) => a.kind === "ativo")
      .reduce((sum, a) => sum + Number(a.value || 0), 0);
    const totalDebts = state.assets
      .filter((a) => a.kind === "divida")
      .reduce((sum, a) => sum + Number(a.value || 0), 0);

    const reserveGoal = Number(state.monthlyCost || 0) * Number(state.coverageMonths || 0);
    const reserveSaved =
      Number(state.allocations.caixinha || 0) +
      Number(state.allocations.banco || 0) +
      Number(state.allocations.tesouro || 0);
    const reserveProgress = reserveGoal > 0 ? Math.min(1, reserveSaved / reserveGoal) : 0;

    return {
      totalIncome: totalIncomeAllTime,
      totalExpenses,
      balance: totalIncomeAllTime - totalExpenses,
      netWorth: totalAssets - totalDebts,
      reserveGoal,
      reserveSaved,
      reserveProgress
    };
  }, [
    state.incomeByPeriod,
    state.salaryConfig,
    state.expenses,
    state.fixedExpenses,
    state.assets,
    state.monthlyCost,
    state.coverageMonths,
    state.allocations
  ]);

  const value = { state, dispatch, totals };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance precisa estar dentro de um FinanceProvider");
  return ctx;
}
