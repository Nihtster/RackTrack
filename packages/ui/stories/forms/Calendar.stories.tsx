import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calendar } from '../../src/forms/Calendar'
import { usage } from '../../.storybook/usage'

const meta = {
  title: 'Forms/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: { onChange: () => {} },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

function Controlled(args: React.ComponentProps<typeof Calendar>) {
  const [value, setValue] = useState(args.value ?? '')
  return (
    <div className="space-y-3">
      <Calendar {...args} value={value} onChange={setValue} />
      <p className="text-xs text-ink-muted">Selected: {value || 'none'}</p>
    </div>
  )
}

export const Default: Story = { parameters: { docs: { source: { code: usage('Calendar', { state: `const [value, setValue] = useState('')`, bind: { value: 'value', onChange: 'setValue' } }) } } }, render: (args) => <Controlled {...args} /> }
export const WithSelection: Story = { parameters: { docs: { source: { code: usage('Calendar', { state: `const [value, setValue] = useState('2026-09-26')`, bind: { value: 'value', onChange: 'setValue' } }) } } }, args: { value: '2026-09-26' }, render: (args) => <Controlled {...args} /> }
export const MondayStart: Story = { parameters: { docs: { source: { code: usage('Calendar', { state: `const [value, setValue] = useState('')`, bind: { value: 'value', onChange: 'setValue' }, props: { weekStartsOn: 1 } }) } } }, args: { weekStartsOn: 1 }, render: (args) => <Controlled {...args} /> }
export const MinAndMax: Story = {
  parameters: { docs: { source: { code: usage('Calendar', { state: `const [value, setValue] = useState('2026-09-15')`, bind: { value: 'value', onChange: 'setValue' }, props: { min: '2026-09-10', max: '2026-10-05' } }) } } },
  args: { value: '2026-09-15', min: '2026-09-10', max: '2026-10-05' },
  render: (args) => <Controlled {...args} />,
}
export const MinOnly: Story = { parameters: { docs: { source: { code: usage('Calendar', { state: `const [value, setValue] = useState('2026-09-15')`, bind: { value: 'value', onChange: 'setValue' }, props: { min: '2026-09-10' } }) } } }, args: { value: '2026-09-15', min: '2026-09-10' }, render: (args) => <Controlled {...args} /> }
export const MaxOnly: Story = { parameters: { docs: { source: { code: usage('Calendar', { state: `const [value, setValue] = useState('2026-09-15')`, bind: { value: 'value', onChange: 'setValue' }, props: { max: '2026-09-20' } }) } } }, args: { value: '2026-09-15', max: '2026-09-20' }, render: (args) => <Controlled {...args} /> }
export const RangeCaptionHidden: Story = {
  parameters: { docs: { source: { code: usage('Calendar', { state: `const [value, setValue] = useState('2026-09-15')`, bind: { value: 'value', onChange: 'setValue' }, props: { min: '2026-09-10', max: '2026-10-05', showRange: false } }) } } },
  args: { value: '2026-09-15', min: '2026-09-10', max: '2026-10-05', showRange: false },
  render: (args) => <Controlled {...args} />,
}
