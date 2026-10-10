#!/usr/bin/env node
// Composes a project from agent-kit modules. No dependencies; Node >= 20.
//
//   node compose.mjs <targetDir> <config.json> [--dry-run] [--context-only] [--force] [--prune]
//
// --context-only  only (re)write CLAUDE.md, AGENTS.md, .claude/settings.json, .mcp.json, .claude/kit.json
// --force         overwrite existing files (otherwise existing files are skipped and reported)
// --prune         drop kit blocks of modules that are no longer selected
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MODULES_DIR = path.join(KIT_ROOT, 'modules')
const BINARY = /\.(png|jpe?g|gif|ico|webp|woff2?|ttf|otf|pdf|zip)$/i
const MARKETPLACE = 'agent-kit'

function fail(message) {
  console.error(`compose: ${message}`)
  process.exit(1)
}

function parseArgs(argv) {
  const flags = new Set(argv.filter((arg) => arg.startsWith('--')))
  const [target, configPath] = argv.filter((arg) => !arg.startsWith('--'))
  if (!target || !configPath) fail('usage: compose.mjs <targetDir> <config.json> [--dry-run] [--context-only] [--force] [--prune]')
  return {
    target: path.resolve(target),
    configPath: path.resolve(configPath),
    dryRun: flags.has('--dry-run'),
    contextOnly: flags.has('--context-only'),
    force: flags.has('--force'),
    prune: flags.has('--prune'),
  }
}

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function loadModules() {
  const modules = new Map()
  for (const id of fs.readdirSync(MODULES_DIR)) {
    const file = path.join(MODULES_DIR, id, 'module.json')
    if (!fs.existsSync(file)) continue
    const module = readJson(file)
    if (module.id !== id) fail(`modules/${id}/module.json has id "${module.id}"`)
    modules.set(id, { requires: [], conflicts: [], plugins: [], order: 50, ...module, dir: path.dirname(file) })
  }
  return modules
}

function resolveModules(requested, modules) {
  const active = new Set()
  const visit = (id, from) => {
    if (!modules.has(id)) fail(`unknown module "${id}"${from ? ` (required by ${from})` : ''}`)
    if (active.has(id)) return
    active.add(id)
    for (const dependency of modules.get(id).requires) visit(dependency, id)
  }
  for (const module of modules.values()) if (module.always) visit(module.id)
  for (const id of requested) visit(id)
  for (const module of modules.values()) {
    if (module.whenAny && !active.has(module.id) && module.whenAny.some((id) => active.has(id))) visit(module.id)
  }
  for (const id of active) {
    for (const conflict of modules.get(id).conflicts) {
      if (active.has(conflict)) fail(`modules "${id}" and "${conflict}" can't be combined`)
    }
  }
  return [...active].map((id) => modules.get(id)).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
}

function withDefaults(config) {
  const name = config.name ?? fail('config.name is required')
  const domain = config.domain ?? `${name}.example.com`
  return {
    title: name,
    description: '',
    uiLanguage: 'en',
    agentsMd: true,
    siteUrl: `https://${domain}`,
    apiUrl: `https://api.${domain}`,
    scope: `@${name}`,
    contractPackage: `@${name}/contract`,
    ...config,
    domain,
    examples: {
      feature: 'src/pages/Items/',
      queryHook: 'src/pages/Items/hooks/useItems.ts',
      skeleton: 'src/pages/Items/components/ItemCard/ItemCardSkeleton.tsx',
      ...config.examples,
    },
    tokens: {
      page: '--color-page',
      surface: '--color-surface',
      raised: '--color-raised',
      border: '--color-border',
      ...config.tokens,
    },
    brand: {
      primary: '#d15c6a',
      primaryHover: '#e07a87',
      primarySoft: '#d15c6a30',
      secondary: '#cf95e9',
      secondarySoft: '#cf95e97c',
      ...config.brand,
    },
  }
}

function lookup(vars, key) {
  return key.split('.').reduce((value, part) => (value == null ? undefined : value[part]), vars)
}

