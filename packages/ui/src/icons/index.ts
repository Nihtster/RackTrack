// The icon set. Components take icons from here, not straight from lucide, so
// the app uses one curated vocabulary and swapping the underlying library stays
// a one-file change. Add an icon by exporting it below.
export { Icon } from './Icon';
export type {
  ComponentIconProps,
  IconComponent,
  IconProps,
  IconSize,
  ImageIconProps,
} from './Icon';
export { StatusIcon } from './StatusIcon';
export type { StatusIconProps } from './StatusIcon';

export {
  // disclosure and navigation chrome
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Menu as MenuIcon,
  // sidebar sections
  Crosshair,
  LayoutDashboard,
  Package,
  Target,
  Wrench,
  // actions
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
  // status (see StatusIcon for the intent -> glyph mapping)
  CircleCheck,
  CircleX,
  Info,
  TriangleAlert,
  // fields
  Calendar,
} from 'lucide-react';
