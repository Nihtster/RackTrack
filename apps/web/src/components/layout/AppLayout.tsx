import { Link, Outlet, useLocation } from 'react-router-dom';
import { Sidebar, type RenderSidebarLink } from '@racktrack/ui';
import { navItems } from '../../nav/navItems';

const renderLink: RenderSidebarLink = ({ href, ...rest }) => (
  <Link to={href} {...rest} />
);

export function AppLayout() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen bg-app text-ink">
      <Sidebar items={navItems} activePath={pathname} renderLink={renderLink} />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
