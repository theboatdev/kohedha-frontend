/**
 * Shared KOHEDHA brand tokens (rebrand v1.0).
 *
 * Colors and typography are derived from design/KOHEDHA-Rebrand-Standalone.html.
 * Used by public-facing pages today; reusable by the vendor side in a later phase.
 */
export const C = {
  bg: "#FFFFFF",
  bg2: "#F0F0EE",
  bg3: "#E8E8E4",
  bg4: "#0D0D0D",
  text: "#0D0D0D",
  text2: "#FFFFFF",
  muted: "rgba(13,13,13,0.48)",
  accent: "#F5E642",
  accent2: "#E8D800",
  cream: "#F6F6F4",
  dark: "#0D0D0D",
  red: "#C8281A",
  ink: "#1A1A1A",
  green: "#4A8C5C",
  greenBg: "rgba(74,140,92,0.1)",
  rule: "rgba(13,13,13,0.09)",
  accentA: (a: number) => `rgba(245,230,66,${a})`,
  textA: (a: number) => `rgba(13,13,13,${a})`,
  onDarkA: (a: number) => `rgba(255,255,255,${a})`,
} as const;
