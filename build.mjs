import solidPlugin from '@opentui/solid/bun-plugin'

const result = await Bun.build({
  entrypoints: ['./src/index.tsx'],
  outdir: './dist',
  target: 'bun',
  format: 'esm',
  minify: false,
  sourcemap: 'external',
  naming: { entry: 'index.js' },
  external: [
    'solid-js',
    '@opentui/solid',
    '@opentui/core',
    '@opentui/keymap',
  ],
  plugins: [solidPlugin],
})

if (!result.success) {
  for (const message of result.logs) console.error(message)
  console.error('\nBuild failed.')
  process.exit(1)
}

console.log('Build succeeded. Output:')
for (const output of result.outputs) {
  console.log(`  ${output.path} (${(output.size / 1024).toFixed(1)} KB)`)
}

