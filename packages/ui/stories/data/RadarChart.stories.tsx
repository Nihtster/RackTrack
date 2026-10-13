import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardBody, CardHeader } from '../../src/layout/Card'
import { RadarChart } from '../../src/data/RadarChart'

// Comparing firearms across the same measures (sample scores, 0-100).
const firearms = [
  { measure: 'Accuracy', glock: 78, ruger: 90, sig: 74 },
  { measure: 'Reliability', glock: 92, ruger: 88, sig: 80 },
  { measure: 'Ease of cleaning', glock: 85, ruger: 60, sig: 70 },
  { measure: 'Recoil', glock: 70, ruger: 95, sig: 62 },
  { measure: 'Capacity', glock: 88, ruger: 55, sig: 66 },
]

// One firearm's profile: a single series, one score per measure.
const glockStats = [
  { measure: 'Accuracy', score: 78 },
  { measure: 'Reliability', score: 92 },
  { measure: 'Ease of cleaning', score: 85 },
  { measure: 'Recoil', score: 70 },
  { measure: 'Capacity', score: 88 },
]

const meta = {
  title: 'Data/RadarChart',
  component: RadarChart,
  tags: ['autodocs'],
  args: {
    data: firearms,
    axisKey: 'measure',
    series: [
      { key: 'glock', label: 'Glock 19', color: 'success' },
      { key: 'ruger', label: 'Ruger 10/22', color: 'warning' },
      { key: 'sig', label: 'Sig P365', color: 'accentBright' },
    ],
    'aria-label': 'Firearm comparison across five measures',
  },
  parameters: { sampleData: { firearms } },
  // The array is shown in the Data tab, not as a Controls row.
  argTypes: { data: { table: { disable: true } } },
  decorators: [(Story) => <div className="max-w-xl"><Story /></div>],
} satisfies Meta<typeof RadarChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithScale: Story = { args: { showScale: true, max: 100 } }

export const OutlinesOnly: Story = { args: { fillOpacity: 0 } }

// Simple case: one firearm, one polygon, no legend.
export const GunStats: Story = {
  parameters: { sampleData: { glockStats } },
  args: {
    data: glockStats,
    series: [{ key: 'score', label: 'Glock 19', color: 'accent' }],
    max: 100,
    showScale: true,
    fillOpacity: 0.3,
    'aria-label': 'Glock 19 profile across five measures',
  },
}

export const InCard: Story = {
  render: (args) => (
    <Card>
      <CardHeader title="Firearm comparison" />
      <CardBody>
        <RadarChart {...args} />
      </CardBody>
    </Card>
  ),
}
