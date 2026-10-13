import { useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { controlFocusRing } from '../theme/control';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Button } from '../core/Button';
import { Icon, MenuIcon, X } from '../icons';
import { Sidebar, type SidebarProps } from '../nav/Sidebar';
import { Drawer } from '../overlays/Drawer';

// When the navigation is a drawer instead of a fixed sidebar: any narrow window
// (phones, an iPad mini or iPad Pro 11" upright) and any touch-first device
// (every iPad, in either orientation). Laptops and desktop windows 1024px and
// wider, with a mouse or trackpad, keep the fixed sidebar.
const DRAWER_QUERY = '(max-width: 1023px), (pointer: coarse)';

export interface AppShellProps
  extends Pick<SidebarProps, 'items' | 'activePath' | 'renderLink' | 'brand'> {
  /** The page. Rendered inside the shell's `<main>`. */
  children: ReactNode;
  className?: string;
}

// The app frame: the sidebar beside the page on laptops and desktops, and on
// phones and tablets a top bar whose menu button opens the same sidebar in a
// Drawer. Only the choice of layout and the wiring live here; the drawer's
// behaviour is Drawer's, and the navigation is Sidebar's.
export function AppShell({
  items,
  activePath,
  renderLink,
  brand = 'RackTrack',
  children,
  className,
}: AppShellProps) {
  const drawerLayout = useMediaQuery(DRAWER_QUERY);
  const [open, setOpen] = useState(false);

  // A drawer left open when the layout switches to the fixed sidebar (a window
  // dragged wider, a keyboard attached) would sit on top of it, so close it.
  // Adjusting state during render, not in an effect, avoids a flash of both.
  if (!drawerLayout && open) setOpen(false);

  const sidebar = { items, activePath, renderLink };

  return (
    <div className={cn('flex min-h-dvh bg-app text-ink', className)}>
      {!drawerLayout && (
        <aside className="sticky top-0 h-dvh shrink-0">
          <Sidebar {...sidebar} brand={brand} />
        </aside>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {drawerLayout && (
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-2">
            <Button
              iconOnly
              variant="ghost"
              aria-label="Open navigation"
              aria-expanded={open}
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
            >
              <Icon icon={MenuIcon} size="md" />
            </Button>
            <div className="min-w-0 truncate text-base font-semibold">{brand}</div>
          </header>
        )}

        {/* min-w-0 lets wide content (tables, charts) scroll inside the page
            instead of stretching it. */}
        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>

      {drawerLayout && (
        <Drawer open={open} onOpenChange={setOpen} label="Navigation">
          <div
            className="h-full"
            // Choosing a page closes the drawer. A link that only expands a
            // section carries aria-expanded (the sidebar sets it), so those
            // leave it open. Not defaultPrevented: client-side routers prevent
            // default on every navigation.
            onClick={(e) => {
              const link = (e.target as HTMLElement).closest('a[href]');
              if (link && !link.hasAttribute('aria-expanded')) setOpen(false);
            }}
          >
            <Sidebar
              {...sidebar}
              className="h-full w-full"
              brand={
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate">{brand}</span>
                  <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setOpen(false)}
                    className={cn(
                      '-my-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink',
                      controlFocusRing,
                    )}
                  >
                    <Icon icon={X} size="md" />
                  </button>
                </div>
              }
            />
          </div>
        </Drawer>
      )}
    </div>
  );
}
