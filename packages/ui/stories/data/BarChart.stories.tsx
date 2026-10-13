import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/core/Button'
import { Card, CardBody, CardHeader } from '../../src/layout/Card'
import { BarChart } from '../../src/data/BarChart'
import { expect, userEvent, waitFor, within } from 'storybook/test'

// Deterministic sample: rounds per day for a month.
const daily = Array.from({ length: 30 }, (_, i) => ({
  date: `Sep ${i + 1}`,
  rounds: [0, 40, 120, 0, 0, 200, 60, 0, 150, 90][i % 10] + (i % 3) * 20,
}))

const monthly = [
  { month: 'May', pistol: 320, rifle: 180 },
  { month: 'Jun', pistol: 410, rifle: 260 },
  { month: 'Jul', pistol: 280, rifle: 340 },
  { month: 'Aug', pistol: 500, rifle: 220 },
  { month: 'Sep', pistol: 380, rifle: 410 },
]

const meta = {
  title: 'Data/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  args: {
    data: daily,
    xKey: 'date',
    series: [{ key: 'rounds', label: 'Rounds', color: 'success' }],
    'aria-label': 'Rounds fired per day, September',
  },
  parameters: { sampleData: { data: daily } },
  // The array is shown in the Data tab, not as a Controls row.
  argTypes: { data: { table: { disable: true } } },
  decorators: [(Story) => <div className="max-w-3xl"><Story /></div>],
} satisfies Meta<typeof BarChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Grouped: Story = {
  parameters: { sampleData: { data: monthly } },
  args: {
    data: monthly,
    xKey: 'month',
    series: [
      { key: 'pistol', label: 'Pistol', color: 'accent' },
      { key: 'rifle', label: 'Rifle', color: 'success' },
    ],
    'aria-label': 'Rounds fired by firearm type',
  },
}

export const Stacked: Story = {
  parameters: { sampleData: { data: monthly } },
  args: { ...Grouped.args, stacked: true },
}

export const InCard: Story = {
  render: (args) => (
    <Card>
      <CardHeader title="Round Count" />
      <CardBody>
        <BarChart {...args} height={220} />
      </CardBody>
    </Card>
  ),
}

function Clickable(args: React.ComponentProps<typeof BarChart>) {
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Round Count" />
        <CardBody>
          <BarChart
            {...args}
            onBarClick={(row) => setPicked(`${row.date}: ${row.rounds} rounds`)}
          />
        </CardBody>
      </Card>
      {/* Stand-in for what a page would do: open a modal or go to a day view. */}
      <Card>
        <CardBody className="flex items-center justify-between gap-3 text-sm">
          <span className="text-ink-muted">
            {picked ?? 'Click a bar (or arrow to one and press Enter).'}
          </span>
          {picked && <Button size="sm" variant="ghost" onClick={() => setPicked(null)}>Clear</Button>}
        </CardBody>
      </Card>
    </div>
  )
}

// onBarClick receives the clicked row, so a page can open a day or month view.
export const ClickableBars: Story = { 
  play: async ({ canvasElement }) => {

    const canvas = within(canvasElement)

    // Bars exist at the start of the draw-in but have no height yet: wait for one that does.
    const tallBar = () =>
      [...canvasElement.querySelectorAll('.recharts-bar-rectangle path')].find(
        (p) => p.getBoundingClientRect().height > 20,
      )
    await waitFor(() => expect(tallBar()).toBeDefined(), { timeout: 4000 })
    await userEvent.click(tallBar()!)
    // The story reports the clicked row, e.g. "Sep 3: 160 rounds".
    await expect(await canvas.findByText(/^Sep \d+: \d+ rounds$/)).toBeInTheDocument()
  },
  parameters: { docs: { source: { code: `// onBarClick also fires from the keyboard: arrow to a bar, then Enter or Space.
<BarChart
  data={days}
  xKey="date"
  series={[{ key: 'rounds', label: 'Rounds', color: 'success' }]}
  aria-label="Rounds fired per day, September"
  onBarClick={(row, { seriesKey, index }) => openDay(row.date)}
/>
` } } }, render: (args) => <Clickable {...args} /> }
