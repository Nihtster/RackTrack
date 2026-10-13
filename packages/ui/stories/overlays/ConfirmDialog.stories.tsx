import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/core/Button'
import { ConfirmDialog } from '../../src/overlays/ConfirmDialog'
import { expect, userEvent, waitFor, within } from 'storybook/test'

const meta = {
  title: 'Overlays/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  args: {
    open: false,
    onOpenChange: () => {},
    onConfirm: () => {},
    title: 'Delete this firearm?',
    description: 'Its rounds and maintenance history will be removed. This cannot be undone.',
    confirmLabel: 'Delete',
  },
  parameters: { controls: { exclude: ['open', 'onOpenChange', 'onConfirm'] } },
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

function Demo(args: React.ComponentProps<typeof ConfirmDialog>) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  function confirm() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setOpen(false)
      setDone(true)
    }, 1200)
  }

  return (
    <div className="space-y-3">
      <Button variant={args.intent === 'danger' ? 'danger' : 'primary'} onClick={() => { setDone(false); setOpen(true) }}>
        {args.confirmLabel ?? 'Open'}
      </Button>
      {done && <p className="text-sm text-success">Done.</p>}
      <ConfirmDialog {...args} open={open} onOpenChange={setOpen} onConfirm={confirm} loading={saving} />
    </div>
  )
}

// Focus starts on Cancel; confirming shows a loading state, then closes.
export const DangerDelete: Story = { 
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Delete' }))

    const dialog = await body.findByRole('alertdialog', { name: 'Delete this firearm?' })
    // Focus starts on Cancel so a reflex Enter never deletes.
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus())

    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete' }))
    await expect(within(dialog).getByRole('button', { name: 'Delete' })).toHaveAttribute('aria-busy', 'true')
    await expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeDisabled()

    await waitFor(() => expect(body.queryByRole('alertdialog')).not.toBeInTheDocument(), { timeout: 4000 })
    await expect(canvas.getByText('Done.')).toBeInTheDocument()
  },
  parameters: { docs: { source: { code: `const [open, setOpen] = useState(false)
const [saving, setSaving] = useState(false)

<Button variant="danger" onClick={() => setOpen(true)}>Delete</Button>

<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  intent="danger"
  title="Delete this firearm?"
  description="Its rounds and maintenance history will be removed. This cannot be undone."
  confirmLabel="Delete"
  loading={saving}
  onConfirm={async () => {
    setSaving(true)
    await deleteFirearm(id)
    setSaving(false)
    setOpen(false)
  }}
/>
` } } }, args: { intent: 'danger' }, render: (args) => <Demo {...args} /> }

export const Primary: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Log rounds' }))

    const dialog = await body.findByRole('dialog', { name: 'Log this session?' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
  },
  parameters: { docs: { source: { code: `const [open, setOpen] = useState(false)

<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="Log this session?"
  description="120 rounds of 9mm with the Glock 19."
  confirmLabel="Log rounds"
  onConfirm={() => {
    logSession()
    setOpen(false)
  }}
/>
` } } },
  args: {
    intent: 'primary',
    title: 'Log this session?',
    description: '120 rounds of 9mm with the Glock 19.',
    confirmLabel: 'Log rounds',
  },
  render: (args) => <Demo {...args} />,
}
