import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardBody, CardHeader } from '../../src/layout/Card'
import { PieChart } from '../../src/data/PieChart'
import { expect, userEvent, within } from 'storybook/test'

const ammo = [
  { caliber: '9mm', rounds: 1240 },
  { caliber: '.22 LR', rounds: 1200 },
  { caliber: '5.56x45mm', rounds: 680 },
  { caliber: '.45 ACP', rounds: 350 },
  { caliber: '12 Gauge', rounds: 120 },
]

const meta = {
  title: 'Data/PieChart',
  component: PieChart,
  tags: ['autodocs'],
  args: {
    data: ammo,
    nameKey: 'caliber',
    valueKey: 'rounds',
    'aria-label': 'Rounds in stock by caliber',
  },
  parameters: { sampleData: { ammo } },
  // The array is shown in the Data tab, not as a Controls row.
  argTypes: { data: { table: { disable: true } } },
  decorators: [(Story) => <div className="max-w-xl"><Story /></div>],
} satisfies Meta<typeof PieChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Donut: Story = {
  args: {
    donut: true,
    centerLabel: (
      <div>
        <div className="text-2xl font-semibold tabular-nums">3,590</div>
        <div className="text-xs text-ink-muted">rounds</div>
      </div>
    ),
  },
}

export const CustomColors: Story = {
  args: { donut: true, colors: ['success', 'accent', 'warning', 'critical', 'accentBright'] },
}

export const WithoutLegend: Story = { args: { showLegend: false, size: 180 } }

function Clickable(args: React.ComponentProps<typeof PieChart>) {
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Ammo by caliber" />
        <CardBody>
          <PieChart
            {...args}
            onSliceClick={(row) => setPicked(`${row.caliber}: ${Number(row.rounds).toLocaleString()} rounds`)}
          />
        </CardBody>
      </Card>
      {/* Stand-in for what a page would do: open a modal or filter the ammo table. */}
      <Card>
        <CardBody className="text-sm text-ink-muted">
          {picked ?? 'Click a slice or a legend row (Tab to a row and press Enter).'}
        </CardBody>
      </Card>
    </div>
  )
}

export const ClickableSlices: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The legend rows are real buttons, so the chart works from the keyboard too.
    await userEvent.click(canvas.getByRole('button', { name: /^9mm/ }))
    await expect(canvas.getByText('9mm: 1,240 rounds')).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: /^\.22 LR/ }))
    await expect(canvas.getByText('.22 LR: 1,200 rounds')).toBeInTheDocument()
  },
  parameters: { docs: { source: { code: `// Slices and legend rows are clickable; the legend rows are real buttons.
<PieChart
  data={ammo}
  nameKey="caliber"
  valueKey="rounds"
  donut
  aria-label="Rounds in stock by caliber"
  onSliceClick={(row, { index }) => filterAmmoTable(row.caliber)}
/>
` } } },
  args: { donut: true },
  render: (args) => <Clickable {...args} />,
}
