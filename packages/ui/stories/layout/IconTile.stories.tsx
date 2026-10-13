import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon, Crosshair, Wrench } from '../../src/icons'
import { IconTile } from '../../src/layout/IconTile'
import { expect } from 'storybook/test'

const meta = {
  title: 'Layout/IconTile',
  component: IconTile,
  tags: ['autodocs'],
  args: { tone: 'accent', size: 'md', children: <Icon icon={Crosshair} /> },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: {
      control: 'select',
      options: ['default', 'neutral', 'accent', 'success', 'warning', 'critical', 'violet'],
    },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof IconTile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// The glyph follows the tile, so an Icon inside needs no size of its own.
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <IconTile key={size} {...args} size={size}>
          <Icon icon={Wrench} />
        </IconTile>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const tiles = canvasElement.querySelectorAll('span')
    await expect(tiles).toHaveLength(3)
    await expect(tiles[0].getBoundingClientRect().width).toBe(32)
    await expect(tiles[2].getBoundingClientRect().width).toBe(48)
  },
}

export const Tones: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      {(['default', 'neutral', 'accent', 'success', 'warning', 'critical', 'violet'] as const).map((tone) => (
        <IconTile key={tone} {...args} tone={tone}>
          <Icon icon={Crosshair} />
        </IconTile>
      ))}
    </div>
  ),
}

export const Round: Story = {
  args: { round: true, tone: 'success' },
}
