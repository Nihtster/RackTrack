import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/button/Button'
import { Tooltip } from '../../src/tooltip/Tooltip'

const meta = {
  title: 'Core/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { content: 'Add a new firearm', children: <Button>Add Firearm</Button> },
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
  decorators: [(Story) => <div className="p-16"><Story /></div>],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Bottom: Story = { args: { placement: 'bottom' } }

export const OnDisabledButton: Story = {
  // Disabled buttons swallow pointer events, so wrap in a span trigger.
  args: {
    content: 'Register a firearm first',
    children: <span className="inline-block"><Button disabled>Log Rounds</Button></span>,
  },
}
