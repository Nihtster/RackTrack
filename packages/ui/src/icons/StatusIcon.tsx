import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react';
import type { Intent } from '../theme/intent';
import { Icon, type ComponentIconProps, type IconComponent } from './Icon';

// One glyph per state, so meaning never depends on color alone: a warning is a
// triangle, an error is a crossed circle, success is a ticked circle. The tone
// adds the color on top.
const glyphs: Record<Intent, IconComponent> = {
  neutral: Info,
  accent: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  critical: CircleX,
};

export interface StatusIconProps extends Omit<ComponentIconProps, 'icon' | 'tone' | 'src' | 'aspectRatio'> {
  intent: Intent;
}

// The icon for a status, in that status's color. Use it beside a badge, a toast
// or an inline message so the state reads for people who can't tell the colors apart.
export function StatusIcon({ intent, ...rest }: StatusIconProps) {
  return <Icon icon={glyphs[intent]} tone={intent} {...rest} />;
}
