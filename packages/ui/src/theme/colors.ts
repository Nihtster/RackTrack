// Raw hex values for contexts that can't use Tailwind classes (chart
// libraries, inline SVG fills, etc). Keep in sync with src/styles/theme.css —
// same palette, two consumption points.
export const colors = {
  app: '#0B1016',
  surface: '#111923',
  surfaceRaised: '#172231',
  border: '#253447',

  accent: '#2388FF',
  accentBright: '#55AAFF',
  // Filled surfaces that carry light text (accent itself is 2.98:1 with ink).
  accentSolid: '#1C66D6',
  accentSolidHover: '#1A58BD',

  ink: '#E8EEF5',
  inkMuted: '#8997A8',

  success: '#35C98A',
  warning: '#F5B83D',
  critical: '#EF5B67',
  // Critical text on its own tint, for badges.
  criticalSoft: '#F4737D',
} as const;
