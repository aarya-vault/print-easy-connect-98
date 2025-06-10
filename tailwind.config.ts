
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Golden theme colors
        golden: {
          50: "hsl(48, 100%, 97%)",
          100: "hsl(48, 100%, 92%)",
          200: "hsl(48, 100%, 84%)",
          300: "hsl(48, 100%, 76%)",
          400: "hsl(48, 100%, 68%)",
          500: "hsl(48, 100%, 50%)",
          600: "hsl(45, 93%, 47%)",
          700: "hsl(41, 86%, 42%)",
          800: "hsl(36, 75%, 35%)",
          900: "hsl(30, 60%, 25%)",
        },
        // Neutral colors (black/white spectrum)
        neutral: {
          50: "hsl(0, 0%, 98%)",
          100: "hsl(0, 0%, 96%)",
          200: "hsl(0, 0%, 90%)",
          300: "hsl(0, 0%, 83%)",
          400: "hsl(0, 0%, 64%)",
          500: "hsl(0, 0%, 45%)",
          600: "hsl(0, 0%, 32%)",
          700: "hsl(0, 0%, 25%)",
          800: "hsl(0, 0%, 15%)",
          900: "hsl(0, 0%, 9%)",
        },
        // Yellow colors for consistency
        yellow: {
          50: "hsl(48, 100%, 97%)",
          100: "hsl(48, 100%, 92%)",
          200: "hsl(48, 100%, 84%)",
          300: "hsl(48, 100%, 76%)",
          400: "hsl(48, 100%, 68%)",
          500: "hsl(48, 100%, 50%)",
          600: "hsl(45, 93%, 47%)",
          700: "hsl(41, 86%, 42%)",
          800: "hsl(36, 75%, 35%)",
          900: "hsl(30, 60%, 25%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
