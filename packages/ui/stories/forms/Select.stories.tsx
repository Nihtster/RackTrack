import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from '../../src/forms/Select'

const options = (
  <>
    <option value="9mm">9x19mm</option>
    <option value="22lr">.22 LR</option>
    <option value="556">5.56x45mm</option>
    <option value="12ga">12 Gauge</option>
  </>
)

const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  args: { 'aria-label': 'Caliber', placeholder: 'Choose a caliber', children: options },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  decorators: [(Story) => <div className="max-w-xs min-h-48"><Story /></div>],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: '22lr' } }
export const Invalid: Story = { args: { invalid: true } }
export const Disabled: Story = { args: { disabled: true, defaultValue: '9mm' } }
export const Small: Story = { args: { size: 'sm', 'aria-label': 'Sort', placeholder: 'Sort' } }
