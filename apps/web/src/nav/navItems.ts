import {
  Crosshair,
  LayoutDashboard,
  Package,
  Target,
  Wrench,
  type NavItem,
} from '@racktrack/ui';

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  {
    label: 'Firearms',
    icon: Crosshair,
    path: '/firearms',
    subItems: [
      { label: 'All Firearms', path: '/firearms' },
      { label: 'Add Firearm', path: '/firearms/new' },
    ],
  },
  {
    label: 'Rounds',
    icon: Target,
    path: '/rounds',
    subItems: [
      { label: 'Log Session', path: '/rounds/new' },
      { label: 'History', path: '/rounds' },
    ],
  },
  {
    label: 'Maintenance',
    icon: Wrench,
    path: '/maintenance',
    subItems: [
      { label: 'Schedule', path: '/maintenance' },
      { label: 'History', path: '/maintenance/history' },
    ],
  },
  {
    label: 'Ammo',
    icon: Package,
    path: '/ammo',
    subItems: [
      { label: 'Inventory', path: '/ammo' },
      { label: 'Types', path: '/ammo/types' },
    ],
  },
];
