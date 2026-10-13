import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker } from '../../src/forms/DatePicker'
import { Field } from '../../src/forms/Field'
import { expect, userEvent, waitFor, within } from 'storybook/test'

const meta = {
  title: 'Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: { 'aria-label': 'Date' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  decorators: [(Story) => <div className="max-w-xs min-h-96"><Story /></div>],
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { 
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const canvas = within(canvasElement)

    // The button's name carries the chosen date, not just the label.
    const trigger = canvas.getByRole('button', { name: 'Date: Sep 26, 2026' })

    await userEvent.click(trigger)
    const dialog = await body.findByRole('dialog', { name: 'Choose date' })

    await userEvent.click(within(dialog).getByRole('button', { name: 'Monday, September 28, 2026' }))
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Date: Sep 28, 2026' })).toHaveFocus())
  },
  args: { defaultValue: '2026-09-26' } }
export const Invalid: Story = { args: { invalid: true } }
export const Disabled: Story = { args: { disabled: true, defaultValue: '2026-09-26' } }
export const MinAndMax: Story = { 
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /^Date:/ }))
    const dialog = await body.findByRole('dialog', { name: 'Choose date' })
    await expect(within(dialog).getByRole('button', { name: 'Wednesday, September 9, 2026' })).toBeDisabled()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
  },
  args: { min: '2026-09-10', max: '2026-10-05', defaultValue: '2026-09-15' } }

function Controlled(args: React.ComponentProps<typeof DatePicker>) {
  const [value, setValue] = useState('')
  return (
    <div className="space-y-2">
      <Field label="Last maintenance" hint="When you last cleaned it." error={undefined}>
        <DatePicker {...args} value={value} onValueChange={setValue} />
      </Field>
      <p className="text-xs text-ink-muted">Value: {value || '(empty)'}</p>
    </div>
  )
}

export const InsideField: Story = { parameters: { docs: { source: { code: `const [value, setValue] = useState('')

<Field label="Last maintenance" hint="When you last cleaned it.">
  <DatePicker value={value} onValueChange={setValue} />
</Field>
` } } }, render: (args) => <Controlled {...args} /> }
