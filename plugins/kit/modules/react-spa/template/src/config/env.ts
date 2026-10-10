const fixURL = (url: string | undefined) => url && url.replace(/\/+$/, '')

export const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS !== 'false'
export const API_URL =
  fixURL(import.meta.env.VITE_API_URL) || 'http://localhost:8787'
export const V1_API_URL =
  fixURL(import.meta.env.VITE_V1_API_URL) || `${API_URL}/v1`
export const SITE_URL = fixURL(import.meta.env.VITE_SITE_URL) || '{{siteUrl}}'
