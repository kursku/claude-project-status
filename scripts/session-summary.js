#!/usr/bin/env node
// session-summary.js — Hook Stop handler
// Detects sessions with file edits and marks the project for status update

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

let input = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', chunk => { input += chunk })
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input)
    const cwd = data.cwd || ''
    if (!cwd) process.exit(0)

    const claudeMd = path.join(cwd, 'CLAUDE.md')
    if (!fs.existsSync(claudeMd)) process.exit(0)

    const content = fs.readFileSync(claudeMd, 'utf8')
    if (!content.includes('<!-- STATUS')) process.exit(0)

    // Check if session had edits
    const transcript = data.transcript_path || ''
    if (transcript && fs.existsSync(transcript)) {
      const t = fs.readFileSync(transcript, 'utf8')
      const hasEdits = t.includes('"Edit"') || t.includes('"Write"')
      if (!hasEdits) process.exit(0)
    }

    // Mark project as pending update
    const pendingDir = path.join(os.homedir(), '.claude', 'pending-updates')
    fs.mkdirSync(pendingDir, { recursive: true })

    const projectName = path.basename(cwd)
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')

    fs.writeFileSync(
      path.join(pendingDir, `${projectName}.json`),
      JSON.stringify({ project: projectName, path: cwd, timestamp: now }, null, 2)
    )
  } catch { /* silent */ }
})
