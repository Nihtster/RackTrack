import { Link, Outlet, useLocation } from 'react-router-dom';
import { AppShell, type RenderSidebarLink } from '@racktrack/ui';
import { navItems } from '../../nav/navItems';

const renderLink: RenderSidebarLink = ({ href, ...rest }) => (
  <Link to={href} {...rest} />
);

export function AppLayout() {
  const { pathname } = useLocation();
  return (
    <AppShell items={navItems} activePath={pathname} renderLink={renderLink}>
      <Outlet />
    </AppShell>
  );
}
