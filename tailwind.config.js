/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,scss}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          card: "var(--bg-card)",
          border: "var(--bg-border)",
        },
        accent: {
          cyan: "var(--accent-cyan)",
          blue: "var(--accent-blue)",
          green: "var(--accent-green)",
          purple: "var(--accent-purple)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          code: "var(--text-code)",
        },
      },
      fontFamily: {
        display: ['"Space Mono"', "monospace"],
        body: ['"DM Sans"', "sans-serif"],
        code: ['"Fira Code"', "monospace"],
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0, 200, 255, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 200, 255, 0.6)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};
