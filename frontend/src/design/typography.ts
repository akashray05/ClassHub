/**
 * ============================================================
 * Nexora Design System
 * ------------------------------------------------------------
 * Typography Tokens
 *
 * Typography is defined by purpose, not HTML tags.
 * ============================================================
 */

export const typography = {
  display: {
    large: {
      fontSize: "3rem",      // 48px
      fontWeight: 700,
      lineHeight: 1.1,
    },

    medium: {
      fontSize: "2.5rem",    // 40px
      fontWeight: 700,
      lineHeight: 1.2,
    },
  },

  heading: {
    h1: {
      fontSize: "2rem",      // 32px
      fontWeight: 700,
      lineHeight: 1.2,
    },

    h2: {
      fontSize: "1.5rem",    // 24px
      fontWeight: 700,
      lineHeight: 1.3,
    },

    h3: {
      fontSize: "1.25rem",   // 20px
      fontWeight: 600,
      lineHeight: 1.4,
    },
  },

  title: {
    large: {
      fontSize: "1.125rem",  // 18px
      fontWeight: 600,
      lineHeight: 1.4,
    },

    medium: {
      fontSize: "1rem",      // 16px
      fontWeight: 600,
      lineHeight: 1.5,
    },
  },

  body: {
    large: {
      fontSize: "1rem",      // 16px
      fontWeight: 400,
      lineHeight: 1.7,
    },

    medium: {
      fontSize: "0.875rem",  // 14px
      fontWeight: 400,
      lineHeight: 1.6,
    },

    small: {
      fontSize: "0.75rem",   // 12px
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },

  label: {
    large: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },

    medium: {
      fontSize: "0.75rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
  },

  caption: {
    fontSize: "0.75rem",
    fontWeight: 400,
    lineHeight: 1.4,
  },

  code: {
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1.5,
    fontFamily:
      "'JetBrains Mono', monospace",
  },
} as const;

export type Typography = typeof typography;