const unknownPlaceholders = new Set()

function fillPlaceholders(text, vars) {
  return text.replace(/\{\{([a-zA-Z][\w.]*)\}\}/g, (match, key) => {
    const value = lookup(vars, key)
    if (value === undefined || typeof value === 'object') {
      unknownPlaceholders.add(key)
      return match
    }
    return String(value)
  })
}

function conditionHolds(expression, active) {
  return expression.split('|').some((term) => {
    const negated = term.startsWith('!')
    const id = negated ? term.slice(1) : term
    return negated ? !active.has(id) : active.has(id)
  })
}

// Lines between a line containing `kit:if <ids>` and one containing `kit:end` are kept only when
// the condition holds; the marker lines are always removed. `<ids>` is `a|b|!c`.
function applyConditionals(text, active, file) {
  const output = []
  const stack = []
  for (const line of text.split('\n')) {
    const open = line.match(/kit:if\s+([!\w|-]+)/)
    if (open) {
      stack.push(conditionHolds(open[1], active))
      continue
    }
    if (/kit:end\b/.test(line)) {
      if (!stack.length) fail(`unbalanced kit:end in ${file}`)
      stack.pop()
      continue
    }
    if (stack.every(Boolean)) output.push(line)
  }
  if (stack.length) fail(`unclosed kit:if in ${file}`)
  return output.join('\n')
}

function render(text, vars, active, file) {
  return fillPlaceholders(applyConditionals(text, active, file), vars)
}

function deepMerge(base, extra) {
  if (Array.isArray(base) && Array.isArray(extra)) return [...new Set([...base, ...extra])]
  if (isPlainObject(base) && isPlainObject(extra)) {
    const merged = { ...base }
    for (const [key, value] of Object.entries(extra)) merged[key] = key in base ? deepMerge(base[key], value) : value
    return merged
  }
  return extra
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function walk(dir, base = dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full, base) : [path.relative(base, full)]
  })
}

function publishedPath(relative) {
  return relative
    .split(path.sep)
    .map((part) => (part.startsWith('_dot_') ? `.${part.slice(5)}` : part === '_gitignore' ? '.gitignore' : part))
    .join(path.sep)
}

// Each module renders into one side ("web" or "api"); "both" modules render into every side.
function sideDirs(target, modules) {
  const sides = new Set(modules.flatMap((module) => (module.side === 'both' ? [] : [module.side ?? 'web'])))
  if (sides.size === 0) sides.add('web')
  const split = sides.size > 1
  return new Map([...sides].map((side) => [side, split ? path.join(target, side) : target]))
}

function modulesFor(side, modules) {
  return modules.filter((module) => module.side === 'both' || (module.side ?? 'web') === side)
}

class Plan {
  constructor({ dryRun, force }) {
    this.files = new Map()
    this.dryRun = dryRun
    this.force = force
  }

  set(file, content, { overwrite = false } = {}) {
    this.files.set(file, { content, overwrite })
  }

  get(file) {
    if (this.files.has(file)) return this.files.get(file).content
    return fs.existsSync(file) ? fs.readFileSync(file) : undefined
  }

  commit(target) {
    const report = { written: [], skipped: [] }
    for (const [file, { content, overwrite }] of [...this.files].sort(([a], [b]) => a.localeCompare(b))) {
      const relative = path.relative(target, file) || path.basename(file)
      const exists = fs.existsSync(file)
      if (exists && !overwrite && !this.force) {
        report.skipped.push(relative)
        continue
      }
      report.written.push(`${exists ? 'update' : 'create'} ${relative}`)
      if (this.dryRun) continue
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, content)
    }
    return report
  }
}

