import type { Meta, StoryObj } from '@storybook/react-vite'
import { SplitButton } from '../../src/core/SplitButton'
import { expect, userEvent, waitFor, within } from 'storybook/test'

const options = [
  { label: 'Quick log (last session)', onSelect: () => {} },
  { label: 'Import from CSV', onSelect: () => {} },
  { label: 'Bulk add', onSelect: () => {}, disabled: true },
]

const meta = {
  title: 'Core/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  args: { children: 'Log Rounds', options },
  // The array is shown in the Data tab (onSelect handlers aren't serializable,
  // so only the labels and disabled flags appear).
  parameters: {
    sampleData: {
      options: options.map(({ label, disabled }) => ({ label, ...(disabled && { disabled }) })),
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    options: { table: { disable: true } },
  },
  // Room for the menu to open below the button.
  decorators: [(Story) => <div className="min-h-56 p-4"><Story /></div>],
} satisfies Meta<typeof SplitButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const canvas = within(canvasElement)

    // Two buttons: the main action and the chevron that opens the alternatives.
    await expect(canvas.getByRole('button', { name: 'Log Rounds' })).toBeInTheDocument()
    const chevron = canvas.getByRole('button', { name: 'More options' })

    await userEvent.click(chevron)
    const menu = await body.findByRole('menu')
    await expect(within(menu).getByRole('menuitem', { name: 'Bulk add' })).toBeDisabled()

    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Import from CSV' }))
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument())
  },
}
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Small: Story = { args: { size: 'sm' } }
export const Loading: Story = { 
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // While loading, both halves are inactive but the main button keeps its name.
    const main = canvas.getByRole('button', { name: 'Log Rounds' })
    await expect(main).toBeDisabled()
    await expect(main).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByRole('button', { name: 'More options' })).toBeDisabled()
  },
  args: { loading: true } }
export const Disabled: Story = { args: { disabled: true } }
