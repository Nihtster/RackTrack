import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from '../../src/data/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../src/data/Table'
import { usage } from '../../.storybook/usage'

const meta = {
  title: 'Data/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { page: 1, pageCount: 20, onPageChange: () => {} },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

function Controlled(args: React.ComponentProps<typeof Pagination>) {
  const [page, setPage] = useState(args.page)
  return <Pagination {...args} page={page} onPageChange={setPage} />
}

export const Default: Story = { parameters: { docs: { source: { code: usage('Pagination', { state: `const [page, setPage] = useState(1)`, bind: { page: 'page', onPageChange: 'setPage' }, props: { pageCount: 20 } }) } } }, render: (args) => <Controlled {...args} /> }
export const FewPages: Story = { parameters: { docs: { source: { code: usage('Pagination', { state: `const [page, setPage] = useState(1)`, bind: { page: 'page', onPageChange: 'setPage' }, props: { pageCount: 4 } }) } } }, args: { pageCount: 4 }, render: (args) => <Controlled {...args} /> }
export const MiddleOfMany: Story = { parameters: { docs: { source: { code: usage('Pagination', { state: `const [page, setPage] = useState(10)`, bind: { page: 'page', onPageChange: 'setPage' }, props: { pageCount: 20 } }) } } }, args: { page: 10 }, render: (args) => <Controlled {...args} /> }
export const WiderWindow: Story = { parameters: { docs: { source: { code: usage('Pagination', { state: `const [page, setPage] = useState(10)`, bind: { page: 'page', onPageChange: 'setPage' }, props: { pageCount: 20, siblings: 2 } }) } } }, args: { page: 10, siblings: 2 }, render: (args) => <Controlled {...args} /> }
export const Disabled: Story = { args: { page: 3, disabled: true } }

export const Sizes: Story = {
  parameters: { docs: { source: { code: `const [page, setPage] = useState(1)

<Pagination page={page} pageCount={20} onPageChange={setPage} size="sm" />
<Pagination page={page} pageCount={20} onPageChange={setPage} size="md" />
<Pagination page={page} pageCount={20} onPageChange={setPage} size="lg" />
` } } },
  render: (args) => (
    <div className="space-y-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Controlled key={size} {...args} size={size} />
      ))}
    </div>
  ),
}

const PAGE_SIZE = 5
const rows = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  firearm: ['Glock 19 Gen5', 'Ruger 10/22', 'Ruger AR-556', 'Sig Sauer P365'][i % 4],
  rounds: 40 + ((i * 37) % 160),
}))

function WithTable() {
  const [page, setPage] = useState(1)
  const pageCount = Math.ceil(rows.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const visible = rows.slice(start, start + PAGE_SIZE)

  return (
    <div className="max-w-xl space-y-3">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader numeric>#</TableHeader>
            <TableHeader>Firearm</TableHeader>
            <TableHeader numeric>Rounds</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {visible.map((r) => (
            <TableRow key={r.id}>
              <TableCell numeric>{r.id}</TableCell>
              <TableCell>{r.firearm}</TableCell>
              <TableCell numeric>{r.rounds}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-ink-muted">
          Showing {start + 1}–{start + visible.length} of {rows.length}
        </p>
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      </div>
    </div>
  )
}

// The parent owns the page number and slices the rows.
export const WithTableExample: Story = { parameters: { sampleData: { rows }, docs: { source: { code: `const PAGE_SIZE = 5
const [page, setPage] = useState(1)

// You own the page number and slice the rows; Pagination only draws the controls.
const pageCount = Math.ceil(rows.length / PAGE_SIZE)
const start = (page - 1) * PAGE_SIZE
const visible = rows.slice(start, start + PAGE_SIZE)

<Table>
  <TableHead>
    <TableRow>
      <TableHeader numeric>#</TableHeader>
      <TableHeader>Firearm</TableHeader>
      <TableHeader numeric>Rounds</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    {visible.map((r) => (
      <TableRow key={r.id}>
        <TableCell numeric>{r.id}</TableCell>
        <TableCell>{r.firearm}</TableCell>
        <TableCell numeric>{r.rounds}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

<p>Showing {start + 1}–{start + visible.length} of {rows.length}</p>
<Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
` } } }, render: () => <WithTable /> }
