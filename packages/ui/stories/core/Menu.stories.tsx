import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/core/Button'
import { Menu } from '../../src/core/Menu'

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

export const RowActions: Story = {}

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
