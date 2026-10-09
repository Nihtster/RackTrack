import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from '../../src/forms/Field'
import { Input } from '../../src/forms/Input'
import { Select } from '../../src/forms/Select'
import { Textarea } from '../../src/forms/Textarea'

const meta = {
  title: 'Forms/Field',
  component: Field,
  tags: ['autodocs'],
  args: { label: 'Firearm name', children: <Input placeholder="Glock 19 Gen5" /> },
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithHint: Story = { args: { hint: 'The name you will see in lists.' } }
export const Required: Story = { args: { required: true } }
export const WithError: Story = {
  args: { required: true, error: 'Name is required.', hint: 'Hidden while there is an error.' },
}

export const WrapsAnyControl: Story = {
  render: () => (
    <div className="space-y-4">
      <Field label="Caliber" hint="Pick from your ammo types.">
        <Select placeholder="Choose a caliber">
          <option>9x19mm</option>
          <option>.22 LR</option>
        </Select>
      </Field>
      <Field label="Notes" error="Notes must be under 500 characters.">
        <Textarea defaultValue="Carry gun." />
      </Field>
    </div>
  ),
}
