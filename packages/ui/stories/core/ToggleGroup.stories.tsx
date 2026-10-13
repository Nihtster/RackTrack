import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToggleGroup } from '../../src/core/ToggleGroup'
import { usage, ref } from '../../.storybook/usage'
import { expect, userEvent, within } from 'storybook/test'

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
  parameters: { sampleData: { filters, ranges } },
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const radio = (name: string | RegExp) => canvas.getByRole('radio', { name })

    await expect(radio(/All/)).toBeChecked()
    await userEvent.click(radio(/Rifles/))
    await expect(radio(/Rifles/)).toBeChecked()
    await expect(radio(/All/)).not.toBeChecked()

    // One tab stop; arrows move and select, wrapping at the end.
    await userEvent.keyboard('{ArrowRight}')
    await expect(radio(/Shotguns/)).toBeChecked()
    await userEvent.keyboard('{ArrowRight}')
    await expect(radio(/All/)).toBeChecked()
  },
  parameters: { docs: { source: { code: usage('ToggleGroup', { state: `const [value, setValue] = useState('all')`, bind: { value: 'value', onChange: 'setValue' }, props: { options: ref('filters'), 'aria-label': 'Filter by type' } }) } } },
  render: (args) => <Controlled {...args} />,
}

export const TimeRange: Story = {
  parameters: { docs: { source: { code: usage('ToggleGroup', { state: `const [value, setValue] = useState('30')`, bind: { value: 'value', onChange: 'setValue' }, props: { options: ref('ranges'), 'aria-label': 'Time range' } }) } } },
  args: { options: ranges, value: '30', 'aria-label': 'Time range' },
  render: (args) => <Controlled {...args} />,
}

export const Medium: Story = {
  parameters: { docs: { source: { code: usage('ToggleGroup', { state: `const [value, setValue] = useState('all')`, bind: { value: 'value', onChange: 'setValue' }, props: { options: ref('filters'), size: 'md', 'aria-label': 'Filter by type' } }) } } },
  args: { size: 'md' },
  render: (args) => <Controlled {...args} />,
}
