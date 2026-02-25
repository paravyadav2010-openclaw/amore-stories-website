import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cinematic Dark Mode Palette
        background: {
          main: "#050505", // Primary page background
          surface: "#121212", // Card backgrounds, elevated surfaces
          DEFAULT: "#050505",
        },
        text: {
          heading: "#F8FAFC", // Main titles, high contrast
          body: "#94A3B8", // Subtext, descriptions, secondary info
          DEFAULT: "#F8FAFC",
        },
        accent: {
          primary: "#6366F1", // Indigo: Buttons, primary highlights
          secondary: "#FCD34D", // Gold: Hover states, decorative elements
        },
        indigo: {
          500: "#6366F1",
          600: "#4F46E5",
          glow: "rgba(99, 102, 241, 0.2)",
        },
        gold: {
          400: "#FCD34D",
          500: "#F59E0B",
          glow: "rgba(252, 211, 77, 0.2)",
        },
        glass: "rgba(18, 18, 18, 0.8)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Typography scale from design system
        "hero": "5rem", // 80px
        "h1": "3rem", // 48px
        "h2": "2.25rem", // 36px
        "h3": "1.875rem", // 30px
        "sub": "1.5rem", // 24px
        "body": "1.125rem", // 18px
        "caption": "0.875rem", // 14px
      },
      spacing: {
        // Section gap from design system
        "section": "128px",
      },
      borderRadius: {
        "xl": "12px", // Standard cards
        "2xl": "16px",
        "3xl": "24px",
        "pill": "100px", // Pills/Buttons
      },
      backgroundImage: {
        "gradient-cinematic": "linear-gradient(135deg, #6366F1 0%, #FCD34D 100%)",
      },
      boxShadow: {
        "glass": "0 20px 50px rgba(0, 0, 0, 0.5)",
        "indigo-glow": "0 0 30px rgba(99, 102, 241, 0.2)",
        "gold-glow": "0 0 30px rgba(252, 211, 77, 0.2)",
      },
      backdropBlur: {
        "glass": "12px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
