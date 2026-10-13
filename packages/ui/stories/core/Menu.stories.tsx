import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/core/Button'
import { Menu } from '../../src/core/Menu'
import { expect, userEvent, waitFor, within } from 'storybook/test'

const DotsIcon = (
  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
  </svg>
)

const ChevronIcon = (
  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const items = [
  { label: 'Edit', onSelect: () => {} },
  { label: 'Log maintenance', onSelect: () => {} },
  { label: 'Archive', onSelect: () => {}, disabled: true },
]

const meta = {
  title: 'Core/Menu',
  component: Menu,
  // onSelect handlers aren't serializable, so the Data tab shows labels and disabled flags.
  parameters: {
    sampleData: {
      items: items.map(({ label, disabled }) => ({ label, ...(disabled && { disabled }) })),
    },
  },
  tags: ['autodocs'],
  args: {
    items,
    trigger: (
      <Button iconOnly variant="ghost" aria-label="Firearm actions">
        {DotsIcon}
      </Button>
    ),
  },
  decorators: [(Story) => <div className="min-h-48 p-4"><Story /></div>],
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

export const RowActions: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const canvas = within(canvasElement)

    const trigger = canvas.getByRole('button', { name: 'Firearm actions' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)
    const menu = await body.findByRole('menu')
    await expect(within(menu).getAllByRole('menuitem')).toHaveLength(3)
    await expect(within(menu).getByRole('menuitem', { name: 'Archive' })).toBeDisabled()

    // Escape closes it and returns focus to the trigger.
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())

    // Choosing an item closes the menu.
    await userEvent.click(trigger)
    await userEvent.click(await body.findByRole('menuitem', { name: 'Edit' }))
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument())
  },
}

export const WithTextTrigger: Story = {
  args: { trigger: <Button variant="secondary">Export</Button>, placement: 'bottom-start' },
}

// Button with its own chevron button beside it, wired through Menu directly.
// Joined version with shared styling: see Core/SplitButton.
export const ButtonWithChevron: Story = {
  render: (args) => (
    <div className="flex items-center gap-1">
      <Button variant="secondary">Log Rounds</Button>
      <Menu
        {...args}
        trigger={
          <Button iconOnly variant="secondary" aria-label="More log options">
            {ChevronIcon}
          </Button>
        }
      />
    </div>
  ),
}
