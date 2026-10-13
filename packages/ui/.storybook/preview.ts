import type { Preview } from '@storybook/react-vite'
import { collapseLongArrays } from './sourceTransform'
import { racktrackTheme } from './theme'
import './storybook.css'

const preview: Preview = {
  parameters: {
    layout: 'padded',
    docs: {
      theme: racktrackTheme,
      // Adds a "Code" tab beside Controls / Actions / Interactions with the
      // story's source.
      codePanel: true,
      // Long inline arrays become `data={data}`; see the Data tab for the array.
      source: { transform: (code: string) => collapseLongArrays(code) },
    },
    backgrounds: {
      options: {
        app: { name: 'app', value: '#0b1016' },
        surface: { name: 'surface', value: '#111923' },
      },
    },
    // The devices RackTrack is designed and checked against. Pick one from the
    // toolbar; sizes are CSS pixels (portrait unless noted).
    viewport: {
      options: {
        iphone15pro: { name: 'iPhone 15 Pro', type: 'mobile', styles: { width: '393px', height: '852px' } },
        iphone15promax: { name: 'iPhone 15 Pro Max', type: 'mobile', styles: { width: '430px', height: '932px' } },
        ipadmini: { name: 'iPad mini', type: 'tablet', styles: { width: '744px', height: '1133px' } },
        ipadpro11: { name: 'iPad Pro 11"', type: 'tablet', styles: { width: '834px', height: '1194px' } },
        ipadpro13: { name: 'iPad Pro 13"', type: 'tablet', styles: { width: '1032px', height: '1376px' } },
        laptop13: { name: 'Laptop 13"', type: 'desktop', styles: { width: '1280px', height: '800px' } },
        macbook14: { name: 'MacBook 14"', type: 'desktop', styles: { width: '1512px', height: '982px' } },
        laptop16: { name: 'Laptop 16"', type: 'desktop', styles: { width: '1728px', height: '1117px' } },
      },
    },
    controls: { matchers: { color: /(background|color)$/i } },
    // Axe runs on every story; a violation fails the test run (and shows in the
    // Accessibility panel). Use `a11y: { test: 'todo' }` to downgrade one story.
    a11y: { test: 'error' },
  },
  initialGlobals: { backgrounds: { value: 'app' } },
}

export default preview
