import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: "#C41E1E",
          deep: "#7A1212",
          bright: "#E23B2E",
        },
        coral: {
          DEFAULT: "#FF6B52",
        },
        ink: {
          DEFAULT: "#111111",
          muted: "#5C5C5C",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          dim: "#F5F5F5",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#E8CE7B",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      letterSpacing: {
        wide2: "0.12em",
      },
      maxWidth: {
        content: "1180px",
      },
      backgroundImage: {
        "red-gradient": "linear-gradient(135deg, #7A1212 0%, #C41E1E 55%, #E23B2E 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
