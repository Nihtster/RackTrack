import type { ComponentType, HTMLAttributes } from 'react';
import type { LucideProps } from 'lucide-react';
import { cn } from '../utils/cn';
import { intentText, type Intent } from '../theme/intent';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// `sm` matches the 16px icon slot in controls (see theme/control). Component
// icons are square, so these set both sides.
const squareClasses: Record<IconSize, string> = {
  xs: 'size-3.5',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
  '2xl': 'size-12',
};

// Image icons are not square (a rifle is wide, a cartridge is tall), so the same
// scale sets their height and the width follows the artwork's aspect ratio.
const heightClasses: Record<IconSize, string> = {
  xs: 'h-3.5',
  sm: 'h-4',
  md: 'h-5',
  lg: 'h-6',
  xl: 'h-8',
  '2xl': 'h-12',
};

/** Any icon component, such as a lucide one. */
export type IconComponent = ComponentType<LucideProps>;

interface IconBaseProps {
  /**
   * Size on the shared scale. For image icons it is the height, so a row of
   * different firearms lines up; override with `className` (`h-10`, `w-24`) for
   * anything off the scale.
   */
  size?: IconSize;
  /**
   * Status color, from the same set as Badge and StatTile. Leave it off and the
   * icon takes the surrounding text color (the right default inside buttons and
   * nav, where the state color should win).
   */
  tone?: Intent;
  /**
   * Accessible name. Leave it off for decorative icons (the usual case: a label
   * sits next to it) and the icon is hidden from assistive tech. Set it when the
   * icon stands alone and means something.
   */
  label?: string;
}

/** An icon drawn by a component: `<Icon icon={Search} />`. */
export interface ComponentIconProps
  extends IconBaseProps,
    Omit<LucideProps, 'size' | 'ref' | 'children'> {
  /** The glyph to draw, e.g. `icon={Search}`. */
  icon: IconComponent;
  src?: never;
  aspectRatio?: never;
}

/** An icon drawn from an image file: `<Icon src="/icons/rifle.svg" aspectRatio={2.9} />`. */
export interface ImageIconProps
  extends IconBaseProps,
    Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * URL of a single-color SVG (or any image with transparency). Only its shape
   * is used: it is painted in the text color, so it recolors like any icon.
   */
  src: string;
  /** Width divided by height of the artwork. Default 1 (square). */
  aspectRatio?: number;
  icon?: never;
}

export type IconProps = ComponentIconProps | ImageIconProps;

// One place that decides how every icon is sized, stroked and announced.
// Colour comes from the surrounding text (currentColor), so an icon follows
// whatever intent or state its parent has. `tone` sets it explicitly, and a
// `text-*` class in className still wins over that.
export function Icon(props: IconProps) {
  if (props.src !== undefined) return <ImageIcon {...props} />;
  return <ComponentIcon {...props} />;
}

function ComponentIcon({
  icon: Glyph,
  size = 'sm',
  tone,
  label,
  className,
  strokeWidth = 2,
  ...rest
}: ComponentIconProps) {
  return (
    <Glyph
      className={cn('shrink-0', squareClasses[size], tone && intentText[tone], className)}
      strokeWidth={strokeWidth}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      {...rest}
    />
  );
}

// The file is used as a mask over a block of the current text color, which is
// what makes a plain SVG recolorable without inlining it. The element's box comes
// from the height class and the aspect ratio, so layout is stable before the
// image has loaded.
function ImageIcon({
  src,
  aspectRatio = 1,
  size = 'sm',
  tone,
  label,
  className,
  style,
  ...rest
}: ImageIconProps) {
  const mask = `url("${src}")`;
  return (
    <span
      className={cn(
        'inline-block shrink-0 bg-current',
        heightClasses[size],
        tone && intentText[tone],
        className,
      )}
      style={{
        aspectRatio,
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        ...style,
      }}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      {...rest}
    />
  );
}
