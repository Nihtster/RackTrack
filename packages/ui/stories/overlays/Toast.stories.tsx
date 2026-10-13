import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/core/Button'
import { ToastProvider } from '../../src/overlays/Toast'
import { useToast } from '../../src/overlays/toastContext'
import { expect, userEvent, waitFor, within } from 'storybook/test'

const meta = {
  title: 'Overlays/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  args: { children: null },
  decorators: [(Story) => <ToastProvider><Story /></ToastProvider>],
} satisfies Meta<typeof ToastProvider>

export default meta
type Story = StoryObj<typeof meta>

function Buttons() {
  const { toast } = useToast()
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() => toast({ title: 'Session logged', description: '120 rounds of 9mm with the Glock 19.', intent: 'success' })}
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: 'Maintenance due soon', description: 'Ruger 10/22 is due for a full clean.', intent: 'warning' })}
      >
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: 'Could not save', description: 'Check your connection and try again.', intent: 'critical' })}
      >
        Error
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: 'Copied to clipboard' })}>
        Neutral
      </Button>
    </div>
  )
}

export const Intents: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Success' }))
    await expect(await body.findByRole('status')).toHaveTextContent('Session logged')

    // Errors are announced assertively.
    await userEvent.click(canvas.getByRole('button', { name: 'Error' }))
    await expect(await body.findByRole('alert')).toHaveTextContent('Could not save')
  },
  parameters: { docs: { source: { code: `// 1. Mount the provider once, near the app root
<ToastProvider>
  <App />
</ToastProvider>

// 2. Call toast() from any component inside it
const { toast } = useToast()

toast({
  title: 'Session logged',
  description: '120 rounds of 9mm with the Glock 19.',
  intent: 'success',
})

toast({ title: 'Maintenance due soon', intent: 'warning' })

toast({
  title: 'Could not save',
  description: 'Check your connection and try again.',
  intent: 'critical',
})

toast({ title: 'Copied to clipboard' }) // neutral by default
` } } },
  render: () => <Buttons />,
}

function WithActions() {
  const { toast } = useToast()
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Firearm deleted',
            intent: 'neutral',
            action: { label: 'Undo', onClick: () => toast({ title: 'Restored', intent: 'success' }) },
          })
        }
      >
        With undo
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: 'Sticky: stays until dismissed', duration: 0, intent: 'warning' })}
      >
        Sticky
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          for (let i = 1; i <= 6; i++) toast({ title: `Toast ${i}`, duration: 0 })
        }}
      >
        Fire six (max 4 shown)
      </Button>
    </div>
  )
}

export const ActionsStickyAndStacking: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const canvas = within(canvasElement)

    // An action button runs its handler and dismisses the toast.
    await userEvent.click(canvas.getByRole('button', { name: 'With undo' }))
    await expect(await body.findByText('Firearm deleted')).toBeInTheDocument()
    await userEvent.click(body.getByRole('button', { name: 'Undo' }))
    await expect(await body.findByText('Restored')).toBeInTheDocument()
    await waitFor(() => expect(body.queryByText('Firearm deleted')).not.toBeInTheDocument())

    // Six sticky toasts: only the newest four are kept.
    await userEvent.click(canvas.getByRole('button', { name: /Fire six/ }))
    await waitFor(() => expect(body.getByText('Toast 6')).toBeInTheDocument())
    await expect(body.queryByText('Toast 1')).not.toBeInTheDocument()
    await expect(body.queryByText('Toast 2')).not.toBeInTheDocument()
    await expect(body.getByText('Toast 3')).toBeInTheDocument()
  },
  parameters: { docs: { source: { code: `const { toast } = useToast()

// With an action button. Defaults to 4s (3s without one) so there is time to use it.
toast({
  title: 'Firearm deleted',
  action: { label: 'Undo', onClick: () => restoreFirearm(id) },
})

// Sticky: stays until the user dismisses it
toast({ title: 'Sync paused', intent: 'warning', duration: 0 })

// At most 4 show at once (<ToastProvider max={4}>); the oldest are dropped.
` } } },
  render: () => <WithActions />,
}
