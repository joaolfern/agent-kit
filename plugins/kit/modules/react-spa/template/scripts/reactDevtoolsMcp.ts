import type { Plugin } from 'vite'

const ENTRY = '/src/main.tsx'

// Dev-only: registers react-devtools-cdt-mcp before react-dom loads, so Chrome DevTools MCP can profile renders.
export function reactDevtoolsMcp(): Plugin {
  return {
    name: 'react-devtools-mcp',
    apply: 'serve',
    transform(code, id) {
      if (process.env.REACT_DEVTOOLS_MCP !== 'true') return
      if (!id.endsWith(ENTRY)) return
      return `import 'react-devtools-cdt-mcp/register'\n${code}`
    },
  }
}
