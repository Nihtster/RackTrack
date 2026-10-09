import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '../../src/forms/Input'

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'Glock 19 Gen5', 'aria-label': 'Firearm name' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = {}
export const Number: Story = { args: { type: 'number', placeholder: '0', 'aria-label': 'Rounds fired' } }
export const Date: Story = { args: { type: 'date', 'aria-label': 'Last maintenance' } }
export const Invalid: Story = { args: { invalid: true, defaultValue: 'bad value' } }
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Locked' } }

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Input key={size} {...args} size={size} placeholder={`Size ${size}`} />
      ))}
    </div>
  ),
}
