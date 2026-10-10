import type { ManifestOptions } from 'vite-plugin-pwa'

export const PWA_MANIFEST: Partial<ManifestOptions> = {
  id: '/',
  name: '{{title}}',
  short_name: '{{title}}',
  description: '{{description}}',
  lang: '{{uiLanguage}}',
  dir: 'ltr',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  display_override: ['standalone', 'minimal-ui'],
  orientation: 'any',
  background_color: '#fbfafb',
  theme_color: '#fbfafb',
  icons: [
    { src: '/logos/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
    { src: '/logos/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/logos/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
    {
      src: '/logos/maskable-icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
  launch_handler: { client_mode: ['navigate-existing', 'auto'] },
}
