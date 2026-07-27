/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          light: "rgb(var(--color-primary-light) / <alpha-value>)",
          dark: "rgb(var(--color-primary-dark) / <alpha-value>)"
        },
        expense: {
          DEFAULT: "rgb(var(--color-expense) / <alpha-value>)",
          light: "rgb(var(--color-expense-light) / <alpha-value>)"
        },
        invest: {
          DEFAULT: "rgb(var(--color-invest) / <alpha-value>)",
          light: "rgb(var(--color-invest-light) / <alpha-value>)"
        },
        // cor fixa, não muda com o tema — para elementos que devem ficar sempre escuros
        // (card de destaque, toast, fundo de modal)
        midnight: "#0F172A"
      },
      fontFamily: {
        display: ["'Sora'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.08)"
      }
    }
  },
  plugins: []
};
