import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/core/Button'
import { Card, CardBody, CardFooter, CardHeader } from '../../src/layout/Card'

const meta = {
  title: 'Layout/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  // Stories narrow to a column by default; `parameters.wide` opts out.
  decorators: [
    (Story, { parameters }) => (parameters.wide ? <Story /> : <div className="max-w-md"><Story /></div>),
  ],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const BodyOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <CardBody>Plain surface with padding.</CardBody>
    </Card>
  ),
}

export const WithHeaderAndAction: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader
        title="Recent Firearms"
        actions={<Button variant="link" size="sm">View All →</Button>}
      />
      <CardBody className="text-sm text-ink-muted">Card content goes here.</CardBody>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader title="Delete firearm" />
      <CardBody className="text-sm text-ink-muted">This can't be undone.</CardBody>
      <CardFooter>
        <Button variant="ghost">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </CardFooter>
    </Card>
  ),
}

const SIZES = ['sm', 'md', 'lg'] as const

function SampleCard({ size }: { size: (typeof SIZES)[number] }) {
  return (
    <Card size={size}>
      <CardHeader
        title={`Size ${size}`}
        actions={size !== 'sm' && <Button variant="link" size="sm">View All →</Button>}
      />
      <CardBody className="text-sm text-ink-muted">
        {size === 'sm' ? 'Compact.' : "Header, body and footer follow the card's size."}
      </CardBody>
      {/* sm is a fixed square: no room for a footer. */}
      {size !== 'sm' && (
        <CardFooter><Button variant="ghost" size="sm">Cancel</Button></CardFooter>
      )}
    </Card>
  )
}

// Each card at its content's own width, to compare density.
export const SizesNaturalWidth: Story = {
  parameters: { wide: true },
  render: () => (
    <div className="space-y-4">
      {SIZES.map((size) => (
        <div key={size} className="w-fit">
          <SampleCard size={size} />
        </div>
      ))}
    </div>
  ),
}

// One row per size, three cards across: how they sit in a dashboard grid.
export const SizesInGrid: Story = {
  parameters: { wide: true },
  render: () => (
    <div className="space-y-6">
      {SIZES.map((size) => (
        <div key={size} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SampleCard size={size} />
          <SampleCard size={size} />
          <SampleCard size={size} />
        </div>
      ))}
    </div>
  ),
}
