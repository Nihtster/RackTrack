import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calendar } from '../../src/forms/Calendar'
import { usage } from '../../.storybook/usage'
import { expect, userEvent, waitFor, within } from 'storybook/test'

const meta = {
  title: 'Forms/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: { onChange: () => {} },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

function Controlled(args: React.ComponentProps<typeof Calendar>) {
  const [value, setValue] = useState(args.value ?? '')
  return (
    <div className="space-y-3">
      <Calendar {...args} value={value} onChange={setValue} />
      <p className="text-xs text-ink-muted">Selected: {value || 'none'}</p>
    </div>
  )
}

export const Default: Story = { parameters: { docs: { source: { code: usage('Calendar', { state: `const [value, setValue] = useState('')`, bind: { value: 'value', onChange: 'setValue' } }) } } }, render: (args) => <Controlled {...args} /> }
export const WithSelection: Story = { 
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const day = (label: string) => canvas.getByRole('button', { name: label })
    const cell = (label: string) => day(label).closest('[role=gridcell]')

    await expect(cell('Saturday, September 26, 2026')).toHaveAttribute('aria-selected', 'true')

    await userEvent.click(day('Sunday, September 27, 2026'))
    await expect(cell('Sunday, September 27, 2026')).toHaveAttribute('aria-selected', 'true')
    await expect(cell('Saturday, September 26, 2026')).toHaveAttribute('aria-selected', 'false')

    // Keyboard: arrows move by day and week, and cross into the next month.
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(day('Monday, September 28, 2026')).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    const nextMonthDay = await canvas.findByRole('button', { name: 'Monday, October 5, 2026' })
    await waitFor(() => expect(nextMonthDay).toHaveFocus())
    await expect(canvas.getByText('October 2026')).toBeInTheDocument()
  },
  parameters: { docs: { source: { code: usage('Calendar', { state: `const [value, setValue] = useState('2026-09-26')`, bind: { value: 'value', onChange: 'setValue' } }) } } }, args: { value: '2026-09-26' }, render: (args) => <Controlled {...args} /> }
export const MondayStart: Story = { parameters: { docs: { source: { code: usage('Calendar', { state: `const [value, setValue] = useState('')`, bind: { value: 'value', onChange: 'setValue' }, props: { weekStartsOn: 1 } }) } } }, args: { weekStartsOn: 1 }, render: (args) => <Controlled {...args} /> }
export const MinAndMax: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Days outside the range cannot be chosen.
    await expect(canvas.getByRole('button', { name: 'Wednesday, September 9, 2026' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Thursday, September 10, 2026' })).toBeEnabled()
    await expect(canvas.getByRole('button', { name: 'Previous month' })).toBeDisabled()
    await expect(canvas.getByText(/^Available:/)).toBeInTheDocument()
  },
  parameters: { docs: { source: { code: usage('Calendar', { state: `const [value, setValue] = useState('2026-09-15')`, bind: { value: 'value', onChange: 'setValue' }, props: { min: '2026-09-10', max: '2026-10-05' } }) } } },
  args: { value: '2026-09-15', min: '2026-09-10', max: '2026-10-05' },
  render: (args) => <Controlled {...args} />,
}
export const MinOnly: Story = { parameters: { docs: { source: { code: usage('Calendar', { state: `const [value, setValue] = useState('2026-09-15')`, bind: { value: 'value', onChange: 'setValue' }, props: { min: '2026-09-10' } }) } } }, args: { value: '2026-09-15', min: '2026-09-10' }, render: (args) => <Controlled {...args} /> }
export const MaxOnly: Story = { parameters: { docs: { source: { code: usage('Calendar', { state: `const [value, setValue] = useState('2026-09-15')`, bind: { value: 'value', onChange: 'setValue' }, props: { max: '2026-09-20' } }) } } }, args: { value: '2026-09-15', max: '2026-09-20' }, render: (args) => <Controlled {...args} /> }
export const RangeCaptionHidden: Story = {
  parameters: { docs: { source: { code: usage('Calendar', { state: `const [value, setValue] = useState('2026-09-15')`, bind: { value: 'value', onChange: 'setValue' }, props: { min: '2026-09-10', max: '2026-10-05', showRange: false } }) } } },
  args: { value: '2026-09-15', min: '2026-09-10', max: '2026-10-05', showRange: false },
  render: (args) => <Controlled {...args} />,
}
