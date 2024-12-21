import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  safelist: ["dark"],
  prefix: "",
  
  content: [
    './pages/**/*.{js,jsx,vue}',
    './components/**/*.{js,jsx,vue}',
    './app/**/*.{js,jsx,vue}',
    './src/**/*.{js,jsx,vue}',
  ],
  
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background, 0, 0%, 100%))", // White fallback
        foreground: "hsl(var(--foreground, 0, 0%, 0%))",   // Black fallback
        destructive: "hsl(var(--destructive, 0, 0%, 95%))", // Light red fallback
        'destructive-foreground': "hsl(var(--destructive-foreground, 0, 100%, 10%))", // Dark red fallback
      },
    },
  },
  plugins: [animate],
};