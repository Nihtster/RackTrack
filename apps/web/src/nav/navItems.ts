export interface NavSubItem {
  label: string;
  path: string;
}

export interface NavItem {
  label: string;
  path: string;
  subItems?: NavSubItem[];
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/' },
  {
    label: 'Firearms',
    path: '/firearms',
    subItems: [
      { label: 'All Firearms', path: '/firearms' },
      { label: 'Add Firearm', path: '/firearms/new' },
    ],
  },
  {
    label: 'Rounds',
    path: '/rounds',
    subItems: [
      { label: 'Log Session', path: '/rounds/new' },
      { label: 'History', path: '/rounds' },
    ],
  },
  {
    label: 'Maintenance',
    path: '/maintenance',
    subItems: [
      { label: 'Schedule', path: '/maintenance' },
      { label: 'History', path: '/maintenance/history' },
    ],
  },
  {
    label: 'Ammo',
    path: '/ammo',
    subItems: [
      { label: 'Inventory', path: '/ammo' },
      { label: 'Types', path: '/ammo/types' },
    ],
  },
];
