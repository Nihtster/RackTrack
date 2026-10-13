import { defineConfig } from 'vitest/config'

// Unit tests for the app's plain logic (derivations, date helpers). Components
// are covered through the UI package's stories.
export default defineConfig({
  test: { include: ['src/**/*.test.ts'], environment: 'node' },
})
