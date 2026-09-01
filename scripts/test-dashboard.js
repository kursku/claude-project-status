#!/usr/bin/env node
// test-dashboard.js — smoke tests for generate-dashboard.js (no framework)

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getConfig, findProjects, parseStatusBlock } from './generate-dashboard.js'

const STATUS_BLOCK = (projeto) => `<!-- STATUS
projeto: ${projeto}
fase: dev
prioridade: alta
ultima_sessao: 2026-08-29
proximas_tarefas:
  - fazer coisa
-->
`

const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'dashboard-test-'))
const hubDir = path.join(tmpBase, 'hub')
const projADir = path.join(hubDir, 'projA')
const projBDir = path.join(tmpBase, 'projB')

fs.mkdirSync(projADir, { recursive: true })
fs.mkdirSync(projBDir, { recursive: true })
fs.writeFileSync(path.join(projADir, 'CLAUDE.md'), STATUS_BLOCK('projA'))
fs.writeFileSync(path.join(projBDir, 'CLAUDE.md'), STATUS_BLOCK('projB'))

// depth 1: only projB (root-level), hub/projA is one level too deep
const depth1 = findProjects([tmpBase], 1)
assert.equal(depth1.length, 1)
assert.equal(depth1[0].folder, 'projB')

// depth 2: both projA (nested in hub) and projB
const depth2 = findProjects([tmpBase], 2)
const folders = depth2.map(p => p.folder).sort()
assert.deepEqual(folders, ['projA', 'projB'])

// parseStatusBlock sanity
const parsed = parseStatusBlock(STATUS_BLOCK('projA'))
assert.equal(parsed.projeto, 'projA')
assert.equal(parsed.prioridade, 'alta')
assert.deepEqual(parsed.proximas_tarefas, ['fazer coisa'])

// ~ expansion in scanDirs
const configPath = path.join(os.homedir(), '.project-status.json')
const hadConfig = fs.existsSync(configPath)
const originalConfig = hadConfig ? fs.readFileSync(configPath, 'utf8') : null

fs.writeFileSync(configPath, JSON.stringify({ scanDirs: ['~', '~/subdir'] }))
try {
  const config = getConfig()
  assert.equal(config.scanDirs[0], os.homedir())
  assert.equal(config.scanDirs[1], path.join(os.homedir(), 'subdir'))
  assert.equal(config.scanDepth, 1)
} finally {
  if (hadConfig) fs.writeFileSync(configPath, originalConfig)
  else fs.rmSync(configPath, { force: true })
}

fs.rmSync(tmpBase, { recursive: true, force: true })

console.log('✅ all dashboard tests passed')
