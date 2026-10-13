import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from '../../src/data/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../src/data/Table'
import { usage } from '../../.storybook/usage'
import { expect, userEvent, within } from 'storybook/test'

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

export const Default: Story = { 
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const page = (n: number) => canvas.getByRole('button', { name: `Page ${n}` })

    await expect(page(1)).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('button', { name: 'Previous page' })).toBeDisabled()

    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }))
    await expect(page(2)).toHaveAttribute('aria-current', 'page')

    await userEvent.click(page(5))
    await expect(page(5)).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('button', { name: 'Previous page' })).toBeEnabled()
  },
  parameters: { docs: { source: { code: usage('Pagination', { state: `const [page, setPage] = useState(1)`, bind: { page: 'page', onPageChange: 'setPage' }, props: { pageCount: 20 } }) } } }, render: (args) => <Controlled {...args} /> }
export const FewPages: Story = { parameters: { docs: { source: { code: usage('Pagination', { state: `const [page, setPage] = useState(1)`, bind: { page: 'page', onPageChange: 'setPage' }, props: { pageCount: 4 } }) } } }, args: { pageCount: 4 }, render: (args) => <Controlled {...args} /> }
export const MiddleOfMany: Story = { parameters: { docs: { source: { code: usage('Pagination', { state: `const [page, setPage] = useState(10)`, bind: { page: 'page', onPageChange: 'setPage' }, props: { pageCount: 20 } }) } } }, args: { page: 10 }, render: (args) => <Controlled {...args} /> }
export const WiderWindow: Story = { parameters: { docs: { source: { code: usage('Pagination', { state: `const [page, setPage] = useState(10)`, bind: { page: 'page', onPageChange: 'setPage' }, props: { pageCount: 20, siblings: 2 } }) } } }, args: { page: 10, siblings: 2 }, render: (args) => <Controlled {...args} /> }
export const Disabled: Story = { 
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const button of canvas.getAllByRole('button')) await expect(button).toBeDisabled()
  },
  args: { page: 3, disabled: true } }

export const Sizes: Story = {
  parameters: { docs: { source: { code: `const [page, setPage] = useState(1)

// Several on one page need distinct names, so screen readers can tell them apart.
<Pagination page={page} pageCount={20} onPageChange={setPage} size="sm" aria-label="Pagination, sm" />
<Pagination page={page} pageCount={20} onPageChange={setPage} size="md" aria-label="Pagination, md" />
<Pagination page={page} pageCount={20} onPageChange={setPage} size="lg" aria-label="Pagination, lg" />
` } } },
  render: (args) => (
    <div className="space-y-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Controlled key={size} {...args} size={size} aria-label={`Pagination, ${size}`} />
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
export const WithTableExample: Story = { 
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Showing 1–5 of 48')).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }))
    await expect(canvas.getByText('Showing 6–10 of 48')).toBeInTheDocument()
    // The table follows the page: the first row of page 2 is item 6.
    await expect(canvas.getAllByRole('row')[1]).toHaveTextContent('6')

    await userEvent.click(canvas.getByRole('button', { name: 'Page 10' }))
    await expect(canvas.getByText('Showing 46–48 of 48')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Next page' })).toBeDisabled()
  },
  parameters: { sampleData: { rows }, docs: { source: { code: `const PAGE_SIZE = 5
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
