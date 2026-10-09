import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchInput } from '../../src/forms/SearchInput'

const meta = {
  title: 'Forms/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  args: {
    value: '',
    onValueChange: () => {},
    placeholder: 'Search firearms, ammo, rounds…',
    'aria-label': 'Search',
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  decorators: [(Story) => <div className="max-w-md"><Story /></div>],
} satisfies Meta<typeof SearchInput>

export default meta
type Story = StoryObj<typeof meta>

function Controlled(args: React.ComponentProps<typeof SearchInput>) {
  const [value, setValue] = useState(args.value)
  return <SearchInput {...args} value={value} onValueChange={setValue} />
}

export const Default: Story = { render: (args) => <Controlled {...args} /> }
export const WithText: Story = { args: { value: 'glock' }, render: (args) => <Controlled {...args} /> }
export const Small: Story = { args: { size: 'sm' }, render: (args) => <Controlled {...args} /> }
export const Disabled: Story = { args: { disabled: true, value: 'locked' } }
