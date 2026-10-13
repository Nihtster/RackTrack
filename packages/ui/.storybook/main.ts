import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@chromatic-com/storybook',
  ],
  // The app owns its artwork (firearm and ammo icons). Serving its public folder
  // lets stories reference /icons/... the same way the app does. If this package
  // moves to its own repo, point this at a local folder of sample assets.
  staticDirs: ['../../../apps/web/public'],
  framework: '@storybook/react-vite',
}

export default config
