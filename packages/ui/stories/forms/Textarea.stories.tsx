import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from '../../src/forms/Textarea'

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { placeholder: 'Notes about this session…', 'aria-label': 'Notes' },
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Invalid: Story = { args: { invalid: true, defaultValue: 'Too long…' } }
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Locked' } }
export const TallStart: Story = { args: { rows: 6 } }
