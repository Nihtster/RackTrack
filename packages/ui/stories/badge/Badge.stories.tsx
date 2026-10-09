import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../../src/badge/Badge'

const meta = {
  title: 'Core/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Due Soon', intent: 'warning' },
  argTypes: {
    intent: { control: 'select', options: ['neutral', 'accent', 'success', 'warning', 'critical'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Warning: Story = {}
export const Critical: Story = { args: { intent: 'critical', children: 'Overdue' } }
export const Success: Story = { args: { intent: 'success', children: 'Up to date' } }
export const Neutral: Story = { args: { intent: 'neutral', children: '9x19mm' } }

export const AllIntents: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['md', 'sm'] as const).map((size) => (
        <div key={size} className="flex items-center gap-2">
          {(['neutral', 'accent', 'success', 'warning', 'critical'] as const).map((intent) => (
            <Badge key={intent} intent={intent} size={size}>{intent}</Badge>
          ))}
        </div>
      ))}
    </div>
  ),
}
