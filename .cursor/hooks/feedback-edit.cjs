#!/usr/bin/env node
'use strict'

const { existsSync } = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

let raw = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', (chunk) => {
  raw += chunk
})
process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(raw)
    const filePath =
      typeof payload.file_path === 'string'
        ? payload.file_path
        : typeof payload.filePath === 'string'
          ? payload.filePath
          : ''

    if (!filePath || !/\.(?:[cm]?[jt]sx?|jsonc?)$/i.test(filePath)) {
      finish()
      return
    }

    const workspace =
      Array.isArray(payload.workspace_roots) && typeof payload.workspace_roots[0] === 'string'
        ? payload.workspace_roots[0]
        : process.cwd()
    const root = path.resolve(workspace)
    const target = path.resolve(root, filePath)
    const relative = path.relative(root, target)

    if (relative.startsWith('..') || path.isAbsolute(relative) || !existsSync(target)) {
      finish()
      return
    }

    const biome = path.join(
      root,
      'node_modules',
      '.bin',
      process.platform === 'win32' ? 'biome.cmd' : 'biome'
    )
    if (!existsSync(biome)) {
      finish()
      return
    }

    const result = spawnSync(biome, ['check', '--write', target], {
      cwd: root,
      encoding: 'utf8',
      timeout: 4000
    })

    if (result.stdout) process.stderr.write(result.stdout)
    if (result.stderr) process.stderr.write(result.stderr)
  } catch {
    // Feedback hooks are advisory. CI and orb check remain authoritative.
  }

  finish()
})

function finish() {
  process.stdout.write('{}\n')
}
