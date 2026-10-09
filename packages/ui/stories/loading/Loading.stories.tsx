import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardBody } from '../../src/card/Card'
import { Loading } from '../../src/loading/Loading'
import { Skeleton } from '../../src/loading/Skeleton'
import { Spinner } from '../../src/loading/Spinner'

const meta = {
  title: 'Layout/Loading',
  component: Loading,
  tags: ['autodocs'],
} satisfies Meta<typeof Loading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const CustomLabel: Story = { args: { label: 'Loading firearms…' } }
export const IconOnly: Story = { args: { hideLabel: true } }

export const Spinners: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-accent-bright">
      <Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" />
    </div>
  ),
}

export const SkeletonCard: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardBody className="space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </CardBody>
    </Card>
  ),
}
