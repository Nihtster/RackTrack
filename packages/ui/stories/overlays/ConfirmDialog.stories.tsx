import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/core/Button'
import { ConfirmDialog } from '../../src/overlays/ConfirmDialog'

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
export const DangerDelete: Story = { parameters: { docs: { source: { code: `const [open, setOpen] = useState(false)
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
