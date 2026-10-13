import type { Meta, StoryObj } from '@storybook/react-vite'
import { SplitButton } from '../../src/core/SplitButton'

const options = [
  { label: 'Quick log (last session)', onSelect: () => {} },
  { label: 'Import from CSV', onSelect: () => {} },
  { label: 'Bulk add', onSelect: () => {}, disabled: true },
]

const meta = {
  title: 'Core/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  args: { children: 'Log Rounds', options },
  // The array is shown in the Data tab (onSelect handlers aren't serializable,
  // so only the labels and disabled flags appear).
  parameters: {
    sampleData: {
      options: options.map(({ label, disabled }) => ({ label, ...(disabled && { disabled }) })),
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    options: { table: { disable: true } },
  },
  // Room for the menu to open below the button.
  decorators: [(Story) => <div className="min-h-56 p-4"><Story /></div>],
} satisfies Meta<typeof SplitButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Small: Story = { args: { size: 'sm' } }
export const Loading: Story = { args: { loading: true } }
export const Disabled: Story = { args: { disabled: true } }
