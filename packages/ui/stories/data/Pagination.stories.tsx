import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from '../../src/data/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../src/data/Table'

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

export const Default: Story = { render: (args) => <Controlled {...args} /> }
export const FewPages: Story = { args: { pageCount: 4 }, render: (args) => <Controlled {...args} /> }
export const MiddleOfMany: Story = { args: { page: 10 }, render: (args) => <Controlled {...args} /> }
export const WiderWindow: Story = { args: { page: 10, siblings: 2 }, render: (args) => <Controlled {...args} /> }
export const Disabled: Story = { args: { page: 3, disabled: true } }

export const Sizes: Story = {
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
export const WithTableExample: Story = { render: () => <WithTable /> }
