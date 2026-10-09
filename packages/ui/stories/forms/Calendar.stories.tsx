import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calendar } from '../../src/forms/Calendar'

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

export const Default: Story = { render: (args) => <Controlled {...args} /> }
export const WithSelection: Story = { args: { value: '2026-09-26' }, render: (args) => <Controlled {...args} /> }
export const MondayStart: Story = { args: { weekStartsOn: 1 }, render: (args) => <Controlled {...args} /> }
export const MinAndMax: Story = {
  args: { value: '2026-09-15', min: '2026-09-10', max: '2026-10-05' },
  render: (args) => <Controlled {...args} />,
}
export const MinOnly: Story = { args: { value: '2026-09-15', min: '2026-09-10' }, render: (args) => <Controlled {...args} /> }
export const MaxOnly: Story = { args: { value: '2026-09-15', max: '2026-09-20' }, render: (args) => <Controlled {...args} /> }
export const RangeCaptionHidden: Story = {
  args: { value: '2026-09-15', min: '2026-09-10', max: '2026-10-05', showRange: false },
  render: (args) => <Controlled {...args} />,
}
