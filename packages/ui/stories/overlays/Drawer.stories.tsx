import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/core/Button'
import { Drawer } from '../../src/overlays/Drawer'
import { expect, userEvent, waitFor, within } from 'storybook/test'

const meta = {
  title: 'Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: { open: false, onOpenChange: () => {}, label: 'Filters', children: null },
  argTypes: { open: { control: false }, onOpenChange: { control: false }, children: { table: { disable: true } } },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

function Demo(args: React.ComponentProps<typeof Drawer>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open filters</Button>
      <Drawer {...args} open={open} onOpenChange={setOpen}>
        <div className="flex h-full flex-col gap-4 border-r border-border bg-surface p-4 text-ink">
          <h2 className="text-base font-semibold">Filters</h2>
          <p className="text-sm text-ink-muted">Whatever the caller puts here: navigation, filters, a form.</p>
          <Button variant="secondary" onClick={() => setOpen(false)}>Done</Button>
        </div>
      </Drawer>
    </>
  )
}

export const Default: Story = {
  render: (args) => <Demo {...args} />,
  parameters: { docs: { source: { code: `const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open filters</Button>

<Drawer open={open} onOpenChange={setOpen} label="Filters">
  <div className="h-full border-r border-border bg-surface p-4">
    ...
  </div>
</Drawer>` } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole('button', { name: 'Open filters' })

    await userEvent.click(trigger)
    const drawer = await body.findByRole('dialog', { name: 'Filters' })
    await expect(drawer).toBeInTheDocument()

    // Escape closes it and focus goes back to what opened it.
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())

    // So does a tap outside, on the dimmed page.
    await userEvent.click(trigger)
    const again = await body.findByRole('dialog', { name: 'Filters' })
    await userEvent.click(again.parentElement as HTMLElement)
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
  },
}
