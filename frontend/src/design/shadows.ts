/**
 * ============================================================
 * Nexora Design System
 * ------------------------------------------------------------
 * Elevation & Shadow Tokens
 *
 * Never use Tailwind shadow utilities directly in feature
 * components.
 *
 * Always use these semantic shadow tokens.
 * ============================================================
 */

export const shadows = {
  /**
   * No elevation
   */
  none: "none",

  /**
   * Base Surface
   *
   * Used for flat containers.
   */
  surface: "0 1px 2px rgba(0,0,0,0.12)",

  /**
   * Cards
   */
  card:
    "0 4px 12px rgba(15,23,42,0.18)",

  /**
   * Hovered Cards
   */
  cardHover:
    "0 8px 24px rgba(15,23,42,0.28)",

  /**
   * Dropdown Menus
   */
  dropdown:
    "0 12px 28px rgba(2,6,23,0.35)",

  /**
   * Dialogs
   */
  dialog:
    "0 20px 48px rgba(2,6,23,0.45)",

  /**
   * Floating Panels
   */
  floating:
    "0 24px 64px rgba(2,6,23,0.50)",

  /**
   * Focus Ring
   */
  focus:
    "0 0 0 3px rgba(34,211,238,0.35)",

  /**
   * Glass Layer
   *
   * Reserved for future Liquid Glass UI.
   */
  glass:
    "0 12px 40px rgba(255,255,255,0.08)",
} as const;

export type Shadows = typeof shadows;