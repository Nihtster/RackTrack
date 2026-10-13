import { Link } from 'react-router-dom';

// "View All →" in a card header. A router link, styled like Button's link
// variant, since it navigates rather than acts.
export function ViewAllLink({ to, children = 'View All →' }: { to: string; children?: string }) {
  return (
    <Link
      to={to}
      className="relative rounded-control text-xs font-medium text-accent-bright hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright pointer-coarse:before:absolute pointer-coarse:before:-inset-y-3.5 pointer-coarse:before:inset-x-0 pointer-coarse:before:content-['']"
    >
      {children}
    </Link>
  );
}
