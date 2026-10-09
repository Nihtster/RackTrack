import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/button/Button'
import { Card, CardBody, CardFooter, CardHeader } from '../../src/card/Card'

const meta = {
  title: 'Layout/Card',
  component: Card,
  tags: ['autodocs'],
  decorators: [(Story) => <div className="max-w-md"><Story /></div>],
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
