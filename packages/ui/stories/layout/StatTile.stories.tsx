import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatTile } from '../../src/layout/StatTile'

const BoxIcon = (
  <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8ZM3 8l9 5 9-5M12 13v8" />
  </svg>
)

const meta = {
  title: 'Layout/StatTile',
  component: StatTile,
  tags: ['autodocs'],
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  args: { label: 'Total Rounds', value: '3,420', delta: 'Logged' },
  // Stories narrow to a column by default; `parameters.wide` opts out.
  decorators: [
    (Story, { parameters }) => (parameters.wide ? <Story /> : <div className="max-w-xs"><Story /></div>),
  ],
} satisfies Meta<typeof StatTile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithIcon: Story = { args: { icon: BoxIcon } }
// The icon tile takes a tone, so a row of tiles can tell its categories apart.
export const IconTones: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {(['accent', 'success', 'warning', 'violet'] as const).map((tone) => (
        <StatTile
          key={tone}
          {...args}
          label={tone}
          value="42"
          delta={undefined}
          icon={BoxIcon}
          iconTone={tone}
        />
      ))}
    </div>
  ),
}
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

const SIZES = ['sm', 'md', 'lg'] as const

const sample = {
  icon: BoxIcon,
  label: 'Maintenance',
  value: '2',
  delta: 'Due Soon',
  deltaIntent: 'warning',
} as const

// Each tile at its content's own width, to compare density.
export const SizesNaturalWidth: Story = {
  parameters: { wide: true },
  render: () => (
    <div className="flex flex-col gap-4">
      {SIZES.map((size) => (
        <div key={size} className="w-fit">
          <StatTile {...sample} size={size} />
        </div>
      ))}
    </div>
  ),
}

// One row per size, four tiles across: how they sit in the dashboard's stat row.
export const SizesInGrid: Story = {
  parameters: { wide: true },
  render: () => (
    <div className="space-y-6">
      {SIZES.map((size) => (
        <div key={size} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile {...sample} size={size} label="Firearms" value="5" delta="Registered" deltaIntent="neutral" />
          <StatTile {...sample} size={size} label="Total Rounds" value="3,420" delta="Logged" deltaIntent="neutral" />
          <StatTile {...sample} size={size} />
          <StatTile {...sample} size={size} label="Ammo Types" value="8" delta="In Inventory" deltaIntent="neutral" />
        </div>
      ))}
    </div>
  ),
}
