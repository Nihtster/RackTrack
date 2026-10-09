import type { Preview } from '@storybook/react-vite'
import { racktrackTheme } from './theme'
import './storybook.css'

const preview: Preview = {
  parameters: {
    layout: 'padded',
    docs: { theme: racktrackTheme },
    backgrounds: {
      options: {
        app: { name: 'app', value: '#0b1016' },
        surface: { name: 'surface', value: '#111923' },
      },
    },
    controls: { matchers: { color: /(background|color)$/i } },
  },
  initialGlobals: { backgrounds: { value: 'app' } },
}

export default preview
