/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import { reactDevtoolsMcp } from './scripts/reactDevtoolsMcp.ts'
// kit:if pwa
import { VitePWA } from 'vite-plugin-pwa'
import { PWA_MANIFEST } from './scripts/pwaManifest.ts'
import { pwaRegisterPlugin } from './scripts/vitePwaRegisterPlugin.ts'
// kit:end

export default defineConfig({
  plugins: [
    reactDevtoolsMcp(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    svgr(),
    // kit:if pwa
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src/sw',
      filename: 'sw.ts',
      injectRegister: false,
      registerType: 'prompt',
      manifest: PWA_MANIFEST,
      includeManifestIcons: false,
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // browser-*.js is MSW's chunk (src/__mocks__/browser.ts), only loaded with mocks on.
        globIgnores: ['mockServiceWorker.js', 'assets/browser-*.js'],
      },
      devOptions: { enabled: false },
    }),
    pwaRegisterPlugin(),
    // kit:end
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    // Same origin as the mocked API URL, so jsdom's CORS checks don't block MSW.
    environmentOptions: { jsdom: { url: 'https://localhost:3000' } },
    // Node 25's own localStorage would shadow jsdom's.
    execArgv: ['--no-experimental-webstorage'],
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
})
