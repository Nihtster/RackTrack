import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressBar } from '../../src/data/ProgressBar'
import type { Intent } from '../../src/theme/intent'

const meta = {
  title: 'Data/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: { value: 62, 'aria-label': 'Stock level' },
  argTypes: {
    intent: { control: 'select', options: ['neutral', 'accent', 'success', 'warning', 'critical'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { args: { showValue: true, intent: 'success' } }
export const WithLabel: Story = { args: { label: '9mm', showValue: true, valueLabel: '1,240 rds', intent: 'success' } }
export const Warning: Story = { args: { value: 34, intent: 'warning', showValue: true } }
export const Critical: Story = { args: { value: 12, intent: 'critical', showValue: true } }
export const Empty: Story = { args: { value: 0, showValue: true } }
export const Full: Story = { args: { value: 100, showValue: true, intent: 'success' } }

export const CustomMax: Story = {
  args: { label: 'Rounds until maintenance', value: 380, max: 500, valueLabel: '380 / 500', showValue: true },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ProgressBar key={size} {...args} size={size} showValue />
      ))}
    </div>
  ),
}

// Thresholds belong to the caller: this is the ammo rule from the mockup.
function stockIntent(percent: number): Intent {
  if (percent < 25) return 'critical'
  if (percent < 50) return 'warning'
  return 'success'
}

export const AmmoStock: Story = {
  render: () => (
    <div className="space-y-4">
      {[
        { caliber: '9mm', rounds: 1240, pct: 62 },
        { caliber: '5.56x45mm', rounds: 680, pct: 34 },
        { caliber: '.22 LR', rounds: 1200, pct: 80 },
        { caliber: '12 Gauge', rounds: 120, pct: 24 },
        { caliber: '.308 Winchester', rounds: 90, pct: 18 },
      ].map((a) => (
        <ProgressBar
          key={a.caliber}
          label={`${a.caliber} · ${a.rounds.toLocaleString()} rds`}
          value={a.pct}
          intent={stockIntent(a.pct)}
          showValue
        />
      ))}
    </div>
  ),
}
