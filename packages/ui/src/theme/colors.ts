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

  ink: '#E8EEF5',
  inkMuted: '#8997A8',

  success: '#35C98A',
  warning: '#F5B83D',
  critical: '#EF5B67',
} as const;
