
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Custom color palette for PrintEasy
        golden: {
          50: '#FFFDF7',
          100: '#FEF9E7',
          200: '#FDF2D0',
          300: '#FCE8A3',
          400: '#F9D971',
          500: '#F5C542',
          600: '#EAB308',
          700: '#CA8A04',
          800: '#A16207',
          900: '#854D0E',
          950: '#713F12',
        },
        premium: {
          blue: '#0F172A',
          purple: '#581C87',
          gold: '#F59E0B',
        }
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
        // Enhanced animation keyframes
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px) scale(0.95)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)"
          }
        },
        "fade-out": {
          "0%": {
            opacity: "1",
            transform: "translateY(0) scale(1)"
          },
          "100%": {
            opacity: "0",
            transform: "translateY(20px) scale(0.95)"
          }
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.8) rotate(-5deg)",
            opacity: "0"
          },
          "50%": {
            transform: "scale(1.05) rotate(2deg)",
            opacity: "0.8"
          },
          "100%": {
            transform: "scale(1) rotate(0deg)",
            opacity: "1"
          }
        },
        "scale-out": {
          from: { transform: "scale(1) rotate(0deg)", opacity: "1" },
          to: { transform: "scale(0.8) rotate(-5deg)", opacity: "0" }
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%) rotateY(45deg)" },
          "100%": { transform: "translateX(0) rotateY(0deg)" }
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0) rotateY(0deg)" },
          "100%": { transform: "translateX(100%) rotateY(45deg)" }
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%) rotateY(-45deg)" },
          "100%": { transform: "translateX(0) rotateY(0deg)" }
        },
        "slide-in-up": {
          "0%": { transform: "translateY(100%) rotateX(45deg)" },
          "100%": { transform: "translateY(0) rotateX(0deg)" }
        },
        "bounce-in": {
          "0%": {
            transform: "scale(0.3) rotateZ(-10deg)",
            opacity: "0"
          },
          "50%": {
            transform: "scale(1.1) rotateZ(5deg)",
            opacity: "0.8"
          },
          "80%": {
            transform: "scale(0.95) rotateZ(-2deg)",
            opacity: "0.9"
          },
          "100%": {
            transform: "scale(1) rotateZ(0deg)",
            opacity: "1"
          }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(3deg)" }
        },
        "glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
            transform: "scale(1)"
          },
          "50%": { 
            boxShadow: "0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(147, 51, 234, 0.3)",
            transform: "scale(1.02)"
          }
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "wave": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(5deg)" },
          "75%": { transform: "rotate(-5deg)" }
        },
        "morph": {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Enhanced animations
        "fade-in": "fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-out": "fade-out 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scale-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "scale-out": "scale-out 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-right": "slide-in-right 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-out-right": "slide-out-right 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-left": "slide-in-left 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-up": "slide-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce-in": "bounce-in 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "shimmer": "shimmer 2s linear infinite",
        "wave": "wave 2s ease-in-out infinite",
        "morph": "morph 8s ease-in-out infinite",
        // Combined complex animations
        "hero-entrance": "fade-in 1s ease-out, scale-in 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "card-hover": "scale-in 0.3s ease-out, glow 0.5s ease-in-out",
        "page-transition": "slide-in-right 0.5s ease-out, fade-in 0.5s ease-out"
      },
      backgroundImage: {
        'gradient-golden': 'linear-gradient(135deg, #F59E0B 0%, #EAB308 50%, #F59E0B 100%)',
        'gradient-premium': 'linear-gradient(135deg, #0F172A 0%, #581C87 50%, #0F172A 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'golden': '0 10px 40px rgba(245, 158, 11, 0.3)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(147, 51, 234, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
