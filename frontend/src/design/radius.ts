/**
 * ============================================================
 * Nexora Design System
 * ------------------------------------------------------------
 * Border Radius Tokens
 *
 * Never hardcode border radius values.
 * Always use these tokens.
 * ============================================================
 */

export const radius = {
  none: "0",

  xs: "4px",
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
  full: "9999px",

  /**
   * Component Radius
   */

  button: "10px",

  input: "10px",

  card: "16px",

  dialog: "20px",

  dropdown: "12px",

  badge: "9999px",

  avatar: "9999px",

  fileCard: "18px",

  folderCard: "18px",
} as const;

export type Radius = typeof radius;