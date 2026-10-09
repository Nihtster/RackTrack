import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToggleGroup } from '../../src/toggle-group/ToggleGroup'

const filters = [
  { value: 'all', label: 'All (5)' },
  { value: 'pistols', label: 'Pistols (2)' },
  { value: 'rifles', label: 'Rifles (2)' },
  { value: 'shotguns', label: 'Shotguns (1)' },
]

const ranges = [
  { value: 'all', label: 'All Time' },
  { value: '30', label: 'Last 30 Days' },
  { value: '90', label: 'Last 90 Days' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range', disabled: true },
]

const meta = {
  title: 'Core/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  args: {
    options: filters,
    value: 'all',
    onChange: () => {},
    'aria-label': 'Filter by type',
  },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

function Controlled(args: React.ComponentProps<typeof ToggleGroup>) {
  const [value, setValue] = useState(args.value)
  return <ToggleGroup {...args} value={value} onChange={setValue} />
}

export const FirearmFilter: Story = {
  render: (args) => <Controlled {...args} />,
}

export const TimeRange: Story = {
  args: { options: ranges, value: '30', 'aria-label': 'Time range' },
  render: (args) => <Controlled {...args} />,
}

export const Medium: Story = {
  args: { size: 'md' },
  render: (args) => <Controlled {...args} />,
}
