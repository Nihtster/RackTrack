import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RangeCalendar, type DateRange } from '../../src/forms/RangeCalendar'
import { usage } from '../../.storybook/usage'
import { expect, userEvent, within } from 'storybook/test'

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

export const Empty: Story = { parameters: { docs: { source: { code: usage('RangeCalendar', { state: `const [range, setRange] = useState({ start: '', end: '' })`, bind: { value: 'range', onChange: 'setRange' } }) } } }, render: (args) => <Controlled {...args} /> }
export const WithRange: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const day = (label: string) => canvas.getByRole('button', { name: label })

    // First click starts a new range, second click ends it.
    await userEvent.click(day('Sunday, September 20, 2026'))
    await expect(canvas.getByText('Start: 2026-09-20 · End: none')).toBeInTheDocument()
    await userEvent.click(day('Thursday, September 24, 2026'))
    await expect(canvas.getByText('Start: 2026-09-20 · End: 2026-09-24')).toBeInTheDocument()

    // With both set, the next click starts over; an earlier second click swaps the ends.
    await userEvent.click(day('Monday, September 14, 2026'))
    await expect(canvas.getByText('Start: 2026-09-14 · End: none')).toBeInTheDocument()
    await userEvent.click(day('Tuesday, September 8, 2026'))
    await expect(canvas.getByText('Start: 2026-09-08 · End: 2026-09-14')).toBeInTheDocument()
  },
  parameters: { docs: { source: { code: usage('RangeCalendar', { state: `const [range, setRange] = useState({ start: '2026-09-08', end: '2026-09-17' })`, bind: { value: 'range', onChange: 'setRange' } }) } } },
  args: { value: { start: '2026-09-08', end: '2026-09-17' } },
  render: (args) => <Controlled {...args} />,
}
export const MinAndMax: Story = {
  parameters: { docs: { source: { code: usage('RangeCalendar', { state: `const [range, setRange] = useState({ start: '2026-09-12', end: '2026-09-18' })`, bind: { value: 'range', onChange: 'setRange' }, props: { min: '2026-09-10', max: '2026-10-05' } }) } } },
  args: { value: { start: '2026-09-12', end: '2026-09-18' }, min: '2026-09-10', max: '2026-10-05' },
  render: (args) => <Controlled {...args} />,
}