function addTemplates(plan, dir, sideModules, vars, active) {
  let packageJson = null
  const gitignore = new Set()

  for (const module of sideModules) {
    const templateDir = path.join(module.dir, 'template')
    for (const relative of walk(templateDir)) {
      const source = path.join(templateDir, relative)
      const destination = path.join(dir, publishedPath(relative))
      if (BINARY.test(relative)) {
        plan.set(destination, fs.readFileSync(source))
        continue
      }
      const text = render(fs.readFileSync(source, 'utf8'), vars, active, source)
      const name = path.basename(destination)
      if (name === 'package.json' && path.dirname(destination) === dir) {
        packageJson = deepMerge(packageJson ?? {}, JSON.parse(text))
        continue
      }
      if (name === '.gitignore' && path.dirname(destination) === dir) {
        text.split('\n').filter(Boolean).forEach((line) => gitignore.add(line))
        continue
      }
      plan.set(destination, text)
    }
    for (const [when, extra] of Object.entries(module.packageWhen ?? {})) {
      if (conditionHolds(when, active)) packageJson = deepMerge(packageJson ?? {}, JSON.parse(render(JSON.stringify(extra), vars, active, module.id)))
    }
  }

  const todos = sideModules.flatMap((module) => module.ownerTodo ?? []).map((todo) => `- [ ] ${render(todo, vars, active, 'ownerTodo')}`)
  const todoFile = path.join(dir, 'docs', 'owner-todo.md')
  const todoText = plan.files.get(todoFile)?.content
  if (todos.length && typeof todoText === 'string') plan.set(todoFile, `${todoText.trimEnd()}\n${todos.join('\n')}\n`)

  if (packageJson) plan.set(path.join(dir, 'package.json'), `${JSON.stringify(sortPackageJson(packageJson), null, 2)}\n`)
  if (gitignore.size) plan.set(path.join(dir, '.gitignore'), `${[...gitignore].join('\n')}\n`)
}

function sortPackageJson(pkg) {
  for (const key of ['dependencies', 'devDependencies']) {
    if (pkg[key]) pkg[key] = Object.fromEntries(Object.entries(pkg[key]).sort(([a], [b]) => a.localeCompare(b)))
  }
  return pkg
}

function readFragment(module, name, vars, active) {
  const file = path.join(module.dir, name)
  if (!fs.existsSync(file)) return null
  return render(fs.readFileSync(file, 'utf8'), vars, active, file).trim()
}

const BLOCK = /<!-- kit:([\w.-]+) -->\n[\s\S]*?\n<!-- \/kit:\1 -->/g

function block(id, body) {
  return `<!-- kit:${id} -->\n${body}\n<!-- /kit:${id} -->`
}

// Replaces kit blocks in place, appends new ones, and keeps everything outside the markers.
function mergeBlocks(existing, blocks, { prune }) {
  if (!existing) return null
  const wanted = new Map(blocks)
  const seen = new Set()
  let text = existing.replace(BLOCK, (match, id) => {
    seen.add(id)
    if (wanted.has(id)) return block(id, wanted.get(id))
    return prune ? '' : match
  })
  const missing = blocks.filter(([id]) => !seen.has(id))
  if (missing.length) text = `${text.trimEnd()}\n\n${missing.map(([id, body]) => block(id, body)).join('\n\n')}\n`
  return text.replace(/\n{3,}/g, '\n\n')
}

function projectHeader(vars, fileTitle) {
  const summary = vars.description ? `${vars.title}: ${vars.description}` : vars.title
  return `# ${fileTitle}\n\n## Project\n\n${summary}\n\nWrite project-specific notes here, outside the \`kit:\` blocks. Blocks between \`<!-- kit:… -->\` markers are generated by agent-kit (\`/kit:adopt\` regenerates them); change those in the kit, or with \`/kit:learn\`.\n`
}

