import { useState, type MouseEventHandler, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface NavSubItem {
  label: string;
  path: string;
}

export interface NavItem {
  label: string;
  path: string;
  subItems?: NavSubItem[];
}

export interface SidebarLinkProps {
  href: string;
  className: string;
  children: ReactNode;
  'aria-current'?: 'page';
  'aria-expanded'?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
}

export type RenderSidebarLink = (props: SidebarLinkProps) => ReactNode;

// Default renders plain anchors. Apps inject their router's link component.
const defaultRenderLink: RenderSidebarLink = ({ href, ...rest }) => (
  <a href={href} {...rest} />
);

interface SidebarProps {
  items: NavItem[];
  /** Current location path; drives active styling. */
  activePath: string;
  /** Link renderer, so the sidebar stays router-agnostic. */
  renderLink?: RenderSidebarLink;
  brand?: ReactNode;
  className?: string;
}

export function Sidebar({
  items,
  activePath,
  renderLink = defaultRenderLink,
  brand = 'RackTrack',
  className,
}: SidebarProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const activeParent = items.find((item) =>
      item.subItems?.some((s) => s.path === activePath),
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
    <nav
      className={cn(
        'w-60 h-screen bg-surface border-r border-border flex flex-col shrink-0',
        className,
      )}
    >
      <div className="px-4 py-5 text-lg font-semibold text-ink border-b border-border">
        {brand}
      </div>

      <ul className="flex-1 overflow-y-auto py-2">
        {items.map((item) => {
          const hasSubItems = !!item.subItems?.length;
          const isExpanded = expanded.has(item.path);
          const isActiveParent =
            activePath === item.path ||
            !!item.subItems?.some((s) => s.path === activePath);

          return (
            <li key={item.path}>
              {renderLink({
                href: item.path,
                'aria-current': activePath === item.path ? 'page' : undefined,
                'aria-expanded': hasSubItems ? isExpanded : undefined,
                onClick: hasSubItems
                  ? (e) => {
                      e.preventDefault();
                      toggleExpanded(item.path);
                    }
                  : undefined,
                className: cn(
                  'w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors',
                  isActiveParent
                    ? 'bg-surface-raised text-ink font-medium'
                    : 'text-ink-muted hover:bg-surface-raised/60 hover:text-ink',
                ),
                children: (
                  <>
                    <span>{item.label}</span>
                    {hasSubItems && (
                      <span
                        className={cn(
                          'text-ink-muted transition-transform',
                          isExpanded && 'rotate-90',
                        )}
                      >
                        ›
                      </span>
                    )}
                  </>
                ),
              })}

              {hasSubItems && isExpanded && (
                <ul>
                  {item.subItems!.map((sub) => {
                    const isActive = activePath === sub.path;
                    return (
                      <li key={sub.path}>
                        {renderLink({
                          href: sub.path,
                          'aria-current': isActive ? 'page' : undefined,
                          className: cn(
                            'block pl-8 pr-4 py-2 text-sm transition-colors',
                            isActive
                              ? 'text-ink font-medium'
                              : 'text-ink-muted hover:text-ink',
                          ),
                          children: sub.label,
                        })}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
