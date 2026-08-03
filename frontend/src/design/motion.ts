/**
 * ============================================================
 * Nexora Design System
 * ------------------------------------------------------------
 * Motion Tokens
 *
 * Motion is defined by interaction,
 * not by arbitrary speed names.
 * ============================================================
 */

export const motion = {
  duration: {
    instant: "75ms",

    hover: "150ms",

    button: "200ms",

    dropdown: "220ms",

    dialog: "250ms",

    page: "300ms",

    modal: "350ms",
  },

  easing: {
    standard: "ease",

    accelerate: "ease-in",

    decelerate: "ease-out",

    smooth: "cubic-bezier(0.4,0,0.2,1)",

    spring: "cubic-bezier(0.175,0.885,0.32,1.275)",
  },
} as const;

export type Motion = typeof motion;