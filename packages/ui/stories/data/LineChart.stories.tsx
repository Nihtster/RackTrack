import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardBody, CardHeader } from '../../src/layout/Card'
import { LineChart } from '../../src/data/LineChart'

const monthly = [
  { month: 'May', rounds: 500, spend: 190 },
  { month: 'Jun', rounds: 670, spend: 260 },
  { month: 'Jul', rounds: 620, spend: 240 },
  { month: 'Aug', rounds: 720, spend: 300 },
  { month: 'Sep', rounds: 790, spend: 330 },
]

const meta = {
  title: 'Data/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  args: {
    data: monthly,
    xKey: 'month',
    series: [{ key: 'rounds', label: 'Rounds', color: 'accentBright' }],
    'aria-label': 'Rounds fired per month',
  },
  parameters: { sampleData: { data: monthly } },
  // The array is shown in the Data tab, not as a Controls row.
  argTypes: { data: { table: { disable: true } } },
  decorators: [(Story) => <div className="max-w-3xl"><Story /></div>],
} satisfies Meta<typeof LineChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithDots: Story = { args: { showDots: true } }

export const MultipleSeries: Story = {
  args: {
    series: [
      { key: 'rounds', label: 'Rounds', color: 'accentBright' },
      { key: 'spend', label: 'Spend ($)', color: 'warning' },
    ],
    showDots: true,
  },
}

export const FormattedValues: Story = {
  args: {
    series: [{ key: 'spend', label: 'Spend', color: 'warning' }],
    valueFormatter: (v) => `$${v}`,
    'aria-label': 'Ammo spend per month',
  },
}

function Clickable(args: React.ComponentProps<typeof LineChart>) {
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Rounds per month" />
        <CardBody>
          <LineChart
            {...args}
            onPointClick={(row) => setPicked(`${row.month}: ${row.rounds} rounds, $${row.spend}`)}
          />
        </CardBody>
      </Card>
      {/* Stand-in for what a page would do: open a month view or modal. */}
      <Card>
        <CardBody className="text-sm text-ink-muted">
          {picked ?? 'Click the chart (or arrow to a point and press Enter).'}
        </CardBody>
      </Card>
    </div>
  )
}

// onPointClick receives the row nearest the pointer, so a page can open a month view.
export const ClickablePoints: Story = {
  parameters: { docs: { source: { code: `// Fires for the point nearest the pointer; the row holds every series.
<LineChart
  data={months}
  xKey="month"
  series={[
    { key: 'rounds', label: 'Rounds', color: 'accentBright' },
    { key: 'spend', label: 'Spend ($)', color: 'warning' },
  ]}
  showDots
  aria-label="Rounds per month"
  onPointClick={(row, { index }) => openMonth(row.month)}
/>
` } } },
  args: { showDots: true },
  render: (args) => <Clickable {...args} />,
}