function contextFiles(plan, dir, sideModules, vars, active, options) {
  const rules = []
  const claudeOnly = []
  const agentsOnly = []
  for (const module of sideModules) {
    const shared = readFragment(module, 'rules.md', vars, active)
    const claude = readFragment(module, 'claude.md', vars, active)
    const agents = readFragment(module, 'agents.md', vars, active)
    if (shared) rules.push([module.id, shared])
    if (claude) claudeOnly.push([`${module.id}.claude`, claude])
    if (agents) agentsOnly.push([`${module.id}.agents`, agents])
  }

  const claudeFile = path.join(dir, 'CLAUDE.md')
  const agentsFile = path.join(dir, 'AGENTS.md')

  if (vars.agentsMd) {
    const agentsBlocks = [...rules, ...agentsOnly]
    const claudeBlocks = [['import', 'Shared rules for every agent live in AGENTS.md:\n\n@AGENTS.md'], ...claudeOnly]
    writeBlocks(plan, agentsFile, agentsBlocks, projectHeader(vars, 'AGENTS.md'), options)
    writeBlocks(plan, claudeFile, claudeBlocks, '# CLAUDE.md\n\nProject notes and shared rules are in AGENTS.md (imported below). This file adds what is specific to Claude Code.\n', options)
    return
  }
  writeBlocks(plan, claudeFile, [...rules, ...claudeOnly], projectHeader(vars, 'CLAUDE.md'), options)
}

function writeBlocks(plan, file, blocks, header, options) {
  const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
  const merged = mergeBlocks(existing, blocks, options)
  const content = merged ?? `${header}\n${blocks.map(([id, body]) => block(id, body)).join('\n\n')}\n`
  plan.set(file, content, { overwrite: true })
}

function settingsFiles(plan, dir, sideModules, vars) {
  const settingsFile = path.join(dir, '.claude', 'settings.json')
  const settings = readJson(settingsFile, {})
  const plugins = [...new Set(sideModules.flatMap((module) => module.plugins))]
  const enabled = Object.fromEntries(plugins.map((plugin) => [`${plugin}@${MARKETPLACE}`, true]))
  const marketplace = vars.marketplace ?? { source: 'github', repo: 'joaolfern/agent-kit' }
  const next = deepMerge(settings, {
    enabledPlugins: { ...enabled, [`kit@${MARKETPLACE}`]: true },
  })
  next.extraKnownMarketplaces = { ...settings.extraKnownMarketplaces, [MARKETPLACE]: { source: marketplace } }
  plan.set(settingsFile, `${JSON.stringify(next, null, 2)}\n`, { overwrite: true })

  const servers = sideModules.reduce((all, module) => ({ ...all, ...module.mcp }), {})
  if (Object.keys(servers).length) {
    const mcpFile = path.join(dir, '.mcp.json')
    const mcp = readJson(mcpFile, {})
    plan.set(mcpFile, `${JSON.stringify(deepMerge(mcp, { mcpServers: servers }), null, 2)}\n`, { overwrite: true })
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const vars = withDefaults(readJson(options.configPath) ?? fail(`no config at ${options.configPath}`))
  const modules = resolveModules(vars.modules ?? [], loadModules())
  const active = new Set(modules.map((module) => module.id))
  const plan = new Plan(options)
  const sides = sideDirs(options.target, modules)

  for (const [side, dir] of sides) {
    const sideModules = modulesFor(side, modules)
    const sideVars = { ...vars, side, sides: Object.fromEntries([...sides.keys()].map((key) => [key, true])) }
    if (!options.contextOnly) addTemplates(plan, dir, sideModules, sideVars, active)
    contextFiles(plan, dir, sideModules, sideVars, active, options)
    settingsFiles(plan, dir, sideModules, sideVars)
    const kitConfig = { ...readJson(options.configPath), side, modules: sideModules.map((module) => module.id) }
    plan.set(path.join(dir, '.claude', 'kit.json'), `${JSON.stringify(kitConfig, null, 2)}\n`, { overwrite: true })
  }

  const report = plan.commit(options.target)
  console.log(JSON.stringify({
    dryRun: options.dryRun,
    target: options.target,
    modules: modules.map((module) => module.id),
    sides: Object.fromEntries([...sides].map(([side, dir]) => [side, path.relative(options.target, dir) || '.'])),
    ...report,
    unknownPlaceholders: [...unknownPlaceholders],
  }, null, 2))
}

main()
