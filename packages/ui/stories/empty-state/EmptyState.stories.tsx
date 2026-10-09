import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/button/Button'
import { Card } from '../../src/card/Card'
import { EmptyState } from '../../src/empty-state/EmptyState'

const BoxIcon = (
  <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8ZM3 8l9 5 9-5M12 13v8" />
  </svg>
)

const meta = {
  title: 'Layout/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'No firearms yet',
    description: 'Register your first firearm to start tracking rounds and maintenance.',
    icon: BoxIcon,
    action: <Button>Add Firearm</Button>,
  },
  decorators: [(Story) => <Card className="max-w-lg"><Story /></Card>],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const TextOnly: Story = { args: { icon: undefined, action: undefined, description: undefined } }
