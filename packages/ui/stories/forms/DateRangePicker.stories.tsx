import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateRangePicker } from '../../src/forms/DateRangePicker'
import type { DateRange } from '../../src/forms/RangeCalendar'
import { Field } from '../../src/forms/Field'
import { expect, userEvent, waitFor, within } from 'storybook/test'

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
export const WithValue: Story = { 
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const canvas = within(canvasElement)

    const trigger = canvas.getByRole('button', { name: 'Date range: Sep 8, 2026 – Sep 17, 2026' })

    await userEvent.click(trigger)
    const dialog = await body.findByRole('dialog', { name: 'Choose date range' })

    // Picking the start leaves it open; picking the end closes it.
    await userEvent.click(within(dialog).getByRole('button', { name: 'Sunday, September 20, 2026' }))
    await expect(body.getByRole('dialog')).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Friday, September 25, 2026' }))
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(canvas.getByRole('button', { name: 'Date range: Sep 20, 2026 – Sep 25, 2026' })).toBeInTheDocument()
  },
  args: { defaultValue: { start: '2026-09-08', end: '2026-09-17' } } }
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

export const InsideField: Story = { parameters: { docs: { source: { code: `const [range, setRange] = useState({ start: '', end: '' })

// onValueChange fires on both clicks: once with only the start, again when the end is set.
<Field label="Report period" hint="Pick a start and an end date.">
  <DateRangePicker value={range} onValueChange={setRange} />
</Field>
` } } }, render: (args) => <Controlled {...args} /> }
