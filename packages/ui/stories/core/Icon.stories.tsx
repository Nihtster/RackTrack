import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../src/core/Button'
import * as icons from '../../src/icons'
import { Icon, StatusIcon, type IconComponent } from '../../src/icons'
import { expect, within } from 'storybook/test'

// The curated set, grouped the way the exports are. A name here is the import name.
const groups: { title: string; names: string[] }[] = [
  { title: 'Sections', names: ['LayoutDashboard', 'Crosshair', 'Target', 'Wrench', 'Package'] },
  { title: 'Actions', names: ['Plus', 'Pencil', 'Trash2', 'Search', 'X'] },
  { title: 'Status', names: ['CircleCheck', 'TriangleAlert', 'CircleX', 'Info'] },
  { title: 'Chrome', names: ['ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight', 'MenuIcon', 'Calendar'] },
]

const lookup = icons as unknown as Record<string, IconComponent>

// Image icons: URL plus aspect ratio (width / height). In the app these come from
// its generated manifest; the stories use the same files, served from the app's
// public folder (see staticDirs in .storybook/main.ts). Relative on purpose: a
// root-absolute `/icons/...` would miss when Storybook is hosted under a path
// (GitHub Pages serves it at /RackTrack/storybook/).
const art = (path: string, aspectRatio: number) => ({ src: `icons/${path}.svg`, aspectRatio })
const firearms = {
  pistol: art('firearms/pistol', 1.442),
  rifle: art('firearms/rifle', 2.94),
  smg: art('firearms/smg', 2.383),
  shotgun: art('firearms/shotgun', 4.929),
  sniper: art('firearms/sniper', 5.047),
  pistolAngled: art('firearms/pistol-angled', 0.869),
  rifleAngled: art('firearms/rifle-angled', 1.389),
  smgAngled: art('firearms/smg-angled', 1.355),
  shotgunAngled: art('firearms/shotgun-angled', 1.323),
  sniperAngled: art('firearms/sniper-angled', 1.399),
}
const ammo = {
  pistol: art('ammo/pistol', 0.309),
  rifle: art('ammo/rifle', 0.15),
  shotgun: art('ammo/shotgun', 0.369),
  sniper: art('ammo/sniper', 0.13),
  pistolGroup: art('ammo/pistol-group', 1.076),
  rifleGroup: art('ammo/rifle-group', 0.553),
  shotgunGroup: art('ammo/shotgun-group', 1.015),
  sniperGroup: art('ammo/sniper-group', 0.45),
}

