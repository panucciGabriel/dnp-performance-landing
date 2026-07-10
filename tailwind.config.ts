import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta extraída da identidade visual DNP Performance
        "dnp-black":  "#0a0a0a",
        "dnp-dark":   "#111111",
        "dnp-card":   "#161616",
        "dnp-border": "#1f1f1f",
        "dnp-red":    "#c41212",
        "dnp-red-dark": "#9b0f0f",
        "dnp-red-light": "#e01414",
        "dnp-silver": "#b8b8b8",
        "dnp-gray":   "#666666",
        "dnp-green":  "#3d9a6c",
        // Central de Remap (tela de login) — tons específicos do design
        "dnp-ink":    "#010101", // fundo base do login
        "dnp-visual": "#0a0a0b", // fundo do lado da foto
        "dnp-panel":  "#111214", // cartão
        "dnp-field":  "#16171a", // inputs
        "dnp-line":   "#2a2c30", // bordas do login
        "dnp-mist":   "#e9e9e9", // texto claro
        "dnp-slate":  "#8a8d91", // texto secundário
        "dnp-faint":  "#5c6066", // placeholder
        "dnp-accent": "#e80409", // vermelho de destaque do design
      },
      fontFamily: {
        heading: ["var(--font-bebas)", "sans-serif"],
        body:    ["var(--font-inter)", "sans-serif"],
        mono:    ["var(--font-ibm-mono)", "monospace"],
        display: ["var(--font-rajdhani)", "Rajdhani", "sans-serif"], // headings/botão do login
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-overlay":    "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.80) 60%, rgba(10,10,10,1) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
