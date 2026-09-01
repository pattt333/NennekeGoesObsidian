#!/usr/bin/env node

const { spawnSync } = require('node:child_process')

const [, , command] = process.argv
const testArgs = ['-m', 'unittest', 'scripts/test_nenneke_v2_pipeline.py']
const pipelineArgs = ['scripts/nenneke_v2_pipeline.py', command]
const targetArgs = command === 'test' ? testArgs : pipelineArgs
const candidates = [
  process.env.NENNEKE_PYTHON,
  process.platform === 'win32' ? 'py' : null,
  'python3',
  'python',
].filter(Boolean)

for (const candidate of candidates) {
  const args = candidate === 'py' ? ['-3', ...targetArgs] : targetArgs
  const result = spawnSync(candidate, args, { stdio: 'inherit' })
  if (!result.error || result.error.code !== 'ENOENT') {
    process.exit(result.status ?? 1)
  }
}

console.error('Python 3.11+ is required. Install it or set NENNEKE_PYTHON to the interpreter path.')
process.exit(1)
