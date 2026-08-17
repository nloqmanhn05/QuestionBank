/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-raised": "var(--paper-raised)",
        "card-line": "var(--card-line)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        index: "var(--index)",
        "index-soft": "var(--index-soft)",
        flag: "var(--flag)",
        "flag-soft": "var(--flag-soft)",
        correct: "var(--correct)",
        "correct-soft": "var(--correct-soft)",
        wrong: "var(--wrong)",
        "wrong-soft": "var(--wrong-soft)",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        mono: ["'Instrument Serif'", "serif"],
        serif: ["'Instrument Serif'", "serif"],
        sans: ["Inter", "sans-serif"],
        code: ["'JetBrains Mono'", "monospace"],
      }
    },
  },
  plugins: [],
}
