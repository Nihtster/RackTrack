import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Every story is a test: it renders in a real browser and fails on an error.
// Run with `pnpm test`; the Storybook UI also has a Testing widget for it.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // `pnpm test:coverage`. Measures component source, not stories or tests.
      // Keep vitest on 4.x: Vitest 5's report loader rejects the reporter that
      // @storybook/addon-vitest registers (it exports it as "module.exports"), so the
      // Testing widget's "Coverage" run fails with "must export a report class".
      // Revisit when the addon is updated for Vitest 5.
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['**/*.test.{ts,tsx}', 'src/index.ts'],
        reporter: ['text-summary', 'html', 'lcov', 'json-summary'],
        reportsDirectory: './coverage',
      },
      projects: [
        // Plain functions: page ranges, date math, key handling, snippet helpers.
        {
          test: {
            name: 'unit',
            environment: 'node',
            include: ['src/**/*.test.ts', '.storybook/**/*.test.ts'],
          },
        },
        {
          extends: true,
          plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({}),
              instances: [{ browser: 'chromium' }],
            },
          },
        },
      ],
    },
  }),
)
