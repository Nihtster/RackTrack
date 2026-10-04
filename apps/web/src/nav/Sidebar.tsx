import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navItems } from './navItems';

export function Sidebar() {
  const location = useLocation();
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const activeParent = navItems.find((item) =>
      item.subItems?.some((s) => s.path === location.pathname),
    );
    return new Set(activeParent ? [activeParent.path] : []);
  });

  function toggleExpanded(path: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }

  return (
    <nav className="w-60 h-screen bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      <div className="px-4 py-5 text-lg font-semibold text-slate-100 border-b border-slate-800">
        RackTrack
      </div>

      <ul className="flex-1 overflow-y-auto py-2">
        {navItems.map((item) => {
          const hasSubItems = !!item.subItems?.length;
          const isExpanded = expanded.has(item.path);
          const isActiveParent =
            location.pathname === item.path ||
            item.subItems?.some((s) => s.path === location.pathname);

          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={(e) => {
                  if (hasSubItems) {
                    e.preventDefault();
                    toggleExpanded(item.path);
                  }
                }}
                className={[
                  'w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors',
                  isActiveParent
                    ? 'bg-slate-800 text-slate-100 font-medium'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100',
                ].join(' ')}
              >
                <span>{item.label}</span>
                {hasSubItems && (
                  <span
                    className={[
                      'text-slate-500 transition-transform',
                      isExpanded ? 'rotate-90' : '',
                    ].join(' ')}
                  >
                    ›
                  </span>
                )}
              </NavLink>

              {hasSubItems && isExpanded && (
                <ul>
                  {item.subItems!.map((sub) => (
                    <li key={sub.path}>
                      <NavLink
                        to={sub.path}
                        className={({ isActive }) =>
                          [
                            'block pl-8 pr-4 py-2 text-sm transition-colors',
                            isActive
                              ? 'text-slate-100 font-medium'
                              : 'text-slate-400 hover:text-slate-100',
                          ].join(' ')
                        }
                      >
                        {sub.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
