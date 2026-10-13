import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sidebar, type NavItem } from '../../src/nav/Sidebar'
import { Crosshair, LayoutDashboard, Package, Target } from '../../src/icons'
import { expect, userEvent, within } from 'storybook/test'

const items: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  {
    label: 'Firearms',
    path: '/firearms',
    icon: Crosshair,
    subItems: [
      { label: 'All Firearms', path: '/firearms' },
      { label: 'Add Firearm', path: '/firearms/new' },
    ],
  },
  {
    label: 'Rounds',
    path: '/rounds',
    icon: Target,
    subItems: [
      { label: 'Log Session', path: '/rounds/new' },
      { label: 'History', path: '/rounds' },
    ],
  },
  { label: 'Ammo', path: '/ammo', icon: Package },
]

const meta = {
  title: 'Nav/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', sampleData: { items } },
  argTypes: { items: { table: { disable: true } } },
  args: { items, activePath: '/' },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ActiveSubItem: Story = {
  args: { activePath: '/rounds/new' },
}

// Items without an icon still work, and keep their labels aligned with each other.
export const WithoutIcons: Story = {
  args: { items: items.map(({ icon: _icon, ...item }) => item) },
}

export const CustomBrand: Story = {
  args: { brand: 'Range Day' },
}

function InteractiveSidebar(args: React.ComponentProps<typeof Sidebar>) {
  const [path, setPath] = useState(args.activePath)
  return (
    <Sidebar
      {...args}
      activePath={path}
      renderLink={({ href, children, onClick, ...rest }) => (
        <a
          {...rest}
          href={href}
          onClick={(e) => {
            e.preventDefault()
            if (onClick) onClick(e)
            else setPath(href)
          }}
        >
          {children}
        </a>
      )}
    />
  )
}

// Wires the injected link renderer to local state, standing in for a router.
export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page')

    await userEvent.click(canvas.getByRole('link', { name: 'Ammo' }))
    await expect(canvas.getByRole('link', { name: 'Ammo' })).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
  },
  parameters: { docs: { source: { code: `// items: your nav tree (see the Data tab).
// apps/web: inject the router's link so the sidebar stays router-agnostic.
const { pathname } = useLocation()

<Sidebar
  items={items}
  activePath={pathname}
  renderLink={({ href, ...rest }) => <Link to={href} {...rest} />}
/>
` } } },
  render: (args) => <InteractiveSidebar {...args} />,
}
