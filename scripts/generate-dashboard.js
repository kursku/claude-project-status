#!/usr/bin/env node
// generate-dashboard.js — Cross-platform dashboard generator
// Scans directories for CLAUDE.md files with STATUS blocks and generates ~/PROJECTS.md

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const HOME = os.homedir()
const OUTPUT = path.join(HOME, 'PROJECTS.md')

function expandHome(dir) {
  if (dir === '~') return HOME
  if (dir.startsWith('~/') || dir.startsWith('~\\')) return path.join(HOME, dir.slice(2))
  return dir
}

export function getConfig() {
  const configPath = path.join(HOME, '.project-status.json')
  const defaults = { scanDirs: [HOME], scanDepth: 1 }
  let config = defaults
  try {
    const raw = fs.readFileSync(configPath, 'utf8')
    config = { ...defaults, ...JSON.parse(raw) }
  } catch { /* use defaults */ }

  return { ...config, scanDirs: config.scanDirs.map(expandHome) }
}

export function parseStatusBlock(content) {
  const match = content.match(/<!--\s*STATUS\s*\n([\s\S]*?)-->/)
  if (!match) return null

  const block = match[1]
  const get = (key) => {
    const m = block.match(new RegExp(`^${key}:\s*(.+)`, 'm'))
    return m ? m[1].trim() : ''
  }

  const tasksMatch = block.match(/proximas_tarefas:\s*\n((?:\s+-\s+.+\n?)+)/)
  const tasks = tasksMatch
    ? tasksMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^\s*-\s*/, '').trim())
    : []

  return {
    projeto: get('projeto'),
    fase: get('fase'),
    prioridade: get('prioridade'),
    ultima_decisao: get('ultima_decisao'),
    ultima_sessao: get('ultima_sessao'),
    proximas_tarefas: tasks
  }
}

const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '__pycache__'])

function scanDir(dir, depth, projects) {
  let entries
  try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) continue

    const entryPath = path.join(dir, entry.name)
    const claudeMd = path.join(entryPath, 'CLAUDE.md')

    if (fs.existsSync(claudeMd)) {
      try {
        const content = fs.readFileSync(claudeMd, 'utf8')
        const status = parseStatusBlock(content)
        if (status) projects.push({ ...status, path: entryPath, folder: entry.name })
      } catch { /* skip unreadable */ }
    }

    if (depth > 1) scanDir(entryPath, depth - 1, projects)
  }
}

export function findProjects(scanDirs, scanDepth = 1) {
  const projects = []

  for (const baseDir of scanDirs) {
    if (!fs.existsSync(baseDir)) continue
    scanDir(baseDir, scanDepth, projects)
  }

  return projects
}

function prioLabel(p) {
  switch ((p || '').toLowerCase()) {
    case 'alta': return '🔴 alta'
    case 'média': case 'media': return '🟡 média'
    case 'baixa': return '🟢 baixa'
    default: return `⚪ ${p || 'indefinida'}`
  }
}

function prioOrder(p) {
  switch ((p || '').toLowerCase()) {
    case 'alta': return 0
    case 'média': case 'media': return 1
    case 'baixa': return 2
    default: return 3
  }
}

function generate() {
  const config = getConfig()
  const projects = findProjects(config.scanDirs, config.scanDepth)

  projects.sort((a, b) => prioOrder(a.prioridade) - prioOrder(b.prioridade))

  const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
  let out = `# Projects Dashboard\n_Updated: ${now}_\n\n---\n\n`

  for (const p of projects) {
    out += `## ${p.projeto || p.folder} — ${prioLabel(p.prioridade)}\n`
    if (p.fase) out += `**Phase:** ${p.fase}\n`
    if (p.ultima_sessao) out += `**Last session:** ${p.ultima_sessao}\n`
    if (p.ultima_decisao) out += `**Last decision:** ${p.ultima_decisao}\n`
    if (p.proximas_tarefas.length > 0) {
      out += `**Next tasks:**\n`
      for (const t of p.proximas_tarefas) out += `- ${t}\n`
    }
    out += '\n'
  }

  out += `---\n\n## Priorities\n_Awaiting analysis — run \`/prioritize\` for updated suggestions._\n`

  fs.writeFileSync(OUTPUT, out, 'utf8')
  console.log(`✅ Dashboard generated: ${OUTPUT} (${projects.length} projects)`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.dirname, 'generate-dashboard.js')) {
  generate()
}
