import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageHeader } from '../../src/layout/PageHeader'

const meta = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  args: { title: 'Firearms' },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const TitleOnly: Story = {}

export const WithSubtitle: Story = {
  args: { subtitle: 'Everything in your safe, in one place.' },
}
