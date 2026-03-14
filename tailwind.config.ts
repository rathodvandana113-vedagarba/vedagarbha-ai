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
        accent: "#E2E2E2",
        electric: "#3B82F6"
      },
      boxShadow: {
        glow: "0 0 40px rgba(59, 130, 246, 0.2)",
        panel: "0 24px 60px rgba(0,0,0,0.65)"
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 15% 10%, rgba(255, 255, 255, 0.05), transparent 32%), radial-gradient(circle at 85% 12%, rgba(59, 130, 246, 0.05), transparent 34%)"
      }
    }
  },
  plugins: []
};

export default config;
