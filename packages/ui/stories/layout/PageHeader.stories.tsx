import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/core/Button'
import { SplitButton } from '../../src/core/SplitButton'
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

// Controls sit on the right and drop under the title when there is no room.
export const WithActions: Story = {
  args: {
    subtitle: 'Your firearms, ammo, and maintenance, all in one place.',
    actions: (
      <>
        <span className="text-sm text-ink-muted">Tuesday, October 13, 2026</span>
        <SplitButton options={[{ label: 'Add ammo', onSelect: () => {} }]}>Log Rounds</SplitButton>
      </>
    ),
  },
}

export const WithSingleAction: Story = {
  args: { actions: <Button>Add firearm</Button> },
}

export const CustomClassName: Story = {
  args: { subtitle: 'className merges over defaults', className: 'mb-12' },
}
