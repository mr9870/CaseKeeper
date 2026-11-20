import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CaseKeeper Design System — sourced from Stitch generation
        primary: {
          DEFAULT: "#1B4FD8",
          dark: "#0F3A9E",
          light: "#4771FA",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#0F172A",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F59E0B",
          dark: "#B45309",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#10B981",
          bg: "#D1FAE5",
          text: "#047857",
        },
        danger: {
          DEFAULT: "#EF4444",
          bg: "#FEF2F2",
          text: "#991B1B",
        },
        warning: {
          DEFAULT: "#F59E0B",
          bg: "#FEF3C7",
          text: "#B45309",
        },
        sidebar: {
          DEFAULT: "#0F172A",
          foreground: "#FFFFFF",
          muted: "#94A3B8",
          active: "#1B4FD8",
          "active-bg": "rgba(27, 79, 216, 0.15)",
          border: "rgba(255, 255, 255, 0.08)",
        },
        surface: {
          DEFAULT: "#F8FAFC",
          card: "#FFFFFF",
          "card-hover": "#F1F5F9",
        },
        // Status chip colors
        status: {
          active: { bg: "#DBEAFE", text: "#1B4FD8", border: "#BFDBFE" },
          pending: { bg: "#FEF3C7", text: "#B45309", border: "#FDE68A" },
          verified: { bg: "#D1FAE5", text: "#047857", border: "#A7F3D0" },
          draft: { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" },
          archived: { bg: "#F1F5F9", text: "#64748B", border: "#E2E8F0" },
          urgent: { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
          dismissed: { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" },
        },
        // Gold accent for verified badges (from Stitch legaltech tokens)
        gold: {
          DEFAULT: "#C29B38",
          light: "#F59E0B",
        },
        // Standard text
        text: {
          primary: "#0F172A",
          secondary: "#475569",
          muted: "#64748B",
          disabled: "#94A3B8",
        },
        border: {
          DEFAULT: "#E2E8F0",
          strong: "#CBD5E1",
          focus: "#1B4FD8",
        },
        // shadcn/ui compatibility
        background: "#F8FAFC",
        foreground: "#0F172A",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#475569",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        input: "#E2E8F0",
        ring: "#1B4FD8",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg-mobile": ["30px", { lineHeight: "38px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-xl": ["32px", { lineHeight: "40px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-lg": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "headline-sm": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "26px" }],
        "body-md": ["14px", { lineHeight: "22px" }],
        "body-sm": ["13px", { lineHeight: "18px" }],
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.04em", fontWeight: "600" }],
        "code-legal": ["12px", { lineHeight: "18px", fontWeight: "500" }],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        full: "9999px",
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        "sidebar-width": "240px",
        "topbar-height": "64px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
        "card-hover": "0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)",
        modal: "0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
        "focus-ring": "0 0 0 2px #1B4FD8",
      },
    },
  },
  plugins: [],
};

export default config;
