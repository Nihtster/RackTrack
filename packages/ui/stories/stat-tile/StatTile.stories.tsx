import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatTile } from '../../src/stat-tile/StatTile'

const BoxIcon = (
  <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8ZM3 8l9 5 9-5M12 13v8" />
  </svg>
)

const meta = {
  title: 'Layout/StatTile',
  component: StatTile,
  tags: ['autodocs'],
  args: { label: 'Total Rounds', value: '3,420', delta: 'Logged' },
  decorators: [(Story) => <div className="max-w-xs"><Story /></div>],
} satisfies Meta<typeof StatTile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithIcon: Story = { args: { icon: BoxIcon } }
export const Warning: Story = {
  args: { label: 'Maintenance', value: '2', delta: 'Due Soon', deltaIntent: 'warning', icon: BoxIcon },
}
export const Positive: Story = {
  args: { label: 'Rounds This Month', value: '1,740', delta: '+12% vs last month', deltaIntent: 'success' },
}
export const Negative: Story = {
  args: { label: 'Rounds This Month', value: '980', delta: '−8% vs last month', deltaIntent: 'critical' },
}
export const NoDelta: Story = { args: { delta: undefined } }
