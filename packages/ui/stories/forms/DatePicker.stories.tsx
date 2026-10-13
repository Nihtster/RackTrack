import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker } from '../../src/forms/DatePicker'
import { Field } from '../../src/forms/Field'

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
export const WithValue: Story = { args: { defaultValue: '2026-09-26' } }
export const Invalid: Story = { args: { invalid: true } }
export const Disabled: Story = { args: { disabled: true, defaultValue: '2026-09-26' } }
export const MinAndMax: Story = { args: { min: '2026-09-10', max: '2026-10-05', defaultValue: '2026-09-15' } }

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
