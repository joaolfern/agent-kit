declare global {
  namespace Cloudflare {
    interface Env {
      ITEMS: Fetcher
      ALLOWED_ORIGINS: string
    }
    interface GlobalProps {
      mainModule: typeof import('../src/index')
    }
  }
}

export {}
