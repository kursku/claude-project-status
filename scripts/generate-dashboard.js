#!/usr/bin/env node
// generate-dashboard.js — Cross-platform dashboard generator
// Scans directories for CLAUDE.md files with STATUS blocks and generates ~/PROJECTS.md

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const HOME = os.homedir()
const OUTPUT = path.join(HOME, 'PROJECTS.md')

function getConfig() {
  const configPath = path.join(HOME, '.project-status.json')
  const defaults = { scanDirs: [HOME] }
  try {
    const raw = fs.readFileSync(configPath, 'utf8')
    return { ...defaults, ...JSON.parse(raw) }
  } catch {
    return defaults
  }
}

function parseStatusBlock(content) {
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

function findProjects(scanDirs) {
  const projects = []

  for (const baseDir of scanDirs) {
    if (!fs.existsSync(baseDir)) continue

    let entries
    try { entries = fs.readdirSync(baseDir, { withFileTypes: true }) } catch { continue }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue

      const claudeMd = path.join(baseDir, entry.name, 'CLAUDE.md')
      if (!fs.existsSync(claudeMd)) continue

      try {
        const content = fs.readFileSync(claudeMd, 'utf8')
        const status = parseStatusBlock(content)
        if (!status) continue

        projects.push({
          ...status,
          path: path.join(baseDir, entry.name),
          folder: entry.name
        })
      } catch { /* skip unreadable */ }
    }
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
  const projects = findProjects(config.scanDirs)

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

generate()
