import { useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../../src/core/Badge'
import { Button } from '../../src/core/Button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFoot,
  TableHead,
  TableHeader,
  TableRow,
  type SortDirection,
} from '../../src/data/Table'
import { expect, userEvent, within } from 'storybook/test'

interface Session {
  id: number
  date: string
  firearm: string
  ammo: string
  rounds: number
  location: string
  status: 'ok' | 'due' | 'overdue'
}

const sessions: Session[] = [
  { id: 1, date: '2025-09-25', firearm: 'Glock 19 Gen5', ammo: '9mm', rounds: 120, location: 'Indoor Range', status: 'overdue' },
  { id: 2, date: '2025-09-22', firearm: 'Ruger 10/22', ammo: '.22 LR', rounds: 200, location: 'Outdoor Range', status: 'due' },
  { id: 3, date: '2025-09-18', firearm: 'Ruger AR-556', ammo: '5.56x45mm', rounds: 180, location: 'Outdoor Range', status: 'ok' },
  { id: 4, date: '2025-09-14', firearm: 'Sig Sauer P365', ammo: '9mm', rounds: 80, location: 'Indoor Range', status: 'due' },
  { id: 5, date: '2025-09-09', firearm: 'Ruger 10/22', ammo: '.22 LR', rounds: 150, location: 'Outdoor Range', status: 'ok' },
]

const statusBadge = {
  ok: <Badge intent="success" size="sm">Up to date</Badge>,
  due: <Badge intent="warning" size="sm">Due Soon</Badge>,
  overdue: <Badge intent="critical" size="sm">Overdue</Badge>,
}

const meta = {
  title: 'Data/Table',
  component: Table,
  tags: ['autodocs'],
  args: { children: null },
  parameters: { sampleData: { sessions } },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

function Rows({ rows = sessions }: { rows?: Session[] }) {
  return rows.map((s) => (
    <TableRow key={s.id}>
      <TableCell>{s.date}</TableCell>
      <TableCell>{s.firearm}</TableCell>
      <TableCell>{s.ammo}</TableCell>
      <TableCell numeric>{s.rounds}</TableCell>
      <TableCell>{s.location}</TableCell>
      <TableCell>{statusBadge[s.status]}</TableCell>
    </TableRow>
  ))
}

function Head({ children }: { children?: React.ReactNode }) {
  return (
    <TableHead>
      <TableRow>
        <TableHeader>Date</TableHeader>
        <TableHeader>Firearm</TableHeader>
        <TableHeader>Ammo</TableHeader>
        <TableHeader numeric>Rounds</TableHeader>
        <TableHeader>Location</TableHeader>
        <TableHeader>Status</TableHeader>
      </TableRow>
      {children}
    </TableHead>
  )
}

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>Recent rounds</TableCaption>
      <Head />
      <TableBody><Rows /></TableBody>
    </Table>
  ),
}

export const StripedWithHover: Story = {
  args: { striped: true, highlightOnHover: true },
  render: (args) => (
    <Table {...args}>
      <Head />
      <TableBody><Rows /></TableBody>
    </Table>
  ),
}

export const ColumnBorders: Story = {
  args: { withColumnBorders: true },
  render: (args) => (
    <Table {...args}>
      <Head />
      <TableBody><Rows /></TableBody>
    </Table>
  ),
}

export const WithFooterTotal: Story = {
  render: (args) => (
    <Table {...args}>
      <Head />
      <TableBody><Rows /></TableBody>
      <TableFoot>
        <TableRow>
          <TableCell colSpan={3} className="font-medium">Total</TableCell>
          <TableCell numeric className="font-medium">
            {sessions.reduce((n, s) => n + s.rounds, 0)}
          </TableCell>
          <TableCell colSpan={2} />
        </TableRow>
      </TableFoot>
    </Table>
  ),
}

