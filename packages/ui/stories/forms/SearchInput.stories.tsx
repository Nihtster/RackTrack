import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchInput } from '../../src/forms/SearchInput'
import { usage } from '../../.storybook/usage'

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

export const Default: Story = { parameters: { docs: { source: { code: usage('SearchInput', { state: `const [query, setQuery] = useState('')`, bind: { value: 'query', onValueChange: 'setQuery' }, props: { placeholder: 'Search firearms, ammo, rounds…', 'aria-label': 'Search' } }) } } }, render: (args) => <Controlled {...args} /> }
export const WithText: Story = { parameters: { docs: { source: { code: usage('SearchInput', { state: `const [query, setQuery] = useState('glock')`, bind: { value: 'query', onValueChange: 'setQuery' }, props: { placeholder: 'Search firearms, ammo, rounds…', 'aria-label': 'Search' } }) } } }, args: { value: 'glock' }, render: (args) => <Controlled {...args} /> }
export const Small: Story = { parameters: { docs: { source: { code: usage('SearchInput', { state: `const [query, setQuery] = useState('')`, bind: { value: 'query', onValueChange: 'setQuery' }, props: { size: 'sm', placeholder: 'Search firearms, ammo, rounds…', 'aria-label': 'Search' } }) } } }, args: { size: 'sm' }, render: (args) => <Controlled {...args} /> }
export const Disabled: Story = { args: { disabled: true, value: 'locked' } }
