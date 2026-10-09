import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/button/Button'
import { Tooltip } from '../../src/tooltip/Tooltip'

const PlusIcon = (
  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const MoreIcon = (
  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
  </svg>
)

const meta = {
  title: 'Core/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Add Firearm' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger', 'ghost', 'link'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
export const Secondary: Story = { args: { variant: 'secondary', children: 'Custom Range' } }
export const Danger: Story = { args: { variant: 'danger', children: 'Delete' } }
export const Ghost: Story = { args: { variant: 'ghost', children: 'View All' } }
export const Link: Story = { args: { variant: 'link', children: 'View All →' } }
export const WithLeadingIcon: Story = { args: { leadingIcon: PlusIcon } }
export const Loading: Story = { args: { loading: true } }
export const Disabled: Story = { args: { disabled: true } }

export const IconOnly: Story = {
  args: { iconOnly: true, 'aria-label': 'More actions', variant: 'ghost', children: MoreIcon },
}

export const IconOnlyWithTooltip: Story = {
  render: () => (
    <div className="flex items-center gap-3 p-8">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Tooltip key={size} content="More actions">
          <Button iconOnly aria-label="More actions" variant="secondary" size={size}>
            {MoreIcon}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
}

export const AllVariants: Story = {
  render: (args) => (
    <div className="grid grid-cols-[repeat(4,max-content)] gap-3">
      {(['primary', 'secondary', 'danger', 'ghost', 'link'] as const).map((variant) => (
        <div key={variant} className="contents">
          <Button {...args} variant={variant}>{variant}</Button>
          <Button {...args} variant={variant} leadingIcon={PlusIcon}>With icon</Button>
          <Button {...args} variant={variant} loading>Loading</Button>
          <Button {...args} variant={variant} disabled>Disabled</Button>
        </div>
      ))}
    </div>
  ),
}
