import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0B0F",
        panel: "#121218",
        accent: "#D4AF37",
        electric: "#F5D97A"
      },
      boxShadow: {
        glow: "0 0 40px rgba(212, 175, 55, 0.35)",
        panel: "0 24px 60px rgba(0,0,0,0.65)"
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 15% 10%, rgba(212, 175, 55, 0.15), transparent 32%), radial-gradient(circle at 85% 12%, rgba(245, 217, 122, 0.1), transparent 34%)"
      }
    }
  },
  plugins: []
};

export default config;