const meta = {
  title: 'Core/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: { icon: icons.Crosshair },
  argTypes: {
    icon: { table: { disable: true } },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { size: 'lg' },
  decorators: [(Story) => <div className="text-ink"><Story /></div>],
  parameters: { docs: { source: { code: `import { Icon, Crosshair } from '@racktrack/ui'

<Icon icon={Crosshair} size="lg" />` } } },
}

export const Gallery: Story = {
  parameters: {
    docs: { source: { code: `import { Icon, Package } from '@racktrack/ui'

<Icon icon={Package} />` } },
  },
  render: () => (
    <div className="space-y-8 text-ink">
      {groups.map(({ title, names }) => (
        <section key={title} aria-label={title}>
          <h3 className="mb-3 text-sm font-medium text-ink-muted">{title}</h3>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {names.map((name) => (
              <li
                key={name}
                className="flex items-center gap-3 rounded-control border border-border bg-surface px-3 py-2"
              >
                <Icon icon={lookup[name]} size="md" />
                <span className="truncate font-mono text-xs text-ink-muted">{name}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // A name in a group that no longer exists would render nothing: catch it.
    for (const { names } of groups) {
      for (const name of names) await expect(lookup[name], name).toBeDefined()
    }
    await expect(canvas.getAllByRole('listitem')).toHaveLength(
      groups.reduce((n, g) => n + g.names.length, 0),
    )
  },
}

// Firearm silhouettes are image icons: a URL and the artwork's aspect ratio. The
// size scale sets their height, so a row of different guns lines up and each
// width follows its own proportions.
export const Firearms: Story = {
  render: () => (
    <div className="space-y-6 text-ink">
      {([['', 'Level'], ['Angled', 'Angled']] as const).map(([suffix, title]) => (
        <section key={title} aria-label={title}>
          <h3 className="mb-3 text-sm font-medium text-ink-muted">{title}</h3>
          <ul className="flex flex-wrap items-end gap-8">
            {(['pistol', 'rifle', 'smg', 'shotgun', 'sniper'] as const).map((kind) => (
              <li key={kind} className="flex flex-col items-center gap-2">
                <Icon {...firearms[`${kind}${suffix}` as keyof typeof firearms]} size="2xl" />
                <span className="font-mono text-xs text-ink-muted">{kind}{suffix}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('listitem')).toHaveLength(10)
  },
  parameters: { docs: { source: { code: `import { Icon } from '@racktrack/ui'
import { firearmsIcons } from './icons/manifest'

// The manifest holds each file's URL and aspect ratio.
<Icon {...firearmsIcons.rifle} size="xl" />

// The same silhouette tilted 30°, with its own proportions.
<Icon {...firearmsIcons.rifleAngled} size="xl" />

// Or give it any URL and ratio yourself.
<Icon src="/icons/firearms/rifle.svg" aspectRatio={2.94} size="xl" />` } } },
}

// A single cartridge per type, and a Group variant with three side by side.
export const Ammo: Story = {
  render: () => (
    <ul className="flex flex-wrap items-end gap-8 text-ink">
      {(['pistol', 'rifle', 'shotgun', 'sniper'] as const).flatMap((kind) =>
        [kind, `${kind}Group` as const].map((name) => (
          <li key={name} className="flex flex-col items-center gap-2">
            <Icon {...ammo[name]} size="2xl" />
            <span className="font-mono text-xs text-ink-muted">{name}</span>
          </li>
        )),
      )}
    </ul>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('listitem')).toHaveLength(8)
  },
  parameters: { docs: { source: { code: `import { Icon } from '@racktrack/ui'
import { ammoIcons } from './icons/manifest'

<Icon {...ammoIcons.rifle} size="xl" />
<Icon {...ammoIcons.rifleGroup} size="xl" />` } } },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6 text-ink">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <figure key={size} className="flex flex-col items-center gap-2">
          <Icon icon={icons.Crosshair} size={size} />
          <Icon {...firearms.rifle} size={size} />
          <figcaption className="font-mono text-xs text-ink-muted">{size}</figcaption>
        </figure>
      ))}
    </div>
  ),
}

// `tone` picks a status color from the same set as Badge. Without it an icon
// takes the surrounding text color; a `text-*` class overrides either.
export const Recoloring: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        {(['neutral', 'accent', 'success', 'warning', 'critical'] as const).map((tone) => (
          <figure key={tone} className="flex flex-col items-center gap-2">
            <Icon icon={icons.Crosshair} size="lg" tone={tone} />
            <figcaption className="font-mono text-xs text-ink-muted">{tone}</figcaption>
          </figure>
        ))}
      </div>
      <div className="flex items-center gap-8">
        <Icon {...firearms.rifle} size="xl" tone="accent" />
        <Icon {...firearms.pistol} size="xl" tone="warning" />
        <Icon {...ammo.rifleGroup} size="xl" tone="success" />
        <Icon {...ammo.sniper} size="xl" className="text-critical" />
      </div>
    </div>
  ),
  parameters: { docs: { source: { code: `<Icon icon={Crosshair} tone="success" />
<Icon {...firearmsIcons.rifle} size="xl" tone="accent" />

// Any text color class works too:
<Icon {...ammoIcons.sniper} size="xl" className="text-critical" />` } } },
}

// Each status has its own shape as well as its own color, so state doesn't rest
// on color alone: success is a tick, warning a triangle, critical a cross.
export const Status: Story = {
  render: () => (
    <ul className="flex flex-wrap items-center gap-8 text-ink">
      {(['neutral', 'accent', 'success', 'warning', 'critical'] as const).map((intent) => (
        <li key={intent} className="flex items-center gap-2">
          <StatusIcon intent={intent} size="md" />
          <span className="text-sm">{intent}</span>
        </li>
      ))}
    </ul>
  ),
  parameters: { docs: { source: { code: `import { StatusIcon } from '@racktrack/ui'

<StatusIcon intent="warning" />
<StatusIcon intent="critical" label="Overdue" />` } } },
}

// Standalone icons get a name; ones beside a label stay hidden from screen readers.
export const Accessibility: Story = {
  render: () => (
    <div className="flex items-center gap-6 text-ink">
      <Icon icon={icons.TriangleAlert} size="lg" label="Overdue" className="text-critical" />
      <span className="inline-flex items-center gap-2">
        <Icon icon={icons.CircleCheck} className="text-success" />
        Up to date
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('img', { name: 'Overdue' })).toBeInTheDocument()
    // The decorative one is not exposed, so only the labelled icon is an image.
    await expect(canvas.getAllByRole('img')).toHaveLength(1)
  },
}

export const InButtons: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button leadingIcon={<Icon icon={icons.Plus} />}>Add firearm</Button>
      <Button variant="secondary" leadingIcon={<Icon icon={icons.Pencil} />}>Edit</Button>
      <Button variant="danger" leadingIcon={<Icon icon={icons.Trash2} />}>Delete</Button>
      <Button iconOnly variant="ghost" aria-label="Close"><Icon icon={icons.X} /></Button>
    </div>
  ),
}