function SortableTable(args: React.ComponentProps<typeof Table>) {
  const [sort, setSort] = useState<{ key: keyof Session; dir: SortDirection } | null>({ key: 'date', dir: 'desc' })
  const [selected, setSelected] = useState<number | null>(null)

  const rows = useMemo(() => {
    if (!sort) return sessions
    const sign = sort.dir === 'asc' ? 1 : -1
    return [...sessions].sort((a, b) => (a[sort.key] > b[sort.key] ? sign : -sign))
  }, [sort])

  function header(key: keyof Session, label: string, numeric?: boolean) {
    const sorted = sort?.key === key ? sort.dir : null
    return (
      <TableHeader
        numeric={numeric}
        sorted={sorted}
        onSort={() => setSort({ key, dir: sorted === 'asc' ? 'desc' : 'asc' })}
      >
        {label}
      </TableHeader>
    )
  }

  return (
    <Table {...args} highlightOnHover>
      <TableHead>
        <TableRow>
          {header('date', 'Date')}
          {header('firearm', 'Firearm')}
          {header('ammo', 'Ammo')}
          {header('rounds', 'Rounds', true)}
          {header('location', 'Location')}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((s) => (
          <TableRow key={s.id} selected={selected === s.id} onClick={() => setSelected(s.id)} className="cursor-pointer">
            <TableCell>{s.date}</TableCell>
            <TableCell>{s.firearm}</TableCell>
            <TableCell>{s.ammo}</TableCell>
            <TableCell numeric>{s.rounds}</TableCell>
            <TableCell>{s.location}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// Sorting is controlled: the parent owns the sort state and orders the rows.
export const Sortable: Story = { 
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const header = (name: string) => canvas.getByRole('columnheader', { name })
    const firstRow = () => canvas.getAllByRole('row')[1]

    await expect(header('Date')).toHaveAttribute('aria-sort', 'descending')

    await userEvent.click(within(header('Rounds')).getByRole('button'))
    await expect(header('Rounds')).toHaveAttribute('aria-sort', 'ascending')
    await expect(header('Date')).toHaveAttribute('aria-sort', 'none')
    await expect(firstRow()).toHaveTextContent('80')

    await userEvent.click(within(header('Rounds')).getByRole('button'))
    await expect(header('Rounds')).toHaveAttribute('aria-sort', 'descending')
    await expect(firstRow()).toHaveTextContent('200')

    // Choosing a row marks it selected.
    await userEvent.click(firstRow())
    await expect(firstRow()).toHaveAttribute('aria-selected', 'true')
  },
  parameters: { docs: { source: { code: `const [sort, setSort] = useState({ key: 'date', dir: 'desc' })

// Sorting is controlled: you order the rows, the header only reports clicks.
const rows = [...sessions].sort((a, b) =>
  a[sort.key] > b[sort.key] ? (sort.dir === 'asc' ? 1 : -1) : sort.dir === 'asc' ? -1 : 1,
)

function toggle(key) {
  setSort({ key, dir: sort.key === key && sort.dir === 'asc' ? 'desc' : 'asc' })
}

<Table highlightOnHover>
  <TableHead>
    <TableRow>
      <TableHeader
        sorted={sort.key === 'date' ? sort.dir : null}
        onSort={() => toggle('date')}
      >
        Date
      </TableHeader>
      <TableHeader
        numeric
        sorted={sort.key === 'rounds' ? sort.dir : null}
        onSort={() => toggle('rounds')}
      >
        Rounds
      </TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    {rows.map((s) => (
      <TableRow key={s.id}>
        <TableCell>{s.date}</TableCell>
        <TableCell numeric>{s.rounds}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
` } } }, render: (args) => <SortableTable {...args} /> }

export const Empty: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The empty state spans the whole table, with its action.
    await expect(canvas.getByText('No sessions logged')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Log Rounds' })).toBeInTheDocument()
  },
  render: (args) => (
    <Table {...args}>
      <Head />
      <TableBody>
        <TableEmpty
          colSpan={6}
          title="No sessions logged"
          description="Log your first range session to see it here."
          action={<Button>Log Rounds</Button>}
        />
      </TableBody>
    </Table>
  ),
}

export const StickyHeader: Story = {
  args: { stickyHeader: true, containerClassName: 'max-h-48', scrollLabel: 'Rounds history' },
  render: (args) => (
    <Table {...args}>
      <Head />
      <TableBody>
        <Rows />
        <Rows rows={sessions.map((s) => ({ ...s, id: s.id + 100 }))} />
      </TableBody>
    </Table>
  ),
}

export const NarrowScrolls: Story = {
  args: { scrollLabel: 'Rounds history' },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
  render: (args) => (
    <Table {...args}>
      <Head />
      <TableBody><Rows /></TableBody>
    </Table>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Table key={size} {...args} size={size}>
          <TableCaption>Size {size}</TableCaption>
          <Head />
          <TableBody><Rows rows={sessions.slice(0, 3)} /></TableBody>
        </Table>
      ))}
    </div>
  ),
}
