/**
 * ============================================================
 * Nexora Design System
 * ------------------------------------------------------------
 * Spacing
 *
 * All spacing values are defined here.
 *
 * Never hardcode spacing values in components.
 * ============================================================
 */

export const spacing = {
  none: "0",

  xs: "0.25rem",   // 4px
  sm: "0.5rem",    // 8px
  md: "0.75rem",   // 12px
  lg: "1rem",      // 16px
  xl: "1.5rem",    // 24px
  "2xl": "2rem",   // 32px
  "3xl": "3rem",   // 48px
  "4xl": "4rem",   // 64px

  /**
   * Layout
   */

  pageX: "2rem",
  pageY: "2rem",

  sectionGap: "2rem",

  cardPadding: "1.5rem",

  inputPaddingX: "1rem",
  inputPaddingY: "0.75rem",

  buttonPaddingX: "1.25rem",
  buttonPaddingY: "0.75rem",

  sidebarWidth: "260px",

  navbarHeight: "72px",
} as const;

export type Spacing = typeof spacing;