import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../../src/core/Badge'
import { Crosshair, Icon, Wrench } from '../../src/icons'
import { Card, CardHeader } from '../../src/layout/Card'
import { IconTile } from '../../src/layout/IconTile'
import { List, ListItem } from '../../src/layout/List'
import { ProgressBar } from '../../src/data/ProgressBar'
import { expect, within } from 'storybook/test'

const meta = {
  title: 'Layout/List',
  component: List,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Card className="max-w-md">
        <CardHeader title="Recent Firearms" />
        <Story />
      </Card>
    ),
  ],
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

const firearm = (
  <IconTile tone="neutral">
    <Icon icon={Crosshair} />
  </IconTile>
)

export const Default: Story = {
  render: () => (
    <List>
      <ListItem leading={firearm} title="Glock 19 Gen5" description="Pistol · 9mm" />
      <ListItem leading={firearm} title="Ruger 10/22" description="Rifle · .22 LR" />
      <ListItem leading={firearm} title="Remington 870" description="Shotgun · 12 Gauge" />
    </List>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('list')).toBeInTheDocument()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3)
  },
}

// renderLink takes the row's class and content, so any router's Link fits.
export const Links: Story = {
  render: () => (
    <List>
      {['Glock 19 Gen5', 'Ruger 10/22'].map((name) => (
        <ListItem
          key={name}
          leading={firearm}
          title={name}
          description="Pistol · 9mm"
          renderLink={({ className, children }) => (
            <a href="#" className={className} onClick={(e) => e.preventDefault()}>
              {children}
            </a>
          )}
        />
      ))}
    </List>
  ),
  play: async ({ canvasElement }) => {
    const links = within(canvasElement).getAllByRole('link')
    await expect(links).toHaveLength(2)
    // The whole row is the link, and its name comes from the row's text.
    await expect(links[0]).toHaveAccessibleName(/Glock 19 Gen5/)
  },
}

export const WithBadgeAndLines: Story = {
  render: () => (
    <List>
      <ListItem
        alignStart
        leading={
          <IconTile tone="neutral">
            <Icon icon={Wrench} />
          </IconTile>
        }
        title="Glock 19 Gen5"
        description={
          <>
            <div>Deep clean and lubricate</div>
            <div>Due: Oct 8, 2026</div>
          </>
        }
        trailing={<Badge intent="critical" size="sm">Overdue</Badge>}
      />
      <ListItem
        alignStart
        leading={
          <IconTile tone="neutral">
            <Icon icon={Wrench} />
          </IconTile>
        }
        title="Ruger 10/22"
        description={
          <>
            <div>Clean bolt and barrel</div>
            <div>Due: Oct 17, 2026</div>
          </>
        }
        trailing={<Badge intent="warning" size="sm">Due Soon</Badge>}
      />
    </List>
  ),
}

export const WithMeter: Story = {
  render: () => (
    <List>
      {[
        ['12 Gauge', 90, 500],
        ['9mm', 1240, 2000],
      ].map(([name, onHand, target]) => (
        <ListItem
          key={name}
          title={name}
          description={`${onHand} rds`}
          trailing={
            <ProgressBar
              value={onHand as number}
              max={target as number}
              size="sm"
              aria-label={`${name} stock`}
              className="w-28"
            />
          }
        />
      ))}
    </List>
  ),
}
