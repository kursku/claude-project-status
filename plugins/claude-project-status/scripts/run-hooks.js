#!/usr/bin/env node
// run-hooks.js — Runs user-configured post-update hooks
// Config: ~/.project-status.json → "hooks": { "post-update": ["cmd1", "cmd2"] }

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const event = process.argv[2] || 'post-update'
const configPath = path.join(os.homedir(), '.project-status.json')

try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  const hooks = config.hooks?.[event] || []

  for (const cmd of hooks) {
    console.log(`  → ${cmd}`)
    try {
      execSync(cmd, { stdio: 'inherit', timeout: 30000, cwd: process.cwd() })
    } catch (e) {
      console.log(`  ⚠ Hook failed: ${e.message}`)
    }
  }
} catch {
  // No config or no hooks — silent exit
}
