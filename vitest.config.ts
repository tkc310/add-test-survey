import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    // VRT は vitest.vrt.config.ts でアドホック実行する
    exclude: [
      '**/node_modules/**',
      '**/e2e/**',
      '**/e2e-agent/**',
      '**/e2e-pw-agents/**',
      '**/playwright/**',
      '**/*.vrt.test.{ts,tsx}',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
