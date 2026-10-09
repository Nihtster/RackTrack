import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateRangePicker } from '../../src/forms/DateRangePicker'
import type { DateRange } from '../../src/forms/RangeCalendar'
import { Field } from '../../src/forms/Field'

const meta = {
  title: 'Forms/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  args: { 'aria-label': 'Date range' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  decorators: [(Story) => <div className="max-w-xs min-h-96"><Story /></div>],
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: { start: '2026-09-08', end: '2026-09-17' } } }
export const Invalid: Story = { args: { invalid: true } }
export const Disabled: Story = { args: { disabled: true, defaultValue: { start: '2026-09-08', end: '2026-09-17' } } }
export const MinAndMax: Story = { args: { min: '2026-09-10', max: '2026-10-05' } }

function Controlled(args: React.ComponentProps<typeof DateRangePicker>) {
  const [value, setValue] = useState<DateRange>({ start: '', end: '' })
  return (
    <div className="space-y-2">
      <Field label="Report period" hint="Pick a start and an end date.">
        <DateRangePicker {...args} value={value} onValueChange={setValue} />
      </Field>
      <p className="text-xs text-ink-muted">
        Start: {value.start || '(none)'} · End: {value.end || '(none)'}
      </p>
    </div>
  )
}

export const InsideField: Story = { render: (args) => <Controlled {...args} /> }
