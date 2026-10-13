import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/core/Button'
import { Input } from '../../src/forms/Input'
import { Field } from '../../src/forms/Field'
import { Modal } from '../../src/overlays/Modal'

const meta = {
  title: 'Overlays/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: { open: false, onOpenChange: () => {}, title: 'Edit firearm' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  // The modal is opened by the story's own button, not by the `open` arg.
  parameters: { controls: { exclude: ['open', 'onOpenChange'] } },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

function Demo(args: React.ComponentProps<typeof Modal> & { label?: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>{args.label ?? 'Open modal'}</Button>
      <Modal {...args} open={open} onOpenChange={setOpen} />
    </>
  )
}

export const Default: Story = {
  parameters: { docs: { source: { code: `const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open modal</Button>

<Modal
  open={open}
  onOpenChange={setOpen}
  title="Edit firearm"
  description="Update the details for this firearm."
>
  <p>Anything can go in the body: text, a form, a table.</p>
</Modal>
` } } },
  args: { description: 'Update the details for this firearm.' },
  render: (args) => (
    <Demo
      {...args}
      footer={null}
    >
      <p className="text-ink-muted">Anything can go in the body: text, a form, a table.</p>
    </Demo>
  ),
}

function FormModal(args: React.ComponentProps<typeof Modal>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Add firearm</Button>
      <Modal
        {...args}
        open={open}
        onOpenChange={setOpen}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Field label="Name" required>
            <Input placeholder="Glock 19 Gen5" />
          </Field>
          <Field label="Caliber" hint="Pick from your ammo types.">
            <Input placeholder="9x19mm" />
          </Field>
        </form>
      </Modal>
    </>
  )
}

export const WithFormAndFooter: Story = {
  parameters: { docs: { source: { code: `const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Add firearm</Button>

<Modal
  open={open}
  onOpenChange={setOpen}
  title="Add firearm"
  description="Register a new firearm."
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={save}>Save</Button>
    </>
  }
>
  <form className="space-y-4">
    <Field label="Name" required>
      <Input placeholder="Glock 19 Gen5" />
    </Field>
    <Field label="Caliber" hint="Pick from your ammo types.">
      <Input placeholder="9x19mm" />
    </Field>
  </form>
</Modal>
` } } },
  args: { title: 'Add firearm', description: 'Register a new firearm.' },
  render: (args) => <FormModal {...args} />,
}

export const LongContentScrolls: Story = {
  parameters: { docs: { source: { code: `const [open, setOpen] = useState(false)

// The body scrolls inside the dialog; the header and footer stay put.
<Modal open={open} onOpenChange={setOpen} title="Maintenance history" size="lg">
  <ul className="space-y-3">
    {sessions.map((s) => (
      <li key={s.id}>{s.summary}</li>
    ))}
  </ul>
</Modal>
` } } },
  args: { title: 'Maintenance history', size: 'lg' },
  render: (args) => (
    <Demo {...args} label="Open long modal">
      <ul className="space-y-3">
        {Array.from({ length: 30 }, (_, i) => (
          <li key={i} className="rounded-control border border-border p-3">
            Cleaning session {i + 1}: bore, slide and lubrication.
          </li>
        ))}
      </ul>
    </Demo>
  ),
}

export const BackdropClickDisabled: Story = {
  parameters: { docs: { source: { code: `const [open, setOpen] = useState(false)

// Escape and the close button still dismiss it; a stray click outside won't.
<Modal
  open={open}
  onOpenChange={setOpen}
  title="Unsaved changes"
  description="Only Escape or the close button dismiss this."
  closeOnOverlayClick={false}
/>
` } } },
  args: { title: 'Unsaved changes', closeOnOverlayClick: false, description: 'Only Escape or the close button dismiss this.' },
  render: (args) => <Demo {...args} label="Open (backdrop click disabled)" />,
}
