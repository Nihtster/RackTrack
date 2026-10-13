import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from '../../src/nav/Tabs'
import { usage, ref } from '../../.storybook/usage'

const items = [
  { value: 'overview', label: 'Overview', content: <p className="text-sm text-ink-muted">Glock 19 Gen5, 9x19mm. 842 rounds fired.</p> },
  { value: 'rounds', label: 'Rounds', content: <p className="text-sm text-ink-muted">Session history for this firearm.</p> },
  { value: 'maintenance', label: 'Maintenance', content: <p className="text-sm text-ink-muted">Cleaning and inspection schedule.</p> },
  { value: 'documents', label: 'Documents', content: null, disabled: true },
]

const meta = {
  title: 'Nav/Tabs',
  component: Tabs,
  parameters: { sampleData: { items: items.map(({ content: _c, ...rest }) => rest) } },
  tags: ['autodocs'],
  args: { items, 'aria-label': 'Firearm details' },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Uncontrolled: Story = {}

export const DefaultValue: Story = { args: { defaultValue: 'rounds' } }

function Controlled(args: React.ComponentProps<typeof Tabs>) {
  const [value, setValue] = useState('overview')
  return (
    <div className="space-y-3">
      <p className="text-xs text-ink-muted">Selected: {value}</p>
      <Tabs {...args} value={value} onValueChange={setValue} />
    </div>
  )
}

export const ControlledByParent: Story = { parameters: { docs: { source: { code: usage('Tabs', { state: `const [value, setValue] = useState('overview')`, bind: { value: 'value', onValueChange: 'setValue' }, props: { items: ref('items'), 'aria-label': 'Firearm details' } }) } } }, render: (args) => <Controlled {...args} /> }

export const NarrowScrolls: Story = {
  decorators: [(Story) => <div className="w-64"><Story /></div>],
}
