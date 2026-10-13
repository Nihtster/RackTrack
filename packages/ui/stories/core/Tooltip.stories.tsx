import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/core/Button'
import { Tooltip } from '../../src/core/Tooltip'
import { expect, userEvent, waitFor, within } from 'storybook/test'

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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const canvas = within(canvasElement)

    const button = canvas.getByRole('button', { name: 'Add Firearm' })
    await expect(body.queryByRole('tooltip')).not.toBeInTheDocument()

    // Keyboard focus shows it immediately.
    await userEvent.tab()
    await waitFor(() => expect(button).toHaveFocus())
    await expect(await body.findByRole('tooltip')).toHaveTextContent('Add a new firearm')

    // Escape dismisses it.
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('tooltip')).not.toBeInTheDocument())
  },
}

export const Bottom: Story = { args: { placement: 'bottom' } }

export const OnDisabledButton: Story = {
  // Disabled buttons swallow pointer events, so wrap in a span trigger.
  args: {
    content: 'Register a firearm first',
    children: <span className="inline-block"><Button disabled>Log Rounds</Button></span>,
  },
}
