import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RangeCalendar, type DateRange } from '../../src/forms/RangeCalendar'

const meta = {
  title: 'Forms/RangeCalendar',
  component: RangeCalendar,
  tags: ['autodocs'],
  args: { value: { start: '', end: '' }, onChange: () => {} },
} satisfies Meta<typeof RangeCalendar>

export default meta
type Story = StoryObj<typeof meta>

function Controlled(args: React.ComponentProps<typeof RangeCalendar>) {
  const [value, setValue] = useState<DateRange>(args.value)
  return (
    <div className="space-y-3">
      <RangeCalendar {...args} value={value} onChange={setValue} />
      <p className="text-xs text-ink-muted">
        Start: {value.start || 'none'} · End: {value.end || 'none'}
      </p>
    </div>
  )
}

export const Empty: Story = { render: (args) => <Controlled {...args} /> }
export const WithRange: Story = {
  args: { value: { start: '2026-09-08', end: '2026-09-17' } },
  render: (args) => <Controlled {...args} />,
}
export const MinAndMax: Story = {
  args: { value: { start: '2026-09-12', end: '2026-09-18' }, min: '2026-09-10', max: '2026-10-05' },
  render: (args) => <Controlled {...args} />,
}
