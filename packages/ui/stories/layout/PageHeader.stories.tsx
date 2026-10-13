import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/core/Button'
import { Tooltip } from '../../src/core/Tooltip'
import { Icon, Package, Plus, Wrench } from '../../src/icons'
import { PageHeader } from '../../src/layout/PageHeader'

const meta = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  args: { title: 'Firearms' },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const TitleOnly: Story = {}

export const WithSubtitle: Story = {
  args: { subtitle: 'Everything in your safe, in one place.' },
}

// Compact controls stay at the right at every width; the title's text wraps
// instead. Icon buttons need an aria-label, and a Tooltip says it on hover.
export const WithActions: Story = {
  args: {
    subtitle: 'Your firearms, ammo, and maintenance, all in one place.',
    actions: (
      <>
        {[
          { icon: Plus, label: 'Log rounds', variant: 'primary' as const },
          { icon: Wrench, label: 'Add maintenance', variant: 'secondary' as const },
          { icon: Package, label: 'Add ammo', variant: 'secondary' as const },
        ].map(({ icon, label, variant }) => (
          <Tooltip key={label} content={label}>
            <Button iconOnly variant={variant} aria-label={label}>
              <Icon icon={icon} />
            </Button>
          </Tooltip>
        ))}
      </>
    ),
  },
}

export const WithSingleAction: Story = {
  args: { actions: <Button>Add firearm</Button> },
}

export const RichSubtitle: Story = {
  args: {
    subtitle: (
      <>
        <time dateTime="2026-10-13">Tue, Oct 13, 2026</time> · Your firearms, ammo, and maintenance.
      </>
    ),
  },
}

export const CustomClassName: Story = {
  args: { subtitle: 'className merges over defaults', className: 'mb-12' },
}
