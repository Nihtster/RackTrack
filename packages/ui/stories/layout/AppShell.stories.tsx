import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppShell } from '../../src/layout/AppShell'
import { Card, CardBody, CardHeader } from '../../src/layout/Card'
import { PageHeader } from '../../src/layout/PageHeader'
import { Crosshair, LayoutDashboard, Package, Target, Wrench } from '../../src/icons'
import type { NavItem } from '../../src/nav/Sidebar'
import { expect, userEvent, waitFor, within } from 'storybook/test'

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
  { label: 'Rounds', path: '/rounds', icon: Target },
  { label: 'Maintenance', path: '/maintenance', icon: Wrench },
  { label: 'Ammo', path: '/ammo', icon: Package },
]

const meta = {
  title: 'Layout/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  // Fullscreen: the shell is the page. Use the toolbar's viewport menu to see
  // the drawer (phones, iPad mini upright) and the fixed sidebar (larger).
  parameters: { layout: 'fullscreen', sampleData: { items } },
  argTypes: { items: { table: { disable: true } }, children: { table: { disable: true } } },
  args: { items, activePath: '/', children: null },
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

function Page() {
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Range sessions and upkeep at a glance." />
      <div className="grid gap-4 sm:grid-cols-2">
        {['Rounds this month', 'Next maintenance'].map((title) => (
          <Card key={title}>
            <CardHeader>{title}</CardHeader>
            <CardBody>Content that must wrap, not scroll sideways, at every width.</CardBody>
          </Card>
        ))}
      </div>
    </>
  )
}

function Interactive(args: React.ComponentProps<typeof AppShell>) {
  const [path, setPath] = useState(args.activePath)
  return (
    <AppShell
      {...args}
      activePath={path}
      renderLink={({ href, children, onClick, ...rest }) => (
        <a
          {...rest}
          href={href}
          onClick={(e) => {
            onClick?.(e)
            e.preventDefault()
            if (!onClick) setPath(href)
          }}
        >
          {children}
        </a>
      )}
    >
      <Page />
    </AppShell>
  )
}

export const Default: Story = {
  render: (args) => <Interactive {...args} />,
}

// Phones, tablets and any window under 1024px: the sidebar is a drawer behind a
// menu button.
export const PhoneDrawer: Story = {
  globals: { viewport: { value: 'iphone15pro', isRotated: false } },
  render: (args) => <Interactive {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Only the drawer layout has the menu button; skip if the runner is wide.
    if (!window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches) return

    const body = within(document.body)
    const open = canvas.getByRole('button', { name: 'Open navigation' })
    await expect(open).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(open)
    const drawer = await body.findByRole('dialog', { name: 'Navigation' })
    await expect(open).toHaveAttribute('aria-expanded', 'true')

    // Expanding a section keeps the drawer open; choosing a page closes it.
    await userEvent.click(within(drawer).getByRole('link', { name: 'Firearms' }))
    await expect(drawer).toBeInTheDocument()
    await userEvent.click(within(drawer).getByRole('link', { name: 'Add Firearm' }))
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(open).toHaveFocus())

    // Escape closes it too.
    await userEvent.click(open)
    await body.findByRole('dialog', { name: 'Navigation' })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
  },
}

// An upright iPad Pro 11" is under 1024px, so it gets the drawer too. (Real iPads
// get it in landscape as well: the rule also covers any touch-first device.)
export const TabletDrawer: Story = {
  globals: { viewport: { value: 'ipadpro11', isRotated: false } },
  render: (args) => <Interactive {...args} />,
}

// A laptop-width window with a mouse keeps the fixed sidebar and has no menu button.
export const LaptopSidebar: Story = {
  globals: { viewport: { value: 'laptop13', isRotated: false } },
  render: (args) => <Interactive {...args} />,
  play: async ({ canvasElement }) => {
    if (window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches) return
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: 'Open navigation' })).not.toBeInTheDocument()
    await expect(canvas.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()
  },
}
